import { Fragment } from "react";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";

const PaymentRelationDetailInfo = ({
  dataDetail = {},
}) => {
  return (
    <Fragment>
      <BaseContainer header={"PAYMENT RELATION"}>
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Payment Relation Information */}
          <DetailText label="Account Number">{dataDetail?.relatedAccountNumber}</DetailText>
          <DetailText label="Account Name">{dataDetail?.relatedAccountName}</DetailText>
          <DetailText label="Priority">{dataDetail?.priority}</DetailText>
          <DetailText label="Start Date">{dataDetail?.startDate ? moment(dataDetail.startDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</DetailText>
          <DetailText label="End Date">{dataDetail?.endDate ? moment(dataDetail.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</DetailText>
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
          <DetailText label="Updated Date">{dataDetail?.updatedDate ? moment(dataDetail.updatedDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</DetailText>
          <DetailText label="Updated By">{dataDetail?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default PaymentRelationDetailInfo;
