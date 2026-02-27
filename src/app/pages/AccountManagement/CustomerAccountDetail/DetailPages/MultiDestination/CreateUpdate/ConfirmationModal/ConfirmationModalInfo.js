import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import InfoMultiDestination from "../StepContents/InformationForm/InfoMultiDestination";

const ConfirmationModalInfo = ({ form }) => {
  return (
    <NxBaseContainer border header={"MULTI DESTINATION INFORMATION"}>
      <InfoMultiDestination form={form} formView={false} />
    </NxBaseContainer>
  );
};

export default ConfirmationModalInfo;
