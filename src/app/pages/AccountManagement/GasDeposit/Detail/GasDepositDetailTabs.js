import GasDepositDetailInfo from "./GasDepositDetailInfo";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import { useEffect, useMemo, useState } from "react";
import NxTabs from "../../../../../components/Nx/NxTabs";
import NxAttachmentInput from "../../../../../components/Nx/NxAttachmentInput";
import { configApp } from "../../../../../constants/configApp";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import GasDepositDetailTable from "../GasDepositDetailTable";

/**
 * Tabbed detail view for a gas deposit record.
 * Renders "Gas Deposit Information" and "Attachment" tabs.
 *
 * @param {object} props
 * @param {string} props.id                   - Gas deposit record ID
 * @param {object} props.detail               - Gas deposit detail record
 * @param {string} props.versionActiveKey     - Key of the currently viewed version tab ("ori" | "cur")
 * @param {string} props.versionOriginalKey   - Key representing the original (non-draft) version
 */
const GasDepositDetailTabs = ({ id, detail, versionActiveKey, versionOriginalKey }) => {
  const tabOptions = [
    {
      key: 0,
      label: "Gas Deposit Information",
    },
    {
      key: 1,
      label: "Attachment",
    }
  ];

  const firstTabKey = tabOptions[0].key;

  // --- State ---
  const [activeKey, setActiveKey] = useState(firstTabKey || 0);

  // --- Derived values ---
  const attachments = detail.attachments;

  const tabCards = useMemo(() => [
    [
      {
        title: "Gas Deposit Information",
        content: <GasDepositDetailInfo detail={detail} /> 
      },
      {
        title: "Gas Deposit Detail",
        content: versionActiveKey === versionOriginalKey ?
          <GasDepositDetailTable id={id} parentKey="detail_gasDeposit" /> :
          <GasDepositDetailTable id={id} parentKey="detailDraft_gasDeposit" />
      },
    ],
    [
      {
        content: <NxAttachmentInput
          data={attachments}
          type="detail"
          configApplication={configApp.ACCOUNT_SERVICE}
          service={accountManagementService}
        />
      }
    ]
  ], [detail, id, versionActiveKey, versionOriginalKey]);

  return (
    <NxCardContainer
      header={"DETAIL INFORMATION"}
      type="tabs"
      withoutPadding
    >
      <NxTabs
        items={tabOptions}
        onChange={setActiveKey}
        activeKey={activeKey}
      />
      <div className="flex flex-col gap-y-4 p-4">
        {tabCards[activeKey].map((card, index) => (
          <NxBaseContainer border header={card.title} key={`${activeKey}-${index}`}>
            {card.content}
          </NxBaseContainer>
        ))}
      </div>
    </NxCardContainer>
  );
};

export default GasDepositDetailTabs;
