import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import AttachmentSectionForm from "../StepContents/AttachmentForm/AttachmentPaymentRelation";
import ApprovalSectionForm from "../StepContents/ApprovalForm/ApprovalPaymentRelation";
import InfoPaymentRelation from "../StepContents/InformationForm/InfoPaymentRelation";

const ConfirmationModalTabs = ({
  form,
  approvalData,
  dataAttachment,
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
        <ApprovalSectionForm form={form} dataTable={approvalData} formView={false} />
      )
    },
    {
      key: 2,
      label: "Attachment",
      disabled,
      children: (
        <AttachmentSectionForm
          data={dataAttachment}
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
      children: <ConfirmationModalRemark disabled={disabled} />
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
