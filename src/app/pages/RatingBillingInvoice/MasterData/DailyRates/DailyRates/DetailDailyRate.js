import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import CardContainer from "../../../../../../components/CardContainer";

const DetailDailyRate = ({ data_detail }) => {
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
    <div className="w-full gap-5">
      {data_detail?.isApprover &&
      data_detail?.approvalType &&
      data_detail?.approvalType === "INACTIVE_DAILY_RATES" ? (
        <CardContainer header={"INACTIVE REQUEST INFORMATION"}>
          <div className="grid grid-cols-4 w-full">
            <DetailText label={"Requested Date"}>
              {data_detail?.approvalDetail?.requestedDate
                ? moment(data_detail?.approvalDetail?.requestedDate).format(
                    "DD MMM YYYY HH:mm:ss",
                  )
                : ""}
            </DetailText>
            <DetailText label={"Requested By"}>
              {data_detail?.approvalDetail?.requestedBy}
            </DetailText>
            <DetailText label={"Remark"}>
              {data_detail?.approvalDetail?.remarks}
            </DetailText>
          </div>
        </CardContainer>
      ) : null}
      <CardContainer header={"DAILY RATE INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-5">
          <DetailText label={"Rate Type"}>{data_detail?.rateType}</DetailText>
          <DetailText label={"From Currency"}>
            {data_detail?.fromCurrencyName}
          </DetailText>
          <DetailText label={"To Currency"}>
            {data_detail?.toCurrencyName}
          </DetailText>
          <DetailText label={"Rate Date"}>
            {data_detail?.rateDate !== null
              ? moment(data_detail?.rateDate).format(dateFormatting.dateCapital)
              : ""}
          </DetailText>
          <DetailText label={"Converted Rate"}>
            {data_detail?.convertedRateName}
          </DetailText>
          <DetailText label={"Status"}>
            {labelStatus(data_detail?.status)}
          </DetailText>
          <DetailText label={"Status Approval"}>
            {labelStatus(data_detail?.statusApproval)}
          </DetailText>
        </div>
        <div className="w-full grid grid-cols-1 gap-5">
          <DetailText label={"Description"}>
            {data_detail?.description}
          </DetailText>
        </div>
      </CardContainer>

      <CardContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label={"Record ID"}>{data_detail?.ratesId}</DetailText>
          <DetailText label={"Created Date"}>
            {data_detail?.createdDate !== null
              ? moment(data_detail?.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate !== null
              ? moment(data_detail?.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default DetailDailyRate;
