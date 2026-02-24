import InfoInvoiceRelation from "./InfoInvoiceRelation";

export default function InformationForm({
  setAccount,
  className,
  page,
  pageSize,
  accountId,
  isUpdate,
}) {

  return <InfoInvoiceRelation setAccount={setAccount} className={className} accountId={accountId} isUpdate={isUpdate} />;
}
