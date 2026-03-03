import React, { useState } from "react";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaPromo } from "../Table/TableCriteriaPromo";
import ConditionPromo from "../Form/ConditionsPromo";
import RadioTabs from "../../../../../components/RadioTabs";
import NxDetailText from "../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../components/Nx/NxDatePicker";

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
            selector="promo"
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
    <>
      <NxBaseContainer border header="Promo Information">
        <div className="w-full grid grid-cols-3 gap-4">
          <NxDetailText label="Name">{dataConfirm?.name || ""}</NxDetailText>
          <NxDetailText label="Category">
            {dataConfirm?.categoryName || ""}
          </NxDetailText>
          <NxDetailText label="Type">{dataConfirm?.typeName}</NxDetailText>
          <NxDetailText label="Promotion Type">{dataConfirm?.promotionTypeName}</NxDetailText>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          <NxDetailText label="Start Date">
            {NxDate.formatDate(dataConfirm?.startDate, "DD MMM YYYY")}
          </NxDetailText>
          <NxDetailText label="End Date">
            {NxDate.formatDate(dataConfirm?.endDate, "DD MMM YYYY")}
          </NxDetailText>
        </div>
        <NxDetailText label="Criteria">{listCriteria || ""}</NxDetailText>
        <NxDetailText label="Description">
          {dataConfirm?.description || ""}
        </NxDetailText>
      </NxBaseContainer>
      <NxBaseContainer
        header="Promo Detail"
        border
      >
        <RadioTabs
          data={tabPagesDetail}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />
        <div className={"w-full"}>{renderSection()}</div>
      </NxBaseContainer>
    </>
  );
};

export default PromoDiscountConfirmPromoSection;
