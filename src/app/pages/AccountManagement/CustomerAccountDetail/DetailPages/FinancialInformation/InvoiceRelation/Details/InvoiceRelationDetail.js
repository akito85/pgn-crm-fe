import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InvoiceRelationDetailTabs from "./InvoiceRelationDetailTabs";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import { getInvoiceRelation, getInvoiceRelationDraft, approveOrRejectInvoiceRelation, approveOrRejectInactiveInvoiceRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import { showModalError } from "../../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../../../../components/Nx/NxApproveOrRejectModal";
import HeaderDetail from "../../../../HeaderDetail";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import SVGIcon from "../../../../../../../../assets/Icon/index";

/**
 * Invoice relation detail view (container + presentational component).
 * Fetches original and draft records, supports approve/reject workflow.
 *
 * @param {object}                    props
 * @param {"standard"|"oneTime"}      [props.accountType="standard"] - Account type context.
 */
const InvoiceRelationDetail = ({
  accountType = "standard"
}) => {
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";

  // --- Hooks ---
  const dispatch = useDispatch();

  const { detail_invoiceRelation, detailDraft_invoiceRelation, loading_detailIr, loading_detailDraftIr, loading_approveRejectIr } = useSelector(
    (state) => state.invoiceRelation
  )

  const { loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const navigate = useNavigate();
  const location = useLocation();
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;
  const idIr = location?.state?.id;

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
  const isLoading = loading || loadingAccount || loading_detailIr || loading_detailDraftIr;
  const detail = (activeKey === originalKey ? detail_invoiceRelation : detailDraft_invoiceRelation) || {}

  const {
    status,
    statusApproval,
  } = detail_invoiceRelation;

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
  const isApproval = ["INVOICE_RELATION", "INACTIVE_INVOICE_RELATION"].includes(approvalType);
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
      path:
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
      breadcrumbName: "Detail Account",
      state: {
        idAccount: accountId,
        idCustomer: customerId
      }
    },
    {
      path: "",
      breadcrumbName: "Detail Invoice Relation",
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
   * Dispatches approve or reject for the current invoice relation record.
   * @param {string}             description - Remark entered in the approval form
   * @param {"approve"|"reject"} action
   * @param {Function}           handleClear - Resets the form after successful submission
   */
  const handleApproveOrReject = (description, action, handleClear) => {
    const body = [{
      id,
      approvalId: tappId,
      action: action.toUpperCase(),
      description,
    }];

    if (approvalType === "INVOICE_RELATION") {
      dispatch(approveOrRejectInvoiceRelation({
        body,
        action,
      }))
      .unwrap()
      .then(() => navigate(-1))
      .catch(() => {});
    } else if (approvalType === "INACTIVE_INVOICE_RELATION") {
      dispatch(approveOrRejectInactiveInvoiceRelation({
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
    if (isStandard)
      dispatch(getGrantedAccessAccount('/account-management/account-standard/financial-information/invoice-relation'))
    else if (isOneTime)
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/financial-information/invoice-relation'))
  }, []);

  useEffect(() => {
    if (idIr)
      dispatch(getInvoiceRelation(idIr));
  }, [idIr]);
  
  useEffect(() => {
    if (idIr && draftExist)
      dispatch(getInvoiceRelationDraft(idIr));
  }, [idIr, draftExist])

  return (
    <>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={accountId}
            idCustomer={customerId}
            type={accountType}
            collapsible
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

          <InvoiceRelationDetailTabs
            detail={detail}
            dispatch={dispatch}
            idIr={idIr}
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
                      icon={<SVGIcon width={14} height={14} name="IconSquareX" />}
                      className="flex-row-reverse"
                      onClick={() => handleApprovalModal(true, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      type="approve"
                      className="flex-row-reverse"
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
        customMessage={`Are you sure you want to ${approveOrReject} invoice relation - ${accountNumber}?`}
        onFinish={({ remark }, handleClear) => handleApproveOrReject(remark, approveOrReject, handleClear)}
        loading={loading_approveRejectIr}
      />
    </>
  );
};

export default InvoiceRelationDetail;
