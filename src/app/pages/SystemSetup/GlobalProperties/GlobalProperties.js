import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  downloadExcelGlobalProperties,
  getAllGlobalPropertiesPaginate,
} from "../../../../redux/slices/system_setup/globalProperties";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const GlobalProperties = () => {
  const dispatch = useDispatch();
  const { bodyError } = useSelector((state) => state?.general);
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || "{}"); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);

  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);
  const handleCancelTryAgainRef = useRef(null);

  const buildSearch = useCallback((advSearch) => {
    const combined = {};
    const applyFilter = (f) => {
      if (!f.column) return;
      const selector = OPERATOR_MAP[f.operator] || "LIKE";
      const isNullOp = selector === "IS_NULL" || selector === "IS_NOT_NULL";
      if (isNullOp) { combined[f.column] = `~${selector}`; }
      else if (f.value) { combined[f.column] = `${f.value}~${selector}`; }
    };
    if (advSearch?.filters) advSearch.filters.forEach(applyFilter);
    if (advSearch?.filterRules) advSearch.filterRules.forEach((r) => r.filters.forEach(applyFilter));
    return encodeURIComponent(JSON.stringify(combined));
  }, []);

  const fetchPage = useCallback(async (page, replace = false, signal = null) => {
    if (isFetchingRef.current) return;
    if (signal?.aborted) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const reqSearch = buildSearch(advancedSearch);
      const result = await dispatch(
        getAllGlobalPropertiesPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
      if (!signal?.aborted) console.error("GlobalProperties fetchPage error", e);
    } finally {
      isFetchingRef.current = false;
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [advancedSearch, sort, pageSize, dispatch, buildSearch]);

  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
    return () => { signal.aborted = true; isFetchingRef.current = false; };
  }, [advancedSearch, sort, pageSize]);

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  const onSort = useCallback((_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  }, []);

  const onAdvanceSearch = useCallback((searchData) => setAdvancedSearch(searchData), []);
  const handleChange = useCallback((_, pageSizeChange) => setPageSize(pageSizeChange), []);

  const handleDownload = useCallback(() => {
    dispatch(downloadExcelGlobalProperties({
      page: 1, pageSize: totalElements || 1000, sort, search: buildSearch(advancedSearch),
    }));
  }, [dispatch, sort, totalElements, advancedSearch, buildSearch]);

  const columns = useMemo(() => [
    { title: "NO", key: "no", width: 90, align: "center", render: (_, __, index) => index + 1 },
    { title: "TYPE", dataIndex: "gpType", key: "gpType", align: "center", sorter: true, width: 160 },
    { title: "PROPERTIES NAME", dataIndex: "name", key: "name", sorter: true },
    { title: "DESCRIPTION", dataIndex: "description", key: "description", sorter: true, ellipsis: { showTitle: false } },
    {
      title: "STATUS", dataIndex: "status", key: "status", align: "center", width: 120, sorter: true, fixed: "right",
      render: (text) => {
        const label = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
        return label ? <div className="flex justify-center"><StatusComponent colour={text} size="small">{label}</StatusComponent></div> : text;
      },
    },
  ], []);

  const itemActions = useMemo(() => [
    {
      action: "Download",
      render: (
        <ButtonComponent type="submit" icon={<DownloadOutlined style={{ fontSize: "24px" }} />} onClick={handleDownload}>
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_GLOBAL_PROPERTIES}>
          <ButtonComponent icon={<PlusOutlined style={{ fontSize: "24px" }} />} type="submit">
            Create Global Properties
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <Link
            to={SYSTEM_SETUP_ROUTES.DETAIL_GLOBAL_PROPERTIES}
            state={{ id: record?.gpId }}
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
          >
            <IconViewList width={20} />
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
            to={SYSTEM_SETUP_ROUTES.UPDATE_GLOBAL_PROPERTIES}
            state={{ id: record?.gpId }}
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
          >
            <IconEditNx width={20} />
          </Link>
        </Tooltip>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [handleDownload]);

  const actionColumns = useColumnActionPermission(["View", "Update"], itemActions);
  const allColumns = useMemo(() => [...columns, ...actionColumns], [columns, actionColumns]);

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    if (bodyError?.action === "DOWNLOAD_GLOBAL_PROPERTIES_EXCEL") handleDownload();
    const signal = { aborted: false };
    pageRef.current = 0; setAllData([]); setHasMore(false); setIsLoading(true);
    fetchPage(0, true, signal);
  }, [bodyError, handleDownload, fetchPage]);

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_PROPERTIES, breadcrumbName: "Global Properties" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="GLOBAL PROPERTIES LIST" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="global-properties-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.gpId ?? r.id}
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
          handleDownload={handleDownload}
          showExport={true}
          showAdvanceSearch={true}
          showSearchBar={true}
          tableScrolled={{ x: 1200, y: 525 }}
        />
      </NxCardContainer>

      {renderModal()}
    </>
  );
};

export default GlobalProperties;
