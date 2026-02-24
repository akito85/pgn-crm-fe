import InfoInvoiceRelation from "./InfoInvoiceRelation";

export default function InformationForm({
  setAccount,
  className,
  accountId,
  isUpdate,
  isDraft,
}) {
  return (
    <InfoInvoiceRelation
      setAccount={setAccount}
      className={className}
      accountId={accountId}
      isUpdate={isUpdate}
      isDraft={isDraft}
    />
  );
}
