import React, { useState } from "react";
import { Collapse } from "antd";
import { DownOutlined } from "@ant-design/icons";
import CalculationItemInfo from "./CalculationUsage/CalculationItemInfo";
import CalculationSummary from "./CalculationUsage/CalculationSummary";
import CalculationDetail from "./CalculationUsage/CalculationDetail";
import AdjustmentSection from "./CalculationUsage/AdjustmentSection";

const { Panel } = Collapse;

const CalculationUsageSection = ({ calculationCode, ratingCode, accountNumber, saType }) => {
  const [activeKey, setActiveKey] = useState(["1"]);

  const handleCollapseChange = (keys) => {
    setActiveKey(keys);
  };

  const panelStyle = {
    marginBottom: 16,
    border: "1px solid #d9d9d9",
    borderRadius: 4,
    overflow: "hidden",
  };

  const headerStyle = {
    fontSize: 15,
    fontWeight: 500,
    color: "#0075bf",
    textTransform: "uppercase",
  };

  return (
    <div>
      <Collapse
        activeKey={activeKey}
        onChange={handleCollapseChange}
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} />
        )}
        expandIconPosition="right"
      >
        <Panel
          header={
            <span style={headerStyle}>Calculation Item Information</span>
          }
          key="1"
          style={panelStyle}
        >
          <CalculationItemInfo
            calculationCode={calculationCode}
            ratingCode={ratingCode}
            accountNumber={accountNumber}
          />
        </Panel>

        <Panel
          header={<span style={headerStyle}>Calculation Summary</span>}
          key="2"
          style={panelStyle}
        >
          <CalculationSummary 
            ratingCode={ratingCode}
            calculationCode={calculationCode}
            saType={saType}
          />
        </Panel>

        <Panel
          header={<span style={headerStyle}>Calculation Detail</span>}
          key="3"
          style={panelStyle}
        >
          <CalculationDetail 
            calculationCode={calculationCode}
            ratingCode={ratingCode}
          />
        </Panel>

        <Panel
          header={<span style={headerStyle}>Adjustment</span>}
          key="4"
          style={panelStyle}
        >
          <AdjustmentSection 
            calculationCode={calculationCode}
          />
        </Panel>
      </Collapse>
    </div>
  );
};

export default CalculationUsageSection;