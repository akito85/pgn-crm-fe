import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Row, Col, Select, Tabs } from "antd";
import {
  DatabaseOutlined,
  AuditOutlined,
  TagOutlined,
  AccountBookOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import StatCard from "../../../../components/StatCard";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import {
  getParameters,
  getHeaderSummary,
  getMasterVsPraBilling,
  getPraBillingVsRating,
  getRatingVsBilling,
  getBillingVsInvoice,
  getBillingVsApproval,
  getBillingVsAdjustment,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const { Option } = Select;

const okCol = (title, dataIndex) => ({
  title,
  dataIndex,
  key: dataIndex,
  width: 130,
  align: "center",
  render: (text) => {
    const val = text ?? "Ok";
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <StatusComponent colour={val}>{val.toUpperCase()}</StatusComponent>
      </div>
    );
  },
});

// NO column — index-based (no page offset needed for infinite scroll)
const noCol = {
  title: "NO",
  key: "no",
  width: 60,
  align: "center",
  render: (_, __, index) => index + 1,
};

const accountNumberCol = {
  title: "ACCOUNT NUMBER",
  dataIndex: "accountNumber",
  key: "accountNumber",
  width: 160,
};

const stepTabItems = [
  {
    key: "1",
    label: "Master Vs Pra-Billing",
    columns: [
      noCol,
      accountNumberCol,
      okCol("ACCOUNT", "account"),
      okCol("SERVICE AGREEMENT", "serviceAgreement"),
      okCol("USAGE", "usage"),
      okCol("PROMO", "promo"),
    ],
  },
  {
    key: "2",
    label: "Pra-Billing Vs Rating",
    columns: [
      noCol,
      accountNumberCol,
      okCol("USAGE", "usage"),
      okCol("SERVICE AGREEMENT", "serviceAgreement"),
      okCol("PRICE", "price"),
      okCol("MIN CONTRACT", "minContract"),
      okCol("MAX CONTRACT", "maxContract"),
      okCol("PROMO", "promo"),
    ],
  },
  {
    key: "3",
    label: "Rating Vs Billing",
    columns: [
      noCol,
      accountNumberCol,
      okCol("USAGE", "usage"),
      okCol("AMOUNT", "amount"),
    ],
  },
  {
    key: "4",
    label: "Billing Vs Invoice",
    columns: [
      noCol,
      accountNumberCol,
      okCol("INVOICE NUMBER", "invoiceNumber"),
    ],
  },
  {
    key: "5",
    label: "Billing Vs Approve",
    columns: [
      noCol,
      accountNumberCol,
      okCol("APPROVAL STATUS", "approvalStatus"),
    ],
  },
  {
    key: "6",
    label: "Billing Vs Late Charge",
    columns: [
      noCol,
      accountNumberCol,
      okCol("BILLING", "billing"),
      okCol("LATE CHARGE", "lateCharge"),
    ],
  },
  {
    key: "7",
    label: "Billing Vs Adjustment",
    columns: [
      noCol,
      accountNumberCol,
      okCol("BILLING", "billing"),
      okCol("ADJUSTMENT", "adjustment"),
    ],
  },
];

// Initial page size & load-more batch size (same for all tabs)
const INITIAL_SIZE = 100;
const LOAD_MORE_SIZE = 20;

const MonitoringCustomerPage = () => {
  const {
    loading, loadingHeader,
    loadingTab1, loadingTab2, loadingTab3, loadingTab4, loadingTab5, loadingTab7,
    periods, headerSummary,
    masterVsPraBilling, praBillingVsRating,
    ratingVsBilling, billingVsInvoice, billingVsApproval, billingVsAdjustment,
  } = useSelector((state) => state.monitoring);

  const dispatch = useDispatch();

  const [filterPeriod, setFilterPeriod] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [visitedTabs, setVisitedTabs] = useState(new Set(["1"]));

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("monitoringCustomerFixedColumns");
      return saved ? JSON.parse(saved) : { left: ["no"], right: [] };
    } catch (e) {
      return { left: ["no"], right: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("monitoringCustomerFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  useEffect(() => {
    dispatch(getParameters());
  }, [dispatch]);

  useEffect(() => {
    if (periods && periods.length > 0 && filterPeriod === null) {
      setFilterPeriod(periods[0].value);
    }
  }, [periods, filterPeriod]);

  useEffect(() => {
    if (filterPeriod) {
      dispatch(getHeaderSummary(filterPeriod));
      dispatch(getMasterVsPraBilling({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false }));
      setActiveTab("1");
      setVisitedTabs(new Set(["1"]));
    }
  }, [filterPeriod, dispatch]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (!visitedTabs.has(key)) {
      setVisitedTabs((prev) => new Set(prev).add(key));
      if (key === "2") {
        dispatch(getPraBillingVsRating({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false }));
      } else if (key === "3") {
        dispatch(getRatingVsBilling({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false }));
      } else if (key === "4") {
        dispatch(getBillingVsInvoice({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false }));
      } else if (key === "5") {
        dispatch(getBillingVsApproval({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false }));
      } else if (key === "7") {
        dispatch(getBillingVsAdjustment({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false }));
      }
      // key "6" (Billing Vs Late Charge) has no API — mark visited, no dispatch
    }
  };

  // --- Load-more handlers (per tab) ---
  const makeLoadMore = (currentContent, totalElements, tabThunk) => async () => {
    if (currentContent.length >= totalElements) return;
    const nextPage = Math.floor(currentContent.length / LOAD_MORE_SIZE);
    await dispatch(tabThunk({ period: filterPeriod, page: nextPage, size: LOAD_MORE_SIZE, isLoadMore: true }));
  };

  // --- Refresh handler — reload tab aktif dari awal ---
  const handleRefresh = () => {
    if (!filterPeriod) return;
    const thunkMap = {
      "1": () => dispatch(getMasterVsPraBilling({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false })),
      "2": () => dispatch(getPraBillingVsRating({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false })),
      "3": () => dispatch(getRatingVsBilling({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false })),
      "4": () => dispatch(getBillingVsInvoice({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false })),
      "5": () => dispatch(getBillingVsApproval({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false })),
      "7": () => dispatch(getBillingVsAdjustment({ period: filterPeriod, page: 0, size: INITIAL_SIZE, isLoadMore: false })),
    };
    thunkMap[activeTab]?.();
  };

  const tab1Content = masterVsPraBilling.content ?? [];
  const tab2Content = praBillingVsRating.content ?? [];
  const tab3Content = ratingVsBilling.content ?? [];
  const tab4Content = billingVsInvoice.content ?? [];
  const tab5Content = billingVsApproval.content ?? [];
  const tab7Content = billingVsAdjustment.content ?? [];

  const handleLoadMore1 = makeLoadMore(tab1Content, masterVsPraBilling.totalElements ?? 0, getMasterVsPraBilling);
  const handleLoadMore2 = makeLoadMore(tab2Content, praBillingVsRating.totalElements ?? 0, getPraBillingVsRating);
  const handleLoadMore3 = makeLoadMore(tab3Content, ratingVsBilling.totalElements ?? 0, getRatingVsBilling);
  const handleLoadMore4 = makeLoadMore(tab4Content, billingVsInvoice.totalElements ?? 0, getBillingVsInvoice);
  const handleLoadMore5 = makeLoadMore(tab5Content, billingVsApproval.totalElements ?? 0, getBillingVsApproval);
  const handleLoadMore7 = makeLoadMore(tab7Content, billingVsAdjustment.totalElements ?? 0, getBillingVsAdjustment);

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.MONITORING_CUSTOMER_VIEW, breadcrumbName: "Monitoring Customer" },
  ];

  const summaryCards = [
    { title: "MASTER",      value: headerSummary.currMaster,     pct: headerSummary.pctMaster,      icon: <DatabaseOutlined /> },
    { title: "PRA-BILLING", value: headerSummary.currPraBilling, pct: headerSummary.pctPraBilling,  icon: <AuditOutlined /> },
    { title: "RATING",      value: headerSummary.currRating,     pct: headerSummary.pctRating,      icon: <TagOutlined /> },
    { title: "BILLING",     value: headerSummary.currBilling,    pct: headerSummary.pctBilling,     icon: <AccountBookOutlined /> },
    { title: "APPROVED",    value: headerSummary.currApproved,   pct: headerSummary.pctApproved,    icon: <CheckOutlined /> },
  ];

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer header="MONITORING BILLING PROCESS">
          <div className="mb-3">
            <Select
              placeholder="Select Period"
              value={filterPeriod}
              onChange={(value) => setFilterPeriod(value)}
              style={{ width: 200, fontSize: "12px" }}
              size="small"
              showSearch
              filterOption={(input, option) =>
                String(option.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              {(periods || []).map((p) => (
                <Option key={p.value} value={p.value}>
                  {p.label}
                </Option>
              ))}
            </Select>
          </div>

          <Spin spinning={loadingHeader}>
            <Row gutter={[12, 12]}>
              {summaryCards.map((card) => (
                <Col key={card.title} flex="1">
                  <StatCard
                    title={card.title}
                    value={card.value}
                    percentage={Math.abs(card.pct)}
                    isPositive={card.pct >= 0}
                    icon={card.icon}
                  />
                </Col>
              ))}
            </Row>
          </Spin>
        </CardContainer>

        <CardContainer header="STEP TO STEP DIFFERENCE BY VALUE">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            size="small"
            items={stepTabItems.map((tab) => {
              const isTab1 = tab.key === "1";
              const isTab2 = tab.key === "2";
              const isTab3 = tab.key === "3";
              const isTab4 = tab.key === "4";
              const isTab5 = tab.key === "5";
              const isTab6 = tab.key === "6";
              const isTab7 = tab.key === "7";

              const dataSource =
                isTab1 ? tab1Content :
                isTab2 ? tab2Content :
                isTab3 ? tab3Content :
                isTab4 ? tab4Content :
                isTab5 ? tab5Content :
                isTab7 ? tab7Content : [];

              const totalData =
                isTab1 ? (masterVsPraBilling.totalElements ?? 0) :
                isTab2 ? (praBillingVsRating.totalElements ?? 0) :
                isTab3 ? (ratingVsBilling.totalElements ?? 0) :
                isTab4 ? (billingVsInvoice.totalElements ?? 0) :
                isTab5 ? (billingVsApproval.totalElements ?? 0) :
                isTab7 ? (billingVsAdjustment.totalElements ?? 0) : 0;

              const tabLoading =
                isTab1 ? loadingTab1 : isTab2 ? loadingTab2 :
                isTab3 ? loadingTab3 : isTab4 ? loadingTab4 :
                isTab5 ? loadingTab5 : isTab7 ? loadingTab7 : false;

              const onLoadMore =
                isTab1 ? handleLoadMore1 :
                isTab2 ? handleLoadMore2 :
                isTab3 ? handleLoadMore3 :
                isTab4 ? handleLoadMore4 :
                isTab5 ? handleLoadMore5 :
                isTab7 ? handleLoadMore7 : undefined;

              const hasMore = dataSource.length < totalData;

              // Process columns to ensure key and apply fixed columns
              const allTabColumns = tab.columns.map((col) => ({
                ...col,
                key: col.key || col.dataIndex || col.title,
              }));

              const processedColumns = applyFixedColumns(allTabColumns, fixedColumns);

              const columnDefinitions = allTabColumns.map((col) => ({
                key: col.key || col.dataIndex || col.title,
                title: col.title,
              }));

              // Tab 6 (Billing Vs Late Charge) belum memiliki API — tampilkan placeholder
              if (isTab6) {
                return {
                  key: tab.key,
                  label: tab.label,
                  children: (
                    <div style={{ fontSize: "12px" }}>
                      <div className="py-8 text-center" style={{ color: "#9E9E9E" }}>
                        Data Billing Vs Late Charge belum tersedia.
                      </div>
                    </div>
                  ),
                };
              }

              return {
                key: tab.key,
                label: tab.label,
                children: (
                  <div style={{ fontSize: "12px" }}>
                  <div className="pb-3">
                    <TableRBI
                      idTable={`table-step-${tab.key}`}
                      dataSource={dataSource}
                      columns={processedColumns}
                      totalData={totalData}
                      loading={tabLoading}
                      tableScrolled={{ x: "max-content", y: 450 }}
                      usePagination={false}
                      useInfiniteScroll={true}
                      onLoadMore={onLoadMore}
                      hasMore={hasMore}
                      loadMoreThreshold={20}
                      showRefresh={true}
                      onRefresh={handleRefresh}
                      columnDefinitions={columnDefinitions}
                      fixedColumns={fixedColumns}
                      setFixedColumns={setFixedColumns}
                      useSelect={true}
                      showAdvanceSearch={true}
                      showSearchBar={true}
                    />
                  </div>
                  </div>
                ),
              };
            })}
          />
        </CardContainer>
      </Spin>
    </>
  );
};

export default MonitoringCustomerPage;
