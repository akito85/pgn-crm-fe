import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedApproval } from "../../../../../../redux/slices/rating_billing_invoice/billingItem";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";

const BillingItemApprovalHistory = ({ type }) => {
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const dispatch = useDispatch();
  const { dataListAppHierId, dataListAppHierDetail } = useSelector(
    (state) => state.billing_item,
  );

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getSelectedApproval({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
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
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

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
export default BillingItemApprovalHistory;
