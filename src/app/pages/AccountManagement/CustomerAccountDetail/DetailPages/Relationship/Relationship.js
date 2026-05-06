import { memo, useEffect } from "react";
import { useState } from "react";
import RelationshipTable from "./RelationshipTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getRelationshipApprovalHistory,
  inactivateRelationship,
  getRelationshipApprovalHierarchies,
  getRelationshipApprovalHierarchy,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import NxActivateInactivateModal from "../../../../../../components/Nx/NxActivateInactivateModal";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import RelationshipApprovalModal from "./RelationshipApprovalModal";

/**
 * Relationship list table module
 * @param {{ accountId: number; customerId: number; type: string }} props
 * @returns
 */
const Relationship = ({
  accountId,
  customerId,
}) => {
  // --- Hooks ---
  const location = useLocation();
  const dispatch = useDispatch();

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const { detail_relationshipApprovalHistory } = useSelector((state) => state.relationship);

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateId, setInactivateId] = useState(0);
  const [inactivateNumber, setInactivateNumber] = useState("");

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  // --- Functions / handlers ---
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} relationshipId
   * @param {string} name
   */
  const handleInactivateModal = (show, relationshipId = 0, relatedNumber = "") => {
    console.log({show, relationshipId, relatedNumber});
    if (show) {
      setInactivateId(relationshipId);
      setInactivateNumber(relatedNumber);
      setShowInactiveModal(true);
    } else {
      setInactivateId(0);
      setInactivateNumber("");
      setShowInactiveModal(false);
    }
  };

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivate = ({ remark, appHierId }, handleClear) => {
    const body = {
      id: inactivateId,
      appHierId,
      remark,
    };

    dispatch(
      inactivateRelationship({
        accountId,
        body,
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
   * @param {number} relationshipId
   */
  const handleApprovalHistoryModal = (show, relationshipId = 0) => {
    if (show) {
      dispatch(getRelationshipApprovalHistory({ accountId, relationshipId }));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (isStandard) {
      dispatch(
        getGrantedAccessAccount(`/account-management/account-standard/relationship`)
      );
    } else if (isOneTime) {
      dispatch(
        getGrantedAccessAccount(`/account-management/account-onetime/relationship`)
      );
    }
  }, []);

  // Reshape raw API approval history into { create, inactive } buckets.
  useEffect(() => {
    if (detail_relationshipApprovalHistory && detail_relationshipApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: detail_relationshipApprovalHistory?.dataApprover?.ACCOUNT_RELATIONSHIP || [],
          inactive: detail_relationshipApprovalHistory?.dataApprover?.INACTIVE_ACCOUNT_RELATIONSHIP || [],
        },
        dataHistory: {
          create: detail_relationshipApprovalHistory?.dataHistory?.ACCOUNT_RELATIONSHIP || [],
          inactive: detail_relationshipApprovalHistory?.dataHistory?.INACTIVE_ACCOUNT_RELATIONSHIP || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [detail_relationshipApprovalHistory]);

  return (
    <NxCardContainer header={"RELATIONSHIP LIST"}>
      <NxBaseContainer border>
        <RelationshipTable
          accountId={accountId}
          customerId={customerId}
          refreshSignal={refreshSignal}
          handleInactivateModal={handleInactivateModal}
          handleApprovalHistoryModal={handleApprovalHistoryModal}
          handleApproval={setShowApprovalModal}
        />

        <RelationshipApprovalModal
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
          customMessage={`Are you sure you want to inactivate relationship - ${inactivateNumber}?`}
          onFinish={({ remark, appHierId }, handleClear) => handleInactivate({ remark, appHierId }, handleClear)}
          named={inactivateNumber}
          menu="relationship"
          sliceName="relationship"
          approvalOptionsName="list_relationshipApprovalHierarchy"
          approvalHierarchtDetailsName="detail_relationshipApprovalHierarchy"
          loadingInactivateName="loading_inactivateRelationship"
          loadingListApprovalOptionsName="loading_listRelationshipApprovalHierarchy"
          loadingListHierarchyDetailName="loading_detailRelationshipApprovalHierarchy"
          getApprovalOptions={getRelationshipApprovalHierarchies}
          getApprovalHierarchyDetails={getRelationshipApprovalHierarchy}
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

export default memo(Relationship);
