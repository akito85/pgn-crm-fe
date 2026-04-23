import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip, Tabs, Dropdown } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../assets/Icon/index";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  getMutationSummaryPaginate,
  getApprovalHistory,
  setGasDepositFilters,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";
import { columnsGasDeposit } from "../../RatingBillingInvoice/GasDeposit/Table/TableViewGasDeposit";
import { columnsSummaryBalance } from "../../RatingBillingInvoice/GasDeposit/Table/TableSummaryBalance";
import PayGasDepositeDetail from "./PayGasDepositeDetail";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";

const DUMMY_GAS_DEPOSIT_DATA = [
  {
    key: 1, gasDepositId: 1,
    customerNumber: "100001", customerName: "PT Industri Gas Nusantara",
    accountNumber: "1000001", accountName: "Gas Deposit - Industri Gas Nusantara",
    accountGroupType: "Industrial", sor: "011 - PGN Surabaya",
    costCenter: "CC-011", accountSegment: "I", meterReadingCode: "MR-0001",
    currency: "IDR", uom: "MMBTU",
    termsEarn: 12, termsRedeem: 6, periodEarn: "Jan-26",
    periodRedeemStart: "01-Jul-25", periodRedeemEnd: "31-Dec-25",
    period: "Jan-26", timeUnit: "Month",
    amount: 500000000, cashBalance: 500000000, type: "Gas",
    accountType: "GAS", classificationType: "Type A", source: "Billing",
    description: "Gas deposit pembayaran bulan Januari 2026",
    status: "Active", statusApproval: "Approved",
    mutationStatus: "Active", mutationApprovalStatus: "Approved",
  },
  {
    key: 2, gasDepositId: 2,
    customerNumber: "100002", customerName: "PT Energi Sentosa",
    accountNumber: "1000002", accountName: "Gas Deposit - Energi Sentosa",
    accountGroupType: "Commercial", sor: "012 - PGN Jakarta",
    costCenter: "CC-012", accountSegment: "C", meterReadingCode: "MR-0002",
    currency: "IDR", uom: "MMBTU",
    termsEarn: 6, termsRedeem: 3, periodEarn: "Feb-26",
    periodRedeemStart: "01-Aug-25", periodRedeemEnd: "28-Feb-26",
    period: "Feb-26", timeUnit: "Month",
    amount: 300000000, cashBalance: 250000000, type: "Gas",
    accountType: "GAS", classificationType: "Type B", source: "Adjustment",
    description: "Gas deposit pembayaran bulan Februari 2026",
    status: "Active", statusApproval: "Waiting Approval",
    mutationStatus: "Active", mutationApprovalStatus: "Waiting Approval",
  },
  {
    key: 3, gasDepositId: 3,
    customerNumber: "100003", customerName: "PT Maju Jaya Mandiri",
    accountNumber: "1000003", accountName: "Gas Deposit - Maju Jaya Mandiri",
    accountGroupType: "Industrial", sor: "013 - PGN Bandung",
    costCenter: "CC-013", accountSegment: "I", meterReadingCode: "MR-0003",
    currency: "IDR", uom: "MMBTU",
    termsEarn: 24, termsRedeem: 12, periodEarn: "Mar-26",
    periodRedeemStart: "01-Jan-26", periodRedeemEnd: "31-Mar-26",
    period: "Mar-26", timeUnit: "Month",
    amount: 750000000, cashBalance: 600000000, type: "Gas",
    accountType: "GAS", classificationType: "Type A", source: "Billing",
    description: "Gas deposit pembayaran bulan Maret 2026",
    status: "Expired", statusApproval: "Approved",
    mutationStatus: "Expired", mutationApprovalStatus: "Approved",
  },
  {
    key: 4, gasDepositId: 4,
    customerNumber: "100004", customerName: "CV Sumber Energi Baru",
    accountNumber: "1000004", accountName: "Gas Deposit - Sumber Energi Baru",
    accountGroupType: "Small Business", sor: "014 - PGN Medan",
    costCenter: "CC-014", accountSegment: "S", meterReadingCode: "MR-0004",
    currency: "IDR", uom: "MMBTU",
    termsEarn: 12, termsRedeem: 6, periodEarn: "Apr-26",
    periodRedeemStart: "01-Oct-25", periodRedeemEnd: "30-Apr-26",
    period: "Apr-26", timeUnit: "Month",
    amount: 150000000, cashBalance: 150000000, type: "Gas",
    accountType: "GAS", classificationType: "Type C", source: "Billing",
    description: "Gas deposit pembayaran bulan April 2026",
    status: "Active", statusApproval: "Rejected",
    mutationStatus: "Active", mutationApprovalStatus: "Rejected",
  },
  {
    key: 5, gasDepositId: 5,
    customerNumber: "100005", customerName: "PT Gas Bumi Perkasa",
    accountNumber: "1000005", accountName: "Gas Deposit - Gas Bumi Perkasa",
    accountGroupType: "Industrial", sor: "015 - PGN Semarang",
    costCenter: "CC-015", accountSegment: "I", meterReadingCode: "MR-0005",
    currency: "IDR", uom: "MMBTU",
    termsEarn: 18, termsRedeem: 9, periodEarn: "May-26",
    periodRedeemStart: "01-Nov-25", periodRedeemEnd: "31-May-26",
    period: "May-26", timeUnit: "Month",
    amount: 900000000, cashBalance: 850000000, type: "Gas",
    accountType: "GAS", classificationType: "Type A", source: "Billing",
    description: "Gas deposit pembayaran bulan Mei 2026",
    status: "Expired", statusApproval: "Approved",
    mutationStatus: "Expired", mutationApprovalStatus: "Approved",
  },
];

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

