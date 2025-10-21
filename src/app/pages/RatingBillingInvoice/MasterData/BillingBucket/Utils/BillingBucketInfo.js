import React, { useMemo } from "react";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import DetailText from "../../../../../../components/DetailText";

const BillingBucketInfo = ({
  data,
  apiCriteria = [],
  preview = "confirmation",
  apiPriorityPeriod = [],
}) => {
  const labelPriorityPeriod = apiPriorityPeriod
    ?.filter((a) => a.id === data?.priorityPeriod)
    ?.find((v) => v.name)?.name;

  // Find Name Criteria on Modal Confirm
  const matchedObjectsCriteria = apiCriteria?.filter((obj) =>
    data?.criteria?.includes(obj.id),
  );

  const getNameCriteria = useMemo(() => {
    const criteriaName = apiCriteria
      ?.filter((item) => data?.criteria?.includes(item?.id))
      ?.map((item) => item?.text)
      ?.join(", ");
    return criteriaName;
  }, [apiCriteria, data?.criteria]);

  console.log(getNameCriteria);

  const matchedNamesCriteria = matchedObjectsCriteria
    ?.map((obj) => obj.name)
    ?.reduce((current, next) => current + `, ${next}`, "");

  // Find Name Criteria on Detail
  const criteriaName = data?.criteria
    ?.map((a) => a.criteriaName)
    ?.reduce((current, next) => current + `, ${next}`, "");

  const labelStatus = (index) => {
    let text;
    switch (index) {
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

  return (
    <div className="w-full grid grid-cols-3 gap-3">
      {preview === "detail" ? (
        <>
          <DetailText label={"Billing Bucket Code"}>
            {data?.information?.billingBucketCode}
          </DetailText>
          <DetailText label={"Name"}>{data?.information?.name}</DetailText>
          <DetailText label={"Priority Period"}>
            {data?.information?.priorityPeriod?.name}
          </DetailText>
          <DetailText label={"Start Date"}>
            {data?.information?.startDate
              ? moment(data?.information?.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"End Date"}>
            {data?.information?.endDate
              ? moment(data?.information?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"Status"}>
            {labelStatus(data?.information?.status)}
          </DetailText>
          <DetailText label={"Status Approval"}>
            {labelStatus(data?.information?.statusApproval)}
          </DetailText>
          <div className="col-span-3">
            <DetailText label={"Criteria"}>
              {criteriaName?.slice(2) || data?.criteria}
            </DetailText>
          </div>
          <div className="col-span-3">
            <DetailText label={"Description"}>
              {data?.information?.description}
            </DetailText>
          </div>
        </>
      ) : (
        <>
          <DetailText label={"Billing Bucket Code"}>
            {data?.billingBucketCode}
          </DetailText>
          <DetailText label={"Name"}>{data?.name}</DetailText>
          <DetailText label={"Priority Period"}>
            {labelPriorityPeriod}
          </DetailText>
          <DetailText label={"Start Date"}>
            {data?.startDate
              ? moment(data?.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"End Date"}>
            {data?.endDate
              ? moment(data?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <div className="col-span-3">
            <DetailText label={"Criteria"}>{getNameCriteria}</DetailText>
          </div>
          <div className="col-span-3">
            <DetailText label={"Description"}>{data?.description}</DetailText>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingBucketInfo;
