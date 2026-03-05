import { useEffect, useState } from "react";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import RelationshipDetailTabs from "./RelationshipDetailTabs";
import { getCustomerDetail } from "../../../../../../../redux/slices/account_management/Customer/customerAccount";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import {
  getAccountStandardDetail,
  getGrantedAccessAccount,
} from "../../../../../../../redux/slices/account_management/accountManagement";
import {
  getRelationshipDetail,
  getDetailDraftRelationship,
  getAttachmentList,
  approveOrRejectRelationship,
  approveOrRejectInactiveRelationship,
} from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../../../components/Nx/NxApproveOrRejectModal";
import HeaderDetail from "../../../HeaderDetail";
import NxTabs from "../../../../../../../components/Nx/NxTabs";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

const RelationshipDetails = ({ type = "standard" }) => {
  const dispatch = useDispatch();

  const { data_relationshipDetail, detailDraft_relationshipDetail, loading_detailRelationship } = useSelector(
    (state) => state.relationship
  );

  const { loading: loadingCustomer, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector((state) => state.accountManagement);

  const isLoading = loading_detailRelationship || loadingCustomer || loadingAccount;

  // declare
  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idRelationship = location?.state?.idRelationship || location?.state?.id;

  const tabOptions = [
    { key: "ori", label: "Original" },
    { key: "cur", label: "Current" },
  ];
  const originalKey = tabOptions[0]?.key;
  const [activeKey, setActiveKey] = useState(originalKey || "");
  const detail = (activeKey === originalKey ? data_relationshipDetail : detailDraft_relationshipDetail) || {};

  const handleSetActiveKey = (newActiveKey) => setActiveKey(newActiveKey);

  const {
    id,
    status,
    statusApproval,
    approvalType,
    subjectName,
    objectName,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
    tappId,
  } = detail;

  const draftExist = status && status !== "DRAFT" && statusApproval && statusApproval !== "APPROVED";
  const isApproval = ["ACCOUNT_RELATIONSHIP", "INACTIVE_ACCOUNT_RELATIONSHIP"].includes(approvalType);

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path:
        type === "standard"
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName:
        type === "standard" ? "Account - Standard" : "Account - One Time",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.DETAIL_RELATIONSHIP,
      breadcrumbName: "Detail Account",
    },
    {
      path: "",
      breadcrumbName: "Detail Relationship",
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
  };

  /**
   * @param {"approve"|"reject"} action
   */
  const handleApproveOrReject = (description, action, handleClear) => {
    const { id, approvalType, tappId } = data_relationshipDetail;
    const body = [
      {
        id,
        approvalId: tappId,
        action: action.toUpperCase(),
        description,
      },
    ];

    if (approvalType === "ACCOUNT_RELATIONSHIP") {
      dispatch(
        approveOrRejectRelationship({
          idAccount,
          body,
          action: action.toUpperCase(),
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getRelationshipDetail({ idAccount, idRelationship }));
          dispatch(getDetailDraftRelationship({ idAccount, idRelationship }));
          handleClear();
          handleApprovalModal(false);
        })
        .catch(() => {});
    } else if (approvalType === "INACTIVE_ACCOUNT_RELATIONSHIP") {
      dispatch(
        approveOrRejectInactiveRelationship({
          idAccount,
          body,
          action: action.toUpperCase(),
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getRelationshipDetail({ idAccount, idRelationship }));
          dispatch(getDetailDraftRelationship({ idAccount, idRelationship }));
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
  };

  useEffect(() => {
    dispatch(
      getGrantedAccessAccount(
        "/account-management/customers/view/service-requests/details"
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (idCustomer) dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount && idCustomer) {
      dispatch(getAccountStandardDetail({ idAccount, idCustomer }));
    }
  }, [idAccount, idCustomer]);

  useEffect(() => {
    if (idAccount && idRelationship) {
      dispatch(getRelationshipDetail({ idAccount, idRelationship }));
      dispatch(getDetailDraftRelationship({ idAccount, idRelationship }));
      dispatch(getAttachmentList({ idAccount, idRelationship }));
    }
  }, [idAccount, idRelationship]);

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
            type={type}
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

          <RelationshipDetailTabs
            dataDetail={detail}
            dispatch={dispatch}
            idAccount={idAccount}
            idRelationship={idRelationship}
          />

          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-5 gap-4">
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
        customMessage={`Are you sure you want to ${approveOrReject} relationship - ${
          data_relationshipDetail?.subjectName ||
          data_relationshipDetail?.objectName ||
          ""
        }?`}
        onFinish={({ remark }, handleClear) =>
          handleApproveOrReject(remark, approveOrReject, handleClear)
        }
      />
    </LayoutMenu>
  );
};

export default RelationshipDetails;
