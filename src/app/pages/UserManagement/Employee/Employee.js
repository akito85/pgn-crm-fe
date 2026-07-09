import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Form } from "antd";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import Toolbar from "../../../../components/Toolbar";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployeePaginate,
  terminateEmployee,
  downloadEmployee,
} from "../../../../redux/slices/user_management/employee";
import { TableEmployee, columnsEmployee } from "./TableEmployee";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import PendingTaskLayout from "../User/PendingTaskLayout";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { dateFormatting, formMessageRequired, hasValue } from "../../../../utils";
import { clearBodyMessage, hideModalError } from "../../../../redux/slices/general_slice";
import moment from "moment";

const Employee = () => {
  const navigate = useNavigate();
  const { data_status } = useSelector((state) => state.employee);
  const { bodyError } = useSelector((state) => state?.general);
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch {
      return null;
    }
  }, [rawToken]);

  const dispatch = useDispatch();

  // Pagination & filter state
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchText, setSearchText] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Column-level filter state
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [columnSearchText, setColumnSearchText] = useState("");

  // Local data state — avoids the stale Redux data / spinner flash
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Local loading flag — cleared AFTER setAllData so no spinner-gone/empty-table flash
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Terminate modal state
  const [modalTerm, setModalTerm] = useState(false);
  const [empId, setEmpId] = useState("");
  const [openPending, setOpenPending] = useState(false);
  const [body, setBody] = useState({});
  const [form] = Form.useForm();

  // Refs for safe access inside callbacks without stale closures
  const pageRef = useRef(0); // 0-based internal; API receives page + 1 (employee API is 1-based)
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  // Fetch a single page and append (replace=true) or append to allData.
  // The signal object lets the caller cancel a stale fetch without disrupting
  // isFetchingRef, so the guard stays coherent across StrictMode double-mounts
  // and rapid filter changes.
  const fetchPage = useCallback(
    async (page, replace = false, signal = null) => {
      if (isFetchingRef.current) return;
      if (signal?.aborted) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const result = await dispatch(
          getAllEmployeePaginate({
            page: page + 1, // employee API is 1-based
            pageSize,
            sort,
            search,
            searchText,
            filters: advancedSearch?.filters ?? [],
            filterRules: advancedSearch?.filterRules ?? [],
          })
        ).unwrap();
        if (signal?.aborted) return;
        const rows = result?.result ?? [];
        const pageInfo = result?.page ?? {};
        const nextHasMore = page < (pageInfo.totalPages ?? 0) - 1;
        setAllData((prev) => (replace ? rows : [...prev, ...rows]));
        setTotalElements(pageInfo.totalElements ?? 0);
        setHasMore(nextHasMore);
        hasMoreRef.current = nextHasMore;
        pageRef.current = page;
      } catch (e) {
        if (!signal?.aborted) console.error("fetchPage error", e);
      } finally {
        isFetchingRef.current = false;
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [search, searchText, advancedSearch, sort, pageSize, dispatch]
  );

  // Initial load and reload on filter / sort / pageSize change.
  // Signal is aborted on cleanup to discard stale results.
  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
    return () => {
      signal.aborted = true;
      isFetchingRef.current = false;
    };
  }, [search, searchText, advancedSearch, sort, pageSize]); // intentionally exclude fetchPage to avoid loop

  const handleChange = (_, pageSizeChange) => {
    setPageSize(pageSizeChange);
  };

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onAdvanceSearch = (searchData) => {
    setAdvancedSearch(searchData);
  };

  const handleSearchBar = useCallback((value) => {
    setSearchText(value || "");
  }, []);

  const handleColumnSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setColumnSearchText(selectedKeys[0] || "");
    setSearchedColumn(dataIndex);
    setSearch((prev) => {
      const next = { ...prev };
      if (selectedKeys[0]) {
        next[dataIndex] = selectedKeys[0];
      } else {
        delete next[dataIndex];
      }
      return next;
    });
  }, []);

  const handleCancelTerminate = () => {
    form.resetFields();
    setModalTerm(false);
  };

  const onFinish = async (formValue) => {
    const bodyData = {
      ...formValue,
      employeeId: empId,
      executionDate: formValue?.executionDate?.format(dateFormatting?.dateTime),
    };
    setBody(bodyData);
    handleCancelTerminate();
    await dispatch(terminateEmployee(bodyData))
      .unwrap()
      .then(() => {
        handleRefresh();
      })
      .catch((e) => {
        if (hasValue(e?.data) && e?.data?.data?.length > 0) {
          dispatch(clearBodyMessage());
          dispatch(hideModalError());
          setOpenPending(true);
        }
      });
  };

  const handleRefresh = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await dispatch(downloadEmployee({
        page: 0,
        pageSize,
        sort,
        search,
        searchText,
        filters: advancedSearch?.filters ?? [],
        filterRules: advancedSearch?.filterRules ?? [],
      })).unwrap();
    } catch {
      // errors are already surfaced via validateError in the thunk
    } finally {
      setIsDownloading(false);
    }
  }, [search, searchText, advancedSearch, pageSize, sort, dispatch]);

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "GET_ALL_EMPLOYEE_PAGINATE") {
        handleRefresh();
      } else {
        dispatch(terminateEmployee(body));
      }
    } catch {
      handleRefresh();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  const routes = [
    { path: "", breadcrumbName: "User Management" },
    { path: "", breadcrumbName: "Employee" },
  ];

  const itemActions = useMemo(() => nxGetAccountActions({
    handleCreate: () => navigate(USER_ROUTES.CREATE_EMPLOYEE),
    handleView: (record) =>
      navigate(USER_ROUTES.DETAIL_EMPLOYEE, { state: { id: record?.employeeCode } }),
    handleUpdate: (record) =>
      navigate(USER_ROUTES.UPDATE_EMPLOYEE, { state: { id: record?.employeeCode } }),
    handleDownload,
    loadingDownload: isDownloading,
    handleUpload: () => navigate(USER_ROUTES.UPLOAD_EMPLOYEE),
    handleForwardTask: () => navigate(USER_ROUTES.FORWARD_TASK),
    handleTerminate: (record) => {
      setEmpId(record?.employeeId);
      setModalTerm(true);
    }
  }), [navigate, handleDownload, isDownloading]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="EMPLOYEE LIST" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemActions} type="page" />
          <TableEmployee
            dataSource={allData}
            loading={isLoading}
            totalData={totalElements}
            current={pageRef.current + 1}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            onAdvanceSearch={onAdvanceSearch}
            onSearch={handleSearchBar}
            onRefresh={handleRefresh}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            itemActions={itemActions}
            columnDefinitions={columnsEmployee}
            userId={userId}
            search={search}
            searchInput={searchInput}
            searchedColumn={searchedColumn}
            columnSearchText={columnSearchText}
            handleColumnSearch={handleColumnSearch}
          />
        </div>
      </NxCardContainer>

      {/* Terminate modal */}
      <ModalCustom
        isOpen={modalTerm}
        handleCancel={handleCancelTerminate}
        header="TERMINATE INFORMATION"
        type="confirmation"
        width={800}
      >
        <div className="w-full modalTerminate">
          <Alert
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            message="Are you sure want to terminate this Employee?"
            description="If you terminate this employee, the user with this employee will be inactived."
            type="warning"
            showIcon
          />
        </div>
        <div className="mt-4">
          <Form form={form} layout="vertical" className="mt-3" onFinish={onFinish}>
            <Form.Item
              label="Remark"
              name="remark"
              rules={formMessageRequired("remark")}
            >
              <InputComponent rows={1} type="textarea" />
            </Form.Item>
            <Form.Item label="Execution Date" name="executionDate">
              <DateComponent>
                {moment(form.getFieldValue("executionDate")).format()}
              </DateComponent>
            </Form.Item>
            <div className="flex mt-4 w-full justify-end gap-5">
              <ButtonComponent type="default" onClick={handleCancelTerminate}>
                Cancel
              </ButtonComponent>
              <ButtonComponent type="submit" htmlType="submit">
                Confirm
              </ButtonComponent>
            </div>
          </Form>
        </div>
      </ModalCustom>

      {/* Pending task modal — shown after terminate when the employee has pending tasks */}
      <ModalCustom
        isOpen={openPending}
        handleCancel={() => setOpenPending(false)}
        type="confirmation"
        header="Terminate Information"
        width={900}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Link
              to={USER_ROUTES.FORWARD_TASK}
              state={
                Array.isArray(data_status?.data?.data) && {
                  id: data_status?.data?.data[0]?.employeeCode,
                }
              }
            >
              <ButtonComponent type="submit" border={true}>
                Forward Task
              </ButtonComponent>
            </Link>
            <ButtonComponent
              type="default"
              onClick={() => setOpenPending(false)}
              border={true}
            >
              Cancel
            </ButtonComponent>
          </div>
        }
      >
        <PendingTaskLayout
          typeLayout="pending"
          data={{ dataTable: data_status?.data?.data }}
        />
      </ModalCustom>

      {renderModal()}
    </>
  );
};

export default Employee;
