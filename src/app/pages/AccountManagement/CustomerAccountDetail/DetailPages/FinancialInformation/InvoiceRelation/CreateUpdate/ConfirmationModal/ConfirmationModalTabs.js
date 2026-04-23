import NxTabs from "../../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../../../../components/Nx/NxAttachmentInput";
import NxApprovalInput from "../../../../../../../../../components/Nx/NxApprovalInput";
import InfoInvoiceRelation from "../StepContents/InformationForm/InfoInvoiceRelation";
import NxRemarkInput from "../../../../../../../../../components/Nx/NxRemarkIInput";

const ConfirmationModalTabs = ({
  form,
  approvalData,
  attachmentDataSource,
  service,
  type = "",
  configApplication,
  activeTab = 0,
  setActiveTab = () => {},
  disabled = false,
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Invoice Relation Information",
      children: <InfoInvoiceRelation form={form} formView={false} />,
      disabled,
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <NxApprovalInput form={form} hierarchyDetails={approvalData} formView={false} />
      ),
      disabled,
    },
    {
      key: 2,
      label: "Attachment",
      children: (
        <NxAttachmentInput
          data={attachmentDataSource}
          service={service}
          configApplication={configApplication}
          type={"confirmation"}
        />
      ),
      disabled,
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      children: <NxRemarkInput disabled={disabled} />,
      disabled,
    },
  ].filter(Boolean).map((tabOption) => ({
    ...tabOption,
    children:
      <NxBaseContainer border header={tabOption.label}>
        {tabOption.children}
      </NxBaseContainer>
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
