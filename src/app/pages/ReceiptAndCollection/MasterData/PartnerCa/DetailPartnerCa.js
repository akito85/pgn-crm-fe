import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const DetailPartnerCa = ({ data_detail, data_req }) => {
  return (
    <div>
      {data_req?.isValidated &&
        data_req?.approvalType &&
        data_req?.approvalType === "INACTIVE_PARTNER_CA" ? (
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">
                INACTIVE REQUEST INFORMATION
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-5 w-full gap-4">
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
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              PARTNER COLLECTING AGENT MAPPING INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="Partner">
            {data_detail?.partner ? `${data_detail.partner.partnerCode} - ${data_detail.partner.partnerName}` : "-"}
          </DetailText>
          <DetailText label="Collecting Agent">
            {data_detail?.collectingAgent ? `${data_detail.collectingAgent.code} - ${data_detail.collectingAgent.name}` : "-"}
          </DetailText>
          <DetailText label="Settlement Bank">
            {data_detail?.settlementBank ? `${data_detail.settlementBank.bankCode} - ${data_detail.settlementBank.bankName}` : "-"}
          </DetailText>
          <DetailText label="Start Date">
            {data_detail?.startDate ? moment(data_detail.startDate).format(dateFormatting.date) : "-"}
          </DetailText>
          <DetailText label="End Date">
            {data_detail?.endDate
              ? moment(data_detail.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <DetailText label="Status Approval">
            {data_detail?.statusApproval}
          </DetailText>
        </div>
      </CardContainer>

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              HISTORY LOG INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {data_detail?.createdDate ? moment(data_detail.createdDate).format("DD MMM YYYY HH:mm:ss") : "-"}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate !== null
              ? moment(data_detail.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : ""}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default DetailPartnerCa;
