import { memo, useEffect } from "react";
import { useState } from "react";
import RelationshipTable from "./RelationshipTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getApprovalHistory,
  inactivateRelationship,
  getApprovalHierarchies,
  getApprovalHierarchyDetail,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import NxInactivateModal from "../../../../../../components/Nx/NxInactivateModal";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import RelationshipApprovalModal from "./RelationshipApprovalModal";

/**
 * Relationship list table module
 * @param {{ id: number; idCustomer: number; type: string }} props
 * @returns
 */
const Relationship = ({
  id = 0,
  idCustomer = 0,
  type = "standard",
}) => {
  // --- Hooks ---
  const location = useLocation();
  const dispatch = useDispatch();

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const { data_approvalHistory } = useSelector((state) => state.relationship);

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateId, setInactivateId] = useState(0);
  const [inactivateName, setInactivateName] = useState("");

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
  const handleInactivateModal = (show, relationshipId = 0, name = "") => {
    if (show) {
      setInactivateId(relationshipId);
      setInactivateName(name);
      setShowInactiveModal(true);
    } else {
      setInactivateId(0);
      setInactivateName("");
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
        accountId: id,
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
      dispatch(getApprovalHistory({ idAccount: id, relationshipId }));
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
    if (data_approvalHistory && data_approvalHistory?.dataApprover) {
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

  return (
    <NxCardContainer header={"RELATIONSHIP LIST"}>
      <NxBaseContainer border>
        <RelationshipTable
          idAccount={id}
          idCustomer={idCustomer}
          type={type}
          refreshSignal={refreshSignal}
          handleInactivateModal={handleInactivateModal}
          handleApprovalHistoryModal={handleApprovalHistoryModal}
          handleApproval={setShowApprovalModal}
        />

        <RelationshipApprovalModal
          idAccount={id}
          isOpen={showApprovalModal}
          handleCancel={() => setShowApprovalModal(false)}
          afterFinish={triggerRefresh}
        />

        {/* Inactivate Modal */}
        <NxInactivateModal
          isOpen={showInactiveModal}
          header={"INACTIVATE"}
          handleCloseModal={() => handleInactivateModal(false)}
          customMessage={`Are you sure you want to inactivate relationship - ${inactivateName}?`}
          onFinish={({ remark, appHierId }, handleClear) => handleInactivate({ remark, appHierId }, handleClear)}
          named={inactivateName}
          menu="relationship"
          sliceName="relationship"
          approvalOptionsStateName="data_approvalHierarchies"
          approvalHierarchtDetailsStateName="data_approvalHierarchyDetail"
          getApprovalOptions={getApprovalHierarchies}
          getApprovalHierarchyDetails={getApprovalHierarchyDetail}
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
