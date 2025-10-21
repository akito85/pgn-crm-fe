import React, { Fragment, useEffect, useState } from "react";
import RadioTabs from "../../../../../components/RadioTabs";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import ApprovalSectionForm from "../../Pricing/Form/ApprovalSectionForm";
import PDIProductDetailForm from "./ProductDetail/PDIProductDetailForm";
import {
  getListCalculationType,
  getListChargingMethod,
  getListPaymentType,
  getPricingRuleDetail,
  getSelectCriteria,
} from "../../../../../redux/slices/product_promo/product";
import { useDispatch, useSelector } from "react-redux";
import PDICalculationRuleForm from "./CalculationRule/PDICalculationRuleForm";
import ContentModalPricingPDI from "../ProductDetail/SectionPricing/ContentModalPricingPDI";
import ContentModalPricingRulePDI from "../ProductDetail/SectionPricing/ContentModalPricingRulePDI";
import AttachmentSectionForm from "../../Pricing/Form/AttachmentSectionForm";
import PDITargetAccountSellingForm from "./TargetAccountSelling/PDITargetAccountSellingForm";
import PDIProductBundlingForm from "./ProductBundling/PDIProductBundlingForm";
import PDIEligibilityProductForm from "./EligibilityProduct/PDIEligibilityProductForm";
import PDITosForm from "./TermOfService/PDITosForm";

