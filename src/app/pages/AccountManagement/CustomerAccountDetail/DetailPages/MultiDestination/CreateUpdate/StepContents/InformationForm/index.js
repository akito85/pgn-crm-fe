import InfoMultiDestination from "./InfoMultiDestination";

export default function InformationForm({ setAccount, accountId, form, isUpdate, isDraft }) {
  return <InfoMultiDestination setAccount={setAccount} accountId={accountId}
           form={form} isUpdate={isUpdate} isDraft={isDraft} />;
}
