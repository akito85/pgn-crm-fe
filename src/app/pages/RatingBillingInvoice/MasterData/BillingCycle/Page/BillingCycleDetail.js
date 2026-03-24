import { LeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../../components/RadioTabs";
import moment from "moment";
import BillingCycleDetailInformation from "../Detail/BillingCycleDetailInformation";
import BaseContainer from "../../../../../../components/BaseContainer";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  approveOrRejectInactiveBillingCycle,
  approveRejectBillingCycle,
  getInfoDetail,
  getInfoDetailDraft,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import SVGIcon from "../../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../../redux/slices/attachmentSlice";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";

const BillingCycleDetail = ({ type }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [valuePage, setValuePage] = useState("Billing Cycle");
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [approveOrReject, setApproveOrReject] = useState("");
  //modal
  const [dataDetail, setDataDetail] = useState({});
  const [dataDraft, setDataDraft] = useState({});
  const [modalErrorServer, setModalErrorServer] = useState(false);

  const [modalConfirm, setModalConfirm] = useState(false);
  
  const [bodyError, setBodyError] = useState({});
  const [billingCycleSection, setBillingCycleSection] = useState([
    { value: "Billing Cycle" },
    { value: "Attachment" },
  ]);

  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });

  const { dataInfoDetail, dataInfoDetailDraft, message } = useSelector(
    (state) => state.billingCycle
  );

  const id = location.state?.id;
  const action = location.state?.action;
  const statusApproval = location.state?.statusApproval;

  useEffect(() => {
    if (id) {
      dispatch(getInfoDetail(id));
      dispatch(getInfoDetailDraft(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && dataInfoDetail.billingCycleId === id) {
      //data
      const dataAttachment = (dataInfoDetail?.attachmentDtoList || []).map(
        (item) => {
          return {
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            fileCategoryId: item.fileCategoryId,
            fileCategoryName: item.fileCategoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            createdBy: item.createdBy,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        }
      );
      setDataLogInformation({
        createdDate: dataInfoDetail.createdDate,
        createdBy: dataInfoDetail.createdBy,
        updatedDate: dataInfoDetail.updatedDate,
        updatedBy: dataInfoDetail.updatedBy,
      });
      setListDataAttachment(dataAttachment);
      setDataDetail(dataInfoDetail);
      setBodyApproval({
        isApprover: dataInfoDetail?.approvalDto?.isApprover,
        tappId: dataInfoDetail?.approvalDto?.tAppId,
        approvalDetail: dataInfoDetail?.approvalDto,
        approvalType: dataInfoDetail?.approvalDto?.approvalType,
      });
    }
    if (
      id &&
      dataInfoDetailDraft?.billingCycleId === id &&
      dataInfoDetailDraft?.billingCycleId === dataInfoDetail?.billingCycleId &&
      dataInfoDetail &&
      (!dataInfoDetail?.approvalDto?.approvalType ||
        dataInfoDetail?.approvalDto?.approvalType !== "INACTIVE_BILLING_CYCLE")
    ) {
      // const dataDraftAttachment = (
      //   dataInfoDetail?.attachmentDtoList || []
      // ).map((item) => {
      //   return {
      //     id: item.id,
      //     size: item.size,
      //     fileName: item.fileName,
      //     fileSize: item.fileSize,
      //     fileType: item.fileType,
      //     fileCategoryId: item.fileCategoryId,
      //     fileCategoryName: item.fileCategoryName,
      //     pathFile: item.pathFile,
      //     urlFile1: item.urlFile1,
      //     urlFile2: item.urlFile2,
      //     createdBy: item.createdBy,
      //     createdDate: item.createdDate
      //       ? moment(item.createdDate).format("DD MMM YYYY")
      //       : "",
      //     dataType: "exist",
      //   };
      // });
      setDataDraft(dataInfoDetailDraft);
      // setListDataAttachment((prevState) => [
      //   ...prevState,
      //   ...dataDraftAttachment,
      // ]);
      setBillingCycleSection([
        { value: "Billing Cycle" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, dataInfoDetail, dataInfoDetailDraft]);

  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

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
      path: RBI_ROUTES.BILLING_CYCLE_VIEW,
      breadcrumbName: "Billing Cycle",
    },
    {
      path: RBI_ROUTES.BILLING_CYCLE_DETAIL,
      breadcrumbName: "Detail Billing Cycle",
    },
  ];

  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      id: id,
      remark: res.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };

    dispatch(
      bodyApproval.approvalType === "INACTIVE_BILLING_CYCLE"
        ? approveOrRejectInactiveBillingCycle({
            body: data,
          })
        : approveRejectBillingCycle({
            body: data,
          })
    )
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getInfoDetail(id));
        dispatch(getInfoDetailDraft(id));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
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

  const renderSection = () => {
    switch (valuePage) {
      case "Billing Cycle":
        return (
          <BillingCycleDetailInformation
            id={id}
            data={dataDetail}
            type={true}
            action={action}
            statusApproval={statusApproval}
          />
        );
      case "Draft":
        return (
          <BillingCycleDetailInformation
            id={id}
            data={dataDraft}
            type={true}
            action={action}
            statusApproval={statusApproval}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="billingCycle"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
              dispatch={dispatch}
              getAPIGuard={getConfigFileRBIData}
              typeRBI={"data"}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <div className="flex flex-col w-full gap-4">
        {bodyApproval.isApprover &&
          bodyApproval.approvalType &&
          bodyApproval.approvalType === "INACTIVE_BILLING_CYCLE" && (
            <BaseContainer header={"inactive request information"}>
              <div className="w-full grid grid-cols-4 gap-3">
                <DetailText label={"Requested Date"}>
                  {bodyApproval?.approvalDetail?.requestedDate
                    ? moment(
                        bodyApproval?.approvalDetail?.requestedDate
                      ).format(dateFormatting.date)
                    : ""}
                </DetailText>
                <DetailText label={"Requested By"}>
                  {bodyApproval?.approvalDetail?.requestedBy}
                </DetailText>
                <DetailText label={"Remark"}>
                  {bodyApproval?.approvalDetail?.remarks}
                </DetailText>
              </div>
            </BaseContainer>
          )}
        <RadioTabs
          data={billingCycleSection}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />
      </div>
      <div className={"w-full"}>{renderSection()}</div>
      <div className={"w-full flex justify-between my-10"}>
        <div className=" flex">
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
        </div>

        {showButtonApproval === true ? (
          <div className="flex align-middle gap-3">
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

      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Billing Cycle"}
        named={`${dataDetail?.beginCycle} - ${dataDetail?.endCycle}`}
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

export default BillingCycleDetail;
