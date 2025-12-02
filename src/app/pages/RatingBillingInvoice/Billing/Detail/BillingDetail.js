import React, { useState, useEffect, useRef } from "react";
import { Tabs } from "antd";
import CardContainer from "../../../../../components/CardContainer";
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
  const [activeTab, setActiveTab] = useState("1");
  const detailRef = useRef(null);

  // Use Effect untuk scroll otomatis saat komponen muncul
  useEffect(() => {
    if (billingCodeId && detailRef.current) {
      setActiveTab("1");
      
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

  const items = [
    {
      key: "1",
      label: "Billing Item",
      children: (
        <BillingItemTab
          billingCodeId={billingCodeId}
          ratingCodeId={ratingCodeId}
          calculationCodeId={calculationCodeId}
        />
      ),
    },
    {
      key: "2",
      label: "Payment",
      children: (
        <PaymentTab
          billingCodeId={billingCodeId}
          calculationCodeId={calculationCodeId}
        />
      ),
    },
    {
      key: "3",
      label: "Previous Billing",
      children: (
        <PrevBillingTab
          billingCodeId={billingCodeId}
          saNumberId={saNumberId}
          accountNumberId={accountNumberId}
        />
      ),
    },
    {
      key: "4",
      label: "Previous Payment",
      children: <PrevPaymentTab billingCodeId={billingCodeId} />,
    },
  ];

  return (
    <div ref={detailRef} className="scroll-mt-4">
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold text-primary uppercase">Billing Detail</p>
            <button
              onClick={onClose}
              className="mt-[15px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              title="Close Detail"
            >
              ✕
            </button>
          </div>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          type="line"
          className="billing-detail-tabs"
          style={{ marginTop: -12, marginBottom: 0 }}
        />
      </CardContainer>
    </div>
  );
};

export default BillingDetail;