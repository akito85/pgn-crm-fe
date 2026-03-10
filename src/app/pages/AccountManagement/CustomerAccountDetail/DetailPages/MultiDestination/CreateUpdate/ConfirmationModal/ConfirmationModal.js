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
  dataAttachment,
  type = "",
  service,
  configApplication,
  loading = false,
}) => {
  const tabLength = type === "submit" ? 4 : 3;

  const [activeTab, setActiveTab] = useState(0);

  const { loading_createUpdateMd } = useSelector((state) => state.multiDestination);

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
      header={"CONFIRMATION MULTI DESTINATION"}
      type={"confirmation"}
      hidePadding={{
        top: true,
      }}
      footer={[
        <div className={"w-full flex justify-between gap-x-4"} key={`footer-1`}>
          <Button type={"menu"} disabled={loading_createUpdateMd} onClick={() => handleCancel()}>
            Cancel
          </Button>
          <div className="flex gap-x-2">
            <Button type={"menu"} disabled={loading_createUpdateMd || activeTab < 1} onClick={() => handleChangeTab("prev")} >
              Previous
            </Button>
            {activeTab < (tabLength - 1) && (
              <Button type={"submit"} disabled={loading_createUpdateMd} onClick={() => handleChangeTab("next")}>
                Next
              </Button>
            )}
            {activeTab === (tabLength - 1) && (
              <Button type={"submit"} form={formId} htmlType={"submit"} loading={loading_createUpdateMd}>
                {type === "submit" ? "Submit" : type === "draft" ? "Save as Draft" : ""}
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
        dataAttachment={dataAttachment}
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
