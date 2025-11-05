import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Spin, Card, Statistic, Row, Col, Tag, Button } from "antd";
import {
  FileTextOutlined,
  ThunderboltOutlined,
  PercentageOutlined,
  DashboardOutlined,
  DollarOutlined,
  LeftOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { getCustomerAccountDetail } from "../../../../../redux/slices/rating_billing_invoice/praBilling";

const { TabPane } = Tabs;

const AccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("1");
  
  const { 
    customerNumber, 
    billPeriod, 
    inSor,
    accNumber,
    saNumber  
  } = location.state || {};
  
  const { customer_account_detail, loading_customer_detail } = useSelector(
    (state) => state.rbi_prabilling
  );

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_DETAIL, breadcrumbName: "Prabilling" },
    { path: "", breadcrumbName: "Customer Detail" },
  ];

  useEffect(() => {
    if (!customerNumber || !billPeriod || !inSor) {
      console.error('Missing required parameters');
      return;
    }

    const params = {
      customerNumber,
      billPeriod,
      inSor,
      accNumber,  
      saNumber, 
      page: 0,
      size: 100,
    }

    dispatch(getCustomerAccountDetail(params));
  }, [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]);

  const usageData = customer_account_detail?.usageData || [];
  const taxData = customer_account_detail?.taxData || [];
  const saPriceRuleData = customer_account_detail?.pricingData || [];
  const tosSubmissionData = customer_account_detail?.tosSubmissionData || [];
  const saTosDet = customer_account_detail?.saTosDet || [];
  const tosSubDet = customer_account_detail?.tosSubDet || [];
  
  const headerData = customer_account_detail?.rawContent?.[0] || {};

  const summary = useMemo(() => {
    const totalEnergy = usageData.reduce((sum, item) => 
      sum + (parseFloat(item.engMeasured) || 0), 0
    );
    const totalVolume = usageData.reduce((sum, item) => 
      sum + (parseFloat(item.volMeasured60) || 0), 0
    );
    const uniqueDates = usageData.filter(item => item.measDate).length;
    
    return {
      totalEnergy: totalEnergy.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      totalVolume: totalVolume.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      uniqueMeasurements: uniqueDates,
      totalTaxRecords: taxData.length,
      totalPriceRules: saPriceRuleData.length,
      avgEnergyPerMeasurement: uniqueDates > 0 ? 
        (totalEnergy / uniqueDates).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0'
    };
  }, [usageData, taxData, saPriceRuleData]);

  const scrollTabs = (direction) => {
    const tabNavWrap = document.querySelector('.ant-tabs-nav-wrap');
    const tabBar = document.querySelector('.ant-tabs-nav-list');
    
    if (tabBar && tabNavWrap) {
      const scrollAmount = 300;
      const currentScroll = tabNavWrap.scrollLeft;
      
      if (direction === 'left') {
        tabNavWrap.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        tabNavWrap.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  // INIT / CUSTOMER & ACCOUNT - Digabung jadi satu section
  const renderInitCustomerAccount = () => (
    <BaseContainer header="INIT / CUSTOMER & ACCOUNT INFORMATION">
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">Customer Information</h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="Init Code">
            {headerData.initCode || "NULL"}
          </DetailText>
          <DetailText label="Billing Cycle">
            {headerData.billingCycle || "NULL"}
          </DetailText>
          <DetailText label="Bill Period">
            {headerData.billPeriod || "NULL"}
          </DetailText>
          <DetailText label="Customer Number">
            {headerData.customerNumber || "NULL"}
          </DetailText>
          <DetailText label="Customer Name">
            {headerData.customerName || "NULL"}
          </DetailText>
          <DetailText label="Customer Type">
            {headerData.customerType || "NULL"}
          </DetailText>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">Account Information</h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="Account Number">
            {headerData.accountNumber || "NULL"}
          </DetailText>
          <DetailText label="Account Name">
            {headerData.accountName || "NULL"}
          </DetailText>
          <DetailText label="Account Status">
            {headerData.accountStatus ? (
              <Tag color={headerData.accountStatus === 'ACTIVE' ? 'green' : 'red'}>
                {headerData.accountStatus}
              </Tag>
            ) : "NULL"}
          </DetailText>
          <DetailText label="Account Group">
            {headerData.accountGroup || "NULL"}
          </DetailText>
          <DetailText label="SOR">
            {headerData.sor || "NULL"}
          </DetailText>
          <DetailText label="Cost Center">
            {headerData.accountCostCenter || "NULL"}
          </DetailText>
          <DetailText label="Meter Reading Code">
            {headerData.meterReadingCode || "NULL"}
          </DetailText>
          <DetailText label="Account Segment">
            {headerData.accountSegment || "NULL"}
          </DetailText>
          <DetailText label="Account Group Type">
            {headerData.accountGroupType || "NULL"}
          </DetailText>
          <DetailText label="Account Type">
            {headerData.accountType || "NULL"}
          </DetailText>
          <DetailText label="Billing Bucket">
            {headerData.billingBucket || "NULL"}
          </DetailText>
        </div>
      </div>
    </BaseContainer>
  );

  // SA (Service Agreement) - Detail Text
  const renderServiceAgreementInfo = () => (
    <BaseContainer header="SERVICE AGREEMENT (SA) INFORMATION">
      <div className="grid grid-cols-4 gap-4">
        <DetailText label="SA Number">
          {headerData.saNumber || "NULL"}
        </DetailText>
        <DetailText label="SA Reference Number">
          {headerData.saReferenceNumber || "NULL"}
        </DetailText>
        <DetailText label="SA Date">
          {headerData.saDate || "NULL"}
        </DetailText>
        <DetailText label="Commitment Date">
          {headerData.commitmentDate || "NULL"}
        </DetailText>

        <DetailText label="M Pricing Code">
          {headerData.mpricingCode || "NULL"}
        </DetailText>
        <DetailText label="Invoice Template">
          {headerData.invoiceTemplate || "NULL"}
        </DetailText>
        <DetailText label="PJBG Type">
          {headerData.pjbgType || "NULL"}
        </DetailText>
        <DetailText label="SA Service Type">
          {headerData.saServiceType || "NULL"}
        </DetailText>

        <DetailText label="SA Type">
          {headerData.saType || "NULL"}
        </DetailText>
        <DetailText label="Term of Payment">
          {headerData.termOfPayment || "NULL"}
        </DetailText>
        <DetailText label="Pricing Rule">
          {headerData.pricingRule || "NULL"}
        </DetailText>
        <DetailText label="Full Price Code">
          {headerData.fullPriceCode || "NULL"}
        </DetailText>

        <DetailText label="IDR Full Price Code">
          {headerData.idrFullPriceCode || "NULL"}
        </DetailText>
        <DetailText label="USD Full Price Code">
          {headerData.usdFullPriceCode || "NULL"}
        </DetailText>
        <DetailText label="IDR UOM">
          {headerData.idrUom || "NULL"}
        </DetailText>
        <DetailText label="IDR Value">
          {headerData.idrValue ? 
            `IDR ${parseFloat(headerData.idrValue).toLocaleString()}` : 
            "NULL"}
        </DetailText>

        <DetailText label="USD UOM">
          {headerData.usdUom || "NULL"}
        </DetailText>
        <DetailText label="USD Value">
          {headerData.usdValue ? 
            `$ ${parseFloat(headerData.usdValue).toLocaleString()}` : 
            "NULL"}
        </DetailText>
        <DetailText label="Product Name">
          {headerData.productName || "NULL"}
        </DetailText>
        <DetailText label="Product Type">
          {headerData.productType || "NULL"}
        </DetailText>

        <DetailText label="IDR Late Charge">
          {headerData.idrLateCharge || "NULL"}
        </DetailText>
        <DetailText label="USD Late Charge">
          {headerData.usdLateCharge || "NULL"}
        </DetailText>
        <DetailText label="PPN Tax Implementation">
          {headerData.ppnTaxImp || "NULL"}
        </DetailText>
        <DetailText label="PPH Tax Implementation">
          {headerData.pphTaxImp || "NULL"}
        </DetailText>
      </div>
    </BaseContainer>
  );

  // SA DETAIL & SA CALC - Digabung karena dari pivoting field yang sama
  const renderSADetailCalc = () => (
    <BaseContainer header="SA DETAIL & CALCULATION">
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">SA Detail</h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="Min Usage">
            {headerData.minUsage || "NULL"}
          </DetailText>
          <DetailText label="Maximum Usage">
            {headerData.maxUsage || "NULL"}
          </DetailText>
          <DetailText label="Time Unit">
            {headerData.timeUnit || "NULL"}
          </DetailText>
          <DetailText label="Unit of Measure">
            {headerData.unitMeasure || "NULL"}
          </DetailText>
          <DetailText label="Currency">
            {headerData.currency || "NULL"}
          </DetailText>
          <DetailText label="Payment Type">
            {headerData.paymentType || "NULL"}
          </DetailText>
          <DetailText label="Charging Method">
            {headerData.chargingMethod || "NULL"}
          </DetailText>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">SA Calculation</h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="OUP Type">
            {headerData.oupType || "NULL"}
          </DetailText>
          <DetailText label="OUP Value">
            {headerData.oupValue || "NULL"}
          </DetailText>
          <DetailText label="Calculation Rule">
            {headerData.calculationRule || "NULL"}
          </DetailText>
          <DetailText label="VAT Currency">
            {headerData.vatCurrency || "NULL"}
          </DetailText>
          <DetailText label="VAT">
            {headerData.vat || "NULL"}
          </DetailText>
          <DetailText label="Withholding Tax">
            {headerData.withholdingTax || "NULL"}
          </DetailText>
        </div>
      </div>
    </BaseContainer>
  );

  // LATE CHARGE - Detail Text
  const renderLateChargeInfo = () => (
    <BaseContainer header="LATE CHARGE INFORMATION">
      <div className="grid grid-cols-4 gap-4">
        <DetailText label="LC Currency">
          {headerData.lcCurrency || "NULL"}
        </DetailText>
        <DetailText label="Total Amount">
          {headerData.totalAmount ? 
            parseFloat(headerData.totalAmount).toLocaleString() : 
            "NULL"}
        </DetailText>
        <DetailText label="Bill Status">
          {headerData.billStatus || "NULL"}
        </DetailText>
        <DetailText label="LC Bill Period">
          {headerData.lcBillPeriod || "NULL"}
        </DetailText>

        <DetailText label="Total Period Bill">
          {headerData.totalPeriodBill || "NULL"}
        </DetailText>
        <DetailText label="Billing Code">
          {headerData.billingCode || "NULL"}
        </DetailText>
        <DetailText label="Constant">
          {headerData.constant || "NULL"}
        </DetailText>
        <DetailText label="LC Time Unit">
          {headerData.lcTimeUnit || "NULL"}
        </DetailText>
      </div>
    </BaseContainer>
  );

  // const renderSummary = () => (
  //   <BaseContainer header="SUMMARY STATISTICS">
  //     <Row gutter={16}>
  //       <Col span={6}>
  //         <Card>
  //           <Statistic
  //             title="Total Energy Measured"
  //             value={summary.totalEnergy}
  //             suffix="MMBTU"
  //             prefix={<ThunderboltOutlined />}
  //           />
  //         </Card>
  //       </Col>
  //       <Col span={6}>
  //         <Card>
  //           <Statistic
  //             title="Total Volume"
  //             value={summary.totalVolume}
  //             suffix="m³"
  //             prefix={<DashboardOutlined />}
  //           />
  //         </Card>
  //       </Col>
  //       <Col span={6}>
  //         <Card>
  //           <Statistic
  //             title="Unique Measurements"
  //             value={summary.uniqueMeasurements}
  //             suffix="dates"
  //           />
  //         </Card>
  //       </Col>
  //       <Col span={6}>
  //         <Card>
  //           <Statistic
  //             title="Avg Energy/Measurement"
  //             value={summary.avgEnergyPerMeasurement}
  //             suffix="MMBTU"
  //           />
  //         </Card>
  //       </Col>
  //     </Row>
      
  //     <Row gutter={16} style={{ marginTop: 16 }}>
  //       <Col span={8}>
  //         <Card>
  //           <Statistic
  //             title="Tax Records"
  //             value={summary.totalTaxRecords}
  //             prefix={<PercentageOutlined />}
  //           />
  //         </Card>
  //       </Col>
  //       <Col span={8}>
  //         <Card>
  //           <Statistic
  //             title="SA Price Rules"
  //             value={summary.totalPriceRules}
  //             prefix={<DollarOutlined />}
  //           />
  //         </Card>
  //       </Col>
  //       <Col span={8}>
  //         <Card>
  //           <Statistic
  //             title="TOS Submissions"
  //             value={tosSubmissionData.length}
  //             prefix={<FileTextOutlined />}
  //           />
  //         </Card>
  //       </Col>
  //     </Row>
  //   </BaseContainer>
  // );

  // USAGE Data Columns
  const usageColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      fixed: "left",
      render: (text, object, index) => index + 1,
    },
    {
      title: "MEAS DATE",
      dataIndex: "measDate",
      width: 120,
      align: "center",
      fixed: "left",
      render: (val) => val || "NULL",
    },
    {
      title: "ASSET SERIAL",
      dataIndex: "assetSerialNum",
      width: 130,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "ASSET TYPE",
      dataIndex: "assetType",
      width: 120,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "STREAM",
      dataIndex: "stream",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "TEMPERATURE",
      dataIndex: "temperature",
      width: 120,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "PRESSURE",
      dataIndex: "pressure",
      width: 120,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "CORRECTION FACTOR",
      dataIndex: "correctionFactor",
      width: 150,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "CALORIE",
      dataIndex: "calorie",
      width: 120,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "BEGIN STAND",
      dataIndex: "beginStand",
      width: 130,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "END STAND",
      dataIndex: "endStand",
      width: 130,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "ENG MEASURED",
      dataIndex: "engMeasured",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString('en-US', { maximumFractionDigits: 4 }) : "NULL",
    },
    {
      title: "GHV",
      dataIndex: "ghv",
      width: 120,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 200,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "TAXATION",
      dataIndex: "taxation",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "VOL MEASURED 27",
      dataIndex: "volMeasured27",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString() : "NULL",
    },
    {
      title: "VOL MEASURED 60",
      dataIndex: "volMeasured60",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString() : <Tag color="default">NULL</Tag>,
    },
    {
      title: "VOL MSCF",
      dataIndex: "volMscf",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString() : <Tag color="default">NULL</Tag>,
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 150,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "INIT CODE",
      dataIndex: "usageInitCode",
      width: 150,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "ENERGY",
      dataIndex: "energy",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString('en-US', { maximumFractionDigits: 4 }) : <Tag color="default">NULL</Tag>,
    },
    {
      title: "UNCORRECTED VALUE",
      dataIndex: "uncorrectedValue",
      width: 150,
      align: "right",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "RATING CODE",
      dataIndex: "ratingCode",
      width: 120,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
  ], []);

  // TAX IMPLICATION Columns
  const taxColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "TAX IMP NAME",
      dataIndex: "taxImpName",
      width: 300,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      width: 120,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "IMP TYPE",
      dataIndex: "impType",
      width: 120,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "GUNGGUNG",
      dataIndex: "gunggung",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "RATING CODE",
      dataIndex: "ratingCode",
      width: 150,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
  ], []);

  // SA PRICE RULE Columns
  const saPriceRuleColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "LINE NUMBER",
      dataIndex: "lineNumber",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "MIN",
      dataIndex: "min",
      width: 120,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString() : <Tag color="default">NULL</Tag>,
    },
    {
      title: "MAX",
      dataIndex: "max",
      width: 120,
      align: "right",
      render: (val) => {
        if (!val) return <Tag color="default">NULL</Tag>;
        if (isNaN(val)) return val;
        if (val === "0" || parseFloat(val) === 0) return "Unlimited";
        return parseFloat(val).toLocaleString();
      },
    },
    {
      title: "PRICE CODE",
      dataIndex: "priceCode",
      width: 150,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "PRICE CODE RULE",
      dataIndex: "priceCodeRule",
      width: 200,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString('en-US', { maximumFractionDigits: 4 }) : <Tag color="default">NULL</Tag>,
    },
    {
      title: "UOM",
      dataIndex: "uom",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
  ], []);

  // SA TOS DETAIL Columns
  const saTosColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "SA TOS NAME",
      dataIndex: "saTosName",
      width: 200,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "ATTRIBUTE NAME",
      dataIndex: "attributeName",
      width: 200,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 200,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
  ], []);

  // TOS SUBMISSION Columns
  const tosSubmissionColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "TOS NAME",
      dataIndex: "tosName",
      width: 200,
      fixed: "left",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 150,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 150,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 250,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
  ], []);

  // TOS SUBMISSION DETAIL Columns
  const tosSubColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "ATTRIBUTE NAME",
      dataIndex: "attributeName",
      width: 200,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      width: 100,
      align: "center",
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 150,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
    {
      title: "FROM ITEM",
      dataIndex: "fromItem",
      width: 150,
      render: (val) => val || <Tag color="default">NULL</Tag>,
    },
  ], []);

  return (
    <Spin spinning={loading_customer_detail}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        {renderInitCustomerAccount()}
        {renderServiceAgreementInfo()}
        {renderSADetailCalc()}
        {renderLateChargeInfo()}
        {/* {renderSummary()} */}
        
        <BaseContainer header="DETAILED DATA">
          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              left: 0, 
              top: 4, 
              zIndex: 1000,
              background: 'white',
              paddingRight: '10px',
              height: '40px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Button 
                type="primary" 
                icon={<LeftOutlined />} 
                onClick={() => scrollTabs('left')}
                size="small"
                style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}
              />
            </div>
            <div style={{ 
              position: 'absolute', 
              right: 0, 
              top: 4, 
              zIndex: 1000,
              background: 'white',
              paddingLeft: '10px',
              height: '40px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Button 
                type="primary" 
                icon={<RightOutlined />} 
                onClick={() => scrollTabs('right')}
                size="small"
                style={{ boxShadow: '-2px 0 8px rgba(0,0,0,0.15)' }}
              />
            </div>
            <div style={{ paddingLeft: '45px', paddingRight: '45px' }}>
              <Tabs 
                activeKey={activeTab}
                onChange={setActiveTab}
                type="card"
              >
                <TabPane
                  tab={
                    <span>
                      <ThunderboltOutlined /> Usage ({usageData.length})
                    </span>
                  }
                  key="1"
                >
                  <TablePaginationNew
                    columns={usageColumns}
                    dataSource={usageData}
                    totalData={usageData.length}
                    current={1}
                    pageSize={usageData.length}
                    onChange={() => {}}
                    tableScrolled={{ x: 3500, y: 500 }}
                    rowKey={(record, index) => `usage-${index}`}
                    pagination={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <PercentageOutlined /> Tax Implication ({taxData.length})
                    </span>
                  }
                  key="2"
                >
                  <TablePaginationNew
                    columns={taxColumns}
                    dataSource={taxData}
                    totalData={taxData.length}
                    current={1}
                    pageSize={taxData.length}
                    onChange={() => {}}
                    tableScrolled={{ x: 1000, y: 500 }}
                    rowKey={(record, index) => `tax-${index}`}
                    pagination={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <DollarOutlined /> SA Price Rule ({saPriceRuleData.length})
                    </span>
                  }
                  key="3"
                >
                  <TablePaginationNew
                    columns={saPriceRuleColumns}
                    dataSource={saPriceRuleData}
                    totalData={saPriceRuleData.length}
                    current={1}
                    pageSize={saPriceRuleData.length}
                    onChange={() => {}}
                    tableScrolled={{ x: 1200, y: 500 }}
                    rowKey={(record, index) => `saprice-${index}`}
                    pagination={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <InfoCircleOutlined /> SA TOS Detail ({saTosDet.length})
                    </span>
                  }
                  key="4"
                >
                  <TablePaginationNew
                    columns={saTosColumns}
                    dataSource={saTosDet}
                    totalData={saTosDet.length}
                    current={1}
                    pageSize={saTosDet.length}
                    onChange={() => {}}
                    tableScrolled={{ x: 800, y: 500 }}
                    rowKey={(record, index) => `satos-${index}`}
                    pagination={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <FileTextOutlined /> TOS Submission ({tosSubmissionData.length})
                    </span>
                  }
                  key="5"
                >
                  <TablePaginationNew
                    columns={tosSubmissionColumns}
                    dataSource={tosSubmissionData}
                    totalData={tosSubmissionData.length}
                    current={1}
                    pageSize={tosSubmissionData.length}
                    onChange={() => {}}
                    tableScrolled={{ x: 900, y: 500 }}
                    rowKey={(record, index) => `tossub-${index}`}
                    pagination={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <SettingOutlined /> TOS Sub Detail ({tosSubDet.length})
                    </span>
                  }
                  key="6"
                >
                  <TablePaginationNew
                    columns={tosSubColumns}
                    dataSource={tosSubDet}
                    totalData={tosSubDet.length}
                    current={1}
                    pageSize={tosSubDet.length}
                    onChange={() => {}}
                    tableScrolled={{ x: 800, y: 500 }}
                    rowKey={(record, index) => `tossubdet-${index}`}
                    pagination={false}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
          <style>{`
            .ant-tabs-nav-wrap {
              overflow-x: auto !important;
              overflow-y: hidden !important;
              scroll-behavior: smooth !important;
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
            .ant-tabs-nav-wrap::-webkit-scrollbar {
              display: none !important;
            }
            .ant-tabs-nav-list {
              white-space: nowrap !important;
            }
          `}</style>
        </BaseContainer>

        <div className={"w-full flex justify-start my-5"}>
          <ButtonComponent
            type={"submit"}
            border={false}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 16,
                  justifyItems: "left",
                }}
              />
            }
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