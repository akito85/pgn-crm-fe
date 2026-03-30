import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import NxModal from "../../../../../components/Nx/NxModal";
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
  detail,
  handleSubmitForm = () => {},
}) => {
  const tabLength = type === "submit" ? 4 : 3;

  const [activeTab, setActiveTab] = useState(0);

  const { loading_recalculateExpireGd } = useSelector((state) => state.gasDeposit);

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
      title={"CONFIRMATION GAS DEPOSIT"}
      type={"confirmation"}
      hidePadding={{
        top: true,
      }}
      loading={loading}
      footer={[
        <div className={"flex justify-between"} key={`footer-1`}>
          <Button type={"menu"} disabled={loading_recalculateExpireGd} onClick={() => handleCancel()}>
            Cancel
          </Button>
          <div className="flex">
            <Button disabled={loading_recalculateExpireGd || activeTab < 1} type={"menu"} onClick={() => handleChangeTab("prev")}>
              Previous
            </Button>
            {activeTab < (tabLength - 1) && (
              <Button type={"submit"} disabled={loading_recalculateExpireGd} onClick={() => handleChangeTab("next")}>
                Next
              </Button>
            )}
            {activeTab === (tabLength - 1) && (
              <Button type={"submit"} form={formId} htmlType={isSubmit ? "submit" : "button"} onClick={isDraft ? handleSubmitForm : undefined} loading={loading_recalculateExpireGd}>
                Confirm
              </Button>
            )}
          </div>
        </div>,
      ]}
    >
      <ConfirmationModalTabs
        form={form}
        detail={detail}
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
