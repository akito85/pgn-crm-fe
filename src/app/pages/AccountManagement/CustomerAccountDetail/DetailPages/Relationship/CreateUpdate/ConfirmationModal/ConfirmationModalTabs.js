import ConfirmationModalInfo from "./ConfirmationModalInfo";
import ConfirmationModalApproval from "./ConfirmationModalApproval";
import ConfirmationModalAttachment from "./ConfirmationModalAttachment";
import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";

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
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Relationship Information",
      children: <ConfirmationModalInfo form={form} relatedDetails={relatedDetails} />,
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <ConfirmationModalApproval
          form={form}
          dataTable={hierarchyTableData}
        />
      ),
    },
    {
      key: 2,
      label: "Attachment",
      children: (
        <ConfirmationModalAttachment
          data={dataAttachment}
          service={service}
          configApplication={configApplication}
        />
      ),
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      children: <ConfirmationModalRemark />,
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
