import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";

const PaymentRelationDetailInfo = ({
  subjectAccountNumber,
  dataDetail = {},
}) => {
  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Payment Relation Information */}
          <NxDetailText label="Account Number">{subjectAccountNumber === dataDetail?.accountNumber ? dataDetail?.relatedAccountNumber : dataDetail?.accountNumber}</NxDetailText>
          <NxDetailText label="Account Name">{subjectAccountNumber === dataDetail?.accountNumber ? dataDetail?.relatedAccountName : dataDetail?.accountName}</NxDetailText>
          <NxDetailText label="Priority">{dataDetail?.priority}</NxDetailText>
          <NxDetailText label="Start Date">{dataDetail?.startDate ? moment(dataDetail.startDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
          <NxDetailText label="End Date">{dataDetail?.endDate ? moment(dataDetail.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
          <NxDetailText label="Status">{dataDetail?.status}</NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{dataDetail?.description}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default PaymentRelationDetailInfo;
