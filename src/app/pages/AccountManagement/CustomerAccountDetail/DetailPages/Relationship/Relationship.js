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
import {
  getStandaloneRelationshipApprovalHistory,
  inactivateStandaloneRelationship,
  getStandaloneRelationshipApprovalHierarchies,
  getStandaloneRelationshipApprovalHierarchy,
} from "../../../../../../redux/slices/relationship/standaloneRelationshipSlice";
import NxActivateInactivateModal from "../../../../../../components/Nx/NxActivateInactivateModal";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import RelationshipApprovalModal from "./RelationshipApprovalModal";

/**
 * Relationship list table module.
 * When isStandalone=true, operates without an account context (cross-account list).
 *
 * @param {{ accountId: number; customerId: number; isStandalone: boolean }} props
 */
const Relationship = ({
  accountId,
  customerId,
  isStandalone = false,
}) => {
  // --- Hooks ---
  const location = useLocation();
  const dispatch = useDispatch();

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const sliceKey = isStandalone ? "standaloneRelationship" : "relationship";
  const { detail_relationshipApprovalHistory } = useSelector((state) => state[sliceKey]);

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateId, setInactivateId] = useState(0);
  const [inactivateNumber, setInactivateNumber] = useState("");

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  // --- Functions / handlers ---
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  const handleInactivateModal = (show, relationshipId = 0, relatedNumber = "") => {
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

  const handleInactivate = ({ remark, appHierId }, handleClear) => {
    const body = { id: inactivateId, appHierId, remark };

    if (isStandalone) {
      dispatch(inactivateStandaloneRelationship({ body, onSuccess: () => {
        setShowInactiveModal(false);
        triggerRefresh();
        handleClear();
      }}));
    } else {
      dispatch(inactivateRelationship({ accountId, body }))
        .unwrap()
        .then(() => {
          setShowInactiveModal(false);
          triggerRefresh();
          handleClear();
        })
        .catch(() => {});
    }
  };

  const handleApprovalHistoryModal = (show, relationshipId = 0) => {
    if (show) {
      if (isStandalone) {
        dispatch(getStandaloneRelationshipApprovalHistory({ relationshipId }));
      } else {
        dispatch(getRelationshipApprovalHistory({ accountId, relationshipId }));
      }
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (isStandalone) {
      dispatch(getGrantedAccessAccount("/relationship"));
    } else if (isStandard) {
      dispatch(getGrantedAccessAccount("/account-management/account-standard/relationship"));
    } else if (isOneTime) {
      dispatch(getGrantedAccessAccount("/account-management/account-onetime/relationship"));
    }
  }, []);

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
          isStandalone={isStandalone}
        />

        <RelationshipApprovalModal
          accountId={accountId}
          isOpen={showApprovalModal}
          handleCancel={() => setShowApprovalModal(false)}
          afterFinish={triggerRefresh}
          isStandalone={isStandalone}
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
          sliceName={sliceKey}
          approvalOptionsName="list_relationshipApprovalHierarchy"
          approvalHierarchtDetailsName="detail_relationshipApprovalHierarchy"
          loadingInactivateName="loading_inactivateRelationship"
          loadingListApprovalOptionsName="loading_listRelationshipApprovalHierarchy"
          loadingListHierarchyDetailName="loading_detailRelationshipApprovalHierarchy"
          getApprovalOptions={isStandalone ? getStandaloneRelationshipApprovalHierarchies : getRelationshipApprovalHierarchies}
          getApprovalHierarchyDetails={isStandalone ? getStandaloneRelationshipApprovalHierarchy : getRelationshipApprovalHierarchy}
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
