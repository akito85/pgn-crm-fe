import { memo, useEffect } from "react";
import { useState } from "react";
import MultiDestinationTable from "./MultiDestinationTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getMdApprovalHistory,
  inactivateMultiDestination,
  getMdApprovalHierarchy,
  getDetailMdApprovalHierarchy
} from "../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import MultiDestinationApprovalModal from "./MultiDestinationApprovalModal";
import NxInactivateModal from "../../../../../../components/Nx/NxInactivateModal";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";

/**
 * Multi destination list table module
 * @param {{ accountId: number; customerId: number }} props
 * @returns
 */
const MultiDestination = ({ accountId, customerId }) => {
  // --- Hooks ---
  const location = useLocation();
  const dispatch = useDispatch();

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const { data_mdApprovalHistory } = useSelector((state) => state.multiDestination);

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateMdId, setInactivateMdId] = useState(0);
  const [inactivateMdAccountNumber, setInactivateMdAccountNumber] = useState(0);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  // --- Functions / handlers ---
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} mdId
   * @param {string} mdAccountNumber
   */
  const handleInactivateModal = (
    show,
    newMdId = 0,
    newMdAccountNumber = ""
  ) => {
    if (show) {
      setInactivateMdId(newMdId);
      setInactivateMdAccountNumber(newMdAccountNumber);
      setShowInactiveModal(true);
    } else {
      setInactivateMdId(0);
      setInactivateMdAccountNumber("");
      setShowInactiveModal(false);
    }
  };

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivateMd = ({ remark, appHierId }, handleClear) => {
    const body = {
      id: inactivateMdId,
      appHierId,
      remark
    };

    dispatch(
      inactivateMultiDestination({
        body
      })
    )
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
   * @param {number} mdId
   */
  const handleApprovalHistoryModal = (show, mdId = 0) => {
    if (show) {
      dispatch(getMdApprovalHistory(mdId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (isStandard) {
      dispatch(
        getGrantedAccessAccount(
          `/account-management/account-standard/multi-destination`
        )
      );
    } else if (isOneTime) {
      dispatch(
        getGrantedAccessAccount(
          `/account-management/account-onetime/multi-destination`
        )
      );
    }
  }, []);

  // Reshape raw API approval history into { create, inactive } buckets.
  useEffect(() => {
    if (data_mdApprovalHistory && data_mdApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_mdApprovalHistory?.dataApprover?.MULTI_DESTINATION || [],
          inactive:
            data_mdApprovalHistory?.dataApprover?.INACTIVE_MULTI_DESTINATION ||
            []
        },
        dataHistory: {
          create: data_mdApprovalHistory?.dataHistory?.MULTI_DESTINATION || [],
          inactive:
            data_mdApprovalHistory?.dataHistory?.INACTIVE_MULTI_DESTINATION ||
            []
        }
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_mdApprovalHistory]);

  return (
    <NxCardContainer header={"MULTI DESTINATION"}>
      <NxBaseContainer border>
        <MultiDestinationTable
          accountId={accountId}
          customerId={customerId}
          handleInactivateModal={handleInactivateModal}
          handleApprovalHistoryModal={handleApprovalHistoryModal}
          handleApproval={setShowApprovalModal}
          refreshSignal={refreshSignal}
        />

        <MultiDestinationApprovalModal
          accountId={accountId}
          isOpen={showApprovalModal}
          handleCancel={() => setShowApprovalModal(false)}
          afterFinish={triggerRefresh}
        />

        {/* Inactivate Modal */}
        <NxInactivateModal
          isOpen={showInactiveModal}
          header={"INACTIVATE"}
          handleCloseModal={() => handleInactivateModal(false)}
          customMessage={`Are you sure you want to inactivate multi destination - ${inactivateMdAccountNumber}?`}
          onFinish={({ remark, appHierId }, handleClear) =>
            handleInactivateMd({ remark, appHierId }, handleClear)
          }
          named={inactivateMdAccountNumber}
          menu="multi destination"
          sliceName="multiDestination"
          approvalOptionsStateName="list_mdApprovalOptions"
          approvalHierarchtDetailsStateName="list_mdApprovalHierarchyDetail"
          loadingListApprovalOptionsName="loading_listMdApprovalOption"
          loadingListHierarchyDetailName="loading_listMdApprovalHierarchyDetail"
          loadingInactivateName="loading_inactivateMd"
          getApprovalOptions={getMdApprovalHierarchy}
          getApprovalHierarchyDetails={getDetailMdApprovalHierarchy}
        />

        {/* Approval History Modal */}
        <NxHistoryModal
          isOpen={showApprovalHistoryModal}
          handleClose={() => handleApprovalHistoryModal(false)}
          header={"Approval History"}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default memo(MultiDestination);
