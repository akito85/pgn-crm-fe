import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spin } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumbAdvanced from "../../../../../../../../../components/BreadCrumbAdvanced";
import HeaderDetail from "../../../../../HeaderDetail";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../../routes/account_management/customer_account_routes";
import {
  dateFormatting,
} from "../../../../../../../../../utils";
import ModalApproveOrReject from "../../../../../../../../../components/Modal/ModalApproveOrReject";
import { useDispatch, useSelector } from "react-redux";
import TableDetailTos from "../../../../TosSubmission/CreateTosSubmission/TableDetailTos";
import { ModalError } from "../../../../../../../../../components/Modal/ModalPopUp";
import PricingInactiveRequest from "../../../../../../../ProductAndPromo/Pricing/Detail/PricingInactiveRequest";
import {
  approvalCreateTosSubmission,
  approvalInactiveTosSubmission,
  getDetailTosSubmission,
} from "../../../../../../../../../redux/slices/account_management/detailAccount/tosSubmissionSlice";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import { bytesConverter } from "../../../../../../../../../utils/bytesConverter";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTabs from "../../../../../../../../../components/Nx/NxTabs";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import ServiceAgreementAttachmentInformation from "../../../shared/AttachmentInformation";
import ServiceAgreementHistoryLogInformation from "../../../shared/HistoryLogInformation";

const routes = (item) => {
  return [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
      state:{
        idAccount: item.idAccount,
      }
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
      breadcrumbName: "Detail Service Agreement",
      state:{
        idSA : item.idSA,
        idAccount : item.idAccount,
        idCustomer : item.idCustomer,
        type : item.type
      }
    },
    {
      path: "",
      breadcrumbName: "Detail TOS",
    },
  ]
}

