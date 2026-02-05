import moment from "moment";
import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const DetailSettings = ({ data_detail, data_req }) => {


  return (
    <div>
      {data_req?.isApprover &&
        data_req?.approvalType &&
        data_req?.approvalType === "INACTIVE_RECEIPT_SETTING" ? (
        <DetailSection header={"INACTIVE REQUEST INFORMATION"}>
          <div className="grid grid-cols-5 w-full gap-4">
            <DetailText label={"Requested Date"}>
              {data_req?.requestedDate
                ? moment(data_req?.requestedDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Requested By"}>
              {data_req?.requestedBy}
            </DetailText>
            <DetailText label={"Remark"} className="col-span-3">{data_req?.remarks}</DetailText>
          </div>
        </DetailSection>
      ) : null}
      <DetailSection header={"SETTING INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label={"Collecting Agent Code"}>
            {data_detail?.caCode}
          </DetailText>
          <DetailText label={"Partner Code"}>
            {data_detail?.partnerCode}
          </DetailText>
          <DetailText label={"Payment Channel Code"}>
            {data_detail?.ciCode}
          </DetailText>
          <DetailText label={"Type"}>
            {data_detail?.type}
          </DetailText>
          <DetailText label={"Date Start"}>
            {data_detail?.dateStart}
          </DetailText>
          <DetailText label={"Date End"}>
            {data_detail?.dateEnd}
          </DetailText>
          <DetailText label={"Hour Start"}>
            {data_detail?.hourStart}
          </DetailText>
          <DetailText label={"Hour End"}>
            {data_detail?.hourEnd}
          </DetailText>
          <DetailText label={"Minute Start"}>
            {data_detail?.minuteStart}
          </DetailText>
          <DetailText label={"Minute End"}>
            {data_detail?.minuteEnd}
          </DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <DetailText label="Status Approval">
            {data_detail?.statusApproval}
          </DetailText>
        </div>
      </DetailSection>

      <DetailSection header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {data_detail?.createdDate ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss") : ""}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate !== null
              ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : ""}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </div>
      </DetailSection>
    </div>
  );
};

export default DetailSettings;
