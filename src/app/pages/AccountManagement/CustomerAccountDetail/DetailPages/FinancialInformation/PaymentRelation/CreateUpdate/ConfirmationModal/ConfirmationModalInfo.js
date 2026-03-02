import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import InfoPaymentRelation from "../StepContents/InformationForm/InfoPaymentRelation";

const ConfirmationModalInfo = ({
  form,
}) => {
  return (
    <NxBaseContainer border header={"PAYMENT RELATION INFORMATION"}>
      <InfoPaymentRelation form={form} formView={false} />
    </NxBaseContainer>
  );
};

export default ConfirmationModalInfo;
