import { useState } from "react";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import RadioTabs from "../../../../../../components/RadioTabs";
import { configApp } from "../../../../../../constants/configApp";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import FunctionalCriteriaInvoiceTemplate from "../../InvoiceTemplate/Form/FunctionalCriteriaInvoiceTemplate";
import TaxCodeInfo from "../Utils/TaxCodeInfo";
import ConditionForm from "../Form/ConditionForm";

const ModalConfirmationTaxCode = ({
  isOpen,
  data,
  selectedHierarchy,
  apiCriteria = [],
  criteriaValues = [],
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listDataCriteria = [],
  listDataDetail = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
  dataCategory = [],
  isLoading = false,
}) => {
  const [valuePage, setValuePage] = useState("Tax Code");
  const [tabPages, setTabPages] = useState([
    { value: "Tax Code" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);
  const tabsTaxCodeDetail = [{ value: "Criteria" }, { value: "Condition" }];
  const [valuePageDetail, setValuePageDetail] = useState("Criteria");

  // Rendering Section
  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Tax Code":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"TAX CODE INFORMATION"}
            </p>
            <TaxCodeInfo
              data={data}
              dataCategory={dataCategory}
              apiCriteria={apiCriteria}
            />
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"CRITERIA INFORMATION"}
            </p>
            <RadioTabs
              data={tabsTaxCodeDetail}
              onChange={(e) => setValuePageDetail(e.target.value)}
              currentPosition={valuePageDetail}
            />
            <div
              className={`${valuePageDetail !== "Criteria" ? "hidden" : ""}`}
            >
              <FunctionalCriteriaInvoiceTemplate
                type={"preview"}
                data={listDataCriteria}
                dataCriteria={criteriaValues}
              />
            </div>
            <div
              className={`${valuePageDetail !== "Condition" ? "hidden" : ""}`}
            >
              <ConditionForm type={"preview"} data={listDataDetail} />
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
              typeSelector="tax_code"
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
            <TaxCodeInfo data={data} />

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

export default ModalConfirmationTaxCode;
