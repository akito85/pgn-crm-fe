import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dropdown, Tabs, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../assets/Icon/index";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  getPayGasDepositApprovalHistory,
  getPayGasDepositExpiredHistory,
  getPayGasDepositPaginate,
  getPayGasDepositSummaryBalancePaginate,
  setPayGasDepositFilters,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";
import { columnsGasDeposit } from "../../RatingBillingInvoice/GasDeposit/Table/TableViewGasDeposit";
import { columnsSummaryBalance } from "../../RatingBillingInvoice/GasDeposit/Table/TableSummaryBalance";
import PayGasDepositeDetail from "./PayGasDepositeDetail";
import TableRBI from "../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";

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
  const {
    loading_list,
    loading_summary_balance,
    loading_history,
    loading_expired_history,
    data_list,
    data_summary_balance,
    data_approval_history,
    data_expired_history,
    filters,
  } = useSelector((state) => state.gasDepositPayment);

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

  const [fixedColumnsExpiredHistory, setFixedColumnsExpiredHistory] = useState(() => ({
    left: ["no"],
    right: ["statusApproval", "status"],
  }));

  useEffect(() => {
    dispatch(setPayGasDepositFilters({ search, sort, page }));
  }, [dispatch, page, search, sort]);

  useEffect(() => {
    if (activeTab === "gasDeposit") {
      dispatch(
        getPayGasDepositPaginate({
          page,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          sort: sort || "accountNumber~asc",
        }),
      );
    }
  }, [activeTab, dispatch, page, search, sort]);

  useEffect(() => {
    if (activeTab === "summaryBalance") {
      dispatch(
        getPayGasDepositSummaryBalancePaginate({
          page,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          sort: sort || "mutationDate~desc",
        }),
      );
    }
  }, [activeTab, dispatch, page, search, sort]);

  useEffect(() => {
    if (activeTab === "historyExpired") {
      dispatch(getPayGasDepositExpiredHistory());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (pageDetail && activeRowKey && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [activeRowKey, pageDetail]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      setDataApprovalHistoryFix(
        mapApprovalHistoryData(data_approval_history, ["GAS_DEPOSIT", "INACTIVE_GAS_DEPOSIT"]),
      );
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_approval_history]);

  useEffect(() => {
    if (activeTab !== "gasDeposit" && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setSelectedGasDepositData(null);
    }
  }, [activeTab, pageDetail]);

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

  const onSort = (_, __, sorter) => {
    let dataSort = "";
    if (sorter.order) {
      const direction = sorter.order === "ascend" ? "asc" : "desc";
      dataSort = `${sorter.field}~${direction}`;
    }
    setSort(dataSort);
  };

  const handleRefresh = useCallback(() => {
    if (activeTab === "summaryBalance") {
      dispatch(
        getPayGasDepositSummaryBalancePaginate({
          page,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          sort: sort || "mutationDate~desc",
        }),
      );
      return;
    }

    if (activeTab === "historyExpired") {
      dispatch(getPayGasDepositExpiredHistory());
      return;
    }

    dispatch(
      getPayGasDepositPaginate({
        page,
        pageSize: 100,
        search: encodeURIComponent(JSON.stringify(search)),
        sort: sort || "accountNumber~asc",
      }),
    );
  }, [activeTab, dispatch, page, search, sort]);

  const suppressNextRowClick = useCallback(() => {
    suppressNextRowClickRef.current = true;
    setTimeout(() => {
      suppressNextRowClickRef.current = false;
    }, 0);
  }, []);

  const toggleDetail = useCallback(
    (record) => {
      const recordKey = record.accountId;

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
      dispatch(
        getPayGasDepositApprovalHistory({
          accountId: record.accountId,
          summaryRefId: record.pendingStgSumId,
        }),
      );
      setModalApprovalHistory(true);
    },
    [dispatch, suppressNextRowClick],
  );

  const actionRenderer = useCallback((record) => {
    const menuItems = [
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
    ];

    return (
      <div className="flex items-center justify-center gap-2">
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
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
  }, [handleApprovalHistory, suppressNextRowClick, toggleDetail]);

  const baseColumns = useMemo(() => (
    columnsGasDeposit(
      0,
      0,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    )
  ), [searchedColumn, search, searchText, handleSearch]);

  const allColumns = useMemo(() => {
    const actionColumn = {
      key: "action",
      title: "ACTION",
      dataIndex: "action",
      width: 60,
      align: "center",
      render: (text, record) => actionRenderer(record),
    };

    return [...baseColumns, actionColumn].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [actionRenderer, baseColumns]);

  const processedColumns = useMemo(
    () => applyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns],
  );

  const columnDefinitions = useMemo(
    () => allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    })),
    [allColumns],
  );

  const dataSourceWithKeys = useMemo(
    () => (
      data_list?.result?.map((item) => ({
        ...item,
        key: item.accountId,
        gasDepositId: item.masterGasDepositId || item.accountId,
        status: item.statusMaster ?? "-",
        amount: item.balanceAmount ?? null,
        cashBalance: item.balanceAmount ?? null,
      })) ?? []
    ),
    [data_list],
  );

  const summaryDataSourceWithKeys = useMemo(
    () => (
      data_summary_balance?.result?.map((item, index) => ({
        ...item,
        key: `${item.accountNumber}-${item.period}-${item.mutationType}-${index}`,
        quantity: item.quantity ?? null,
        balanceAmount: item.balanceAmount ?? null,
        redeemStartDate: item.periodRedeemStart ?? null,
        redeemEndDate: item.periodRedeemEnd ?? null,
        earnPeriod: item.earnStartDate ?? null,
      })) ?? []
    ),
    [data_summary_balance],
  );

  const expiredHistoryDataSource = useMemo(
    () => (
      (data_expired_history || []).map((item, index) => ({
        ...item,
        key: item.payExpId,
        no: index + 1,
      }))
    ),
    [data_expired_history],
  );

  useEffect(() => {
    if (!activeRowKey || !dataSourceWithKeys.length) {
      return;
    }

    const matchedRecord = dataSourceWithKeys.find((item) => item.accountId === activeRowKey);
    if (matchedRecord) {
      setSelectedGasDepositData(matchedRecord);
    }
  }, [activeRowKey, dataSourceWithKeys]);

  const baseSummaryColumns = useMemo(() => (
    columnsSummaryBalance(
      0,
      0,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    )
  ), [searchedColumn, search, searchText, handleSearch]);

  const allSummaryColumns = useMemo(
    () => baseSummaryColumns.map((col) => {
      const columnKey = col.key || col.dataIndex || col.title;
      const compactStatusWidths = {
        status: 80,
        statusApproval: 110,
        mutationStatus: 100,
        mutationApprovalStatus: 120,
      };
      const compactStatusTitles = {
        status: "STATUS",
        statusApproval: "APPROVAL",
        mutationStatus: "MUT. STATUS",
        mutationApprovalStatus: "MUT. APPROVAL",
      };

      return {
        ...col,
        key: columnKey,
        width: compactStatusWidths[columnKey] ?? col.width,
        title: compactStatusTitles[columnKey] ?? col.title,
        ellipsis: columnKey in compactStatusWidths ? true : col.ellipsis,
      };
    }),
    [baseSummaryColumns],
  );

  const processedSummaryColumns = useMemo(
    () => applyFixedColumns(allSummaryColumns, fixedColumnsSummary),
    [allSummaryColumns, fixedColumnsSummary],
  );

  const summaryColumnDefinitions = useMemo(
    () => allSummaryColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    })),
    [allSummaryColumns],
  );

  const expiredHistoryColumns = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 60, align: "center" },
    { key: "payExpId", title: "PAY EXP ID", dataIndex: "payExpId", width: 120 },
    { key: "rbiLedgerId", title: "RBI LEDGER ID", dataIndex: "rbiLedgerId", width: 140 },
    {
      key: "expiredBalance",
      title: "EXPIRED BALANCE",
      dataIndex: "expiredBalance",
      width: 160,
      align: "right",
      render: (value) => (value === null || value === undefined || value === "" ? "-" : new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value))),
    },
    { key: "currency", title: "CURRENCY", dataIndex: "currency", width: 100, render: (value) => value || "-" },
    { key: "rateType", title: "RATE TYPE", dataIndex: "rateType", width: 140, render: (value) => value || "-" },
    {
      key: "rate",
      title: "RATE",
      dataIndex: "rate",
      width: 120,
      align: "right",
      render: (value) => (value === null || value === undefined || value === "" ? "-" : new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value))),
    },
    {
      key: "eqvExpiredBalance",
      title: "EQV EXPIRED BALANCE",
      dataIndex: "eqvExpiredBalance",
      width: 190,
      align: "right",
      render: (value) => (value === null || value === undefined || value === "" ? "-" : new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value))),
    },
    { key: "statusApproval", title: "STATUS APPROVAL", dataIndex: "statusApproval", width: 160, align: "center" },
    { key: "status", title: "STATUS", dataIndex: "status", width: 120, align: "center", render: (value) => value || "-" },
    { key: "createdBy", title: "CREATED BY", dataIndex: "createdBy", width: 140, render: (value) => value || "-" },
    { key: "createdDtm", title: "CREATED DATE", dataIndex: "createdDtm", width: 180, render: (value) => value || "-" },
    { key: "updatedBy", title: "UPDATED BY", dataIndex: "updatedBy", width: 140, render: (value) => value || "-" },
    { key: "updatedDtm", title: "UPDATED DATE", dataIndex: "updatedDtm", width: 180, render: (value) => value || "-" },
  ], []);

  const processedExpiredHistoryColumns = useMemo(
    () => applyFixedColumns(expiredHistoryColumns, fixedColumnsExpiredHistory),
    [expiredHistoryColumns, fixedColumnsExpiredHistory],
  );

  const expiredHistoryColumnDefinitions = useMemo(
    () => expiredHistoryColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    })),
    [expiredHistoryColumns],
  );

  const tabItems = [
    { key: "gasDeposit", label: "Gas Deposit", children: null },
    { key: "summaryBalance", label: "Summary Balance", children: null },
    { key: "historyExpired", label: "History", children: null },
  ];

  const renderShowingRows = (rowCount) => (
    <div className="flex justify-end mt-2 text-sm text-gray-600">
      Showing {rowCount} rows | <span className="text-green-600 ml-1">All data showed</span>
    </div>
  );

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={(
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">GAS DEPOSIT LIST</p>
            <div className="flex items-center gap-2">
              <ButtonComponent
                icon={<SVGIcon name="IconRequestApproval" width={16} color="#FFF" />}
                type="submit"
                border={false}
                onClick={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_EXPIRED_APPROVAL)}
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
            </div>
          </div>
        )}
      >
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={setActiveTab}
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
        />

        {activeTab === "gasDeposit" && (
          <>
            <TableRBI
              idTable="rc-gas-deposite-table"
              dataSource={dataSourceWithKeys}
              columns={processedColumns}
              totalData={data_list?.page?.totalElements || 0}
              tableScrolled={{ x: 5000, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading_list}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={false}
              showRefresh={true}
              onRefresh={handleRefresh}
              enableRowClick={true}
              selectedRowKey={activeRowKey}
              onRowClick={handleDetail}
            />
            {renderShowingRows(dataSourceWithKeys.length)}
          </>
        )}

        {activeTab === "summaryBalance" && (
          <>
            <TableRBI
              idTable="rc-gas-deposite-summary-table"
              dataSource={summaryDataSourceWithKeys}
              columns={processedSummaryColumns}
              totalData={data_summary_balance?.page?.totalElements || 0}
              tableScrolled={{ x: 10000, y: 525 }}
              onSort={onSort}
              columnDefinitions={summaryColumnDefinitions}
              fixedColumns={fixedColumnsSummary}
              setFixedColumns={setFixedColumnsSummary}
              loading={loading_summary_balance}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={false}
              showRefresh={true}
              onRefresh={handleRefresh}
            />
            {renderShowingRows(summaryDataSourceWithKeys.length)}
          </>
        )}

        {activeTab === "historyExpired" && (
          <>
            <TableRBI
              idTable="rc-gas-deposite-expired-history-table"
              dataSource={expiredHistoryDataSource}
              columns={processedExpiredHistoryColumns}
              totalData={expiredHistoryDataSource.length}
              tableScrolled={{ x: 2400, y: 525 }}
              onSort={onSort}
              columnDefinitions={expiredHistoryColumnDefinitions}
              fixedColumns={fixedColumnsExpiredHistory}
              setFixedColumns={setFixedColumnsExpiredHistory}
              loading={loading_expired_history}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={false}
              showRefresh={true}
              onRefresh={handleRefresh}
            />
            {renderShowingRows(expiredHistoryDataSource.length)}
          </>
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
