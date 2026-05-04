import React, { useState } from "react";
import GLAccountInfo from "./GLAccountInfo";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../../components/RadioTabs";

const ConfirmationGLAccount = ({
  isOpen,
  data,
  selectedHierarchy,
  listDataAppHierDetail = [],
  listDataAttachment = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
  isLoading = false,
}) => {
  // State
  const [valuePage, setValuePage] = useState("GL Account");

  const [tabPages, setTabPages] = useState([
    { value: "GL Account" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  // Rendering Section
  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "GL Account":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"GL ACCOUNT INFORMATION"}
            </p>
            <GLAccountInfo data={data} />
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
                )?.[0]?.name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy={selectedHierarchy}
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
              typeSelector="billing_bucket"
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"GL ACCOUNT INFORMATION"}
            </p>
            <GLAccountInfo data={data} />
          </div>
        );
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel} disabled={isLoading}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading}
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

export default ConfirmationGLAccount;
