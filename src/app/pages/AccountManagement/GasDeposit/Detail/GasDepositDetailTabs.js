import GasDepositDetailInfo from "./GasDepositDetailInfo";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import { useState } from "react";
import NxTabs from "../../../../../components/Nx/NxTabs";
import NxAttachmentInput from "../../../../../components/Nx/NxAttachmentInput";
import { configApp } from "../../../../../constants/configApp";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";

/**
 * Tabbed detail view for a gas deposit record.
 * Renders "Gas Deposit Information" and "Attachment" tabs.
 *
 * @param {object} props
 * @param {object} [props.detail={}] - Gas deposit detail record
 */
const GasDepositDetailTabs = ({ detail = {} }) => {
  // --- Derived values ---
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
      children: (
        <NxAttachmentInput
          data={attachments}
          type="detail"
          configApplication={configApp.ACCOUNT_SERVICE}
          service={accountManagementService}
        />
      )
    }
  ];

  const firstTabKey = tabOptions[0].key;

  // --- State ---
  const [activeKey, setActiveKey] = useState(firstTabKey || "");

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
