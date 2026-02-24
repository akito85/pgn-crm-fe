import InfoPaymentRelation from "./InfoPaymentRelation";

export default function InformationForm({
  setAccount,
  className,
  accountId,
  isUpdate,
}) {

  return <InfoPaymentRelation setAccount={setAccount} className={className} accountId={accountId} isUpdate={isUpdate} />;
}
