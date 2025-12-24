import InfoPaymentRelation from "./InfoPaymentRelation";

export default function InformationForm({
  setAccount,
  className,
  page,
  pageSize,
  accountId,
}) {

  return <InfoPaymentRelation setAccount={setAccount} className={className} accountId={accountId} />;
}
