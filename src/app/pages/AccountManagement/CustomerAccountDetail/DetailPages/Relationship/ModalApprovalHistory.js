import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import { getApprovalHistory } from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";

const ModalApprovalHistory = ({ isOpen, handleCancel, idAccount, relationshipId }) => {
  const dispatch = useDispatch();
  const { data_approvalHistory, loadingApprovalHistory } = useSelector(
    (state) => state.relationship
  );

  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState(null);

  console.log("ModalApprovalHistory props:", { isOpen, idAccount, relationshipId });
  console.log("ModalApprovalHistory data:", { data_approvalHistory, loadingApprovalHistory });

  useEffect(() => {
    if (isOpen && idAccount && relationshipId) {
      console.log("Fetching approval history for:", { idAccount, relationshipId });
      dispatch(getApprovalHistory({ idAccount, relationshipId }));
    }
  }, [dispatch, isOpen, idAccount, relationshipId]);

  useEffect(() => {
    if (data_approvalHistory && data_approvalHistory.data) {
      console.log("Transforming approval history data:", data_approvalHistory);
      const dataHistory = data_approvalHistory.data.dataHistory || {};
      const dataApprover = data_approvalHistory.data.dataApprover || {};

      // Transform data for ModalHistory component
      const transformedData = {
        dataHistory: {
          create: dataHistory.ACCOUNT_RELATIONSHIP || [],
        },
        dataApprover: {
          create: dataApprover.ACCOUNT_RELATIONSHIP || [],
        },
      };

      console.log("Transformed data:", transformedData);
      setDataApprovalHistoryFix(transformedData);
    }
  }, [data_approvalHistory]);

  const handleOptions = () => {
    return [
      {
        label: "Create",
        value: "Create",
      },
    ];
  };

  return (
    <ModalHistory
      isOpen={isOpen}
      handleClose={handleCancel}
      header={"Approval History"}
      width={1000}
      tabOptions={handleOptions()}
      dataApprover={dataApprovalHistoryFix?.dataApprover}
      dataHistory={dataApprovalHistoryFix?.dataHistory}
    />
  );
};

export default ModalApprovalHistory;
