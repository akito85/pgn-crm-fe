import { useEffect, useState } from "react";
import { Button } from "antd";
import NxModal from "../../../../../../../components/Nx/NxModal";
import WoConfirmationModalTabs from "./WoConfirmationModalTabs";

const CONFIRMATION_TABS = ["wo-info", "activity-data", "approval", "attachment"];

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

  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const isLastTab = currentTabIdx === CONFIRMATION_TABS.length - 1;

  useEffect(() => {
    if (isOpen) setCurrentTabIdx(0);
  }, [isOpen]);

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
          <div className="flex items-center gap-2">
            {currentTabIdx > 0 && (
              <Button type="menu" onClick={() => setCurrentTabIdx((p) => p - 1)} disabled={loading}>
                Previous
              </Button>
            )}
            {isLastTab ? (
              <Button type="submit" onClick={handleConfirm} loading={loading}>
                {confirmLabel}
              </Button>
            ) : (
              <Button type="submit" onClick={() => setCurrentTabIdx((p) => p + 1)} disabled={loading}>
                Next
              </Button>
            )}
          </div>
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
          activeTabKey={CONFIRMATION_TABS[currentTabIdx]}
        />
      </div>
    </NxModal>
  );
};

export default WoConfirmationModal;
