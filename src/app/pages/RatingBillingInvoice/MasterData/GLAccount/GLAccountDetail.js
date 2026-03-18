import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Tabs } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import CardContainer from "../../../../../components/CardContainer";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  approveRejectGLAccount,
  approveRejectInactiveGLAccount,
  resetGLAccountState,
  getDetailGLAccount,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/glAccount";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";

const GLAccountDetail = () => {
  const { loading, data_detail } = useSelector((state) => state.glAccount);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state?.id;

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);
  const [activeTab, setActiveTab] = useState("glAccount");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [dataDetail, setDataDetail] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyError, setBodyError] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tAppId: null,
    approvalDetail: null,
    approvalType: null,
  });

  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  useEffect(() => {
    if (id) {
      dispatch(getDetailGLAccount(id));
    }
    return () => {
      dispatch(resetGLAccountState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (data_detail && Object.keys(data_detail).length > 0) {
      const glAccount = data_detail?.glAccount || {};
      const attachments = data_detail?.attachments || [];
      const approvalInfo = data_detail?.approvalInfo || {};

      const mappedAttachment = attachments.map((item, index) => ({
        id: item.id || index,
        size: item.size || 0,
        fileName: item.fileName || "-",
        fileSize: item.fileSize || "-",
        fileType: item.type || "-",
        fileCategoryId: item.fileCategoryId || null,
        fileCategoryName: item.fileCategoryName || "-",
        pathFile: item.pathFile || "",
        urlFile1: `/v1/dbs/api/gl-account/download-attachment/${item.id}` || "",
        urlFile2: item.urlFile2 || "",
        createdBy: item.createdBy || "-",
        createdDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "-",
        dataType: "exist",
      }));

      setDataLogInformation({
        recordId: glAccount?.glAccountId || "-",
        createdDate: glAccount?.createdDate || null,
        createdBy: glAccount?.createdBy || "-",
        updatedDate: glAccount?.updatedDate || null,
        updatedBy: glAccount?.updatedBy || "-",
      });

      setDataDetail({
        glAccountId: glAccount?.glAccountId,
        glAccount: glAccount?.glAccount || "-",
        glAccountDesc: glAccount?.glAccountDesc || "-",
        remark: glAccount?.remark || "-",
        status: glAccount?.status || "-",
        statusApproval: glAccount?.approvalStatus || "-",
      });

      setListDataAttachment(mappedAttachment);

      setBodyApproval({
        isApprover: approvalInfo?.isApprover || false,
        tAppId: approvalInfo?.tAppId || null,
        approvalDetail: approvalInfo || null,
        approvalType: approvalInfo?.approvalType || null,
      });
    }
  }, [data_detail]);

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RBI_ROUTES.GLACCOUNT, breadcrumbName: "GL Account" },
    { path: RBI_ROUTES.GLACCOUNT_DETAIL, breadcrumbName: "Detail" },
  ];

  const handleRetry = () => {
    handleConfirm();
    setModalErrorServer(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalErrorServer(false);
    setBodyError({});
  };

  const handleCancel = () => {
    setModalConfirm(false);
  };

  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      remark: res.remark,
      action: approveOrReject.toUpperCase(),
      approvalId: bodyApproval.tAppId,
    };
    dispatch(
      bodyApproval.approvalType === "INACTIVE_GL_ACCOUNT"
        ? approveRejectInactiveGLAccount({ id, body: data })
        : approveRejectGLAccount({ id, body: data }),
    )
      .unwrap()
      .then(() => {
        if (handleClear) handleClear();
        dispatch(getDetailGLAccount(id));
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error.response?.data?.message || error.message || error.toString();
          setBodyError({ message });
          setModalErrorServer(true);
        }
      });
  };

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold text-primary">
                GL ACCOUNT DETAIL
              </p>
            </div>
          }
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "glAccount",
                label: "Content Setup",
                children: (
                  <div className="flex flex-col gap-3">
                    {bodyApproval.isApprover &&
                      bodyApproval.approvalType === "INACTIVE_GL_ACCOUNT" && (
                        <div className="border border-[#D6E1F0] rounded-lg">
                          <div className="px-4 py-3 border-b border-[#D6E1F0]">
                            <p className="font-semibold text-primary">
                              INACTIVE REQUEST INFORMATION
                            </p>
                          </div>
                          <div className="p-4">
                            <div className="w-full grid grid-cols-4 gap-x-8 gap-y-2">
                              <DetailText label={"Requested Date"}>
                                {bodyApproval.approvalDetail?.requestedDate
                                  ? moment(
                                      bodyApproval.approvalDetail.requestedDate,
                                    ).format(dateFormatting.date)
                                  : "-"}
                              </DetailText>
                              <DetailText label={"Requested By"}>
                                {bodyApproval.approvalDetail?.requestedBy ||
                                  "-"}
                              </DetailText>
                              <DetailText label={"Remark"}>
                                {bodyApproval.approvalDetail?.remarks || "-"}
                              </DetailText>
                            </div>
                          </div>
                        </div>
                      )}
                    <div
                      style={{
                        border: "1px solid #D6E1F0",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ padding: "16px" }}>
                        <div className="w-full grid grid-cols-3 gap-x-8 gap-y-2">
                          <DetailText label={"GL Account Number"}>
                            {dataDetail?.glAccount || "-"}
                          </DetailText>
                          <DetailText label={"GL Account Description"}>
                            {dataDetail?.glAccountDesc || "-"}
                          </DetailText>
                          <DetailText label={"Description"}>
                            {dataDetail?.remark || "-"}
                          </DetailText>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "attachment",
                label: "Attachment",
                children: (
                  <div className="flex flex-col gap-3">
                    <div
                      style={{
                        border: "1px solid #D6E1F0",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ padding: "16px" }}>
                        <AttachmentComponent
                          type={"detail"}
                          data={listDataAttachment}
                          dispatch={dispatch}
                          typeSelector="glAccount"
                          service={ratingBillingHttpService}
                          configApplication={configApp.RATING_BILLING_SERVICE}
                        />
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </CardContainer>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">HISTORY LOG INFORMATION</p>
            </div>
          }
        >
          <div className="-m-1">
            <div className="w-full grid grid-cols-5 gap-x-8 gap-y-2">
              <DetailText label={"Record ID"}>
                {dataLogInformation?.recordId || "-"}
              </DetailText>
              <DetailText label={"Created Date"}>
                {dataLogInformation?.createdDate
                  ? moment(dataLogInformation.createdDate).format(
                      dateFormatting.dateTime,
                    )
                  : "-"}
              </DetailText>
              <DetailText label={"Created By"}>
                {dataLogInformation?.createdBy || "-"}
              </DetailText>
              <DetailText label={"Updated Date"}>
                {dataLogInformation?.updatedDate
                  ? moment(dataLogInformation.updatedDate).format(
                      dateFormatting.dateTime,
                    )
                  : "-"}
              </DetailText>
              <DetailText label={"Updated By"}>
                {dataLogInformation?.updatedBy || "-"}
              </DetailText>
            </div>
          </div>
        </CardContainer>

        {/* Back Button */}
        <div className="bg-white rounded-lg border border-[#D6E1F0] p-4">
          <div className="flex justify-between items-center">
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

            {showButtonApproval && (
              <div className="flex gap-5">
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
            )}
          </div>
        </div>

        {/* Modal Approve/Reject */}
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"GL Account"}
          named={dataDetail?.glAccount}
        />

        {/* Modal Retry */}
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
      </Spin>
    </div>
  );
};

export default GLAccountDetail;
