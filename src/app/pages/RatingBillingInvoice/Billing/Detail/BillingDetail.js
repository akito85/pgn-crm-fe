import React, { useState, useEffect, useRef } from "react";
import { Tabs } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import BillingItemTab from "./BillingItemTab";
import RatingSummaryTab from "./RatingSummaryTab";
import AdjustmentTab from "./AdjustmentTab";

const BillingDetail = ({
  billingCodeId,
  calculationCodeId,
  ratingCodeId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("1");
  const detailRef = useRef(null);

  useEffect(() => {
    if (billingCodeId && detailRef.current) {
      setActiveTab("1");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
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
          calculationCodeId={calculationCodeId}
        />
      ),
    },
    {
      key: "2",
      label: "Rating Summary",
      children: <RatingSummaryTab ratingCodeId={ratingCodeId} />,
    },
    {
      key: "3",
      label: "Adjustment",
      children: <AdjustmentTab billingCodeId={billingCodeId} />,
    },
  ];

  return (
    <div ref={detailRef} className="scroll-mt-4">
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary uppercase">Billing Detail</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors"
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