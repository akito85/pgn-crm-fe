import React, { useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import RadioTabs from "../../../../../components/RadioTabs";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import moment from "moment";
import Detail from "../Form/Detail";
import { lowerCaseStatus } from "../../Product/utils";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";

const PricingRule = ({
  dataText = {},
  dataLog = {},
  setData = () => {},
  data = [],
  listDataCriteria = [],
  criteriaValues = [],
  countryCriteriaId,
}) => {
  // State
  const [valuePage, setValuePage] = useState("Detail");

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const tabPagesEmployee = [{ value: "Detail" }, { value: "Criteria" }];

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Detail":
        return <Detail setData={setData} data={data} type={"detail"} />;
      case "Criteria":
        return (
          <FunctionalCriteriaProduct
            type={"detail"}
            data={listDataCriteria} //data
            dataCriteria={criteriaValues} //ddl
            selector="pricingRule"
            columnsTable={columnsTableCriteriaAll}
            countryCriteriaId={countryCriteriaId}
          />
          // <Criteria
          //   type={"detail"}
          //   listDataCriteria={listDataCriteria}
          //   criteriaValues={criteriaValues}
          // />
        );
      default:
        return <></>;
    }
  };

  return (
    <div>
      <BaseContainer header={"pricing rule information"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Name">{dataText?.name}</DetailText>
          <DetailText label="Start Date">
            {dataText?.startDate
              ? moment(dataText.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="End Date">
            {dataText?.endDate
              ? moment(dataText.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">
            {dataText?.status ? lowerCaseStatus(dataText?.status) : ""}
          </DetailText>
          <DetailText label="Status Approval">
            {dataText?.approvalStatus
              ? lowerCaseStatus(dataText?.approvalStatus)
              : ""}
          </DetailText>
        </div>
        <div className="col=span-2">
          <DetailText label="Criteria">
            {(dataText?.rpricingRuleCriterias || [])?.reduce(
              (prev, current, index) =>
                prev +
                (current.criteriaName
                  ? `${index !== 0 ? ", " : ""}${current.criteriaName}`
                  : ""),
              ""
            )}
          </DetailText>
        </div>
        <div className="col=span-2">
          <DetailText label="Description">{dataText?.description}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer
        header={"pricing rule detail"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabPagesEmployee}
            onChange={onChange}
            currentPosition={valuePage}
          />
        }
      >
        <div className="pt-4">
          {layout(valuePage)}
        </div>
      </BaseContainer>

      <BaseContainer header={"history log information"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{dataLog?.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataLog?.createdDate
              ? moment(dataLog.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataLog?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataLog?.updatedDate
              ? moment(dataLog.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataLog?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </div>
  );
};

export default PricingRule;
