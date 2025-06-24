import React, { useState } from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import FunctionalCriteriaBillingBucket from "../Form/FunctionalCriteriaBillingBucket";
import BillingBucketDetailSectionForm from "./BillingBucketDetailSectionForm";
import BillingBucketInfo from "../Utils/BillingBucketInfo";

const ConfirmationBillingBucket = ({
  isOpen,
  data,
  selectedHierarchy,
  apiPriorityPeriod = [],
  apiCriteria = [],
  criteriaValues = [],
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listDataCriteria = [],
  listDataBI = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
}) => {
  // State
  const [valuePage, setValuePage] = useState("Billing Bucket");
  const [valuePageDetail, setValuePageDetail] = useState("Detail");

  const [tabPages, setTabPages] = useState([
    { value: "Billing Bucket" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);
  const [tabPagesDetail, setTabPagesDetail] = useState([
    { value: "Detail" },
    { value: "Criteria" },
  ]);

  // Rendering Section Detail
  const renderSectionDetail = (valuePageDetail) => {
    switch (valuePageDetail) {
      case "Detail":
        return (
          <div className="pt-[30px]">
            <BillingBucketDetailSectionForm
              type={"detail"}
              listDataBI={listDataBI}
            />
          </div>
        );
      case "Criteria":
        return (
          <div className="pt-[30px]">
            <FunctionalCriteriaBillingBucket
              type={"preview"}
              data={listDataCriteria}
              dataCriteria={criteriaValues}
            />
          </div>
        );

      default:
        return (
          <div className="pt-[30px]">
            <BillingBucketDetailSectionForm
              type={"detail"}
              listDataBI={listDataBI}
            />
          </div>
        );
    }
  };

  // Rendering Section
  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Billing Bucket":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"BILLING BUCKET INFORMATION"}
            </p>
            <BillingBucketInfo
              data={data}
              apiPriorityPeriod={apiPriorityPeriod}
              apiCriteria={apiCriteria}
            />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"BILLING BUCKET DETAIL INFORMATION"}
            </p>

            <RadioTabs
              data={tabPagesDetail}
              onChange={(e) => setValuePageDetail(e.target.value)}
              currentPosition={valuePageDetail}
            />
            {renderSectionDetail(valuePageDetail)}
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
              typeSelector="adjustmentBilling"
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"BILLING BUCKET INFORMATION"}
            </p>
            <BillingBucketInfo
              data={data}
              apiPriorityPeriod={apiPriorityPeriod}
              apiCriteria={apiCriteria}
            />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"BILLING BUCKET DETAIL INFORMATION"}
            </p>

            <RadioTabs
              data={tabPagesDetail}
              onChange={(e) => setValuePageDetail(e.target.value)}
              currentPosition={valuePageDetail}
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

export default ConfirmationBillingBucket;
