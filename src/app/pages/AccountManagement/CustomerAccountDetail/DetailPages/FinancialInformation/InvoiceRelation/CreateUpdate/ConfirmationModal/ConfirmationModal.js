import { useEffect, useState } from "react";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";

const ConfirmationModal = ({
  form,
  isOpen,
  handleCancel,
  selectedAppHierId,
  selectedApprovalName,
  hierarchyTableData,
  dataAttachment,
  type = "",
  data = {},
  service,
  configApplication,
}) => {
  const tabLength = type === "submit" ? 4 : 3;

  const [activeTab, setActiveTab] = useState(0);

  /**
   * @param {"next" | "prev"} type
   */
  const handleChangeTab = (type) => {
    if (type === "next" && activeTab < tabLength - 1) {
      setActiveTab((prev) => prev + 1);
    }
    else if (type === "prev" && activeTab >= 0) {
      setActiveTab((prev) => prev - 1);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setActiveTab(0);
    }
  }, [isOpen])

  return (
    <ModalCustom
      isOpen={isOpen}
      width={1000}
      header={"CONFIRMATION INVOICE RELATION"}
      type={"confirmation"}
      handleCancel={handleCancel}
      hideTopPadding
      footer={[
        <div className={"w-full justify-end flex gap-[20px]"} key={`footer-1`}>
          {activeTab > 0 ? (
            <ButtonComponent type={"default"} onClick={() => handleChangeTab("prev")}>
              Previous
            </ButtonComponent>
          ) : (
            <ButtonComponent type={"default"} onClick={handleCancel}>
              Cancel
            </ButtonComponent>
          )}
          {activeTab < (tabLength - 1)  && (
            <ButtonComponent type={"submit"} onClick={() => handleChangeTab("next")}>
              Next
            </ButtonComponent>
          )}
          {activeTab === (tabLength - 1) && (
            <ButtonComponent type={"submit"} form={form} htmlType={"submit"} >
              {type === "submit" ? "Submit" : type === "draft" ? "Save as Draft" : ""}
            </ButtonComponent>
          )}
        </div>,
      ]}
    >
      <ConfirmationModalTabs
        selectedAppHierId={selectedAppHierId}
        selectedApprovalName={selectedApprovalName}
        hierarchyTableData={hierarchyTableData}
        dataAttachment={dataAttachment}
        data={data}
        service={service}
        type={type}
        configApplication={configApplication}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </ModalCustom>
  )
}

export default ConfirmationModal;
