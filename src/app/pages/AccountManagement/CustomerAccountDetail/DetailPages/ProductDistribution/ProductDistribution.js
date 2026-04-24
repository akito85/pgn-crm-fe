import React, { useState } from "react";
import CurrentProductDistribution from "./CurrentProductDistribution/CurrentProductDistribution";
import ProductDistributionHistory from "./ProductDistributionHistory/ProductDistributionHistory";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { Tabs } from "antd";

const ProductDistribution = ({ id, idCustomer }) => {
  const [activeKey, setActiveKey] = useState("current");

  const tabOptions = [
    {
      key: "current",
      label: "Current Product Distribution",
      children: (
        <CurrentProductDistribution id={id} idCustomer={idCustomer} />
      )
    },
    {
      key: "history",
      label: "Product Distribution History",
      children: (
        <ProductDistributionHistory id={id} idCustomer={idCustomer} setActiveKey={setActiveKey} />
      )
    },
  ];

  return (
    <NxCardContainer
      header={"PRODUCT DISTRIBUTION"}
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

export default ProductDistribution;
