import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import RelationshipApproval from "../StepContents/ApprovalForm/RelationshipApproval";

const ConfirmationModalApproval = ({
  form,
  dataTable = [],
}) => (
  <NxBaseContainer border header={"APPROVAL"}>
    <RelationshipApproval
      form={form}
      dataDetailApproval={dataTable}
      formView={false}
    />
  </NxBaseContainer>
);

export default ConfirmationModalApproval;
