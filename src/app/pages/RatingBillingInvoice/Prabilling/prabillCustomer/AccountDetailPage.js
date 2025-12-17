import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Spin, Tag } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
  getCustomerHeaderData,
  getCustomerUsageData,
  getCustomerTaxData,
  getCustomerSaTosData,
  getCustomerTosSubData,
  getCustomerBillingBucketData,
  getCustomerBillingItemData,
  getCustomerSaPrcRuleDetData,
  resetCustomerDetail,
} from "../../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import {
  createUsageColumns,
  createTaxColumns,
  createSaPriceRuleColumns,
  createSaTosColumns,
  createTosSubmissionColumns,
  createTosSubColumns,
  createBillingBucketColumns,
  createBillingItemColumns,
  createSaPrcRuleDetColumns,
} from "./columns";

const { TabPane } = Tabs;

const renderValue = (val) => {
  if (val === null || val === undefined || val === "") return "-";
  return val;
};

const createFixedColumnsState = (leftCols = ["no"]) => ({
  left: leftCols,
  right: [],
});

// Konfigurasi tabs
const TAB_CONFIGS = [
  { key: "1", label: "Usage", dataKey: "usageData", scrollX: 3500, action: "getCustomerUsageData" },
  { key: "2", label: "Tax Implication", dataKey: "taxData", scrollX: 1000, action: "getCustomerTaxData" },
  { key: "3", label: "SA Price Rule", dataKey: "pricingData", scrollX: 1200, action: "getCustomerSaPrcRuleDetData" },
  { key: "4", label: "SA TOS Detail", dataKey: "saTosDet", scrollX: 800, action: "getCustomerSaTosData" },
  { key: "5", label: "TOS Sub Detail", dataKey: "tosSubDet", scrollX: 800, action: "getCustomerTosSubData" },
  { key: "6", label: "Billing Bucket", dataKey: "billingBucketData", scrollX: 900, action: "getCustomerBillingBucketData" },
  { key: "7", label: "Billing Item", dataKey: "billingItemData", scrollX: 1500, action: "getCustomerBillingItemData" },
];

const AccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("1");
  const [loadedTabs, setLoadedTabs] = useState(new Set()); // Track which tabs have been loaded
  const [pagination, setPagination] = useState({
    "1": { current: 1, pageSize: 10 },
    "2": { current: 1, pageSize: 10 },
    "3": { current: 1, pageSize: 10 },
    "4": { current: 1, pageSize: 10 },
    "5": { current: 1, pageSize: 10 },
    "6": { current: 1, pageSize: 10 },
    "7": { current: 1, pageSize: 10 },
  });

  const { customerNumber, billPeriod, inSor, accNumber, saNumber } = location.state || {};
  const { customer_account_detail, loading_customer_detail } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Fixed columns states
  const [fixedColumnsUsage, setFixedColumnsUsage] = useState(() => createFixedColumnsState(["no", "measDate"]));
  const [fixedColumnsTax, setFixedColumnsTax] = useState(() => createFixedColumnsState());
  const [fixedColumnsPrice, setFixedColumnsPrice] = useState(() => createFixedColumnsState());
  const [fixedColumnsSaTos, setFixedColumnsSaTos] = useState(() => createFixedColumnsState());
  const [fixedColumnsTosSub, setFixedColumnsTosSub] = useState(() => createFixedColumnsState());
  const [fixedColumnsBillingBucket, setFixedColumnsBillingBucket] = useState(() => createFixedColumnsState());
  const [fixedColumnsBillingItem, setFixedColumnsBillingItem] = useState(() => createFixedColumnsState());

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_DETAIL, breadcrumbName: "Prabilling" },
    { path: "", breadcrumbName: "Customer Detail" },
  ];

  // Load header data on mount
  useEffect(() => {
    if (!customerNumber || !billPeriod || !inSor) return;

    dispatch(getCustomerHeaderData({
      customerNumber,
      billPeriod,
      inSor,
      accNumber,
      saNumber,
    }));

    // Cleanup on unmount
    return () => {
      dispatch(resetCustomerDetail());
    };
  }, [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]);

  // Function to fetch data for a specific tab
  const fetchTabData = useCallback((tabKey, page = 1, pageSize = 10) => {
    const tabConfig = TAB_CONFIGS.find(t => t.key === tabKey);
    if (!tabConfig) return;

    const params = {
      customerNumber,
      billPeriod,
      inSor,
      accNumber,
      saNumber,
      page: page - 1, // Backend uses 0-based pagination
      size: pageSize,
    };

    switch (tabConfig.action) {
      case "getCustomerUsageData":
        params.sort = "measDate~desc";
        dispatch(getCustomerUsageData(params));
        break;
      case "getCustomerTaxData":
        dispatch(getCustomerTaxData(params));
        break;
      case "getCustomerSaPrcRuleDetData":
        dispatch(getCustomerSaPrcRuleDetData(params));
        break;
      case "getCustomerSaTosData":
        dispatch(getCustomerSaTosData(params));
        break;
      case "getCustomerTosSubData":
        dispatch(getCustomerTosSubData(params));
        break;
      case "getCustomerBillingBucketData":
        dispatch(getCustomerBillingBucketData(params));
        break;
      case "getCustomerBillingItemData":
        dispatch(getCustomerBillingItemData(params));
        break;
      default:
        break;
    }
  }, [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]);

  // Handle tab change - lazy load data
  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    
    // If tab hasn't been loaded yet, fetch its data
    if (!loadedTabs.has(key)) {
      const pagInfo = pagination[key];
      fetchTabData(key, pagInfo.current, pagInfo.pageSize);
      setLoadedTabs(prev => new Set([...prev, key]));
    }
  }, [loadedTabs, pagination, fetchTabData]);

  // Load first tab data on mount
  useEffect(() => {
    if (customerNumber && billPeriod && inSor && !loadedTabs.has("1")) {
      fetchTabData("1", 1, 10);
      setLoadedTabs(new Set(["1"]));
    }
  }, [customerNumber, billPeriod, inSor, fetchTabData, loadedTabs]);

  // Handle pagination change
  const handlePaginationChange = useCallback((tabKey, page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      [tabKey]: { current: page, pageSize }
    }));
    fetchTabData(tabKey, page, pageSize);
  }, [fetchTabData]);

  // Data dari Redux
  const headerData = customer_account_detail?.headerData || {};
  const usageData = customer_account_detail?.usageData?.result || [];
  const usagePage = customer_account_detail?.usageData?.page || {};
  const taxData = customer_account_detail?.taxData?.result || [];
  const taxPage = customer_account_detail?.taxData?.page || {};
  const saPrcRuleDetData = customer_account_detail?.saPrcRuleDetData?.result || [];
  const saPrcRuleDetPage = customer_account_detail?.saPrcRuleDetData?.page || {};
  const saTosDet = customer_account_detail?.saTosDet?.result || [];
  const saTosPage = customer_account_detail?.saTosDet?.page || {};
  const tosSubDet = customer_account_detail?.tosSubDet?.result || [];
  const tosSubPage = customer_account_detail?.tosSubDet?.page || {};
  const billingBucketData = customer_account_detail?.billingBucketData?.result || [];
  const billingBucketPage = customer_account_detail?.billingBucketData?.page || {};
  const billingItemData = customer_account_detail?.billingItemData?.result || [];
  const billingItemPage = customer_account_detail?.billingItemData?.page || {};

  // Columns
  const usageColumns = useMemo(() => createUsageColumns(renderValue), []);
  const taxColumns = useMemo(() => createTaxColumns(renderValue), []);
  const saPriceRuleColumns = useMemo(() => createSaPriceRuleColumns(renderValue), []);
  const saTosColumns = useMemo(() => createSaTosColumns(renderValue), []);
  const tosSubColumns = useMemo(() => createTosSubColumns(renderValue), []);
  const billingBucketColumns = useMemo(() => createBillingBucketColumns(renderValue), []);
  const billingItemColumns = useMemo(() => createBillingItemColumns(renderValue), []);
  const saPrcRuleDetColumns = useMemo(() => createSaPrcRuleDetColumns(renderValue), []);

  // Processed columns with fixed
  const processedColumns = {
    usage: useMemo(() => applyFixedColumns(usageColumns, fixedColumnsUsage), [usageColumns, fixedColumnsUsage]),
    tax: useMemo(() => applyFixedColumns(taxColumns, fixedColumnsTax), [taxColumns, fixedColumnsTax]),
    price: useMemo(() => applyFixedColumns(saPriceRuleColumns, fixedColumnsPrice), [saPriceRuleColumns, fixedColumnsPrice]),
    saTos: useMemo(() => applyFixedColumns(saTosColumns, fixedColumnsSaTos), [saTosColumns, fixedColumnsSaTos]),
    tosSub: useMemo(() => applyFixedColumns(tosSubColumns, fixedColumnsTosSub), [tosSubColumns, fixedColumnsTosSub]),
    billingBucket: useMemo(() => applyFixedColumns(billingBucketColumns, fixedColumnsBillingBucket), [billingBucketColumns, fixedColumnsBillingBucket]),
    billingItem: useMemo(() => applyFixedColumns(billingItemColumns, fixedColumnsBillingItem), [billingItemColumns, fixedColumnsBillingItem]),
  };

  // Column definitions
  const columnDefs = {
    usage: useMemo(() => usageColumns.map((col) => ({ key: col.key, title: col.title })), [usageColumns]),
    tax: useMemo(() => taxColumns.map((col) => ({ key: col.key, title: col.title })), [taxColumns]),
    price: useMemo(() => saPriceRuleColumns.map((col) => ({ key: col.key, title: col.title })), [saPriceRuleColumns]),
    saTos: useMemo(() => saTosColumns.map((col) => ({ key: col.key, title: col.title })), [saTosColumns]),
    tosSub: useMemo(() => tosSubColumns.map((col) => ({ key: col.key, title: col.title })), [tosSubColumns]),
    billingBucket: useMemo(() => billingBucketColumns.map((col) => ({ key: col.key, title: col.title })), [billingBucketColumns]),
    billingItem: useMemo(() => billingItemColumns.map((col) => ({ key: col.key, title: col.title })), [billingItemColumns]),
  };

  // Mapping untuk data, columns, dan setters
  const tabDataMapping = {
    "1": { 
      data: usageData, 
      columns: processedColumns.usage, 
      defs: columnDefs.usage, 
      fixed: fixedColumnsUsage, 
      setFixed: setFixedColumnsUsage,
      page: usagePage,
      loading: loading_customer_detail.usage
    },
    "2": { 
      data: taxData, 
      columns: processedColumns.tax, 
      defs: columnDefs.tax, 
      fixed: fixedColumnsTax, 
      setFixed: setFixedColumnsTax,
      page: taxPage,
      loading: loading_customer_detail.tax
    },
    "3": { 
      data: saPrcRuleDetData, 
      columns: processedColumns.price, 
      defs: columnDefs.price, 
      fixed: fixedColumnsPrice, 
      setFixed: setFixedColumnsPrice,
      page: saPrcRuleDetPage,
      loading: loading_customer_detail.saPrcRuleDet
    },
    "4": { 
      data: saTosDet, 
      columns: processedColumns.saTos, 
      defs: columnDefs.saTos, 
      fixed: fixedColumnsSaTos, 
      setFixed: setFixedColumnsSaTos,
      page: saTosPage,
      loading: loading_customer_detail.saTos
    },
    "5": { 
      data: tosSubDet, 
      columns: processedColumns.tosSub, 
      defs: columnDefs.tosSub, 
      fixed: fixedColumnsTosSub, 
      setFixed: setFixedColumnsTosSub,
      page: tosSubPage,
      loading: loading_customer_detail.tosSub
    },
    "6": { 
      data: billingBucketData, 
      columns: processedColumns.billingBucket, 
      defs: columnDefs.billingBucket, 
      fixed: fixedColumnsBillingBucket, 
      setFixed: setFixedColumnsBillingBucket,
      page: billingBucketPage,
      loading: loading_customer_detail.billingBucket
    },
    "7": { 
      data: billingItemData, 
      columns: processedColumns.billingItem, 
      defs: columnDefs.billingItem, 
      fixed: fixedColumnsBillingItem, 
      setFixed: setFixedColumnsBillingItem,
      page: billingItemPage,
      loading: loading_customer_detail.billingItem
    },
  };

  const renderInfoCard = (title, children) => (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold">{title}</p>
        </div>
      }
    >
      {children}
    </CardContainer>
  );

  const renderDetailGrid = (items) => (
    <div className="grid grid-cols-4 gap-4">
      {items.map(({ label, value, key }) => (
        <DetailText key={key || label} label={label}>
          {value}
        </DetailText>
      ))}
    </div>
  );

  return (
    <Spin spinning={loading_customer_detail.header}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        {/* Customer & Account Info */}
        {renderInfoCard("INIT / CUSTOMER & ACCOUNT INFORMATION", (
          <>
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">Customer Information</h3>
              {renderDetailGrid([
                { label: "Init Code", value: renderValue(headerData.initCode) },
                { label: "Billing Cycle", value: renderValue(headerData.billingCycle) },
                { label: "Bill Period", value: renderValue(headerData.billPeriod) },
                { label: "Customer Number", value: renderValue(headerData.customerNumber) },
                { label: "Customer Name", value: renderValue(headerData.customerName) },
                { label: "Customer Type", value: renderValue(headerData.customerType) },
              ])}
            </div>

            <div>
              <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">Account Information</h3>
              {renderDetailGrid([
                { label: "Account Number", value: renderValue(headerData.accountNumber) },
                { label: "Account Name", value: renderValue(headerData.accountName) },
                { label: "Account Status", value: headerData.accountStatus ? (
                  <Tag color={headerData.accountStatus === "ACTIVE" ? "green" : "red"}>{headerData.accountStatus}</Tag>
                ) : <Tag color="default">-</Tag> },
                { label: "Account Group", value: renderValue(headerData.accountGroup) },
                { label: "SOR", value: renderValue(headerData.sor) },
                { label: "Cost Center", value: renderValue(headerData.accountCostCenter) },
                { label: "Meter Reading Code", value: renderValue(headerData.meterReadingCode) },
                { label: "Account Segment", value: renderValue(headerData.accountSegment) },
                { label: "Account Group Type", value: renderValue(headerData.accountGroupType) },
                { label: "Account Type", value: renderValue(headerData.accountType) },
              ])}
            </div>
          </>
        ))}

        {/* Detailed Data Tabs */}
        {renderInfoCard("DETAILED DATA", (
          <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
            {TAB_CONFIGS.map((tab) => {
              const tabData = tabDataMapping[tab.key];
              const currentPag = pagination[tab.key];
              
              return (
                <TabPane 
                  tab={
                    <span>
                      {tab.label} ({tabData.page?.totalElements || 0})
                    </span>
                  } 
                  key={tab.key}
                >
                  <TableRBI
                    columns={tabData.columns}
                    dataSource={tabData.data}
                    totalData={tabData.page?.totalElements || 0}
                    current={currentPag.current}
                    pageSize={currentPag.pageSize}
                    onChange={(page, pageSize) => handlePaginationChange(tab.key, page, pageSize)}
                    onSizeChanger={(current, size) => handlePaginationChange(tab.key, current, size)}
                    tableScrolled={{ x: tab.scrollX, y: 500 }}
                    rowKey={(record, index) => `${tab.key}-${index}`}
                    columnDefinitions={tabData.defs}
                    fixedColumns={tabData.fixed}
                    showExport={false}
                    setFixedColumns={tabData.setFixed}
                    loading={tabData.loading}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        ))}

        <div className="w-full flex justify-start my-5">
          <ButtonComponent
            type="submit"
            border={false}
            icon={<LeftOutlined style={{ color: "#fff", fontSize: 16 }} />}
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonComponent>
        </div>
      </LayoutMenu>
    </Spin>
  );
};

export default AccountDetailPage;