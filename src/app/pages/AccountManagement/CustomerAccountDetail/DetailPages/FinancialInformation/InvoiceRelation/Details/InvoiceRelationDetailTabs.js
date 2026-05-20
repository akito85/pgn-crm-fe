import InvoiceRelationDetailInfo from "./InvoiceRelationDetailInfo";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import { useState } from "react";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import { configApp } from "../../../../../../../../constants/configApp";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";

/**
 * Tabbed detail view for an invoice relation record.
 * Renders "Invoice Relation Information" and "Attachment" tabs.
 *
 * @param {object} props
 * @param {object} [props.detail={}] - Invoice relation detail record
 */
const InvoiceRelationDetailTabs = ({
  detail = {},
}) => {
  const attachments = detail.attachments;

  const tabOptions = [
    {
      key: "iri",
      label: "Invoice Relation Information",
      children: (
        <InvoiceRelationDetailInfo
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

export default InvoiceRelationDetailTabs;
