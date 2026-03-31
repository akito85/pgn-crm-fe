import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import RelationshipDetailTabs from "./RelationshipDetailTabs";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import {
  getGrantedAccessAccount,
} from "../../../../../../../redux/slices/account_management/accountManagement";
import {
  getRelationshipDetail,
  getDetailDraftRelationship,
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
import SVGIcon from "../../../../../../../assets/Icon/index";

/**
 * Relationship detail view (container + presentational component).
 * Fetches original and draft records, supports approve/reject workflow.
 *
 * @param {object}                    props
 * @param {"standard"|"oneTime"}      [props.accountType="standard"] - Account type context.
 */
const RelationshipDetail = ({ accountType = "standard" }) => {
  // --- Hooks ---
  const dispatch = useDispatch();

  const {
    data_relationshipDetail,
    detailDraft_relationshipDetail,
    loading_detailRelationship,
    loading_detailDraftRelationship,
    loading_approveRejectRelationship,
    data_attachmentList,
  } = useSelector((state) => state.relationship);

  const { loading: loadingCustomer, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const isLoading = loading_detailRelationship || loading_detailDraftRelationship || loadingCustomer || loadingAccount;

  const navigate = useNavigate();
  const location = useLocation();
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;
  const idRelationship = location?.state?.idRelationship || location?.state?.id;

  // --- State ---
  const tabOptions = [
    { key: "ori", label: "Original" },
    { key: "cur", label: "Current" },
  ];
  const originalKey = tabOptions[0]?.key;
  const [activeKey, setActiveKey] = useState(originalKey || "");
  const detail = (activeKey === originalKey ? data_relationshipDetail : detailDraft_relationshipDetail) || {};

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  // --- Derived values ---
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";

  const { status, statusApproval } = data_relationshipDetail;
  const {
    id,
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

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path:
        isStandard ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD :
        isOneTime ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME :
          "",
      breadcrumbName:
        isStandard ?
          "Account - Standard" :
        isOneTime ?
          "Account - One Time" :
          "",
    },
    {
      path:
        isStandard ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD :
        isOneTime ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME :
          "",
      breadcrumbName: "Detail Account",
      state: { idAccount: accountId, idCustomer: customerId },
    },
    {
      path: "",
      breadcrumbName: "Detail Relationship",
    },
  ];

  // --- Handlers ---
  /**
   * Opens or closes the approval/rejection modal.
   * @param {boolean}            show     - true to open, false to close
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
   * Dispatches approve or reject for the current relationship record.
   * @param {string}             description - Remark entered in the approval form
   * @param {"approve"|"reject"} action
   * @param {Function}           handleClear - Resets the form after successful submission
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
          accountId,
          body,
          action: action.toUpperCase(),
        })
      )
        .unwrap()
        .then(() => navigate(-1))
        .catch(() => {});
    } else if (approvalType === "INACTIVE_ACCOUNT_RELATIONSHIP") {
      dispatch(
        approveOrRejectInactiveRelationship({
          accountId,
          body,
          action: action.toUpperCase(),
        })
      )
        .unwrap()
        .then(() => navigate(-1))
        .catch(() => {});
    } else {
      dispatch(showModalError({
        title: "Failed",
        description: "The approval type is invalid.",
      }));
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (isStandard)
      dispatch(getGrantedAccessAccount('/account-management/account-standard/relationship'));
    else if (isOneTime)
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/relationship'));
  }, []);

  useEffect(() => {
    if (accountId && idRelationship) {
      dispatch(getRelationshipDetail({ accountId, idRelationship }));
    }
  }, [accountId, idRelationship]);

  useEffect(() => {
    if (accountId && idRelationship && draftExist)
      dispatch(getDetailDraftRelationship({ accountId, idRelationship }));
  }, [accountId, idRelationship, draftExist]);

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
          />

          {draftExist && (
            <NxBaseContainer border padding={false}>
              <NxTabs
                items={tabOptions}
                activeKey={activeKey}
                onChange={setActiveKey}
              />
            </NxBaseContainer>
          )}

          <RelationshipDetailTabs
            detail={detail}
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
                <Button type={"menu"} onClick={() => navigate(-1)}>Cancel</Button>
                <div className={"w-full flex justify-end gap-5"}>
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
                    icon={<SVGIcon width={14} height={14} name="IconSquareCheck" />}
                    className="flex-row-reverse"
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
        loading={loading_approveRejectRelationship}
      />
    </>
  );
};

export default RelationshipDetail;
