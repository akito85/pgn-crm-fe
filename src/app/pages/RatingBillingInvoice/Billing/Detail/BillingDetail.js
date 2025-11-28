import React, { useState, useEffect, useRef } from "react";
import { Radio } from "antd";
import BillingItemTab from "./BillingItemTab";
import PaymentTab from "./PaymentTab";
import PrevBillingTab from "./PrevBillingTab";
import PrevPaymentTab from "./PrevPaymentTab";

const BillingDetail = ({
  billingCodeId,
  calculationCodeId,
  ratingCodeId,
  saNumberId,
  accountNumberId,
  onClose,
}) => {
  const [tabHeader, setTabHeader] = useState("Billing Item");
  const detailRef = useRef(null);

  // Use Effect untuk scroll otomatis saat komponen muncul
  useEffect(() => {
    if (billingCodeId && detailRef.current) {
      setTabHeader("Billing Item");
      
      // Gunakan requestAnimationFrame untuk scroll lebih smooth
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({ 
            behavior: "smooth", 
            block: "start",
            inline: "nearest"
          });
        });
      });
    }
  }, [billingCodeId]);

  // data tabs
  const dataTabs = [
    {
      label: "Billing Item",
      value: "Billing Item",
    },
    {
      label: "Payment",
      value: "Payment",
    },
    {
      label: "Previous Billing",
      value: "Previous Billing",
    },
    {
      label: "Previous Payment",
      value: "Previous Payment",
    },
  ];

  // change tabs
  const changeTabHeader = (e) => {
    setTabHeader(e.target.value);
  };

  // render tabs item
  const renderLayout = (valueTab) => {
    switch (valueTab) {
      case "Billing Item":
        return (
          <BillingItemTab
            billingCodeId={billingCodeId}
            ratingCodeId={ratingCodeId}
            calculationCodeId={calculationCodeId}
          />
        );
      case "Payment":
        return (
          <PaymentTab
            billingCodeId={billingCodeId}
            calculationCodeId={calculationCodeId}
          />
        );
      case "Previous Billing":
        return (
          <PrevBillingTab
            billingCodeId={billingCodeId}
            saNumberId={saNumberId}
            accountNumberId={accountNumberId}
          />
        );
      case "Previous Payment":
        return <PrevPaymentTab billingCodeId={billingCodeId} />;
      default:
        return <BillingItemTab billingCodeId={billingCodeId} />;
    }
  };

  return (
    <div ref={detailRef} className="scroll-mt-4">
      <div className="flex justify-between items-center mb-4">
        <Radio.Group
          options={dataTabs}
          onChange={changeTabHeader}
          value={tabHeader}
          optionType="button"
          buttonStyle="solid"
          style={{ gap: 12, display: "flex" }}
        />
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors ml-4"
          title="Close Detail"
        >
          ✕
        </button>
      </div>
      {renderLayout(tabHeader)}
    </div>
  );
};

export default BillingDetail;