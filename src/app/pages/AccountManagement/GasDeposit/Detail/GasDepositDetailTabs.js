import GasDepositDetailAttch from "./GasDepositDetailAttch";
import GasDepositDetailInfo from "./GasDepositDetailInfo";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import { useState } from "react";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";

const GasDepositDetailTabs = ({ detail = {} }) => {
  const attachments = detail.attachments;

  const tabOptions = [
    {
      key: "gdi",
      label: "Gas Deposit Information",
      children: <GasDepositDetailInfo detail={detail} />
    },
    {
      key: "attch",
      label: "Attachment",
      children: <GasDepositDetailAttch attachments={attachments} />
    }
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

export default GasDepositDetailTabs;
