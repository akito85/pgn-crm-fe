import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import ServiceAgreementSection from "./ServiceAgreementSection";
import UsageSection from "./UsageSection";

const PrabillingSummaryDetail = ({ 
  prabillAccId, 
  customerNumber, 
  billPeriod,
  customerName,
  accountNumber,
  onClose 
}) => {
  const [tabSection, setTabSection] = useState("Service Agreement");

  // Reset tab ke "Service Agreement" setiap kali customerNumber berubah
  useEffect(() => {
    setTabSection("Service Agreement");
  }, [customerNumber, prabillAccId]);

  const tabItems = [
    {
      key: "Service Agreement",
      label: "Service Agreement",
      children: null,
    },
    {
      key: "Usage",
      label: "Usage",
      children: null,
    },
  ];

  const getContainerTitle = () => {
    switch (tabSection) {
      case "Service Agreement":
        return "SERVICE AGREEMENT INFORMATION";
      case "Usage":
        return "USAGE INFORMATION";
      default:
        return "SERVICE AGREEMENT INFORMATION";
    }
  };

  const renderSection = () => {
    switch (tabSection) {
      case "Service Agreement":
        return (
          <ServiceAgreementSection
            prabillAccId={prabillAccId}
            customerNumber={customerNumber}
            accountNumber={accountNumber}
            customerName={customerName}
          />
        );
      case "Usage":
        return (
          <UsageSection
            customerNumber={customerNumber}
            billPeriod={billPeriod}
            accountNumber={accountNumber}
            customerName={customerName}
          />
        );
      default:
        return (
          <ServiceAgreementSection
            prabillAccId={prabillAccId}
            customerNumber={customerNumber}
            accountNumber={accountNumber}
            customerName={customerName}
          />
        );
    }
  };

  const onChangeTab = (key) => {
    setTabSection(key);
  };

  return (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold text-[#0075bf]">{getContainerTitle()}</p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            title="Close Detail"
          >
            ✕
          </button>
        </div>
      }
    >
      <Tabs
        items={tabItems}
        onChange={onChangeTab}
        activeKey={tabSection}
        className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
      />
      <div className="mt-4">{renderSection()}</div>
    </CardContainer>
  );
};

export default PrabillingSummaryDetail;