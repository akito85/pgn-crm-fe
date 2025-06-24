import React, { useEffect, useState } from "react";
import SectionInfoProductDetail from "./SectionInfoProductDetail";
import TablePriceAdjust from "./TablePriceAdjust";
import TablePriceAdjustDetail from "./TablePriceAdjustDetail";
import SelectComponent from "../../../../../../components/SelectComponent";
import { Select } from "antd";
import PricingDetailAdjustmentTable from "../../../Pricing/Detail/PricingDetailAdjustmentTable";
import { useDispatch, useSelector } from "react-redux";
import { getPricingAdjustment } from "../../../../../../redux/slices/product_promo/product";
import PricingAdjustTableDetail from "../../../PricingAdjustment/PricingAdjustTableDetail";
import { columnsTableCriteria } from "../../../PricingAdjustment/columnTableCriteriaPriceAdjust";
import moment from "moment";
import { current } from "@reduxjs/toolkit";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";
import { dateFormatting } from "../../../../../../utils";

const ContentModalPricingPDI = ({
  dataPricing = {},
  dataDetailProduct = {},
  dataDetailPriceCode = [],
  type = "form",
  typeLog = false,
}) => {
  const dispatch = useDispatch();
  const [dataListAdjustment, setDataListAdjustment] = useState([]);
  const [dataListDetail, setDataListDetail] = useState([]);
  const [selectedPriceDetail, setSelectedPriceDetail] = useState();
  const [selectedData, setSelectedData] = useState();
  const { dataPricingAdjustment = [] } = useSelector((state) => state.product);

  const handleSelectedDetail = (r) => {
    setSelectedData(r);
    setDataListDetail(
      (r?.mpricingAdjustmentDetails || []).map((adjustData, index) => {
        const listIndex = columnsTableCriteria().map((item) => item.dataIndex);
        let obj = {
          adjustmentType: {
            label: adjustData.adjustmentTypeName || "",
            value: adjustData.adjustmentType,
          },
          adjustmentValue: adjustData.adjustmentValue,
          description: adjustData.description || undefined,
          startDate: adjustData.startDate
            ? moment(adjustData.startDate, "DD-MM-YYYY")
            : undefined,
          endDate: adjustData.endDate
            ? moment(adjustData.endDate, "DD-MM-YYYY")
            : undefined,
          key: index + 1,
          typeData: "exist",
        };
        listIndex.forEach((item) => {
          obj[`${item.slice(0, -2)}Id`] = {
            label: adjustData[`${item.slice(0, -2)}Name`],
            value: adjustData[`${item.slice(0, -2)}`],
          };
        });
        return obj;
      })
    );
  };
  const handleSelectedPriceDetail = (e) => {
    setSelectedPriceDetail(e);
  };
  useEffect(() => {
    if (dataDetailPriceCode.length > 0) {
      setSelectedPriceDetail(dataDetailPriceCode[0].id);
    }
  }, [dataDetailPriceCode]);
  useEffect(() => {
    if (selectedPriceDetail) {
      dispatch(getPricingAdjustment({ id: selectedPriceDetail }));
    }
  }, [selectedPriceDetail]);

  useEffect(() => {
    if (dataPricingAdjustment?.length) {
      setDataListAdjustment(
        (dataPricingAdjustment || []).map((item) => {
          const data = {
            id: item.id,
            name: item.name,
            description: item.description,
            criteria: (item.rcriteriaPricingAdjustments || []).map(
              (item) => item.criteria
            ),
            criterias: (item.rcriteriaPricingAdjustments || [])
              .map((item) => item.criteriaName)
              .reduce(
                (current, next, index) =>
                  current + (index !== 0 ? `, ${next}` : next),
                ""
              ),
            mpricingAdjustmentDetails: item.mpricingAdjustmentDetails || [],
          };
          return data;
        })
      );
    } else {
      setDataListAdjustment([]);
    }
  }, [dataPricingAdjustment]);

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
      {type === "form" ? (
        <SectionInfoProductDetail dataDetailProduct={dataDetailProduct} />
      ) : null}
      <div className="grid grid-cols-4">
        <SelectComponent
          value={selectedPriceDetail}
          onChange={handleSelectedPriceDetail}
        >
          {dataDetailPriceCode.map((data, index) => (
            <Select.Option key={index} value={data.id}>
              {`${data.currency}/${handleDataValue(data)}/${data.uom}`}
            </Select.Option>
          ))}
        </SelectComponent>
      </div>
      <PricingDetailAdjustmentTable
        data={dataListAdjustment}
        type="product"
        handleDetail={handleSelectedDetail}
      />
      {selectedData ? (
        <div className="flex flex-col gap-4 w-full">
          <div className="text-primary font-semibold uppercase">
            {"PRICE ADJUSTMENT DETAIL"}
          </div>
          <div className="flex align-middle gap-2">
            <p className="text-[15px] font-semibold text-text-color-semibold">
              Name:
            </p>
            <p className="text-[15px] font-semibold text-primary">
              {selectedData.name || "-"}
            </p>
          </div>
          <PricingAdjustTableDetail
            type={"detail"}
            data={dataListDetail}
            dataCriteria={selectedData.criteria || []}
            updateData={setDataListDetail}
            forType="product"
          />
        </div>
      ) : null}
      
      {typeLog ? (
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataPricing?.id}</DetailText>
          <DetailText label="Created Date">
            {dataPricing?.createdDate
              ? moment(dataPricing.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataPricing?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataPricing?.updatedDate
              ? moment(dataPricing.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataPricing?.updatedBy}</DetailText>
        </CardComponent>
      ) : null}
    </div>
  );
};

export default ContentModalPricingPDI;
