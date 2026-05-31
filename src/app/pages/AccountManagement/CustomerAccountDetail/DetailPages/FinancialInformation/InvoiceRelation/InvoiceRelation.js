import { memo, useEffect } from "react";
import { useState } from "react";
import InvoiceRelationTable from "./InvoiceRelationTable";
import { useDispatch, useSelector } from "react-redux";
import InvoiceRelationApprovalModal from "./InvoiceRelationApprovalModal";
import NxActivateInactivateModal from "../../../../../../../components/Nx/NxActivateInactivateModal";
import {
  getIrApprovalHierarchies,
  getIrApprovalHierarchy,
  getIrApprovalHistory,
  inactivateInvoiceRelation
} from "../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import NxHistoryModal from "../../../../../../../components/Nx/NxHistoryModal";

/**
 * Invoice relation list table module
 * @param {{ accountId: number; customerId: number }} props
 * @returns
 */
const InvoiceRelation = ({ accountId, customerId }) => {
  // --- Hooks ---
  const dispatch = useDispatch();

  const { detail_irApprovalHistory } = useSelector(
    (state) => state.invoiceRelation
  );

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateIrId, setInactivateIrId] = useState(0);
  const [inactivateIrAccountNumber, setInactivateIrAccountNumber] = useState(0);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] =
    useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  // --- Functions / handlers ---
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} irId
   * @param {string} irAccountNumber
   */
  const handleInactivateModal = (
    show,
    newIrId = 0,
    newIrAccountNumber = ""
  ) => {
    if (show) {
      setInactivateIrId(newIrId);
      setInactivateIrAccountNumber(newIrAccountNumber);
      setShowInactiveModal(true);
    } else {
      setInactivateIrId(0);
      setInactivateIrAccountNumber("");
      setShowInactiveModal(false);
    }
  };

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivateIr = ({ remark, appHierId }, handleClear) => {
    const body = {
      id: inactivateIrId,
      appHierId,
      remark
    };

    dispatch(inactivateInvoiceRelation({ body }))
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
   * @param {number} irId
   */
  const handleApprovalHistoryModal = (show, irId = 0) => {
    if (show) {
      dispatch(getIrApprovalHistory(irId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

  // --- Effects ---
  // Reshape raw API approval history into { create, inactive } buckets.
  useEffect(() => {
    if (detail_irApprovalHistory && detail_irApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: detail_irApprovalHistory?.dataApprover?.INVOICE_RELATION || [],
          inactive:
            detail_irApprovalHistory?.dataApprover?.INACTIVE_INVOICE_RELATION ||
            []
        },
        dataHistory: {
          create: detail_irApprovalHistory?.dataHistory?.INVOICE_RELATION || [],
          inactive:
            detail_irApprovalHistory?.dataHistory?.INACTIVE_INVOICE_RELATION || []
        }
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [detail_irApprovalHistory]);

  return (
    <>
      <InvoiceRelationTable
        accountId={accountId}
        customerId={customerId}
        handleInactivateModal={handleInactivateModal}
        handleApprovalHistoryModal={handleApprovalHistoryModal}
        handleApproval={setShowApprovalModal}
        refreshSignal={refreshSignal}
      />
      <InvoiceRelationApprovalModal
        accountId={accountId}
        isOpen={showApprovalModal}
        handleCancel={() => setShowApprovalModal(false)}
        afterFinish={triggerRefresh}
      />
      {/* Inactivate Modal */}
      <NxActivateInactivateModal
        isOpen={showInactiveModal}
        header={"INACTIVATE"}
        handleCloseModal={() => handleInactivateModal(false)}
        customMessage={`Are you sure you want to inactivate invoice relation - ${inactivateIrAccountNumber}?`}
        onFinish={({ remark, appHierId }, handleClear) =>
          handleInactivateIr({ remark, appHierId }, handleClear)
        }
        named={inactivateIrAccountNumber}
        menu="invoice relation"
        sliceName="invoiceRelation"
        approvalOptionsName="list_irApprovalHierarchy"
        approvalHierarchtDetailsName="detail_irApprovalHierarchy"
        loadingInactivateName="loading_inactivateIr"
        loadingListApprovalOptionsName="loading_listIrApprovalHierarchy"
        loadingListHierarchyDetailName="loading_detailIrApprovalHierarchy"
        getApprovalOptions={getIrApprovalHierarchies}
        getApprovalHierarchyDetails={getIrApprovalHierarchy}
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

export default memo(InvoiceRelation);
