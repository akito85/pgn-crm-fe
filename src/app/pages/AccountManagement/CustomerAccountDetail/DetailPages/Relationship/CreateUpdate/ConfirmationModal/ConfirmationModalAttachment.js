import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import RelationshipAttachment from "../StepContents/AttachmentForm/RelationshipAttachment";

const ConfirmationModalAttachment = ({
  data = [],
  dispatch,
  service,
  configApplication,
}) => {
  return (
    <NxBaseContainer border header={"ATTACHMENT"}>
      <RelationshipAttachment
        data={data}
        dispatch={dispatch}
        service={service}
        configApplication={configApplication}
        type={"confirmation"}
      />
    </NxBaseContainer>
  );
};

export default ConfirmationModalAttachment;
