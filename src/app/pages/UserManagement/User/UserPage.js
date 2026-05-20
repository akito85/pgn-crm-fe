import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Alert, Form, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import {
  donwloadedExcel,
  forwardTaskUser,
  getAllUserPaginate,
  inactiveUser,
} from "../../../../redux/slices/user_management/user";
import PendingTaskLayout from "./PendingTaskLayout";
import SVGIcon from "../../../../assets/Icon/index";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconGenerateLink from "../../../../assets/Icon/Nx/IconGenerateLink";
import IconPower from "../../../../assets/Icon/Nx/IconPower";
import InputComponent from "../../../../components/InputComponent";
import { formMessageRequired, hasValue } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { clearBodyMessage, hideModalError } from "../../../../redux/slices/general_slice";
import { TableUser, columnsUser } from "./TableUser";

const OPERATOR_SELECTOR_MAP = {
  "Contains": "LIKE",
  "Equal to": "EQUALS",
  "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN",
  "Less than": "LESS_THAN",
  "Is empty": "IS_NULL",
  "Is not empty": "IS_NOT_NULL",
};

const UserPage = () => {
  const dispatch = useDispatch();
  const { data_status } = useSelector((state) => state.user);
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

  // Pagination & filter state
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Local data state
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Activate/inactivate modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [activate, setActivate] = useState(false);
  const [record, setRecord] = useState({});
  const [body, setBody] = useState({});
  const [form] = Form.useForm();

  // Refs for safe access inside callbacks
  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  const buildSearch = useCallback((basicSearch, advSearch) => {
    let combined = { ...basicSearch };
    const applyFilter = (f) => {
      if (!f.column) return;
      const selector = OPERATOR_SELECTOR_MAP[f.operator] || "LIKE";
      const isNullOp = selector === "IS_NULL" || selector === "IS_NOT_NULL";
      if (isNullOp) {
        combined[f.column] = `~${selector}`;
      } else if (f.value) {
        combined[f.column] = `${f.value}~${selector}`;
      }
    };
    if (advSearch?.filters) {
      advSearch.filters.forEach(applyFilter);
    }
    if (advSearch?.filterRules) {
      advSearch.filterRules.forEach((rule) => rule.filters.forEach(applyFilter));
    }
    return encodeURIComponent(JSON.stringify(combined));
  }, []);

  const fetchPage = useCallback(
    async (page, replace = false, signal = null) => {
      if (isFetchingRef.current) return;
      if (signal?.aborted) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const reqSearch = buildSearch(search, advancedSearch);
        const result = await dispatch(
          getAllUserPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
  }, [search, advancedSearch, sort, pageSize]); // intentionally exclude fetchPage

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

  const handleCancel = () => {
    setOpenModal(false);
    setOpenModalError(false);
    form.resetFields();
  };

  const handleDownload = useCallback(() => {
    dispatch(
      donwloadedExcel({
        search: encodeURIComponent(JSON.stringify(search)),
        page: pageRef.current + 1,
        pageSize,
        sort,
      })
    );
  }, [dispatch, search, pageSize, sort]);

  const onFinish = async (formValue) => {
    try {
      const bodyData = { userId: selectedUserId, ...formValue, activate };
      setBody(bodyData);
      handleCancel();
      await dispatch(inactiveUser(bodyData))?.unwrap();
      const signal = { aborted: false };
      pageRef.current = 0;
      setAllData([]);
      setHasMore(false);
      setIsLoading(true);
      fetchPage(0, true, signal);
    } catch (error) {
      if (hasValue(error?.code) && error?.data?.length !== 0) {
        dispatch(clearBodyMessage());
        dispatch(hideModalError());
        setActivate("INACTIVE");
        setOpenModalError(true);
      }
    }
  };

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "GET_ALL_EMPLOYEE_PAGINATE") {
      const signal = { aborted: false };
      pageRef.current = 0;
      setAllData([]);
      setHasMore(false);
      setIsLoading(true);
      fetchPage(0, true, signal);
    } else if (bodyError?.action === "DOWNLOAD_USER_EXCEL") {
      handleDownload();
    } else if (bodyError?.action === "FORWARD_TASK_USER") {
      dispatch(forwardTaskUser(body));
    } else {
      dispatch(inactiveUser(body));
    }
  };

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);

  const routes = [
    { path: "", breadcrumbName: "User Management" },
    { path: USER_ROUTES.VIEW_USER, breadcrumbName: "User" },
  ];

  const itemActions = useMemo(() => [
    // Toolbar actions
    {
      action: "Change",
      render: (
        <NavLink to={USER_ROUTES?.CHANGE_AUTH}>
          <ButtonComponent
            type="submit"
            icon={<SVGIcon name="IconRevers" width={24} color="#FFFFFF" />}
          >
            Change Auth Type
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink to={USER_ROUTES?.UPLOAD_USER}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
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
        <NavLink to={USER_ROUTES?.CREATE_USER}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create User
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Table column actions
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <Link
            to={USER_ROUTES.DETAIL_USER}
            state={{ id: record?.userCode }}
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
            to={record?.status === "ACTIVE" ? USER_ROUTES.UPDATE_USER : undefined}
            state={record?.status === "ACTIVE" ? { id: record?.userCode } : undefined}
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
      action: "Generate",
      type: "table",
      render: (record) => (
        <Tooltip title="Generate Link Password">
          <Link
            to={
              record?.status === "ACTIVE" && record.authType !== "LDAP"
                ? USER_ROUTES.GENERATE_PASSWORD
                : undefined
            }
            state={
              record?.status === "ACTIVE" && record.authType !== "LDAP"
                ? { id: record?.userId }
                : undefined
            }
          >
            <ButtonComponent
              icon={
                <IconGenerateLink
                  color={
                    record?.status === "ACTIVE" && record.authType !== "LDAP"
                      ? "#1976D2"
                      : "#C0BEC6"
                  }
                />
              }
              border={false}
              disabled={!(record?.status === "ACTIVE" && record.authType !== "LDAP")}
            />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "Activate",
      type: "table",
      render: (record) => (
        <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
          <ButtonComponent
            icon={
              <IconPower
                color={record?.status === "ACTIVE" ? "#1976D2" : "#C0BEC6"}
              />
            }
            border={false}
            onClick={() => {
              setOpenModal(true);
              setSelectedUserId(record?.userId);
              setActivate(record?.status);
              setRecord(record);
            }}
          />
        </Tooltip>
      ),
    },
  ], [handleDownload]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="USER LIST" className="mt-4" actions={itemActions}>
        <div className="w-full">
          <TableUser
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
            columnDefinitions={columnsUser}
            userId={userId}
          />
        </div>
      </NxCardContainer>

      {/* Activate / Inactivate confirmation modal */}
      <ModalCustom
        isOpen={openModal}
        handleCancel={handleCancel}
        type="confirmation"
        header={activate === "INACTIVE" ? "Active Information" : "Inactive Information"}
        width={1000}
      >
        <div className="w-full justify-center my-4 flex flex-col text-sm">
          <Alert
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            message={`Are you sure you want to ${
              activate === "INACTIVE" ? "activate" : "inactivate"
            } user named ${record?.username}?`}
            type="warning"
            showIcon
            className="alert-icon"
          />
          <div className="mt-4">
            <Form form={form} layout="vertical" className="mt-3" onFinish={onFinish}>
              <Form.Item
                name="remark"
                rules={formMessageRequired("remark")}
                label="Remark"
              >
                <InputComponent type="textarea" rows={1} placeholder="Type your remark" />
              </Form.Item>
              <div className="w-full flex justify-end gap-2">
                <Form.Item>
                  <ButtonComponent type="default" onClick={handleCancel} border={true}>
                    Cancel
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent type="submit" htmlType="submit" border={false}>
                    Confirm
                  </ButtonComponent>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </ModalCustom>

      {/* Pending task modal — shown when inactivate has pending tasks */}
      <ModalCustom
        isOpen={openModalError}
        handleCancel={handleCancel}
        type="confirmation"
        header={activate === "INACTIVE" ? "Inactive Information" : "Confirmation"}
        width={1000}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Link
              to={USER_ROUTES.FORWARD_TASK}
              state={
                Array.isArray(data_status?.data) && {
                  id: data_status?.data[0]?.employeeCode,
                }
              }
            >
              <ButtonComponent type="submit">Forward Task</ButtonComponent>
            </Link>
            <ButtonComponent type="default" onClick={handleCancel} border={true}>
              Cancel
            </ButtonComponent>
          </div>
        }
      >
        <PendingTaskLayout
          typeLayout="pending"
          data={{ dataTable: data_status?.data }}
          isOpen={openModalError}
        />
      </ModalCustom>

      {renderModal()}
    </>
  );
};

export default UserPage;
