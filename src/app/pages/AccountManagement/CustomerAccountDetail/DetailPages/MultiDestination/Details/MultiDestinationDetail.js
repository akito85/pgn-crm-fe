import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MultiDestinationDetailTabs from "./MultiDestinationDetailTabs";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { getGrantedAccessAccount } from "../../../../../../../redux/slices/account_management/accountManagement";
import { getDetailMultiDestination, getDetailDraftMultiDestination, approveOrRejectMultiDestination, approveOrRejectInactiveMultiDestination } from "../../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
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

const MultiDestinationDetail = ({
  accountType = "standard"
}) => {
  const dispatch = useDispatch();

  const { detail_multiDestination, detailDraft_multiDestination, loading_detailMd, loading_detailDraftMd, loading_approveRejectMd } = useSelector(
    (state) => state.multiDestination
  );

  const { loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );

  const isLoading = loading || loadingAccount || loading_detailMd || loading_detailDraftMd;

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idMd = location?.state?.id;

  const tabOptions = [
    { key: "ori", label: "Original" },
    { key: "cur", label: "Current" },
  ];
  const originalKey = tabOptions[0]?.key;
  const [activeKey, setActiveKey] = useState(originalKey || "");
  const detail = (activeKey === originalKey ? detail_multiDestination : detailDraft_multiDestination) || {};
  const handleSetActiveKey = (newActiveKey) => setActiveKey(newActiveKey);

  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

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
      state: {
        idAccount,
        idCustomer,
      }
    },
    {
      path: "",
      breadcrumbName: "Detail Multi Destination",
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
    const { id, approvalType, tappId } = detail_multiDestination;
    const body = [{ id, approvalId: tappId, action: action.toUpperCase(), description }];

    if (approvalType === "MULTI_DESTINATION") {
      dispatch(approveOrRejectMultiDestination({ body, action }))
        .unwrap()
        .then(() => navigate(-1))
        .catch(() => {});
    } else if (approvalType === "INACTIVE_MULTI_DESTINATION") {
      dispatch(approveOrRejectInactiveMultiDestination({ body, action }))
        .unwrap()
        .then(() => navigate(-1))
        .catch(() => {});
    } else {
      dispatch(showModalError({ title: "Failed", description: "The approval type is invalid." }));
    }
  }

  const { status, statusApproval } = detail_multiDestination;

  const {
    approvalType,
    accountNumber,
    id,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
  } = detail;

  const draftExist = status && status !== "DRAFT" && statusApproval && statusApproval !== "APPROVED";
  const isApproval = ["MULTI_DESTINATION", "INACTIVE_MULTI_DESTINATION"].includes(approvalType);

  useEffect(() => {
    dispatch(getGrantedAccessAccount('/account-management/account-standard/multi-destination'))
  }, [dispatch]);

  useEffect(() => {
    if (idMd)
      dispatch(getDetailMultiDestination({ id: idMd }));
  }, [idMd]);

  useEffect(() => {
    if (idMd && draftExist)
      dispatch(getDetailDraftMultiDestination({ id: idMd }));
  }, [idMd, draftExist]);

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
              <NxTabs items={tabOptions} activeKey={activeKey} onChange={handleSetActiveKey} />
            </NxBaseContainer>
          )}

          <MultiDestinationDetailTabs
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

          {isApproval && (
            <NxBaseContainer border>
              <div className="flex justify-between">
                <Button type={"menu"} onClick={() => navigate(-1)}>Cancel</Button>
                <div className={"w-full flex justify-end gap-5"}>
                  <Button type="reject" icon={<SVGIcon width={14} height={14} name="IconSquareX" />} className="flex-row-reverse" onClick={() => handleApprovalModal(true, "reject")}>Reject</Button>
                  <Button type="approve" icon={<SVGIcon width={14} height={14} name="IconSquareCheck" />} className="flex-row-reverse" onClick={() => handleApprovalModal(true, "approve")}>Approve</Button>
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
        customMessage={`Are you sure you want to ${approveOrReject} multi destination - ${accountNumber}?`}
        onFinish={({ remark }, handleClear) => handleApproveOrReject(remark, approveOrReject, handleClear)}
        loading={loading_approveRejectMd}
      />
    </>
  );
};

export default MultiDestinationDetail;
