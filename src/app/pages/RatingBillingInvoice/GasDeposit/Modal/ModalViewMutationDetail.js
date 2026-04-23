import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import TableRBI from "../../../../../components/TableRBI";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";

const APPROVAL_COLUMNS_VMD = [
  { key: "no", title: "NO", dataIndex: "no", width: 50, align: "center" },
  { key: "approver", title: "APPROVER", dataIndex: "approver", width: 150 },
  { key: "role", title: "ROLE", dataIndex: "role", width: 120 },
  { key: "status", title: "STATUS", dataIndex: "status", width: 150 },
];

const ATTACHMENT_COLUMNS_VMD = [
  { key: "no", title: "NO", dataIndex: "no", width: 50, align: "center" },
  { key: "fileName", title: "FILE NAME", dataIndex: "fileName", width: 200 },
  { key: "uploadedBy", title: "UPLOADED BY", dataIndex: "uploadedBy", width: 150 },
  { key: "uploadDate", title: "UPLOAD DATE", dataIndex: "uploadDate", width: 130 },
];

const ModalViewMutationDetail = ({
  isOpen,
  handleCancel = () => {},
  selectedData = {},
  selectedMutationDetail = {},
}) => {
  const [approvalRows, setApprovalRows] = useState([]);
  const [attachmentRows, setAttachmentRows] = useState([]);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingAttachment, setLoadingAttachment] = useState(false);

  useEffect(() => {
    if (!isOpen || !selectedMutationDetail?.id) return;

    setLoadingApproval(true);
    ratingBillingHttpService
      .getDetail(`/v1/dbs/api/gas-deposit/approval-history/${selectedMutationDetail.id}`)
      .then((res) => {
        const data = res?.data?.dataApprover ?? res?.dataApprover ?? [];
        setApprovalRows(
          (Array.isArray(data) ? data : []).filter(Boolean).map((item, idx) => ({
            ...item,
            key: item.id ?? idx,
          })),
        );
      })
      .catch(() => setApprovalRows([]))
      .finally(() => setLoadingApproval(false));

    setLoadingAttachment(true);
    ratingBillingHttpService
      .getDetail(
        `/v1/dbs/api/gas-deposit/attachments?referenceId=${selectedMutationDetail.id}&category=GAS_DEPOSIT_MUTATION`,
      )
      .then((res) => {
        const data = res?.data ?? res;
        setAttachmentRows(
          (Array.isArray(data) ? data : []).filter(Boolean).map((item, idx) => ({
            ...item,
            key: item.id ?? idx,
          })),
        );
      })
      .catch(() => setAttachmentRows([]))
      .finally(() => setLoadingAttachment(false));
  }, [isOpen, selectedMutationDetail]);
  const gasDepositItems = [
    { label: "Customer Number", value: selectedData?.customerNumber },
    { label: "Customer Name", value: selectedData?.customerName },
    { label: "Account Number", value: selectedData?.accountNumber },
    { label: "Account Name", value: selectedData?.accountName },
    { label: "Account Group Type", value: selectedData?.accountGroupType },
    { label: "SOR", value: selectedData?.sor },
    { label: "Cost Center", value: selectedData?.costCenter },
    { label: "Account Segment", value: selectedData?.accountSegment },
    { label: "Meter Reading Code", value: selectedData?.meterReadingCode },
    { label: "Account Type", value: selectedData?.accountType },
    { label: "Classification Type", value: selectedData?.classificationType },
    { label: "SAP CUST ID", value: selectedData?.sapCustId },
  ];

  const mutationItems = [
    { label: "Document Number", value: selectedMutationDetail?.documentNumber },
    { label: "Source", value: selectedMutationDetail?.source },
    { label: "Billing Period", value: selectedMutationDetail?.billingPeriod },
    { label: "Mutation Date", value: selectedMutationDetail?.mutationDate },
    { label: "Mutation Type", value: selectedMutationDetail?.mutationType },
    { label: "Category", value: selectedMutationDetail?.category },
    { label: "UOM", value: selectedMutationDetail?.uom },
    { label: "Quantity", value: selectedMutationDetail?.quantity },
    { label: "Price", value: selectedMutationDetail?.price },
    { label: "Amount", value: selectedMutationDetail?.amount },
    { label: "Type", value: selectedMutationDetail?.type },
    { label: "Status", value: selectedMutationDetail?.status },
    { label: "Status Approval", value: selectedMutationDetail?.statusApproval },
    {
      label: "Description",
      value: selectedMutationDetail?.description,
      fullWidth: true,
    },
  ];

  const mutationTab = (
    <div className="space-y-4">
      <CollapsibleContainer header="Gas Deposit Information" border>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
          {gasDepositItems.map((item) => (
            <DetailText key={item.label} label={item.label}>
              {item.value ?? "-"}
            </DetailText>
          ))}
        </div>
      </CollapsibleContainer>

      <CollapsibleContainer header="Mutation Detail Information" border>
        <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2`}>
          {mutationItems.map((item) => (
            <DetailText
              key={item.label}
              label={item.label}
              className={item.fullWidth ? "sm:col-span-2 lg:col-span-4" : ""}
            >
              {item.value ?? "-"}
            </DetailText>
          ))}
        </div>
      </CollapsibleContainer>
    </div>
  );

  const approvalTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Approval Information" border>
        <TableRBI
          idTable="mutation-detail-approval-table"
          dataSource={approvalRows}
          columns={APPROVAL_COLUMNS_VMD}
          totalData={approvalRows.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
          loading={loadingApproval}
        />
      </CollapsibleContainer>
    </div>
  );

  const attachmentTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Attachment" border>
        <TableRBI
          idTable="mutation-detail-attachment-table"
          dataSource={attachmentRows}
          columns={ATTACHMENT_COLUMNS_VMD}
          totalData={attachmentRows.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
          loading={loadingAttachment}
        />
      </CollapsibleContainer>
    </div>
  );

  const tabItems = [
    { key: "mutation", label: "Mutation Detail", children: mutationTab },
    { key: "approval", label: "Approval", children: approvalTab },
    { key: "attachment", label: "Attachment", children: attachmentTab },
  ];

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancel}
      type="confirmation"
      header="View Mutation Detail"
      width={1000}
      footer={[
        <ButtonComponent key="close" onClick={handleCancel}>
          Close
        </ButtonComponent>,
      ]}
    >
      <Tabs
        items={tabItems}
        className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0"
      />
    </ModalCustom>
  );
};

ModalViewMutationDetail.propTypes = {
  isOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  selectedData: PropTypes.object,
  selectedMutationDetail: PropTypes.object,
};

export default ModalViewMutationDetail;
