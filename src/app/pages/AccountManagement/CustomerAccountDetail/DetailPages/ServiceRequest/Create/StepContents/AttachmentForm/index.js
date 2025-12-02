import AttachmentForm from "../../../../../../CreateCustomerAccount/Standard/Form/CustomerAccountInformation/AttachmentForm";

/**
 * Wrapper component for AttachmentForm in Service Request Step 4
 * Reuses the attachment component from CreateCustomerAccount/Standard
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
      typeSelector="account"  // Uses account slice for category data
      dispatch={dispatch}
    />
  );
}
