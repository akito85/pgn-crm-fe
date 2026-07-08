import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Tooltip } from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../../components/Nx/NxTable";
import Toolbar from "../../../../../components/Toolbar";
import {
  downloadMasterPosition,
  getDetailMasterPosition,
  getListMasterPosition,
  inactiveMasterPosition,
} from "../../../../../redux/slices/system_setup/master_data/master_position";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import PositionDetail from "./PositionDetail";
import IconViewList from "../../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../../assets/Icon/Nx/IconEdit";
import IconActive from "../../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../../assets/icons/nx/IconInactive";
import { renderColumn } from "../../../../../utils";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const PositionPage = () => {
  const dispatch = useDispatch();
  const { data_detail } = useSelector((state) => state.master_position);
  const { bodyError } = useSelector((state) => state?.general);

  // Pagination & filter state
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Column-level filter state
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // Local data state — avoids the stale Redux data / spinner flash
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Local loading flags — cleared AFTER setAllData so no spinner-gone/empty-table flash
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [positionId, setPositionId] = useState("");
  const [statusData, setStatusData] = useState("");
  const [record, setRecord] = useState({});
  const [body, setBody] = useState({});
  const [form] = Form.useForm();

  // Refs for safe access inside callbacks without stale closures
  const pageRef = useRef(0); // 0-based internal; API receives page + 1 (position API is 1-based)
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  const { data: dataUser = {} } = useSelector((state) => state.profile);

  // Fetch a single page and append (replace=true) or append to allData.
  // Mirrors Employee.js's fetchPage: the signal object lets the caller cancel a
  // stale fetch without disrupting isFetchingRef, so the guard stays coherent
  // across StrictMode double-mounts and rapid filter changes.
  const fetchPage = useCallback(
    async (page, replace = false, signal = null) => {
      if (isFetchingRef.current) return;
      if (signal?.aborted) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const result = await dispatch(
          getListMasterPosition({
            search: encodeURIComponent(JSON.stringify(search)),
            page: page + 1, // position API is 1-based
            pageSize,
            sort,
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
    [search, sort, pageSize, dispatch]
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
  }, [search, sort, pageSize]); // intentionally exclude fetchPage to avoid loop

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  const handleRefresh = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleSizeChanger = (_, pageSizeChange) => {
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle column-level search
  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || "");
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

  // handle detail
  const handleDetail = useCallback(async (id) => {
    try {
      setBody(id);
      await dispatch(getDetailMasterPosition(id))?.unwrap();
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);
    }
  }, [dispatch]);

  // handle cancel modals
  const handleCancelModal = async () => {
    setOpenDelete(false);
    setOpenModal(false);
    form.resetFields();
    handleCancelTryAgain();
  };

  // handle download
  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await dispatch(
        downloadMasterPosition({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 0,
          pageSize,
          sort,
        })
      ).unwrap();
    } catch {
      // errors are already surfaced via validateError in the thunk
    } finally {
      setIsDownloading(false);
    }
  }, [search, pageSize, sort, dispatch]);

  // handle retry
  const handleRetry = () => {
    if (bodyError?.action === "INACTIVE_MASTER_POSITION") {
      dispatch(inactiveMasterPosition(body));
    } else if (bodyError?.action === "DOWNLOAD_MASTER_POSITION") {
      handleDownload();
    } else if (bodyError?.action === "GET_DETAIL_MASTER_POSITION") {
      dispatch(getDetailMasterPosition(body));
    }
    handleCancelModal();
    handleRefresh();
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  // on finish activation
  const onFinish = async (formValue, handleCancel) => {
    const bodyData = { ...formValue, id: positionId, statusData };
    setBody(bodyData);
    handleCancel();
    handleCancelModal();
    await dispatch(inactiveMasterPosition(bodyData))?.unwrap();
    handleRefresh();
  };

  // columns
  const columns = useMemo(
    () => [
      {
        title: "NO",
        width: 90,
        align: "center",
        key: "no",
        render: (text, object, index) => index + 1,
      },
      {
        title: "POSITION",
        dataIndex: "name",
        key: "name",
        ellipsis: { showTitle: false },
        sorter: true,
        ...getColumnSearchPropsPaging("name", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("name", searchedColumn, searchText, text, true, "input", search),
      },
      {
        title: "COST CENTER",
        dataIndex: "costcenter",
        key: "costcenter",
        sorter: true,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsPaging("costcenter", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("costcenter", searchedColumn, searchText, text, true, "input", search),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        key: "description",
        width: 340,
        sorter: true,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsPaging("description", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("description", searchedColumn, searchText, text, true, "input", search),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        width: 120,
        sorter: true,
        fixed: "right",
        align: "center",
        ...getColumnSearchPropsPaging("status", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("status", searchedColumn, searchText, text, false, "status", search),
      },
    ],
    [search, searchedColumn, searchText, handleSearch]
  );

  // breadcrumb routes
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_MASTER_POSITION,
      breadcrumbName: "List Position",
    },
  ];

  // item toolbar
  const itemActions = useMemo(
    () => [
      {
        action: "Download",
        render: (
          <ButtonComponent
            icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
            type={"submit"}
            onClick={handleDownload}
            loading={isDownloading}
            disabled={isDownloading}
          >
            Download List
          </ButtonComponent>
        ),
      },
      {
        action: "Create",
        render: (
          <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_MASTER_POSITION}>
            <ButtonComponent
              type={"submit"}
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            >
              Create
            </ButtonComponent>
          </NavLink>
        ),
      },

      // column action
      {
        action: "View",
        type: "table",
        render: (record) => {
          return (
            <Tooltip title="Detail">
              <span
                className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  handleDetail(record?.positionId);
                  setTypeModal("detail");
                }}
              >
                <IconViewList width={20} />
              </span>
            </Tooltip>
          );
        },
      },
      {
        action: "Update",
        type: "table",
        render: (record) => {
          const disabled = record?.status?.toLowerCase() === "inactive";
          return (
            <Tooltip title="Update">
              <div className={`inline-flex items-center ${disabled ? "cursor-not-allowed text-gray-300" : ""}`}>
                <Link
                  to={!disabled ? SYSTEM_SETUP_ROUTES.UPDATE_MASTER_POSITION : undefined}
                  state={!disabled ? { id: record?.positionId } : undefined}
                  className={`inline-flex items-center transition-colors duration-200 ${disabled ? "text-gray-300 pointer-events-none" : "text-[#1976D2] hover:text-[#1976D2]"}`}
                >
                  <IconEditNx width={20} />
                </Link>
              </div>
            </Tooltip>
          );
        },
      },
      {
        action: "Activate",
        type: "table",
        render: (record) => {
          const isActive = record?.status?.toUpperCase() === "ACTIVE";
          const handleToggle = () => {
            setOpenDelete(true);
            setPositionId(record?.positionId);
            setTypeModal("confirmation");
            setStatusData(record?.status);
            setRecord(record);
          };
          return (
            <Tooltip title={isActive ? "Inactivate" : "Activate"}>
              {isActive ? (
                <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                  <IconInactive width={20} />
                </span>
              ) : (
                <span className="inline-flex items-center text-green-600 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                  <IconActive width={20} />
                </span>
              )}
            </Tooltip>
          );
        },
      },
    ],
    [handleDownload, isDownloading, handleDetail]
  );

  const actionColumns = useColumnActionPermission(["view", "update", "Activate"], itemActions);
  const allColumns = useMemo(() => [...columns, ...actionColumns], [columns, actionColumns]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="POSITION LIST" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemActions} type="page" />
          <NxTable
            idTable="position-table"
            userId={dataUser?.data?.username}
            dataSource={allData}
            columns={allColumns}
            loading={isLoading}
            totalData={totalElements}
            current={pageRef.current + 1}
            pageSize={pageSize}
            onSizeChanger={handleSizeChanger}
            onSort={onSort}
            onRefresh={handleRefresh}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            showAdvanceSearch={true}
            showSearchBar={true}
            showRefresh={true}
            tableScrolled={{ x: 1300, y: 525 }}
          />
        </div>
      </NxCardContainer>

      {/* modal detail or activation */}
      <PositionDetail
        data={data_detail}
        isOpen={openModal}
        onClick={handleCancelModal}
      />

      {/* Modal Active/Inactive */}
      <ModalApproveOrReject
        isOpen={openDelete}
        handleCloseModal={handleCancelModal}
        onFinish={onFinish}
        header={statusData === "INACTIVE" ? "activate" : "inactivate"}
        approveOrReject={
          statusData === "INACTIVE" ? "activate" : "inactivate"
        }
        menu={"Position"}
        named={record?.name}
        width={800}
      />

      {/* modal try again */}
      {renderModal()}
    </>
  );
};

export default PositionPage;
