import { Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import RadioTabs from "../../../../components/RadioTabs";
import SVGIcon from "../../../../assets/Icon/index";
import { getDelegationList } from "../../../../redux/slices/user_management/delegation";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import StatusComponent from "../../../../components/StatusComponent";
import { renderDateConverter } from "../../../../utils";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const DelegationPage = () => {
  const dispatch = useDispatch();
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || "{}"); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);

  const listSectionInfo = [
    { value: "Approval Delegation" },
    { value: "Delegation Request" },
  ];

  const [valuePage, setValuePage] = useState(listSectionInfo[0].value);
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
        getDelegationList({ page: page + 1, pageSize, sort, search: reqSearch })
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
      if (!signal?.aborted) console.error("Delegation fetchPage error", e);
    } finally {
      isFetchingRef.current = false;
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [advancedSearch, sort, pageSize, dispatch, buildSearch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
    return () => { signal.aborted = true; isFetchingRef.current = false; };
  }, [advancedSearch, sort, pageSize, valuePage]); // fetchPage intentionally omitted — same pattern as Entity page

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
    pageRef.current = 0; setAllData([]); setHasMore(false); setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const onChange = useCallback((e) => {
    setValuePage(e.target.value);
    setAdvancedSearch(null);
    setSort("");
    setFixedColumns({ left: [], right: [] });
  }, []);

  const routes = [
    { path: "", breadcrumbName: "User Management" },
    { path: "", breadcrumbName: "Delegation" },
    { path: "", breadcrumbName: valuePage },
  ];

  const approvalColumns = useMemo(() => [
    { title: "NO", key: "no", width: 60, align: "center", render: (_, __, i) => i + 1 },
    { title: "FROM", dataIndex: "delegateFrom", key: "delegateFrom", sorter: true, align: "left" },
    {
      title: "POSITION", dataIndex: "positionFromDelegator", key: "positionFromDelegator",
      sorter: true, align: "left", ellipsis: { showTitle: false },
    },
    {
      title: "START DATE", dataIndex: "startDate", key: "startDate", sorter: true, align: "center",
      render: (v) => v ? renderDateConverter(v, "date") : "",
    },
    {
      title: "END DATE", dataIndex: "endDate", key: "endDate", sorter: true, align: "center",
      render: (v) => v ? renderDateConverter(v, "date") : "",
    },
    {
      title: "REQUEST REMARK", dataIndex: "requestRemark", key: "requestRemark",
      sorter: true, align: "left", ellipsis: { showTitle: false },
    },
    {
      title: "APPROVAL REMARK", dataIndex: "approvalRemark", key: "approvalRemark",
      sorter: true, align: "left", ellipsis: { showTitle: false },
    },
    {
      title: "STATUS", dataIndex: "status", key: "status", sorter: true, align: "center",
      width: 160, fixed: "right",
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_APPROVAL": text = "Waiting Approval"; break;
          default: text = index ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase() : index; break;
        }
        return text ? (
          <div className="flex justify-center"><StatusComponent colour={text}>{text}</StatusComponent></div>
        ) : text;
      },
    },
  ], []);

  const requestColumns = useMemo(() => [
    { title: "NO", key: "no", width: 60, align: "center", render: (_, __, i) => i + 1 },
    { title: "DELEGATION TO", dataIndex: "delegateTo", key: "delegateTo", sorter: true, align: "left" },
    {
      title: "POSITION", dataIndex: "positionFromDelegator", key: "positionFromDelegator",
      sorter: true, align: "left", ellipsis: { showTitle: false },
    },
    {
      title: "START DATE", dataIndex: "startDate", key: "startDate", sorter: true, align: "center",
      render: (v) => v ? renderDateConverter(v, "date") : "",
    },
    {
      title: "END DATE", dataIndex: "endDate", key: "endDate", sorter: true, align: "center",
      render: (v) => v ? renderDateConverter(v, "date") : "",
    },
    {
      title: "REQUEST REMARK", dataIndex: "requestRemark", key: "requestRemark",
      sorter: true, align: "left", ellipsis: { showTitle: false },
    },
    {
      title: "APPROVAL REMARK", dataIndex: "approvalRemark", key: "approvalRemark",
      sorter: true, align: "left", ellipsis: { showTitle: false },
    },
  ], []);

  const viewActionItem = useMemo(() => ({
    action: "View",
    type: "table",
    render: (record) => (
      <Link to={USER_ROUTES.DETAIL_DELEGATION} state={{ id: record?.id }}>
        <Tooltip title="Detail">
          <div className="pt-1"><SVGIcon name="IconDetail" width={24} /></div>
        </Tooltip>
      </Link>
    ),
  }), []);

  const createActionItem = useMemo(() => ({
    action: "Create",
    render: (
      <NavLink to={USER_ROUTES.CREATE_DELEGATION}>
        <ButtonComponent icon={<SVGIcon name="IconButtonCreate" width={24} />} type="submit">
          Create Delegation
        </ButtonComponent>
      </NavLink>
    ),
  }), []);

  const columnAction = useColumnActionPermission(["view"], [viewActionItem]);

  const allApprovalColumns = useMemo(
    () => [...approvalColumns, ...columnAction],
    [approvalColumns, columnAction]
  );
  const allRequestColumns = useMemo(
    () => [...requestColumns, ...columnAction],
    [requestColumns, columnAction]
  );

  const isApprovalTab = valuePage === "Approval Delegation";
  const activeColumns = isApprovalTab ? allApprovalColumns : allRequestColumns;
  const activeColumnDefinitions = isApprovalTab ? approvalColumns : requestColumns;
  const activeTableId = isApprovalTab ? "delegation-approval" : "delegation-request";

  const currentNxActions = useMemo(
    () => isApprovalTab ? [viewActionItem] : [createActionItem, viewActionItem],
    [isApprovalTab, createActionItem, viewActionItem]
  );

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    resetAndReload();
  }, [resetAndReload]);

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  return (
    <>
      <BreadCrumb routes={routes} />
      <RadioTabs
        data={listSectionInfo}
        onChange={onChange}
        currentPosition={valuePage}
      />
      <NxCardContainer
        header={valuePage + " LIST"}
        className="mt-4"
        actions={currentNxActions}
      >
        <NxTable
          idTable={activeTableId}
          userId={userId}
          dataSource={allData}
          columns={activeColumns}
          columnDefinitions={activeColumnDefinitions}
          rowKey={(r) => r.id}
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
          showAdvanceSearch={true}
          showSearchBar={true}
          tableScrolled={{ x: 1700, y: 525 }}
        />
      </NxCardContainer>
      {renderModal()}
    </>
  );
};

export default DelegationPage;
