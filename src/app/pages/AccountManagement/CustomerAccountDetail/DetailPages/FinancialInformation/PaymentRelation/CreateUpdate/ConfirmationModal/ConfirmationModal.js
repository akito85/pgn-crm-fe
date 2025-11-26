import { useEffect, useState } from "react";
import ModalConfirmationCreateUpdateApprovalPaymentRelationTabs from "./ConfirmationModalTabs";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";

const tabs = [
  { value: "Payment Relation Information" },
  { value: "Approval" },
  { value: "Attachment" },
];

const ModalConfirmationCreateUpdateApprovalPaymentRelation = ({
  dataSource,
  isOpen,
  handleCancel,
  handleOk,
  selectedHierarchy,
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
      console.log(tabs[currentTab + 1].value);
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
        <div className={"w-full justify-end flex gap-[20px]"}>
          {currentTab > 0 ? (
            <ButtonComponent type={"default"} onClick={() => handleChangeTab("prev")}>
              Previous
            </ButtonComponent>
          ) : (
            <ButtonComponent type={"default"} onClick={handleCancel}>
              Cancel
            </ButtonComponent>
          )}
          {currentTab < (tabs.length - 1)  ? (
            <ButtonComponent type={"submit"} onClick={() => handleChangeTab("next")}>
              Next
            </ButtonComponent>
          ) : (
            <ButtonComponent type={"submit"} onClick={handleOk}>
              Submit
            </ButtonComponent>
          )}
        </div>,
      ]}
    >
      <ModalConfirmationCreateUpdateApprovalPaymentRelationTabs
        options={tabs}
        handleChangeOption={handleDetailSection}
        section={typeDetailSection}
        selectedHierarchy={selectedHierarchy}
      />
    </ModalCustom>
  )
}

export default ModalConfirmationCreateUpdateApprovalPaymentRelation;