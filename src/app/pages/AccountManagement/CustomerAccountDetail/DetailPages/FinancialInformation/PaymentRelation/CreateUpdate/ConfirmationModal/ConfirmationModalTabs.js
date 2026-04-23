import NxTabs from "../../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxApprovalInput from "../../../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../../../components/Nx/NxAttachmentInput";
import InfoPaymentRelation from "../StepContents/InformationForm/InfoPaymentRelation";
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
      label: "Payment Relation Information",
      disabled,
      children: <InfoPaymentRelation form={form} formView={false} />
    },
    {
      key: 1,
      label: "Approval",
      disabled,
      children: (
        <NxApprovalInput form={form} hierarchyDetails={approvalData} formView={false} />
      )
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
      )
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      disabled,
      children: <NxRemarkInput disabled={disabled} />,
      required: true
    },
  ].filter(Boolean).map((tabOption) => ({
    ...tabOption,
    children:
      <NxBaseContainer border header={tabOption.label} required={tabOption.required}>
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
