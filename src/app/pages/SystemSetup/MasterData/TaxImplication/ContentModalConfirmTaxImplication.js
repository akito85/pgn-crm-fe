import React from "react";
import { useSelector } from "react-redux";
import DetailText from "../../../../../components/DetailText";
import TaxImplicationTableCriteria from "./TaxImplicationTableCriteria";

const ContentModalConfirmTaxImplication = ({
  data = {},
  listDataCriteria = [],
  criteriaValues = [],
  listCriteria = [],
}) => {
  const { categoryList = [], serviceTypeList = [] } = useSelector(
    (state) => state.tax_implication,
  );
  const criteria = listCriteria.reduce(
    (current, next) => current + `, ${next}`,
    "",
  );

  const category = (categoryList || []).filter(
    (item) => item.value === data.category,
  )?.[0]?.label;

  const serviceType = (serviceTypeList || []).filter(
    (item) => item.value === data.serviceType,
  )?.[0]?.label;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-primary text-xs font-bold uppercase">
        {`TAX IMPLICATION INFORMATION`}
      </div>
      <div className="grid grid-cols-3 w-full">
        <DetailText label={"Tax Implication Name"}>
          {data.taxImplicationName}
        </DetailText>
        <DetailText label={"Category"}>{category}</DetailText>
        <DetailText label={"Service Type"}>{serviceType}</DetailText>
        <div className="col-span-3">
          <DetailText label={"Criteria"}>
            {criteria ? criteria.slice(1) : ""}
          </DetailText>
        </div>
        <div className="col-span-3">
          <DetailText label={"Description"}>{data.description}</DetailText>
        </div>
      </div>
      <div className="text-primary text-xs font-bold uppercase">
        {"tax implication criteria"}
      </div>
      <TaxImplicationTableCriteria
        type={"preview"}
        data={listDataCriteria}
        dataCriteria={criteriaValues}
      />
    </div>
  );
};

export default ContentModalConfirmTaxImplication;
