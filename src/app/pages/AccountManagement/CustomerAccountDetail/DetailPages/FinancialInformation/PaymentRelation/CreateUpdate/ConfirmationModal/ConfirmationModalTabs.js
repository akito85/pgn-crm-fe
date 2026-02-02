import ConfirmationModalInfo from "./ConfirmationModalInfo";
import ConfirmationModalApproval from "./ConfirmationModalApproval";
import ConfirmationModalAttachment from "./ConfirmationModalAttachment";
import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../../components/Nx/NxTabs";

const ConfirmationModalTabs = ({
  selectedAppHierId,
  selectedApprovalName,
  hierarchyTableData,
  dispatch,
  dataAttachment,
  data = {},
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
      children: <ConfirmationModalInfo data={data} />
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <ConfirmationModalApproval
          dataTable={hierarchyTableData}
          selectedAppHierId={selectedAppHierId}
          selectedApprovalName={selectedApprovalName}
        />
      )
    },
    {
      key: 2,
      label: "Attachment",
      children: (
        <ConfirmationModalAttachment
          data={dataAttachment}
          dispatch={dispatch}
          service={service}
          configApplication={configApplication}
        />
      )
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      children: <ConfirmationModalRemark />
    },
  ].filter(Boolean);

  return (
    <NxTabs
      items={tabOptions}
      onChange={setActiveTab}
      activeKey={activeTab}
      forModal
    />
  );
};

export default ConfirmationModalTabs;
