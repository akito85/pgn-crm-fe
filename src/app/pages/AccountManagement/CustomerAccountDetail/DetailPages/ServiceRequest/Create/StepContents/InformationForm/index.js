import InfoServiceRequest from "./InfoServiceRequest";
import InfoDataRequirement from "./InfoDataRequirement";

export default function InformationForm({ form, account, customer, dropdowns, data, updateData, setDeleted }) {
  return (
    <>
      <InfoServiceRequest form={form} account={account} customer={customer} dropdowns={dropdowns} />
      <InfoDataRequirement
        dropdowns={dropdowns}
        accountId={account?.accountInformation?.accountId}
        data={data}
        updateData={updateData}
        setDeleted={setDeleted}
      />
    </>
  );
}
