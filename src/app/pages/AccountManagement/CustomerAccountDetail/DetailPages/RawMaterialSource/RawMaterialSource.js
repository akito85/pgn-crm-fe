import React, { useState, Fragment } from "react";
import { Spin } from "antd";
import BaseContainer from "../../../../../../components/BaseContainer";
import RadioTabs from "../../../../../../components/RadioTabs";
import CurrentRawMaterialSource from "./CurrentRawMaterialSource/CurrentRawMaterialSource";
import RawMaterialSourceHistory from "./RawMaterialSourceHistory/RawMaterialSourceHistory";

const RawMaterialSource = ({ id, idCustomer }) => {
  // Selector

  // Declaration

  // State
  const [valuePage, setValuePage] = useState("Current Raw Material Source");
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Current Raw Material Source" },
    { value: "Raw Material Source History" },
  ]);

  // Use Effect

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Current Raw Material Source":
        return <CurrentRawMaterialSource id={id} idCustomer={idCustomer} />;
      case "Raw Material Source History":
        return <RawMaterialSourceHistory id={id} idCustomer={idCustomer} />;
      default:
        return <CurrentRawMaterialSource id={id} idCustomer={idCustomer} />;
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

export default RawMaterialSource;
