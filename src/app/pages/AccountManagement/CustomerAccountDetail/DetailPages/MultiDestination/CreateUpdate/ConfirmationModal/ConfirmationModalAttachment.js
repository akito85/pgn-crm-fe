import { Fragment } from "react";
import ConfirmationModalAttachmentTable from "./ConfirmationModalAttachmentTable";

const ConfirmationModalAttachment = ({
  data = [],
  type,
  dispatch,
  service,
  configApplication,
}) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        ATTACHMENT
      </div>
      <ConfirmationModalAttachmentTable
        type={type}
        data={data}
        dispatch={dispatch}
        service={service}
        configApplication={configApplication}
      />
    </Fragment>
  );
};

export default ConfirmationModalAttachment;
