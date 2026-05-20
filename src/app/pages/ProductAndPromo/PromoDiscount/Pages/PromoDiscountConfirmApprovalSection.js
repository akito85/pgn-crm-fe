import React from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";

const PromoDiscountConfirmApprovalSection = ({
  dataApproval,
  dataApprovalTable,
  listApproval,
}) => {
  const labelApproval = listApproval
    ?.filter((a) => a.value === dataApproval)
    ?.find((v) => v.name)?.name;

  return (
    <NxBaseContainer border header="Approval">
      <ApprovalComponentGeneral
        showSelect={false}
        dataTable={dataApprovalTable}
        selectedHierarchy={dataApproval}
        approvalName={labelApproval}
        disableSelect={true}
      />
    </NxBaseContainer>
  );
};

export default PromoDiscountConfirmApprovalSection;
