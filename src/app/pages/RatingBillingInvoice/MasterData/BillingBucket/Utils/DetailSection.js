import React, { useState } from "react";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import BaseContainer from "../../../../../../components/BaseContainer";
import BillingBucketInfo from "../Utils/BillingBucketInfo";
import FunctionalCriteriaBillingBucket from "../Form/FunctionalCriteriaBillingBucket";
import BillingBucketDetailSectionForm from "../Modal/BillingBucketDetailSectionForm";
import RadioTabs from "../../../../../../components/RadioTabs";
import CardContainer from "../../../../../../components/CardContainer";

const DetailSection = ({
  dataBillingBucket,
  dataHistory = {},
  criteriaValues = [],
  dataCriteria = [],
  listDataBI = [],
}) => {
  const [tabPagesEmployee, setTabPagesEmployee] = useState([
    { value: "Detail", paramValue: ["billingBucketCode"] },
    { value: "Criteria" },
  ]);
  const [valuePage, setValuePage] = useState("Detail");

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div>
      <CardContainer header={"Billing Bucket Information"}>
        <BillingBucketInfo data={dataBillingBucket} preview="detail" />
      </CardContainer>

      <CardContainer
        header={"Billing Bucket Detail Information"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabPagesEmployee}
            onChange={onChange}
            currentPosition={valuePage}
          />
        }
      >
        {valuePage === "Detail" ? (
          <BillingBucketDetailSectionForm
            listDataBI={listDataBI}
            type={"show"}
            showAction="show"
          />
        ) : (
          <FunctionalCriteriaBillingBucket
            data={dataCriteria}
            dataCriteria={criteriaValues}
            type={"show"}
            showAction={"show"}
          />
        )}
      </CardContainer>

      <CardContainer header={"history log information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label={"Record ID"}>{dataHistory?.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </div>
      </CardContainer>
    </div>
  );
};
export default DetailSection;
