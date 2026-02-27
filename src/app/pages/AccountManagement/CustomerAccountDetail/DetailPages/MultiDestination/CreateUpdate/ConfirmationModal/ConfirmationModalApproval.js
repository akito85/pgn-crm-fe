import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import ApprovalSectionForm from "../StepContents/ApprovalForm/ApprovalMultiDestination";

const ConfirmationModalApproval = ({ dataTable = [], form }) => {
  return (
    <NxBaseContainer border header={"APPROVAL"}>
      <ApprovalSectionForm form={form} dataTable={dataTable} formView={false} />
    </NxBaseContainer>
  );
};

export default ConfirmationModalApproval;
