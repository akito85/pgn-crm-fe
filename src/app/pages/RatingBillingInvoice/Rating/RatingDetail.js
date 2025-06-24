import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import ServiceAgreementSection from "./Detail/ServiceAgreementSection";
import PromoSection from "./Detail/PromoSection";
import CalculationUsageSection from "./Detail/CalculationUsageSection";
import MuldestSection from "./Detail/MuldestSection";
import UsageSection from "./Detail/UsageSection";

const RatingDetail = ({ ratingCodeId, SAId, calculationCode }) => {
  // State
  const [tabSection, setTabSection] = useState("Calculation Usage");

  // Use Effect
  useEffect(() => {
   if (ratingCodeId) {
    setTabSection("Calculation Usage")
   }
  }, [ratingCodeId]);

  // Value Tab
  const tabDetail = [
    {
      label: "Calculation Usage",
      value: "Calculation Usage",
    },
    {
      label: "Service Agreement",
      value: "Service Agreement",
    },
    {
      label: "Promo",
      value: "Promo",
      disabled: true,
    },
    {
      label: "Usage",
      value: "Usage",
    },
    {
      label: "Multi Destination",
      value: "Multi Destination",
      disabled: true,
    },
  ];

  // rendering section
  const renderSection = (tabName) => {
    switch (tabName) {
      case "Calculation Usage":
        return <CalculationUsageSection calculationCode={calculationCode} ratingCodeId={ratingCodeId} />;
      case "Service Agreement":
        return <ServiceAgreementSection calculationCode={calculationCode} ratingCodeId={ratingCodeId}/>;
      case "Promo":
        return <PromoSection />;
      case "Usage":
        return <UsageSection calculationCode={calculationCode} ratingCodeId={ratingCodeId}/>;
      case "Multi Destination":
        return <MuldestSection />;
      default:
        return <CalculationUsageSection calculationCode={calculationCode} ratingCodeId={ratingCodeId}/>;
    }
  };
  // onchang tabs
  const onChangeTab = ({ target: { value } }) => {
    setTabSection(value);
  };

  return (
    <div className="pt-[30px]">
      <Radio.Group
        options={tabDetail}
        onChange={onChangeTab}
        value={tabSection}
        optionType="button"
        buttonStyle="solid"
        style={{ gap: 12, display: "flex" }}
      />
      {renderSection(tabSection)}
    </div>
  );
};

export default RatingDetail;
