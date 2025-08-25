import React, { Fragment, useState } from "react";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaPromo } from "../Table/TableCriteriaPromo";
import ConditionPromo from "../Form/ConditionsPromo";
import RadioTabs from "../../../../../components/RadioTabs";

const PromoDiscountConfirmPromoSection = ({
  dataConfirm,
  listDataCriteria = [],
  criteriaValues,
  listDataCondition = [],
	listCriteria = [],
}) => {
  const [valuePage, setValuePage] = useState("Criteria");
  const [tabPagesDetail, setTabPagesDetail] = useState([
    { value: "Criteria" },
    { value: "Conditions" },
  ]);

  const renderSection = () => {
    switch (valuePage) {
      case "Criteria":
        return (
          <FunctionalCriteriaProduct
            type={"preview"}
            data={listDataCriteria || []} //data
            dataCriteria={criteriaValues || []} //ddl
            columnsTable={columnsTableCriteriaPromo}
            fixedColumn={[
              "ADJUSTMENT TYPE",
              "ADJUSTMENT VALUE",
              "UOM",
              "DESCRIPTION",
              "MAX VALUE UOM",
              "FROM ITEM",
              "TIERING",
            ]}
          />
        );
      case "Conditions":
        return (
          <ConditionPromo type={"preview"} data={listDataCondition || []} />
        );
      default:
        return <></>;
    }
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"PROMO INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Name">{dataConfirm?.name || ""}</DetailText>
        <DetailText label="Category">
          {dataConfirm?.categoryName || ""}
        </DetailText>
        <DetailText label="Promo Type">{dataConfirm?.typeName}</DetailText>
      </div>
      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Start Date">
          {moment(dataConfirm?.startDate).format(dateFormatting.date)}
        </DetailText>
        <DetailText label="End Date">
          {dataConfirm?.endDate
            ? moment(dataConfirm?.endDate).format(dateFormatting.date)
            : ""}
        </DetailText>
      </div>
      <div className="col-span-4">
        <DetailText label="Criteria">{listCriteria || ""}</DetailText>
      </div>
      <div className="col-span-4">
        <DetailText label="Description">
          {dataConfirm?.description || ""}
        </DetailText>
      </div>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"PROMO DETAIL INFORMATION"}
      </div>
      <div className="mt-5">
        <RadioTabs
          data={tabPagesDetail}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />
      </div>
      <div className={"w-full"}>{renderSection()}</div>
    </Fragment>
  );
};

export default PromoDiscountConfirmPromoSection;
