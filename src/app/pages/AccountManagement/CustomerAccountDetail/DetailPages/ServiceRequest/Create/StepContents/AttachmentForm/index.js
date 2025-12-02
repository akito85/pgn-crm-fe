import AttachmentForm from "./AttachmentForm";

/**
 * AttachmentForm for Service Request Step 4
 * Copied from CreateCustomerAccount/Standard for customization
 */
export default function AttachmentFormStep({
  attachmentsData = [],
  setAttachmentsData = () => {},
  dispatch = () => {}
}) {
  return (
    <AttachmentForm
      data={attachmentsData}
      updateData={setAttachmentsData}
      type="create"
      typeSelector="account"
      dispatch={dispatch}
    />
  );
}
