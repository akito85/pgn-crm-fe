import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import RadioTabs from "../../../../components/RadioTabs";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../components/ButtonComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import BaseContainer from "../../../../components/BaseContainer";
import SVGIcon from "../../../../assets/Icon/index";
import ABDInfoSection from "./Utils/ABDInfoSection";
import {
  approveOrRejectAdjustmentBilling,
  getDetailAdjustmentBilling,
  getListType,
} from "../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import { dateFormatting } from "../../../../utils";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../constants/configApp";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";

const AdjustmentBillingDetail = () => {
  // Selector
  const { loading, dataDetail, dataListType } = useSelector(
    (state) => state.adjustmentBilling,
  );

  // Declaration
  const navigate = useNavigate();
  const id = useLocation().state.id;
  const dispatch = useDispatch();

  // State
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataABI, setListDataABI] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [valuePage, setValuePage] = useState("Adjustment Billing");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalErrorServer, setModalErrorServer] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Adjustment Billing" },
    { value: "Attachment" },
  ]);

  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });

  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  // Use Effect
  useEffect(() => {
    if (id) {
      dispatch(getDetailAdjustmentBilling(id));
      dispatch(getListType());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && dataDetail?.id) {
      const findDataType = dataListType?.find(
        (item) => item.id === dataDetail?.adjustmentType,
      )?.name;

      // Data Adjustment Billing Detail
      const dataDetailAdjustmentBilling =
        dataDetail?.tAdjustmentBillingDetail?.map((item) => {
          return {
            adjustmentId: item.id,
            item: item.item,
            quantity: item.quantity,
            price: item.price,
            currency: item.currency,
            amount: item.amount,
            adjustmentAmount: item.adjustmentAmount,
            totalAmount: item.totalAmount,
            totalAmountEqvIdr: item.totalAmountEqvIdr,
            totalAmountEqvUsd: item.totalAmountEqvUsd,
            remark: item.remark,
            uom: item.uom,
            type: findDataType,
            createdDate: item.createdDate,
            createdBy: item.createdBy,
            updatedDate: item.updatedDate,
            updatedBy: item.updatedBy,
          };
        });

      // Data Attachment
      const dataAttachment = (dataDetail?.mAttachmentLists || []).map(
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
              ? moment(item.createdDate).format(dateFormatting.date)
              : "",
            dataType: "exist",
          };
        },
      );

      setListDataABI(dataDetailAdjustmentBilling);
      setListDataAttachment(dataAttachment);

      // Data Approval
      setBodyApproval({
        isApprover: dataDetail?.isApprover,
        tappId: dataDetail?.tappId,
        approvalDetail: dataDetail?.approvalDetail,
        approvalType: dataDetail?.approvalType,
      });

      setListSectionInfo([
        { value: "Adjustment Billing" },
        { value: "Attachment" },
      ]);
    }
  }, [dispatch, id, dataDetail]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.ADJUSTMENT_BILLING_VIEW,
      breadcrumbName: "Adjustment Billing",
    },
    {
      path: RBI_ROUTES.ADJUSTMENT_BILLING_DETAIL,
      breadcrumbName: "Detail Adjustment Billing",
    },
  ];

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Adjustment Billing":
        return <ABDInfoSection data={dataDetail} listDataABI={listDataABI} />;
      case "Attachment":
        return (
          <BaseContainer header={"Attachment Information"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="adjustmentBilling"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return (
          <>
            <ABDInfoSection data={dataDetail} listDataABI={listDataABI} />
          </>
        );
    }
  };

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const handleCancel = () => {
    setModalConfirm(false);
  };

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      id: id,
      description: res.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };

    dispatch(
      approveOrRejectAdjustmentBilling({
        body: data,
      }),
    )
      .unwrap()
      .then(() => {
        handleClear();
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

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <RadioTabs data={listSectionInfo} onChange={onChange} />
        {layout(valuePage)}

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
          menu={"Adjustment Billing"}
          named={dataDetail?.invoiceInformation?.invoiceNumber}
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

export default AdjustmentBillingDetail;
