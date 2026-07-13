import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import { NavLink } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import {
  getListPrabillingInitPopulate,
  getListPrabillingSummary,
  getListBillingPeriodForPrabilling,
  resetSummaryData,
  resetAllTabData,
  setFilters,
  clearFilters,
  downloadListPrabilling,
} from "../../../../redux/slices/rating_billing_invoice/praBilling";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";
import SelectComponent from "../../../../components/SelectComponent";
import {
  getAllTabColumns,
  getSummaryTabColumns,
  getActionColumns,
} from "./columns/prabillingColumns";
import PrabillingSummaryDetail from "./detail/PrabillingSummaryDetail";

const PrabillingPage = () => {
  const {
    loading,
    list_prabilling_init,
    prabilling_pagination,
    list_prabilling_summary,
    summary_pagination,
    list_period_summary,
    filters,
  } = useSelector((state) => state.rbi_prabilling);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const detailRef = useRef(null);

  const [valueTab, setValueTab] = useState("All");
  const currentTabKey = valueTab === "All" ? "all_tab" : "summary_tab";
  const [page, setPage] = useState(filters[currentTabKey]?.page || 1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState(filters[currentTabKey]?.sort || "");
  const [search, setSearch] = useState(filters[currentTabKey]?.search || {});
  const [searchedColumn, setSearchedColumn] = useState(
    filters[currentTabKey]?.searchedColumn || "",
  );
  const [searchText, setSearchText] = useState(
    filters[currentTabKey]?.searchText || "",
  );
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);

  const [pageDetail, setPageDetail] = useState(false);
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("prabillingFixedColumns_all");
      return saved ? JSON.parse(saved) : { left: ["no"], right: ["action"] };
    } catch (e) {
      return { left: ["no"], right: ["action"] };
    }
  });

  // Save fixedColumns to localStorage per tab when changed
  useEffect(() => {
    const tabKey = valueTab === "All" ? "prabillingFixedColumns_all" : "prabillingFixedColumns_summary";
    try {
      localStorage.setItem(tabKey, JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns, valueTab]);

  useEffect(() => {
    dispatch(
      setFilters({
        tab: currentTabKey,
        filters: {
          search,
          sort,
          searchText,
          searchedColumn,
          page,
          selectedBillingPeriod,
        },
      }),
    );
  }, [
    search,
    sort,
    searchText,
    searchedColumn,
    page,
    selectedBillingPeriod,
    currentTabKey,
    dispatch,
  ]);

  useEffect(() => {
    const savedFilters = filters[currentTabKey];
    if (savedFilters) {
      setPage(savedFilters.page || 1);
      setSort(savedFilters.sort || "");
      setSearch(savedFilters.search || {});
      setSearchedColumn(savedFilters.searchedColumn || "");
      setSearchText(savedFilters.searchText || "");
      if (savedFilters.selectedBillingPeriod !== null) {
        setSelectedBillingPeriod(savedFilters.selectedBillingPeriod);
      }
    }
  }, [valueTab, filters, currentTabKey]);

  useEffect(() => {
    dispatch(getListBillingPeriodForPrabilling());
  }, [dispatch]);

  useEffect(() => {
    if (
      list_period_summary &&
      list_period_summary.length > 0 &&
      !selectedBillingPeriod
    ) {
      const now = new Date();
      const currentMonth = now.toLocaleString("en-US", { month: "short" });
      const currentYear = now.getFullYear();
      const currentPeriodName = `${currentMonth} ${currentYear}`;

      const currentPeriod = list_period_summary.find(
        (item) => item.name === currentPeriodName,
      );

      if (currentPeriod) {
        setSelectedBillingPeriod(currentPeriod.id);
      } else {
        setSelectedBillingPeriod(list_period_summary[0].id);
      }
    }
  }, [list_period_summary, selectedBillingPeriod]);

  useEffect(() => {
    const tabKey = valueTab === "All" ? "prabillingFixedColumns_all" : "prabillingFixedColumns_summary";
    const defaultRight = valueTab === "All" ? ["action"] : [];
    try {
      const saved = localStorage.getItem(tabKey);
      setFixedColumns(saved ? JSON.parse(saved) : { left: ["no"], right: defaultRight });
    } catch (e) {
      setFixedColumns({ left: ["no"], right: defaultRight });
    }
  }, [valueTab]);

  useEffect(() => {
    if (pageDetail && activeRowKey && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [activeRowKey, pageDetail]);

  const initialPageSize = 100;

  useEffect(() => {
    if (valueTab === "All" && selectedBillingPeriod) {
      dispatch(
        getListPrabillingInitPopulate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          billPeriodId: selectedBillingPeriod,
          isLoadMore: false,
        }),
      );
      setPage(1);
    } else if (valueTab === "Summary" && selectedBillingPeriod) {
      const selectedPeriod = list_period_summary.find(
        (item) => item.id === selectedBillingPeriod,
      );
      if (selectedPeriod) {
        dispatch(
          getListPrabillingSummary({
            billPeriod: selectedPeriod.name,
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: initialPageSize,
            sort,
            isLoadMore: false,
          }),
        );
      }
      setPage(1);
    }
  }, [
    dispatch,
    search,
    sort,
    valueTab,
    selectedBillingPeriod,
    list_period_summary,
  ]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleLoadMore = async () => {
    const currentPagination =
      valueTab === "All" ? prabilling_pagination : summary_pagination;
    const totalElements = currentPagination?.totalElements || 0;
    const currentDataLength = currentData.length;

    if (currentDataLength >= totalElements) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    if (selectedBillingPeriod) {
      if (valueTab === "All") {
        await dispatch(
          getListPrabillingInitPopulate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: nextPage,
            pageSize: loadMoreSize,
            sort,
            billPeriodId: selectedBillingPeriod,
            isLoadMore: true,
          }),
        );
      } else {
        const selectedPeriod = list_period_summary.find(
          (item) => item.id === selectedBillingPeriod,
        );
        if (selectedPeriod) {
          await dispatch(
            getListPrabillingSummary({
              billPeriod: selectedPeriod.name,
              search: encodeURIComponent(JSON.stringify(search)),
              page: nextPage,
              pageSize: loadMoreSize,
              sort,
              isLoadMore: true,
            }),
          );
        }
      }
      setPage(nextPage);
    }
  };

  const handleRefresh = () => {
    if (selectedBillingPeriod) {
      if (valueTab === "All") {
        dispatch(
          getListPrabillingInitPopulate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: initialPageSize,
            sort,
            billPeriodId: selectedBillingPeriod,
            isLoadMore: false,
          }),
        );
      } else {
        const selectedPeriod = list_period_summary.find(
          (item) => item.id === selectedBillingPeriod,
        );
        if (selectedPeriod) {
          dispatch(
            getListPrabillingSummary({
              billPeriod: selectedPeriod.name,
              search: encodeURIComponent(JSON.stringify(search)),
              page: 1,
              pageSize: initialPageSize,
              sort,
              isLoadMore: false,
            }),
          );
        }
      }
      setPage(1);
    }
  };

  const handleDetail = (record, rowKey) => {
    if (valueTab !== "Summary") return;

    const recordKey = rowKey || record.customerNumber;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setSelectedRecord(null);
    } else {
      setSelectedRecord(record);
      setActiveRowKey(recordKey);
      setPageDetail(true);
    }
  };

  const currentData = useMemo(() => {
    if (valueTab === "All") {
      return list_prabilling_init || [];
    } else {
      return list_prabilling_summary || [];
    }
  }, [valueTab, list_prabilling_init, list_prabilling_summary]);

  const currentPagination =
    valueTab === "All" ? prabilling_pagination : summary_pagination;
  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item) => ({
      ...item,
      key: valueTab === "All" ? item.initCode : item.customerNumber,
    }));
  }, [currentData, valueTab]);

  const allTabColumns = useMemo(
    () =>
      getAllTabColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    [search, searchText, searchedColumn],
  );

  const summaryTabColumns = useMemo(
    () =>
      getSummaryTabColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    [search, searchText, searchedColumn],
  );

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: "", breadcrumbName: "Prabilling" },
  ];

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const resetToCurrentPeriod = () => {
    if (list_period_summary && list_period_summary.length > 0) {
      const now = new Date();
      const currentMonth = now.toLocaleString("en-US", { month: "short" });
      const currentYear = now.getFullYear();
      const currentPeriodName = `${currentMonth} ${currentYear}`;

      const currentPeriod = list_period_summary.find(
        (item) => item.name === currentPeriodName,
      );

      if (currentPeriod) {
        setSelectedBillingPeriod(currentPeriod.id);
      } else {
        setSelectedBillingPeriod(list_period_summary[0].id);
      }
    }
  };

  const onChangeTab = (key) => {
    if (valueTab === "All") {
      dispatch(resetAllTabData());
    } else if (valueTab === "Summary") {
      dispatch(resetSummaryData());
    }

    setValueTab(key);

    // Restore filters untuk tab yang dipilih
    const newTabKey = key === "All" ? "all_tab" : "summary_tab";
    const savedFilters = filters[newTabKey];

    if (savedFilters) {
      setSearch(savedFilters.search || {});
      setSearchText(savedFilters.searchText || "");
      setSearchedColumn(savedFilters.searchedColumn || "");
      setSort(savedFilters.sort || "");
      setPage(savedFilters.page || 1);
      if (savedFilters.selectedBillingPeriod !== null) {
        setSelectedBillingPeriod(savedFilters.selectedBillingPeriod);
      } else {
        resetToCurrentPeriod();
      }
    } else {
      setSearch({});
      setSearchText("");
      setSearchedColumn("");
      setSort("");
      setPage(1);
      resetToCurrentPeriod();
    }

    setPageDetail(false);
    setActiveRowKey(null);
    setSelectedRecord(null);
  };

  const handleBillingPeriodChange = (value) => {
    if (valueTab === "Summary") {
      dispatch(resetSummaryData());
    } else if (valueTab === "All") {
      dispatch(resetAllTabData());
    }

    setSelectedBillingPeriod(value);
    setPage(1);
    setSort("");
    setSearch({});
    setSearchText("");
    setSearchedColumn("");
    setPageDetail(false);
    setActiveRowKey(null);
    setSelectedRecord(null);

    dispatch(
      setFilters({
        tab: currentTabKey,
        filters: {
          search: {},
          sort: "",
          searchText: "",
          searchedColumn: "",
          page: 1,
          selectedBillingPeriod: value,
        },
      }),
    );
  };

  const handleDownload = () => {
    if (!selectedBillingPeriod) return;
    dispatch(
      downloadListPrabilling({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        sort,
        billPeriodId: selectedBillingPeriod,
      }),
    );
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.PRABILLING_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type={"submit"}
            border={false}
          >
            Create Prabilling
          </ButtonComponent>
        </NavLink>
      ),
    },
    ...getActionColumns(valueTab),
  ];

  const actionCols = useColumnActionPermission(["view"], itemGrantAccess).map(
    (col) => ({
      ...col,
      width: 50,
      align: "center",
    }),
  );

  const baseColumns = useMemo(() => {
    return valueTab === "All" ? allTabColumns : summaryTabColumns;
  }, [valueTab, allTabColumns, summaryTabColumns]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const tabItems = [
    {
      key: "All",
      label: "All",
      children: null,
    },
    {
      key: "Summary",
      label: "Summary Prabill",
      children: null,
    },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">PRABILLING LIST</p>
            <Toolbar items={itemGrantAccess} />
          </div>
        }
      >
        <Tabs
          items={tabItems}
          onChange={onChangeTab}
          activeKey={valueTab}
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
        />

        <div className="my-0">
          {valueTab === "All" && (
            <TableRBI
              key={`all-${selectedBillingPeriod}`}
              idTable="prabilling-table-all"
              dataSource={dataSourceWithKeys}
              columns={processedColumns}
              totalData={currentPagination?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 525 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              showRefresh={true}
              onRefresh={handleRefresh}
              loadMoreThreshold={20}
              enableRowClick={false}
              customHeaderLeft={
                <div className="flex items-center gap-1">
                  <SelectComponent
                    value={selectedBillingPeriod}
                    onChange={handleBillingPeriodChange}
                    placeholder="Select Period"
                    style={{ width: "120px" }}
                    options={(list_period_summary || []).map((item) => ({
                      label: item?.name,
                      value: item?.id,
                    }))}
                  />
                </div>
              }
            />
          )}

          {valueTab === "Summary" && (
            <TableRBI
              key={`summary-${selectedBillingPeriod}`}
              idTable="prabilling-table-summary"
              dataSource={dataSourceWithKeys}
              columns={processedColumns}
              totalData={currentPagination?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 525 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              showRefresh={true}
              onRefresh={handleRefresh}
              loadMoreThreshold={20}
              enableRowClick={true}
              selectedRowKey={activeRowKey}
              onRowClick={handleDetail}
              customHeaderLeft={
                <div className="flex items-center gap-1">
                  <SelectComponent
                    value={selectedBillingPeriod}
                    onChange={handleBillingPeriodChange}
                    placeholder="Select Period"
                    style={{ width: "120px" }}
                    options={(list_period_summary || []).map((item) => ({
                      label: item?.name,
                      value: item?.id,
                    }))}
                  />
                </div>
              }
            />
          )}
        </div>
      </CardContainer>

      {pageDetail && valueTab === "Summary" && selectedRecord && (
        <div
          ref={detailRef}
          className="mt-6 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-4"
        >
          <PrabillingSummaryDetail
            prabillAccId={selectedRecord.prabillAccId}
            customerNumber={selectedRecord.customerNumber}
            billPeriod={
              list_period_summary.find((p) => p.id === selectedBillingPeriod)
                ?.name
            }
            customerName={selectedRecord.customerName}
            accountNumber={selectedRecord.accountNumber}
            onClose={() => {
              setPageDetail(false);
              setActiveRowKey(null);
              setSelectedRecord(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default PrabillingPage;
