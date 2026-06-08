import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";
import NxStatusComponent from "../../../../../../../../components/Nx/NxStatusComponent";

/**
 * Presentational info panel for an invoice relation record.
 * Displays account details, dates, status, and description.
 *
 * @param {object} props
 * @param {object} [props.detail={}] - Invoice relation detail record
 */
const InvoiceRelationDetailInfo = ({
  detail = {},
}) => {
  const {
    accountNumber,
    accountName,
    startDate,
    endDate,
    status,
    statusApproval,
    description,
  } = detail;

  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Invoice Relation Information */}
          <NxDetailText label="Account Number">{accountNumber}</NxDetailText>
          <NxDetailText label="Account Name">{accountName}</NxDetailText>
          <NxDetailText label="Start Date">{NxDate.formatDate(startDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="End Date">{NxDate.formatDate(endDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Status">
            <NxStatusComponent colour={status}>
              {status}
            </NxStatusComponent>
          </NxDetailText>
          <NxDetailText label="Status Approval">
            <NxStatusComponent colour={statusApproval}>
              {statusApproval}
            </NxStatusComponent>
          </NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{description}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default InvoiceRelationDetailInfo;
