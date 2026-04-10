import moment from "moment";
import React from "react";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import FunctionalTableCriteriaTOP from "./TableCriteria/FunctionalTableCriteriaTOP";
import CardContainer from "../../../../../components/CardContainer";

const DetailTOP = ({
  dataDetail,
  data,
  dataCriteria,
  updateData,
  type,
  dataLog,
  critName,
  data_req,
}) => {
  const formattedString = (critName || [])
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ");

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
    <div>
      {data_req?.isApprover &&
      data_req?.approvalType &&
      data_req?.approvalType === "INACTIVE_TERMS_OF_PAYMENT" ? (
        <CardContainer header={"INACTIVE REQUEST INFORMATION"}>
          <div className="grid grid-cols-4 w-full">
            <DetailText label={"Requested Date"}>
              {data_req?.requestedDate
                ? moment(data_req?.requestedDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Requested By"}>
              {data_req?.requestedBy}
            </DetailText>
            <DetailText label={"Remark"}>{data_req?.remarks}</DetailText>
          </div>
        </CardContainer>
      ) : null}

      <CardContainer header={"TERMS OF PAYMENT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-5">
          <DetailText label={"Name"}>{dataDetail?.name}</DetailText>
          <DetailText label={"Start Date"}>
            {dataDetail?.startDate !== null
              ? moment(dataDetail?.startDate).format(dateFormatting.dateCapital)
              : ""}
          </DetailText>
          <DetailText label={"End Date"}>
            {dataDetail?.endDate !== null
              ? moment(dataDetail?.endDate).format(dateFormatting.dateCapital)
              : ""}
          </DetailText>
          <DetailText label={"Type"}>{dataDetail?.typeName}</DetailText>
          <DetailText label={"Terms"}>{dataDetail?.term}</DetailText>
          <DetailText label={"Calendar"}>
            {dataDetail?.isCalendar === true ? "True" : "False"}
          </DetailText>
          <DetailText label={"Saturday"}>
            {dataDetail?.isSaturday === true ? "True" : "False"}
          </DetailText>
          <DetailText label={"Sunday"}>
            {dataDetail?.isSunday === true ? "True" : "False"}
          </DetailText>
          <DetailText label={"Status"}>
            {labelStatus(dataDetail?.status)}
          </DetailText>
          <DetailText label={"Status Approval"}>
            {labelStatus(dataDetail?.statusApproval)}
          </DetailText>
        </div>
        <div className="w-full grid grid-cols-1">
          <DetailText label={"Criteria"}>{formattedString}</DetailText>
          <DetailText label={"Description"}>
            {dataDetail?.description}
          </DetailText>
        </div>
      </CardContainer>

      <CardContainer header={"CRITERIA INFORMATION"}>
        <FunctionalTableCriteriaTOP
          type={"show"}
          showAction={"show"}
          data={data}
          dataCriteria={dataCriteria}
          updateData={updateData}
        />
      </CardContainer>

      <CardContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5">
          <DetailText label={"Record ID"}>{dataLog.recordId}</DetailText>
          <DetailText label={"Created Date"}>
            {dataLog.createdDate !== null
              ? moment(dataLog.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label={"Created By"}>{dataLog.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {dataLog.updatedDate !== null
              ? moment(dataLog.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label={"Updated By"}>{dataLog.updatedBy}</DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default DetailTOP;
