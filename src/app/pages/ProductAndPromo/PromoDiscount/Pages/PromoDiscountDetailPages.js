import React, { Fragment, useState } from "react";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import RadioTabs from "../../../../../components/RadioTabs";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaPromo } from "../Table/TableCriteriaPromo";
import ConditionPromo from "../Form/ConditionsPromo";

const PromoDiscountDetailPages = ({ dataPromo }) => {
  const [valuePage, setValuePage] = useState("Criteria");

  const [tabDetailPromo, setTabDetailPromo] = useState([
    { value: "Criteria" },
    { value: "Condition" },
  ]);

  const handleStatusCase = (index) => {
    let text;
    switch (index) {
      case "WAITING APPROVAL":
      case "WAITING_APPROVAL":
        text = "Waiting Approval";
        break;
      default:
        text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        break;
    }
    return text;
  };
  // console.log(dataPromo, "promo detail");
  return (
    <Fragment>
      <BaseContainer header={"PROMO DISCOUNT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Name">{dataPromo?.name || ""}</DetailText>
          <DetailText label="Category">{dataPromo?.categoryName}</DetailText>
          <DetailText label="Promo Type">{dataPromo?.typeName}</DetailText>
          <DetailText label="Promotion Type">{dataPromo?.promotionTypeName}</DetailText>
          <DetailText label="Start Date">
            {dataPromo?.startDate
              ? moment(dataPromo?.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="End Date">
            {dataPromo.endDate
              ? moment(dataPromo?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">
            {dataPromo.status
              ? `${dataPromo?.status.charAt(0).toUpperCase()}${dataPromo?.status
                  .slice(1)
                  .toLowerCase()}`
              : ""}
          </DetailText>
          <DetailText label="Status Approval">
            {handleStatusCase(dataPromo.statusApproval)}
          </DetailText>
          <div className="col-span-4">
            <DetailText label="Criteria">
              {dataPromo?.criteria || ""}
            </DetailText>
          </div>
          <div className="col-span-4">
            <DetailText label="Description">
              {dataPromo?.description || ""}
            </DetailText>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer
        header={"Criteria Information"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabDetailPromo}
            onChange={(e) => setValuePage(e.target.value)}
            currentPosition={valuePage}
          />
        }
      >
        {valuePage === "Criteria" ? (
          <FunctionalCriteriaProduct
            data={dataPromo?.dataCriteria} //data
            dataCriteria={dataPromo?.criteriaValues} //ddl
            type={"detail"}
            selector="promo"
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
        ) : (
          <ConditionPromo
            type={"detail"}
            data={dataPromo?.dataCondition}
            setStoredData={() => {}}
            storedData={false}
          />
        )}
      </BaseContainer>

      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{dataPromo?.id}</DetailText>
          <DetailText label="Created Date">
            {dataPromo?.createdDate
              ? moment(dataPromo?.createDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataPromo?.createdBy}</DetailText>
          <DetailText label="Update Date">
            {dataPromo?.updatedDate
              ? moment(dataPromo?.updateDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataPromo?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default PromoDiscountDetailPages;
