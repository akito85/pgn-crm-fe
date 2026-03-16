import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import NxModal from "../../../../../../../../../components/Nx/NxModal";
import { Button } from "antd";

const ConfirmationModal = ({
  form,
  formId,
  isOpen,
  handleCancel,
  approvalData,
  attachmentDataSource,
  type = "",
  service,
  configApplication,
  loading = false,
}) => {
  const tabLength = type === "submit" ? 4 : 3;

  const [activeTab, setActiveTab] = useState(0);

  const { loading_createUpdateIr } = useSelector((state) => state.invoiceRelation);

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
      title={"CONFIRMATION INVOICE RELATION"}
      type={"confirmation"}
      hidePadding={{
        top: true,
      }}
      loading={loading}
      footer={[
        <div className={"flex justify-between"} key={`footer-1`}>
          <Button type={"menu"} disabled={loading_createUpdateIr} onClick={() => handleCancel()}>
            Cancel
          </Button>
          <div className="flex">
            <Button disabled={loading_createUpdateIr || activeTab < 1} type={"menu"} onClick={() => handleChangeTab("prev")}>
              Previous
            </Button>
            {activeTab < (tabLength - 1)  && (
              <Button type={"submit"} disabled={loading_createUpdateIr} onClick={() => handleChangeTab("next")}>
                Next
              </Button>
            )}
            {activeTab === (tabLength - 1) && (
              <Button type={"submit"} form={formId} htmlType={"submit"} loading={loading_createUpdateIr}>
                {type === "submit" ? "Submit" : type === "draft" ? "Save as Draft" : ""}
              </Button>
            )}
          </div>
        </div>,
      ]}
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
