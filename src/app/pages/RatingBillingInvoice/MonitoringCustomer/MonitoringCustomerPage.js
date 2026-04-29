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
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import CardContainer from "../../../../components/CardContainer";
import StatCard from "../../../../components/StatCard";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
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

// Placeholder sentinel — diganti saat render dengan makeNoCol(currentPage, pageSize)
const noCol = { key: "no" };

const makeNoCol = (currentPage, pageSize) => ({
  title: "NO",
  key: "no",
  width: 60,
  align: "center",
  render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
});

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
  const [tab1Page, setTab1Page] = useState(0);
  const tab1Size = 10;
  const tab1Search = "";
  const [tab2Page, setTab2Page] = useState(0);
  const tab2Size = 10;
  const tab2Search = "";
  const [tab3Page, setTab3Page] = useState(0);
  const tab3Size = 10;
  const tab3Search = "";
  const [tab4Page, setTab4Page] = useState(0);
  const tab4Size = 10;
  const tab4Search = "";
  const [tab5Page, setTab5Page] = useState(0);
  const tab5Size = 10;
  const tab5Search = "";
  const [tab7Page, setTab7Page] = useState(0);
  const tab7Size = 10;
  const tab7Search = "";

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
      setTab1Page(0);
      dispatch(getMasterVsPraBilling({ period: filterPeriod, page: 0, size: tab1Size, search: tab1Search }));
      setTab2Page(0);
      setTab3Page(0);
      setTab4Page(0);
      setTab5Page(0);
      setTab7Page(0);
      setActiveTab("1");
      setVisitedTabs(new Set(["1"]));
    }
  }, [filterPeriod, dispatch]); // tab1Size dan tab1Search adalah konstanta

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (!visitedTabs.has(key)) {
      setVisitedTabs((prev) => new Set(prev).add(key));
      if (key === "2") {
        setTab2Page(0);
        dispatch(getPraBillingVsRating({ period: filterPeriod, page: 0, size: tab2Size, search: tab2Search }));
      } else if (key === "3") {
        setTab3Page(0);
        dispatch(getRatingVsBilling({ period: filterPeriod, page: 0, size: tab3Size, search: tab3Search }));
      } else if (key === "4") {
        setTab4Page(0);
        dispatch(getBillingVsInvoice({ period: filterPeriod, page: 0, size: tab4Size, search: tab4Search }));
      } else if (key === "5") {
        setTab5Page(0);
        dispatch(getBillingVsApproval({ period: filterPeriod, page: 0, size: tab5Size, search: tab5Search }));
      } else if (key === "7") {
        setTab7Page(0);
        dispatch(getBillingVsAdjustment({ period: filterPeriod, page: 0, size: tab7Size, search: tab7Search }));
      }
      // key "6" (Billing Vs Late Charge) has no thunk — mark visited, no dispatch
    }
  };

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
    <LayoutMenu>
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
                isTab1 ? (masterVsPraBilling.content ?? []) :
                isTab2 ? (praBillingVsRating.content ?? []) :
                isTab3 ? (ratingVsBilling.content ?? []) :
                isTab4 ? (billingVsInvoice.content ?? []) :
                isTab5 ? (billingVsApproval.content ?? []) :
                isTab7 ? (billingVsAdjustment.content ?? []) : [];

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

              const tabPageSize =
                isTab1 ? tab1Size : isTab2 ? tab2Size :
                isTab3 ? tab3Size : isTab4 ? tab4Size :
                isTab5 ? tab5Size : isTab7 ? tab7Size : 10;

              const tabCurrent =
                isTab1 ? tab1Page + 1 : isTab2 ? tab2Page + 1 :
                isTab3 ? tab3Page + 1 : isTab4 ? tab4Page + 1 :
                isTab5 ? tab5Page + 1 : isTab7 ? tab7Page + 1 : 1;

              const tabOnChange =
                isTab1 ? (p) => { setTab1Page(p - 1); dispatch(getMasterVsPraBilling({ period: filterPeriod, page: p - 1, size: tab1Size, search: tab1Search })); } :
                isTab2 ? (p) => { setTab2Page(p - 1); dispatch(getPraBillingVsRating({ period: filterPeriod, page: p - 1, size: tab2Size, search: tab2Search })); } :
                isTab3 ? (p) => { setTab3Page(p - 1); dispatch(getRatingVsBilling({ period: filterPeriod, page: p - 1, size: tab3Size, search: tab3Search })); } :
                isTab4 ? (p) => { setTab4Page(p - 1); dispatch(getBillingVsInvoice({ period: filterPeriod, page: p - 1, size: tab4Size, search: tab4Search })); } :
                isTab5 ? (p) => { setTab5Page(p - 1); dispatch(getBillingVsApproval({ period: filterPeriod, page: p - 1, size: tab5Size, search: tab5Search })); } :
                isTab6 ? () => {} :
                isTab7 ? (p) => { setTab7Page(p - 1); dispatch(getBillingVsAdjustment({ period: filterPeriod, page: p - 1, size: tab7Size, search: tab7Search })); } :
                undefined;

              // Inject noCol dengan konteks pagination yang tepat
              const columns = tab.columns.map((col) =>
                col.key === "no" ? makeNoCol(tabCurrent, tabPageSize) : col
              );

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
                      columns={columns}
                      pageSize={tabPageSize}
                      current={tabCurrent}
                      loading={tabLoading}
                      totalData={totalData}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={true}
                      useSelect={true}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                      onChange={tabOnChange}
                    />
                  </div>
                  </div>
                ),
              };
            })}
          />
        </CardContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default MonitoringCustomerPage;
