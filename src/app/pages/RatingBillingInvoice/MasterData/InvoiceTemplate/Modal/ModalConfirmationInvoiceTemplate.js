import React, { useState } from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import InvoiceTemplateInfo from "../Utils/InvoiceTemplateInfo";
import FunctionalCriteriaInvoiceTemplate from "../Form/FunctionalCriteriaInvoiceTemplate";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../../constants/configApp";

const ModalConfirmationInvoiceTemplate = ({
  isOpen,
  data,
  selectedHierarchy,
  apiInvoiceType = [],
  apiMeterai = [],
  apiSignature = [],
  apiTemplate = [],
  apiCriteria = [],
  criteriaValues = [],
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listDataCriteria = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
  isLoading = false,
}) => {
  // State
  const [valuePage, setValuePage] = useState("Invoice Template");
  const [tabPages, setTabPages] = useState([
    { value: "Invoice Template" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  // Rendering Section
  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Invoice Template":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"INVOICE TEMPLATE INFORMATION"}
            </p>
            <InvoiceTemplateInfo
              data={data}
              apiInvoiceType={apiInvoiceType}
              apiMeterai={apiMeterai}
              apiSignature={apiSignature}
              apiTemplate={apiTemplate}
              apiCriteria={apiCriteria}
            />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"CRITERIA INFORMATION"}
            </p>

            <FunctionalCriteriaInvoiceTemplate
              type={"preview"}
              data={listDataCriteria}
              dataCriteria={criteriaValues}
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
              typeSelector="invoice_template"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"INVOICE TEMPLATE INFORMATION"}
            </p>
            <InvoiceTemplateInfo data={data} />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"CRITERIA INFORMATION"}
            </p>

            <FunctionalCriteriaInvoiceTemplate
              type={"preview"}
              data={listDataCriteria}
              dataCriteria={criteriaValues}
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

export default ModalConfirmationInvoiceTemplate;
