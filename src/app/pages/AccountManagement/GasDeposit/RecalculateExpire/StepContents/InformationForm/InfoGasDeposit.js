import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";

/**
 * Gas deposit detail view (container + presentational component).
 * Fetches original and draft records, supports approve/reject workflow.
 *
 * @param {object}                    props
 * @param {"sa"|"ua"}                 props.moduleType   - Module context: standalone ("sa") or under-account ("ua")
 * @param {"standard"|"oneTime"}      [props.accountType] - Account type (only relevant when moduleType is "ua")
 */
const InfoGasDeposit = ({ moduleType, accountType, detail }) => {
  // --- Derived values ---
  const isStandAlone = moduleType === "sa";
  const isUnderAccount = moduleType === "ua";
  const isStandard = isUnderAccount && accountType === "standard";
  const isOneTime = isUnderAccount && accountType === "oneTime";

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

  const routes = [
    {
      path: "",
      breadcrumbName: "Account"
    },
    {
      path: isStandAlone
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_GAS_DEPOSIT_SA
        : isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME
            : "",
      breadcrumbName: isStandAlone
        ? "Gas Deposit"
        : isStandard
          ? "Account - Standard"
          : isOneTime
            ? "Account - One Time"
            : ""
    },
    isUnderAccount && {
      path: isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
        : isOneTime
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
          : "",
      breadcrumbName: "Detail Account"
    },
    {
      path: "",
      breadcrumbName: "Detail Gas Deposit"
    }
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-y-4">
      <NxBreadCrumb routes={routes} />
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
    </div>
  );
};

export default InfoGasDeposit;
