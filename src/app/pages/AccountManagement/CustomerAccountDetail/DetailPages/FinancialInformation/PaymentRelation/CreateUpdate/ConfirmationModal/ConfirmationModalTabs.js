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
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Payment Relation Information",
      children: <InfoPaymentRelation form={form} formView={false} />
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <ApprovalSectionForm form={form} dataTable={approvalData} formView={false} />
      )
    },
    {
      key: 2,
      label: "Attachment",
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
      children: <ConfirmationModalRemark />
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
