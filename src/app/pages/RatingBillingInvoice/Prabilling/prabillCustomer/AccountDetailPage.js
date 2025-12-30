import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Button, Tooltip } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
  getCustomerHeaderData,
  getCustomerSaData,
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
import PrabillSaDetailSection from "./ServiceAgreement/PrabillSaDetailSection";
import PrabillSaCalcRuleSection from "./ServiceAgreement/PrabillSaCalcRuleSection";
import PrabillSaPricingSection from "./ServiceAgreement/PrabillSaPricingSection";
import PrabillSaTosSection from "./ServiceAgreement/PrabillSaTosSection";

const { TabPane } = Tabs;

const renderValue = (val) => {
  if (val === null || val === undefined || val === "") return "";
  return val;
};

const createFixedColumnsState = (leftCols = ["no"], rightCols = []) => ({
  left: leftCols,
  right: rightCols,
});

const TAB_CONFIGS = [
  {
    key: "0",
    label: "Service Agreement",
    dataKey: "saData",
    scrollX: 2800,
    action: "getCustomerSaData",
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

  // State untuk SA Detail
  const [showSaDetail, setShowSaDetail] = useState(false);
  const [selectedPrabillSaId, setSelectedPrabillSaId] = useState(null);
  const [selectedSaNumber, setSelectedSaNumber] = useState("");
  const [saDetailTab, setSaDetailTab] = useState("Detail");
  const saDetailRef = useRef(null);

  const { customerNumber, billPeriod, inSor, accNumber, saNumber } =
    location.state || {};
  const { customer_account_detail, loading_customer_detail } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Fixed columns states
  const [fixedColumnsSA, setFixedColumnsSA] = useState(() =>
    createFixedColumnsState(["no"], ["action"])
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

    // Load SA data dengan parameter berbeda (tanpa inSor, accNumber, saNumber)
    dispatch(
      getCustomerSaData({
        customerNumber,
        billPeriod,
        page: 0,
        size: 10,
      })
    );

    // Load all other tab data immediately
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

  // Auto scroll to SA detail when opened
  useEffect(() => {
    if (showSaDetail && saDetailRef.current) {
      setTimeout(() => {
        saDetailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [showSaDetail, selectedPrabillSaId]);

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
        case "getCustomerSaData":
          // SA data hanya butuh customerNumber dan billPeriod
          dispatch(
            getCustomerSaData({
              customerNumber,
              billPeriod,
              page: page - 1,
              size: pageSize,
            })
          );
          break;
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

  // Handler untuk view SA detail
  const handleViewSaDetail = useCallback((record) => {
    setSelectedPrabillSaId(record.prabillSaId);
    setSelectedSaNumber(record.saNumber || "");
    setShowSaDetail(true);
    setSaDetailTab("Detail");
  }, []);

  // Handler untuk close SA detail
  const handleCloseSaDetail = useCallback(() => {
    setShowSaDetail(false);
    setSelectedPrabillSaId(null);
    setSelectedSaNumber("");
  }, []);

  // Data dari Redux
  const headerData = customer_account_detail?.headerData || {};
  const saData = customer_account_detail?.saData?.result || [];
  const saPage = customer_account_detail?.saData?.page || {};
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

  // Get first item for customer/account info display
  const firstHeaderData = useMemo(() => {
    if (Array.isArray(headerData) && headerData.length > 0) {
      return headerData[0];
    }
    return headerData || {};
  }, [headerData]);

  // Base Columns
  const saColumnsBase = useMemo(() => createSAColumns(renderValue), []);
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

  // SA Columns dengan Action Button menggunakan SVGIcon
  const saColumnsWithAction = useMemo(() => {
    return [
      ...saColumnsBase,
      {
        key: "action",
        title: "ACTION",
        width: 50,
        align: "center",
        fixed: "right",
        render: (text, record) => (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Detail">
              <div className="pt-1 cursor-pointer">
                <SVGIcon 
                  name="IconDetail" 
                  width={20} 
                  onClick={() => handleViewSaDetail(record)} 
                />
              </div>
            </Tooltip>
          </div>
        ),
      },
    ];
  }, [saColumnsBase, handleViewSaDetail]);

  // Processed columns with fixed
  const processedColumns = {
    sa: useMemo(
      () => applyFixedColumns(saColumnsWithAction, fixedColumnsSA),
      [saColumnsWithAction, fixedColumnsSA]
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
      () =>
        saColumnsWithAction.map((col) => ({ key: col.key, title: col.title })),
      [saColumnsWithAction]
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
      page: saPage,
      loading: loading_customer_detail.sa,
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

  // Tab items untuk SA Detail
  const saDetailTabItems = useMemo(
    () => [
      {
        key: "Detail",
        label: "Detail",
        children: <PrabillSaDetailSection prabillSaId={selectedPrabillSaId} />,
      },
      {
        key: "Pricing",
        label: "Pricing",
        children: (
          <PrabillSaPricingSection prabillSaId={selectedPrabillSaId} />
        ),
      },
      {
        key: "Calculation Rule",
        label: "Calculation Rule",
        children: (
          <PrabillSaCalcRuleSection prabillSaId={selectedPrabillSaId} />
        ),
      },
      {
        key: "Term Of Service",
        label: "Term Of Service",
        children: <PrabillSaTosSection prabillSaId={selectedPrabillSaId} />,
      },
    ],
    [selectedPrabillSaId]
  );

  const renderInfoCard = (title, children) => (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px]">{title}</p>
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
                  current={currentPag.current}
                  pageSize={currentPag.pageSize}
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
                  pagination={true}
                />
              </TabPane>
            );
          })}
        </Tabs>
      )}

      {/* SA Detail Section - Muncul ketika user klik detail */}
      {showSaDetail && selectedPrabillSaId && (
        <div ref={saDetailRef} className="mt-8">
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px]">
                  SERVICE AGREEMENT DETAIL
                  {selectedSaNumber && ` - ${selectedSaNumber}`}
                </p>
                <Button
                  type="default"
                  onClick={handleCloseSaDetail}
                  size="small"
                >
                  Close Detail
                </Button>
              </div>
            }
          >
            <Tabs
              items={saDetailTabItems}
              onChange={(key) => setSaDetailTab(key)}
              activeKey={saDetailTab}
            />
          </CardContainer>
        </div>
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