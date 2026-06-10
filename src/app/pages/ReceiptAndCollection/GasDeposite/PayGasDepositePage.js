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
import { columnsPayGasDeposit } from "./Table/TablePayGasDeposit";
import { columnsPaySummaryBalance } from "./Table/TablePaySummaryBalance";
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

const resolveSummaryReferenceId = (record) =>
  record?.referenceId
  ?? record?.payGasDepId
  ?? record?.masterGasDepositId;

const resolvePayGasDepositId = (record) =>
  record?.payGasDepId
  ?? record?.masterGasDepositId
  ?? record?.gasDepositId
  ?? resolveSummaryReferenceId(record);

const resolveRbiGasDepositId = (record) =>
  record?.rbiGasDepId
  ?? record?.rbiGasDepositId
  ?? null;

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

const getPaymentGasDepositRowKey = (record) =>
  resolvePayGasDepositId(record) ??
  resolveSummaryReferenceId(record) ??
  record?.masterGasDepositId ??
  record?.accountId ??
  record?.accountNumber;

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
      const recordKey = getPaymentGasDepositRowKey(record);

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
          payGasDepId: resolveSummaryReferenceId(record),
          billingPeriod: record.billingPeriod ?? record.period,
        }),
      );
      setModalApprovalHistory(true);
    },
    [dispatch, suppressNextRowClick],
  );

  const actionRenderer = useCallback((record) => {
    const isEditable = record.statusApproval === "Draft" || record.statusApproval === "Rejected";
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
        disabled: !isEditable,
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
        disabled: !isEditable,
        onClick: () => {},
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
  }, [handleApprovalHistory, navigate, suppressNextRowClick, toggleDetail]);

  const baseColumns = useMemo(() => (
    columnsPayGasDeposit(
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
        key: getPaymentGasDepositRowKey(item),
        accountId: item.accountId,
        referenceId: resolveSummaryReferenceId(item),
        payGasDepId: resolvePayGasDepositId(item),
        rbiGasDepositId: resolveRbiGasDepositId(item),
        gasDepositId: resolvePayGasDepositId(item),
        status: item.status ?? "-",
        source: item.source ?? null,
        paymentDate: item.paymentDate ?? null,
        bank: item.bank ?? null,
        balance:
          item.balance ??
          item.billingAmountBalance ??
          item.expiredBalance ??
          item.amount ??
          null,
        rateType: item.rateType ?? null,
        rateDate: item.rateDate ?? null,
        rate: item.rate ?? null,
        eqvBalance:
          item.eqvBalance ??
          item.eqvExpiredBalance ??
          item.eqvAmount ??
          null,
        billingPeriod: item.billingPeriod ?? item.period ?? null,
        billingCurrency: item.billingCurrency ?? item.currency ?? null,
        amount: item.amount ?? null,
        cashBalance: item.billingAmountBalance ?? null,
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
        key: item.historyId ?? item.payLedgerId ?? item.payExpId ?? index,
        no: index + 1,
      }))
    ),
    [data_expired_history],
  );

  useEffect(() => {
    if (!activeRowKey || !dataSourceWithKeys.length) {
      return;
    }

    const matchedRecord = dataSourceWithKeys.find((item) => item.key === activeRowKey);
    if (matchedRecord) {
      setSelectedGasDepositData(matchedRecord);
    }
  }, [activeRowKey, dataSourceWithKeys]);

  const baseSummaryColumns = useMemo(() => (
    columnsPaySummaryBalance(
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
    { key: "historyAction", title: "ACTION", dataIndex: "historyAction", width: 200, render: (value) => value || "-" },
    { key: "historyDisplayType", title: "TYPE", dataIndex: "historyDisplayType", width: 120, render: (value) => value || "-" },
    { key: "historyCategory", title: "CATEGORY", dataIndex: "historyCategory", width: 160, render: (value) => value || "-" },
    { key: "documentNumber", title: "DOCUMENT NUMBER", dataIndex: "documentNumber", width: 180, render: (value) => value || "-" },
    { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 160, render: (value) => value || "-" },
    { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 200, render: (value) => value || "-" },
    { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 160, render: (value) => value || "-" },
    { key: "billingPeriod", title: "BILLING PERIOD", dataIndex: "billingPeriod", width: 130, render: (value) => value || "-" },
    { key: "historyDate", title: "HISTORY DATE", dataIndex: "historyDate", width: 170, render: (value) => value || "-" },
    { key: "currency", title: "CURRENCY", dataIndex: "currency", width: 100, render: (value) => value || "-" },
    {
      key: "amount",
      title: "AMOUNT",
      dataIndex: "amount",
      width: 160,
      align: "right",
      render: (value) => (value === null || value === undefined || value === "" ? "-" : new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value))),
    },
    {
      key: "eqvAmount",
      title: "EQV AMOUNT",
      dataIndex: "eqvAmount",
      width: 170,
      align: "right",
      render: (value) => (value === null || value === undefined || value === "" ? "-" : new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value))),
    },
    { key: "source", title: "SOURCE", dataIndex: "source", width: 120, render: (value) => value || "-" },
    { key: "rateType", title: "RATE TYPE", dataIndex: "rateType", width: 140, render: (value) => value || "-" },
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
                icon={<SVGIcon name="IconCalendarEvent" width={16} color={"#FFFFFF"} />}
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
