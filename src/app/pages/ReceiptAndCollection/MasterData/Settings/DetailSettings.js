import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const DetailSettings = ({ data_detail }) => {
  return (
    <div>
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              PAYMENT CHANNEL CONFIGURATION INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="CA CI Mapping Name">{data_detail?.mappingName}</DetailText>
          <DetailText label="Partner Code">{data_detail?.partnerCode}</DetailText>
          <DetailText label="Collecting Agent">{data_detail?.caCode}</DetailText>
          <DetailText label="Delivery Channel">{data_detail?.deliveryChannelCode}</DetailText>
          <DetailText label="Type">{data_detail?.type}</DetailText>

          <DetailText label="Start Date">
            {data_detail?.startDate
              ? moment(data_detail?.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="End Date">
            {data_detail?.endDate
              ? moment(data_detail?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          
          <DetailText label="Start Time">
            {data_detail?.startHour ? `${data_detail?.startHour}:${data_detail?.startMinute}` : ''}
          </DetailText>
          <DetailText label="End Time">
            {data_detail?.endHour ? `${data_detail?.endHour}:${data_detail?.endMinute}` : ''}
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

export default DetailSettings;
