import React, { useState, useEffect } from "react";
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

const AdjustmentInvoiceDetail = () => {
  // Selector - Placeholder for Redux state
  const loading = false;
  const dataDetail = {};

  // Declaration
  const navigate = useNavigate();
  const id = useLocation().state?.id;
  const dispatch = useDispatch();

  // State
  const [listDataAttachment, setListDataAttachment] = useState([]);
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

  // Use Effect - Placeholder for API calls
  useEffect(() => {
    if (id) {
      // TODO: dispatch(getDetailAdjustmentInvoice(id))
    }
  }, [dispatch, id]);

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

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Adjustment Invoice":
        return (
          <>
            {/* Customer Information Section */}
            <BaseContainer header={"CUSTOMER INFORMATION"}>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Customer Number</p>
                  <p className="font-medium">CUS002</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Customer Name</p>
                  <p className="font-medium">PT KERAMIK INTI</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Number</p>
                  <p className="font-medium">0002</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Name</p>
                  <p className="font-medium">Keramik Inti Tj Barat</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Segment</p>
                  <p className="font-medium">PK</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Group Type</p>
                  <p className="font-medium">PK1</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">SOR</p>
                  <p className="font-medium">SOR II</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Cost Center Code</p>
                  <p className="font-medium">122</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Cost Center Name</p>
                  <p className="font-medium">Jakarta Timur</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Meter Reading Code</p>
                  <p className="font-medium">8k2979</p>
                </div>
              </div>
            </BaseContainer>

            {/* Adjustment Invoice Information Section */}
            <BaseContainer header={"ADJUSTMENT INVOICE INFORMATION"}>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Billing Cycle</p>
                  <p className="font-medium">5-5</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Billing Period</p>
                  <p className="font-medium">Feb 2022</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Invoice Number</p>
                  <p className="font-medium">INV002</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Transaction Date</p>
                  <p className="font-medium">10 Jan 2022</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Document Date</p>
                  <p className="font-medium">10 Jan 2022</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Terms Of Payment</p>
                  <p className="font-medium">Value</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Adjustment Reason</p>
                  <p className="font-medium">Kebocoran Gas</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-sm">Remark</p>
                  <p className="font-medium">Test</p>
                </div>
              </div>
            </BaseContainer>

            {/* Invoice Information Section */}
            <BaseContainer header={"INVOICE INFORMATION"}>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Invoice Number</p>
                  <p className="font-medium">INV002</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Billing Code</p>
                  <p className="font-medium">BC8279</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Invoice Date</p>
                  <p className="font-medium">7 Jan 2022</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Terms of Payment</p>
                  <p className="font-medium">17 Jan 2023</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Billing Cycle</p>
                  <p className="font-medium">5-5</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Billing Period</p>
                  <p className="font-medium">Des 2021</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Amount IDR</p>
                  <p className="font-medium">1.200.000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Amount USD</p>
                  <p className="font-medium">0.00</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Amount EQV IDR</p>
                  <p className="font-medium">1.200.000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Amount EQV USD</p>
                  <p className="font-medium">71.08</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Currency</p>
                  <p className="font-medium">IDR</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Withholding Tax</p>
                  <p className="font-medium">300.000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Tax Basis IDR</p>
                  <p className="font-medium">15.000.000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Tax Basis USD</p>
                  <p className="font-medium">15.000.000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Vat IDR</p>
                  <p className="font-medium">1.650.000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">VAT USD</p>
                  <p className="font-medium">165</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Rate</p>
                  <p className="font-medium">15.000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Rate Type</p>
                  <p className="font-medium">Corporate</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Rate Date</p>
                  <p className="font-medium">11 Jan 2022</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="font-medium">
                    <span className="bg-green-500 text-white px-3 py-1 rounded">
                      Paid
                    </span>
                  </p>
                </div>
              </div>
            </BaseContainer>

            {/* History Log Information */}
            <BaseContainer header={"HISTORY LOG INFORMATION"}>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Record ID</p>
                  <p className="font-medium">1345</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Created Date</p>
                  <p className="font-medium">05 Dec 2025 01:00:00</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Created By</p>
                  <p className="font-medium">user</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Created By</p>
                  <p className="font-medium">user</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Updated By</p>
                  <p className="font-medium">user</p>
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
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="adjustmentBilling"
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
  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      id: id,
      description: res.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };

    // TODO: dispatch(approveOrRejectAdjustmentInvoice({ body: data }))
    handleClear();
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
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default AdjustmentInvoiceDetail;
