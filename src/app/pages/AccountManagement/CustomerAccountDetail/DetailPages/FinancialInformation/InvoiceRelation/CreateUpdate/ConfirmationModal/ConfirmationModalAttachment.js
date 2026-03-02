import { useDispatch } from "react-redux";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import AttachmentInvoiceRelation from "../StepContents/AttachmentForm/AttachmentInvoiceRelation";

const ConfirmationModalAttachment = ({ data = [], service, configApplication }) => {
  const dispatch = useDispatch();
  return (
    <NxBaseContainer border header={"ATTACHMENT"}>
      <AttachmentInvoiceRelation
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
