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
  id,
  idAccount,
  idCustomer,
  accountType,
  data_accountDetail,
  data_customerDetail,
}) => {
  // Use provided options or fall back to default tabs
  const tabOptions = options.length > 0 ? options : [
    { value: "sreqi", label: "Service Request" },
    { value: "contact", label: "Contact" },
    { value: "prerequisite", label: "Pre-Requisite" },
    { value: "workorder", label: "Work Order" },
    { value: "attch", label: "Attachment" }
  ];


  const AccountType = () => {
    // Path form URL
    const path = window.location.pathname

    // Strict whitelist (prevents XSS, traversal, unicode injections)
    const allowed = /^[a-zA-Z0-9-_]+$/;

    // Match only your known route structure:
    // /account-management/<dynamic>/view
    const match = path.match(/^\/account-management\/([a-zA-Z0-9-_]+)\/view\/?$/);

    if (!match) return null;

    const dynamicPart = match[1];

    return allowed.test(dynamicPart) ? dynamicPart : null;
  }

  const renderSection = () => {
    const commonProps = {
      id,
      idAccount,
      idCustomer,
      accountType,
      data_accountDetail,
      data_customerDetail,
    };

    switch (section) {
      case dataTabs.sreqi:
        return <CustomerServiceRequestDetailInfo {...commonProps} type={AccountType}/>;
      case dataTabs.attch:
        return <CustomerServiceRequestDetailAttch {...commonProps} />;
      case dataTabs.contact:
        return <CustomerServiceRequestContact {...commonProps} />;
      case dataTabs.prerequisite:
        return <CustomerServiceRequestPreRequisite {...commonProps} />;
      case dataTabs.workorder:
        return <CustomerServiceRequestWorkOrder {...commonProps} />;
      default:
        return <CustomerServiceRequestDetailInfo {...commonProps} />;
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
