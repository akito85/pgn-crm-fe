import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentRelationDetailTabs from "./PaymentRelationDetailTabs";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import { getPaymentRelation, approveOrRejectPaymentRelation, approveOrRejectInactivePaymentRelation, getPaymentRelationDraft } from "../../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import { showModalError } from "../../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../../../../components/Nx/NxApproveOrRejectModal";
import HeaderDetail from "../../../../HeaderDetail";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";
import SVGIcon from "../../../../../../../../assets/Icon/index";

/**
 * Payment relation detail view (container + presentational component).
 * Fetches original and draft records, supports approve/reject workflow.
 *
 * @param {object}                    props
 * @param {"standard"|"oneTime"}      [props.accountType="standard"] - Account type context.
 */
const PaymentRelationDetail = ({
  accountType = "standard"
}) => {
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";

  // --- Hooks ---
  const dispatch = useDispatch();

  const {
    detail_paymentRelation,
    detailDraft_paymentRelation,
    loading_detailPr,
    loading_detailDraftPr,
    loading_approveRejectPr,
  } = useSelector((state) => state.paymentRelation);

  const { loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );

  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idPr = location?.state?.id;

  const tabOptions = [
    {
      key: "ori",
      label: "Original",
    },
    {
      key: "cur",
      label: "Current",
    }
  ]
  const originalKey = tabOptions[0]?.key;

  // --- State ---
  const [activeKey, setActiveKey] = useState(originalKey || "")
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  // --- Derived values ---
  const isLoading = loading || loadingAccount || loading_detailPr || loading_detailDraftPr;
  const detail = (activeKey === originalKey ? detail_paymentRelation : detailDraft_paymentRelation) || {}

  const {
    status,
    statusApproval,
  } = detail_paymentRelation;

  const {
    approvalType,
    accountNumber,
    id,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
    tappId,
  } = detail;

  const draftExist = status && status !== "DRAFT" && statusApproval && statusApproval !== "APPROVED";
  const isApproval = ["PAYMENT_RELATION", "INACTIVE_PAYMENT_RELATION"].includes(approvalType);

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path:
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName:
        isStandard ? "Account - Standard" : "Account - One Time",
    },
    {
      path: isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
        : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
      breadcrumbName: "Detail Account",
      state: { idAccount, idCustomer },
    },
    {
      path: "",
      breadcrumbName: "Detail Payment Relation",
    },
  ];

  // --- Handlers ---
  /**
   * Switches the active detail tab between Original and Current.
   * @param {string} newActiveKey
   */
  const handleSetActiveKey = (newActiveKey) => {
    setActiveKey(newActiveKey)
  }

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
  }

  /**
   * Dispatches approve or reject for the current payment relation record.
   * @param {string}             description - Remark entered in the approval form
   * @param {"approve"|"reject"} action
   */
  const handleApproveOrReject = (description, action) => {
    const body = [{
      id,
      approvalId: tappId,
      action: action.toUpperCase(),
      description,
    }];

    if (approvalType === "PAYMENT_RELATION") {
      dispatch(approveOrRejectPaymentRelation({
        body,
        action,
      }))
      .unwrap()
      .then(() => navigate(-1))
      .catch(() => {});
    } else if (approvalType === "INACTIVE_PAYMENT_RELATION") {
      dispatch(approveOrRejectInactivePaymentRelation({
        body,
        action,
      }))
      .unwrap()
      .then(() => navigate(-1))
      .catch(() => {});
    } else {
      const errorBody = {
        title: "Failed",
        description: `The approval type is invalid.`,
      };

      dispatch(showModalError(errorBody));
    }
  }

  // --- Effects ---
  useEffect(() => {
    if (isStandard) {
      dispatch(getGrantedAccessAccount(`/account-management/account-standard/financial-information/payment-relation`));
    } else if (isOneTime) {
      dispatch(getGrantedAccessAccount(`/account-management/account-onetime/financial-information/payment-relation`));
    }
  }, []);

  useEffect(() => {
    if (idPr)
      dispatch(getPaymentRelation(idPr));
  }, [idPr]);

  useEffect(() => {
    if (idPr && draftExist)
      dispatch(getPaymentRelationDraft(idPr));
  }, [idPr, draftExist]);

  return (
    <>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={accountType}
          />

          {draftExist && (
            <NxBaseContainer border padding={false}>
              <NxTabs
                items={tabOptions}
                activeKey={activeKey}
                onChange={handleSetActiveKey}
              />
            </NxBaseContainer>
          )}

          <PaymentRelationDetailTabs
            detail={detail}
          />

          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-5 gap-4">
                {/* History Log Information */}
                <NxDetailText label="Record Id">{id}</NxDetailText>
                <NxDetailText label="Created Date">{NxDate.formatDate(createdDate)}</NxDetailText>
                <NxDetailText label="Created By">{createdBy}</NxDetailText>
                <NxDetailText label="Updated Date">{NxDate.formatDate(updatedDate)}</NxDetailText>
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
        header={approveOrReject === "approve" ? "Approve" : approveOrReject === "reject" ? "Reject" : ""}
        handleCloseModal={() => handleApprovalModal(false)}
        customMessage={`Are you sure you want to ${approveOrReject} payment relation - ${accountNumber}?`}
        onFinish={({ remark }) => handleApproveOrReject(remark, approveOrReject)}
        loading={loading_approveRejectPr}
      />
    </>
  );
};

export default PaymentRelationDetail;