const PayGasDepositePage = () => {
  const { loading_history, data_approval_history, filters, data_mutation_summary, loading_mutation_summary } = useSelector(
    (state) => state.gasDepositRbi,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const suppressNextRowClickRef = useRef(false);
  const detailRef = useRef(null);

  const [page, setPage] = useState(filters?.page || 1);
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

  // API not ready — using dummy data

  // Fetch summary balance when tab is active
  useEffect(() => {
    if (activeTab === "summaryBalance") {
      dispatch(
        getMutationSummaryPaginate({
          page: 1,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          sort: sort || "accountNumber~asc",
        }),
      );
    }
  }, [dispatch, activeTab, search, sort]);

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
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW, breadcrumbName: "Gas Deposite" },
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

  const handleLoadMore = async () => {};

  const hasMore = false;

  const onSort = (_, __, sorter) => {
    let dataSort = "";

    if (sorter.order) {
      const direction = sorter.order === "ascend" ? "asc" : "desc";
      dataSort = `${sorter.field}~${direction}`;
    }

    setSort(dataSort);
  };

  const handleRefresh = () => {};

  const suppressNextRowClick = useCallback(() => {
    suppressNextRowClickRef.current = true;

    setTimeout(() => {
      suppressNextRowClickRef.current = false;
    }, 0);
  }, []);

  const toggleDetail = useCallback(
    (record) => {
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
    },
    [activeRowKey, pageDetail],
  );

  const handleDetail = (record) => {
    if (suppressNextRowClickRef.current) {
      suppressNextRowClickRef.current = false;
      return;
    }

    toggleDetail(record);
  };

  const handleApprovalHistory = useCallback(
    (record) => {
      suppressNextRowClick();
      dispatch(getApprovalHistory(record.gasDepositId));
      setModalApprovalHistory(true);
    },
    [dispatch, suppressNextRowClick],
  );

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
                navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_UPDATE, {
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

  const dataSourceWithKeys = DUMMY_GAS_DEPOSIT_DATA;

  const summaryDataSourceWithKeys = useMemo(
    () =>
      data_mutation_summary?.result?.map((item) => ({
        ...item,
        key: item.accountId,
        quantity: item.balanceVolume ?? null,
        amount: item.balanceAmount ?? null,
        status: item.statusMaster ?? null,
        redeemStartDate: item.redeemStartDate ?? null,
        redeemEndDate: item.redeemEndDate ?? null,
        earnPeriod: item.earnStartDate ?? null,
      })) ?? [],
    [data_mutation_summary],
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
                onClick={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_EXPIRED_CREATE)}
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
                onClick={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_CREATE)}
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
            idTable="rc-gas-deposite-table"
            dataSource={dataSourceWithKeys}
            columns={processedColumns}
            totalData={DUMMY_GAS_DEPOSIT_DATA.length}
            tableScrolled={{ x: 5000, y: 525 }}
            onSort={onSort}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={false}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={false}
            showRefresh={true}
            onRefresh={handleRefresh}
            enableRowClick={true}
            selectedRowKey={activeRowKey}
            onRowClick={handleDetail}
          />
        )}

        {activeTab === "summaryBalance" && (
          <TableRBI
            idTable="rc-gas-deposite-summary-table"
            dataSource={summaryDataSourceWithKeys}
            columns={processedSummaryColumns}
            totalData={data_mutation_summary?.page?.totalElements || 0}
            tableScrolled={{ x: 10000, y: 525 }}
            onSort={onSort}
            columnDefinitions={summaryColumnDefinitions}
            fixedColumns={fixedColumnsSummary}
            setFixedColumns={setFixedColumnsSummary}
            loading={loading_mutation_summary}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={false}
            showRefresh={true}
            onRefresh={() =>
              dispatch(
                getMutationSummaryPaginate({
                  page: 1,
                  pageSize: 100,
                  search: encodeURIComponent(JSON.stringify(search)),
                  sort: sort || "accountNumber~asc",
                }),
              )
            }
          />
        )}
      </CardContainer>

      {pageDetail && (
        <div
          ref={detailRef}
          className="mt-0 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-0"
        >
          <PayGasDepositeDetail
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

export default PayGasDepositePage;
