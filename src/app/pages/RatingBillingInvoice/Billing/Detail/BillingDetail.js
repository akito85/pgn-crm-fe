import React, { useState, useEffect, useRef } from "react";
import { Tabs } from "antd";
import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import BillingItemTab from "./BillingItemTab";
import RatingSummaryTab from "./RatingSummaryTab";
import AdjustmentTab from "./AdjustmentTab";
import DetailText from "../../../../../components/DetailText";

const BillingDetail = ({
  billingCodeId,
  calculationCodeId,
  billHeaderId,
  selectedBillingData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("1");
  const detailRef = useRef(null);

  useEffect(() => {
    if (billHeaderId  && detailRef.current) {
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
          billHeaderId={billHeaderId} 
        />
      ),
    },
    {
      key: "2",
      label: "Rating Summary",
      children: <RatingSummaryTab billHeaderId={billHeaderId} />,
    },
    {
      key: "3",
      label: "Adjustment",
      children: <AdjustmentTab billHeaderId={billHeaderId} />,
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

      <CardContainer header={"History Log Information"}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailText label={"Created Date"}>
            {selectedBillingData?.createdDate
              ? moment(selectedBillingData?.createdDate).format(
                  "DD MMM YYYY HH:mm:ss",
                )
              : " "}
          </DetailText>
          <DetailText label={"Created By"}>
            {selectedBillingData?.createdBy || " "}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {selectedBillingData?.updatedDate
              ? moment(selectedBillingData?.updatedDate).format(
                  "DD MMM YYYY HH:mm:ss",
                )
              : "-"}
          </DetailText>
          <DetailText label={"Updated By"}>
            {selectedBillingData?.updatedBy || "-"}
          </DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default BillingDetail;
