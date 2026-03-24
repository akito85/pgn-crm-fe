import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Spin, Tooltip } from "antd";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../components/ButtonComponent";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import { useDispatch, useSelector } from "react-redux";
import { downloadAccountStandard, getAllAccountStandardPaginate } from "../../../../../redux/slices/account_management/Account/accountSlice";
import { TableAccountStandard, columnsAccountStandard } from "./TableAccountStandard";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../components/Toolbar";
import ViewListIcon from "../../../../../assets/Icon/Nx/IconViewList";
import { PlusOutlined } from "@ant-design/icons";

const AccountStandard = () => {
  // Selector — loading is NOT used for the table spinner; see isLoading below.
  const { data_accountStandard } = useSelector(
    (state) => state.account
  );
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || '{}'); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  // Local loading flag: set true before each fetch, cleared in the finally block
  // AFTER setAllData so React 18 batches both updates into one render.
  // This prevents the "spinner gone, table still empty" flash that occurs when
  // using the Redux loading flag (which goes false before local state is updated).
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(0); // 0-based to match Spring API directly
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  // Helper: build combined search string
  const buildSearch = useCallback((basicSearch, advSearch) => {
    let combined = { ...basicSearch };
    if (advSearch?.filters) {
      advSearch.filters.forEach(f => { if (f.column && f.value) combined[f.column] = f.value; });
    }
    if (advSearch?.filterRules) {
      advSearch.filterRules.forEach(rule =>
        rule.filters.forEach(f => { if (f.column && f.value) combined[f.column] = f.value; })
      );
    }
    return encodeURIComponent(JSON.stringify(combined));
  }, []);

  // Fetch a specific page and append (or replace) results locally.
  // The optional `signal` object ({ aborted: false }) lets the caller cancel
  // a stale fetch (e.g. StrictMode cleanup or rapid filter changes) without
  // touching isFetchingRef so the guard stays coherent.
  const fetchPage = useCallback(async (page, replace = false, signal = null) => {
    if (isFetchingRef.current) return;
    if (signal?.aborted) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const reqSearch = buildSearch(search, advancedSearch);
      const result = await dispatch(getAllAccountStandardPaginate({
        page, // 0-based, matches Spring API directly
        pageSize,
        sort,
        search: reqSearch
      })).unwrap();
      if (signal?.aborted) return; // discard result from the superseded fetch
      const rows = result?.result ?? [];
      const pageInfo = result?.page ?? {};
      const nextHasMore = page < (pageInfo.totalPages ?? 0) - 1;
      setAllData(prev => replace ? rows : [...prev, ...rows]);
      setTotalElements(pageInfo.totalElements ?? 0);
      setHasMore(nextHasMore);
      hasMoreRef.current = nextHasMore;
      // Use the page we requested, not pageInfo.number — avoids the 0 ?? page
      // pitfall where a valid 0 from the API overrides the actual page index.
      pageRef.current = page;
    } catch (e) {
      if (!signal?.aborted) console.error('fetchPage error', e);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false); // batched with setAllData above — no loading→empty flash
    }
  }, [search, advancedSearch, sort, pageSize, dispatch, buildSearch]);

  // Initial load + reload when filters/sort/pageSize change.
  // The signal is marked aborted on cleanup so StrictMode double-mounts and
  // rapid filter changes don't commit stale results into component state.
  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
    return () => {
      signal.aborted = true;
      isFetchingRef.current = false; // unblock the next effect so it can fetch
    };
  }, [search, advancedSearch, sort, pageSize]); // intentionally exclude fetchPage to avoid loop

  const handleDownload = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(downloadAccountStandard({ page: pageRef.current, pageSize, sort, search: tempSearch }));
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Account Management",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard",
    },
  ];

  const handleChange = (_, pageSizeChange) => {
    setPageSize(pageSizeChange);
  };

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    // Return the promise so useInfiniteScroll's triggerLoad waits for
    // the fetch to complete before clearing its isLoadingMoreRef gate.
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

  const itemActions = [
    // action toolbar
    // this wont be necessary with export button
    // {
    //   action: 'Download',
    //   render: (
    //     <ButtonComponent
    //       icon={<SVGIcon name="IconButtonDownload" width={24} />}
    //       type="submit"
    //       onClick={handleDownload}
    //     >
    //       Download List
    //     </ButtonComponent>
    //   )
    // }, 
    {
      action: 'Create',
      render: (
        <Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_STANDARD}>
          <ButtonComponent
            icon={<PlusOutlined />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </Link>
      )
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD}
              state={{ idAccount: record?.accountId, idCustomer: record?.customerId }}
              className="flex flex-col justify-center items-center"
            >
              <ViewListIcon />
            </Link>
          </Tooltip>
        )
      }
    },
  ]

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header={"ACCOUNT - STANDARD"} className="mt-4" actions={itemActions}>
        <div className="w-full">
          <TableAccountStandard
            dataSource={allData}
            loading={isLoading}
            totalData={totalElements}
            current={pageRef.current + 1}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            onAdvanceSearch={onAdvanceSearch}
            handleDownload={handleDownload}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            itemActions={itemActions}
            columnDefinitions={columnsAccountStandard}
            tableScrolled={{ x: 3000, y: 600 }}
            userId={userId}
          />
        </div>
      </NxCardContainer>
    </>
  );
};

export default AccountStandard;
