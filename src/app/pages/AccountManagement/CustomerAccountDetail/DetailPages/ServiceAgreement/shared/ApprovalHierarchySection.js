import { useCallback, useEffect } from "react";
import { Form } from "antd";

import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxApprovalInput from "../../../../../../../components/Nx/NxApprovalInput";

const ApprovalHierarchySection = ({
  dataApprovalList,
  dataDetailApproval,
  handleDetailApproval,
  handleSaApprovalObj,
  loading,
  form,
}) => {
  const selectedApprovalId = Form.useWatch("appHierId", form);

  const handleSelectHierarchy = useCallback(
    (appHierId, approvalName) => {
      handleDetailApproval?.(appHierId);
      handleSaApprovalObj?.(appHierId, "appHierId");
      form?.setFieldValue?.("appHierName", approvalName);
    },
    [form, handleDetailApproval, handleSaApprovalObj]
  );

  useEffect(() => {
    if (!selectedApprovalId) return;

    const selectedOption = (dataApprovalList || []).find(
      (option) => option?.appHierId === selectedApprovalId
    );

    if (selectedOption?.approvalName) {
      form?.setFieldValue?.("appHierName", selectedOption.approvalName);
    }
  }, [dataApprovalList, form, selectedApprovalId]);

  return (
    <NxCardContainer header="APPROVAL">
      <NxBaseContainer border>
        <NxApprovalInput
          form={form}
          options={dataApprovalList}
          hierarchyDetails={dataDetailApproval}
          handleSelectHierarchy={handleSelectHierarchy}
          tableLoading={loading}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default ApprovalHierarchySection;
