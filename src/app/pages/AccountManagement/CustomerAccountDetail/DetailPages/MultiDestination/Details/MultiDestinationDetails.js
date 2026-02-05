import { useEffect } from "react";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MultiDestinationDetailTabs from "./MultiDestinationDetailTabs";
import { getCustomerDetail } from "../../../../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../../utils";
import { getAccountStandardDetail, getGrantedAccessAccount } from "../../../../../../../redux/slices/account_management/accountManagement";
import { getDetailMultiDestination, getMultiDestinationAttachment, approveOrRejectMultiDestination, approveOrRejectInactiveMultiDestination } from "../../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../../../components/Nx/NxApproveOrRejectModal";
import HeaderDetail from "../../../HeaderDetail";

const MultiDestinationDetails = ({
  type = "standard"
}) => {
  const dispatch = useDispatch();

  const { loading, detail_multiDestination } = useSelector(
    (state) => state.multiDestination
  );

  const { loading: loadingCustomer, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );

  const isLoading = loading || loadingCustomer || loadingAccount;

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idMd = location?.state?.id;

  const [isApproval, setIsApproval] = useState(false);
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
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_MULTI_DESTINATION,
      breadcrumbName: "Detail Account",
    },
    {
      path: "",
      breadcrumbName: "Detail Multi Destination",
    },
  ];

  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

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
    if (detail_multiDestination) {
      const body = [{
        id: detail_multiDestination.id,
        approvalId: detail_multiDestination.tappId,
        action: action.toUpperCase(),
        description,
      }];

      if (detail_multiDestination.approvalType === "MULTI_DESTINATION") {
        dispatch(approveOrRejectMultiDestination({
          body,
          action,
        }))
        .unwrap()
        .then(() => {
          dispatch(getDetailMultiDestination(idMd));
          handleClear();
          handleApprovalModal(false);
        })
        .catch(() => {});
      } else if (detail_multiDestination.approvalType === "INACTIVE_MULTI_DESTINATION") {
        dispatch(approveOrRejectInactiveMultiDestination({
          body,
          action,
        }))
        .unwrap()
        .then(() => {
          dispatch(getDetailMultiDestination(idMd));
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
    if (idMd) {
      dispatch(getDetailMultiDestination(idMd));
      dispatch(getMultiDestinationAttachment({ id: idMd }));
    }
  }, [idMd])

  useEffect(() => {
    if (detail_multiDestination) {
      const { approvalType } = detail_multiDestination;

      if (approvalType === "MULTI_DESTINATION" || approvalType === "INACTIVE_MULTI_DESTINATION")
        setIsApproval(true);
      else
        setIsApproval(false);
    }
  }, [detail_multiDestination]);

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

          <MultiDestinationDetailTabs
            dataDetail={detail_multiDestination}
            subjectAccountNumber={data_accountDetail?.accountSummary?.accountNumber}
            dispatch={dispatch}
            idMd={idMd}
          />

          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-5 gap-4">
                {/* History Log Information */}
                <NxDetailText label="Record Id">{detail_multiDestination?.id}</NxDetailText>
                <NxDetailText label="Created Date">{detail_multiDestination?.createdDate ? moment(detail_multiDestination.createdDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</NxDetailText>
                <NxDetailText label="Created By">{detail_multiDestination?.createdBy}</NxDetailText>
                <NxDetailText label="Updated Date">{detail_multiDestination?.updatedDate ? moment(detail_multiDestination.updatedDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</NxDetailText>
                <NxDetailText label="Updated By">{detail_multiDestination?.updatedBy}</NxDetailText>
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
        customMessage={`Are you sure you want to ${approveOrReject} multi destination - ${detail_multiDestination?.relatedAccountNumber}?`}
        onFinish={({ remark }, handleClear) => handleApproveOrReject(remark, approveOrReject, handleClear)}
      />
    </LayoutMenu>
  );
};

export default MultiDestinationDetails;
