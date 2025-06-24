import { Fragment } from "react";
import React from "react";
import { useState } from "react";
import RadioTabs from "../../../../../../components/RadioTabs";
import BillingItemFormConfirmation from "./tab/BillingItemFormConfirmation";
import BillingItemApprovalConfirmation from "./tab/BillingItemApprovalConfirmation";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

const listDetailPage = [
  { value: "Billing Item" },
  { value: "Approval" },
  { value: "Attachment" },
];

const BillingItemConfirmation = ({
  dataConfirm = {},
  dataTable = [],
  allData = [],
  dataApproval = {},
  dataApprovalTable = [],
  dataAttachment = [],
  listApproval = [],
}) => {
  const [detailPage, setDetailPage] = useState(listDetailPage[0].value);

  const handleDetailPage = (e) => {
    setDetailPage(e.target.value);
  };

  const renderSection = () => {
    switch (detailPage) {
      case listDetailPage[0].value:
        return (
          <BillingItemFormConfirmation
            dataConfirm={dataConfirm}
            dataTable={dataTable}
            allData={allData}
          />
        );
      case listDetailPage[1].value:
        return (
          <BillingItemApprovalConfirmation
            dataApproval={dataApproval}
            dataApprovalTable={dataApprovalTable}
            listApproval={listApproval}
          />
        );
      default:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
              {"ATTACHMENT INFORMATION"}
            </div>
            {/* no need to add config app or service since confirmation cannot be edited or showed */}
            <AttachmentSectionForm type={"preview"} data={dataAttachment} />
          </>
        );
    }
  };

  return (
    <Fragment>
      <div className="mt-5">
        <RadioTabs data={listDetailPage} onChange={handleDetailPage} />
      </div>
      <div className={"w-full"}>{renderSection()}</div>
    </Fragment>
  );
};

export default BillingItemConfirmation;
