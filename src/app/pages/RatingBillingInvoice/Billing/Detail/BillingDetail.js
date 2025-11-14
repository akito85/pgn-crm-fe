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
    <div ref={detailRef} className="pt-[30px] scroll-mt-4">
      <Radio.Group
        options={dataTabs}
        onChange={changeTabHeader}
        value={tabHeader}
        optionType="button"
        buttonStyle="solid"
        style={{ gap: 12, display: "flex" }}
      />
      {renderLayout(tabHeader)}
    </div>
  );
};

export default BillingDetail;