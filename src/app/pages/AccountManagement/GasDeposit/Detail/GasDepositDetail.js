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
  getGasDeposit,
  getGasDepositDraft,
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
import GasDepositDetailTable from "../GasDepositDetailTable";
import SVGIcon from "../../../../../assets/Icon/index";

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
  const accountId = location.state?.accountId;
  const customerId = location.state?.customerId;
  const id = location.state?.id;

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

  // Computed (depends on state + selectors)
  const detail =
    (activeKey === originalKey ? detail_gasDeposit : detailDraft_gasDeposit) ||
    {};

  const { status, statusApproval } = detail_gasDeposit;

  const {
    approvalType,
    relatedAccountNumber,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
    tappId,
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
          dispatch(getGasDeposit({ id }));
          dispatch(getGasDepositDraft({ id }));
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
          dispatch(getGasDeposit({ id }));
          dispatch(getGasDepositDraft({ id }));
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
    if (id)
      dispatch(getGasDeposit({ id }))
  }, [id]);

  useEffect(() => {
    if (id && draftExist)
      dispatch(getGasDepositDraft({ id }));
  }, [id, draftExist])

  return (
    <>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          {isUnderAccount && (
            <HeaderDetail
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              dispatch={dispatch}
              idAccount={accountId}
              idCustomer={customerId}
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
          
          <GasDepositDetailTabs id={id} detail={detail} versionActiveKey={activeKey} versionOriginalKey={originalKey} />

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

          <NxBaseContainer border>
            <div className="flex justify-between">
              {isApproval ? (
                <>
                  <Button type={"menu"} onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <div className={"w-full flex justify-end gap-x-2"}>
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
                </>
              ) :
              <Button type={"menu"} icon={<SVGIcon name="IconChevronLeft" width={14} />} onClick={() => navigate(-1)}>
                Back      
              </Button>}
            </div>
          </NxBaseContainer>
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
