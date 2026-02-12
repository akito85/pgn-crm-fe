import { useEffect } from "react";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RelationshipDetailTabs from "./RelationshipDetailTabs";
import { getCustomerDetail } from "../../../../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../../utils";
import {
  getAccountStandardDetail,
  getGrantedAccessAccount,
} from "../../../../../../../redux/slices/account_management/accountManagement";
import {
  getRelationshipDetail,
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

const RelationshipDetails = ({ type = "standard" }) => {
  const dispatch = useDispatch();

  const { data_relationshipDetail, loadingDetail } = useSelector(
    (state) => state.relationship
  );

  const { loading: loadingCustomer, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector((state) => state.accountManagement);

  const isLoading = loadingDetail || loadingCustomer || loadingAccount;

  // declare
  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idRelationship = location?.state?.idRelationship || location?.state?.id;

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
    if (data_relationshipDetail) {
      const body = [
        {
          id: data_relationshipDetail.id,
          approvalId: data_relationshipDetail.tappId,
          action: action.toUpperCase(),
          description,
        },
      ];

      if (data_relationshipDetail.approvalType === "ACCOUNT_RELATIONSHIP") {
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
            handleClear();
            handleApprovalModal(false);
          })
          .catch(() => {});
      } else if (
        data_relationshipDetail.approvalType === "INACTIVE_ACCOUNT_RELATIONSHIP"
      ) {
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
      dispatch(getAttachmentList({ idAccount, idRelationship }));
    }
  }, [idAccount, idRelationship]);

  useEffect(() => {
    if (data_relationshipDetail) {
      const { approvalType } = data_relationshipDetail;

      if (
        approvalType === "ACCOUNT_RELATIONSHIP" ||
        approvalType === "INACTIVE_ACCOUNT_RELATIONSHIP"
      )
        setIsApproval(true);
      else setIsApproval(false);
    }
  }, [data_relationshipDetail]);

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

          <RelationshipDetailTabs
            dataDetail={data_relationshipDetail}
            dispatch={dispatch}
            idAccount={idAccount}
            idRelationship={idRelationship}
          />

          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-5 gap-4">
                <NxDetailText label="Record Id">
                  {data_relationshipDetail?.id}
                </NxDetailText>
                <NxDetailText label="Created Date">
                  {data_relationshipDetail?.createdDate
                    ? moment(
                        data_relationshipDetail.createdDate,
                        dateFormatting.meas_date
                      ).format(dateFormatting.dateTime)
                    : ""}
                </NxDetailText>
                <NxDetailText label="Created By">
                  {data_relationshipDetail?.createdBy}
                </NxDetailText>
                <NxDetailText label="Updated Date">
                  {data_relationshipDetail?.updatedDate
                    ? moment(
                        data_relationshipDetail.updatedDate,
                        dateFormatting.meas_date
                      ).format(dateFormatting.dateTime)
                    : ""}
                </NxDetailText>
                <NxDetailText label="Updated By">
                  {data_relationshipDetail?.updatedBy}
                </NxDetailText>
              </div>
            </NxBaseContainer>
          </NxCardContainer>

          {isApproval && (
            <NxBaseContainer border>
              <div className="flex justify-between">
                <ButtonComponent type={"menu"} onClick={() => navigate(-1)}>
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
