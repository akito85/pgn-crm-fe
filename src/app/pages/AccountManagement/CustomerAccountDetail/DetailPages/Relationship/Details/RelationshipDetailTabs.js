import RelationshipDetailInfo from "./RelationshipDetailInfo";
import { useState } from "react";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../../../components/Nx/NxTabs";
import NxAttachmentInput from "../../../../../../../components/Nx/NxAttachmentInput";
import { configApp } from "../../../../../../../constants/configApp";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";

const RelationshipDetailTabs = ({
  detail = {},
}) => {
  const { attachments } = detail;

  const tabOptions = [
    {
      key: "info",
      label: "Relationship Information",
      children: <RelationshipDetailInfo detail={detail} />,
    },
    {
      key: "attch",
      label: "Attachment",
      children: (
        <NxAttachmentInput
          data={attachments}
          type="detail"
          configApplication={configApp.ACCOUNT_SERVICE}
          service={accountManagementService}
        />
      ),
    },
  ];

  const [activeKey, setActiveKey] = useState(tabOptions[0]?.key || "");

  return (
    <NxCardContainer
      header={"DETAIL INFORMATION"}
      type="tabs"
      element={
        <NxTabs
          items={tabOptions}
          onChange={setActiveKey}
          activeKey={activeKey}
        />
      }
      hideChildren
      withoutPadding
    />
  );
};

export default RelationshipDetailTabs;
