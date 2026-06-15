import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import ServiceAgreementSection from "./Detail/ServiceAgreementSection";
import PromoSection from "./Detail/PromoSection";
import PeriodicSection from "./Detail/PeriodicSection";
import CalculationUsageSection from "./Detail/CalculationUsageSection";
import MuldestSection from "./Detail/MuldestSection";
import UsageSection from "./Detail/UsageSection";
import CardContainer from "../../../../components/CardContainer";

const RatingDetail = ({
  ratingCode,
  calculationCode,
  accountNumber,
  saType,
  billPeriod,
  onClose,
}) => {
  // State
  const [tabSection, setTabSection] = useState("Calculation Usage");

  // Use Effect
  useEffect(() => {
    if (calculationCode) {
      setTabSection("Calculation Usage");
    }
  }, [calculationCode]);

  // Value Tab
  const tabItems = [
    {
      key: "Calculation Usage",
      label: "Calculation Usage",
    },
    {
      key: "Usage",
      label: "Usage",
    },
    {
      key: "Promo",
      label: "Promo",
    },
    {
      key: "Periodic",
      label: "Periodic",
      disabled: true,
    },
    {
      key: "Multi Destination",
      label: "Multi Destination",
      disabled: true,
    },
  ];

  // Get title based on active tab
  const getContainerTitle = () => {
    switch (tabSection) {
      case "Calculation Usage":
        return "CALCULATION USAGE INFORMATION";
      case "Usage":
        return "USAGE INFORMATION";
      case "Promo":
        return "PROMO INFORMATION";
      case "Periodic":
        return "PERIODIC INFORMATION";
      case "Multi Destination":
        return "MULTI DESTINATION INFORMATION";
      default:
        return "CALCULATION USAGE INFORMATION";
    }
  };

  // rendering section
  const renderSection = () => {
    switch (tabSection) {
      case "Calculation Usage":
        return (
          <CalculationUsageSection
            calculationCode={calculationCode}
            ratingCode={ratingCode}
            accountNumber={accountNumber}
            saType={saType}
          />
        );
      case "Usage":
        return (
          <UsageSection
            ratingCode={ratingCode}
            calculationCode={calculationCode}
            accountNumber={accountNumber} 
            billPeriod={billPeriod}
          />
        );
      case "Promo":
        return (
          <PromoSection
            calculationCode={calculationCode}
            ratingCode={ratingCode}
          />
        );
      case "Periodic":
        return (
          <PeriodicSection
            calculationCode={calculationCode}
            ratingCode={ratingCode}
          />
        );
      case "Multi Destination":
        return (
          <MuldestSection
            calculationCode={calculationCode}
            ratingCode={ratingCode}
          />
        );
      default:
        return (
          <CalculationUsageSection
            calculationCode={calculationCode}
            ratingCode={ratingCode}
            accountNumber={accountNumber}
            saType={saType}
          />
        );
    }
  };

  // onchang tabs
  const onChangeTab = (key) => {
    setTabSection(key);
  };

  return (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold">{getContainerTitle()}</p>
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
      <Tabs items={tabItems} onChange={onChangeTab} activeKey={tabSection} />
      <div className="mt-4">{renderSection()}</div>
    </CardContainer>
  );
};

export default RatingDetail;
