import { Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  approveRejectDelegation,
  getDelegationDetail,
} from "../../../../redux/slices/user_management/delegation";
import { renderDateTime } from "../../RatingBillingInvoice/MasterData/BillingItem/Utils/Utils";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { configApp } from "../../../../constants/configApp";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import moment from "moment";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import userHttpService from "../../../../redux/services/userHttpService";
import SVGIcon from "../../../../assets/Icon/index";
import { hasValue, renderDateConverter, toTitleCase } from "../../../../utils";

const DelegationDetail = () => {
  const { loading, detail_Delegation } = useSelector(
    (state) => state.delegation
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const record = useLocation().state?.id;

  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [approveOrReject, setApproveOrReject] = useState("");

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [body, setBody] = useState({});

  const showButtonApproval =
    detail_Delegation?.approvalId !== null && detail_Delegation?.approvalId;

  const routes = [
    { path: "", breadcrumbName: "User Management" },
    { path: USER_ROUTES.VIEW_DELEGATION, breadcrumbName: "Delegation" },
    {
      path: USER_ROUTES.DETAIL_DELEGATION,
      breadcrumbName: "Detail Delegation",
    },
  ];

  useEffect(() => {
    if (record) {
      dispatch(getDelegationDetail(record));
    }
  }, [dispatch, record]);

  useEffect(() => {
    if (record) {
      setListDataAttachment(
        (detail_Delegation?.mAttachmentLists || []).map((item) => ({
          ...item,
          createdDate: item.createdBy
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        }))
      );
    }
  }, [record, detail_Delegation]);

  const handleCancel = () => {
    setModalConfirm(false);
  };

  const handleRetry = () => {
    handleConfirm();
    setModalErrorServer(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalErrorServer(false);
    setBodyError({});
  };

  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      id: record,
      approvalId: detail_Delegation?.approvalId,
      action: approveOrReject.toUpperCase(),
      approvalRemark: res.remark,
    };
    setBody(data);
    dispatch(approveRejectDelegation({ body: data }))
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getDelegationDetail(record));
      })
      .catch((error) => {
        if (Math.floor((error.response?.status || 0) / 100) === 5) {
          setBodyError({ message: error.message });
          setModalErrorServer(true);
        }
      });
  };

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className="mt-5">
          <BaseContainer header={"Delegation Information"}>
            <div className="w-full grid grid-cols-3 gap-4">
              <div className={"col-span-1"}>
                <DetailText label="Delegate From">
                  {detail_Delegation?.delegateFrom}
                </DetailText>
                <DetailText label="Start Date">
                  {hasValue(detail_Delegation?.startDate) &&
                    renderDateConverter(detail_Delegation?.startDate, "date")}
                </DetailText>
                <DetailText label="Request Remark">
                  {detail_Delegation?.requestRemark}
                </DetailText>
              </div>
              <div className={"col-span-1"}>
                <DetailText label="Position">
                  {detail_Delegation?.position}
                </DetailText>
                <DetailText label="End Date">
                  {hasValue(detail_Delegation?.endDate) &&
                    renderDateConverter(detail_Delegation?.endDate, "date")}
                </DetailText>
                <DetailText label="Approval Remark">
                  {detail_Delegation?.approvalRemark}
                </DetailText>
              </div>
              <DetailText label="Status">
                {toTitleCase(detail_Delegation?.status)}
              </DetailText>
            </div>
          </BaseContainer>
          <BaseContainer header={"History Log Information"}>
            <div className="w-full grid grid-cols-5 gap-5">
              <DetailText label="Record Id">{record}</DetailText>
              <DetailText label="Created Date">
                {renderDateTime(detail_Delegation?.createdDate)}
              </DetailText>
              <DetailText label="Created By">
                {detail_Delegation?.createdBy}
              </DetailText>
              <DetailText label="Update Date">
                {renderDateTime(detail_Delegation?.updatedDate)}
              </DetailText>
              <DetailText label="Updated By">
                {detail_Delegation?.updatedBy}
              </DetailText>
            </div>
          </BaseContainer>
          <BaseContainer header={"FILE ATTACHMENT"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector={"delegation"}
              service={userHttpService}
              configApplication={configApp.USER_MANAGEMENT_SERVICE}
            />
          </BaseContainer>
        </div>
        <div className={"w-full flex justify-between my-10"}>
          <div className="flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
              icon={<LeftOutlined style={{ color: "#fff", fontSize: 24 }} />}
            >
              Back
            </ButtonComponent>
          </div>

          {showButtonApproval ? (
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type="reject"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject("Reject");
                }}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject("Approve");
                }}
              >
                Approve
              </ButtonComponent>
            </div>
          ) : null}
        </div>
      </Spin>

      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Delegation"}
        named={`${detail_Delegation?.delegateFrom}`}
      />

      <ModalError
        isOpen={modalErrorServer}
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
            approveOrReject === "Approve" ? "Approved" : "Rejected"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default DelegationDetail;
