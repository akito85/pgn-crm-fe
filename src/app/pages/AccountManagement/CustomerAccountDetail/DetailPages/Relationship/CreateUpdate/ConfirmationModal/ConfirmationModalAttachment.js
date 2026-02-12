import ConfirmationModalAttachmentTable from "./ConfirmationModalAttachmentTable";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";

const ConfirmationModalAttachment = ({
  data = [],
  dispatch,
  service,
  configApplication,
}) => {
  return (
    <NxBaseContainer border header={"ATTACHMENT"}>
      <ConfirmationModalAttachmentTable
        data={data}
        dispatch={dispatch}
        service={service}
        configApplication={configApplication}
      />
    </NxBaseContainer>
  );
};

export default ConfirmationModalAttachment;
