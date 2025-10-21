import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spin, Form } from "antd";
import moment from "moment";
import BaseContainer from "../../../../../../../../../components/BaseContainer";
import DetailText from "../../../../../../../../../components/DetailText";
import { LeftOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumbAdvanced from "../../../../../../../../../components/BreadCrumbAdvanced";
import HeaderDetail from "../../../../../HeaderDetail";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../../routes/account_management/customer_account_routes";
import {
  dateFormatting,
  requiredMessage,
} from "../../../../../../../../../utils";
import ModalApproveOrReject from "../../../../../../../../../components/Modal/ModalApproveOrReject";
import InputComponent from "../../../../../../../../../components/InputComponent";
import AttachmentSectionForm from "../../../../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
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
import accountManagementService from "../../../../../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../../../../../constants/configApp";

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
      state: {
        idAccount: item.idAccount,
      },
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
      breadcrumbName: "Detail Service Agreement",
      state: {
        idSA: item.idSA,
        idAccount: item.idAccount,
        idCustomer: item.idCustomer,
        type: item.type,
      },
    },
    {
      path: "",
      breadcrumbName: "Detail TOS",
    },
  ];
};

const ApproveOrRejectTOS = () => {
  //declare
  const dispatch = useDispatch();
  const { dataDetail, loading } = useSelector((state) => state.tosSubmission);

  const navigate = useNavigate();
  const location = useLocation();
  const { idAccount, idCustomer, type, id, idSA } = location?.state || {};
  const [tosSubmissionObj, setTosSubmissionObj] = useState({});
  const [dataDetailTosSubmission, setDatatDetailTosSubmission] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [form] = Form.useForm();
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
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
        }),
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
        })),
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
      dispatch(approvalInactiveTosSubmission(obj))
        .unwrap()
        .then((res) => {
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
    } else {
      dispatch(approvalCreateTosSubmission(obj))
        .unwrap()
        .then((res) => {
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
  console.log("lll");

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumbAdvanced routes={routes(location?.state)} />
        <div className="w-full">
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
          />
        </div>

        {bodyApproval.isApprover &&
        bodyApproval.approvalType &&
        bodyApproval.approvalType === "INACTIVE_TOS_SUBMISSION" ? (
          <BaseContainer header={"INACTIVE REQUEST INFORMATION"}>
            <PricingInactiveRequest
              data={
                bodyApproval.approvalDetail !== null
                  ? bodyApproval.approvalDetail
                  : {}
              }
            />
          </BaseContainer>
        ) : null}
        <div className="drop-shadow-lg bg-white rounded-lg w-full mt-[30px] p-[20px]">
          <div className="flex flex-col w-full gap-4">
            <div className="py-4">
              <div className="text-primary text-xs font-bold uppercase">
                TERM OF SERVICE SUBMISSION
              </div>
            </div>
            <div className="w-full grid grid-cols-4 gap-4">
              <DetailText label="Start Date">
                {moment(tosSubmissionObj?.startDate).format(
                  dateFormatting.date,
                )}
              </DetailText>
              <DetailText label="End Date">
                {moment(tosSubmissionObj?.endDate).format(dateFormatting.date)}
              </DetailText>
              <DetailText label="Applied Date">
                {tosSubmissionObj?.appliedDate &&
                  moment(tosSubmissionObj?.appliedDate).format(
                    dateFormatting.date,
                  )}
              </DetailText>
              <DetailText label="Status">{tosSubmissionObj?.status}</DetailText>
              <DetailText label="Status Approval">
                {tosSubmissionObj?.approvalStatus}
              </DetailText>
              <div className="col-span-4">
                <DetailText label="Remark">
                  {tosSubmissionObj?.remark}
                </DetailText>
              </div>
            </div>
            <div className="py-4">
              <div className="text-primary text-xs font-bold uppercase">
                TERM OF SERVICE INFORMATION
              </div>
            </div>
            <div className="w-full grid grid-cols-4 gap-4">
              <DetailText label="Term of Service Name">
                {tosSubmissionObj?.tosName}
              </DetailText>
            </div>
            <div className="py-4">
              <div className="text-primary text-xs font-bold uppercase">
                TERM OF SERVICE DETAIL
              </div>
            </div>
            <div className="w-full">
              <TableDetailTos
                type={"preview"}
                dataTable={dataDetailTosSubmission}
                updateTable={setDatatDetailTosSubmission}
              />
            </div>
          </div>
        </div>

        <BaseContainer header={"ATTACHMENT"}>
          <AttachmentSectionForm
            type={"detail"}
            data={listDataAttachment}
            updateData={setListDataAttachment}
            service={accountManagementService}
            configApplication={configApp.ACCOUNT_SERVICE}
          />
        </BaseContainer>

        <BaseContainer header={"History Log Information"}>
          <div className="w-full grid grid-cols-4 gap-5">
            <DetailText label="Created Date">
              {tosSubmissionObj?.createdDate}
            </DetailText>
            <DetailText label="Created By">
              {tosSubmissionObj?.createdBy}
            </DetailText>
            <DetailText label="Updated Date">
              {tosSubmissionObj?.updatedDate}
            </DetailText>
            <DetailText label="Updated By">
              {tosSubmissionObj?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>

        <div
          className={`flex w-full${
            showButtonApproval ? " justify-between" : ""
          } align-middle my-3`}
        >
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Back
          </ButtonComponent>
          {showButtonApproval ? (
            <div className="flex align-middle gap-3">
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

        {/* Modal Approve/Reject*/}
        {/* <ModalApproveOrReject
          isOpen={modalConfirm}
          header={`${approveOrReject} information`}
          message={`Are you sure you want to ${approveOrReject} Term of Submission?`}
          width={1000}
          handleCancel={handleCloseModalApproveReject}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={handleCloseModalApproveReject}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                form={"formApproveRejcet"}
                type={"submit"}
                htmlType={"submit"}
                border={false}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form name="formApproveRejcet" form={form} onFinish={handleConfirm}>
            <Form.Item
              name={"remark"}
              rules={[{ message: requiredMessage("Remark"), required: true }]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </Form>
        </ModalApproveOrReject> */}

        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCloseModalApproveReject}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Tos Submission"}
          named={`${dataDetail?.saTosName}`}
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
