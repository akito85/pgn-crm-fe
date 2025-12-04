import { useEffect, useState } from "react";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";

const tabs = [
  { value: "Payment Relation Information" },
  { value: "Approval" },
  { value: "Attachment" },
];

const ConfirmationModal = ({
  form,
  dataSource,
  isOpen,
  handleCancel,
  handleOk,
  selectedAppHierId,
  hieararchyOptionData,
  hierarchyTableData,
  dataAttachment,
  type = "",
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [typeDetailSection, setTypeDetailSection] = useState(tabs[currentTab].value);

  const handleDetailSection = (e) => {
    setTypeDetailSection(e.target.value);
    setCurrentTab(tabs.findIndex(tab => tab.value === e.target.value))
  };

  /**
   * @param {"next" | "prev"} type 
   */
  const handleChangeTab = (type) => {
    if (type === "next" && currentTab < (tabs.length -1)) {
      setTypeDetailSection(tabs[currentTab + 1].value);
      setCurrentTab(currentTab + 1);
    }
    else if (type === "prev" && currentTab >= 0) {
      setTypeDetailSection(tabs[currentTab - 1].value);
      setCurrentTab(currentTab - 1);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setTypeDetailSection(tabs[0].value);
      setCurrentTab(0);
    }
  }, [isOpen])

  return (
    <ModalCustom
      isOpen={isOpen}
      width={1000}
      header={"CONFIRMATION PAYMENT RELATION"}
      type={"confirmation"}
      handleCancel={handleCancel}
      footer={[
        <div className={"w-full justify-end flex gap-[20px]"} key={`footer-1`}>
          {currentTab > 0 ? (
            <ButtonComponent type={"default"} onClick={() => handleChangeTab("prev")}>
              Previous
            </ButtonComponent>
          ) : (
            <ButtonComponent type={"default"} onClick={handleCancel}>
              Cancel
            </ButtonComponent>
          )}
          {currentTab < (tabs.length - 1)  && (
            <ButtonComponent type={"submit"} onClick={() => handleChangeTab("next")}>
              Next
            </ButtonComponent>
          )}
          {currentTab === (tabs.length - 1) && (
            <ButtonComponent type={"submit"} form={form} htmlType={"submit"} >
              {type === "submit" ? "Submit" : type === "draft" ? "Save as Draft" : ""}
            </ButtonComponent>
          )}
        </div>,
      ]}
    >
      <ConfirmationModalTabs
        options={tabs}
        handleChangeOption={handleDetailSection}
        section={typeDetailSection}
        selectedAppHierId={selectedAppHierId}
        hierarchyTableData={hierarchyTableData}
        hieararchyOptionData={hieararchyOptionData}
        dataAttachment={dataAttachment}
      />
    </ModalCustom>
  )
}

export default ConfirmationModal;