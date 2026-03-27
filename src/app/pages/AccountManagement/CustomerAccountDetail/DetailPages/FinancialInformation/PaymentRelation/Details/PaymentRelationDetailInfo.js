import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../../../../../components/StatusComponent";

/**
 * Presentational info panel for a payment relation record.
 * Displays account details, priority, dates, status, and description.
 *
 * @param {object} props
 * @param {object} [props.detail={}]            - Payment relation detail record
 * @param {string} [props.subjectAccountNumber] - Account number of the subject account (used for conditional display)
 */
const PaymentRelationDetailInfo = ({
  subjectAccountNumber,
  detail = {},
}) => {
  const {
    accountNumber,
    accountName,
    priority,
    startDate,
    endDate,
    status,
    statusApproval,
    description,
  } = detail;

  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-4 gap-4">
          {/* Payment Relation Information */}
          <NxDetailText label="Account Number">{accountName}</NxDetailText>
          <NxDetailText label="Account Name">{accountNumber}</NxDetailText>
          <NxDetailText label="Priority">{priority}</NxDetailText>
          <NxDetailText label="Start Date">{NxDate.formatDate(startDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="End Date">{NxDate.formatDate(endDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Status">
            <StatusComponent colour={status} margin={false}>
              {status}
            </StatusComponent>
          </NxDetailText>
          <NxDetailText label="Status Approval">
            <StatusComponent colour={statusApproval} margin={false}>
              {statusApproval}
            </StatusComponent>
          </NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{description}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default PaymentRelationDetailInfo;
