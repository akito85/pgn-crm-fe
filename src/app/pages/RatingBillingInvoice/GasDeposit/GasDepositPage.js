import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip, Tabs, Dropdown } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import SVGIcon from "../../../../assets/Icon/index";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  getAllGasDepositPaginate,
  getMutationSummaryPaginate,
  getApprovalHistory,
  setGasDepositFilters,
  getHistoryGasDepositPaginate,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";
import { columnsGasDeposit } from "./Table/TableViewGasDeposit";
import { columnsSummaryBalance } from "./Table/TableSummaryBalance";
import GasDepositDetail from "./GasDepositDetail";
import ModalApprovalExpired from "./Modal/ModalApprovalExpired";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";

const getDisplayStatus = (item, isExpiredFlow = false) => {
  const statusApproval = String(item?.statusApproval || "");
  const rawStatus = item?.statusMaster || item?.status || null;

  if (!isExpiredFlow) return rawStatus;
  if (statusApproval === "Waiting Approval" || statusApproval === "Draft") return "Draft";
  if (statusApproval === "Approved" || statusApproval === "Rejected") return "Expired";
  return rawStatus;
};

const formatApprovalHistoryLabel = (key) => {
  const normalizedKey = key.toUpperCase();

  if (normalizedKey === "GAS_DEPOSIT") return "Gas Deposit";
  if (normalizedKey === "EXPIRED_GAS_DEPOSIT") return "Expired";
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
  const { data, loading, loading_history, loading_mutation_summary, loading_history_list, data_history, data_approval_history, data_mutation_summary, filters } = useSelector(
    (state) => state.gasDepositRbi,
  );
  const { currentPosition, token } = useSelector((state) => state.auth || {});

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
  const [sort, setSort] = useState(filters?.sort || "createdDate~desc");
  const [search, setSearch] = useState(filters?.search || {});

  const [pageDetail, setPageDetail] = useState(false);
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedGasDepositData, setSelectedGasDepositData] = useState(null);
  const [activeTab, setActiveTab] = useState("gasDeposit");
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalApprovalExpired, setModalApprovalExpired] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  const [fixedColumnsSummary, setFixedColumnsSummary] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "mutationStatus", "mutationApprovalStatus"],
  }));

  const [fixedColumnsHistory, setFixedColumnsHistory] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval"],
  }));

  // Simpan filters ke Redux
  useEffect(() => {
    dispatch(setGasDepositFilters({ search, sort, page }));
  }, [search, sort, page, dispatch]);

  // Reset filters saat unmount
  useEffect(() => {
    return () => {
      dispatch(setGasDepositFilters({ search: {}, sort: "createdDate~desc", page: 1 }));
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
    if (activeTab !== "gasDeposit") return;
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
  }, [dispatch, search, sort, activeTab]);

  useEffect(() => {
    if (activeTab === "summaryBalance") {
      dispatch(
        getMutationSummaryPaginate({
          page: 1,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
        }),
      );
    }
    if (activeTab === "history") {
      dispatch(
        getHistoryGasDepositPaginate({
          page: 1,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
        }),
      );
    }
  }, [dispatch, activeTab, search, sort]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      setDataApprovalHistoryFix(
        mapApprovalHistoryData(data_approval_history, ["GAS_DEPOSIT", "EXPIRED_GAS_DEPOSIT", "INACTIVE_GAS_DEPOSIT"]),
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

  const handleHistoryLoadMore = async () => {
    const totalElements = data_history?.page?.totalElements || 0;
    const currentDataLength = historyDataSource?.length || 0;

    if (currentDataLength >= totalElements) return;

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    dispatch(
      getHistoryGasDepositPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
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

  const handleRefreshAll = () => {
    handleRefresh();
    if (activeTab === "history") {
      dispatch(
        getHistoryGasDepositPaginate({
          page: 1,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
        }),
      );
    }
  };

  const suppressNextRowClick = useCallback(() => {
    suppressNextRowClickRef.current = true;

    setTimeout(() => {
      suppressNextRowClickRef.current = false;
    }, 0);
  }, []);

  const toggleDetail = useCallback((record) => {
    const recordKey = record.key ?? record.stgSumId ?? record.pendingStgSumId ?? record.gasDepositId;

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
    dispatch(getApprovalHistory(record.pendingStgSumId || record.stgSumId || record.gasDepositId));
    setModalApprovalHistory(true);
  }, [dispatch, suppressNextRowClick]);

  const itemGrantAccess = useMemo(
    () => [
      {
        action: "View",
        type: "table",
        render: (record) => {
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
                navigate(RBI_ROUTES.GAS_DEPOSIT_UPDATE, {
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
              key: "viewAccountDetail",
              label: (
                <div className="flex items-center gap-2">
                  <SVGIcon name="IconDetail" width={16} />
                  <span>View Account Detail</span>
                </div>
              ),
              onClick: () => {
                suppressNextRowClick();
                navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD, {
                  state: {
                    idAccount: record?.accountId,
                    idCustomer: record?.customerId,
                    type: "standard",
                    section: "Gas Deposit",
                  },
                });
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
      (dataSource ?? []).filter(Boolean).map((item) => ({
        ...item,
        key: item.stgSumId ?? item.pendingStgSumId ?? item.masterGasDepositId ?? item.accountId,
        gasDepositId:
          item.masterGasDepositId ??
          ((item.stgSumId ?? item.pendingStgSumId) ? -Math.abs(item.stgSumId ?? item.pendingStgSumId) : item.accountId),
        stgSumId: item.stgSumId ?? item.pendingStgSumId ?? null,
        expiredFlow: Boolean(item.expiredFlow),
        status: getDisplayStatus(item, Boolean(item.expiredFlow)),
        statusApproval: item.statusApproval || null,
        mutationApprovalStatus: null,
        mutationStatus: null,
        sor: item.sor || null,
        costCenter: item.costCenter || null,
        accountSegment: item.accountSegment || null,
        meterReadingCode: item.meterReadingCode || null,
        termsEarn: item.termsEarn ?? null,
        termsRedeem: item.termsRedeem ?? null,
        periodEarn: item.earnStartDate || null,
        periodEarnEnd: item.earnEndDate || null,
        period: item.earnStartDate && item.earnEndDate
          ? `${item.earnStartDate} - ${item.earnEndDate}`
          : item.earnStartDate || null,
        periodRedeemStart: item.redeemStartDate || null,
        periodRedeemEnd: item.redeemEndDate || null,
        timeUnit: item.timeUnit || null,
        currency: item.currency || null,
        uom: item.uom || null,
        quantity: item.quantity ?? item.balanceVolume ?? null,
        amount: item.balanceAmount ?? null,
        cashBalance: item.balanceVolume ?? null,
        accountType: item.accountType || null,
        type: item.pendingActionType || null,
        description: item.description || null,
        sapCustId: item.sapCustId || null,
        classificationType: item.classificationType || null,
        source: item.source || null,
        createdDate: item.createdDate || null,
        createdBy: item.createdBy || null,
        updatedDate: item.updatedDate || null,
        updatedBy: item.updatedBy || null,
        headerType: null,
        billingPeriod: null,
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

  const summaryDataSource = useMemo(
    () =>
      (data_mutation_summary?.result ?? []).filter(Boolean).map((item) => ({
        ...item,
        key: item.accountNumber,
        termsEarn:            item.termsEarn            ?? null,
        termsRedeem:          item.termsRedeem          ?? null,
        earnPeriod:           item.earnStartDate        ?? null,
        redeemStartDate:      item.periodRedeemStart    ?? null,
        redeemEndDate:        item.periodRedeemEnd      ?? null,
        billingPeriod:        item.billingPeriod        ?? null,
        timeUnit:             item.timeUnit             ?? null,
        quantity:             item.quantity             ?? null,
        balanceAmount:        item.balanceAmount        ?? null,
        headerType:           item.headerType           ?? null,
        classificationType:   item.classificationType   ?? null,
        source:               item.source               ?? null,
        period:               item.period               ?? null,
        mutationDate:         item.mutationDate         ?? null,
        mutationType:         item.mutationType         ?? null,
        volume:               item.volume               ?? null,
        price:                item.price                ?? null,
        detailType:           item.detailType           ?? null,
        amount:               item.amount               ?? null,
        status:               item.status               ?? null,
        statusApproval:       item.statusApproval       ?? null,
        mutationStatus:       item.mutationStatus       ?? null,
        mutationApprovalStatus: item.mutationApprovalStatus ?? null,
      })),
    [data_mutation_summary],
  );

  const historyDataSource = useMemo(
    () =>
      (data_history?.result ?? []).map((item) => ({
        ...item,
        key: item.referenceId || item.accountNumber,
        gasDepositId: item.gasDepositId || item.accountNumber,
        expiredFlow: true,
        status: getDisplayStatus(item, true),
        statusApproval: item.statusApproval || null,
        quantity: item.quantity ?? item.balanceVolume ?? null,
        periodEarn: item.earnStartDate || null,
        periodEarnEnd: item.earnEndDate || null,
        period: item.period || (item.earnStartDate && item.earnEndDate
          ? `${item.earnStartDate} - ${item.earnEndDate}`
          : item.earnStartDate || null),
        periodRedeemStart: item.periodRedeemStart || null,
        periodRedeemEnd: item.periodRedeemEnd || null,
      })),
    [data_history],
  );

  const historyColumns = useMemo(() => {
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

  const processedHistoryColumns = useMemo(
    () => applyFixedColumns(historyColumns, fixedColumnsHistory),
    [historyColumns, fixedColumnsHistory],
  );

  const historyColumnDefinitions = useMemo(
    () => historyColumns.map((col) => ({ key: col.key, title: col.title })),
    [historyColumns],
  );

  const authToken = useMemo(() => {
    try {
      return token ? JSON.parse(token) : null;
    } catch (error) {
      return null;
    }
  }, [token]);

  const positionRoleHints = useMemo(
    () =>
      [
        currentPosition,
        currentPosition?.currentPosition,
        currentPosition?.approvalRole,
        currentPosition?.roleName,
        currentPosition?.positionName,
        authToken?.currentPosition,
        authToken?.approvalRole,
        authToken?.roleName,
        authToken?.positionName,
        authToken?.position,
        authToken?.primaryPosition?.positionName,
      ]
        .filter(Boolean)
        .map((item) => String(item).toLowerCase()),
    [authToken, currentPosition],
  );

  const tabItems = [
    { key: "gasDeposit", label: "Gas Deposit", children: null },
    { key: "summaryBalance", label: "Summary Balance", children: null },
    { key: "history", label: "History", children: null },
  ];

  const canShowApprovalExpiredButton = useMemo(() => {
    const isSubmitterPosition = positionRoleHints.some((item) => item.includes("submitter"));
    if (isSubmitterPosition) return false;
    return true;
  }, [positionRoleHints]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">GAS DEPOSIT LIST</p>
            <div className="flex items-center gap-2">
              {canShowApprovalExpiredButton && (
                <ButtonComponent
                  icon={<SVGIcon name="IconRequestApproval" width={16} color="#FFF" />}
                  type="submit"
                  border={false}
                  onClick={() => setModalApprovalExpired(true)}
                >
                  Approval Expired
                </ButtonComponent>
              )}
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

        {activeTab === "history" && (
          <TableRBI
            idTable="gas-deposit-history-table"
            dataSource={historyDataSource}
            columns={processedHistoryColumns}
            totalData={historyDataSource.length}
            tableScrolled={{ x: 5000, y: 525 }}
            onSort={onSort}
            columnDefinitions={historyColumnDefinitions}
            fixedColumns={fixedColumnsHistory}
            setFixedColumns={setFixedColumnsHistory}
            loading={loading_history_list}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleHistoryLoadMore}
            hasMore={((data_history?.result?.length || 0) < (data_history?.page?.totalElements || 0))}
            showRefresh={true}
            onRefresh={() => dispatch(getHistoryGasDepositPaginate({ page: 1, pageSize: loadMoreSize, search: encodeURIComponent(JSON.stringify(search)), sort }))}
            loadMoreThreshold={15}
          />
        )}

        {activeTab === "summaryBalance" && (
          <TableRBI
              idTable="gas-deposit-summary-table"
              dataSource={summaryDataSource}
              columns={processedSummaryColumns}
              totalData={data_mutation_summary?.page?.totalElements || 0}
              tableScrolled={{ x: 5000, y: 525 }}
              onSort={onSort}
              columnDefinitions={summaryColumnDefinitions}
              fixedColumns={fixedColumnsSummary}
              setFixedColumns={setFixedColumnsSummary}
              loading={loading_mutation_summary}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={true}
              hasMore={false}
              showRefresh={true}
              onRefresh={() => dispatch(getMutationSummaryPaginate({ page: 1, pageSize: 100, search: encodeURIComponent(JSON.stringify(search)), sort }))}
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

      <ModalApprovalExpired
        isOpen={modalApprovalExpired}
        handleCancel={() => setModalApprovalExpired(false)}
        handleRefresh={handleRefreshAll}
      />
    </>
  );
};

export default GasDepositPage;
