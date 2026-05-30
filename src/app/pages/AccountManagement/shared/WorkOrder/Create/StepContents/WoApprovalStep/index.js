import { useDispatch, useSelector } from "react-redux";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApprovalInput from "../../../../../../../../components/Nx/NxApprovalInput";
import { getWoApprovalHierarchy } from "../../../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";

const WoApprovalStep = ({ form }) => {
  const dispatch = useDispatch();
  const { list_woApprovalHierarchy, detail_woApprovalHierarchy } = useSelector(
    (state) => state.workOrder
  );

  const handleSelectHierarchy = (value, label) => {
    form.setFieldsValue({ appHierId: value, appHierName: label });
    if (value) dispatch(getWoApprovalHierarchy(value));
  };

  return (
    <NxCardContainer header="Approval Information">
      <NxBaseContainer border>
        <NxApprovalInput
          form={form}
          options={list_woApprovalHierarchy}
          hierarchyDetails={detail_woApprovalHierarchy}
          handleSelectHierarchy={handleSelectHierarchy}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default WoApprovalStep;
