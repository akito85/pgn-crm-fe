import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApprovalInput from "../../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import InfoMultiDestination from "../StepContents/InformationForm/InfoMultiDestination";
import NxRemarkInput from "../../../../../../../../components/Nx/NxRemarkIInput";

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
      label: "Multi Destination Information",
      children: <InfoMultiDestination form={form} formView={false} />,
      disabled,
    },
    {
      key: 1,
      label: "Approval",
      children: <NxApprovalInput form={form} hierarchyDetails={approvalData} formView={false} />,
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
      required: true,
    },
  ]
    .filter(Boolean)
    .map((tabOption) => ({
      ...tabOption,
      children: (
        <NxBaseContainer border header={tabOption.label} required={tabOption.required}>
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
