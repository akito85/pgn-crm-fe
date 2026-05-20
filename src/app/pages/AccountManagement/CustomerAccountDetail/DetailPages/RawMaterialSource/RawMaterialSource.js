import React, { useState, Fragment } from "react";
import CurrentRawMaterialSource from "./CurrentRawMaterialSource/CurrentRawMaterialSource";
import RawMaterialSourceHistory from "./RawMaterialSourceHistory/RawMaterialSourceHistory";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { Tabs } from "antd";

const RawMaterialSource = ({ id, idCustomer }) => {
  const [activeKey, setActiveKey] = useState("current");

  const tabOptions = [
    {
      key: "current",
      label: "Current Raw Material Source",
      children: (
        <CurrentRawMaterialSource
          id={id}
          idCustomer={idCustomer}
        />
      )
    },
    {
      key: "history",
      label: "Raw Material Source History",
      children: (
        <RawMaterialSourceHistory
          id={id}
          idCustomer={idCustomer}
          setActiveKey={setActiveKey}
        />
      )
    },
  ];

  return (
    <NxCardContainer
      header={"RAW MATERIAL SOURCE"}
      type={"tabs"}
      element={
        <Tabs
          items={tabOptions}
          onChange={setActiveKey}
          activeKey={activeKey}
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-tab]:py-4 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
        />
      }
    ></NxCardContainer>
  );
};

export default RawMaterialSource;
