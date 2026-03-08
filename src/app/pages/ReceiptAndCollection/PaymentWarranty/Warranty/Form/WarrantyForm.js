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
  getPaymentWarrantyPartnerBranchList,
  dataServiceAgreement,
  handleMutationEdit,
  handleMutationDelete,
  isCreate,
  warrantyType,
  headerCurrency,
  isPartialEdit,
  isApprover
}) => {
  return (
    <div className="flex flex-col gap-8 mt-8 pb-4">
      <AccountInfoSection 
        form={form}
        dataAccNumber={dataAccNumber} 
        handleAccountChange={handleAccountChange} 
        disabled={isPartialEdit}
      />
      <ServiceAgreementSection 
        form={form}
        dataServiceAgreement={dataServiceAgreement}
        disabled={isPartialEdit}
      />
      <PaymentGuaranteeSection 
        form={form}
        dispatch={dispatch}
        dataPaymentWarrantyPartner={dataPaymentWarrantyPartner}
        dataPaymentWarrantyPartnerBranch={dataPaymentWarrantyPartnerBranch}
        currencyDDL={currencyDDL}
        rateTypeDDL={rateTypeDDL}
        getPaymentWarrantyPartnerBranchList={getPaymentWarrantyPartnerBranchList}
        isPartialEdit={isPartialEdit}
      />
      <MutationInfoSection 
        mutationDataInfo={mutationDataInfo}
        columnMutation={columnMutation}
        setIsModalMutationOpen={setIsModalMutationOpen}
        handleEdit={handleMutationEdit}
        handleDelete={handleMutationDelete}
        isCreate={isCreate}
        disabled={isPartialEdit}
        isApprover={isApprover}
      />
    </div>
  );
};

export default WarrantyForm;
