import PaymentRelationDetailInfo from "./PaymentRelationDetailInfo";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import { useState } from "react";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import { configApp } from "../../../../../../../../constants/configApp";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";

/**
 * Tabbed detail view for a payment relation record.
 * Renders "Payment Relation Information" and "Attachment" tabs.
 *
 * @param {object} props
 * @param {object} [props.detail={}]            - Payment relation detail record
 * @param {string} [props.subjectAccountNumber] - Account number of the subject account (used for conditional display)
 */
const PaymentRelationDetailTabs = ({ detail = {} }) => {
  const attachments = detail.attachments;

  const tabOptions = [
    {
      key: "pri",
      label: "Payment Relation Information",
      children: (
        <PaymentRelationDetailInfo
          detail={detail}
        />
      )
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

export default PaymentRelationDetailTabs;
