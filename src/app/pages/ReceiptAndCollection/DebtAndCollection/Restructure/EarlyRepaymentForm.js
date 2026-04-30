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
    onInstallmentsChange
}) => {
    const [planInfo, setPlanInfo] = useState({ type: null, tenor: null, startPeriod: null });
    const [installmentsByCurrency, setInstallmentsByCurrency] = useState({});

    // Mock an existing installment plan
    useEffect(() => {
        setInstallmentsByCurrency({
            "IDR": [
                { key: 1, periode: "Nov 2023", amount: "5000000" },
                { key: 2, periode: "Dec 2023", amount: "5000000" },
                { key: 3, periode: "Jan 2024", amount: "5000000" }
            ]
        });
    }, []);

    return (
        <div className="flex flex-col gap-1">
            <CardContainerNoBorder header="INSTALLMENT DETAIL" collapsible={true}>
                <ERAccountInfoSection data_detail={{}} />
                <div className="mt-4"></div>
                <ERInstallmentInfoSection 
                    form={form}
                    disabled={disabled}
                    onPlanInfoChange={setPlanInfo}
                />
            </CardContainerNoBorder>
            <ContactInfoSection onContactsChange={onContactChange} />
            <EREarlyRepaymentDetailSection installmentsByCurrency={installmentsByCurrency} />
            <EROpenItemInfoSection openItems={openItems} />
            <ERInstallmentCalculationDetailSection installmentsByCurrency={installmentsByCurrency} />
        </div>
    );
};

export default EarlyRepaymentForm;
