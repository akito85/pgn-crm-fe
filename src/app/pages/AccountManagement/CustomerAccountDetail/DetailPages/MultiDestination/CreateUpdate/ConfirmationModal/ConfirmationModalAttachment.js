import { useDispatch } from "react-redux";
import ConfirmationModalAttachmentTable from "./ConfirmationModalAttachmentTable";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";

const ConfirmationModalAttachment = ({
  data = [],
  type,
  service,
  configApplication,
}) => {
  const dispatch = useDispatch();

  return (
    <NxBaseContainer border header={"ATTACHMENT"}>
      <ConfirmationModalAttachmentTable
        type={type}
        data={data}
        dispatch={dispatch}
        service={service}
        configApplication={configApplication}
      />
    </NxBaseContainer>
  );
};

export default ConfirmationModalAttachment;
