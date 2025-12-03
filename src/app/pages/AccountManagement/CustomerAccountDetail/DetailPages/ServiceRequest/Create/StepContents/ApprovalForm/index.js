import { useState } from "react";
import RadioTabs from "../../../../../../../../../components/RadioTabs";
import NxPanel from "../../../../../../../../../components/Nx/NxPanel";
import DetailText from "../../../../../../../../../components/DetailText";
import moment from "moment";

/**
 * Approval/Review step for Service Request
 */
export default function ApprovalForm({
  formData = {},
  account = {},
  customer = {},
  dropdowns = {},
  contactsData = [],
  prerequisitesData = [],
  attachmentsData = [],
}) {
  const [valuePage, setValuePage] = useState("Service Request");

  const tabPages = [
    { value: "Service Request" },
    { value: "Contact" },
    { value: "Pre-Requisite" },
  ];

  // Helper to get dropdown label from ID
  const getDropdownLabel = (dropdownKey, id) => {
    if (!dropdowns?.[dropdownKey]?.data || !id) return "-";
    const item = dropdowns[dropdownKey].data.find(
      (item) =>
        item.glbTypeValId?.toString() === id?.toString() ||
        item.id?.toString() === id?.toString(),
    );
    return item?.name || item?.glbTypeValName || id;
  };

  const accountInfo = account?.accountInformation || {};
  const accountSummary = account?.accountSummary || {};

  const renderServiceRequestSummary = () => (
    <>
      <NxPanel title="ACCOUNT INFORMATION">
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Account ID">
            {formData?.srFormAccountId || accountInfo?.accountId || "-"}
          </DetailText>
          <DetailText label="Account SOR">
            {formData?.srFormAccountSor || accountInfo?.sor || "-"}
          </DetailText>
          <DetailText label="Cost Center">
            {formData?.srFormAccountCostCenter ||
              accountSummary?.costCenter ||
              "-"}
          </DetailText>
          <DetailText label="Meter Reading Code">
            {formData?.srFormMeterReadingCode ||
              accountSummary?.meterReadingCodes ||
              "-"}
          </DetailText>
          <DetailText label="Account Segment">
            {formData?.srFormAccountSegment || accountInfo?.segment || "-"}
          </DetailText>
          <DetailText label="Account Group Type">
            {formData?.srFormAccountGroupType ||
              accountInfo?.accountGroupType ||
              "-"}
          </DetailText>
          <DetailText label="Account Type">
            {formData?.srFormAccountType || accountInfo?.accountType || "-"}
          </DetailText>
          <DetailText label="Premise Address">
            {formData?.srFormPremiseAddress || "-"}
          </DetailText>
        </div>
      </NxPanel>

      <NxPanel title="SERVICE REQUEST INFORMATION" className="mt-4">
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Service Request Reference">
            {formData?.srr || "-"}
          </DetailText>
          <DetailText label="Type">
            {getDropdownLabel("serviceRequestTypes", formData?.type)}
          </DetailText>
          <DetailText label="Category">
            {getDropdownLabel("serviceRequestCategories", formData?.category)}
          </DetailText>
          <DetailText label="Sub Category">
            {getDropdownLabel(
              "serviceRequestSubcategories",
              formData?.subCategory,
            )}
          </DetailText>
          <DetailText label="Channel">
            {getDropdownLabel("serviceRequestChannels", formData?.channel)}
          </DetailText>
          <DetailText label="Priority">
            {getDropdownLabel("serviceRequestPriorities", formData?.priority)}
          </DetailText>
          <DetailText label="Request Source">
            {getDropdownLabel("serviceRequestSources", formData?.requestSource)}
          </DetailText>
          <DetailText label="Request Date">
            {formData?.requestDate
              ? moment(formData.requestDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
        </div>
        <div className="w-full mt-3">
          <DetailText label="Description">
            {formData?.description || "-"}
          </DetailText>
        </div>
      </NxPanel>

      {formData?.srFormDataRequirements?.length > 0 && (
        <NxPanel title="DATA REQUIREMENTS" className="mt-4">
          <div className="w-full">
            {formData.srFormDataRequirements.map((req, index) => (
              <div key={index} className="grid grid-cols-2 gap-3 mb-2">
                <DetailText label="Type">{req.type || "-"}</DetailText>
                <DetailText label="Value">{req.value || "-"}</DetailText>
              </div>
            ))}
          </div>
        </NxPanel>
      )}
    </>
  );

  const renderContactSummary = () => (
    <NxPanel title="CONTACTS">
      {contactsData.length > 0 ? (
        <div className="w-full">
          {contactsData.map((contact, index) => (
            <div key={index} className="border-b pb-3 mb-3">
              <div className="grid grid-cols-3 gap-3">
                <DetailText label="Name">{contact.name || "-"}</DetailText>
                <DetailText label="Type">{contact.type || "-"}</DetailText>
                <DetailText label="Phone">{contact.phone || "-"}</DetailText>
                <DetailText label="Email">{contact.email || "-"}</DetailText>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No contacts added</p>
      )}
    </NxPanel>
  );

  const renderPrerequisiteSummary = () => (
    <NxPanel title="PRE-REQUISITES">
      {prerequisitesData.length > 0 ? (
        <div className="w-full">
          {prerequisitesData.map((prereq, index) => (
            <div key={index} className="border-b pb-3 mb-3">
              <div className="grid grid-cols-3 gap-3">
                <DetailText label="Type">{prereq.type || "-"}</DetailText>
                <DetailText label="Name">{prereq.name || "-"}</DetailText>
                <DetailText label="Description">
                  {prereq.description || "-"}
                </DetailText>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pre-requisites added</p>
      )}
    </NxPanel>
  );

  const renderContent = () => {
    switch (valuePage) {
      case "Service Request":
        return renderServiceRequestSummary();
      case "Contact":
        return renderContactSummary();
      case "Pre-Requisite":
        return renderPrerequisiteSummary();
      default:
        return renderServiceRequestSummary();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <span className="text-primary uppercase font-bold text-lg">
          REVIEW & APPROVAL
        </span>
        <p className="text-gray-600 mt-2">
          Please review the Service Request information, Contacts, and
          Pre-Requisites before proceeding to attachments.
        </p>
      </div>

      <RadioTabs
        data={tabPages}
        onChange={(e) => setValuePage(e.target.value)}
      />

      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
