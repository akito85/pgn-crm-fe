import ConfirmationModalInfo from "./ConfirmationModalInfo";
import ConfirmationModalApproval from "./ConfirmationModalApproval";
import ConfirmationModalAttachment from "./ConfirmationModalAttachment";
import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../../components/Nx/NxTabs";

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
      children: <ConfirmationModalInfo form={form} />
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <ConfirmationModalApproval
          dataTable={approvalData}
          form={form}
        />
      )
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
    />
  );
};

export default ConfirmationModalTabs;
