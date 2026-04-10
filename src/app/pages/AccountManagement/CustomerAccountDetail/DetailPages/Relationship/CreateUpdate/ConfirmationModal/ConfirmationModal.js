import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import { Button } from "antd";

const ConfirmationModal = ({
  form,
  formId,
  isOpen,
  handleCancel = () => {},
  type = "",
  approvalData,
  attachmentDataSource,
  configApplication,
  service,
  relatedDetails,
  handleSubmitForm = () => {},
}) => {
  const { loading_createUpdateRelationship } = useSelector((state) => state.relationship);
  const tabLength = type === "submit" ? 4 : 3;
  const [activeTab, setActiveTab] = useState(0);

  const isSubmit = type === "submit";
  const isDraft = type === "draft";

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
      title={"CONFIRMATION RELATIONSHIP"}
      type={"confirmation"}
      loading={loading_createUpdateRelationship}
      hidePadding={{
        top: true,
      }}
      footer={[
        <div className={"flex justify-between"} key={`footer-1`}>
          <Button type={"menu"} disabled={loading_createUpdateRelationship} onClick={() => handleCancel()}>
            Cancel
          </Button>
          <div className="flex">
            <Button type={"menu"} disabled={loading_createUpdateRelationship || activeTab < 1} onClick={() => handleChangeTab("prev")}>
              Previous
            </Button>
            {activeTab < (tabLength - 1) && (
              <Button type={"submit"} disabled={loading_createUpdateRelationship} onClick={() => handleChangeTab("next")}>
                Next
              </Button>
            )}
            {activeTab === (tabLength - 1) && (
              <Button
                type={"submit"}
                form={formId}
                htmlType={isSubmit ? "submit" : "button"}
                onClick={isDraft ? handleSubmitForm : undefined}
                loading={loading_createUpdateRelationship}
              >
                Confirm
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
        relatedDetails={relatedDetails}
        setActiveTab={setActiveTab}
        disabled={loading_createUpdateRelationship}
      />
    </NxModal>
  );
};

export default ConfirmationModal;
