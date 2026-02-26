import { useEffect, useState } from "react";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import { Button } from "antd";

const ConfirmationModal = ({
  form,
  formId,
  isOpen,
  handleCancel,
  type = "",
  approvalData,
  attachmentData,
  configApplication,
  service,
  relatedDetails,
}) => {
  const tabLength = type === "submit" ? 4 : 3;
  const [activeTab, setActiveTab] = useState(0);

  /**
   * @param {"next" | "prev"} direction
   */
  const handleChangeTab = (direction) => {
    if (direction === "next" && activeTab < tabLength - 1) {
      setActiveTab((prev) => prev + 1);
    } else if (direction === "prev" && activeTab >= 0) {
      setActiveTab((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setActiveTab(0);
    }
  }, [isOpen]);

  return (
    <NxModal
      isOpen={isOpen}
      width={1000}
      header={"CONFIRMATION RELATIONSHIP"}
      type={"confirmation"}
      hidePadding={{
        top: true,
      }}
      footer={[
        <div className={"w-full flex justify-between gap-x-4"} key={`footer-1`}>
          <Button type={"menu"} onClick={() => handleCancel()}>
            Cancel
          </Button>
          <div className="flex gap-x-2">
            <Button type={"menu"} disabled={activeTab < 1} onClick={() => handleChangeTab("prev")}>
              Previous
            </Button>
            {activeTab < (tabLength - 1) && (
              <Button type={"submit"} onClick={() => handleChangeTab("next")}>
                Next
              </Button>
            )}
            {activeTab === (tabLength - 1) && (
              <Button type={"submit"} form={formId} htmlType={"submit"}>
                {type === "submit" ? "Submit" : type === "draft" ? "Save as Draft" : ""}
              </Button>
            )}
          </div>
        </div>,
      ]}
    >
      <ConfirmationModalTabs
        form={form}
        hierarchyTableData={approvalData}
        dataAttachment={attachmentData}
        service={service}
        type={type}
        configApplication={configApplication}
        activeTab={activeTab}
        relatedDetails={relatedDetails}
        setActiveTab={setActiveTab}
      />
    </NxModal>
  );
};

export default ConfirmationModal;
