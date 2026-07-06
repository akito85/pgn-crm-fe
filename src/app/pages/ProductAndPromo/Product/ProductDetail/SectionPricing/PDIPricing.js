import React, { useEffect } from "react";
import DetailText from "../../../../../../components/DetailText";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import { useState } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ContentModalPricingRulePDI from "./ContentModalPricingRulePDI";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ContentModalPricingPDI from "./ContentModalPricingPDI";
import {
  getPricingDetailList,
  getPricingRuleDetail,
} from "../../../../../../redux/slices/product_promo/product";
import { useDispatch, useSelector } from "react-redux";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";

const PDIPricing = ({ dataPricing = {}, dataDetailProduct = {} }) => {
  const dispatch = useDispatch();
  const { dataPricingRuleDetail = {}, dataListPricingDetail = [] } =
    useSelector((state) => state.product);
  const [modalPricing, setModalPricing] = useState(false);
  const [modalPricingRule, setModalPricingRule] = useState(false);
  const [dataDetailPricingRule, setDataDetailPricingRule] = useState([]);

  useEffect(() => {
    if (dataPricing?.id) {
      if (dataPricing?.pricingRuleId) {
        dispatch(getPricingRuleDetail({ id: dataPricing.pricingRuleId }));
      }
      dispatch(getPricingDetailList({ id: dataPricing.priceCodeId }));
    }
  }, [dispatch, dataPricing]);
  useEffect(() => {
    if (
      dataPricing?.pricingRuleId &&
      dataPricingRuleDetail &&
      dataPricingRuleDetail.pricingRuleId
    ) {
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
  }, [dataPricingRuleDetail, dataPricing]);
  const handleCloseModalPricing = () => {
    setModalPricing(false);
  };
  const handleCloseModalPricingRule = () => {
    setModalPricingRule(false);
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
    <NxBaseContainer border>

      <div className="grid grid-cols-10 align-middle">
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-4">
            <DetailText label={"Price Code"}>
              {dataPricing.priceCode}
            </DetailText>
            <DetailText
              label={"Price Detail"}
              classTextAdditional={"flex flex-col gap-2"}
            >
              {dataListPricingDetail.length > 0
                ? dataListPricingDetail.map((item, index) => (
                    <p className="text-xs m-0" key={index}>
                      {`${item.currency}/${handleDataValue(item)}/${item.uom}`}
                    </p>
                  ))
                : ""}
            </DetailText>
            <DetailText label={"Description"}>
              {dataPricing.pricingDescription}
            </DetailText>
          </div>
        </div>
        <div className="flex justify-end">
          <Tooltip title="Detail Pricing">
            <SVGIcon
              name="IconDetail"
              width={24}
              onClick={() => setModalPricing(true)}
            />
          </Tooltip>
        </div>
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-4">
            <DetailText label={"Pricing Rule"}>
              {dataPricing.pricingRuleName}
            </DetailText>
            <DetailText label={"Description"}>
              {dataPricing.pricingRuleDescription}
            </DetailText>
          </div>
        </div>
        <div className="flex justify-end">
          <Tooltip title="Detail Pricing Rule">
            <SVGIcon
              name="IconDetail"
              width={24}
              onClick={() => setModalPricingRule(true)}
            />
          </Tooltip>
        </div>
      </div>
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
          dataPricing = {dataPricing}
          dataDetailProduct={dataDetailProduct}
          dataDetailPriceCode={dataListPricingDetail}
          typeLog={true}
        />
      </ModalCustom>
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
          dataPricing = {dataPricing}
          dataDetailProduct={dataDetailProduct}
          data={dataDetailPricingRule}
          typeLog={true}
        />
      </ModalCustom>
    </NxBaseContainer>
    // <div className="flex flex-col w-full gap-4">
    // </div>
  );
};

export default PDIPricing;
