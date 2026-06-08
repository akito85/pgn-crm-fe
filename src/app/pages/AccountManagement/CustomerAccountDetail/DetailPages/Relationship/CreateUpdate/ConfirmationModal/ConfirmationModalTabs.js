import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApprovalInput from "../../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import RelationshipInfo from "../StepContents/InformationForm/RelationshipInfo";
import RelatedDetailCard from "../StepContents/InformationForm/RelatedDetailCard";
import NxRemarkInput from "../../../../../../../../components/Nx/NxRemarkIInput";

const ConfirmationModalTabs = ({
  form,
  approvalData,
  attachmentDataSource,
  service,
  type = "",
  configApplication,
  activeTab = 0,
  relatedDetails,
  setActiveTab = () => {},
  disabled = false,
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Relationship Information",
      disabled,
      children: (
        <div className="flex flex-col gap-y-4">
          <NxBaseContainer border header={"RELATIONSHIP INFORMATION"}>
            <RelationshipInfo form={form} formView={false} />
          </NxBaseContainer>
          <NxBaseContainer border header={"RELATED DETAIL"}>
            <RelatedDetailCard relatedDetails={relatedDetails} />
          </NxBaseContainer>
        </div>
      ),
    },
    {
      key: 1,
      label: "Approval",
      disabled,
      children: <NxApprovalInput form={form} hierarchyDetails={approvalData} formView={false} />,
    },
    {
      key: 2,
      label: "Attachment",
      disabled,
      children: (
        <NxAttachmentInput
          data={attachmentDataSource}
          service={service}
          configApplication={configApplication}
          type={"confirmation"}
        />
      ),
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      disabled,
      children: <NxRemarkInput disabled={disabled} />,
      required: true,
    },
  ]
    .filter(Boolean)
    .map((tab) => ({
      ...tab,
      children: tab.key === 0
        ? tab.children
        : (
          <NxBaseContainer border header={tab.label.toUpperCase()} required={tab.required}>
            {tab.children}
          </NxBaseContainer>
        ),
    }));

  return (
    <NxTabs
      items={tabOptions}
      onChange={setActiveTab}
      activeKey={activeTab}
    />
  );
};

export default ConfirmationModalTabs;
