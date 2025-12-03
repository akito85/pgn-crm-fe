import React from "react";
import RadioTabs from "../../../../components/RadioTabs";
import AccountList from "./DetailPages/Account/AccountList";
import CustomerAddressList from "./DetailPages/Address/CustomerAddressList";
import { Fragment } from "react";
import CustomerContactList from "./DetailPages/Contact/CustomerContactList";
import CustomerServiceRequestList from "./DetailPages/ServiceRequest/CustomerServiceRequestList";

const dataTabs = {
  acc: "Account",
  add: "Address",
  con: "Contact",
  sreq: "Service Request",
};

const CustomerDetailInformation = ({
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
      case dataTabs.acc:
        return <AccountList id={id} dispatch={dispatch} />;
      case dataTabs.add:
        return <CustomerAddressList id={id} dispatch={dispatch} />;
      case dataTabs.con:
        return <CustomerContactList id={id} dispatch={dispatch} />;
      case dataTabs.sreq:
        return <CustomerServiceRequestList id={id} dispatch={dispatch} />;
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

export default CustomerDetailInformation;
