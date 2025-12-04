import React, { Fragment } from "react";
import RadioTabs from "../../../../../../../../../components/RadioTabs";
import ConfirmationModalInfo from "./ConfirmationModalInfo";
import ConfirmationModalApproval from "./ConfirmationModalApproval";
import ConfirmationModalAttachment from "./ConfirmationModalAttachment";

const dataTabs = {
  info: "Payment Relation Information",
  apprv: "Approval",
  attch: "Attachment",
};

const ConfirmationModalTabs = ({
  section = "",
  options = [],
  handleChangeOption = () => {},
  selectedAppHierId,
  selectedApprovalName,
  hierarchyTableData,
  dispatch,
  dataAttachment,
}) => {
  // Use provided options or fall back to default tabs
  const tabOptions = options.length > 0 ? options : [
    { value: "info", label: "Payment Relation Information" },
    { value: "apprv", label: "Approval" },
    { value: "attch", label: "Attachment" },
  ];

  const renderSection = () => {
    switch (section) {
      case dataTabs.info:
        return <ConfirmationModalInfo />;
      case dataTabs.apprv:
        return (
        <ConfirmationModalApproval
          dataTable={hierarchyTableData}
          selectedAppHierId={selectedAppHierId}
          selectedApprovalName={selectedApprovalName}
        />
        )
      case dataTabs.attch:
        return <ConfirmationModalAttachment
          data={dataAttachment}
          dispatch={dispatch}
        />;
      default:
        return "Payment Relation Information";
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

export default ConfirmationModalTabs;
