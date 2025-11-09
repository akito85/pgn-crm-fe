import React, { Fragment } from "react";
import RadioTabs from "../../../../../../../components/RadioTabs";
import CustomerServiceRequestDetailAttch from "./CustomerServiceRequestDetailAttch";
import CustomerServiceRequestDetailInfo from "./CustomerServiceRequestDetailInfo";
import CustomerServiceRequestContact from "./CustomerServiceRequestContact";
import CustomerServiceRequestPreRequisite from "./CustomerServiceRequestPreRequisite";
import CustomerServiceRequestWorkOrder from "./CustomerServiceRequestWorkOrder";

const dataTabs = {
  sreqi: "Service Request",
  contact: "Contact",
  prerequisite: "Pre-Requisite", 
  workorder: "Work Order",
  attch: "Attachment"
};

const CustomerServiceRequestDetailTabs = ({
  section = "",
  options = [],
  handleChangeOption = () => {},
}) => {
  // Use provided options or fall back to default tabs
  const tabOptions = options.length > 0 ? options : [
    { value: "sreqi", label: "Service Request" },
    { value: "contact", label: "Contact" },
    { value: "prerequisite", label: "Pre-Requisite" },
    { value: "workorder", label: "Work Order" },
    { value: "attch", label: "Attachment" }
  ];

  const renderSection = () => {
    switch (section) {
      case dataTabs.sreqi:
        return <CustomerServiceRequestDetailInfo />;
      case dataTabs.attch:
        return <CustomerServiceRequestDetailAttch />;
      case dataTabs.contact:
        return <CustomerServiceRequestContact />;
      case dataTabs.prerequisite:
        return <CustomerServiceRequestPreRequisite />;
      case dataTabs.workorder:
        return <CustomerServiceRequestWorkOrder />;
      default:
        return <CustomerServiceRequestDetailInfo />;
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        {/* Wrapper div to ensure proper styling */}
        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
          <div className="w-full">
            <RadioTabs
              currentPosition={section}
              data={tabOptions}
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
