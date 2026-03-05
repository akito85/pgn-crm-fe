import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import RelationshipInfo from "../StepContents/InformationForm/RelationshipInfo";
import RelatedDetailCard from "../StepContents/InformationForm/RelatedDetailCard";
import RelationshipApproval from "../StepContents/ApprovalForm/RelationshipApproval";
import RelationshipAttachment from "../StepContents/AttachmentForm/RelationshipAttachment";

const ConfirmationModalTabs = ({
  form,
  hierarchyTableData,
  dataAttachment,
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
          <NxBaseContainer border header={"RELATIONSHIP INFORMATION"}>
            <RelatedDetailCard relatedDetails={relatedDetails} />
          </NxBaseContainer>
        </div>
      ),
    },
    {
      key: 1,
      label: "Approval",
      disabled,
      children: (
        <NxBaseContainer border header={"APPROVAL"}>
          <RelationshipApproval
            form={form}
            dataDetailApproval={hierarchyTableData}
            formView={false}
          />
        </NxBaseContainer>
      ),
    },
    {
      key: 2,
      label: "Attachment",
      disabled,
      children: (
        <NxBaseContainer border header={"ATTACHMENT"}>
          <RelationshipAttachment
            data={dataAttachment}
            service={service}
            configApplication={configApplication}
            type={"confirmation"}
          />
        </NxBaseContainer>
      ),
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      disabled,
      children: <ConfirmationModalRemark disabled={disabled} />,
    },
  ].filter(Boolean);

  return (
    <NxTabs
      items={tabOptions}
      onChange={setActiveTab}
      activeKey={activeTab}
    />
  );
};

export default ConfirmationModalTabs;
