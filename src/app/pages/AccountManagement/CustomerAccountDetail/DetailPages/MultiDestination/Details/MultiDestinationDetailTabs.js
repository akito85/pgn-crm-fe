import MultiDestinationDetailAttch from "./MultiDestinationDetailAttch";
import MultiDestinationDetailInfo from "./MultiDestinationDetailInfo";
import { useState } from "react";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../../../components/Nx/NxTabs";

const MultiDestinationDetailTabs = ({
  subjectAccountNumber,
  idMd = 0,
  dataDetail = {},
  dispatch = () => {},
}) => {
  // Use provided options or fall back to default tabs
  const tabOptions = [
    {
      key: "mdi",
      label: "Multi Destination Information",
      children: (
        <MultiDestinationDetailInfo
          subjectAccountNumber={subjectAccountNumber}
          dataDetail={dataDetail}
        />
      )
    },
    {
      key: "attch",
      label: "Attachment",
      children: (
        <MultiDestinationDetailAttch
          idMd={idMd}
          dispatch={dispatch}
        />
      )
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
    >
    </NxCardContainer>
  );
};

export default MultiDestinationDetailTabs;
