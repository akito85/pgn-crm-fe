import React, { Fragment, useEffect, useState } from "react";
import PromoDiscountConfirmPromoSection from "./PromoDiscountConfirmPromoSection";
import PromoDiscountConfirmApprovalSection from "./PromoDiscountConfirmApprovalSection";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentSectionForm from "../../Pricing/Form/AttachmentSectionForm";

const PromoDiscountConfirm = ({
  dataConfirm,
  listDataCriteria = [],
  criteriaValues = {},
  listCriteria = [],
  listDataCondition = [],
  dataApproval,
  dataApprovalTable,
  listApproval,
  listAttachment,
}) => {
  const [valuePage, setValuePage] = useState("Promo Discount");
  const [promoDiscountDetail, setPromoDiscountDetail] = useState([
    { value: "Promo Discount" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  const renderSection = () => {
    switch (valuePage) {
      case "Promo Discount":
        return (
          <PromoDiscountConfirmPromoSection
            dataConfirm={dataConfirm}
            listDataCriteria={listDataCriteria}
            criteriaValues={criteriaValues}
            listCriteria={listCriteria}
            listDataCondition={listDataCondition}
          />
        );
      case "Approval":
        return (
          <PromoDiscountConfirmApprovalSection
            dataApproval={dataApproval}
            dataApprovalTable={dataApprovalTable}
            listApproval={listApproval}
          />
        );
      case "Attachment":
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
              {"ATTACHMENT INFORMATION"}
            </div>
            <AttachmentSectionForm data={listAttachment} type={"preview"} />
          </>
        );

      default:
        return <></>;
    }
  };

  return (
    <Fragment>
      <div className="mt-5">
        <RadioTabs
          data={promoDiscountDetail}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />
      </div>
      <div className={"w-full"}>{renderSection()}</div>
    </Fragment>
  );
};

export default PromoDiscountConfirm;
