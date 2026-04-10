import { useEffect, useState } from "react";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import { Button } from "antd";
import { useSelector } from "react-redux";

const ConfirmationModal = ({
  form,
  formId,
  isOpen,
  handleCancel = () => {},
  approvalData,
  attachmentDataSource,
  type = "",
  service,
  configApplication,
  loading = false,
  handleSubmitForm = () => {},
}) => {
  const tabLength = type === "submit" ? 4 : 3;

  const [activeTab, setActiveTab] = useState(0);

  const { loading_createUpdateMd } = useSelector((state) => state.multiDestination);

  const isSubmit = type === "submit";
  const isDraft = type === "draft";

  /**
   * @param {"next" | "prev"} direction
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
      title={"CONFIRMATION MULTI DESTINATION"}
      type={"confirmation"}
      hidePadding={{
        top: true,
      }}
      footer={[
        <div className={"flex justify-between"} key={`footer-1`}>
          <Button type={"menu"} disabled={loading_createUpdateMd} onClick={() => handleCancel()}>
            Cancel
          </Button>
          <div className="flex">
            <Button type={"menu"} disabled={loading_createUpdateMd || activeTab < 1} onClick={() => handleChangeTab("prev")} >
              Previous
            </Button>
            {activeTab < (tabLength - 1) && (
              <Button type={"submit"} disabled={loading_createUpdateMd} onClick={() => handleChangeTab("next")}>
                Next
              </Button>
            )}
            {activeTab === (tabLength - 1) && (
              <Button type={"submit"} form={formId} htmlType={isSubmit ? "submit" : "button"} onClick={isDraft ? handleSubmitForm : undefined} loading={loading_createUpdateMd}>
                Confirm
              </Button>
            )}
          </div>
        </div>,
      ]}
      loading={loading}
    >
      <ConfirmationModalTabs
        form={form}
        approvalData={approvalData}
        attachmentDataSource={attachmentDataSource}
        service={service}
        type={type}
        configApplication={configApplication}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disabled={loading}
      />
    </NxModal>
  )
}

export default ConfirmationModal;
