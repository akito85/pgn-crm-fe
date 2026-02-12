import ConfirmationModalInfo from "./ConfirmationModalInfo";
import ConfirmationModalApproval from "./ConfirmationModalApproval";
import ConfirmationModalAttachment from "./ConfirmationModalAttachment";
import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";

const ConfirmationModalTabs = ({
  hierarchyTableData,
  dataAttachment,
  values = {},
  service,
  type = "",
  configApplication,
  activeTab = 0,
  setActiveTab = () => {},
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Relationship Information",
      children: <ConfirmationModalInfo values={values} />,
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <ConfirmationModalApproval
          dataTable={hierarchyTableData}
          values={values}
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
