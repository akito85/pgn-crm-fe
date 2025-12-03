import React, { Fragment, useState } from "react";
import RadioTabs from "../../../../../../../components/RadioTabs";
import CustomerServiceRequestDetailAttch from "./CustomerServiceRequestDetailAttch"
import CustomerServiceRequestDetailInfo from "./CustomerServiceRequestDetailInfo"

const dataTabs = {
  sreqi: "Service Request Information",
  attch: "Attachment",
};

const CustomerServiceRequestDetailTabs = ({
  dispatch = () => {},
  id = 0,
  section = "",
  options = [],
  handleChangeOption = () => {},
}) => {
  //   const sliderLeft = () => {
  //     const slider = document.getElementById("slider");
  //     slider.scrollLeft = slider.scrollLeft - 250;
  //   };

  //   const sliderRight = () => {
  //     const slider = document.getElementById("slider");
  //     slider.scrollLeft = slider.scrollLeft + 250;
  //   };
  const renderSection = () => {
    switch (section) {
      case dataTabs.sreqi:
        return <CustomerServiceRequestDetailInfo id={id} dispatch={dispatch}/>;
      case dataTabs.attch:
        return <CustomerServiceRequestDetailAttch id={id} dispatch={dispatch}/>;
      default:
        return <></>;
    }
  };
  return (
    <Fragment>
      <div className="flex flex-col gap-4">
      <div className="relative flex justify-center items-center gap-4">
        <div
          className={
            "flex gap-2 w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar"
          }
        >
          <RadioTabs
            currentPosition={section}
            data={options}
            onChange={handleChangeOption}
          />
        </div>
      </div>
      {renderSection()}
    </div>
    </Fragment>
  );
};

export default CustomerServiceRequestDetailTabs;
