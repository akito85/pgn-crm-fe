import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  approveRejectDigitalSignature,
  approveRejectInactiveDigitalSignature,
  resetDigitalSignatureState,
  getDetailDigitalSignature,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/digitalSignature";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import DigitalSignatureSection from "./_components/DigitalSignatureSection";

const DigitalSignatureDetail = () => {
  // Selector
  const { loading, data_detail } = useSelector(
    (state) => state.digitalSignature
  );

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state?.id;

  // State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);
  const [valuePage, setValuePage] = useState("Digital Signature");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [dataDetail, setDataDetail] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyError, setBodyError] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listSectionInfo] = useState([
    { value: "Digital Signature" },
    { value: "Attachment" },
  ]);
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tAppId: null,
    approvalDetail: null,
    approvalType: null,
  });

  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  // Use Effect
  useEffect(() => {
    if (id) {
      dispatch(getDetailDigitalSignature(id));
    }
    return () => {
      dispatch(resetDigitalSignatureState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (data_detail && Object.keys(data_detail).length > 0) {
      const signature = data_detail?.digitalSignature || {};
      const attachments = data_detail?.attachments || [];
      const approvalInfo = data_detail?.approvalInformation || {};

      // Data Attachment Information
      const mappedAttachment = attachments.map((item, index) => ({
        id: item.id || index,
        size: item.size || 0,
        fileName: item.fileName || "-",
        fileSize: item.fileSize || "-",
        fileType: item.type || "-",
        fileCategoryId: item.fileCategoryId || null,
        fileCategoryName: item.fileCategoryName || "-",
        pathFile: item.pathFile || "",
        urlFile1: `/v1/dbs/api/signature/download-attachment/${item.id}` || "",
        urlFile2: item.urlFile2 || "",
        createdBy: item.createdBy || "-",
        createdDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "-",
        dataType: "exist",
      }));

      // Data History Log Information
      setDataLogInformation({
        recordId: signature?.signatureId || "-",
        createdDate: signature?.createdDtm || null,
        createdBy: signature?.createdBy || "-",
        updatedDate: signature?.updateDtm || null,
        updatedBy: signature?.updatedBy || "-",
      });

      // Set Digital Signature Data
      setDataDetail({
        signatureId: signature?.signatureId,
        name: signature?.name || "-",
        employee: signature?.fullName || "-",
        primaryPosition: signature?.positionName || "-",
        status: signature?.status || "-",
        statusApproval: signature?.statusApproval || "-",
        description: signature?.description || "-",
        signatureBase64: signature?.signatureBase64 || "-",
        signatureMethod: signature?.signatureMethod || "-",
        fileDetail: data_detail?.fileDetail || null,
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

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.DIGITAL_SIGNATURE,
      breadcrumbName: "Digital Signature",
    },
    {
      path: RBI_ROUTES.DIGITAL_SIGNATURE_DETAIL,
      breadcrumbName: "Detail Digital Signature",
    },
  ];

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Digital Signature":
        return (
          <>
            <DigitalSignatureSection
              key={"digitalSignatureSection"}
              dataDetailSignature={dataDetail}
              dataHistory={dataLogInformation}
            />
          </>
        );
      case "Attachment":
        return (
          <BaseContainer header={"Attachment Information"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              dispatch={dispatch}
              typeSelector="digitalSignature"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
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

  const handleCancel = () => {
    setModalConfirm(false);
  };

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      remark: res.remark,
      action: approveOrReject.toUpperCase(),
      approvalId: bodyApproval.tAppId,
    };
    dispatch(
      bodyApproval.approvalType === "INACTIVE_DIGITAL_SIGNATURE"
        ? approveRejectInactiveDigitalSignature({
            id: id,
            body: data,
          })
        : approveRejectDigitalSignature({
            id: id,
            body: data,
          })
    )
      .unwrap()
      .then(() => {
        if (handleClear) handleClear();
        dispatch(getDetailDigitalSignature(id));
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message });
          setModalErrorServer(true);
        }
      });
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <RadioTabs
          data={listSectionInfo}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />
        <div className="flex flex-col w-full">
          {bodyApproval.isApprover &&
            bodyApproval.approvalType &&
            bodyApproval.approvalType === "INACTIVE_FAKTUR_CODE" && (
              <BaseContainer header={"Inactive Request Information"}>
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {bodyApproval.approvalDetail?.requestedDate
                      ? moment(
                          bodyApproval.approvalDetail.requestedDate
                        ).format(dateFormatting.date)
                      : "-"}
                  </DetailText>
                  <DetailText label={"Requested By"}>
                    {bodyApproval.approvalDetail?.requestedBy || "-"}
                  </DetailText>
                  <DetailText label={"Remark"}>
                    {bodyApproval.approvalDetail?.remarks || "-"}
                  </DetailText>
                </div>
              </BaseContainer>
            )}

          {layout(valuePage)}
        </div>

        <div className="flex mt-[30px]">
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

        {/* Modal Approve/Reject */}
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Digital Signature"}
          named={dataDetail?.name}
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
    </LayoutMenu>
  );
};

export default DigitalSignatureDetail;
