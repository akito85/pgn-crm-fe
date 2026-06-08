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
  isWaitingApproval,
  isApprover,
  hasMutations,
  mutationTotalData,
  mutationPage,
  mutationPageSize,
  onMutationPageChange,
  loadingMutation,
  loadingServiceAgreement,
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
        loading={loadingServiceAgreement}
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
        hasMutations={hasMutations}
      />
      <MutationInfoSection 
        mutationDataInfo={mutationDataInfo}
        columnMutation={columnMutation}
        setIsModalMutationOpen={setIsModalMutationOpen}
        handleEdit={handleMutationEdit}
        handleDelete={handleMutationDelete}
        isCreate={isCreate}
        disabled={isPartialEdit}
        isWaitingApproval={isWaitingApproval}
        isApprover={isApprover}
        mutationTotalData={mutationTotalData}
        mutationPage={mutationPage}
        mutationPageSize={mutationPageSize}
        onMutationPageChange={onMutationPageChange}
        loadingMutation={loadingMutation}
      />
    </div>
  );
};

export default WarrantyForm;
