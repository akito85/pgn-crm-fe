import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCostCenter,
  activateCostCenter,
  getCostCenterDetail,
  downloadMasterCostCenter,
} from "../../../../../redux/slices/system_setup/master_data/master_cost_center";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../../components/Nx/NxTable";
import { NavLink, Link } from "react-router-dom";
import IconViewList from "../../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../../assets/Icon/Nx/IconEdit";
import IconActive from "../../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../../assets/icons/nx/IconInactive";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import DetailCostCenter from "./DetailCostCenter";
import { renderColumn } from "../../../../../utils";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const CostCenter = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data_detail } = useSelector((state) => state.master_cost_center);
  const { bodyError } = useSelector((state) => state?.general);

  // Pagination & filter state
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: ["status", "action"],
  });

  // Advance search (filter builder) + top free-text search bar state
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);
  const [globalSearchText, setGlobalSearchText] = useState("");

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
  const [detailLoadingId, setDetailLoadingId] = useState(null);

  // Modal state
  const [modalDetail, setModalDetail] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [costCenterId, setCostCenterId] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [record, setRecord] = useState({});
  const [body, setBody] = useState({});

  // Refs for safe access inside callbacks without stale closures
  const pageRef = useRef(0); // 0-based internal; API receives page + 1 (cost center API is 1-based)
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  const { data: dataUser = {} } = useSelector((state) => state.profile);

  // Fetch a single page and append (replace=true) or append to allData.
  // Mirrors PositionPage.js's fetchPage: the signal object lets the caller cancel a
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
          getAllCostCenter({
            search,
            searchText: globalSearchText,
            page: page + 1, // cost center API is 1-based
            pageSize,
            sort,
            filters,
            filterRules,
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
    [search, sort, pageSize, dispatch, globalSearchText, filters, filterRules]
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
  }, [search, sort, pageSize, globalSearchText, filters, filterRules]); // intentionally exclude fetchPage to avoid loop

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

  // handle advance search (filter builder modal) — searchData is null when cleared
  const handleAdvancedSearch = useCallback((searchData) => {
    setFilters(searchData?.filters || []);
    setFilterRules(searchData?.filterRules || []);
  }, []);

  // handle top free-text search bar
  const handleSearchBar = useCallback((value) => {
    setGlobalSearchText(value || "");
  }, []);

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
    if (detailLoadingId) return;
    setDetailLoadingId(id);
    try {
      setBody(id);
      await dispatch(getCostCenterDetail(id))?.unwrap();
      setModalDetail(true);
    } catch (error) {
      setModalDetail(false);
    } finally {
      setDetailLoadingId(null);
    }
  }, [dispatch, detailLoadingId]);

  // handle cancel modals
  const handleCancelModal = () => {
    setModalConfirm(false);
    setModalDetail(false);
    form.resetFields();
    handleCancelTryAgain();
    setRecord({});
  };

  // handle download
  const buildBodyDownload = useCallback(
    (pageNum) => ({
      page: pageNum,
      // Download always fetches every matching record regardless of the
      // infinite-scroll page size in view — totalElements reflects the full
      // count for the current search/filters.
      pageSize: totalElements || pageSize,
      sort,
      search,
      searchText: globalSearchText,
      filters,
      filterRules,
    }),
    [sort, search, globalSearchText, filters, filterRules, totalElements, pageSize]
  );

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await dispatch(downloadMasterCostCenter({ ...buildBodyDownload(1) })).unwrap();
    } catch {
      // errors are already surfaced via validateError in the thunk
    } finally {
      setIsDownloading(false);
    }
  }, [dispatch, buildBodyDownload]);

  // on click activation
  const onClick = (r) => {
    if (r?.status === "ACTIVE") {
      setActiveOrInactive("Inactivate");
    }
    if (r?.status === "INACTIVE") {
      setActiveOrInactive("Activate");
    }
    setModalConfirm(true);
    setCostCenterId(r?.ccId);
    setRecord(r);
  };

  // handle confirm activation
  const handleConfirm = async (formValue, handleClearRemark) => {
    const data = {
      id: costCenterId,
      remark: formValue?.remark,
      status: activeOrInactive,
    };
    setBody(data);
    try {
      await dispatch(activateCostCenter(data))?.unwrap();
      handleRefresh();
    } finally {
      // Close only the local confirmation modal here — handleCancelModal()
      // also clears general.bodySuccess, which would wipe the success
      // message the activateCostCenter thunk just set via showModalSuccess.
      handleClearRemark();
      setModalConfirm(false);
      setRecord({});
      form.resetFields();
    }
  };

  // handle retry modal error
  const handleRetry = () => {
    if (bodyError?.action === "ACTIVATE_COST_CENTER") {
      dispatch(activateCostCenter(body));
    } else if (bodyError?.action === "DOWNLOAD_MASTER_COST_CENTER") {
      handleDownload();
    } else if (bodyError?.action === "GET_COST_CENTER_DETAIL") {
      dispatch(getCostCenterDetail(body));
    }
    handleCancelModal();
    handleRefresh();
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

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
        title: "CODE",
        dataIndex: "code",
        key: "code",
        align: "center",
        sorter: true,
        ...getColumnSearchPropsPaging("code", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("code", searchedColumn, searchText, text, false, "input", search),
      },
      {
        title: "COST CENTER NAME",
        dataIndex: "name",
        key: "name",
        align: "left",
        width: 250,
        sorter: true,
        ...getColumnSearchPropsPaging("name", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("name", searchedColumn, searchText, text, false, "input", search),
      },
      {
        title: "TYPE",
        dataIndex: "ccType",
        key: "ccType",
        align: "center",
        sorter: true,
        ...getColumnSearchPropsPaging("ccType", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("ccType", searchedColumn, searchText, text, false, "input", search),
      },
      {
        title: "VALUE NAME",
        dataIndex: "valName",
        key: "valName",
        align: "left",
        ellipsis: { showTitle: false },
        sorter: true,
        ...getColumnSearchPropsPaging("valName", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("valName", searchedColumn, searchText, text, true, "input", search),
      },
      {
        title: "VALUE CODE",
        dataIndex: "valCode",
        key: "valCode",
        align: "center",
        sorter: true,
        ...getColumnSearchPropsPaging("valCode", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("valCode", searchedColumn, searchText, text, false, "input", search),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        key: "description",
        align: "left",
        width: 300,
        sorter: true,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsPaging("description", searchInput, searchedColumn, searchText, handleSearch, true),
        render: (text) => renderColumn("description", searchedColumn, searchText, text, true, "input", search),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 100,
        sorter: true,
        fixed: "right",
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
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_COST_CENTER,
      breadcrumbName: "Cost Center",
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
          <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_COST_CENTER}>
            <ButtonComponent
              type={"submit"}
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            >
              Create Cost Center
            </ButtonComponent>
          </NavLink>
        ),
      },

      // column action
      {
        action: "View",
        type: "table",
        render: (record) => {
          const isDetailLoading = detailLoadingId === record?.ccId;
          return (
            <Tooltip title="Detail">
              <span
                className={`inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 ${detailLoadingId ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => {
                  if (detailLoadingId) return;
                  handleDetail(record?.ccId);
                }}
              >
                {isDetailLoading ? (
                  <Spin size="small" />
                ) : (
                  <IconViewList width={20} />
                )}
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
                  to={!disabled ? SYSTEM_SETUP_ROUTES.UPDATE_COST_CENTER : undefined}
                  state={!disabled ? { id: record?.ccId } : undefined}
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
          const handleToggle = () => onClick(record);
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
    [handleDownload, isDownloading, handleDetail, detailLoadingId]
  );

  const actionColumns = useColumnActionPermission(["view", "update", "activate"], itemActions);
  const allColumns = useMemo(() => [...columns, ...actionColumns], [columns, actionColumns]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="COST CENTER LIST" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemActions} type="page" />
          <NxTable
            idTable="cost-center-table"
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
            onAdvanceSearch={handleAdvancedSearch}
            onSearch={handleSearchBar}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            showAdvanceSearch={true}
            showSearchBar={true}
            showRefresh={true}
            tableScrolled={{ x: 1700, y: 525 }}
          />
        </div>
      </NxCardContainer>

      {/* Modal Detail */}
      <DetailCostCenter
        data={data_detail?.data}
        openModal={modalDetail}
        closeModal={handleCancelModal}
      />

      {/* Modal Active/Inactive */}
      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancelModal}
        onFinish={handleConfirm}
        header={activeOrInactive === "Activate" ? "activate" : "inactivate"}
        approveOrReject={
          activeOrInactive === "Activate" ? "activate" : "inactivate"
        }
        menu={"Cost Center"}
        named={record?.name}
        width={800}
      />

      {/* modal try again */}
      {renderModal()}
    </>
  );
};

export default CostCenter;
