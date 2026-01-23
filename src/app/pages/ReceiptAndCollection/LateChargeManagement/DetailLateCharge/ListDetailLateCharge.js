import React, { useEffect, useState } from "react";
import { Spin, message, Form } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import RadioTabs from "../../../../../components/RadioTabs";
import ButtonComponent from "../../../../../components/ButtonComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import GridLayout from "../../../../../components/GridLayout";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import {
  getDetailLateChargePayment,
  resetDetail,
  approveOrRejectLateCharge,
  getListCategory,
  getListApprovalById,
  getAllApprovalList
} from "../../../../../redux/slices/receipt_collection/lateCharge";
import { getAdjustmentColumns, getHistoryColumns } from "./LateChargeDetailColumns";

const ListDetailLateCharge = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = location?.state || {};
  const [form] = Form.useForm();

  const { data_detail, loading, dataListAppHierDetail, dataListAppHierId } = useSelector((state) => state.late);

  const [valuePage, setValuePage] = useState("Late Charge");
  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);

  const tabData = [{ value: "Late Charge" }, { value: "Approval" }, { value: "Attachment" }];

  useEffect(() => {
    if (id) {
      dispatch(getDetailLateChargePayment(id));
      dispatch(getListCategory());
      dispatch(getAllApprovalList());
    }
    return () => dispatch(resetDetail());
  }, [dispatch, id]);

  useEffect(() => {
    if (data_detail?.lateCharge?.appHierId) {
      setSelectedHierarchy(data_detail.lateCharge.appHierId);
      form.setFieldsValue({ apphierId: data_detail.lateCharge.appHierId });
      dispatch(getListApprovalById({ id: data_detail.lateCharge.appHierId }));
    }
    if (data_detail?.attachmentDtoList) {
      const dataAttachment = (data_detail.attachmentDtoList || []).map(
        (item) => ({
          ...item,
          createdDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "",
          dataType: "exist",
        })
      );
      setListDataAttachment(dataAttachment);
    }
  }, [dispatch, data_detail, form, appHierOptions]); // Added appHierOptions as dependency

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  const lateCharge = data_detail?.lateCharge || {};
  const invoiceInfo = data_detail?.invoiceInfo || {};
  const adjustmentList = data_detail?.adjustmentList || [];
  const historyList = data_detail?.historyList || [];

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LATE_CHARGE, breadcrumbName: "Late Charge" },
    { path: "", breadcrumbName: "Detail Late Charge" },
  ];

  const isShowButton = data_detail?.tApprovalDto?.isApprover;

  const handleConfirm = (vals, handleClearModal) => {
    const body = {
      id: id,
      remark: vals.remark,
      approvalId: data_detail?.tApprovalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    dispatch(approveOrRejectLateCharge({ body })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        message.success(`Successfully ${approveOrReject}ed!`);
        navigate(-1);
      }
    });
    handleClearModal();
    setModalApprove(false);
  };

  const adjustmentColumns = getAdjustmentColumns({});
  const historyColumns = getHistoryColumns({});

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <div className="mt-5 pb-10">
          <RadioTabs data={tabData} onChange={(e) => setValuePage(e.target.value)} currentPosition={valuePage} className="mb-5" />

          <div style={{ display: valuePage !== "Late Charge" ? "none" : "block" }}>
            <div className="flex flex-col gap-5">
              <BaseContainer header={"LATE CHARGE INFORMATION"}>
                <GridLayout cols={3} className="p-4">
                  <DetailText label="Area Code">{lateCharge.areaCode}</DetailText>
                  <DetailText label="Area Name">{lateCharge.areaName}</DetailText>
                  <DetailText label="Customer ID">{lateCharge.customerNumber}</DetailText>
                  <DetailText label="Customer Name">{lateCharge.customerName}</DetailText>
                  <DetailText label="Period Tagihan">{lateCharge.periodTagihan ? moment(lateCharge.periodTagihan).format("MMM YYYY") : "-"}</DetailText>
                  <DetailText label="Payment Amount">{lateCharge.paymentAmount?.toLocaleString("id-ID")}</DetailText>
                  <DetailText label="Type">{lateCharge.type}</DetailText>
                  <DetailText label="Invoice No">{lateCharge.invoiceNo}</DetailText>
                  <DetailText label="Total Days Late">{lateCharge.totalDaysLate}</DetailText>
                  <DetailText label="Total Late Charge">{lateCharge.totalLateCharge?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</DetailText>
                  <DetailText label="Due Date">{lateCharge.dueDate ? moment(lateCharge.dueDate).format("DD MMM YYYY") : "-"}</DetailText>
                  <DetailText label="Late Charge Rate">{lateCharge.lateChargeRate?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</DetailText>
                  <DetailText label="Payment Date">{lateCharge.paymentDate ? moment(lateCharge.paymentDate).format("DD MMM YYYY") : "-"}</DetailText>
                  <DetailText label="Late Charge Time Unit">{lateCharge.lateChargeTimeUnit}</DetailText>
                  <DetailText label="Remark">{lateCharge.remark}</DetailText>
                </GridLayout>
              </BaseContainer>

              <BaseContainer header={"INVOICE INFORMATION"}>
                <GridLayout cols={3} className="p-4">
                  <DetailText label="Invoice No">{invoiceInfo.invoiceNo}</DetailText>
                  <DetailText label="Total Amount">{invoiceInfo.totalAmount?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</DetailText>
                  <DetailText label="Due Date">{invoiceInfo.dueDate ? moment(invoiceInfo.dueDate).format("DD MMM YYYY") : "-"}</DetailText>
                </GridLayout>
              </BaseContainer>

              <BaseContainer header={"ADJUSTMENT LIST"}>
                <div className="p-4">
                  <TableRBI
                    columns={adjustmentColumns}
                    dataSource={adjustmentList}
                    rowKey="id"
                    usePagination={false}
                    tableScrolled={{ x: 1200, y: 300 }}
                  />
                </div>
              </BaseContainer>

              <BaseContainer header={"LATE CHARGE HISTORIES LIST"}>
                <div className="p-4">
                  <TableRBI
                    columns={historyColumns}
                    dataSource={historyList}
                    rowKey="id"
                    usePagination={false}
                    tableScrolled={{ x: 1000, y: 300 }}
                  />
                </div>
              </BaseContainer>
            </div>
          </div>

          <div style={{ display: valuePage !== "Approval" ? "none" : "block" }}>
            <BaseContainer header={"APPROVAL HIERARCHY"}>
              <Form form={form}>
                <ApprovalComponentGeneral
                  showSelect={true}
                  disableSelect={true}
                  dataTable={dataListAppHierDetail || []}
                  dataOption={appHierOptions}
                  selectedHierarchy={selectedHierarchy}
                />
              </Form>
            </BaseContainer>
          </div>

          <div style={{ display: valuePage !== "Attachment" ? "none" : "block" }}>
            <BaseContainer header={"ATTACHMENT LIST"}>
              <AttachmentComponent
                type="detail"
                data={listDataAttachment}
                typeSelector="late"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
              />
            </BaseContainer>
          </div>

          <div className="flex justify-between mt-5">
            <ButtonComponent type="primary" onClick={() => navigate(-1)} icon={<LeftOutlined style={{ color: "#fff", fontSize: 24 }} />}>Back</ButtonComponent>
            {isShowButton && (
              <div className="flex gap-3">
                <ButtonComponent type="reject" onClick={() => { setApproveOrReject("reject"); setModalApprove(true); }}>Reject</ButtonComponent>
                <ButtonComponent type="approve" onClick={() => { setApproveOrReject("approve"); setModalApprove(true); }}>Approve</ButtonComponent>
              </div>
            )}
          </div>
        </div>
      </Spin>

      <ModalApproveOrReject
        isOpen={modalApprove}
        handleCloseModal={() => setModalApprove(false)}
        onFinish={handleConfirm}
        header={approveOrReject === "approve" ? "Approve" : "Reject"}
        approveOrReject={approveOrReject}
        menu={"Late Charge"}
        named={lateCharge.id}
      />
    </LayoutMenu>
  );
};

export default ListDetailLateCharge;
