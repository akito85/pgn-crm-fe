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
  createSaTosColumns,
  createTosSubColumns,
  createBillingBucketColumns,
  createBillingItemColumns,
  createSaPrcRuleDetColumns,
  createSAColumns,
} from "./columns";
import BaseContainer from "../../../../../components/BaseContainer";
import StatusComponent from "../../../../../components/StatusComponent";

const { TabPane } = Tabs;

const renderValue = (val) => {
  if (val === null || val === undefined || val === "") return "";
  return val;
};

const createFixedColumnsState = (leftCols = ["no"]) => ({
  left: leftCols,
  right: [],
});

const TAB_CONFIGS = [
  {
    key: "0",
    label: "Service Agreement",
    dataKey: "saData",
    scrollX: 2500,
    action: null,
  },
  {
    key: "1",
    label: "Usage",
    dataKey: "usageData",
    scrollX: 3500,
    action: "getCustomerUsageData",
  },
  {
    key: "2",
    label: "Tax Implication",
    dataKey: "taxData",
    scrollX: 1000,
    action: "getCustomerTaxData",
  },
  {
    key: "3",
    label: "SA Price Rule",
    dataKey: "saPrcRuleDetData",
    scrollX: 1100,
    action: "getCustomerSaPrcRuleDetData",
  },
  {
    key: "4",
    label: "SA TOS Detail",
    dataKey: "saTosDet",
    scrollX: 800,
    action: "getCustomerSaTosData",
  },
  {
    key: "5",
    label: "TOS Sub Detail",
    dataKey: "tosSubDet",
    scrollX: 800,
    action: "getCustomerTosSubData",
  },
  {
    key: "6",
    label: "Billing Bucket",
    dataKey: "billingBucketData",
    scrollX: 900,
    action: "getCustomerBillingBucketData",
  },
  {
    key: "7",
    label: "Billing Item",
    dataKey: "billingItemData",
    scrollX: 1500,
    action: "getCustomerBillingItemData",
  },
];

const AccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("0");
  const [pagination, setPagination] = useState({
    0: { current: 1, pageSize: 10 },
    1: { current: 1, pageSize: 10 },
    2: { current: 1, pageSize: 10 },
    3: { current: 1, pageSize: 10 },
    4: { current: 1, pageSize: 10 },
    5: { current: 1, pageSize: 10 },
    6: { current: 1, pageSize: 10 },
    7: { current: 1, pageSize: 10 },
  });

  const { customerNumber, billPeriod, inSor, accNumber, saNumber } =
    location.state || {};
  const { customer_account_detail, loading_customer_detail } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Fixed columns states
  const [fixedColumnsSA, setFixedColumnsSA] = useState(() =>
    createFixedColumnsState(["no"])
  );
  const [fixedColumnsUsage, setFixedColumnsUsage] = useState(() =>
    createFixedColumnsState(["no"])
  );
  const [fixedColumnsTax, setFixedColumnsTax] = useState(() =>
    createFixedColumnsState()
  );
  const [fixedColumnsPrice, setFixedColumnsPrice] = useState(() =>
    createFixedColumnsState()
  );
  const [fixedColumnsSaTos, setFixedColumnsSaTos] = useState(() =>
    createFixedColumnsState()
  );
  const [fixedColumnsTosSub, setFixedColumnsTosSub] = useState(() =>
    createFixedColumnsState()
  );
  const [fixedColumnsBillingBucket, setFixedColumnsBillingBucket] = useState(
    () => createFixedColumnsState()
  );
  const [fixedColumnsBillingItem, setFixedColumnsBillingItem] = useState(() =>
    createFixedColumnsState()
  );

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_DETAIL, breadcrumbName: "Prabilling" },
    { path: "", breadcrumbName: "Customer Detail" },
  ];

  // Load ALL data on mount - eager loading
  useEffect(() => {
    if (!customerNumber || !billPeriod || !inSor) return;

    const baseParams = {
      customerNumber,
      billPeriod,
      inSor,
      accNumber,
      saNumber,
      page: 0,
      size: 10,
    };

    // Load header data
    dispatch(getCustomerHeaderData(baseParams));

    // Load all tab data immediately
    dispatch(getCustomerUsageData({ ...baseParams, sort: "measDate~desc" }));
    dispatch(getCustomerTaxData(baseParams));
    dispatch(getCustomerSaPrcRuleDetData(baseParams));
    dispatch(getCustomerSaTosData(baseParams));
    dispatch(getCustomerTosSubData(baseParams));
    dispatch(getCustomerBillingBucketData(baseParams));
    dispatch(getCustomerBillingItemData(baseParams));

    return () => {
      dispatch(resetCustomerDetail());
    };
  }, [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]);

  // Function to fetch data for a specific tab when pagination changes
  const fetchTabData = useCallback(
    (tabKey, page = 1, pageSize = 10) => {
      const tabConfig = TAB_CONFIGS.find((t) => t.key === tabKey);
      if (!tabConfig || !tabConfig.action) return;

      const params = {
        customerNumber,
        billPeriod,
        inSor,
        accNumber,
        saNumber,
        page: page - 1,
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
    },
    [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]
  );

  // Handle tab change - no lazy loading needed
  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  // Handle pagination change
  const handlePaginationChange = useCallback(
    (tabKey, page, pageSize) => {
      setPagination((prev) => ({
        ...prev,
        [tabKey]: { current: page, pageSize },
      }));
      fetchTabData(tabKey, page, pageSize);
    },
    [fetchTabData]
  );

  // Data dari Redux
  const headerData = customer_account_detail?.headerData || {};
  const usageData = customer_account_detail?.usageData?.result || [];
  const usagePage = customer_account_detail?.usageData?.page || {};
  const taxData = customer_account_detail?.taxData?.result || [];
  const taxPage = customer_account_detail?.taxData?.page || {};
  const saPrcRuleDetData =
    customer_account_detail?.saPrcRuleDetData?.result || [];
  const saPrcRuleDetPage =
    customer_account_detail?.saPrcRuleDetData?.page || {};
  const saTosDet = customer_account_detail?.saTosDet?.result || [];
  const saTosPage = customer_account_detail?.saTosDet?.page || {};
  const tosSubDet = customer_account_detail?.tosSubDet?.result || [];
  const tosSubPage = customer_account_detail?.tosSubDet?.page || {};
  const billingBucketData =
    customer_account_detail?.billingBucketData?.result || [];
  const billingBucketPage =
    customer_account_detail?.billingBucketData?.page || {};
  const billingItemData =
    customer_account_detail?.billingItemData?.result || [];
  const billingItemPage = customer_account_detail?.billingItemData?.page || {};

  // SA Data - transform dari headerData menjadi array untuk tabel
  const saData = useMemo(() => {
    if (!headerData) return [];

    // Jika headerData langsung adalah array
    if (Array.isArray(headerData)) {
      return headerData.map((item) => ({
        saNumber: item.saNumber,
        saReferenceNumber: item.saReferenceNumber,
        saDate: item.saDate,
        commitmentDate: item.commitmentDate,
        invoiceTemplate: item.invoiceTemplate,
        pjbgType: item.pjbgType,
        saServiceType: item.saServiceType,
        saType: item.saType,
        termOfPayment: item.termOfPayment,
        pricingRule: item.pricingRule,
        productName: item.productName,
        productType: item.productType,
        ppnTaxImp: item.ppnTaxImp,
        pphTaxImp: item.pphTaxImp,
        minUsage: item.minUsage,
        maxUsage: item.maxUsage,
        saDetTimeUnit: item.saDetTimeUnit,
        unitMeasure: item.unitMeasure,
        saDetCurrency: item.saDetCurrency,
        paymentType: item.paymentType,
        chargingMethod: item.chargingMethod,
        oupType: item.oupType,
        oupValue: item.oupValue,
        calculationRule: item.calculationRule,
        vatCurrency: item.vatCurrency,
        oupTimeUnit: item.oupTimeUnit,
        mpricingCode: item.mpricingCode,
      }));
    }

    // Jika headerData adalah object tunggal
    if (headerData.saNumber) {
      return [
        {
          saNumber: headerData.saNumber,
          saReferenceNumber: headerData.saReferenceNumber,
          saDate: headerData.saDate,
          commitmentDate: headerData.commitmentDate,
          invoiceTemplate: headerData.invoiceTemplate,
          pjbgType: headerData.pjbgType,
          saServiceType: headerData.saServiceType,
          saType: headerData.saType,
          termOfPayment: headerData.termOfPayment,
          pricingRule: headerData.pricingRule,
          productName: headerData.productName,
          productType: headerData.productType,
          ppnTaxImp: headerData.ppnTaxImp,
          pphTaxImp: headerData.pphTaxImp,
          minUsage: headerData.minUsage,
          maxUsage: headerData.maxUsage,
          saDetTimeUnit: headerData.saDetTimeUnit,
          unitMeasure: headerData.unitMeasure,
          saDetCurrency: headerData.saDetCurrency,
          paymentType: headerData.paymentType,
          chargingMethod: headerData.chargingMethod,
          oupType: headerData.oupType,
          oupValue: headerData.oupValue,
          calculationRule: headerData.calculationRule,
          vatCurrency: headerData.vatCurrency,
          oupTimeUnit: headerData.oupTimeUnit,
          mpricingCode: headerData.mpricingCode,
        },
      ];
    }

    return [];
  }, [headerData]);

  // Get first item for customer/account info display
  const firstHeaderData = useMemo(() => {
    if (Array.isArray(headerData) && headerData.length > 0) {
      return headerData[0];
    }
    return headerData || {};
  }, [headerData]);

  // Columns
  const saColumns = useMemo(() => createSAColumns(renderValue), []);
  const usageColumns = useMemo(() => createUsageColumns(renderValue), []);
  const taxColumns = useMemo(() => createTaxColumns(renderValue), []);
  const saPrcRuleDetColumns = useMemo(
    () => createSaPrcRuleDetColumns(renderValue),
    []
  );
  const saTosColumns = useMemo(() => createSaTosColumns(renderValue), []);
  const tosSubColumns = useMemo(() => createTosSubColumns(renderValue), []);
  const billingBucketColumns = useMemo(
    () => createBillingBucketColumns(renderValue),
    []
  );
  const billingItemColumns = useMemo(
    () => createBillingItemColumns(renderValue),
    []
  );

  // Processed columns with fixed
  const processedColumns = {
    sa: useMemo(
      () => applyFixedColumns(saColumns, fixedColumnsSA),
      [saColumns, fixedColumnsSA]
    ),
    usage: useMemo(
      () => applyFixedColumns(usageColumns, fixedColumnsUsage),
      [usageColumns, fixedColumnsUsage]
    ),
    tax: useMemo(
      () => applyFixedColumns(taxColumns, fixedColumnsTax),
      [taxColumns, fixedColumnsTax]
    ),
    saPrcRuleDet: useMemo(
      () => applyFixedColumns(saPrcRuleDetColumns, fixedColumnsPrice),
      [saPrcRuleDetColumns, fixedColumnsPrice]
    ),
    saTos: useMemo(
      () => applyFixedColumns(saTosColumns, fixedColumnsSaTos),
      [saTosColumns, fixedColumnsSaTos]
    ),
    tosSub: useMemo(
      () => applyFixedColumns(tosSubColumns, fixedColumnsTosSub),
      [tosSubColumns, fixedColumnsTosSub]
    ),
    billingBucket: useMemo(
      () => applyFixedColumns(billingBucketColumns, fixedColumnsBillingBucket),
      [billingBucketColumns, fixedColumnsBillingBucket]
    ),
    billingItem: useMemo(
      () => applyFixedColumns(billingItemColumns, fixedColumnsBillingItem),
      [billingItemColumns, fixedColumnsBillingItem]
    ),
  };

  // Column definitions
  const columnDefs = {
    sa: useMemo(
      () => saColumns.map((col) => ({ key: col.key, title: col.title })),
      [saColumns]
    ),
    usage: useMemo(
      () => usageColumns.map((col) => ({ key: col.key, title: col.title })),
      [usageColumns]
    ),
    tax: useMemo(
      () => taxColumns.map((col) => ({ key: col.key, title: col.title })),
      [taxColumns]
    ),
    saPrcRuleDet: useMemo(
      () =>
        saPrcRuleDetColumns.map((col) => ({ key: col.key, title: col.title })),
      [saPrcRuleDetColumns]
    ),
    saTos: useMemo(
      () => saTosColumns.map((col) => ({ key: col.key, title: col.title })),
      [saTosColumns]
    ),
    tosSub: useMemo(
      () => tosSubColumns.map((col) => ({ key: col.key, title: col.title })),
      [tosSubColumns]
    ),
    billingBucket: useMemo(
      () =>
        billingBucketColumns.map((col) => ({ key: col.key, title: col.title })),
      [billingBucketColumns]
    ),
    billingItem: useMemo(
      () =>
        billingItemColumns.map((col) => ({ key: col.key, title: col.title })),
      [billingItemColumns]
    ),
  };

  // Mapping untuk data, columns, dan setters
  const tabDataMapping = {
    0: {
      data: saData,
      columns: processedColumns.sa,
      defs: columnDefs.sa,
      fixed: fixedColumnsSA,
      setFixed: setFixedColumnsSA,
      page: { totalElements: saData.length },
      loading: loading_customer_detail.header,
    },
    1: {
      data: usageData,
      columns: processedColumns.usage,
      defs: columnDefs.usage,
      fixed: fixedColumnsUsage,
      setFixed: setFixedColumnsUsage,
      page: usagePage,
      loading: loading_customer_detail.usage,
    },
    2: {
      data: taxData,
      columns: processedColumns.tax,
      defs: columnDefs.tax,
      fixed: fixedColumnsTax,
      setFixed: setFixedColumnsTax,
      page: taxPage,
      loading: loading_customer_detail.tax,
    },
    3: {
      data: saPrcRuleDetData,
      columns: processedColumns.saPrcRuleDet,
      defs: columnDefs.saPrcRuleDet,
      fixed: fixedColumnsPrice,
      setFixed: setFixedColumnsPrice,
      page: saPrcRuleDetPage,
      loading: loading_customer_detail.saPrcRuleDet,
    },
    4: {
      data: saTosDet,
      columns: processedColumns.saTos,
      defs: columnDefs.saTos,
      fixed: fixedColumnsSaTos,
      setFixed: setFixedColumnsSaTos,
      page: saTosPage,
      loading: loading_customer_detail.saTos,
    },
    5: {
      data: tosSubDet,
      columns: processedColumns.tosSub,
      defs: columnDefs.tosSub,
      fixed: fixedColumnsTosSub,
      setFixed: setFixedColumnsTosSub,
      page: tosSubPage,
      loading: loading_customer_detail.tosSub,
    },
    6: {
      data: billingBucketData,
      columns: processedColumns.billingBucket,
      defs: columnDefs.billingBucket,
      fixed: fixedColumnsBillingBucket,
      setFixed: setFixedColumnsBillingBucket,
      page: billingBucketPage,
      loading: loading_customer_detail.billingBucket,
    },
    7: {
      data: billingItemData,
      columns: processedColumns.billingItem,
      defs: columnDefs.billingItem,
      fixed: fixedColumnsBillingItem,
      setFixed: setFixedColumnsBillingItem,
      page: billingItemPage,
      loading: loading_customer_detail.billingItem,
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
    <div className="grid grid-cols-4 gap-0">
      {items.map(({ label, value, key }) => (
        <DetailText key={key || label} label={label}>
          {value}
        </DetailText>
      ))}
    </div>
  );

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      {/* Customer & Account Info */}
      {renderInfoCard(
        "INIT / CUSTOMER & ACCOUNT INFORMATION",
        <div className="flex flex-col gap-2">
          <BaseContainer border header={<p>Customer Information</p>}>
            {renderDetailGrid([
              {
                label: "Init Code",
                value: renderValue(firstHeaderData.initCode),
              },
              {
                label: "Billing Cycle",
                value: renderValue(firstHeaderData.billingCycle),
              },
              {
                label: "Bill Period",
                value: renderValue(firstHeaderData.billPeriod),
              },
              {
                label: "Customer Number",
                value: renderValue(firstHeaderData.customerNumber),
              },
              {
                label: "Customer Name",
                value: renderValue(firstHeaderData.customerName),
              },
              {
                label: "Customer Type",
                value: renderValue(firstHeaderData.customerType),
              },
            ])}
          </BaseContainer>

          <BaseContainer border header={<p>Account Information</p>}>
            {renderDetailGrid([
              {
                label: "Account Number",
                value: renderValue(firstHeaderData.accountNumber),
              },
              {
                label: "Account Name",
                value: renderValue(firstHeaderData.accountName),
              },
              {
                label: "Account Status",
                value: firstHeaderData.accountStatus ? (
                  <StatusComponent colour={firstHeaderData.accountStatus}>
                    {firstHeaderData.accountStatus}
                  </StatusComponent>
                ) : (
                  ""
                ),
              },
              {
                label: "Account Group",
                value: renderValue(firstHeaderData.accountGroup),
              },
              { label: "SOR", value: renderValue(firstHeaderData.sor) },
              {
                label: "Cost Center",
                value: renderValue(firstHeaderData.costCenter),
              },
              {
                label: "Meter Reading Code",
                value: renderValue(firstHeaderData.meterReadingCode),
              },
              {
                label: "Account Segment",
                value: renderValue(firstHeaderData.accountSegment),
              },
              {
                label: "Account Group Type",
                value: renderValue(firstHeaderData.accountGroupType),
              },
              {
                label: "Account Type",
                value: renderValue(firstHeaderData.accountType),
              },
            ])}
          </BaseContainer>
        </div>
      )}

      {/* Detailed Data Tabs */}
      {renderInfoCard(
        "DETAILED DATA",
        <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
          {TAB_CONFIGS.map((tab) => {
            const tabData = tabDataMapping[tab.key];
            const currentPag = pagination[tab.key];

            return (
              <TabPane
                tab={
                  <span>
                    {tab.label}
                    {` (${tabData.page?.totalElements || 0})`}
                  </span>
                }
                key={tab.key}
              >
                <TableRBI
                  columns={tabData.columns}
                  dataSource={tabData.data}
                  totalData={tabData.page?.totalElements || 0}
                  current={tab.key === "0" ? 1 : currentPag.current}
                  pageSize={
                    tab.key === "0" ? tabData.data.length : currentPag.pageSize
                  }
                  onChange={(page, pageSize) =>
                    handlePaginationChange(tab.key, page, pageSize)
                  }
                  onSizeChanger={(current, size) =>
                    handlePaginationChange(tab.key, current, size)
                  }
                  tableScrolled={{ x: tab.scrollX, y: 500 }}
                  rowKey={(record, index) => `${tab.key}-${index}`}
                  columnDefinitions={tabData.defs}
                  fixedColumns={tabData.fixed}
                  showExport={false}
                  setFixedColumns={tabData.setFixed}
                  loading={tabData.loading}
                  pagination={tab.key !== "0"}
                />
              </TabPane>
            );
          })}
        </Tabs>
      )}

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
  );
};

export default AccountDetailPage;
