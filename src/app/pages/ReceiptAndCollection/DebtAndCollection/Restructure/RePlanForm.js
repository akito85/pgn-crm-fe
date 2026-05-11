import React, { useState } from "react";
import AccountInfoSection from "./Form/AccountInfoSection";
import ServiceAgreementSection from "./Form/ServiceAgreementSection";
import ContactInfoSection from "./Form/ContactInfoSection";
import RePlanInfoSection from "./Form/RePlanInfoSection";
import OpenItemInfoSection from "./Form/OpenItemInfoSection";
import RePlanDetailSection from "./Form/RePlanDetailSection";

const RePlanForm = ({
    form,
    listAccount,
    handleAccountChange,
    disabled,
    openItems = [],
    onContactChange,
    onPlanDetailValidation,
    onInstallmentsChange,
    contactRef
}) => {
    const [planInfo, setPlanInfo] = useState({ type: null, tenor: null, startPeriod: null });

    return (
        <div className="flex flex-col gap-1">
            <AccountInfoSection 
                form={form}
                listAccount={listAccount}
                handleAccountChange={handleAccountChange}
                disabled={disabled}
            />
            <ServiceAgreementSection 
                form={form}
                disabled={disabled}
            />
            <ContactInfoSection 
                onContactsChange={onContactChange} 
                accountNumber={form.getFieldValue("accountNumber")}
                ref={contactRef}
            />
            <RePlanInfoSection 
                form={form}
                onPlanInfoChange={setPlanInfo}
            />
            <OpenItemInfoSection openItems={openItems} />
            <RePlanDetailSection 
                planInfo={planInfo} 
                openItems={openItems} 
                onValidationChange={onPlanDetailValidation}
                onInstallmentsChange={onInstallmentsChange}
            />
        </div>
    );
};

export default RePlanForm;
