import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GasDepositDetailTabs from "./GasDepositDetailTabs";
import { getCustomerDetail } from "../../../../../redux/slices/account_management/Customer/customerAccount";
import NxDate from "../../../../../components/Nx/NxDatePicker";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
  getGrantedAccessAccount
} from "../../../../../redux/slices/account_management/accountManagement";
import {
  getDetailGasDeposit,
  getDetailDraftGasDeposit,
  approveOrRejectGasDeposit,
  approveOrRejectInactiveGasDeposit
} from "../../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import { showModalError } from "../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../components/Nx/NxApproveOrRejectModal";
import NxTabs from "../../../../../components/Nx/NxTabs";
import HeaderDetail from "../../CustomerAccountDetail/HeaderDetail";
import GasDepositDetailMutationTable from "../GasDepositDetailMutationTable";
import GasDepositDetailTable from "../GasDepositDetailTable";

/**
 * Gas deposit detail view (container + presentational component).
 * Fetches original and draft records, supports approve/reject workflow.
 *
 * @param {object}                    props
 * @param {"sa"|"ua"}                 props.moduleType   - Module context: standalone ("sa") or under-account ("ua")
 * @param {"standard"|"oneTime"}      [props.accountType] - Account type (only relevant when moduleType is "ua")
 */
const GasDepositDetail = ({ moduleType, accountType }) => {
  // --- Hooks ---
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { detail_gasDeposit, detailDraft_gasDeposit } = useSelector((state) => state.gasDeposit);
  const { loading, loadingAccount } = useSelector((state) => state.customerAccount);

  // --- Derived values ---
  const isStandAlone = moduleType === "sa";
  const isUnderAccount = moduleType === "ua";
  const isStandard = isUnderAccount && accountType === "standard";
  const isOneTime = isUnderAccount && accountType === "oneTime";
  const isLoading = loading || loadingAccount;
  const idAccount = location.state?.idAccount;
  const idCustomer = location.state?.idCustomer;
  const idGd = location.state?.id;

  const tabOptions = [
    {
      key: "ori",
      label: "Original"
    },
    {
      key: "cur",
      label: "Current"
    }
  ];

  const originalKey = tabOptions[0].key;

  // --- State ---
  const [activeKey, setActiveKey] = useState(originalKey || "");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [selectedDetailId, setSelectedDetailId] = useState();

  // Computed (depends on state + selectors)
  const detail =
    (activeKey === originalKey ? detail_gasDeposit : detailDraft_gasDeposit) ||
    {};

  const { status, statusApproval } = detail_gasDeposit;

  const {
    approvalType,
    relatedAccountNumber,
    id,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
    tappId,
    details,
  } = detail;

  const routes = [
    {
      path: "",
      breadcrumbName: "Account"
    },
    {
      path: isStandAlone
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_GAS_DEPOSIT_SA
        : isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME
            : "",
      breadcrumbName: isStandAlone
        ? "Gas Deposit"
        : isStandard
          ? "Account - Standard"
          : isOneTime
            ? "Account - One Time"
            : ""
    },
    isUnderAccount && {
      path: isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
        : isOneTime
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
          : "",
      breadcrumbName: "Detail Account"
    },
    {
      path: "",
      breadcrumbName: "Detail Gas Deposit"
    }
  ].filter(Boolean);

  const draftExist =
    status &&
    status !== "DRAFT" &&
    statusApproval &&
    statusApproval !== "APPROVED";
  const isApproval = ["GAS_DEPOSIT", "INACTIVE_GAS_DEPOSIT"].includes(
    approvalType
  );

  // --- Handlers ---
  /**
   * Switches the active detail tab between Original and Current.
   * @param {string} newActiveKey
   */
  const handleSetActiveKey = (newActiveKey) => {
    setActiveKey(newActiveKey);
  };

  /**
   * Opens or closes the approval/rejection modal.
   * @param {boolean}            show   - true to open, false to close
   * @param {"approve"|"reject"} [action] - Which action to arm
   */
  const handleApprovalModal = (show, action) => {
    if (show) {
      setShowApprovalModal(true);
      setApproveOrReject(action);
    } else {
      setShowApprovalModal(false);
      setApproveOrReject("");
    }
  };

  /**
   * Dispatches approve or reject for the current gas deposit record.
   * @param {string}             description - Remark entered in the approval form
   * @param {"approve"|"reject"} action
   * @param {Function}           handleClear - Resets the form after successful submission
   */
  const handleApproveOrReject = (description, action, handleClear) => {
    const body = [
      {
        id,
        approvalId: tappId,
        action: action.toUpperCase(),
        description
      }
    ];

    if (approvalType === "GAS_DEPOSIT") {
      dispatch(
        approveOrRejectGasDeposit({
          body,
          action
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getDetailGasDeposit(idGd));
          dispatch(getDetailDraftGasDeposit(idGd));
          handleClear();
          handleApprovalModal(false);
        })
        .catch(() => {});
    } else if (approvalType === "INACTIVE_GAS_DEPOSIT") {
      dispatch(
        approveOrRejectInactiveGasDeposit({
          body,
          action
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getDetailGasDeposit(idGd));
          dispatch(getDetailDraftGasDeposit(idGd));
          handleClear();
          handleApprovalModal(false);
        })
        .catch(() => {});
    } else {
      const errorBody = {
        title: "Failed",
        description: `The approval type is invalid.`
      };

      dispatch(showModalError(errorBody));
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (isStandAlone)
      dispatch(getGrantedAccessAccount("/account-management/gas-deposit"));
    else if (isUnderAccount) {
      if (isStandard)
        dispatch(
          getGrantedAccessAccount(
            "/account-management/account-standard/gas-deposit"
          )
        );
      else if (isOneTime)
        dispatch(
          getGrantedAccessAccount(
            "/account-management/account-onetime/gas-deposit"
          )
        );
    }
  }, [dispatch]);

  useEffect(() => {
    if (isUnderAccount && idCustomer) dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (isUnderAccount && idAccount && idCustomer) {
      if (isStandard) {
        dispatch(getAccountStandardDetail({ idAccount, idCustomer }));
      } else if (isOneTime) {
        dispatch(getAccountOneTimeDetail({ idAccount, idCustomer }));
      }
    }
  }, [idAccount, idCustomer]);

  useEffect(() => {
    if (idGd)
      dispatch(getDetailGasDeposit(idGd))
  }, [idGd]);

  useEffect(() => {
    if (idGd && draftExist)
      dispatch(getDetailDraftGasDeposit(idGd));
  }, [idGd, draftExist])

  return (
    <>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          {isUnderAccount && (
            <HeaderDetail
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              dispatch={dispatch}
              idAccount={idAccount}
              idCustomer={idCustomer}
              type={accountType}
            />
          )}
          {draftExist && (
            <NxBaseContainer border padding={false}>
              <NxTabs
                items={tabOptions}
                activeKey={activeKey}
                onChange={handleSetActiveKey}
              />
            </NxBaseContainer>
          )}
          <GasDepositDetailTabs detail={detail} />

          {activeKey === originalKey && (
            <>
              <NxCardContainer header={"GAS DEPOSIT DETAIL"}>
                <NxBaseContainer border>
                  <GasDepositDetailTable
                    dataSource={details}
                  />
                </NxBaseContainer>
              </NxCardContainer>
              {selectedDetailId && (
                <NxCardContainer header={"GAS DEPOSIT DETAIL MUTATION"}>
                  <NxBaseContainer border>
                    <GasDepositDetailMutationTable
                      detailId={selectedDetailId}
                      />
                  </NxBaseContainer>
                </NxCardContainer>
              )}
            </>
          )}

          {/* Detail mutation table — rendered only when a row is selected */}

          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-5 gap-4">
                {/* History Log Information */}
                <NxDetailText label="Record Id">{id}</NxDetailText>
                <NxDetailText label="Created Date">
                  {NxDate.formatDate(createdDate)}
                </NxDetailText>
                <NxDetailText label="Created By">{createdBy}</NxDetailText>
                <NxDetailText label="Updated Date">
                  {NxDate.formatDate(updatedDate)}
                </NxDetailText>
                <NxDetailText label="Updated By">{updatedBy}</NxDetailText>
              </div>
            </NxBaseContainer>
          </NxCardContainer>

          {isApproval && (
            <NxBaseContainer border>
              <div className="flex justify-between">
                <Button type={"menu"} onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <div className={"w-full flex justify-end gap-5"}>
                  <Button
                    type="reject"
                    onClick={() => handleApprovalModal(true, "reject")}
                  >
                    Reject
                  </Button>
                  <Button
                    type="approve"
                    onClick={() => handleApprovalModal(true, "approve")}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </NxBaseContainer>
          )}
        </div>
      </Spin>
      <NxApproveOrRejectModal
        isOpen={showApprovalModal}
        header={
          approveOrReject === "approve"
            ? "Approve"
            : approveOrReject === "reject"
              ? "Reject"
              : ""
        }
        handleCloseModal={() => handleApprovalModal(false)}
        customMessage={`Are you sure you want to ${approveOrReject} gas deposit - ${relatedAccountNumber}?`}
        onFinish={({ remark }, handleClear) =>
          handleApproveOrReject(remark, approveOrReject, handleClear)
        }
      />
    </>
  );
};

export default GasDepositDetail;
