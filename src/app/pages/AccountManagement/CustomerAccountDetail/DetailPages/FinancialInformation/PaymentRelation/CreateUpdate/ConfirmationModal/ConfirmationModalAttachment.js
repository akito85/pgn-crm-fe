import { useDispatch } from "react-redux";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import AttachmentPaymentRelation from "../StepContents/AttachmentForm/AttachmentPaymentRelation";

const ConfirmationModalAttachment = ({ data = [], service, configApplication }) => {
  const dispatch = useDispatch();
  return (
    <NxBaseContainer border header={"ATTACHMENT"}>
      <AttachmentPaymentRelation
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
