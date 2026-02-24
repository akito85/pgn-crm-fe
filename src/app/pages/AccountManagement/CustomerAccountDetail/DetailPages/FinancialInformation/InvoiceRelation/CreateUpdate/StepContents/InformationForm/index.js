import InfoInvoiceRelation from "./InfoInvoiceRelation";

export default function InformationForm({
  setAccount,
  accountId,
  isUpdate,
  isDraft,
  form,
}) {
  return (
    <InfoInvoiceRelation
      setAccount={setAccount}
      accountId={accountId}
      isUpdate={isUpdate}
      isDraft={isDraft}
      form={form}
    />
  );
}
