import React, { useState, useEffect } from "react";
import AccountInfoSection from "./Form/AccountInfoSection";
import ServiceAgreementSection from "./Form/ServiceAgreementSection";
import ContactInfoSection from "./Form/ContactInfoSection";
import PaymentPlanInfoSection from "./Form/PaymentPlanInfoSection";
import OpenItemInfoSection from "./Form/OpenItemInfoSection";
import PaymentPlanDetailSection from "./Form/PaymentPlanDetailSection";

const RestructureForm = ({
    form,
    dataAccNumber,
    handleAccountChange,
    disabled,
    openItems = [],
    onContactChange,
    onPlanDetailValidation,
    onInstallmentsChange
}) => {
    const [planInfo, setPlanInfo] = useState({ type: null, tenor: null, startPeriod: null });

    return (
        <div className="flex flex-col gap-1">
            <AccountInfoSection 
                form={form}
                dataAccNumber={dataAccNumber}
                handleAccountChange={handleAccountChange}
                disabled={disabled}
            />
            <ServiceAgreementSection 
                form={form}
                disabled={disabled}
            />
            <ContactInfoSection onContactsChange={onContactChange} />
            <PaymentPlanInfoSection 
                form={form}
                disabled={disabled}
                onPlanInfoChange={setPlanInfo}
            />
            <OpenItemInfoSection openItems={openItems} />
            <PaymentPlanDetailSection 
                planInfo={planInfo} 
                openItems={openItems} 
                onValidationChange={onPlanDetailValidation}
                onInstallmentsChange={onInstallmentsChange}
            />
        </div>
    );
};

export default RestructureForm;
