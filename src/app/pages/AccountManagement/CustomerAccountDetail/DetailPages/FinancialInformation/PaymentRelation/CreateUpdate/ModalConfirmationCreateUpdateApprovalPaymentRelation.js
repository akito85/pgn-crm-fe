import { useState } from "react";
import ModalConfirmationApproval from "../../../../../../../../components/Modal/ModalConfirmationApproval";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../../../utils";
import StatusComponent from "../../../../../../../../components/StatusComponent";
import ModalConfirmationCreateUpdateApprovalPaymentRelationTabs from "./ModalConfirmationCreateUpdateApprovalPaymentRelationTabs";
import { ModalConfirm } from "../../../../../../../../components/Modal/ModalPopUp";

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
    <ModalConfirm
      isOpen={isOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
      width={1000}
    >
      <ModalConfirmationCreateUpdateApprovalPaymentRelationTabs
        options={tabs}
        handleChangeOption={handleDetailSection}
        section={typeDetailSection}
      />
    </ModalConfirm>
  )
}

export default ModalConfirmationCreateUpdateApprovalPaymentRelation;