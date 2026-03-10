import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Table, Tabs } from "antd";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import StatusComponent from "../../../../components/StatusComponent";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../constants/configApp";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import {
  getTaxExemptionDetail,
  getApprovalHierarchyDetail,
  getCategoryListTaxExemption,
  approveOrRejectTaxExemption,
} from "../../../../redux/slices/rating_billing_invoice/taxExemption";

const DetailTaxExemption = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;

  const { loading, dataDetail, approvalHierarchyDetail } = useSelector(
    (state) => state.taxExemption || {},
  );

  const taxExemption = dataDetail?.taxExemption || {};
  const contacts = dataDetail?.contacts || [];
  const attachments = useMemo(
    () =>
      (dataDetail?.attachments || []).map((att) => ({
        ...att,
        dataType: "exist",
        urlFile1: `/v1/dbs/api/tax-exemption/download-attachment/${att.fileId || att.id}`,
        key: att.fileId || att.id,
      })),
    [dataDetail?.attachments],
  );

  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  const approvalInfo = dataDetail?.approvalInfo || {};

  const showButtonApproval =
    approvalInfo.isApprover !== null && approvalInfo.isApprover;

  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const body = {
      id,
      description: res.remark,
      approvalId: approvalInfo.tAppId,
      action: approveOrReject.toUpperCase(),
    };
    dispatch(approveOrRejectTaxExemption({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getTaxExemptionDetail({ id }));
      });
  };

  useEffect(() => {
    if (id) {
      dispatch(getTaxExemptionDetail({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (taxExemption.apphierId) {
      dispatch(getApprovalHierarchyDetail({ id: taxExemption.apphierId }));
    }
  }, [dispatch, taxExemption.apphierId]);

  const appHierDataDetail = useMemo(() => {
    if (!approvalHierarchyDetail?.length) return [];
    return approvalHierarchyDetail.map((a, index) => ({
      ...a,
      key: index + 1,
      employeeDetail: (a.employeeDetail || []).map((b, i) => ({
        ...b,
        key: i + 1,
      })),
    }));
  }, [approvalHierarchyDetail]);

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    {
      path: INVOICE_ROUTES.TAX_EXMPTION_VIEW,
      breadcrumbName: "Tax Exemption",
    },
    {
      path: INVOICE_ROUTES.TAX_EXMPTION_DETAIL,
      breadcrumbName: "Detail",
    },
  ];

  const contactColumns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "DISTRIBUTION MEDIA",
      dataIndex: "contactType",
      key: "contactType",
      width: 160,
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      key: "contactName",
      width: 180,
    },
    {
      title: "VALUE",
      dataIndex: "contactValue",
      key: "contactValue",
      width: 200,
    },
    {
      title: "JOB",
      dataIndex: "job",
      key: "job",
      width: 120,
    },
    {
      title: "POSITION",
      dataIndex: "position",
      key: "position",
      width: 160,
    },
    {
      title: "CONTACT ADDRESS",
      dataIndex: "contactAddress",
      key: "contactAddress",
      width: 200,
    },
    {
      title: "CONTACT ADDRESS ADDITIONAL NOTE",
      dataIndex: "contactAddressAdditionalNotes",
      key: "contactAddressAdditionalNotes",
      width: 250,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 180,
    },
  ];

  const customerInfo = [
    { label: "Customer Number", value: taxExemption.customerNumber },
    { label: "Customer Name", value: taxExemption.customerName },
    { label: "Account Number", value: taxExemption.accountNumber },
    { label: "Account Name", value: taxExemption.accountName },
    { label: "Service Agreement Class", value: taxExemption.serviceType },
    { label: "Account Segment", value: taxExemption.accountSegment },
    { label: "SOR", value: taxExemption.sor },
    { label: "Cost Center Code", value: taxExemption.costCenter },
    { label: "Meter Reading Code", value: taxExemption.meterReadingCode },
  ];

  const historyInfo = [
    { label: "Record ID", value: taxExemption.taxExemptionId },
    {
      label: "Created Date",
      value: taxExemption.createdDate
        ? new Date(taxExemption.createdDate).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
    },
    { label: "Created By", value: taxExemption.createdBy },
    { label: "Updated By", value: taxExemption.updatedBy },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer type="tabs" header="TAX EXEMPTION DETAIL">
          <Tabs
            defaultActiveKey="detail"
            type="line"
            size="small"
            className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-4"
          >
            <Tabs.TabPane tab="Detail" key="detail">
              <div className="flex flex-col gap-3">
                {/* Tax Exemption Information */}
                <BaseContainer border header="TAX EXEMPTION INFORMATION">
                  <div className="grid grid-cols-5 gap-x-4 gap-y-3 py-3">
                    <div>
                      <p className="text-xs text-gray-500">Submit Date</p>
                      <p className="text-sm font-medium">
                        {taxExemption.submitDate
                          ? new Date(
                              taxExemption.submitDate,
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Document Date</p>
                      <p className="text-sm font-medium">
                        {taxExemption.transactionDate
                          ? new Date(
                              taxExemption.transactionDate,
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Document Number</p>
                      <p className="text-sm font-medium">
                        {taxExemption.proformaInvoiceNumber || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <StatusComponent
                        colour={taxExemption.status}
                        size="small"
                      >
                        {taxExemption.status || ""}
                      </StatusComponent>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Proforma Invoice</p>
                      {taxExemption.pathFile ? (
                        <a
                          href={taxExemption.pathFile}
                          className="text-xs"
                          style={{ color: "#0075BF" }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {taxExemption.proformaInvoiceNumber}.pdf
                        </a>
                      ) : (
                        <p className="text-sm font-medium"></p>
                      )}
                    </div>
                  </div>
                </BaseContainer>

                {/* Customer Information */}
                <BaseContainer border header="CUSTOMER INFORMATION">
                  <div className="grid grid-cols-4 gap-x-4 gap-y-3 py-3">
                    {customerInfo.map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-sm font-medium">
                          {item.value || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </BaseContainer>

                {/* Contact Information */}
                <BaseContainer border header="CONTACT INFORMATION">
                  <div className="py-2">
                    <Table
                      dataSource={contacts}
                      columns={contactColumns}
                      pagination={false}
                      size="small"
                      scroll={{ x: "max-content" }}
                      rowKey="id"
                      summary={() => (
                        <Table.Summary>
                          <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={contactColumns.length}>
                              <div className="flex justify-end text-xs text-gray-500 pr-2">
                                Showing {contacts.length} of {contacts.length}{" "}
                                entries{" "}
                                <span
                                  className="ml-2"
                                  style={{ color: "#0075BF" }}
                                >
                                  All data showed
                                </span>
                              </div>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </Table.Summary>
                      )}
                    />
                  </div>
                </BaseContainer>
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Approval" key="approval">
              <BaseContainer border header="APPROVAL INFORMATION">
                <div className="pb-3">
                  <ApprovalComponentGeneral
                    type="detail"
                    dataTable={appHierDataDetail}
                    dataOption={[]}
                    selectedHierarchy={taxExemption.apphierId}
                    updateSelectedHierarchy={() => {}}
                    showSelect={false}
                  />
                </div>
              </BaseContainer>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Attachment" key="attachment">
              <BaseContainer border header="ATTACHMENT INFORMATION">
                <div className="pb-3">
                  <AttachmentComponent
                    type="detail"
                    data={attachments}
                    updateData={() => {}}
                    dispatch={dispatch}
                    getAPICategory={getCategoryListTaxExemption}
                    typeSelector="taxExemption"
                    service={ratingBillingHttpService}
                    configApplication={configApp.RATING_BILLING_SERVICE}
                    typeRBI="data"
                  />
                </div>
              </BaseContainer>
            </Tabs.TabPane>
          </Tabs>
        </CardContainer>

        {/* History Log Information */}
        <CardContainer header="HISTORY LOG INFORMATION">
          <div className="grid grid-cols-4">
            {historyInfo.map((item) => (
              <div key={item.label}>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-medium">{item.value || ""}</p>
              </div>
            ))}
          </div>
        </CardContainer>

        <div className="flex my-[10px]">
          <ButtonComponent type="submit" onClick={() => navigate(-1)}>
            Cancel
          </ButtonComponent>

          {showButtonApproval ? (
            <div className="w-full flex justify-end gap-3">
              <ButtonComponent
                type="reject"
                onClick={() => {
                  setApproveOrReject("Reject");
                  setModalConfirm(true);
                }}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => {
                  setApproveOrReject("Approve");
                  setModalConfirm(true);
                }}
              >
                Approve
              </ButtonComponent>
            </div>
          ) : null}
        </div>

        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={() => setModalConfirm(false)}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu="Tax Exemption"
          named={taxExemption.proformaInvoiceNumber}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default DetailTaxExemption;
