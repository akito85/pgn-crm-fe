import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";

const BillingCycleApprovalHistory = ({ type }) => {
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const dispatch = useDispatch();
  const { list_approval_hierarchy, data_SelectedApproval } = useSelector(
    (state) => state.billingCycle
  );

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(get(selectedHierarchy));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (data_SelectedApproval && data_SelectedApproval.length > 0) {
      const data = data_SelectedApproval.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [data_SelectedApproval]);

  useEffect(() => {
    if (list_approval_hierarchy && list_approval_hierarchy.length > 0) {
      const tempAppHier = list_approval_hierarchy.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [list_approval_hierarchy]);

  return (
    <div>
      <ApprovalComponentGeneral
        type={type}
        dataTable={appHierDataDetail}
        dataOption={appHierOptions}
        selectedHierarchy={selectedHierarchy}
        updateSelectedHierarchy={setSelectedHierarchy}
      />
    </div>
  );
};
export default BillingCycleApprovalHistory;
