import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApprovalHistory } from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";

const ModalApprovalHistory = ({ isOpen, handleCancel, idAccount, relationshipId }) => {
  const dispatch = useDispatch();
  const { data_approvalHistory, loadingApprovalHistory } = useSelector(
    (state) => state.relationship
  );

  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  useEffect(() => {
    if (isOpen && idAccount && relationshipId) {
      dispatch(getApprovalHistory({ idAccount, relationshipId }));
    }
  }, [dispatch, isOpen, idAccount, relationshipId]);

  useEffect(() => {
    if (data_approvalHistory && data_approvalHistory.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_approvalHistory?.dataApprover?.ACCOUNT_RELATIONSHIP || [],
          inactive: data_approvalHistory?.dataApprover?.INACTIVE_ACCOUNT_RELATIONSHIP || [],
        },
        dataHistory: {
          create: data_approvalHistory?.dataHistory?.ACCOUNT_RELATIONSHIP || [],
          inactive: data_approvalHistory?.dataHistory?.INACTIVE_ACCOUNT_RELATIONSHIP || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_approvalHistory]);

  const handleApprovalHistoryOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  return (
    <NxHistoryModal
      isOpen={isOpen}
      handleClose={handleCancel}
      header={"Approval History"}
      width={850}
      tabOptions={handleApprovalHistoryOptions()}
      dataApprover={dataApprovalHistoryFix?.dataApprover}
      dataHistory={dataApprovalHistoryFix?.dataHistory}
    />
  );
};

export default ModalApprovalHistory;
