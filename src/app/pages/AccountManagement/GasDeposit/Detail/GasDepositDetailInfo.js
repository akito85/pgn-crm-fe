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
    earnPeriodStart,
    earnPeriodEnd,
    redeemPeriodStart,
    redeemPeriodEnd,
    currency,
    balanceM3,
    balanceMscf,
    balanceMmbtu,
    balanceAmount,
    availableAmount,
    status,
    remark,
  } = detail;

  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Gas Deposit Information */}
          <NxDetailText label="Earn Period Start">{NxDate.formatDate(earnPeriodStart, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Earn Period End">{NxDate.formatDate(earnPeriodEnd, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Release Period Start">{NxDate.formatDate(redeemPeriodStart, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Release Period End">{NxDate.formatDate(redeemPeriodEnd, "DD MMM YYYY")}</NxDetailText>
          <NxDetailText label="Currency">{currency}</NxDetailText>
          <NxDetailText label="Balance (M3)">{balanceM3}</NxDetailText>
          <NxDetailText label="Balance (MSCF)">{balanceMscf}</NxDetailText>
          <NxDetailText label="Balance (MBTU)">{balanceMmbtu}</NxDetailText>
          <NxDetailText label="Balance Ammount">{balanceAmount}</NxDetailText>
          <NxDetailText label="Available Ammount">{availableAmount}</NxDetailText>
          <NxDetailText label="Status">
            <StatusComponent colour={status} margin={false}>
              {status}
            </StatusComponent>
          </NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Remark">{remark}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default GasDepositDetailInfo;
