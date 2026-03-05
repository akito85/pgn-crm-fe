import React from "react";
import AccountInfoSection from "./AccountInfoSection";
import ServiceAgreementSection from "./ServiceAgreementSection";
import PaymentGuaranteeSection from "./PaymentGuaranteeSection";
import MutationInfoSection from "./MutationInfoSection";

const WarrantyForm = ({
  form,
  dataAccNumber,
  handleAccountChange,
  dataPaymentWarrantyPartner,
  dataPaymentWarrantyPartnerBranch,
  currencyDDL,
  rateTypeDDL,
  mutationDataInfo,
  columnMutation,
  setIsModalMutationOpen,
  dispatch,
  getPaymentWarrantyPartnerBranchList
}) => {
  return (
    <div className="flex flex-col gap-8 mt-8 pb-4">
      <AccountInfoSection 
        dataAccNumber={dataAccNumber} 
        handleAccountChange={handleAccountChange} 
      />
      <ServiceAgreementSection />
      <PaymentGuaranteeSection 
        form={form}
        dispatch={dispatch}
        dataPaymentWarrantyPartner={dataPaymentWarrantyPartner}
        dataPaymentWarrantyPartnerBranch={dataPaymentWarrantyPartnerBranch}
        currencyDDL={currencyDDL}
        rateTypeDDL={rateTypeDDL}
        getPaymentWarrantyPartnerBranchList={getPaymentWarrantyPartnerBranchList}
      />
      <MutationInfoSection 
        mutationDataInfo={mutationDataInfo}
        columnMutation={columnMutation}
        setIsModalMutationOpen={setIsModalMutationOpen}
      />
    </div>
  );
};

export default WarrantyForm;
