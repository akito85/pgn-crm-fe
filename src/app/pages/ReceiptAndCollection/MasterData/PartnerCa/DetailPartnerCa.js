import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const DetailPartnerCa = ({ data_detail,  data_req }) => {

  
  return (
    <div>
      {data_req?.isApprover &&
      data_req?.approvalType &&
      data_req?.approvalType === "INACTIVE_PAYMENT_METHOD" ? (
        <BaseContainer header={"INACTIVE REQUEST INFORMATION"}>
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
        </BaseContainer>
      ) : null}
      <BaseContainer header={"PARTNER CA INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Partner Code">
            {data_detail?.partnerCode}
          </DetailText>
          <DetailText label="Collaction Agent Code">
            {data_detail?.caCode}
          </DetailText>
          <DetailText label="Settlement Bank">
            {data_detail?.settlementBank }
          </DetailText>
          <DetailText label="Eff Start Date">
            {moment(data_detail?.effStartDate).format(dateFormatting.date)}
          </DetailText>
          <DetailText label="Eff End Date">
            {data_detail?.effEndDate
              ? moment(data_detail?.effEndDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          {/* <DetailText label="Status">{data_detail?.status}</DetailText> */}
          <DetailText label="Status Approval">
            {data_detail?.statusApproval}
          </DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5">
          <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate !== null
              ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : ""}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </div>
  );
};

export default DetailPartnerCa;
