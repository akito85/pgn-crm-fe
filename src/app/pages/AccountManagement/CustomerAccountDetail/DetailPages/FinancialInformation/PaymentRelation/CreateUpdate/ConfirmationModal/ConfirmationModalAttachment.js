import { Fragment } from "react";
import ModalConfirmationCreateUpdateApprovalPaymentRelationAttachmentTable from "./ConfirmationModalAttachmentTable";

const ModalConfirmationCreateUpdateApprovalPaymentRelationAttachment = ({
  data = [],
  type,
  dispatch,
}) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        ATTACHMENT
      </div>
      <ModalConfirmationCreateUpdateApprovalPaymentRelationAttachmentTable
        type={type}
        data={data}
        dispatch={dispatch}
      />
    </Fragment>
  );
};

export default ModalConfirmationCreateUpdateApprovalPaymentRelationAttachment;