const ContentModalConfirmation = ({
  productObj = {},
  priceCodeObj = {},
  pricingRuleObj = {},
  productInfoObj = {},
  listSectionInfo = [],
  listSectionProductDetail = [],
  dataTablePDIProductDetail = [],
  dataTablePDICalculationRule = [],
  dataTablePDITargetAccountSelling = [],
  dataTablePDITermOfService = [],
  dataTablePDIProductBundling = [],
  dataTablePDIEligibilityProduct = [],
  selectedHierarchy = "",
  listDataAppHierDetail = [],
  listDataAttachment = [],
  dataOption = [],
}) => {
  const dispatch = useDispatch();
  const {
    dataListSelectCriteria = [],
    dataListPaymentType = [],
    dataListChargeMethod = [],
    dataListCalculationType = [],
    dataPricingRuleDetail = {},
  } = useSelector((state) => state.product);
  const [dataDetailPricingRule, setDataDetailPricingRule] = useState([]);
  useEffect(() => {
    dispatch(getListPaymentType());
    dispatch(getListChargingMethod());
    dispatch(getListCalculationType());
    dispatch(getSelectCriteria());
  }, [dispatch]);
  useEffect(() => {
    if (pricingRuleObj?.pricingRuleId) {
      dispatch(getPricingRuleDetail({ id: pricingRuleObj.pricingRuleId }));
    }
  }, [pricingRuleObj]);
  useEffect(() => {
    if (dataPricingRuleDetail?.pricingRuleId) {
      // Data Detail Pricing Rule
      const dataDetailPricingRule = (
        dataPricingRuleDetail?.mpricingRuleDetails || []
      ).map((item) => {
        return {
          pricingRuleDetailId: item.pricingRuleDetailId,
          lineNumber: item.lineNumber,
          priceCode: item.priceCodeId,
          priceCodeName: item.priceCode,
          min: item.min,
          max: item.max,
          maximumName: item.unlimited === true ? "Unlimited" : item.max,
          description: item.description,
          unlimited: item.unlimited,
          value: item.value,
          uom: item.uom,
          currency: item.currency,
          type: "exist",
        };
      });
      setDataDetailPricingRule(dataDetailPricingRule);
    }
  }, [dataPricingRuleDetail]);
  const [typeProductInfo, setTypeProductInfo] = useState(
    listSectionInfo[0].value,
  );
  const [typeProductDetail, setTypeProductDetail] = useState(
    listSectionProductDetail[0].value,
  );
  const handleProductInfo = (e) => {
    setTypeProductInfo(e.target.value);
  };
  const handleProductDetailInfo = (e) => {
    setTypeProductDetail(e.target.value);
  };

  const showSection = () => {
    switch (typeProductInfo) {
      case listSectionInfo[0].value:
        return (
          <div>
            <div className="grid grid-cols-4 w-full">
              <DetailText label={"Product Name"}>
                {productInfoObj.productName}
              </DetailText>
              <DetailText label={"Product Type"}>
                {productInfoObj.productType}
              </DetailText>
              <DetailText label={"Product Class"}>
                {productInfoObj.productClass}
              </DetailText>
              <DetailText label={"Service Type"}>
                {productInfoObj.serviceType}
              </DetailText>
              <DetailText label={"Start Date"}>
                {productInfoObj.startDate
                  ? moment(productInfoObj.startDate).format("DD MMM YYYY")
                  : ""}
              </DetailText>
              <DetailText label={"End Date"}>
                {productInfoObj.endDate
                  ? moment(productInfoObj.endDate).format("DD MMM YYYY")
                  : ""}
              </DetailText>
            </div>
            <div className="w-full">
              <DetailText label={"Description"}>
                {productInfoObj.productDescription}
              </DetailText>
            </div>
          </div>
        );
      case listSectionInfo[1].value:
        return (
          <ApprovalSectionForm
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (data) => data.value === selectedHierarchy,
              )?.[0].name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy={selectedHierarchy}
          />
        );
      case listSectionInfo[2].value:
        return (
          <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  const showSectionDetail = () => {
    switch (typeProductDetail) {
      case "Product Detail":
        const labelPaymentType = (dataListPaymentType || []).filter(
          (item) => item.value === productObj.paymentType,
        );
        const labelChargingMethod = (dataListChargeMethod || []).filter(
          (item) => item.value === productObj.chargingMethod,
        );
        const tempDataProduct = [
          {
            name: {
              label: "Payment Type",
              value: 210,
            },
            value: undefined,
            unit: {
              value: productObj.paymentType,
              label:
                labelPaymentType.length > 0 ? labelPaymentType[0].label : "",
            },
            description: undefined,
          },
          {
            name: {
              label: "Charging Method",
              value: 214,
            },
            value: undefined,
            unit: {
              value: productObj.chargingMethod,
              label:
                labelChargingMethod.length > 0
                  ? labelChargingMethod[0].label
                  : "",
            },
            description: undefined,
          },
          ...dataTablePDIProductDetail,
        ];
        return (
          <PDIProductDetailForm type={"preview"} dataTable={tempDataProduct} />
        );
      case "Calculation Rule":
        const labelCalculationType = (dataListCalculationType || []).filter(
          (item) => item.value === productObj.calculationType,
        );
        const tempDataCalculation = [
          {
            name: {
              label: "Calculation Type",
              value: 687,
            },
            value: undefined,
            unit: {
              value: productObj.calculationType,
              label:
                labelCalculationType.length > 0
                  ? labelCalculationType[0].label
                  : "",
            },
            description: undefined,
          },
          ...dataTablePDICalculationRule,
        ];
        return (
          <PDICalculationRuleForm
            type={"preview"}
            dataTable={tempDataCalculation}
          />
        );
      case "Target Account Selling":
        const valueCriteria = () => {
          const listSelectCriteria = productObj.tasCriteria || [];
          return dataListSelectCriteria
            .filter((item) => listSelectCriteria.includes(item.value))
            .reduce(
              (prev, current, index) =>
                prev + (index !== 0 ? ", " : "") + current.label,
              "",
            );
        };
        return (
          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-4">
              <DetailText label={"Name"}>{productObj.tasName}</DetailText>
              <div className="col-span-3">
                <DetailText label={"Criteria"}>{valueCriteria()}</DetailText>
              </div>
            </div>
            <div className="w-full">
              <DetailText label={"Description"}>
                {productObj.tasDescription}
              </DetailText>
            </div>
            <PDITargetAccountSellingForm
              data={dataTablePDITargetAccountSelling}
              productObj={productObj}
              type="preview"
            />
          </div>
        );
      case "Pricing":
        const priceCodeDescription = priceCodeObj.priceDescription || "";
        const priceCodeDetails = priceCodeObj.mpricingDetails || [];
        return (
          <div className="flex flex-col gap-4 w-full">
            <div className="text-primary text-xs font-bold uppercase">
              {`PRICE CODE`}
            </div>
            <div className="grid grid-cols-4">
              <DetailText label={"Price Code"}>
                {priceCodeObj.priceCode}
              </DetailText>
              <DetailText
                label={"Price Detail"}
                classTextAdditional={"flex flex-col gap-2"}
              >
                {priceCodeDetails.length > 0
                  ? priceCodeDetails.map((item, index) => (
                      <p className="text-xs m-0" key={item.id}>
                        {`${item.currency}/${item.value}/${item.uom}`}
                      </p>
                    ))
                  : ""}
              </DetailText>
              <DetailText label={"Description"}>
                {priceCodeDescription}
              </DetailText>
            </div>
            <ContentModalPricingPDI
              type={"preview"}
              dataDetailPriceCode={priceCodeDetails}
            />
            <div className="text-primary text-xs font-bold uppercase">
              {`PRICING RULE`}
            </div>
            <div className="grid grid-cols-4">
              <DetailText label={"Pricing Rule"}>
                {pricingRuleObj.name}
              </DetailText>
              <DetailText label={"Description"}>
                {pricingRuleObj.description}
              </DetailText>
            </div>
            <ContentModalPricingRulePDI
              type="preview"
              data={dataDetailPricingRule}
            />
          </div>
        );
      case "Term Of Service":
        return (
          <PDITosForm
            dispatch={dispatch}
            productObj={productObj}
            type={"preview"}
            data={dataTablePDITermOfService}
            dataArrayFilter={[]}
          />
        );
      case "Product Bundling":
        return (
          <PDIProductBundlingForm
            type={"preview"}
            data={dataTablePDIProductBundling}
            productObj={productObj}
          />
        );
      case "Eligibility Product":
        return (
          <PDIEligibilityProductForm
            type={"preview"}
            data={dataTablePDIEligibilityProduct}
            productObj={productObj}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={listSectionInfo}
        onChange={handleProductInfo}
        currentPosition={typeProductInfo}
      />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${typeProductInfo} INFORMATION`}
        </div>
        {showSection()}
      </div>
      {typeProductInfo === listSectionInfo[0].value ? (
        <div className="flex flex-col gap-4">
          <div className="text-primary text-xs font-bold uppercase">
            {"PRODUCT DETAIL INFORMATION"}
          </div>

          <RadioTabs
            data={listSectionProductDetail}
            onChange={handleProductDetailInfo}
            currentPosition={typeProductDetail}
          />
          {showSectionDetail()}
        </div>
      ) : null}
    </div>
  );
};

export default ContentModalConfirmation;
