import React, { Fragment } from "react";
import RadioTabs from "../../../../../../../../../components/RadioTabs";
import ModalConfirmationCreateUpdateApprovalPaymentRelationInfo from "./ConfirmationModalInfo";
import ModalConfirmationCreateUpdateApprovalPaymentRelationApproval from "./ConfirmationModalApproval";
import ModalConfirmationCreateUpdateApprovalPaymentRelationAttachment from "./ConfirmationModalAttachment";

const dataTabs = {
  info: "Payment Relation Information",
  apprv: "Approval",
  attch: "Attachment",
};

const ModalConfirmationCreateUpdateApprovalPaymentRelationTabs = ({
  section = "",
  options = [],
  handleChangeOption = () => {},
  selectedHierarchy,
  dispatch
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
        return <ModalConfirmationCreateUpdateApprovalPaymentRelationInfo />;
      case dataTabs.apprv:
        return (
        <ModalConfirmationCreateUpdateApprovalPaymentRelationApproval
          selectedHierarchy={selectedHierarchy}
        />
        )
      case dataTabs.attch:
        return <ModalConfirmationCreateUpdateApprovalPaymentRelationAttachment
          data={[{}]}
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

export default ModalConfirmationCreateUpdateApprovalPaymentRelationTabs;
