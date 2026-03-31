import { memo, useEffect } from "react";
import { useState } from "react";
import PaymentRelationTable from "./PaymentRelationTable";
import { useDispatch, useSelector } from "react-redux";
import PaymentRelationApprovalModal from "./PaymentRelationApprovalModal";
import NxInactivateModal from "../../../../../../../components/Nx/NxInactivateModal";
import { getPrApprovalHierarchy, getDetailPrApprovalHierarchy, getPrApprovalHistory, inactivatePaymentRelation } from "../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import NxHistoryModal from "../../../../../../../components/Nx/NxHistoryModal";

/**
 * Payment relation list table module
 * @param {{ id?: number; idCustomer?: number }} props
 * @returns
 */
const PaymentRelation = ({
  id = 0,
  idCustomer = 0,
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();

  const { data_prApprovalHistory } = useSelector(
    (state) => state.paymentRelation
  );

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivatePrId, setInactivatePrId] = useState(0);
  const [inactivatePrAccountNumber, setInactivatePrAccountNumber] = useState(0);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  // --- Functions / handlers ---
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} prId
   * @param {string} prAccountNumber
   */
  const handleInactivateModal = (show, newPrId = 0, newPrAccountNumber = "") => {
    if (show) {
      setInactivatePrId(newPrId);
      setInactivatePrAccountNumber(newPrAccountNumber);
      setShowInactiveModal(true);
    } else {
      setInactivatePrId(0);
      setInactivatePrAccountNumber("");
      setShowInactiveModal(false);
    }
  };

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivatePr = ({ remark, appHierId }, handleClear) => {
    const body = {
      id: inactivatePrId,
      appHierId,
      remark,
    };

    dispatch(inactivatePaymentRelation({ body }))
      .unwrap()
      .then(() => {
        setShowInactiveModal(false);
        triggerRefresh();
        handleClear();
      })
      .catch(() => {});
  };


  /**
   * @param {boolean} show
   * @param {number} prId
   */
  const handleApprovalHistoryModal = (show, prId = 0) => {
    if (show) {
      dispatch(getPrApprovalHistory(prId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

  // --- Effects ---
  // Reshape raw API approval history into { create, inactive } buckets.
  useEffect(() => {
    if (data_prApprovalHistory && data_prApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_prApprovalHistory?.dataApprover?.PAYMENT_RELATION || [],
          inactive: data_prApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_RELATION || [],
        },
        dataHistory: {
          create: data_prApprovalHistory?.dataHistory?.PAYMENT_RELATION || [],
          inactive: data_prApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_RELATION || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_prApprovalHistory]);

  return (
    <>
      <PaymentRelationTable
        idAccount={id}
        idCustomer={idCustomer}
        handleInactivateModal={handleInactivateModal}
        handleApprovalHistoryModal={handleApprovalHistoryModal}
        handleApproval={setShowApprovalModal}
        refreshSignal={refreshSignal}
      />

      <PaymentRelationApprovalModal
        id={id}
        isOpen={showApprovalModal}
        handleCancel={() => setShowApprovalModal(false)}
        afterFinish={triggerRefresh}
      />

      {/* Inactivate Modal */}
      <NxInactivateModal
        isOpen={showInactiveModal}
        header={"INACTIVATE"}
        handleCloseModal={() => handleInactivateModal(false)}
        customMessage={`Are you sure you want to inactivate payment relation - ${inactivatePrAccountNumber}?`}
        onFinish={({ remark, appHierId }, handleClear) =>
          handleInactivatePr({ remark, appHierId }, handleClear)
        }
        named={inactivatePrAccountNumber}
        menu="payment relation"
        sliceName="paymentRelation"
        approvalOptionsName="list_prApprovalOptions"
        approvalHierarchtDetailsName="list_prApprovalHierarchyDetail"
        loadingInactivateName="loading_inactivatePr"
        loadingListApprovalOptionsName="loading_listPrApprovalOption"
        loadingListHierarchyDetailName="loading_detailPrApprovalHierarchyDetails"
        getApprovalOptions={getPrApprovalHierarchy}
        getApprovalHierarchyDetails={getDetailPrApprovalHierarchy}
      />

      {/* Approval History Modal */}
      <NxHistoryModal
        isOpen={showApprovalHistoryModal}
        handleClose={() => handleApprovalHistoryModal(false)}
        header={"Approval History"}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
    </>
  );
};

export default memo(PaymentRelation);
