import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import AttachmentSectionForm from "../StepContents/AttachmentForm/AttachmentMultiDestination";
import ApprovalSectionForm from "../StepContents/ApprovalForm/ApprovalMultiDestination";
import InfoMultiDestination from "../StepContents/InformationForm/InfoMultiDestination";

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
      label: "Multi Destination Information",
      children: <InfoMultiDestination form={form} formView={false} />,
      disabled,
    },
    {
      key: 1,
      label: "Approval",
      children: <ApprovalSectionForm form={form} dataTable={approvalData} formView={false} />,
      disabled,
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
      ),
      disabled,
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      children: <ConfirmationModalRemark disabled={disabled} />,
      disabled,
    },
  ]
    .filter(Boolean)
    .map((tabOption) => ({
      ...tabOption,
      children: (
        <NxBaseContainer border header={tabOption.label}>
          {tabOption.children}
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
