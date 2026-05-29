import { memo, useEffect } from "react";
import { useState } from "react";
import GasDepositTable from "./GasDepositTable";
import { useDispatch, useSelector } from "react-redux";
import NxHistoryModal from "../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTabs from "../../../../components/Nx/NxTabs";
import NxModal from "../../../../components/Nx/NxModal";
import NxDetailText from "../../../../components/Nx/NxDetailText";
import NxDate from "../../../../components/Nx/NxDatePicker";
import SummaryBalanceTable from "./SummaryBalanceTable";

/**
 * Top-level Gas Deposit module container. Renders a Gas Deposit List tab and a
 * Recalculate/Expire History tab. Supports standalone ("sa") and under-account
 * ("ua") contexts; account sub-type is inferred from the URL. Wrapped with `React.memo`.
 *
 * @param {{ accountId?: number; customerId?: number }} props
 */
const GasDeposit = ({ accountId, customerId }) => {
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

  // --- Derived values ---
  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

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

  // --- Effects ---
  // Resolve the route-based path and fetch the user's granted access permissions.
  useEffect(() => {
    let path;
    if (isStandard)
      path = "/account-management/account-standard/gas-deposit";
    else if (isOneTime)
      path = "/account-management/account-onetime/gas-deposit";

    if (path)
      dispatch(getGrantedAccessAccount(path));
  }, []);

  const tabOptions = [
    {
      key: 0,
      label: "Gas Deposit",
      children: (
        <>
          <NxBaseContainer border>
            <GasDepositTable
              accountId={accountId}
              customerId={customerId}
              handleApproval={setShowApprovalModal}
              refreshSignal={refreshSignal}
            />
          </NxBaseContainer>
        </>
      )
    },
    {
      key: 1,
      label: "Summary Balance",
      children: (
        <>
          <NxBaseContainer border>
            <SummaryBalanceTable
              accountId={accountId}
              customerId={customerId}
              handleApproval={setShowApprovalModal}
              refreshSignal={refreshSignal}
            />
          </NxBaseContainer>    
        </>
      )
    },
    {
      key: 2,
      label: "History",
      children: (
        <>
          <NxBaseContainer border>
            <GasDepositTable
              accountId={accountId}
              customerId={customerId}
              handleApproval={setShowApprovalModal}
              refreshSignal={refreshSignal}
            />
          </NxBaseContainer>    
        </>
      )
    },
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
      <NxCardContainer header="GAS DEPOSIT LIST" withoutPadding>
        <NxTabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabOptions}
        />
      </NxCardContainer>

      {/* Nx Card container ini hanya tampil ketika user klik view detail dari GasDepositTable, dan NxCardContainer ini bisa di colapse */}
      <NxCardContainer header="GAS DEPOSIT DETAIL" withoutPadding> 
        <NxBaseContainer border>
          <h1>Lorem Ipsum</h1>
        </NxBaseContainer>
      </NxCardContainer>

      {/* Nx Card container ini hanya tampil ketika user klik view detail dari GasDepositTable, dan NxCardContainer ini bisa di colapse */}
      <NxCardContainer header="MUTATION DETAIL" withoutPadding>
        <NxBaseContainer border>
          <h1>Lorem Ipsum</h1>
        </NxBaseContainer>
      </NxCardContainer>

      {/* Nx Card container ini hanya tampil ketika user klik view detail dari GasDepositTable */}
      <NxCardContainer header="HISTORY LOG INFORMATION" withoutPadding>
        <NxBaseContainer border>
          <h1>Lorem Ipsum</h1>
        </NxBaseContainer>
      </NxCardContainer>
    </div>
  );
};

export default memo(GasDeposit);
