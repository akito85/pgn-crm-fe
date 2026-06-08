import { useEffect, useState } from "react";
import { Button } from "antd";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import ConfirmationModalTabs from "./ConfirmationModalTabs";

const TAB_COUNT = 5;

const ConfirmationModal = ({
  isOpen,
  handleCancel,
  handleConfirm,
  form,
  dropdowns,
  approvalTableData = [],
  attachmentsData = [],
  type = "submit",
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!isOpen) setActiveTab(0);
  }, [isOpen]);

  const handleChangeTab = (direction) => {
    if (direction === "next" && activeTab < TAB_COUNT - 1) {
      setActiveTab((prev) => prev + 1);
    } else if (direction === "prev" && activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
  };

  const footer = (
    <div className="flex justify-between" key="footer">
      <Button type="menu" disabled={loading} onClick={handleCancel}>
        Cancel
      </Button>
      <div className="flex gap-2">
        <Button
          type="menu"
          disabled={loading || activeTab < 1}
          onClick={() => handleChangeTab("prev")}
        >
          Previous
        </Button>
        {activeTab < TAB_COUNT - 1 ? (
          <Button type="submit" disabled={loading} onClick={() => handleChangeTab("next")}>
            Next
          </Button>
        ) : (
          <Button type="submit" loading={loading} onClick={handleConfirm}>
            {type === "draft" ? "Save as Draft" : "Confirm"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <NxModal
      isOpen={isOpen}
      width={1100}
      title={type === "draft" ? "SAVE AS DRAFT CONFIRMATION" : "SUBMIT CONFIRMATION"}
      type="confirmation"
      hidePadding={{ top: true }}
      loading={loading}
      footer={[footer]}
      handleCancel={handleCancel}
    >
      <ConfirmationModalTabs
        form={form}
        dropdowns={dropdowns}
        approvalTableData={approvalTableData}
        attachmentsData={attachmentsData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disabled={loading}
      />
    </NxModal>
  );
};

export default ConfirmationModal;
