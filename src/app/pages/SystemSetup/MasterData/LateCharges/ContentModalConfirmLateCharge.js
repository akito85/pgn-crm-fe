import React from "react";
import { useSelector } from "react-redux";
import DetailText from "../../../../../components/DetailText";
import LateChargeTableCriteria from "./LateChargeTableCriteria";

const ContentModalConfirmLateCharge = ({
  data = {},
  listDataCriteria = [],
  criteriaValues = [],
  listCriteria = [],
}) => {
  const { dataListCurrency = [] } = useSelector((state) => state.late_charge);
  const criteria = listCriteria.reduce(
    (current, next) => current + `, ${next}`,
    "",
  );

  const currency = (dataListCurrency || []).filter(
    (item) => item.value === data.currency,
  )?.[0]?.label;
  return (
    <div className="flex flex-col gap-4">
      <div className="text-primary text-xs font-bold uppercase">
        {`late charge information`}
      </div>
      <div className="grid grid-cols-3 w-full">
        <DetailText label={"Name"}>{data.lateChargeName}</DetailText>
        <DetailText label={"Currency"}>{currency}</DetailText>
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
        {"late charge criteria"}
      </div>
      <LateChargeTableCriteria
        type={"preview"}
        data={listDataCriteria}
        dataCriteria={criteriaValues}
      />
    </div>
  );
};

export default ContentModalConfirmLateCharge;
