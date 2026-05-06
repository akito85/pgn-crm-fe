import React, { useState, useEffect } from "react";
import ERAccountInfoSection from "./Form/ERAccountInfoSection";
import ContactInfoSection from "./Form/ContactInfoSection";
import ERInstallmentInfoSection from "./Form/ERInstallmentInfoSection";
import EROpenItemInfoSection from "./Form/EROpenItemInfoSection";
import EREarlyRepaymentDetailSection from "./Form/EREarlyRepaymentDetailSection";
import ERInstallmentCalculationDetailSection from "./Form/ERInstallmentCalculationDetailSection";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";

const EarlyRepaymentForm = ({
    form,
    dataAccNumber,
    handleAccountChange,
    disabled,
    openItems = [],
    onContactChange,
    onPlanDetailValidation,
    onInstallmentsChange,
    onInstallmentDetailIdsChange,
    data_detail,
    contacts = [],
    installmentsByCurrency = {}
}) => {
    const [planInfo, setPlanInfo] = useState({ type: null, tenor: null, startPeriod: null });

    return (
        <div className="flex flex-col gap-1">
            <CardContainerNoBorder header="INSTALLMENT DETAIL" collapsible={true}>
                <ERAccountInfoSection data_detail={data_detail} />
                <div className="mt-4"></div>
                <ERInstallmentInfoSection 
                    form={form}
                    disabled={disabled}
                    onPlanInfoChange={setPlanInfo}
                />
            </CardContainerNoBorder>
            <ContactInfoSection initialContacts={contacts} onContactsChange={onContactChange} />
            <EREarlyRepaymentDetailSection 
                installmentsByCurrency={installmentsByCurrency} 
                onInstallmentDetailIdsChange={onInstallmentDetailIdsChange}
            />
            <EROpenItemInfoSection openItems={openItems} />
            <ERInstallmentCalculationDetailSection installmentsByCurrency={installmentsByCurrency} />
        </div>
    );
};

export default EarlyRepaymentForm;
