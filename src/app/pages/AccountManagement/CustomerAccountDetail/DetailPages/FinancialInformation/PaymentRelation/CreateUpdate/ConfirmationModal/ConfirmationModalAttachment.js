import ConfirmationModalAttachmentTable from "./ConfirmationModalAttachmentTable";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";

const ConfirmationModalAttachment = ({
  data = [],
  type,
  service,
  configApplication,
}) => {
  return (
    <NxBaseContainer border header={"ATTACHMENT"}>
      <ConfirmationModalAttachmentTable
        type={type}
        data={data}
        service={service}
        configApplication={configApplication}
      />
    </NxBaseContainer>
  );
};

export default ConfirmationModalAttachment;
