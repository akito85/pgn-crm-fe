import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import { NavLink } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import {
  getListPrabillingInitPopulate,
  getListPrabillingSummary,
  getListBillingPeriodForPrabilling,
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
  } = useSelector((state) => state.rbi_prabilling);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const detailRef = useRef(null);

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [valueTab, setValueTab] = useState("All");
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);

  // States for detail view
  const [pageDetail, setPageDetail] = useState(false);
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: valueTab === "All" ? ["action"] : [],
  }));

  // Fetch billing periods on mount
  useEffect(() => {
    dispatch(getListBillingPeriodForPrabilling());
  }, [dispatch]);

  // Set default billing period
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
        (item) => item.name === currentPeriodName
      );

      if (currentPeriod) {
        setSelectedBillingPeriod(currentPeriod.name);
      } else {
        const latestPeriod =
          list_period_summary[list_period_summary.length - 1];
        setSelectedBillingPeriod(latestPeriod.name);
      }
    }
  }, [list_period_summary, selectedBillingPeriod]);

  useEffect(() => {
    setFixedColumns({
      left: ["no"],
      right: valueTab === "All" ? ["action"] : [],
    });
  }, [valueTab]);

  // Scroll to detail when opened
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

  // Fetch data based on active tab
  useEffect(() => {
    if (valueTab === "All") {
      dispatch(
        getListPrabillingInitPopulate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: 100,
          sort,
          isLoadMore: false,
        })
      );
    } else if (valueTab === "Summary" && selectedBillingPeriod) {
      dispatch(
        getListPrabillingSummary({
          billPeriod: selectedBillingPeriod,
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: 100,
          sort,
          isLoadMore: false,
        })
      );
    }
    setPage(1);
  }, [dispatch, search, sort, valueTab, selectedBillingPeriod]);

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
    const nextPage = page + 1;
    const currentPagination =
      valueTab === "All" ? prabilling_pagination : summary_pagination;
    const totalPages = currentPagination?.totalPages || 0;

    if (nextPage <= totalPages) {
      if (valueTab === "All") {
        await dispatch(
          getListPrabillingInitPopulate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: nextPage,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: true,
          })
        );
      } else if (selectedBillingPeriod) {
        await dispatch(
          getListPrabillingSummary({
            billPeriod: selectedBillingPeriod,
            search: encodeURIComponent(JSON.stringify(search)),
            page: nextPage,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: true,
          })
        );
      }
      setPage(nextPage);
    }
  };

  const handleRefresh = () => {
    if (valueTab === "All") {
      dispatch(
        getListPrabillingInitPopulate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: page * loadMoreSize || 100,
          sort,
          isLoadMore: false,
        })
      );
    } else if (selectedBillingPeriod) {
      dispatch(
        getListPrabillingSummary({
          billPeriod: selectedBillingPeriod,
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: page * loadMoreSize || 100,
          sort,
          isLoadMore: false,
        })
      );
    }
    setPage(1);
  };

  const handleDetail = (record, rowKey) => {
    // Only work on Summary tab
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

  // Add keys to data - FIX: dependency harus include valueTab
  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];
    
    return currentData.map((item) => ({
      ...item,
      key: valueTab === "All" ? item.initCode : item.customerNumber,
    }));
  }, [currentData, valueTab]);

  // Get columns from separate file
  const allTabColumns = useMemo(
    () =>
      getAllTabColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchText, searchedColumn]
  );

  const summaryTabColumns = useMemo(
    () =>
      getSummaryTabColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchText, searchedColumn]
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

  const onChangeTab = (key) => {
    setValueTab(key);
    setSearch({});
    setSearchText("");
    setSearchedColumn("");
    setSort("");  // FIX: Reset sort juga
    setPage(1);
    // Close detail when changing tabs
    setPageDetail(false);
    setActiveRowKey(null);
    setSelectedRecord(null);
  };

  const handleBillingPeriodChange = (value) => {
    setSelectedBillingPeriod(value);
    setPage(1);
    // Close detail when changing period
    setPageDetail(false);
    setActiveRowKey(null);
    setSelectedRecord(null);
  };

  const itemGrantAccess = [
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
      width: 30,
      align: "center",
    })
  );

  // FIX: baseColumns harus re-compute ketika valueTab berubah
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
    <LayoutMenu>
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
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
        />

        <div className="my-0">
          <TableRBI
            key={valueTab} // FIX: Tambahkan key untuk force re-render table
            idTable="prabilling-table"
            dataSource={dataSourceWithKeys}
            columns={processedColumns}
            totalData={currentPagination?.totalElements || 0}
            tableScrolled={{ x: valueTab === "All" ? 3000 : 2500, y: 525 }}
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
            enableRowClick={valueTab === "Summary"}
            selectedRowKey={activeRowKey}
            onRowClick={handleDetail}
            customHeaderLeft={
              valueTab === "Summary" ? (
                <div className="flex items-center gap-1">
                  <SelectComponent
                    value={selectedBillingPeriod}
                    onChange={handleBillingPeriodChange}
                    placeholder="Select Period"
                    style={{ width: "120px" }}
                    options={(list_period_summary || []).map((item) => ({
                      label: item?.name,
                      value: item?.name,
                    }))}
                  />
                </div>
              ) : null
            }
          />
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
            billPeriod={selectedBillingPeriod}
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
    </LayoutMenu>
  );
};

export default PrabillingPage;