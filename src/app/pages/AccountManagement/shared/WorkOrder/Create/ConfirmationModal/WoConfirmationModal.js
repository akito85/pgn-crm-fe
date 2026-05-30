import { Button } from "antd";
import NxModal from "../../../../../../../components/Nx/NxModal";
import WoConfirmationModalTabs from "./WoConfirmationModalTabs";

const WoConfirmationModal = ({
  isOpen,
  type = "submit",
  formValues,
  activityData,
  approvalData,
  attachments,
  loading,
  handleCancel,
  handleConfirm,
}) => {
  const title = type === "draft" ? "SAVE AS DRAFT CONFIRMATION" : "SUBMIT CONFIRMATION";
  const confirmLabel = type === "draft" ? "Save as Draft" : "Confirm & Submit";

  const dataRequirements = formValues?.woFormDataRequirements || [];

  return (
    <NxModal
      isOpen={isOpen}
      type="confirmation"
      title={title}
      handleCancel={handleCancel}
      width={900}
      footer={
        <div className="flex justify-between">
          <Button type="menu" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="p-4">
        <WoConfirmationModalTabs
          formValues={formValues}
          activityData={activityData}
          dataRequirements={dataRequirements}
          approvalData={approvalData}
          attachments={attachments}
        />
      </div>
    </NxModal>
  );
};

export default WoConfirmationModal;
