import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  deleteGlobalType,
  downloadExcelGlobalType,
  getAllGlobalTypesPaginate,
} from "../../../../redux/slices/system_setup/globalTypes";
import { WarningOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import useIsSuperUser from "../../../../components/useIsSuperUser";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconDeleteMenu from "../../../../assets/Icon/Nx/IconDeleteMenu";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const ViewGlobalType = () => {
  const dispatch = useDispatch();
  const { bodyError } = useSelector((state) => state?.general);
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || "{}"); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);
  const isSuperUser = useIsSuperUser();

  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });
  const [modalDelete, setModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
        getAllGlobalTypesPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
      if (!signal?.aborted) console.error("GlobalType fetchPage error", e);
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
  }, [advancedSearch, sort, pageSize]); // intentionally excludes fetchPage

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

  const resetAndReload = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleDownload = useCallback(() => {
    dispatch(downloadExcelGlobalType({
      page: 1,
      pageSize: totalElements || 1000,
      sort,
      search: buildSearch(advancedSearch),
    }));
  }, [dispatch, sort, totalElements, advancedSearch, buildSearch]);

  const handleDelete = async () => {
    setModalDelete(false);
    try { await dispatch(deleteGlobalType(deleteId))?.unwrap(); } catch {}
    resetAndReload();
  };

  const columns = useMemo(() => [
    { title: "NO", key: "no", width: 60, align: "center", render: (_, __, index) => index + 1 },
    { title: "GROUP NAME", dataIndex: "groupName", key: "groupName", sorter: true },
    { title: "SORT BY", dataIndex: "sortBy", key: "sortBy", sorter: true, width: 120, align: "center" },
    { title: "DESCRIPTION", dataIndex: "description", key: "description", sorter: true, ellipsis: { showTitle: false } },
    {
      title: "STATUS", dataIndex: "status", key: "status", align: "center", width: 120, sorter: true, fixed: "right",
      render: (text) => {
        const label = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
        return label ? <StatusComponent colour={text} size="small">{label}</StatusComponent> : text;
      },
    },
  ], []);

  const itemActions = useMemo(() => [
    {
      action: "Download",
      render: (
        <ButtonComponent icon={<span style={{ fontSize: 18 }}>⬇</span>} type="submit" onClick={handleDownload}>
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_GLOBAL_TYPE}>
          <ButtonComponent icon={<PlusOutlined style={{ fontSize: "24px" }} />} type="submit">
            Create Global Type
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
            to={SYSTEM_SETUP_ROUTES.DETAIL_GLOBAL_TYPE}
            state={{ id: record?.glbTypeId }}
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
            to={SYSTEM_SETUP_ROUTES.UPDATE_GLOBAL_TYPE}
            state={{ id: record?.glbTypeId }}
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
          >
            <IconEditNx width={20} />
          </Link>
        </Tooltip>
      ),
    },
    ...(isSuperUser ? [{
      action: "Delete",
      type: "table",
      render: (record) => (
        <Tooltip title="Delete">
          <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={() => { setDeleteId(record?.glbTypeId); setModalDelete(true); }}>
            <IconDeleteMenu width={20} />
          </span>
        </Tooltip>
      ),
    }] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [isSuperUser, handleDownload]);

  const actionColumns = useColumnActionPermission(
    ["View", "Update", ...(isSuperUser ? ["Delete"] : [])],
    itemActions
  );
  const allColumns = useMemo(() => [...columns, ...actionColumns], [columns, actionColumns]);

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    if (bodyError?.action === "DOWNLOAD_GLOBAL_PROPERTIES_EXCEL") handleDownload();
    resetAndReload();
  }, [bodyError, handleDownload, resetAndReload]);

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_TYPE, breadcrumbName: "Global Type" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="GLOBAL TYPE LIST" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="global-type-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.glbTypeId ?? r.id}
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

      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDelete}
        header="Delete Global Type"
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className="w-full flex flex-row items-center px-10">
            <WarningOutlined style={{ color: "red" }} className="text-4xl" />
            <span className="text-lg text-black font-bold h-auto mx-auto">
              Are you sure you want to permanently delete this global type? All associated values will also be removed. This cannot be undone.
            </span>
          </div>
        </div>
      </ModalConfirm>

      {renderModal()}
    </>
  );
};

export default ViewGlobalType;
