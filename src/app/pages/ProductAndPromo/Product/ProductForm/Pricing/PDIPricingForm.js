import { Form, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import SelectComponent from "../../../../../../components/SelectComponent";
import DetailText from "../../../../../../components/DetailText";
import { useSelector } from "react-redux";
import {
  getPriceCodeList,
  getPricingRuleList,
} from "../../../../../../redux/slices/product_promo/product";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ContentModalPricingRulePDI from "../../ProductDetail/SectionPricing/ContentModalPricingRulePDI";
import ContentModalPricingPDI from "../../ProductDetail/SectionPricing/ContentModalPricingPDI";
import { requiredMessage } from "../../../../../../utils";

const PDIPricingForm = ({
  dataArrayFilter = [],
  productObj = {},
  priceCodeObj = {},
  pricingRuleObj = {},
  dispatch = () => {},
  handleProductObj = (e, type) => {
    return e;
  },
}) => {
  const { dataPricingRuleDetail } = useSelector((state) => state.product);
  const [dataDetailPricingRule, setDataDetailPricingRule] = useState([]);
  const [modalPricing, setModalPricing] = useState(false);
  const [modalPricingRule, setModalPricingRule] = useState(false);
  const {
    dataListPricingRule = [],
    dataListPriceCode = [],
    dataListProductType = [],
    dataListProductClass = [],
    dataListServiceType = [],
  } = useSelector((state) => state.product);
  const priceCodeDescription = priceCodeObj.priceDescription || "";
  const priceCodeDetails = priceCodeObj.mpricingDetails || [];
  const tempProductType = (dataListProductType || []).filter(
    (item) => item.value === (productObj.productType || 0)
  );
  const tempProductClass = (dataListProductClass || []).filter(
    (item) => item.value === (productObj.productClass || 0)
  );
  const tempServiceType = (dataListServiceType || []).filter(
    (item) => item.value === (productObj.serviceType || 0)
  );
  const dataDetailProduct = {
    productName: productObj.productName,
    productType: tempProductType.length > 0 ? tempProductType[0].label : "",
    productClass: tempProductClass.length > 0 ? tempProductClass[0].label : "",
    serviceType: tempServiceType.length > 0 ? tempServiceType[0].label : "",
    startDate: productObj.startDate || "",
    endDate: productObj.endDate || "",
    productDescription: productObj.productDescription || "",
  };

  useEffect(() => {
    dispatch(getPricingRuleList(dataArrayFilter));
    dispatch(getPriceCodeList(dataArrayFilter));
  }, [dispatch, dataArrayFilter]);

  useEffect(() => {
    if (dataPricingRuleDetail && dataPricingRuleDetail.pricingRuleId) {
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
  const handleCloseModalPricing = () => {
    setModalPricing(false);
  };
  const handleCloseModalPricingRule = () => {
    setModalPricingRule(false);
  };
  const handlePriceCode = (e) => {
    return handleProductObj(e, "pricingPriceCode");
  };
  const handlePricingRule = (e) => {
    return handleProductObj(e, "pricingPricingRule");
  };

  const handleDataValue = (obj) => {
    const currency = obj.currency === "USD" ? 243 : 244;
    const tempValue = obj.value ? (obj.value + "").split(".") : [];
    const thousandSeparator = currency === 244 ? "." : ",";
    const decimalSeparator = currency === 244 ? "," : ".";
    const descimal = tempValue[1]
      ? `${decimalSeparator}${tempValue[1]}`
      : `${decimalSeparator}00`;
    const format =
      tempValue.length > 0
        ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
          descimal
        : "";
    return format;
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-10 align-middle gap-4">
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name={"pricingPriceCode"}
              rules={[
                { message: requiredMessage("Price Code"), required: true },
              ]}
              className="no-margin-form w-full"
              getValueFromEvent={handlePriceCode}
              label={"Price Code"}
              required
            >
              <SelectComponent>
                {(dataListPriceCode || []).map((data, index) => (
                  <Select.Option key={index} value={data.id}>
                    {data.priceCode}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <DetailText
              label={"Price Detail"}
              classTextAdditional={"flex flex-col gap-2"}
            >
              {priceCodeDetails.length > 0
                ? priceCodeDetails.map((item, index) => (
                    <p className="text-xs m-0" key={index}>
                      {`${item.currency}/${handleDataValue(item)}/${item.uom}`}
                    </p>
                  ))
                : ""}
            </DetailText>
            <DetailText label={"Description"}>
              {priceCodeDescription}
            </DetailText>
          </div>
        </div>
        <div className="flex justify-end">
          <Tooltip title="Detail Pricing">
            <SVGIcon
              name="IconDetail"
              width={24}
              onClick={
                priceCodeObj && priceCodeObj.id
                  ? () => setModalPricing(true)
                  : undefined
              }
            />
          </Tooltip>
        </div>
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name={"pricingPricingRule"}
              className="no-margin-form w-full"
              getValueFromEvent={handlePricingRule}
              label={"Pricing Rule"}
            >
              <SelectComponent>
                {(dataListPricingRule || []).map((data, index) => (
                  <Select.Option key={index} value={data.pricingRuleId}>
                    {data.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <DetailText label={"Description"}>
              {pricingRuleObj.description || null}
            </DetailText>
          </div>
        </div>
        <div className="flex justify-end">
          <Tooltip title="Detail Pricing Rule">
            <SVGIcon
              name="IconDetail"
              width={24}
              onClick={
                pricingRuleObj && pricingRuleObj.pricingRuleId
                  ? () => setModalPricingRule(true)
                  : undefined
              }
            />
          </Tooltip>
        </div>
      </div>
      {/* Modal Price Adjustment */}
      {modalPricing ? (
        <ModalCustom
          isOpen={modalPricing}
          handleCancel={handleCloseModalPricing}
          header={"PRICING VIEW DETAIL"}
          width={1000}
          type={"detail"}
          footer={
            <div className="w-full flex justify-end p-4">
              <ButtonComponent onClick={handleCloseModalPricing} type="default">
                Back
              </ButtonComponent>
            </div>
          }
        >
          <ContentModalPricingPDI
            dataDetailProduct={dataDetailProduct}
            dataDetailPriceCode={priceCodeDetails}
          />
        </ModalCustom>
      ) : null}
      {/* Modal Pricing Rule */}
      <ModalCustom
        isOpen={modalPricingRule}
        handleCancel={handleCloseModalPricingRule}
        header={"PRICING RULE VIEW DETAIL"}
        width={1000}
        type={"detail"}
        footer={
          <div className="w-full flex justify-end p-4">
            <ButtonComponent
              onClick={handleCloseModalPricingRule}
              type="default"
            >
              Back
            </ButtonComponent>
          </div>
        }
      >
        <ContentModalPricingRulePDI
          dataDetailProduct={dataDetailProduct}
          data={dataDetailPricingRule}
        />
      </ModalCustom>
    </div>
  );
};

export default PDIPricingForm;
