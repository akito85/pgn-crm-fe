import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip, Tabs, Dropdown } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import SVGIcon from "../../../../assets/Icon/index";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  getAllGasDepositPaginate,
  getApprovalHistory,
  setGasDepositFilters,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";
import { columnsGasDeposit } from "./Table/TableViewGasDeposit";
import { columnsSummaryBalance } from "./Table/TableSummaryBalance";
import GasDepositDetail from "./GasDepositDetail";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";

const DUMMY_STATUSES = ["Active", "Active", "Expired", "Active", "Expired", "Expired", "Expired", "Expired", "Active", "Active"];
const DUMMY_APPROVALS = ["Approved", "Waiting Approval", "Rejected", "Approved", "Waiting Approval", "Rejected", "Approved", "Waiting Approval", "Approved", "Waiting Approval"];
const DUMMY_HEADER_TYPES = ["Billing", "Adjustment", "Billing", "Billing", "Adjustment", "Billing", "Billing", "Adjustment", "Billing", "Billing"];
const DUMMY_MUTATION_TYPES = ["Earn", "Redeem", "Expire", "Earn", "Redeem", "Expire", "Earn", "Redeem", "Expire", "Earn"];
const DUMMY_CATEGORIES = ["Billing Adjustment", "Expired", "Cancel Expired", "Redeem", "Billing Adjustment", "Expired", "Cancel Expired", "Redeem", "Billing Adjustment", "Expired"];

const formatApprovalHistoryLabel = (key) => {
  const normalizedKey = key.toUpperCase();

  if (normalizedKey === "GAS_DEPOSIT") return "Gas Deposit";
  if (normalizedKey === "INACTIVE_GAS_DEPOSIT") return "Inactive";

  return key
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll(/\b\w/g, (char) => char.toUpperCase());
};

const mapApprovalHistoryData = (approvalHistory, preferredKeys = []) => {
  const approverSource = approvalHistory?.dataApprover || {};
  const historySource = approvalHistory?.dataHistory || {};
  const allKeys = [...new Set([...Object.keys(approverSource), ...Object.keys(historySource)])];
  const orderedKeys = [
    ...preferredKeys.filter((key) => allKeys.includes(key)),
    ...allKeys.filter((key) => !preferredKeys.includes(key)),
  ].filter((key) => (approverSource[key] || historySource[key] || []).length > 0);

  if (!orderedKeys.length) return {};

  if (orderedKeys.length === 1) {
    const selectedKey = orderedKeys[0];
    return {
      dataApprover: approverSource[selectedKey] || [],
      dataHistory: historySource[selectedKey] || [],
      tabOptions: [],
    };
  }

  const dataApprover = {};
  const dataHistory = {};

  orderedKeys.forEach((key) => {
    const normalizedKey = key.toLowerCase();
    dataApprover[normalizedKey] = approverSource[key] || [];
    dataHistory[normalizedKey] = historySource[key] || [];
  });

  return {
    dataApprover,
    dataHistory,
    tabOptions: orderedKeys.map((key) => ({
      key,
      value: formatApprovalHistoryLabel(key),
      label: formatApprovalHistoryLabel(key),
    })),
  };
};

