import { memo, useEffect } from "react";
import { useState } from "react";
import GasDepositTable from "./GasDepositTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getGasDepositHistory,
  getGdApprovalHistory,
} from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import GasDepositApprovalModal from "./GasDepositApprovalModal";
import NxHistoryModal from "../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTabs from "../../../../components/Nx/NxTabs";
import GasDepositHistoryTable from "./GasDepositHistoryTable";
import NxModal from "../../../../components/Nx/NxModal";
import NxDetailText from "../../../../components/Nx/NxDetailText";
import NxDate from "../../../../components/Nx/NxDatePicker";

/**
 * Top-level Gas Deposit module container. Renders a Gas Deposit List tab and a
 * Recalculate/Expire History tab. Supports standalone ("sa") and under-account
 * ("ua") contexts; account sub-type is inferred from the URL. Wrapped with `React.memo`.
 *
 * @param {{ moduleType: "sa" | "ua"; accountId?: number; customerId?: number }} props
 */
const GasDeposit = ({ moduleType, accountId, customerId }) => {
  // --- Hooks ---
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    detail_gdApprovalHistory,
    loading_detailGdHistory,
    detail_gasDepositHistory,
  } = useSelector((state) => state.gasDeposit);

  // --- State ---
  const [activeKey, setActiveKey] = useState(0);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false);

  // --- Derived values ---
  const isStandAlone = moduleType === "sa";
  const isUnderAccount = moduleType === "ua";
  const isStandard = isUnderAccount && location.pathname.includes("account-standard");
  const isOneTime = isUnderAccount && location.pathname.includes("account-onetime");

  const {
    period,
    balanceM3,
    balanceMscf,
    balanceMmbtu,
    balanceAmmount,
    availableAmount,
    remark,
    id,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy
  } = detail_gasDepositHistory;

  // --- Functions / handlers ---
  /** Increments the refresh signal to trigger a page-0 re-fetch in child tables. */
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  /**
   * @param {boolean} show
   * @param {number} historyId
   */
  const handleApprovalHistoryModal = ({ show, historyId }) => {
    if (show) {
      if (historyId)
        dispatch(getGdApprovalHistory(historyId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

  /**
   * @param {boolean} show
   * @param {number} historyId
   */
  const handleHistoryDetailModal = ({ show, historyId }) => {
    if (show) {
      if (historyId) {
        dispatch(getGasDepositHistory(historyId));
        setShowHistoryDetailModal(true);
      }
    } else {
      setShowHistoryDetailModal(false);
    }
  };

  // --- Effects ---
  // Resolve the route-based path and fetch the user's granted access permissions.
  useEffect(() => {
    let path;
    if (isStandAlone)
      path = "/account-management/gas-deposit";
    else if (isStandard)
      path = "/account-management/account-standard/gas-deposit";
    else if (isOneTime)
      path = "/account-management/account-onetime/gas-deposit";

    if (path)
      dispatch(getGrantedAccessAccount(path));
  }, []);

  const tabOptions = [
    {
      key: 0,
      label: "Gas Deposit List",
      children: (
        <>
          <NxBaseContainer border>
            <GasDepositTable
              moduleType={moduleType}
              accountId={accountId}
              customerId={customerId}
              handleApproval={setShowApprovalModal}
              refreshSignal={refreshSignal}
            />
          </NxBaseContainer>
    
          <GasDepositApprovalModal
            accountId={accountId}
            isOpen={showApprovalModal}
            isUnderAccount={isUnderAccount}
            handleCancel={() => setShowApprovalModal(false)}
            afterFinish={triggerRefresh}
          />
        </>
      )
    },
    {
      key: 1,
      label: "Recalculate/Expire Request History",
      children: (
        <>
          <NxBaseContainer border>
            <GasDepositHistoryTable
              accountId={accountId}
              handleApprovalHistoryModal={handleApprovalHistoryModal}
              handleDetailModal={handleHistoryDetailModal}
              refreshSignal={refreshSignal}
              moduleType={moduleType}
            />
          </NxBaseContainer>
          
          {/* Detail Modal */}
          <NxModal
            isOpen={showHistoryDetailModal}
            title="DETAIL GAS DEPOSIT"
            loading={loading_detailGdHistory}
            handleCancel={(() => handleHistoryDetailModal(false))}
          >
            <div className="flex flex-col gap-y-4 p-4">

              <NxBaseContainer border header="GAS DEPOSIT DETAIL">
                <div className="grid grid-cols-3">
                  <NxDetailText label="Period">
                    {period}
                  </NxDetailText>
                  <NxDetailText label="Balance (M3)">
                    {balanceM3}
                  </NxDetailText>
                  <NxDetailText label="Balance (MSCF)">
                    {balanceMscf}
                  </NxDetailText>
                  <NxDetailText label="Balance (MMBTU)">
                    {balanceMmbtu}
                  </NxDetailText>
                  <NxDetailText label="Balance Amount">
                    {balanceAmmount}
                  </NxDetailText>
                  <NxDetailText label="Available Amount">
                    {availableAmount}
                  </NxDetailText>
                </div>
                <NxDetailText label="Remark">
                  {remark}
                </NxDetailText>
              </NxBaseContainer>
              <NxBaseContainer border header="HISTORY INFORMATION">
                <div className="grid grid-cols-5">
                  <NxDetailText label="Record ID">
                    {id}
                  </NxDetailText>
                  <NxDetailText label="Created Date">
                    {NxDate.formatDate(createdDate, "DD MMM YYYY")}
                  </NxDetailText>
                  <NxDetailText label="Created By">
                    {createdBy}
                  </NxDetailText>
                  <NxDetailText label="Updated Date">
                    {NxDate.formatDate(updatedDate, "DD MMM YYYY")}
                  </NxDetailText>
                  <NxDetailText label="Updated By">
                    {updatedBy}
                  </NxDetailText>
                </div>
              </NxBaseContainer>
            </div>
          </NxModal>

          {/* Approval History Modal */}
          <NxHistoryModal
            isOpen={showApprovalHistoryModal}
            handleClose={() => handleApprovalHistoryModal(false)}
            header={"Approval History"}
            dataApprover={dataApprovalHistoryFix?.dataApprover}
            dataHistory={dataApprovalHistoryFix?.dataHistory}
          />
        </>
      )
    }
  ];

  // Reshape raw API approval history into { create, inactive } buckets.
  useEffect(() => {
    if (detail_gdApprovalHistory && detail_gdApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          recalculate: detail_gdApprovalHistory?.dataApprover?.RECALCULATE_GAS_DEPOSIT || [],
          expire:
            detail_gdApprovalHistory?.dataApprover?.EXPIRE_GAS_DEPOSIT || [],
        },
        dataHistory: {
          recalculate: detail_gdApprovalHistory?.dataHistory?.RECALCULATE_GAS_DEPOSIT || [],
          expire:
            detail_gdApprovalHistory?.dataHistory?.EXPIRE_GAS_DEPOSIT || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [detail_gdApprovalHistory]);

  return (
    <div className="flex flex-col gap-y-4">
      <NxCardContainer header="GAS DEPOSIT" withoutPadding>
        <NxTabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabOptions}
        />
      </NxCardContainer>
    </div>
  );
};

export default memo(GasDeposit);
