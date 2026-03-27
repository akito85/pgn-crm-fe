import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import userHttpService from "../../../../../redux/services/userHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  getDetailBillingItemCategory,
  approveRejectBillingItemCategory,
  approveRejectInactiveBillingItemCategory,
} from "../../../../../redux/slices/system_setup/master_data/billingItemCategory";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import CardContainer from "../../../../../components/CardContainer";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";

const BillingItemCategoryDetail = () => {
  // Selector
  const { loading, data_detail } = useSelector(
    (state) => state.billingItemCategory,
  );

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state.id;

  //State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);

  const [valuePage, setValuePage] = useState("Transaction Mapping Category");
  const [approveOrReject, setApproveOrReject] = useState("");

  const [dataDetail, setDataDetail] = useState({});

  const [bodyError, setBodyError] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const listSectionInfo = [
    { value: "Transaction Mapping Category" },
    { value: "Attachment" },
  ];
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
      dispatch(getDetailBillingItemCategory(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.billingCategory?.id === id) {
      const billingCategory = data_detail?.billingCategory;

      // Data Attachment Information
      const dataAttachment = (data_detail?.attachments || []).map((item) => {
        return {
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.type,
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
      });

      // Data History Log Information
      setDataLogInformation({
        recordId: billingCategory?.id,
        createdDate: billingCategory?.createdDate,
        createdBy: billingCategory?.createdBy,
        updatedDate: billingCategory?.updatedDate,
        updatedBy: billingCategory?.updatedBy,
      });

      // Set detail with correct mapping
      setDataDetail({
        ...billingCategory,
        categoryCode: billingCategory?.code,
        categoryName: billingCategory?.name,
      });
      setListDataAttachment(dataAttachment);
      setBodyApproval({
        isApprover: data_detail?.approvalInfo?.isApprover,
        tAppId: data_detail?.approvalInfo?.tAppId,
        approvalDetail: data_detail?.approvalInfo,
        approvalType: data_detail?.approvalInfo?.approvalType,
      });
    }
  }, [id, data_detail]);

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
      path: SYSTEM_SETUP_ROUTES.VIEW_BILLING_ITEM_CATEGORY,
      breadcrumbName: "Transaction Mapping Category",
    },
    {
      path: SYSTEM_SETUP_ROUTES.DETAIL_BILLING_ITEM_CATEGORY,
      breadcrumbName: "Transaction Mapping Category",
    },
  ];

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Transaction Mapping Category":
        return (
          <>
            <CardContainer header={"Transaction Mapping Category Information"}>
              <div className="w-full grid grid-cols-4 gap-3">
                <DetailText label={"Category Code"}>
                  {dataDetail?.categoryCode}
                </DetailText>
                <DetailText label={"Category Name"}>
                  {dataDetail?.categoryName}
                </DetailText>
                <DetailText label={"Start Date"}>
                  {dataDetail?.startDate
                    ? moment(dataDetail?.startDate).format(dateFormatting.date)
                    : ""}
                </DetailText>
                <DetailText label={"End Date"}>
                  {dataDetail?.endDate
                    ? moment(dataDetail?.endDate).format(dateFormatting.date)
                    : ""}
                </DetailText>
              </div>
              <div className="w-full grid grid-cols-1 gap-3">
                <DetailText label={"Description"}>
                  {dataDetail?.description || ""}
                </DetailText>
              </div>
            </CardContainer>
            <CardContainer header={"History Log Information"}>
              <div className="w-full grid grid-cols-4 gap-3 mt-4">
                <DetailText label={"Created Date"}>
                  {dataLogInformation?.createdDate
                    ? moment(dataLogInformation?.createdDate).format(
                        dateFormatting.date,
                      )
                    : ""}
                </DetailText>
                <DetailText label={"Created By"}>
                  {dataLogInformation?.createdBy || ""}
                </DetailText>
                <DetailText label={"Updated Date"}>
                  {dataLogInformation?.updatedDate
                    ? moment(dataLogInformation?.updatedDate).format(
                        dateFormatting.date,
                      )
                    : ""}
                </DetailText>
                <DetailText label={"Updated By"}>
                  {dataLogInformation?.updatedBy || ""}
                </DetailText>
              </div>
            </CardContainer>
          </>
        );
      case "Attachment":
        return (
          <CardContainer header={"Attachment Information"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              dispatch={dispatch}
              typeSelector="billingItemCategory"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </CardContainer>
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
      id: id,
      remark: res.remark,
      approvalId: bodyApproval.tAppId,
      action: approveOrReject.toUpperCase(),
    };
    dispatch(
      bodyApproval.approvalType === "INACTIVE_BILLING_ITEM_CATEGORY"
        ? approveRejectInactiveBillingItemCategory({
            body: data,
          })
        : approveRejectBillingItemCategory({
            body: data,
          }),
    )
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getDetailBillingItemCategory(id));
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
            bodyApproval.approvalType === "INACTIVE_BILLING_ITEM_CATEGORY" && (
              <CardContainer header={"inactive request information"}>
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {bodyApproval.approvalDetail.requestedDate
                      ? moment(
                          bodyApproval.approvalDetail.requestedDate,
                        ).format(dateFormatting.date)
                      : ""}
                  </DetailText>
                  <DetailText label={"Requested By"}>
                    {bodyApproval.approvalDetail.requestedBy}
                  </DetailText>
                  <DetailText label={"Remark"}>
                    {bodyApproval.approvalDetail.remarks}
                  </DetailText>
                </div>
              </CardContainer>
            )}

          {layout(valuePage)}
        </div>

        <div className="flex mt-[10px] w-full p-3 rounded-md bg-white">
          <ButtonComponent type={"submit"} onClick={() => navigate(-1)}>
            Back
          </ButtonComponent>

          {showButtonApproval ? (
            <div className={"w-full flex justify-end gap-2"}>
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
          menu={"Billing Item Category"}
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

export default BillingItemCategoryDetail;
