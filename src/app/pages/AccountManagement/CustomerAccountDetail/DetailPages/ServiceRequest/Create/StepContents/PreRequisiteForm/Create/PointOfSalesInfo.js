import { useMemo, useState } from "react"
import { PlusOutlined } from "@ant-design/icons"

import DetailText from "../../../../../../../../../../components/DetailText"
import ButtonComponent from "../../../../../../../../../../components/ButtonComponent"

import NxPanel from "../../../../../../../../../../components/Nx/NxPanel"
import NxTab from "../../../../../../../../../../components/Nx/NxTab"
import NxTable from "../../../../../../../../../../components/Nx/NxTable"

import { PointOfSalesDetails, PointOfSalesInstallment, PointOfSalesPromo } from "./PointOfSales"

const PointOfSalesInfo = () => {
  const data = []
  const [activeTab, setActiveTab] = useState("D")


  const tabNames = {
    D: "Detail",
    P: "Promo",
    I: "Installment",
  }

  const renderTabContent = useMemo(() => {
    return (key) => {
      switch (key) {
        case "D":
          return <PointOfSalesDetails />;
        case "P":
          return <PointOfSalesPromo /> ;
        case "I":
          return <PointOfSalesInstallment />; 
        default:
          return null;
      }
    };
  }, [tabNames]);

  const options = ["D", "P", "I"];

  const tabsConfig = useMemo(() => 
    options.map(optionKey => ({
      key: optionKey,
      label: tabNames[optionKey] || optionKey,
      content: renderTabContent(optionKey),
    })),
    [options, renderTabContent]
  );

  const handleChangeOption = (key) => {
    setActiveTab(key);
    // Add any additional logic you need when tab changes
  };


  return(
    <>
      <NxPanel className="mb-5" title={"FINANCIAL DETAILS"}>
        {/* Section 1: Total Amount */}
        <div className="w-full grid grid-cols-4 gap-5 mb-6">
          <DetailText label="Total Amount IDR">700,000</DetailText>
          <DetailText label="Total Amount USD">0</DetailText>
          <DetailText label="Total Amount Eqv IDR">700,000</DetailText>
          <DetailText label="Total Amount Eqv USD">20.03</DetailText>
        </div>

        {/* Section 2: Amount Details */}
        <div className="w-full grid grid-cols-4 gap-5 mb-6">
          <DetailText label="Amount IDR">700,000</DetailText>
          <DetailText label="Amount USD">0</DetailText>
          <DetailText label="Amount Eqv IDR">700,000</DetailText>
          <DetailText label="Amount Eqv USD">20.03</DetailText>
        </div>

        {/* Section 3: Discount & Tax Basis */}
        <div className="w-full grid grid-cols-4 gap-5 mb-6">
          <DetailText label="Discount IDR">0</DetailText>
          <DetailText label="Discount USD">0</DetailText>
          <DetailText label="Tax Basis IDR">700,000</DetailText>
          <DetailText label="Tax Basis USD">307,072</DetailText>
        </div>

        {/* Section 4: Tax Calculations */}
        <div className="w-full grid grid-cols-4 gap-5 mb-6">
          <DetailText label="Tax Basis Eqv IDR">10,000</DetailText>
          <DetailText label="VAT IDR">25.585</DetailText>
          <DetailText label="VAT USD">0</DetailText>
          <DetailText label="VAT Eqv IDR">25.585</DetailText>
        </div>

        {/* Section 5: Tax Information */}
        <div className="w-full grid grid-cols-4 gap-5 mb-6">
          <DetailText label="Withholding Tax">0</DetailText>
          <DetailText label="Rate Type">Corporate</DetailText>
          <DetailText label="Rate">15.373,25</DetailText>
          <DetailText label="Rate Date">12 Jan 2022</DetailText>
        </div>

        {/* Section 6: Tax Rate Details */}
        <div className="w-full grid grid-cols-4 gap-5">
          <DetailText label="Tax Rate Type">Tax</DetailText>
          <DetailText label="Tax Rate">15.573,25</DetailText>
          <DetailText label="Tax Rate Date">12 Jan 2022</DetailText>
          <div className="flex flex-col">
            {/* Empty column to maintain 4-column layout */}
          </div>
        </div>
      </NxPanel>

      <NxPanel className="w-full" title={"POINT OF SALES DETAIL INFORMATION"}>
        <NxTab
          className="w-full"
          tabs={tabsConfig}
          defaultActiveKey="D" // Use hardcoded default or prop
          onChange={handleChangeOption}
          strategy="lru"
          maxMountedTabs={3}
          priorityTabs={["D"]} // These tabs will always stay mounted
        />




      </NxPanel>
    </>
  )
}

export { PointOfSalesInfo }
