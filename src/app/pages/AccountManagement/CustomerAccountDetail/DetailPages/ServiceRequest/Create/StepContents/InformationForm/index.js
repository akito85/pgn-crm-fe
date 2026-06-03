import InfoServiceRequest from "./InfoServiceRequest";
import InfoDataRequirement from "./InfoDataRequirement";

export default function InformationForm({ form, account, customer, dropdowns, initialDataRequirements, resetSignal }) {
  return (
    <>
      <InfoServiceRequest form={form} account={account} customer={customer} dropdowns={dropdowns}/>
      <InfoDataRequirement
        form={form}
        dropdowns={dropdowns}
        accountId={account?.accountInformation?.accountId}
        initialDataRequirements={initialDataRequirements}
        resetSignal={resetSignal}
      />
    </>
  );
}
