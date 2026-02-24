import { useEffect, useState } from "react";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import NxModal from "../../../../../../../../../components/Nx/NxModal";

const ConfirmationModal = ({
  form,
  formId,
  isOpen,
  handleCancel,
  approvalData,
  dataAttachment,
  type = "",
  service,
  configApplication,
}) => {
  const tabLength = type === "submit" ? 4 : 3;

  const [activeTab, setActiveTab] = useState(0);

  /**
   * @param {"next" | "prev"} type
   */
  const handleChangeTab = (direction) => {
    if (direction === "next" && activeTab < tabLength - 1) {
      setActiveTab((prev) => prev + 1);
    }
    else if (direction === "prev" && activeTab >= 0) {
      setActiveTab((prev) => prev - 1);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setActiveTab(0);
    }
  }, [isOpen])

  return (
    <NxModal
      isOpen={isOpen}
      width={1000}
      header={"CONFIRMATION PAYMENT RELATION"}
      type={"confirmation"}
      hidePadding={{
        top: true,
      }}
      footer={[
        <div className={"w-full flex justify-between gap-x-4"} key={`footer-1`}>
          <ButtonComponent type={"menu"} onClick={() => handleCancel()}>
            Cancel
          </ButtonComponent>
          <div className="flex gap-x-2">
            <ButtonComponent type={"menu"} disabled={activeTab < 1} onClick={() => handleChangeTab("prev")}>
              Previous
            </ButtonComponent>
            {activeTab < (tabLength - 1)  && (
              <ButtonComponent type={"submit"} onClick={() => handleChangeTab("next")}>
                Next
              </ButtonComponent>
            )}
            {activeTab === (tabLength - 1) && (
              <ButtonComponent type={"submit"} form={formId} htmlType={"submit"} >
                {type === "submit" ? "Submit" : type === "draft" ? "Save as Draft" : ""}
              </ButtonComponent>
            )}
          </div>
        </div>,
      ]}
    >
      <ConfirmationModalTabs
        form={form}
        approvalData={approvalData}
        dataAttachment={dataAttachment}
        service={service}
        type={type}
        configApplication={configApplication}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </NxModal>
  )
}

export default ConfirmationModal;
