import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import InfoInvoiceRelation from "../StepContents/InformationForm/InfoInvoiceRelation";

const ConfirmationModalInfo = ({
  form,
}) => {
  return (
    <NxBaseContainer border header={"INVOICE RELATION INFORMATION"}>
      <InfoInvoiceRelation form={form} formView={false} />
    </NxBaseContainer>
  );
};

export default ConfirmationModalInfo;
