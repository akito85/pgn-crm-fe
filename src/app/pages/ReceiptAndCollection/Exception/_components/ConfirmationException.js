import React, { useState } from "react";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ExceptionInfo from "./ExceptionInfo";

const ConfirmationException = ({
  isOpen,
  kirimBody,
  dataBillingCycle = [],
  dataBillingPeriod = [],
  dataActivity = [],
  dataCriteriaOptions = [],
  selectedAccounts = [],
  criteriaData = [],
  appHierOptions = [],
  appHierDataDetail = [],
  listDataAttachment = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  isLoading = false,
}) => {
  const [valuePage, setValuePage] = useState("Exception");

  const tabPages = [
    { value: "Exception" },
    { value: "Approval" },
    { value: "Attachment" },
  ];

  const renderSection = () => {
    switch (valuePage) {
      case "Exception":
        return (
          <ExceptionInfo
            kirimBody={kirimBody}
            dataBillingCycle={dataBillingCycle}
            dataBillingPeriod={dataBillingPeriod}
            dataActivity={dataActivity}
            dataCriteriaOptions={dataCriteriaOptions}
            selectedAccounts={selectedAccounts}
            criteriaData={criteriaData}
            appHierOptions={appHierOptions}
          />
        );
      case "Approval":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              APPROVAL INFORMATION
            </p>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={
                (appHierOptions || []).find(
                  (opt) => opt.value === kirimBody?.appHierId
                )?.name || ""
              }
              dataTable={appHierDataDetail}
              selectedHierarchy={kirimBody?.appHierId}
            />
          </>
        );
      case "Attachment":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              ATTACHMENT INFORMATION
            </p>
            <AttachmentComponent
              type="preview"
              data={listDataAttachment}
              typeSelector="exception"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="Confirmation"
      width={1000}
      handleCancel={handleCancel}
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent type="default" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            onClick={handleConfirm}
            loading={isLoading}
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
      {renderSection()}
    </ModalCustom>
  );
};

export default ConfirmationException;
