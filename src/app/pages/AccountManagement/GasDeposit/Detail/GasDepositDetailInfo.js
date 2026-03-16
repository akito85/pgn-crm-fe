import NxDetailText from "../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxDate from "../../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../../components/StatusComponent";

/**
 * Presentational info panel for a gas deposit record.
 * Displays account details, dates, status, and description.
 *
 * @param {object} props
 * @param {object} [props.detail={}] - Gas deposit detail record
 */
const GasDepositDetailInfo = ({
  detail = {},
}) => {
  // --- Derived values ---
  const {
    accountNumber,
    accountName,
    startDate,
    endDate,
    status,
    description,
  } = detail;

  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Gas Deposit Information */}
          <NxDetailText label="Account Number">{accountNumber}</NxDetailText>
          <NxDetailText label="Account Name">{accountName}</NxDetailText>
          <NxDetailText label="Start Date">{NxDate.formatDate(startDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="End Date">{NxDate.formatDate(endDate, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Status">
            <StatusComponent colour={status} margin={false}>
              {status}
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

export default GasDepositDetailInfo;