const GasDepositPage = () => {
  const { data, loading, loading_history, data_approval_history, filters } = useSelector(
    (state) => state.gasDepositRbi,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const suppressNextRowClickRef = useRef(false);
  const dataSource = data?.result;
  const detailRef = useRef(null);

  const [page, setPage] = useState(filters?.page || 1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState(filters?.sort || "");
  const [search, setSearch] = useState(filters?.search || {});

  const [pageDetail, setPageDetail] = useState(false);
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedGasDepositData, setSelectedGasDepositData] = useState(null);
  const [activeTab, setActiveTab] = useState("gasDeposit");
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  const [fixedColumnsSummary, setFixedColumnsSummary] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "mutationStatus", "mutationApprovalStatus"],
  }));

  // Simpan filters ke Redux
  useEffect(() => {
    dispatch(setGasDepositFilters({ search, sort, page }));
  }, [search, sort, page, dispatch]);

  // Reset filters saat unmount
  useEffect(() => {
    return () => {
      dispatch(setGasDepositFilters({ search: {}, sort: "", page: 1 }));
    };
  }, [dispatch]);

  // Scroll ke detail saat row dipilih
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

  useEffect(() => {
    dispatch(
      getAllGasDepositPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      setDataApprovalHistoryFix(
        mapApprovalHistoryData(data_approval_history, ["GAS_DEPOSIT", "INACTIVE_GAS_DEPOSIT"]),
      );
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_approval_history]);

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.GAS_DEPOSIT_VIEW, breadcrumbName: "Gas Deposit" },
  ];

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] === selectedKeys[0]) return prevState;
      setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  }, []);

  const initialPageSize = 100;

  const handleLoadMore = async () => {
    const totalElements = data?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) return;

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    dispatch(
      getAllGasDepositPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
    setPage(nextPage);
  };

  const hasMore = (dataSource?.length || 0) < (data?.page?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    let dataSort = "";

    if (sorter.order) {
      const direction = sorter.order === "ascend" ? "asc" : "desc";
      dataSort = `${sorter.field}~${direction}`;
    }

    setSort(dataSort);
  };

  const handleRefresh = () => {
    dispatch(
      getAllGasDepositPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  };

  const suppressNextRowClick = useCallback(() => {
    suppressNextRowClickRef.current = true;

    setTimeout(() => {
      suppressNextRowClickRef.current = false;
    }, 0);
  }, []);

  const toggleDetail = useCallback((record) => {
    const recordKey = record.gasDepositId;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setSelectedGasDepositData(null);
    } else {
      setActiveRowKey(recordKey);
      setSelectedGasDepositData(record);
      setPageDetail(true);
    }
  }, [activeRowKey, pageDetail]);

  const handleDetail = (record) => {
    if (suppressNextRowClickRef.current) {
      suppressNextRowClickRef.current = false;
      return;
    }

    toggleDetail(record);
  };

  const handleApprovalHistory = useCallback((record) => {
    suppressNextRowClick();
    dispatch(getApprovalHistory(record.gasDepositId));
    setModalApprovalHistory(true);
  }, [dispatch, suppressNextRowClick]);

  const itemGrantAccess = useMemo(
    () => [
      {
        action: "View",
        type: "table",
        render: (record) => {
          const menuItems = [
            {
              key: "update",
              label: (
                <div className="flex items-center gap-2">
                  <SVGIcon name="IconUpdateAction" width={16} />
                  <span>Update</span>
                </div>
              ),
              onClick: () =>
                navigate(RBI_ROUTES.GAS_DEPOSIT_UPDATE, {
                  state: {
                    mode: "update",
                    selectedData: record,
                  },
                }),
            },
            {
              key: "approvalHistory",
              label: (
                <div className="flex items-center gap-2">
                  <SVGIcon name="IconLogHistory" width={16} />
                  <span>Approval History</span>
                </div>
              ),
              onClick: () => handleApprovalHistory(record),
            },
            {
              key: "viewAccountDetail",
              label: (
                <div className="flex items-center gap-2">
                  <SVGIcon name="IconDetail" width={16} />
                  <span>View Account Detail</span>
                </div>
              ),
              onClick: () => {
                suppressNextRowClick();
                toggleDetail(record);
              },
            },
            {
              type: "divider",
            },
            {
              key: "cancel",
              label: (
                <div className="flex items-center gap-2">
                  <SVGIcon name="IconSquareX" color="#ef4444" width={16} />
                  <span className="text-red-500">Cancel</span>
                </div>
              ),
              onClick: () => {},
            },
          ];
          return (
            <div className="flex items-center justify-center gap-2">
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button
                  type="button"
                  data-stop-row-click="true"
                  className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    suppressNextRowClick();
                  }}
                >
                  <SVGIcon name="IconTripleDot" color="#0075bf" width={20} />
                </button>
              </Dropdown>
              <Tooltip title="View Detail">
                <button
                  type="button"
                  data-stop-row-click="true"
                  className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    suppressNextRowClick();
                    toggleDetail(record);
                  }}
                >
                  <SVGIcon name="IconDetail" color="#0075bf" width={20} />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [handleApprovalHistory, navigate, suppressNextRowClick, toggleDetail],
  );

  const baseColumns = useMemo(() => {
    return columnsGasDeposit(
      0,
      0,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    );
  }, [searchInput, searchedColumn, searchText, handleSearch, search]);

  const allColumns = useMemo(() => {
    const actionColumn = {
      key: "action",
      title: "ACTION",
      dataIndex: "action",
      width: 60,
      align: "center",
      render: (text, record) => itemGrantAccess[0].render(record),
    };

    return [...baseColumns, actionColumn].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, itemGrantAccess]);

  const processedColumns = useMemo(
    () => applyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns],
  );

  const columnDefinitions = useMemo(
    () =>
      allColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [allColumns],
  );

  const dataSourceWithKeys = useMemo(
    () =>
      dataSource?.map((item, idx) => ({
        ...item,
        key: item.gasDepositId,
        status: item.status ?? DUMMY_STATUSES[idx % DUMMY_STATUSES.length],
        statusApproval: item.statusApproval ?? DUMMY_APPROVALS[idx % DUMMY_APPROVALS.length],
        mutationApprovalStatus: item.mutationApprovalStatus ?? DUMMY_APPROVALS[idx % DUMMY_APPROVALS.length],
        mutationStatus: item.mutationStatus ?? DUMMY_STATUSES[idx % DUMMY_STATUSES.length],
        // summary-specific dummy fields
        sor: item.sor ?? `0${(idx % 9) + 11} - {value}`,
        costCenter: item.costCenter ?? "{value}",
        accountSegment: item.accountSegment ?? "{value}",
        meterReadingCode: item.meterReadingCode ?? "{value}",
        earnPeriod: item.earnPeriod ?? "{value}",
        period: item.period ?? "{value}",
        periodRedeemStart: item.periodRedeemStart ?? idx === 0 ? "1-Jul-25" : "{value}",
        periodRedeemEnd: item.periodRedeemEnd ?? idx === 0 ? "31-Dec-25" : "{value}",
        billingPeriod: item.billingPeriod ?? "{value}",
        timeUnit: item.timeUnit ?? "{value}",
        currency: item.currency ?? "{value}",
        uom: item.uom ?? "{value}",
        quantity: item.quantity ?? null,
        balanceAmount: item.balanceAmount ?? null,
        headerType: item.headerType ?? DUMMY_HEADER_TYPES[idx % DUMMY_HEADER_TYPES.length],
        accountType: item.accountType ?? "{value}",
        classificationType: item.classificationType ?? "{value}",
        source: item.source ?? "{value}",
        sapCustId: item.sapCustId ?? "{value}",
        mutationDate: item.mutationDate ?? "{value}",
        mutationType: item.mutationType ?? DUMMY_MUTATION_TYPES[idx % DUMMY_MUTATION_TYPES.length],
        category: item.category ?? DUMMY_CATEGORIES[idx % DUMMY_CATEGORIES.length],
        volume: item.volume ?? null,
        price: item.price ?? null,
        detailType: item.detailType ?? "{value}",
        amount: item.amount ?? null,
        description: item.description ?? "{value}",
      })),
    [dataSource],
  );

  const baseSummaryColumns = useMemo(() => {
    return columnsSummaryBalance(
      0,
      0,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    );
  }, [searchInput, searchedColumn, searchText, handleSearch, search]);

  const allSummaryColumns = useMemo(() => {
    return baseSummaryColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseSummaryColumns]);

  const processedSummaryColumns = useMemo(
    () => applyFixedColumns(allSummaryColumns, fixedColumnsSummary),
    [allSummaryColumns, fixedColumnsSummary],
  );

  const summaryColumnDefinitions = useMemo(
    () =>
      allSummaryColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [allSummaryColumns],
  );

  const tabItems = [
    { key: "gasDeposit", label: "Gas Deposit", children: null },
    { key: "summaryBalance", label: "Summary Balance", children: null },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">GAS DEPOSIT LIST</p>
            <div className="flex items-center gap-2">
              <ButtonComponent
                icon={<SVGIcon name="IconRequestApproval" width={16} color="#FFF" />}
                type="submit"
                border={false}
                onClick={() => {}}
              >
                Approval Expired
              </ButtonComponent>
              <ButtonComponent
                icon={<SVGIcon name="IconCalendarEvent" width={16} />}
                type="submit"
                border={false}
                onClick={() => navigate(RBI_ROUTES.GAS_DEPOSIT_EXPIRED_CREATE)}
              >
                Expired Gas Deposit
              </ButtonComponent>
              <ButtonComponent
                icon={<SVGIcon name="IconButtonDownload" width={16} />}
                type="submit"
                border={false}
                onClick={() => {}}
              >
                Download List
              </ButtonComponent>
              <ButtonComponent
                icon={<SVGIcon name="IconButtonCreate" width={16} />}
                type="submit"
                border={false}
                onClick={() => navigate(RBI_ROUTES.GAS_DEPOSIT_CREATE)}
              >
                Create
              </ButtonComponent>
              <Toolbar items={itemGrantAccess} />
            </div>
          </div>
        }
      >
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={setActiveTab}
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
        />

        {activeTab === "gasDeposit" && (
          <TableRBI
            idTable="gas-deposit-table"
            dataSource={dataSourceWithKeys}
            columns={processedColumns}
            totalData={data?.page?.totalElements || 0}
            tableScrolled={{ x: 5000, y: 525 }}
            onSort={onSort}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            showRefresh={true}
            onRefresh={handleRefresh}
            loadMoreThreshold={15}
            enableRowClick={true}
            selectedRowKey={activeRowKey}
            onRowClick={handleDetail}
          />
        )}

        {activeTab === "summaryBalance" && (
          <TableRBI
            idTable="gas-deposit-summary-table"
            dataSource={dataSourceWithKeys}
            columns={processedSummaryColumns}
            totalData={data?.page?.totalElements || 0}
            tableScrolled={{ x: 10000, y: 525 }}
            onSort={onSort}
            columnDefinitions={summaryColumnDefinitions}
            fixedColumns={fixedColumnsSummary}
            setFixedColumns={setFixedColumnsSummary}
            loading={loading}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            showRefresh={true}
            onRefresh={handleRefresh}
            loadMoreThreshold={15}
          />
        )}
      </CardContainer>

      {pageDetail && (
        <div
          ref={detailRef}
          className="mt-0 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-0"
        >
          <GasDepositDetail
            selectedData={selectedGasDepositData}
            onClose={() => {
              setPageDetail(false);
              setActiveRowKey(null);
              setSelectedGasDepositData(null);
            }}
          />
        </div>
      )}

      <ModalHistory
        isOpen={modalApprovalHistory && !!dataApprovalHistoryFix}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        width={1000}
        tabOptions={dataApprovalHistoryFix?.tabOptions}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
        loading={loading_history}
      />
    </>
  );
};

export default GasDepositPage;