const ApproveOrRejectTOS = () => {
  //declare
  const dispatch = useDispatch();
  const { dataDetail, loading } = useSelector((state) => state.tosSubmission);

  const navigate = useNavigate();
  const location = useLocation();
  const { idAccount, idCustomer, type, id } = location?.state || {};
  const [tosSubmissionObj, setTosSubmissionObj] = useState({});
  const [dataDetailTosSubmission, setDatatDetailTosSubmission] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState("tosSubmissionInfo");
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  useEffect(() => {
    if (dataDetail?.saTosSubmissionId) {
      const approvalHierarchy = dataDetail.apphierId || 0;
      const body = {
        tosId: dataDetail?.saTosId,
        tosName: dataDetail?.saTosName,
        startDate: dataDetail?.startDate,
        endDate: dataDetail?.endDate,
        appliedDate: dataDetail?.appliedDate
          ? moment(dataDetail.appliedDate).format(dateFormatting.date)
          : undefined,
        remark: dataDetail?.remark,
        status: dataDetail?.status
          ? dataDetail.status.charAt(0).toUpperCase() +
            dataDetail.status.slice(1).toLowerCase()
          : "",
        approvalStatus: dataDetail?.statusApproval
          ? dataDetail.statusApproval.charAt(0).toUpperCase() +
            dataDetail.statusApproval.slice(1).toLowerCase()
          : "",
        createdDate: dataDetail?.createdDate
          ? moment(dataDetail.createdDate).format(dateFormatting.dateTime)
          : "",
        createdBy: dataDetail?.createdBy,
        updatedDate: dataDetail?.updatedDate
          ? moment(dataDetail.updatedDate).format(dateFormatting.dateTime)
          : "",
        updatedBy: dataDetail?.updatedBy,
        approvalHierarchy,
      };
      setDatatDetailTosSubmission(
        (dataDetail?.tosSubmissionDetail || []).map((item) => {
          return {
            key: item.id,
            attribute:
              item?.attribute && item?.attributeId
                ? {
                    label: item?.attribute,
                    value: item?.attributeId,
                  }
                : null,
            value: parseInt(item?.value || ""),
            unit:
              item?.unit && item?.unitId
                ? {
                    label: item?.unit,
                    value: item?.unitId,
                  }
                : null,
            fromItem:
              item?.fromItem && item?.fromItemId
                ? {
                    label: item?.fromItem,
                    value: item?.fromItemId,
                  }
                : null,
          };
        })
      );
      setTosSubmissionObj(body);
      setListDataAttachment(
        (dataDetail?.mattachments || []).map((attachData, index) => ({
          ...attachData,
          key: index + 1,
          createdDate: attachData?.createdDate
            ? moment(attachData.createdDate).format(dateFormatting.dateTime)
            : "",
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
      setBodyApproval({
        isApprover: dataDetail.isApprover,
        tappId: dataDetail.tappId,
        approvalDetail: dataDetail.approvalDetail,
        approvalType: dataDetail.approvalType,
      });
    }
  }, [dataDetail]);

  useEffect(() => {
    if (id) {
      dispatch(getDetailTosSubmission({ id }));
    }
  }, [dispatch, id]);

  const handleModalConfirmation = (type) => {
    setModalConfirm(true);
    setApproveOrReject(type);
  };
  const handleCloseModalApproveReject = () => {
    // setRemark("");
    setModalConfirm(false);
  };

  const handleConfirm = (formValue, handleClear) => {
    const obj = {
      id: id,
      description: formValue.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject === "Approve" ? "APPROVE" : "REJECT",
    };
    if (bodyApproval.approvalType === "INACTIVE_TOS_SUBMISSION") {
      return dispatch(approvalInactiveTosSubmission(obj))
        .unwrap()
        .then(() => {
          handleClear();
          handleCloseModalApproveReject();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message, formValue });
            setModalError(true);
          }
        });
    }

    return dispatch(approvalCreateTosSubmission(obj))
        .unwrap()
        .then(() => {
          handleClear();
          handleCloseModalApproveReject();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message, formValue });
            setModalError(true);
          }
        });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleConfirm(bodyError.formValue);
    setModalError(false);
    setBodyError({});
  };

  const approvalAction = approveOrReject?.toLowerCase();

  const tabItems = [
    {
      key: "tosSubmissionInfo",
      label: "TOS Submission Information",
      children: (
        <div className="flex flex-col gap-4">
          <NxBaseContainer border header="TERM OF SERVICE SUBMISSION INFORMATION">
            <div className="w-full grid grid-cols-3 gap-4">
              <NxDetailText label="Term of Service Name">
                {tosSubmissionObj?.tosName || "-"}
              </NxDetailText>
              <NxDetailText label="Start Date">
                {tosSubmissionObj?.startDate
                  ? moment(tosSubmissionObj?.startDate).format(dateFormatting.date)
                  : "-"}
              </NxDetailText>
              <NxDetailText label="End Date">
                {tosSubmissionObj?.endDate
                  ? moment(tosSubmissionObj?.endDate).format(dateFormatting.date)
                  : "-"}
              </NxDetailText>
              <NxDetailText label="Applied Date">{tosSubmissionObj?.appliedDate || "-"}</NxDetailText>
              <NxDetailText label="Status">{tosSubmissionObj?.status || "-"}</NxDetailText>
            </div>
            <div className="w-full grid grid-cols-1 gap-4">
              <NxDetailText label="Description">{tosSubmissionObj?.remark || "-"}</NxDetailText>
            </div>
          </NxBaseContainer>

          <NxBaseContainer border header="TERM OF SERVICE DETAIL">
            <TableDetailTos
              type="preview"
              dataTable={dataDetailTosSubmission}
              updateTable={setDatatDetailTosSubmission}
              editDetail={false}
            />
          </NxBaseContainer>
        </div>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <ServiceAgreementAttachmentInformation
          dataSource={listDataAttachment}
          tableId="approve-reject-tos-attachment-table"
        />
      ),
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <div className="flex flex-col gap-4">
          <BreadCrumbAdvanced routes={routes(location?.state)} />
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
          />

          {bodyApproval.isApprover &&
          bodyApproval.approvalType &&
          bodyApproval.approvalType === "INACTIVE_TOS_SUBMISSION" ? (
            <NxCardContainer header="INACTIVE REQUEST INFORMATION">
              <PricingInactiveRequest
                data={
                  bodyApproval.approvalDetail !== null
                    ? bodyApproval.approvalDetail
                    : {}
                }
              />
            </NxCardContainer>
          ) : null}

          <NxCardContainer header="DETAIL INFORMATION" withoutPadding>
            <NxTabs
              activeKey={activeDetailTab}
              onChange={(tabKey) => setActiveDetailTab(tabKey)}
              items={tabItems}
            />
          </NxCardContainer>

          <ServiceAgreementHistoryLogInformation historyData={tosSubmissionObj} />

          <NxBaseContainer border>
            <div
              className={`w-full flex items-center ${
                showButtonApproval ? "justify-between" : "justify-start"
              }`}
            >
              <ButtonComponent
                type="menu"
                className="!w-fit"
                onClick={() => navigate(-1)}
              >
                Back
              </ButtonComponent>
              {showButtonApproval ? (
                <div className="flex items-center gap-5">
                  <ButtonComponent
                    type="reject"
                    onClick={() => handleModalConfirmation("Reject")}
                  >
                    Reject
                  </ButtonComponent>
                  <ButtonComponent
                    type="approve"
                    onClick={() => handleModalConfirmation("Approve")}
                  >
                    Approve
                  </ButtonComponent>
                </div>
              ) : null}
            </div>
          </NxBaseContainer>
        </div>

        {/** Modal Approve or Reject */}

          <ModalApproveOrReject
            isOpen={modalConfirm}
            handleCloseModal={handleCloseModalApproveReject}
            onFinish={handleConfirm}
            header={approveOrReject}
            approveOrReject={approveOrReject}
            customMessage={`Are you sure you want to ${approvalAction} TOS Submission - ${dataDetail?.saTosName || "-"}?`}
          />
          {/** Modal Retry */}
          <ModalError
            isOpen={modalError}
            handleOk={handleRetry}
            handleCancel={handleCloseModalError}
            customText={"Try Again"}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">{`Your data was not ${
                approveOrReject === "Approve" ? "approved" : "rejected"
              } ${bodyError.message}.`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
      </Spin>
    </LayoutMenu>
  );
};
export default ApproveOrRejectTOS;
