import RelationshipDetailAttch from "./RelationshipDetailAttch";
import RelationshipDetailInfo from "./RelationshipDetailInfo";
import { useState } from "react";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../../../components/Nx/NxTabs";

const RelationshipDetailTabs = ({
  idAccount = 0,
  idRelationship = 0,
  dataDetail = {},
  dispatch = () => {},
}) => {
  const tabOptions = [
    {
      key: "info",
      label: "Relationship Information",
      children: <RelationshipDetailInfo dataDetail={dataDetail} />,
    },
    {
      key: "attch",
      label: "Attachment",
      children: (
        <RelationshipDetailAttch
          idAccount={idAccount}
          idRelationship={idRelationship}
          dispatch={dispatch}
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
