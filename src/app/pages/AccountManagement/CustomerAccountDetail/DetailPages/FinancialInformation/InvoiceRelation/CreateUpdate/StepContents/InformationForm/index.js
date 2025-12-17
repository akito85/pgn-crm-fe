import InfoInvoiceRelation from "./InfoInvoiceRelation";

export default function InformationForm({
  setAccount,
  className,
  page,
  pageSize,
  accountId,
}) {

  return <InfoInvoiceRelation setAccount={setAccount} className={className} accountId={accountId} />;
}
