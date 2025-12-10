import { Fragment } from "react";
import ConfirmationModalAttachmentTable from "./ConfirmationModalAttachmentTable";

const ConfirmationModalAttachment = ({
  data = [],
  type,
  dispatch,
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
      />
    </Fragment>
  );
};

export default ConfirmationModalAttachment;
