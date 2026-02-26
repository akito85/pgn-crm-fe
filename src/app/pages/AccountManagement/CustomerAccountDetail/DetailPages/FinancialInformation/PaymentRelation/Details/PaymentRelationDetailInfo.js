import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";

const PaymentRelationDetailInfo = ({
  subjectAccountNumber,
  dataDetail = {},
}) => {
  const {
    accountNumber,
    accountName,
    relatedAccountNumber,
    relatedAccountName,
    priority,
    startDate,
    endDate,
    status,
    description,
  } = dataDetail;

  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Payment Relation Information */}
          <NxDetailText label="Account Number">{subjectAccountNumber === accountNumber ? relatedAccountNumber : accountNumber}</NxDetailText>
          <NxDetailText label="Account Name">{subjectAccountNumber === accountNumber ? relatedAccountName : accountName}</NxDetailText>
          <NxDetailText label="Priority">{priority}</NxDetailText>
          <NxDetailText label="Start Date">{NxDate.formatDate(startDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="End Date">{NxDate.formatDate(endDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Status">{status}</NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{description}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default PaymentRelationDetailInfo;
