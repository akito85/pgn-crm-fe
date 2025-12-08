import React, { useState } from "react";
import DigitalSignatureInfo from "./DigitalSignatureInfo";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../../components/RadioTabs";

const ConfirmationDigitalSignature = ({
  isOpen,
  data,
  uploadedSignatureFile,
  signatureFileId,
  selectedHierarchy,
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listAdditionalCode = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
}) => {
  // State
  const [valuePage, setValuePage] = useState("Digital Signature");

  const [tabPages, setTabPages] = useState([
    { value: "Digital Signature" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  // Rendering Section
  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Digital Signature":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"Digital Signature INFORMATION"}
            </p>
            <DigitalSignatureInfo
              data={data}
              uploadedSignatureFile={uploadedSignatureFile}
              signatureFileId={signatureFileId}
            />
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
              typeSelector="masterEfakturCode"
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"Digital Signature INFORMATION"}
            </p>
            <DigitalSignatureInfo
              data={data}
              uploadedSignatureFile={uploadedSignatureFile}
              signatureFileId={signatureFileId}
            />
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

export default ConfirmationDigitalSignature;
