import React, { useState, Fragment } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import RadioTabs from "../../../../../../components/RadioTabs";
import CurrentProductDistribution from "./CurrentProductDistribution/CurrentProductDistribution";
import ProductDistributionHistory from "./ProductDistributionHistory/ProductDistributionHistory";

const ProductDistribution = ({ id, idCustomer }) => {
  // State
  const [valuePage, setValuePage] = useState("Current Raw Material Source");
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Current Product Distribution" },
    { value: "Product Distribution History" },
  ]);

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Current Product Distribution":
        return <CurrentProductDistribution id={id} idCustomer={idCustomer} />;
      case "Product Distribution History":
        return <ProductDistributionHistory id={id} idCustomer={idCustomer} />;
      default:
        return <CurrentProductDistribution id={id} idCustomer={idCustomer} />;
    }
  };
  return (
    <Fragment>
      <BaseContainer
        type={"tab"}
        element={
          <>
            <RadioTabs
              data={listSectionInfo}
              onChange={(e) => setValuePage(e.target.value)}
            />
          </>
        }
      >
        {layout(valuePage)}
      </BaseContainer>
    </Fragment>
  );
};

export default ProductDistribution;
