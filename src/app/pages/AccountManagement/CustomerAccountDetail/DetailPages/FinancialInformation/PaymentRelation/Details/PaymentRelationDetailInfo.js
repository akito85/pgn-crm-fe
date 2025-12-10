import { Fragment } from "react";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";

const PaymentRelationDetailInfo = ({
  dataDetail = {},
}) => {
  const log = []

  const HistoryLogDummy = {
    recordId: "491",
    createdDate: "21 Dec 2021 23:11:09",
    createdBy: "Annisa",
    updatedDate: "28 Dec 2021 23:11:09",
    updatedBy: "Annisa"
  };

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
          <DetailText label="Record Id">{log?.recordId || HistoryLogDummy.recordId}</DetailText>
          <DetailText label="Created Date">{log?.createdDate || HistoryLogDummy.createdDate}</DetailText>
          <DetailText label="Created By">{log?.createdBy || HistoryLogDummy.createdBy}</DetailText>
          <DetailText label="Updated Date">{log?.updatedDate || HistoryLogDummy.updatedDate}</DetailText>
          <DetailText label="Updated By">{log?.updatedBy || HistoryLogDummy.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default PaymentRelationDetailInfo;
