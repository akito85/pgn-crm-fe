import ConfirmationModalAttachmentTable from "./ConfirmationModalAttachmentTable";
import CardContainer from "../../../../../../../../../components/CardContainer";

const ConfirmationModalAttachment = ({
  data = [],
  type,
  dispatch,
  service,
  configApplication,
}) => {
  return (
    <CardContainer header={"ATTACHMENT"}>
      <ConfirmationModalAttachmentTable
        type={type}
        data={data}
        dispatch={dispatch}
        service={service}
        configApplication={configApplication}
      />
    </CardContainer>
  );
};

export default ConfirmationModalAttachment;
