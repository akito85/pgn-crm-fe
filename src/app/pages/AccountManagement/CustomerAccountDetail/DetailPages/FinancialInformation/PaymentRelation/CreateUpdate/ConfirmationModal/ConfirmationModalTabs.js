import { Fragment } from "react";
import RadioTabs from "../../../../../../../../../components/RadioTabs";
import ConfirmationModalInfo from "./ConfirmationModalInfo";
import ConfirmationModalApproval from "./ConfirmationModalApproval";
import ConfirmationModalAttachment from "./ConfirmationModalAttachment";
import ConfirmationModalRemark from "./ConfirmationModalRemark";

const ConfirmationModalTabs = ({
  section = "",
  options = [],
  handleChangeOption = () => {},
  selectedAppHierId,
  selectedApprovalName,
  hierarchyTableData,
  dispatch,
  dataAttachment,
  data = {},
  service,
  type = "",
  configApplication,
}) => {
  const dataTabs = type === "submit" ? {
    info: "Payment Relation Information",
    apprv: "Approval",
    attch: "Attachment",
    rmrk: "Remark",
  } : type === "draft" ? {
    info: "Payment Relation Information",
    apprv: "Approval",
    attch: "Attachment",
  } : {
    info: "Payment Relation Information",
    apprv: "Approval",
    attch: "Attachment",
    rmrk: "Remark",
  };

  const renderSection = () => {
    switch (section) {
      case dataTabs.info:
        return <ConfirmationModalInfo data={data} />;
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
          service={service}
          configApplication={configApplication}
        />;
      case dataTabs.rmrk:
        return <ConfirmationModalRemark />
      default:
        return null;
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

export default ConfirmationModalTabs;
