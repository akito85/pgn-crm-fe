import { memo, useEffect } from "react";
import { useState } from "react";
import GasDepositTable from "./GasDepositTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getGdApprovalHistory,
  inactivateGasDeposit,
  getGdApprovalHierarchy,
  getDetailGdApprovalHierarchy,
} from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import GasDepositApprovalModal from "./GasDepositApprovalModal";
import NxInactivateModal from "../../../../components/Nx/NxInactivateModal";
import NxHistoryModal from "../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import GasDepositDetailMutationTable from "./GasDepositDetailMutationTable";
import SVGIcon from "../../../../assets/Icon/index";

/**
 * Gas deposit list table module
 * @param {{ moduleType: "sa" | "ua"; id?: number; idCustomer?: number }} props
 * @returns
 */
const GasDepositModule = ({ moduleType, id = 0, idCustomer = 0 }) => {
  // --- Hooks ---
  const location = useLocation();
  const dispatch = useDispatch();
  const { data_gdApprovalHistory } = useSelector((state) => state.gasDeposit);

  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateGdId, setInactivateGdId] = useState(0);
  const [inactivateGdAccountNumber, setInactivateGdAccountNumber] = useState(0);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [selectedDetailId, setSelectedDetailId] = useState();

  // --- Derived values ---
  const isStandAlone = moduleType === "sa";
  const isUnderAccount = moduleType === "ua";
  const isStandard = isUnderAccount && location.pathname.includes("account-standard");
  const isOneTime = isUnderAccount && location.pathname.includes("account-onetime");

  // --- Functions / handlers ---
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  /**
   * Stores the selected record's ID to show the detail mutation table below the main table.
   * @param {object} record - The clicked table row record
   */
  const handleSelectDetail = (record) => {
    setSelectedDetailId(record.id);
  };

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} gdId
   * @param {string} gdAccountNumber
   */
  const handleInactivateModal = (
    show,
    newGdId = 0,
    newGdAccountNumber = ""
  ) => {
    if (show) {
      setInactivateGdId(newGdId);
      setInactivateGdAccountNumber(newGdAccountNumber);
      setShowInactiveModal(true);
    } else {
      setInactivateGdId(0);
      setInactivateGdAccountNumber("");
      setShowInactiveModal(false);
    }
  };

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivateGd = ({ remark, appHierId }, handleClear) => {
    const body = {
      id: inactivateGdId,
      appHierId,
      remark,
    };

    dispatch(inactivateGasDeposit({ body }))
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
      label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  /**
   * @param {boolean} show
   * @param {number} gdId
   */
  const handleApprovalHistoryModal = (show, gdId = 0) => {
    if (show) {
      dispatch(getGdApprovalHistory(gdId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
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

  // Reshape raw API approval history into { create, inactive } buckets.
  useEffect(() => {
    if (data_gdApprovalHistory && data_gdApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_gdApprovalHistory?.dataApprover?.GAS_DEPOSIT || [],
          inactive:
            data_gdApprovalHistory?.dataApprover?.INACTIVE_GAS_DEPOSIT || [],
        },
        dataHistory: {
          create: data_gdApprovalHistory?.dataHistory?.GAS_DEPOSIT || [],
          inactive:
            data_gdApprovalHistory?.dataHistory?.INACTIVE_GAS_DEPOSIT || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_gdApprovalHistory]);

  return (
    <>
      <NxCardContainer header={"GAS DEPOSIT"}>
        <SVGIcon name="IconExtend" color="black" />

        <NxBaseContainer border>
          <GasDepositTable
            moduleType={moduleType}
            idAccount={id}
            idCustomer={idCustomer}
            refreshSignal={refreshSignal}
          />
        </NxBaseContainer>
      </NxCardContainer>

      {/* Detail mutation table — rendered only when a row is selected */}
      {selectedDetailId && (
        <NxCardContainer header={"GAS DEPOSIT DETAIL MUTATION"}>
          <NxBaseContainer border>
            <GasDepositDetailMutationTable
              detailId={selectedDetailId}
            />
          </NxBaseContainer>
        </NxCardContainer>
      )}

      <GasDepositApprovalModal
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
        customMessage={`Are you sure you want to inactivate gas deposit - ${inactivateGdAccountNumber}?`}
        onFinish={({ remark, appHierId }, handleClear) =>
          handleInactivateGd({ remark, appHierId }, handleClear)
        }
        named={inactivateGdAccountNumber}
        menu="gas deposit"
        sliceName="gasDeposit"
        approvalOptionsStateName="data_gdApprovalHierarchy"
        approvalHierarchtDetailsStateName="detail_gdApprovalHierarchy"
        getApprovalOptions={getGdApprovalHierarchy}
        getApprovalHierarchyDetails={getDetailGdApprovalHierarchy}
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
    </>
  );
};

/**
 * Gas deposit list table page/module
 * @param {{ moduleType: "sa" | "ua"; id?: number; idCustomer?: number }} props
 * @returns
 */
const GasDeposit = ({ moduleType, id = 0, idCustomer = 0 }) => {
  if (moduleType === "sa")
    return (
      <div>
        <GasDepositModule
          moduleType={moduleType}
          id={id}
          idCustomer={idCustomer}
        />
      </div>
    );
  else if (moduleType === "ua")
    return (
      <GasDepositModule
        moduleType={moduleType}
        id={id}
        idCustomer={idCustomer}
      />
    );
  return null;
};

export default memo(GasDeposit);
