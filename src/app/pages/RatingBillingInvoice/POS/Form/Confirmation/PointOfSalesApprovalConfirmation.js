import { Fragment } from "react";
import React from "react";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";

const PointOfSalesApprovalConfirmation = ({
  dataApproval = {},
  dataApprovalTable = [],
  listApproval = [],
}) => {
  const labelApproval = listApproval
    ?.filter((a) => a.value === dataApproval)
    ?.find((v) => v.name)?.name;

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"APPROVAL INFORMATION"}
      </div>

      <ApprovalComponentGeneral
        showSelect={false}
        dataTable={dataApprovalTable}
        selectedHierarchy={dataApproval}
        approvalName={labelApproval}
        disableSelect={true}
      />
    </Fragment>
  );
};

export default PointOfSalesApprovalConfirmation;
