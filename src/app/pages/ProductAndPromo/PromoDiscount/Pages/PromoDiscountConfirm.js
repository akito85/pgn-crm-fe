import React, { Fragment } from "react";
import PromoDiscountConfirmPromoSection from "./PromoDiscountConfirmPromoSection";
import PromoDiscountConfirmApprovalSection from "./PromoDiscountConfirmApprovalSection";
import AttachmentSectionForm from "../../Pricing/Form/AttachmentSectionForm";
import NxTabs from "../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";

const PromoDiscountConfirm = ({
  dataConfirm,
	listDataCriteria = [],
	criteriaValues = {},
	listCriteria=[],
	listDataCondition = [],
  dataApproval,
  dataApprovalTable,
  listApproval,
  listAttachment,
  activeTab,
  setActiveTab,
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Promo Discount",
      children: (
        <PromoDiscountConfirmPromoSection
          dataConfirm={dataConfirm}
          listDataCriteria={listDataCriteria}
          criteriaValues={criteriaValues}
          listCriteria={listCriteria}
          listDataCondition={listDataCondition}
        />
      ),
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <PromoDiscountConfirmApprovalSection
          dataApproval={dataApproval}
          dataApprovalTable={dataApprovalTable}
          listApproval={listApproval}
        />
      ),
    },
    {
      key: 2,
      label: "Attachment",
      children: (
      <NxBaseContainer border header="Attachment">
        <AttachmentSectionForm data={listAttachment} type={"preview"} />
      </NxBaseContainer>
    ),
    },
  ];

  return (
    <Fragment>
      <NxTabs items={tabOptions} onChange={setActiveTab} activeKey={activeTab} />
    </Fragment>
  );
};

export default PromoDiscountConfirm;
