import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import RadioTabs from "../../../../../components/RadioTabs";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../components/ButtonComponent";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { INVOICE_ROUTES } from "../../../../../routes/invoice/invoice_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { dateFormatting } from "../../../../../utils";
import {
  getDetailInvoiceAdjustment,
  approveInvoiceAdjustment,
  rejectInvoiceAdjustment,
  getListAttachmentInvoiceAdjustment,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentInvoice";
import StatusComponent from "../../../../../components/StatusComponent";

const AdjustmentInvoiceDetail = () => {
  // Selector
  const { loading, loadingDetail, dataDetail, dataListAttachment } =
    useSelector((state) => state.adjustmentInvoice);

  // Declaration
  const navigate = useNavigate();
  const id = useLocation().state?.id;
  const dispatch = useDispatch();

  // State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [valuePage, setValuePage] = useState("Adjustment Invoice");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalErrorServer, setModalErrorServer] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Adjustment Invoice" },
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

  // Use Effect - Fetch detail data
  useEffect(() => {
    if (id) {
      dispatch(getDetailInvoiceAdjustment(id));
    }
  }, [dispatch, id]);

  // Set approval body from detail data
  useEffect(() => {
    if (dataDetail) {
      setBodyApproval({
        isApprover: dataDetail.tappId !== null,
        tappId: dataDetail.tappId,
        approvalDetail: null,
        approvalType: null,
      });
    }
  }, [dataDetail]);

  // Fetch attachment data when dataDetail is available
  useEffect(() => {
    if (dataDetail?.invAdjustmentId) {
      dispatch(getListAttachmentInvoiceAdjustment(dataDetail.invAdjustmentId));
    }
  }, [dispatch, dataDetail?.invAdjustmentId]);

  // Format attachment data with urlFile1 for preview
  const formattedAttachmentData = useMemo(() => {
    if (!dataListAttachment?.result) return [];

    return dataListAttachment.result.map((attachment) => ({
      ...attachment,
      dataType: "exist",
      urlFile1: `/v1/dbs/api/rbi/invoice-adjustment/download-attachment/${attachment.fileId || attachment.id}`,
      key: attachment.fileId || attachment.id,
    }));
  }, [dataListAttachment]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: INVOICE_ROUTES.ADJUSTMENT_INVOICE_VIEW,
      breadcrumbName: "Adjustment Invoice",
    },
    {
      path: INVOICE_ROUTES.ADJUSTMENT_INVOICE_DETAIL,
      breadcrumbName: "Detail Adjustment Invoice",
    },
  ];

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return moment(dateString).format("DD MMM YYYY");
  };

  // Format datetime helper
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return moment(dateString).format("DD MMM YYYY HH:mm:ss");
  };

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Adjustment Invoice":
        return (
          <>
            {/* Customer Information Section */}
            <BaseContainer border header={"CUSTOMER INFORMATION"}>
              <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Customer Number
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.customerNumber || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Customer Name</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.customerName || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Account Number</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.accountNumber || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Account Name</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.accountName || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Account Segment
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.accountSegment || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Account Group Type
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.accountGroupType || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">SOR</p>
                  <p className="text-sm font-medium">{dataDetail?.sor || ""}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Cost Center Code
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.costCenterCode || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Cost Center Name
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.costCenter || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Meter Reading Code
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.meterReadingCode || ""}
                  </p>
                </div>
              </div>
            </BaseContainer>

            {/* Adjustment Invoice Information Section */}
            <BaseContainer border header={"ADJUSTMENT INVOICE INFORMATION"}>
              <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Billing Cycle</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.billingCycleId || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Billing Period</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.billingPeriode || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Invoice Number</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.invoiceNumber || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Transaction Date
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(dataDetail?.transactionDtm)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Document Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(dataDetail?.documentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Type Due Date</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.typeDueDate || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Due Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(dataDetail?.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Terms Of Payment
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.termsOfPayment || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Adjustment Reason
                  </p>
                  <p className="text-sm font-medium">
                    {dataDetail?.adjustmentReason || ""}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-0.5">Remark</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.remark || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Status</p>
                  <StatusComponent colour={dataDetail?.status} type="status" size="small">
                    {dataDetail?.status || ""}
                  </StatusComponent>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">
                    Status Approval
                  </p>
                  <StatusComponent
                    colour={dataDetail?.statusApproval}
                    type="status"
                    size="small"
                  >
                    {dataDetail?.statusApproval || ""}
                  </StatusComponent>
                </div>
              </div>
            </BaseContainer>

            {/* History Log Information */}
            <BaseContainer border header={"HISTORY LOG INFORMATION"}>
              <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Record ID</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.invAdjustmentId || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Created Date</p>
                  <p className="text-sm font-medium">
                    {formatDateTime(dataDetail?.createdDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Created By</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.createdBy || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Updated Date</p>
                  <p className="text-sm font-medium">
                    {formatDateTime(dataDetail?.updatedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Updated By</p>
                  <p className="text-sm font-medium">
                    {dataDetail?.updatedBy || ""}
                  </p>
                </div>
              </div>
            </BaseContainer>
          </>
        );
      case "Attachment":
        return (
          <BaseContainer header={"Attachment Information"}>
            <AttachmentComponent
              type={"detail"}
              data={formattedAttachmentData}
              updateData={() => {}}
              typeSelector="adjustmentInvoice"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return null;
    }
  };

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const handleCancel = () => {
    setModalConfirm(false);
  };

  // handle Confirm
  const handleConfirm = async (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      id: id,
      description: res.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };

    try {
      if (approveOrReject === "Approve") {
        await dispatch(approveInvoiceAdjustment({ body: data })).unwrap();
      } else {
        await dispatch(rejectInvoiceAdjustment({ body: data })).unwrap();
      }
      handleClear();
      // Refresh data after approval/rejection
      dispatch(getDetailInvoiceAdjustment(id));
    } catch (error) {
      setModalErrorServer(true);
      setBodyError(error?.response?.data || { message: "An error occurred" });
    }
  };

  const handleRetry = () => {
    setModalErrorServer(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalErrorServer(false);
    setBodyError({});
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading || loadingDetail}>
        <BreadCrumb routes={routes} />

        <RadioTabs data={listSectionInfo} onChange={onChange} />
        <div className="flex flex-col gap-2 pt-2">{layout(valuePage)}</div>

        <div className="flex mt-4">
          <ButtonComponent type={"submit"} onClick={() => navigate(-1)}>
            Back
          </ButtonComponent>

          {showButtonApproval ? (
            <div className={"w-full flex justify-end gap-3"}>
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
          menu={"Adjustment Invoice"}
          named={dataDetail?.invoiceNumber}
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
            }. ${bodyError.message || "An error occurred"}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default AdjustmentInvoiceDetail;
