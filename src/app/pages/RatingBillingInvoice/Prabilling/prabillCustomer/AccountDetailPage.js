import React, { useState, useEffect, useMemo } from "react";
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
import { getCustomerAccountDetail } from "../../../../../redux/slices/rating_billing_invoice/praBilling";
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
  createSaPrcRuleDetColumns
} from "./columns";

const { TabPane } = Tabs;

const renderValue = (val) => {
  if (val === null || val === undefined || val === "") return "-";
  return val;
};

// Helper untuk membuat state fixed columns
const createFixedColumnsState = (leftCols = ["no"]) => ({
  left: leftCols,
  right: [],
});

// Konfigurasi tabs untuk detailed data
const TAB_CONFIGS = [
  { key: "1", label: "Usage", dataKey: "usageData", scrollX: 3500 },
  { key: "2", label: "Tax Implication", dataKey: "taxData", scrollX: 1000 },
  { key: "3", label: "SA Price Rule", dataKey: "pricingData", scrollX: 1200 },
  { key: "4", label: "SA TOS Detail", dataKey: "saTosDet", scrollX: 800 },
  { key: "5", label: "SA Data", dataKey: "saData", scrollX: 900 },
  { key: "6", label: "TOS Sub Detail", dataKey: "tosSubDet", scrollX: 800 },
  { key: "7", label: "Billing Bucket", dataKey: "billingBucketData", scrollX: 900 },
  { key: "8", label: "Billing Item", dataKey: "billingItemData", scrollX: 1500 },
  { key: "9", label: "SA Price Rule Detail", dataKey: "saPrcRuleDetData", scrollX: 1100 },
];



const AccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("1");

  const { customerNumber, billPeriod, inSor, accNumber, saNumber } = location.state || {};
  const { customer_account_detail, loading_customer_detail } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Fixed columns states
  const [fixedColumnsUsage, setFixedColumnsUsage] = useState(() => createFixedColumnsState(["no", "measDate"]));
  const [fixedColumnsTax, setFixedColumnsTax] = useState(() => createFixedColumnsState());
  const [fixedColumnsPrice, setFixedColumnsPrice] = useState(() => createFixedColumnsState());
  const [fixedColumnsSaTos, setFixedColumnsSaTos] = useState(() => createFixedColumnsState());
  const [fixedColumnsTosSubmission, setFixedColumnsTosSubmission] = useState(() => createFixedColumnsState(["no", "tosName"]));
  const [fixedColumnsTosSub, setFixedColumnsTosSub] = useState(() => createFixedColumnsState());
  const [fixedColumnsBillingBucket, setFixedColumnsBillingBucket] = useState(() => createFixedColumnsState());
  const [fixedColumnsBillingItem, setFixedColumnsBillingItem] = useState(() => createFixedColumnsState());
  const [fixedColumnsSaPrcRuleDet, setFixedColumnsSaPrcRuleDet] = useState(() => createFixedColumnsState());

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_DETAIL, breadcrumbName: "Prabilling" },
    { path: "", breadcrumbName: "Customer Detail" },
  ];

  useEffect(() => {
    if (!customerNumber || !billPeriod || !inSor) return;

    const params = {
      customerNumber,
      billPeriod,
      inSor,
      accNumber,
      saNumber,
      page: 0,
      size: 100,
    };

    dispatch(getCustomerAccountDetail(params));
  }, [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]);

  // Data dari Redux
  const usageData = customer_account_detail?.usageData || [];
  const taxData = customer_account_detail?.taxData || [];
  const saPriceRuleData = customer_account_detail?.pricingData || [];
  const saData = customer_account_detail?.saData || [];
  const saTosDet = customer_account_detail?.saTosDet || [];
  const tosSubDet = customer_account_detail?.tosSubDet || [];
  const billingBucketData = customer_account_detail?.billingBucketData || [];
  const billingItemData = customer_account_detail?.billingItemData || [];
  const saPrcRuleDetData = customer_account_detail?.saPrcRuleDetData || [];
  const headerData = customer_account_detail?.rawContent?.[0] || {};

  // Columns
  const usageColumns = useMemo(() => createUsageColumns(renderValue), []);
  const taxColumns = useMemo(() => createTaxColumns(renderValue), []);
  const saPriceRuleColumns = useMemo(() => createSaPriceRuleColumns(renderValue), []);
  const saTosColumns = useMemo(() => createSaTosColumns(renderValue), []);
  const tosSubmissionColumns = useMemo(() => createTosSubmissionColumns(renderValue), []);
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
    tosSubmission: useMemo(() => applyFixedColumns(tosSubmissionColumns, fixedColumnsTosSubmission), [tosSubmissionColumns, fixedColumnsTosSubmission]),
    tosSub: useMemo(() => applyFixedColumns(tosSubColumns, fixedColumnsTosSub), [tosSubColumns, fixedColumnsTosSub]),
    billingBucket: useMemo(() => applyFixedColumns(billingBucketColumns, fixedColumnsBillingBucket), [billingBucketColumns, fixedColumnsBillingBucket]),
    billingItem: useMemo(() => applyFixedColumns(billingItemColumns, fixedColumnsBillingItem), [billingItemColumns, fixedColumnsBillingItem]),
    saPrcRuleDet: useMemo(() => applyFixedColumns(saPrcRuleDetColumns, fixedColumnsSaPrcRuleDet), [saPrcRuleDetColumns, fixedColumnsSaPrcRuleDet]),
  };

  // Column definitions
  const columnDefs = {
    usage: useMemo(() => usageColumns.map((col) => ({ key: col.key, title: col.title })), [usageColumns]),
    tax: useMemo(() => taxColumns.map((col) => ({ key: col.key, title: col.title })), [taxColumns]),
    price: useMemo(() => saPriceRuleColumns.map((col) => ({ key: col.key, title: col.title })), [saPriceRuleColumns]),
    saTos: useMemo(() => saTosColumns.map((col) => ({ key: col.key, title: col.title })), [saTosColumns]),
    tosSubmission: useMemo(() => tosSubmissionColumns.map((col) => ({ key: col.key, title: col.title })), [tosSubmissionColumns]),
    tosSub: useMemo(() => tosSubColumns.map((col) => ({ key: col.key, title: col.title })), [tosSubColumns]),
    billingBucket: useMemo(() => billingBucketColumns.map((col) => ({ key: col.key, title: col.title })), [billingBucketColumns]),
    billingItem: useMemo(() => billingItemColumns.map((col) => ({ key: col.key, title: col.title })), [billingItemColumns]),
    saPrcRuleDet: useMemo(() => saPrcRuleDetColumns.map((col) => ({ key: col.key, title: col.title })), [saPrcRuleDetColumns]),
  };

  // Mapping untuk data, columns, dan setters
  const tabDataMapping = {
    "1": { data: usageData, columns: processedColumns.usage, defs: columnDefs.usage, fixed: fixedColumnsUsage, setFixed: setFixedColumnsUsage },
    "2": { data: taxData, columns: processedColumns.tax, defs: columnDefs.tax, fixed: fixedColumnsTax, setFixed: setFixedColumnsTax },
    "3": { data: saPriceRuleData, columns: processedColumns.price, defs: columnDefs.price, fixed: fixedColumnsPrice, setFixed: setFixedColumnsPrice },
    "4": { data: saTosDet, columns: processedColumns.saTos, defs: columnDefs.saTos, fixed: fixedColumnsSaTos, setFixed: setFixedColumnsSaTos },
    "5": { data: saData, columns: processedColumns.tosSubmission, defs: columnDefs.tosSubmission, fixed: fixedColumnsTosSubmission, setFixed: setFixedColumnsTosSubmission },
    "6": { data: tosSubDet, columns: processedColumns.tosSub, defs: columnDefs.tosSub, fixed: fixedColumnsTosSub, setFixed: setFixedColumnsTosSub },
    "7": { data: billingBucketData, columns: processedColumns.billingBucket, defs: columnDefs.billingBucket, fixed: fixedColumnsBillingBucket, setFixed: setFixedColumnsBillingBucket },
    "8": { data: billingItemData, columns: processedColumns.billingItem, defs: columnDefs.billingItem, fixed: fixedColumnsBillingItem, setFixed: setFixedColumnsBillingItem },
    "9": { data: saPrcRuleDetData, columns: processedColumns.saPrcRuleDet, defs: columnDefs.saPrcRuleDet, fixed: fixedColumnsSaPrcRuleDet, setFixed: setFixedColumnsSaPrcRuleDet },
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
    <Spin spinning={loading_customer_detail}>
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
                { label: "Billing Bucket", value: renderValue(headerData.billingBucket) },
              ])}
            </div>
          </>
        ))}



        {/* Detailed Data Tabs */}
        {renderInfoCard("DETAILED DATA", (
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            {TAB_CONFIGS.map((tab) => {
              const tabData = tabDataMapping[tab.key];
              return (
                <TabPane tab={<span>{tab.label} ({tabData.data.length})</span>} key={tab.key}>
                  <TableRBI
                    columns={tabData.columns}
                    dataSource={tabData.data}
                    totalData={tabData.data.length}
                    current={1}
                    pageSize={tabData.data.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    tableScrolled={{ x: tab.scrollX, y: 500 }}
                    rowKey={(record, index) => `${tab.key}-${index}`}
                    columnDefinitions={tabData.defs}
                    fixedColumns={tabData.fixed}
                    showExport={false}
                    setFixedColumns={tabData.setFixed}
                    loading={false}
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