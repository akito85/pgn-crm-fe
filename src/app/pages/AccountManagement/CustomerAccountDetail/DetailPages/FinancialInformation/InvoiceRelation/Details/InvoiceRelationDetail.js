import { useEffect } from "react";
import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InvoiceRelationDetailTabs from "./InvoiceRelationDetailTabs";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import { getDetailInvoiceRelation, getDetailDraftInvoiceRelation, approveOrRejectInvoiceRelation, approveOrRejectInactiveInvoiceRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import { showModalError } from "../../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../../../../components/Nx/NxApproveOrRejectModal";
import HeaderDetail from "../../../../HeaderDetail";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";

const InvoiceRelationDetail = ({
  accountType = "standard"
}) => {
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";
  const dispatch = useDispatch();

  const { detail_invoiceRelation, detailDraft_invoiceRelation } = useSelector(
    (state) => state.invoiceRelation
  )

  const { loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );
  
  const isLoading = loading || loadingAccount;

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
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
  const [activeKey, setActiveKey] = useState(originalKey || "")
  const detail = (activeKey === originalKey ? detail_invoiceRelation : detailDraft_invoiceRelation) || {}

  const handleSetActiveKey = (newActiveKey) => {
    setActiveKey(newActiveKey)
  }
  
  //state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  const {
    status,
    statusApproval,
  } = detail_invoiceRelation;

  const {
    approvalType,
    relatedAccountNumber,
    id,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
    tappId,
  } = detail;
  
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
    },
    {
      path: "",
      breadcrumbName: "Detail Invoice Relation",
    },
  ];

  /**
   * @param {boolean} show
   * @param {"approve"|"reject"} action 
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
   * @param {"approve"|"reject"} action 
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
      .then(() => {
        dispatch(getDetailInvoiceRelation(idIr));
        dispatch(getDetailDraftInvoiceRelation(idIr));
        handleClear();
        handleApprovalModal(false);
      })
      .catch(() => {});
    } else if (approvalType === "INACTIVE_INVOICE_RELATION") {
      dispatch(approveOrRejectInactiveInvoiceRelation({
        body,
        action,
      }))
      .unwrap()
      .then(() => {
        dispatch(getDetailInvoiceRelation(idIr));
        dispatch(getDetailDraftInvoiceRelation(idIr));
        handleClear();
        handleApprovalModal(false);
      })
      .catch(() => {});
    } else {
      const errorBody = {
        title: "Failed",
        description: `The approval type is invalid.`,
      };

      dispatch(showModalError(errorBody));
    }
  }

  useEffect(() => {
    if (isStandard)
      dispatch(getGrantedAccessAccount('/account-management/account-standard/financial-information/invoice-relation'))
    else if (isOneTime)
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/financial-information/invoice-relation'))
  }, [dispatch]);

  useEffect(() => {
    if (idIr) {
      dispatch(getDetailInvoiceRelation(idIr));
      dispatch(getDetailDraftInvoiceRelation(idIr));
    }
  }, [idIr])

  const draftExist = status && status !== "DRAFT" && statusApproval && statusApproval !== "APPROVED";
  const isApproval = ["INVOICE_RELATION", "INACTIVE_INVOICE_RELATION"].includes(approvalType);

  return (
    <LayoutMenu>
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

          {isApproval && (
            <NxBaseContainer border>
              <div className="flex justify-between">
                <Button
                  type={"menu"}
                  onClick={() => navigate(-1)}
                >
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
        header={approveOrReject === "approve" ? "Approve" : approveOrReject === "reject" ? "Reject" : ""}
        handleCloseModal={() => handleApprovalModal(false)}
        customMessage={`Are you sure you want to ${approveOrReject} invoice relation - ${relatedAccountNumber}?`}
        onFinish={({ remark }, handleClear) => handleApproveOrReject(remark, approveOrReject, handleClear)}
      />
    </LayoutMenu>
  );
};

export default InvoiceRelationDetail;
