import InfoServiceRequest from "./InfoServiceRequest";
import InfoDataRequirement from "./InfoDataRequirement";

export default function InformationForm(props) {
  const { account, customer, dropdowns, form, idAccount, isUpdate, isDraft } = props;

  return (
    <>
      <InfoServiceRequest
        form={form}
        account={account}
        customer={customer}
        dropdowns={dropdowns}
        isUpdate={isUpdate}
        isDraft={isDraft}
      />
      <InfoDataRequirement
        form={form}
        dropdowns={dropdowns}
        idAccount={idAccount}
        isUpdate={isUpdate}
      />
    </>
  );
}
