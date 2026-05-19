import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Button, Tooltip } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainer from "../../../../../components/CardContainer";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
  getCustomerHeaderData,
  getCustomerSaData,
  getCustomerUsageData,
  getCustomerTaxData,
  getCustomerBillingBucketData,
  getCustomerBillingItemData,
  resetCustomerDetail,
} from "../../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import {
  createUsageColumns,
  createTaxColumns,
  createBillingBucketColumns,
  createBillingItemColumns,
  createSAColumns,
} from "./columns";
import StatusComponent from "../../../../../components/StatusComponent";
import PrabillSaDetailSection from "./ServiceAgreement/PrabillSaDetailSection";
import PrabillSaCalcRuleSection from "./ServiceAgreement/PrabillSaCalcRuleSection";
import PrabillSaPricingSection from "./ServiceAgreement/PrabillSaPricingSection";
import PrabillSaTosSection from "./ServiceAgreement/PrabillSaTosSection";

const renderValue = (val) => {
  if (val === null || val === undefined || val === "") return "-";
  return String(val);
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
    label: "Billing Bucket",
    dataKey: "billingBucketData",
    scrollX: 900,
    action: "getCustomerBillingBucketData",
  },
  {
    key: "4",
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
  });

  // State untuk SA Detail
  const [showSaDetail, setShowSaDetail] = useState(false);
  const [selectedPrabillSaId, setSelectedPrabillSaId] = useState(null);
  const [selectedSaNumber, setSelectedSaNumber] = useState("");
  const [saDetailTab, setSaDetailTab] = useState("Detail");
  const saDetailRef = useRef(null);

  const { customerNumber, billPeriod, inSor, accNumber, saNumber, id } =
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
  const [fixedColumnsBillingBucket, setFixedColumnsBillingBucket] = useState(
    () => createFixedColumnsState()
  );
  const [fixedColumnsBillingItem, setFixedColumnsBillingItem] = useState(() =>
    createFixedColumnsState()
  );

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_VIEW, breadcrumbName: "Prabilling" },
    { path: RBI_ROUTES.PRABILLING_DETAIL, breadcrumbName: "Detail Prabilling", state: { id } },
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

    dispatch(getCustomerHeaderData(baseParams));
    dispatch(getCustomerUsageData({ ...baseParams, sort: "measDate~desc" }));
    dispatch(getCustomerTaxData(baseParams));
    dispatch(getCustomerBillingBucketData(baseParams));
    dispatch(getCustomerBillingItemData(baseParams));
    dispatch(
      getCustomerSaData({
        customerNumber,
        billPeriod,
        page: 0,
        size: 10,
      })
    );

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

  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

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

  const handleViewSaDetail = useCallback((record) => {
    setSelectedPrabillSaId(record.prabillSaId);
    setSelectedSaNumber(record.saNumber || "");
    setShowSaDetail(true);
    setSaDetailTab("Detail");
  }, []);

  const handleCloseSaDetail = useCallback(() => {
    setShowSaDetail(false);
    setSelectedPrabillSaId(null);
    setSelectedSaNumber("");
  }, []);

  // Data dari Redux
  const saData = customer_account_detail?.saData?.result || [];
  const saPage = customer_account_detail?.saData?.page || {};
  const usageData = customer_account_detail?.usageData?.result || [];
  const usagePage = customer_account_detail?.usageData?.page || {};
  const taxData = customer_account_detail?.taxData?.result || [];
  const taxPage = customer_account_detail?.taxData?.page || {};
  const billingBucketData = customer_account_detail?.billingBucketData?.result || [];
  const billingBucketPage = customer_account_detail?.billingBucketData?.page || {};
  const billingItemData = customer_account_detail?.billingItemData?.result || [];
  const billingItemPage = customer_account_detail?.billingItemData?.page || {};

  const firstHeaderData = useMemo(() => {
    const headerData = customer_account_detail?.headerData || {};
    if (Array.isArray(headerData) && headerData.length > 0) {
      return headerData[0];
    }
    return headerData || {};
  }, [customer_account_detail?.headerData]);

  // Base Columns
  const saColumnsBase = useMemo(() => createSAColumns(renderValue), []);
  const usageColumns = useMemo(() => createUsageColumns(renderValue), []);
  const taxColumns = useMemo(() => createTaxColumns(renderValue), []);
  const billingBucketColumns = useMemo(() => createBillingBucketColumns(renderValue), []);
  const billingItemColumns = useMemo(() => createBillingItemColumns(renderValue), []);

  const saColumnsWithAction = useMemo(() => {
    return [
      ...saColumnsBase,
      {
        key: "action",
        title: "ACTION",
        width: 80,
        align: "center",
        fixed: "right",
        render: (text, record) => (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Detail">
              <div className="pt-0 cursor-pointer">
                <SVGIcon
                  name="IconDetail"
                  color="#0075BF"
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
    billingBucket: useMemo(
      () => applyFixedColumns(billingBucketColumns, fixedColumnsBillingBucket),
      [billingBucketColumns, fixedColumnsBillingBucket]
    ),
    billingItem: useMemo(
      () => applyFixedColumns(billingItemColumns, fixedColumnsBillingItem),
      [billingItemColumns, fixedColumnsBillingItem]
    ),
  };

  const columnDefs = {
    sa: useMemo(
      () => saColumnsWithAction.map((col) => ({ key: col.key, title: col.title })),
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
    billingBucket: useMemo(
      () => billingBucketColumns.map((col) => ({ key: col.key, title: col.title })),
      [billingBucketColumns]
    ),
    billingItem: useMemo(
      () => billingItemColumns.map((col) => ({ key: col.key, title: col.title })),
      [billingItemColumns]
    ),
  };

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
      data: billingBucketData,
      columns: processedColumns.billingBucket,
      defs: columnDefs.billingBucket,
      fixed: fixedColumnsBillingBucket,
      setFixed: setFixedColumnsBillingBucket,
      page: billingBucketPage,
      loading: loading_customer_detail.billingBucket,
    },
    4: {
      data: billingItemData,
      columns: processedColumns.billingItem,
      defs: columnDefs.billingItem,
      fixed: fixedColumnsBillingItem,
      setFixed: setFixedColumnsBillingItem,
      page: billingItemPage,
      loading: loading_customer_detail.billingItem,
    },
  };

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
        children: <PrabillSaPricingSection prabillSaId={selectedPrabillSaId} />,
      },
      {
        key: "Calculation Rule",
        label: "Calculation Rule",
        children: <PrabillSaCalcRuleSection prabillSaId={selectedPrabillSaId} />,
      },
      {
        key: "Term Of Service",
        label: "Term Of Service",
        children: <PrabillSaTosSection prabillSaId={selectedPrabillSaId} />,
      },
    ],
    [selectedPrabillSaId]
  );

  return (
    <>
      <BreadCrumb routes={routes} />

      {/* INIT / CUSTOMER & ACCOUNT INFORMATION */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold text-primary">
              INIT / CUSTOMER & ACCOUNT INFORMATION
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-1">
          {/* Customer Information - CollapsibleContainer */}
          <CollapsibleContainer header={"Customer Information"} border className="mt-2">
            <div className="grid grid-cols-4 gap-0">
              <DetailText label="Init Code">
                {renderValue(firstHeaderData.initCode)}
              </DetailText>
              <DetailText label="Billing Cycle">
                {renderValue(firstHeaderData.billingCycle)}
              </DetailText>
              <DetailText label="Bill Period">
                {renderValue(firstHeaderData.billPeriod)}
              </DetailText>
              <DetailText label="Customer Number">
                {renderValue(firstHeaderData.customerNumber)}
              </DetailText>
              <DetailText label="Customer Name">
                {renderValue(firstHeaderData.customerName)}
              </DetailText>
              <DetailText label="Customer Type">
                {renderValue(firstHeaderData.customerType)}
              </DetailText>
            </div>
          </CollapsibleContainer>

          {/* Account Information - CollapsibleContainer */}
          <CollapsibleContainer header={"Account Information"} border className="mt-1">
            <div className="grid grid-cols-4 gap-0">
              <DetailText label="Account Number">
                {renderValue(firstHeaderData.accountNumber)}
              </DetailText>
              <DetailText label="Account Name">
                {renderValue(firstHeaderData.accountName)}
              </DetailText>
              <DetailText label="Account Status">
                {firstHeaderData.accountStatus ? (
                  <StatusComponent colour={firstHeaderData.accountStatus}>
                    {firstHeaderData.accountStatus}
                  </StatusComponent>
                ) : (
                  ""
                )}
              </DetailText>
              <DetailText label="Account Group">
                {renderValue(firstHeaderData.accountGroup)}
              </DetailText>
              <DetailText label="SOR">
                {renderValue(firstHeaderData.sor)}
              </DetailText>
              <DetailText label="Cost Center">
                {renderValue(firstHeaderData.costCenter)}
              </DetailText>
              <DetailText label="Meter Reading Code">
                {renderValue(firstHeaderData.meterReadingCode)}
              </DetailText>
              <DetailText label="Account Segment">
                {renderValue(firstHeaderData.accountSegment)}
              </DetailText>
              <DetailText label="Account Group Type">
                {renderValue(firstHeaderData.accountGroupType)}
              </DetailText>
              <DetailText label="Account Type">
                {renderValue(firstHeaderData.accountType)}
              </DetailText>
            </div>
          </CollapsibleContainer>
        </div>
      </CardContainer>

      {/* DETAILED DATA */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold text-primary">DETAILED DATA</p>
          </div>
        }
        className="mt-1"
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={TAB_CONFIGS.map((tab) => {
            const tabData = tabDataMapping[tab.key];
            const currentPag = pagination[tab.key];
            return {
              key: tab.key,
              label: (
                <span>
                  {tab.label}
                  {` (${tabData.page?.totalElements || 0})`}
                </span>
              ),
              children: (
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
              ),
            };
          })}
        />
      </CardContainer>

      {/* SA Detail Section */}
      {showSaDetail && selectedPrabillSaId && (
        <div ref={saDetailRef} className="mt-1">
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] font-bold text-primary">
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

      {/* Back Button */}
      <div className="bg-white rounded-md w-full flex justify-start mb-4 p-3 mt-1">
        <ButtonComponent
          type="submit"
          border={false}
          icon={<LeftOutlined style={{ color: "#fff", fontSize: 16 }} />}
          onClick={() => navigate(-1)}
        >
          Back
        </ButtonComponent>
      </div>
    </>
  );
};

export default AccountDetailPage;