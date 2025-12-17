import { Fragment } from "react";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import moment from "moment";
import { dateFormat, dateFormatting } from "../../../../../../../../utils";

const PaymentRelationDetailInfo = ({
  dataDetail = {},
}) => {
  return (
    <Fragment>
      <BaseContainer header={"PAYMENT RELATION"}>
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Payment Relation Information */}
          <DetailText label="Account Number">{dataDetail?.accountNumber}</DetailText>
          <DetailText label="Account Name">{dataDetail?.accountName}</DetailText>
          <DetailText label="Priority">{dataDetail?.priority}</DetailText>
          <DetailText label="Start Date">{dataDetail?.startDate}</DetailText>
          <DetailText label="End Date">{dataDetail?.endDate}</DetailText>
          <DetailText label="Status">{dataDetail?.status}</DetailText>
        </div>
        <div className="w-full">
          <DetailText label="Description">{dataDetail?.description}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-4">
          {/* History Log Information */}
          <DetailText label="Record Id">{dataDetail?.id}</DetailText>
          <DetailText label="Created Date">{dataDetail?.createdDate ? moment(dataDetail.createdDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</DetailText>
          <DetailText label="Created By">{dataDetail?.createdBy}</DetailText>
          <DetailText label="Updated Date">{dataDetail?.updatedDate}</DetailText>
          <DetailText label="Updated By">{dataDetail?.updatedBy ? moment(dataDetail.updatedBy, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default PaymentRelationDetailInfo;
