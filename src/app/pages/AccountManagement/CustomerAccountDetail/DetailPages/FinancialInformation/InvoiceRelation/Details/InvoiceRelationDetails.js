import { useEffect } from "react";
import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InvoiceRelationDetailTabs from "./InvoiceRelationDetailTabs";
import { getCustomerDetail } from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../../../utils";
import { getAccountStandardDetail, getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import { getDetailInvoiceRelation, getDetailDraftInvoiceRelation, approveOrRejectInvoiceRelation, approveOrRejectInactiveInvoiceRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import { showModalError } from "../../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../../../../components/Nx/NxApproveOrRejectModal";
import HeaderDetail from "../../../../HeaderDetail";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";

const InvoiceRelationDetails = ({
  type = "standard"
}) => {
  const dispatch = useDispatch();

  const { detail_invoiceRelation, detailDraft_invoiceRelation } = useSelector(
    (state) => state.invoiceRelation
  )

  const { loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
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
  const [activeKey, setActiveKey] = useState(tabOptions[0]?.key || "")

  const handleSetActiveKey = (newActiveKey) => {
    setActiveKey(newActiveKey)
  }

  //state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path:
        type == "standard"
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName:
        type == "standard" ? "Account - Standard" : "Account - One Time",
    },
    {
      path:
        type == "standard"
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
    dispatch(getGrantedAccessAccount('/account-management/customers/view/service-requests/details'))
  }, [dispatch]);

  useEffect(() => {
    if (idCustomer)
      dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount && idCustomer) {
      dispatch(getAccountStandardDetail({ idAccount, idCustomer }));
    }
  }, [idAccount, idCustomer]);

  useEffect(() => {
    if (idIr) {
      dispatch(getDetailInvoiceRelation(idIr));
      dispatch(getDetailDraftInvoiceRelation(idIr));
    }
  }, [idIr])

  const {
    status,
    statusApproval,
    approvalType,
    relatedAccountNumber,
    id,
    tappId,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
  } = detail_invoiceRelation;

  const draftExist = status !== "DRAFT" && statusApproval !== "APPROVED";
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
            type={"standard"}
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
            dataDetail={activeKey === tabOptions[0]?.key ? detail_invoiceRelation : activeKey === tabOptions[1]?.key ? detailDraft_invoiceRelation : {}}
            subjectAccountNumber={data_accountDetail?.accountSummary?.accountNumber}
            dispatch={dispatch}
            idIr={idIr}
          />

          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-5 gap-4">
                {/* History Log Information */}
                <NxDetailText label="Record Id">{id}</NxDetailText>
                <NxDetailText label="Created Date">{createdDate ? moment(createdDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</NxDetailText>
                <NxDetailText label="Created By">{createdBy}</NxDetailText>
                <NxDetailText label="Updated Date">{updatedDate ? moment(updatedDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</NxDetailText>
                <NxDetailText label="Updated By">{updatedBy}</NxDetailText>
              </div>
            </NxBaseContainer>
          </NxCardContainer>

          {isApproval && (
            <NxBaseContainer border>
              <div className="flex justify-between">
                <ButtonComponent
                  type={"menu"}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </ButtonComponent>
                <div className={"w-full flex justify-end gap-5"}>
                  <ButtonComponent
                    type="reject"
                    onClick={() => handleApprovalModal(true, "reject")}
                  >
                    Reject
                  </ButtonComponent>
                  <ButtonComponent
                    type="approve"
                    onClick={() => handleApprovalModal(true, "approve")}
                  >
                    Approve
                  </ButtonComponent>
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

export default InvoiceRelationDetails;
