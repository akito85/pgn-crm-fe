import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Spin, Tag, Button } from "antd";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { getCustomerAccountDetail } from "../../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const { TabPane } = Tabs;

const AccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("1");

  const { customerNumber, billPeriod, inSor, accNumber, saNumber } =
    location.state || {};

  const { customer_account_detail, loading_customer_detail } = useSelector(
    (state) => state.rbi_prabilling
  );

  const [fixedColumnsUsage, setFixedColumnsUsage] = useState(() => ({
    left: ["no", "measDate"],
    right: [],
  }));

  const [fixedColumnsTax, setFixedColumnsTax] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const [fixedColumnsPrice, setFixedColumnsPrice] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const [fixedColumnsSaTos, setFixedColumnsSaTos] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const [fixedColumnsTosSubmission, setFixedColumnsTosSubmission] = useState(
    () => ({
      left: ["no", "tosName"],
      right: [],
    })
  );

  const [fixedColumnsTosSub, setFixedColumnsTosSub] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_DETAIL, breadcrumbName: "Prabilling" },
    { path: "", breadcrumbName: "Customer Detail" },
  ];

  useEffect(() => {
    if (!customerNumber || !billPeriod || !inSor) {
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
    };

    dispatch(getCustomerAccountDetail(params));
  }, [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]);

  const usageData = customer_account_detail?.usageData || [];
  const taxData = customer_account_detail?.taxData || [];
  const saPriceRuleData = customer_account_detail?.pricingData || [];
  const saData = customer_account_detail?.saData || [];
  const saTosDet = customer_account_detail?.saTosDet || [];
  const tosSubDet = customer_account_detail?.tosSubDet || [];

  const headerData = customer_account_detail?.rawContent?.[0] || {};

  const scrollTabs = (direction) => {
    const tabNavWrap = document.querySelector(".ant-tabs-nav-wrap");
    const tabBar = document.querySelector(".ant-tabs-nav-list");

    if (tabBar && tabNavWrap) {
      const scrollAmount = 300;
      const currentScroll = tabNavWrap.scrollLeft;

      if (direction === "left") {
        tabNavWrap.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: "smooth",
        });
      } else {
        tabNavWrap.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const renderValue = (val) => {
    if (val === null || val === undefined || val === "") {
      return "-";
    }
    return val;
  };

  const renderInitCustomerAccount = () => (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold">
            INIT / CUSTOMER & ACCOUNT INFORMATION
          </p>
        </div>
      }
    >
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">
          Customer Information
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="Init Code">
            {renderValue(headerData.initCode)}
          </DetailText>
          <DetailText label="Billing Cycle">
            {renderValue(headerData.billingCycle)}
          </DetailText>
          <DetailText label="Bill Period">
            {renderValue(headerData.billPeriod)}
          </DetailText>
          <DetailText label="Customer Number">
            {renderValue(headerData.customerNumber)}
          </DetailText>
          <DetailText label="Customer Name">
            {renderValue(headerData.customerName)}
          </DetailText>
          <DetailText label="Customer Type">
            {renderValue(headerData.customerType)}
          </DetailText>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">
          Account Information
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="Account Number">
            {renderValue(headerData.accountNumber)}
          </DetailText>
          <DetailText label="Account Name">
            {renderValue(headerData.accountName)}
          </DetailText>
          <DetailText label="Account Status">
            {headerData.accountStatus ? (
              <Tag
                color={headerData.accountStatus === "ACTIVE" ? "green" : "red"}
              >
                {headerData.accountStatus}
              </Tag>
            ) : (
              <Tag color="default">-</Tag>
            )}
          </DetailText>
          <DetailText label="Account Group">
            {renderValue(headerData.accountGroup)}
          </DetailText>
          <DetailText label="SOR">{renderValue(headerData.sor)}</DetailText>
          <DetailText label="Cost Center">
            {renderValue(headerData.accountCostCenter)}
          </DetailText>
          <DetailText label="Meter Reading Code">
            {renderValue(headerData.meterReadingCode)}
          </DetailText>
          <DetailText label="Account Segment">
            {renderValue(headerData.accountSegment)}
          </DetailText>
          <DetailText label="Account Group Type">
            {renderValue(headerData.accountGroupType)}
          </DetailText>
          <DetailText label="Account Type">
            {renderValue(headerData.accountType)}
          </DetailText>
          <DetailText label="Billing Bucket">
            {renderValue(headerData.billingBucket)}
          </DetailText>
        </div>
      </div>
    </CardContainer>
  );

  const renderServiceAgreementInfo = () => (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold">
            SERVICE AGREEMENT (SA) INFORMATION
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-4 gap-4">
        <DetailText label="SA Number">
          {renderValue(headerData.saNumber)}
        </DetailText>
        <DetailText label="SA Reference Number">
          {renderValue(headerData.saReferenceNumber)}
        </DetailText>
        <DetailText label="SA Date">
          {renderValue(headerData.saDate)}
        </DetailText>
        <DetailText label="Commitment Date">
          {renderValue(headerData.commitmentDate)}
        </DetailText>
        <DetailText label="M Pricing Code">
          {renderValue(headerData.mpricingCode)}
        </DetailText>
        <DetailText label="Invoice Template">
          {renderValue(headerData.invoiceTemplate)}
        </DetailText>
        <DetailText label="PJBG Type">
          {renderValue(headerData.pjbgType)}
        </DetailText>
        <DetailText label="SA Service Type">
          {renderValue(headerData.saServiceType)}
        </DetailText>
        <DetailText label="SA Type">
          {renderValue(headerData.saType)}
        </DetailText>
        <DetailText label="Term of Payment">
          {renderValue(headerData.termOfPayment)}
        </DetailText>
        <DetailText label="Pricing Rule">
          {renderValue(headerData.pricingRule)}
        </DetailText>
        <DetailText label="Full Price Code">
          {renderValue(headerData.fullPriceCode)}
        </DetailText>
        <DetailText label="IDR Full Price Code">
          {renderValue(headerData.idrFullPriceCode)}
        </DetailText>
        <DetailText label="USD Full Price Code">
          {renderValue(headerData.usdFullPriceCode)}
        </DetailText>
        <DetailText label="IDR UOM">
          {renderValue(headerData.idrUom)}
        </DetailText>
        <DetailText label="IDR Value">
          {headerData.idrValue ? (
            `IDR ${parseFloat(headerData.idrValue).toLocaleString()}`
          ) : (
            <Tag color="default">-</Tag>
          )}
        </DetailText>
        <DetailText label="USD UOM">
          {renderValue(headerData.usdUom)}
        </DetailText>
        <DetailText label="USD Value">
          {headerData.usdValue ? (
            `$ ${parseFloat(headerData.usdValue).toLocaleString()}`
          ) : (
            <Tag color="default">-</Tag>
          )}
        </DetailText>
        <DetailText label="Product Name">
          {renderValue(headerData.productName)}
        </DetailText>
        <DetailText label="Product Type">
          {renderValue(headerData.productType)}
        </DetailText>
        <DetailText label="IDR Late Charge">
          {renderValue(headerData.idrLateCharge)}
        </DetailText>
        <DetailText label="USD Late Charge">
          {renderValue(headerData.usdLateCharge)}
        </DetailText>
        <DetailText label="PPN Tax Implementation">
          {renderValue(headerData.ppnTaxImp)}
        </DetailText>
        <DetailText label="PPH Tax Implementation">
          {renderValue(headerData.pphTaxImp)}
        </DetailText>
      </div>
    </CardContainer>
  );

  const renderSADetailCalc = () => (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold">SA DETAIL & CALCULATION</p>
        </div>
      }
    >
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">
          SA Detail
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="Min Usage">
            {renderValue(headerData.minUsage)}
          </DetailText>
          <DetailText label="Maximum Usage">
            {renderValue(headerData.maxUsage)}
          </DetailText>
          <DetailText label="Time Unit">
            {renderValue(headerData.saDetTimeUnit)}
          </DetailText>
          <DetailText label="Unit of Measure">
            {renderValue(headerData.unitMeasure)}
          </DetailText>
          <DetailText label="Currency">
            {renderValue(headerData.saDetCurrency)}
          </DetailText>
          <DetailText label="Payment Type">
            {renderValue(headerData.paymentType)}
          </DetailText>
          <DetailText label="Charging Method">
            {renderValue(headerData.chargingMethod)}
          </DetailText>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-700 border-b pb-2">
          SA Calculation
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <DetailText label="OUP Type">
            {renderValue(headerData.oupType)}
          </DetailText>
          <DetailText label="OUP Value">
            {renderValue(headerData.oupValue)}
          </DetailText>
          <DetailText label="Calculation Rule">
            {renderValue(headerData.calculationRule)}
          </DetailText>
          <DetailText label="VAT Currency">
            {renderValue(headerData.vatCurrency)}
          </DetailText>
          <DetailText label="VAT">{renderValue(headerData.vat)}</DetailText>
          <DetailText label="Withholding Tax">
            {renderValue(headerData.withholdingTax)}
          </DetailText>
        </div>
      </div>
    </CardContainer>
  );

  const renderLateChargeInfo = () => (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold">LATE CHARGE INFORMATION</p>
        </div>
      }
    >
      <div className="grid grid-cols-4 gap-4">
        <DetailText label="LC Currency">
          {renderValue(headerData.currency)}
        </DetailText>
        <DetailText label="Total Amount">
          {headerData.totalAmount ? (
            parseFloat(headerData.totalAmount).toLocaleString()
          ) : (
            <Tag color="default">-</Tag>
          )}
        </DetailText>
        <DetailText label="Bill Status">
          {renderValue(headerData.billStatus)}
        </DetailText>
        <DetailText label="LC Bill Period">
          {renderValue(headerData.lcBillPeriod)}
        </DetailText>
        <DetailText label="Total Period Bill">
          {renderValue(headerData.totalPeriodBill)}
        </DetailText>
        <DetailText label="Billing Code">
          {renderValue(headerData.billingCode)}
        </DetailText>
        <DetailText label="Constant">
          {renderValue(headerData.constant)}
        </DetailText>
        <DetailText label="LC Time Unit">
          {renderValue(headerData.timeUnit)}
        </DetailText>
      </div>
    </CardContainer>
  );

  const usageColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "measDate",
        title: "MEAS DATE",
        dataIndex: "measDate",
        width: 120,
        align: "center",
        render: renderValue,
      },
      {
        key: "assetSerialNum",
        title: "ASSET SERIAL",
        dataIndex: "assetSerialNum",
        width: 130,
        align: "center",
        render: renderValue,
      },
      {
        key: "assetType",
        title: "ASSET TYPE",
        dataIndex: "assetType",
        width: 120,
        align: "center",
        render: renderValue,
      },
      {
        key: "stream",
        title: "STREAM",
        dataIndex: "stream",
        width: 100,
        align: "center",
        render: renderValue,
      },
      {
        key: "temperature",
        title: "TEMPERATURE",
        dataIndex: "temperature",
        width: 120,
        align: "right",
        render: renderValue,
      },
      {
        key: "pressure",
        title: "PRESSURE",
        dataIndex: "pressure",
        width: 120,
        align: "right",
        render: renderValue,
      },
      {
        key: "correctionFactor",
        title: "CORRECTION FACTOR",
        dataIndex: "correctionFactor",
        width: 150,
        align: "right",
        render: renderValue,
      },
      {
        key: "calorie",
        title: "CALORIE",
        dataIndex: "calorie",
        width: 120,
        align: "right",
        render: renderValue,
      },
      {
        key: "beginStand",
        title: "BEGIN STAND",
        dataIndex: "beginStand",
        width: 130,
        align: "right",
        render: renderValue,
      },
      {
        key: "endStand",
        title: "END STAND",
        dataIndex: "endStand",
        width: 130,
        align: "right",
        render: renderValue,
      },
      {
        key: "engMeasured",
        title: "ENG MEASURED",
        dataIndex: "engMeasured",
        width: 150,
        align: "right",
        render: (val) =>
          val ? (
            parseFloat(val).toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })
          ) : (
            <Tag color="default">-</Tag>
          ),
      },
      {
        key: "ghv",
        title: "GHV",
        dataIndex: "ghv",
        width: 120,
        align: "right",
        render: renderValue,
      },
      {
        key: "description",
        title: "DESCRIPTION",
        dataIndex: "description",
        width: 200,
        render: renderValue,
      },
      {
        key: "taxation",
        title: "TAXATION",
        dataIndex: "taxation",
        width: 100,
        align: "center",
        render: renderValue,
      },
      {
        key: "volMeasured27",
        title: "VOL MEASURED 27",
        dataIndex: "volMeasured27",
        width: 150,
        align: "right",
        render: (val) =>
          val ? (
            parseFloat(val).toLocaleString()
          ) : (
            <Tag color="default">-</Tag>
          ),
      },
      {
        key: "volMeasured60",
        title: "VOL MEASURED 60",
        dataIndex: "volMeasured60",
        width: 150,
        align: "right",
        render: (val) =>
          val ? (
            parseFloat(val).toLocaleString()
          ) : (
            <Tag color="default">-</Tag>
          ),
      },
      {
        key: "volMscf",
        title: "VOL MSCF",
        dataIndex: "volMscf",
        width: 150,
        align: "right",
        render: (val) =>
          val ? (
            parseFloat(val).toLocaleString()
          ) : (
            <Tag color="default">-</Tag>
          ),
      },
      {
        key: "costCenter",
        title: "COST CENTER",
        dataIndex: "costCenter",
        width: 150,
        align: "center",
        render: renderValue,
      },
      {
        key: "usageInitCode",
        title: "INIT CODE",
        dataIndex: "usageInitCode",
        width: 150,
        align: "center",
        render: renderValue,
      },
      {
        key: "energy",
        title: "ENERGY",
        dataIndex: "energy",
        width: 150,
        align: "right",
        render: (val) =>
          val ? (
            parseFloat(val).toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })
          ) : (
            <Tag color="default">-</Tag>
          ),
      },
      {
        key: "uncorrectedValue",
        title: "UNCORRECTED VALUE",
        dataIndex: "uncorrectedValue",
        width: 150,
        align: "right",
        render: renderValue,
      },
      {
        key: "ratingCode",
        title: "RATING CODE",
        dataIndex: "ratingCode",
        width: 120,
        align: "center",
        render: renderValue,
      },
    ],
    []
  );

  const taxColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "category",
        title: "CATEGORY",
        dataIndex: "category",
        width: 100,
        align: "center",
        render: renderValue,
      },
      {
        key: "taxImpName",
        title: "TAX IMP NAME",
        dataIndex: "taxImpName",
        width: 300,
        render: renderValue,
      },
      {
        key: "serviceType",
        title: "SERVICE TYPE",
        dataIndex: "serviceType",
        width: 120,
        align: "center",
        render: renderValue,
      },
      {
        key: "impType",
        title: "IMP TYPE",
        dataIndex: "impType",
        width: 120,
        align: "center",
        render: renderValue,
      },
      {
        key: "gunggung",
        title: "GUNGGUNG",
        dataIndex: "gunggung",
        width: 100,
        align: "center",
        render: renderValue,
      },
      {
        key: "ratingCode",
        title: "RATING CODE",
        dataIndex: "ratingCode",
        width: 150,
        render: renderValue,
      },
    ],
    []
  );

  const saPriceRuleColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "lineNumber",
        title: "LINE NUMBER",
        dataIndex: "lineNumber",
        width: 100,
        align: "center",
        render: renderValue,
      },
      {
        key: "min",
        title: "MIN",
        dataIndex: "min",
        width: 120,
        align: "right",
        render: (val) =>
          val ? (
            parseFloat(val).toLocaleString()
          ) : (
            <Tag color="default">-</Tag>
          ),
      },
      {
        key: "max",
        title: "MAX",
        dataIndex: "max",
        width: 120,
        align: "right",
        render: (val) => {
          if (!val) return <Tag color="default">-</Tag>;
          if (isNaN(val)) return val;
          if (val === "0" || parseFloat(val) === 0) return "Unlimited";
          return parseFloat(val).toLocaleString();
        },
      },
      {
        key: "priceCode",
        title: "PRICE CODE",
        dataIndex: "priceCode",
        width: 150,
        align: "center",
        render: renderValue,
      },
      {
        key: "priceCodeRule",
        title: "PRICE CODE RULE",
        dataIndex: "priceCodeRule",
        width: 200,
        render: renderValue,
      },
      {
        key: "value",
        title: "VALUE",
        dataIndex: "value",
        width: 150,
        align: "right",
        render: (val) =>
          val ? (
            parseFloat(val).toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })
          ) : (
            <Tag color="default">-</Tag>
          ),
      },
      {
        key: "uom",
        title: "UOM",
        dataIndex: "uom",
        width: 100,
        align: "center",
        render: renderValue,
      },
      {
        key: "priceCurrency",
        title: "CURRENCY",
        dataIndex: "priceCurrency",
        width: 100,
        align: "center",
        render: renderValue,
      },
    ],
    []
  );

  const saTosColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "saTosName",
        title: "SA TOS NAME",
        dataIndex: "saTosName",
        width: 200,
        render: renderValue,
      },
      {
        key: "attributeName",
        title: "ATTRIBUTE NAME",
        dataIndex: "attributeName",
        width: 200,
        render: renderValue,
      },
      {
        key: "value",
        title: "VALUE",
        dataIndex: "value",
        width: 200,
        render: renderValue,
      },
    ],
    []
  );

  const tosSubmissionColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "tosName",
        title: "TOS NAME",
        dataIndex: "tosName",
        width: 200,
        render: renderValue,
      },
      {
        key: "startDate",
        title: "START DATE",
        dataIndex: "startDate",
        width: 150,
        align: "center",
        render: renderValue,
      },
      {
        key: "endDate",
        title: "END DATE",
        dataIndex: "endDate",
        width: 150,
        align: "center",
        render: renderValue,
      },
      {
        key: "remark",
        title: "REMARK",
        dataIndex: "remark",
        width: 250,
        render: renderValue,
      },
    ],
    []
  );

  const tosSubColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "tosName",
        title: "TOS NAME",
        dataIndex: "tosName",
        width: 200,
        render: renderValue,
      },
      {
        key: "attributeName",
        title: "ATTRIBUTE NAME",
        dataIndex: "attributeName",
        width: 200,
        render: renderValue,
      },
      {
        key: "unit",
        title: "UNIT",
        dataIndex: "unit",
        width: 100,
        align: "center",
        render: renderValue,
      },
      {
        key: "value",
        title: "VALUE",
        dataIndex: "value",
        width: 150,
        render: renderValue,
      },
      {
        key: "fromItem",
        title: "FROM ITEM",
        dataIndex: "fromItem",
        width: 150,
        render: renderValue,
      },
    ],
    []
  );

  const processedUsageColumns = useMemo(
    () => applyFixedColumns(usageColumns, fixedColumnsUsage),
    [usageColumns, fixedColumnsUsage]
  );

  const processedTaxColumns = useMemo(
    () => applyFixedColumns(taxColumns, fixedColumnsTax),
    [taxColumns, fixedColumnsTax]
  );

  const processedPriceColumns = useMemo(
    () => applyFixedColumns(saPriceRuleColumns, fixedColumnsPrice),
    [saPriceRuleColumns, fixedColumnsPrice]
  );

  const processedSaTosColumns = useMemo(
    () => applyFixedColumns(saTosColumns, fixedColumnsSaTos),
    [saTosColumns, fixedColumnsSaTos]
  );

  const processedTosSubmissionColumns = useMemo(
    () => applyFixedColumns(tosSubmissionColumns, fixedColumnsTosSubmission),
    [tosSubmissionColumns, fixedColumnsTosSubmission]
  );

  const processedTosSubColumns = useMemo(
    () => applyFixedColumns(tosSubColumns, fixedColumnsTosSub),
    [tosSubColumns, fixedColumnsTosSub]
  );

  const usageColumnDefs = useMemo(
    () => usageColumns.map((col) => ({ key: col.key, title: col.title })),
    [usageColumns]
  );

  const taxColumnDefs = useMemo(
    () => taxColumns.map((col) => ({ key: col.key, title: col.title })),
    [taxColumns]
  );

  const priceColumnDefs = useMemo(
    () => saPriceRuleColumns.map((col) => ({ key: col.key, title: col.title })),
    [saPriceRuleColumns]
  );

  const saTosColumnDefs = useMemo(
    () => saTosColumns.map((col) => ({ key: col.key, title: col.title })),
    [saTosColumns]
  );

  const tosSubmissionColumnDefs = useMemo(
    () =>
      tosSubmissionColumns.map((col) => ({ key: col.key, title: col.title })),
    [tosSubmissionColumns]
  );

  const tosSubColumnDefs = useMemo(
    () => tosSubColumns.map((col) => ({ key: col.key, title: col.title })),
    [tosSubColumns]
  );

  return (
    <Spin spinning={loading_customer_detail}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        {renderInitCustomerAccount()}
        {renderServiceAgreementInfo()}
        {renderSADetailCalc()}
        {renderLateChargeInfo()}

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">DETAILED DATA</p>
            </div>
          }
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 4,
                zIndex: 1000,
                background: "white",
                paddingRight: "10px",
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <Button
                type="primary"
                icon={<LeftOutlined />}
                onClick={() => scrollTabs("left")}
                size="small"
                style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.15)" }}
              /> */}
            </div>
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 4,
                zIndex: 1000,
                background: "white",
                paddingLeft: "10px",
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={() => scrollTabs("right")}
                size="small"
                style={{ boxShadow: "-2px 0 8px rgba(0,0,0,0.15)" }}
              /> */}
            </div>
            <div style={{ paddingLeft: "45px", paddingRight: "45px" }}>
              <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                <TabPane
                  tab={
                    <span>
                      Usage ({usageData.length})
                    </span>
                  }
                  key="1"
                >
                  <TableRBI
                    columns={processedUsageColumns}
                    dataSource={usageData}
                    totalData={usageData.length}
                    current={1}
                    pageSize={usageData.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    tableScrolled={{ x: 3500, y: 500 }}
                    rowKey={(record, index) => `usage-${index}`}
                    columnDefinitions={usageColumnDefs}
                    fixedColumns={fixedColumnsUsage}
                    showExport={false}
                    setFixedColumns={setFixedColumnsUsage}
                    loading={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      Tax Implication ({taxData.length})
                    </span>
                  }
                  key="2"
                >
                  <TableRBI
                    columns={processedTaxColumns}
                    dataSource={taxData}
                    totalData={taxData.length}
                    current={1}
                    pageSize={taxData.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    tableScrolled={{ x: 1000, y: 500 }}
                    rowKey={(record, index) => `tax-${index}`}
                    columnDefinitions={taxColumnDefs}
                    fixedColumns={fixedColumnsTax}
                    showExport={false}
                    setFixedColumns={setFixedColumnsTax}
                    loading={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      SA Price Rule ({saPriceRuleData.length}
                      )
                    </span>
                  }
                  key="3"
                >
                  <TableRBI
                    columns={processedPriceColumns}
                    dataSource={saPriceRuleData}
                    totalData={saPriceRuleData.length}
                    current={1}
                    pageSize={saPriceRuleData.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    tableScrolled={{ x: 1200, y: 500 }}
                    rowKey={(record, index) => `saprice-${index}`}
                    columnDefinitions={priceColumnDefs}
                    fixedColumns={fixedColumnsPrice}
                    showExport={false}
                    setFixedColumns={setFixedColumnsPrice}
                    loading={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                       SA TOS Detail ({saTosDet.length})
                    </span>
                  }
                  key="4"
                >
                  <TableRBI
                    columns={processedSaTosColumns}
                    dataSource={saTosDet}
                    totalData={saTosDet.length}
                    current={1}
                    pageSize={saTosDet.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    tableScrolled={{ x: 800, y: 500 }}
                    rowKey={(record, index) => `satos-${index}`}
                    columnDefinitions={saTosColumnDefs}
                    fixedColumns={fixedColumnsSaTos}
                    showExport={false}
                    setFixedColumns={setFixedColumnsSaTos}
                    loading={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      SA Data ({saData.length})
                    </span>
                  }
                  key="5"
                >
                  <TableRBI
                    columns={processedTosSubmissionColumns}
                    dataSource={saData}
                    totalData={saData.length}
                    current={1}
                    pageSize={saData.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    tableScrolled={{ x: 900, y: 500 }}
                    rowKey={(record, index) => `sadata-${index}`}
                    columnDefinitions={tosSubmissionColumnDefs}
                    fixedColumns={fixedColumnsTosSubmission}
                    showExport={false}
                    setFixedColumns={setFixedColumnsTosSubmission}
                    loading={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      TOS Sub Detail ({tosSubDet.length})
                    </span>
                  }
                  key="6"
                >
                  <TableRBI
                    columns={processedTosSubColumns}
                    dataSource={tosSubDet}
                    totalData={tosSubDet.length}
                    current={1}
                    pageSize={tosSubDet.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    tableScrolled={{ x: 800, y: 500 }}
                    rowKey={(record, index) => `tossubdet-${index}`}
                    columnDefinitions={tosSubColumnDefs}
                    fixedColumns={fixedColumnsTosSub}
                    showExport={false}
                    setFixedColumns={setFixedColumnsTosSub}
                    loading={false}
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
        </CardContainer>

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