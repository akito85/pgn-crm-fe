import { useState } from "react";
import ModalConfirmationApproval from "../../../../../../../../components/Modal/ModalConfirmationApproval";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../../../utils";
import StatusComponent from "../../../../../../../../components/StatusComponent";
import ModalConfirmationCreateUpdateApprovalPaymentRelationTabs from "./ModalConfirmationCreateUpdateApprovalPaymentRelationTabs";
import { ModalConfirm } from "../../../../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";

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
  getColumnSearchProps,
}) => {
  const [typeDetailSection, setTypeDetailSection] = useState(tabs[0].value);

  const handleDetailSection = (e) => {
    setTypeDetailSection(e.target.value);
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      width={1000}
      header={"CONFIRMATION PAYMENT RELATION"}
      type={"confirmation"}
      footer={[
        <div className={"w-full justify-end flex gap-[20px]"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent type={"submit"} onClick={handleOk}>
            Next
          </ButtonComponent>
        </div>,
      ]}
    >
      <ModalConfirmationCreateUpdateApprovalPaymentRelationTabs
        options={tabs}
        handleChangeOption={handleDetailSection}
        section={typeDetailSection}
      />
    </ModalCustom>
  )
}

export default ModalConfirmationCreateUpdateApprovalPaymentRelation;