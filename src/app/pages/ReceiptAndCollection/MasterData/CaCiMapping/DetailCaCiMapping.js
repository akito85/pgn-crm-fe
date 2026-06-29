import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const DetailCaCiMapping = ({ data_detail }) => {
  return (
    <div>
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              PAYMENT CHANNEL CA CI MAPPING INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="Partner">{data_detail?.partnerId}</DetailText>
          <DetailText label="Collecting Agent">{data_detail?.collectingAgentId}</DetailText>
          <DetailText label="Delivery Channel">{data_detail?.deliveryChannelId}</DetailText>
          <DetailText label="Name">{data_detail?.name}</DetailText>
          <DetailText label="Type">{data_detail?.type}</DetailText>
          <DetailText label="Eff Start Date">
            {data_detail?.effStartDate
              ? moment(data_detail?.effStartDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Eff End Date">
            {data_detail?.effEndDate
              ? moment(data_detail?.effEndDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <DetailText label="Status Approval">{data_detail?.statusApproval}</DetailText>
        </div>
      </CardContainer>

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              LOG HISTORY INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="Record ID">{data_detail?.id}</DetailText>
          <DetailText label="Created Date">
            {data_detail?.createdDate
              ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")
              : ""}
          </DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {data_detail?.updatedDate
              ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : ""}
          </DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default DetailCaCiMapping;
