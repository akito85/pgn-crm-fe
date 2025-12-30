import InfoPaymentRelation from "./InfoMultiDestination";

export default function InformationForm({
  setAccount,
  className,
  page,
  pageSize,
  accountId,
}) {

  return <InfoPaymentRelation setAccount={setAccount} className={className} accountId={accountId} />;
}
