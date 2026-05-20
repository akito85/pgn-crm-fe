import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../components/BreadCrumb";
import NxCardContainer from "../../../components/Nx/NxCardContainer";
import useIsSuperUser from "../../../components/useIsSuperUser";
import { getAuditTrailPaging } from "../../../redux/slices/user_management/audit_trail";
import { TableAuditTrail } from "./TableAuditTrail";

const OPERATOR_SELECTOR_MAP = {
  "Contains": "LIKE",
  "Equal to": "EQUALS",
  "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN",
  "Less than": "LESS_THAN",
  "Is empty": "IS_NULL",
  "Is not empty": "IS_NOT_NULL",
};

const AuditTrailPage = () => {
  const isSuperUser = useIsSuperUser();
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

  const [pageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (advSearch?.filters) advSearch.filters.forEach(applyFilter);
    if (advSearch?.filterRules) advSearch.filterRules.forEach((rule) => rule.filters.forEach(applyFilter));
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
          getAuditTrailPaging({ page: page + 1, pageSize, sort, search: reqSearch })
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
    if (!isSuperUser) return;
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
  }, [search, advancedSearch, sort, pageSize, isSuperUser]); // intentionally exclude fetchPage to avoid loop

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

  const routes = [{ path: "", breadcrumbName: "Audit Trail" }];

  if (!isSuperUser) {
    return (
      <>
        <BreadCrumb routes={routes} />
        <NxCardContainer header="AUDIT TRAIL" className="mt-4">
          <div className="w-full flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm font-medium">
              Access restricted. This page is only available to Super Users.
            </p>
          </div>
        </NxCardContainer>
      </>
    );
  }

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer header="AUDIT TRAIL" className="mt-4">
        <div className="w-full">
          <TableAuditTrail
            userId={userId}
            dataSource={allData}
            loading={isLoading}
            totalData={totalElements}
            current={pageRef.current + 1}
            pageSize={pageSize}
            onSort={onSort}
            onAdvanceSearch={onAdvanceSearch}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
          />
        </div>
      </NxCardContainer>
    </>
  );
};

export default AuditTrailPage;
