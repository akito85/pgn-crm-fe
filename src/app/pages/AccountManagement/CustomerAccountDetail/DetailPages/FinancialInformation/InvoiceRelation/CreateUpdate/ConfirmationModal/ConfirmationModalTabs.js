import { useState } from "react";
import ConfirmationModalInfo from "./ConfirmationModalInfo";
import ConfirmationModalApproval from "./ConfirmationModalApproval";
import ConfirmationModalAttachment from "./ConfirmationModalAttachment";
import ConfirmationModalRemark from "./ConfirmationModalRemark";
import { Tabs } from "antd";

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
      label: "Invoice Relation Information",
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
    <Tabs
      items={tabOptions}
      onChange={setActiveTab}
      activeKey={activeTab}
      className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-tab]:py-4 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
    />
  );
};

export default ConfirmationModalTabs;
