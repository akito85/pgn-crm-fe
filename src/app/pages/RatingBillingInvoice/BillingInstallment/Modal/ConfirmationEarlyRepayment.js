import React, { useState } from "react";
import { Form, Input, Table } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";

const { TextArea } = Input;

const ConfirmationEarlyRepayment = ({
  visible = false,
  data = {},
  selectedHierarchy,
  listDataAppHierDetail = [],
  listDataAttachment = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
  isSubmit = false,
}) => {
  const [valuePage, setValuePage] = useState("Early Repayment");

  const [tabPages, setTabPages] = useState([
    { value: "Early Repayment" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Early Repayment":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"EARLY REPAYMENT INFORMATION"}
            </p>
            <div className="w-full grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-gray-500 text-xs">Source</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.source || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Request Date</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.requestDate || "-"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs">Reason</p>
                <p className="text-gray-800 text-sm font-medium">
                  {data.reason || "-"}
                </p>
              </div>
            </div>
          </div>
        );
      case "Approval":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"APPROVAL INFORMATION"}
            </p>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).filter(
                  (data) => data.value === selectedHierarchy
                )?.[0].name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy
            />
          </>
        );
      case "Attachment":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ATTACHMENT INFORMATION"}
            </p>
            <AttachmentComponent
              type={"preview"}
              data={listDataAttachment}
              typeSelector="installment"
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"EARLY REPAYMENT INFORMATION"}
            </p>
          </div>
        );
    }
  };

  return (
    <ModalCustom
      isOpen={visible}
      type={"confirmation"}
      header={"confirmation"}
      width={800}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      footer={
        <div className={"w-full flex justify-end gap-2"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <RadioTabs
        data={tabPages}
        onChange={(e) => setValuePage(e.target.value)}
        currentPosition={valuePage}
      />
      {renderSection(valuePage)}
    </ModalCustom>
  );
};

export default ConfirmationEarlyRepayment;
