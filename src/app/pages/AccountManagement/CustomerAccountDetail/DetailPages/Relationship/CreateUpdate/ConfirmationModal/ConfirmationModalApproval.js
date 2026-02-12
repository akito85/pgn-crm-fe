import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import RelationshipApproval from "../StepContents/ApprovalForm/RelationshipApproval";

const ConfirmationModalApproval = ({
  dataTable = [],
  values = {},
}) => (
  <NxBaseContainer border header={"APPROVAL"}>
    <RelationshipApproval
      values={values}
      dataDetailApproval={dataTable}
      hideSelector
    />
  </NxBaseContainer>
);

export default ConfirmationModalApproval;
