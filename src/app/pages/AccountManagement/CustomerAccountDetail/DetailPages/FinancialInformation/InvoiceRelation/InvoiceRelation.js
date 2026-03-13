import { memo, useEffect } from "react";
import { useState } from "react";
import { Fragment } from "react";
import InvoiceRelationTable from "./InvoiceRelationTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getIrApprovalHistory,
  inactivateInvoiceRelation
} from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import InvoiceRelationApprovalModal from "./InvoiceRelationApprovalModal";
import NxInactivateModal from "../../../../../../../components/Nx/NxInactivateModal";
import {
  getIrApprovalHierarchy,
  getDetailIrApprovalHierarchy
} from "../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import NxHistoryModal from "../../../../../../../components/Nx/NxHistoryModal";

const InvoiceRelation = ({ id = 0, idCustomer = 0 }) => {
  const dispatch = useDispatch();

  const { data_irApprovalHistory } = useSelector(
    (state) => state.financialInformation
  );

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateIrId, setInactivateIrId] = useState(0);
  const [inactivateIrAccountNumber, setInactivateIrAccountNumber] = useState(0);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] =
    useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

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
   * Derives tab options for the history modal from `dataApprovalHistoryFix.dataApprover` keys.
   * @returns {{ key: string, value: string, label: string }[]}
   */
  const handleApprovalHistoryOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      key: item,
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
      label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
    }));
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

  // Reshape raw API approval history into { create, inactive } buckets.
  useEffect(() => {
    if (data_irApprovalHistory && data_irApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_irApprovalHistory?.dataApprover?.INVOICE_RELATION || [],
          inactive:
            data_irApprovalHistory?.dataApprover?.INACTIVE_INVOICE_RELATION ||
            []
        },
        dataHistory: {
          create: data_irApprovalHistory?.dataHistory?.INVOICE_RELATION || [],
          inactive:
            data_irApprovalHistory?.dataHistory?.INACTIVE_INVOICE_RELATION || []
        }
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_irApprovalHistory]);

  return (
    <Fragment>
      <InvoiceRelationTable
        idAccount={id}
        idCustomer={idCustomer}
        handleInactivateModal={handleInactivateModal}
        handleApprovalHistoryModal={handleApprovalHistoryModal}
        handleApproval={setShowApprovalModal}
        refreshSignal={refreshSignal}
      />

      <InvoiceRelationApprovalModal
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
        customMessage={`Are you sure you want to inactivate invoice relation - ${inactivateIrAccountNumber}?`}
        onFinish={({ remark, appHierId }, handleClear) =>
          handleInactivateIr({ remark, appHierId }, handleClear)
        }
        named={inactivateIrAccountNumber}
        menu="invoice relation"
        sliceName="invoiceRelation"
        approvalOptionsStateName="data_irApprovalHierarchy"
        approvalHierarchtDetailsStateName="detail_irApprovalHierarchy"
        getApprovalOptions={getIrApprovalHierarchy}
        getApprovalHierarchyDetails={getDetailIrApprovalHierarchy}
      />

      {/* Approval History Modal */}
      <NxHistoryModal
        isOpen={showApprovalHistoryModal}
        handleClose={() => handleApprovalHistoryModal(false)}
        header={"Approval History"}
        tabOptions={handleApprovalHistoryOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
    </Fragment>
  );
};

export default memo(InvoiceRelation);
