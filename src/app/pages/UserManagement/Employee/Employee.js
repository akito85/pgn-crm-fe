import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Form, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployeePaginate,
  terminateEmployee,
} from "../../../../redux/slices/user_management/employee";
import { TableEmployee, columnsEmployee } from "./TableEmployee";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconForwardTask from "../../../../assets/Icon/Nx/IconForwardTask";
import IconTerminate from "../../../../assets/Icon/Nx/IconTerminate";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import PendingTaskLayout from "../User/PendingTaskLayout";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { dateFormatting, formMessageRequired, hasValue } from "../../../../utils";
import { clearBodyMessage, hideModalError } from "../../../../redux/slices/general_slice";
import moment from "moment";

const Employee = () => {
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
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Local data state — avoids the stale Redux data / spinner flash
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Local loading flag — cleared AFTER setAllData so no spinner-gone/empty-table flash
  const [isLoading, setIsLoading] = useState(false);

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

  // Build combined search string from basic + advanced search
  const buildSearch = useCallback((basicSearch, advSearch) => {
    let combined = { ...basicSearch };
    if (advSearch?.filters) {
      advSearch.filters.forEach((f) => {
        if (f.column && f.value) combined[f.column] = f.value;
      });
    }
    if (advSearch?.filterRules) {
      advSearch.filterRules.forEach((rule) =>
        rule.filters.forEach((f) => {
          if (f.column && f.value) combined[f.column] = f.value;
        })
      );
    }
    return encodeURIComponent(JSON.stringify(combined));
  }, []);

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
        const reqSearch = buildSearch(search, advancedSearch);
        const result = await dispatch(
          getAllEmployeePaginate({
            page: page + 1, // employee API is 1-based
            pageSize,
            sort,
            search: reqSearch,
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
    [search, advancedSearch, sort, pageSize, dispatch, buildSearch]
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
  }, [search, advancedSearch, sort, pageSize]); // intentionally exclude fetchPage to avoid loop

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
        const signal = { aborted: false };
        pageRef.current = 0;
        setAllData([]);
        setHasMore(false);
        setIsLoading(true);
        fetchPage(0, true, signal);
      })
      .catch((e) => {
        if (hasValue(e?.data) && e?.data?.data?.length > 0) {
          dispatch(clearBodyMessage());
          dispatch(hideModalError());
          setOpenPending(true);
        }
      });
  };

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "GET_ALL_EMPLOYEE_PAGINATE") {
        const signal = { aborted: false };
        pageRef.current = 0;
        setAllData([]);
        setHasMore(false);
        setIsLoading(true);
        fetchPage(0, true, signal);
      } else {
        dispatch(terminateEmployee(body));
      }
    } catch {
      const signal = { aborted: false };
      fetchPage(0, true, signal);
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  const routes = [
    { path: "", breadcrumbName: "User Management" },
    { path: "", breadcrumbName: "Employee" },
  ];

  const itemActions = useMemo(() => [
    // Toolbar actions (no type: "table")
    {
      action: "Upload",
      render: (
        <NavLink to={USER_ROUTES.UPLOAD_EMPLOYEE}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "20px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={USER_ROUTES.CREATE_EMPLOYEE}>
          <ButtonComponent icon={<PlusOutlined />} type="submit">
            Create Employee
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Table column actions (type: "table" — permission-gated by useColumnActionPermission)
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <Link
            to={USER_ROUTES.DETAIL_EMPLOYEE}
            state={{ id: record?.employeeCode }}
            className="flex flex-col justify-center items-center"
          >
            <ViewListIcon />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record) => (
        <Tooltip title="Update">
          <Link
            to={record?.status === "ACTIVE" ? USER_ROUTES.UPDATE_EMPLOYEE : undefined}
            state={
              record?.status === "ACTIVE" ? { id: record?.employeeCode } : undefined
            }
          >
            <ButtonComponent
              icon={
                <IconEditNx
                  color={record?.status === "ACTIVE" ? "#1976D2" : "#C0BEC6"}
                />
              }
              border={false}
              disabled={record?.status !== "ACTIVE"}
            />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "forward",
      type: "table",
      render: (record) => (
        <Tooltip title="Forward Task">
          <Link
            to={record?.status === "ACTIVE" ? USER_ROUTES.FORWARD_TASK : undefined}
            state={
              record?.status === "ACTIVE" ? { id: record?.employeeCode } : undefined
            }
          >
            <ButtonComponent
              icon={
                <IconForwardTask
                  color={record?.status === "ACTIVE" ? "#1976D2" : "#C0BEC6"}
                />
              }
              border={false}
              disabled={record?.status !== "ACTIVE"}
            />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "terminate",
      type: "table",
      render: (record) => (
        <Tooltip title="Terminate">
          <ButtonComponent
            icon={
              <IconTerminate
                color={record?.status === "ACTIVE" ? "#BE3036" : "#C0BEC6"}
              />
            }
            border={false}
            disabled={record?.status !== "ACTIVE"}
            onClick={() => {
              if (record?.status === "ACTIVE") {
                setEmpId(record?.employeeId);
                setModalTerm(true);
              }
            }}
          />
        </Tooltip>
      ),
    },
  ], []);

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="EMPLOYEE LIST" className="mt-4" actions={itemActions}>
        <div className="w-full">
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
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            itemActions={itemActions}
            columnDefinitions={columnsEmployee}
            userId={userId}
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
