import MultiDestinationDetailAttch from "./MultiDestinationDetailAttch";
import MultiDestinationDetailInfo from "./MultiDestinationDetailInfo";
import { useState } from "react";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../../../components/Nx/NxTabs";

/**
 * Tabbed detail view for a multi destination record.
 * Renders "Multi Destination Information" and "Attachment" tabs.
 *
 * @param {object} props
 * @param {object} [props.detail={}] - Multi destination detail record
 */
const MultiDestinationDetailTabs = ({
  detail = {},
}) => {
  const attachments = detail.attachments;

  const tabOptions = [
    {
      key: "mdi",
      label: "Multi Destination Information",
      children: (
        <MultiDestinationDetailInfo
          detail={detail}
        />
      )
    },
    {
      key: "attch",
      label: "Attachment",
      children: (
        <MultiDestinationDetailAttch
          attachments={attachments}
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
