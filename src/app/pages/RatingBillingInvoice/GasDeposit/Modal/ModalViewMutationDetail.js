import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import moment from "moment";
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
  { key: "category", title: "CATEGORY", dataIndex: "category", width: 150 },
  { key: "type", title: "TYPE", dataIndex: "type", width: 120 },
  { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 180 },
  { key: "fileSize", title: "FILE SIZE", dataIndex: "fileSize", width: 100 },
  { key: "uploadedBy", title: "UPLOADED BY", dataIndex: "uploadedBy", width: 150 },
  { key: "uploadDate", title: "UPLOAD DATE", dataIndex: "uploadDate", width: 150 },
];

const pickFirstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const extractApprovalRows = (payload) => {
  const approverSource = payload?.dataApprover || {};
  const candidates = [
    approverSource.GAS_DEPOSIT_MUTATION,
    approverSource.gas_deposit_mutation,
    approverSource.GAS_DEPOSIT,
    approverSource.gas_deposit,
  ].find((item) => Array.isArray(item) && item.length > 0) || [];

  const rows = [];

  candidates.forEach((item) => {
    if (Array.isArray(item?.employeeDetail) && item.employeeDetail.length > 0) {
      item.employeeDetail.forEach((employee) => {
        rows.push({
          approver: pickFirstValue(
            employee?.approver,
            employee?.employeeName,
            employee?.employeeFullname,
            employee?.name,
            employee?.username,
            employee?.employeeNo,
          ),
          role: pickFirstValue(
            employee?.role,
            employee?.roleName,
            employee?.positionName,
            item?.approvalName,
            item?.role,
          ),
          status: pickFirstValue(employee?.status, employee?.approvalStatus, item?.status),
        });
      });
      return;
    }

    rows.push({
      approver: pickFirstValue(
        item?.approver,
        item?.employeeName,
        item?.employeeFullname,
        item?.name,
        item?.username,
        item?.employeeNo,
      ),
      role: pickFirstValue(item?.role, item?.roleName, item?.positionName, item?.approvalName),
      status: pickFirstValue(item?.status, item?.approvalStatus),
    });
  });

  return rows
    .filter((item) => item.approver || item.role || item.status)
    .map((item, idx) => ({
      key: idx,
      no: idx + 1,
      approver: item.approver || "-",
      role: item.role || "-",
      status: item.status || "-",
    }));
};

const extractHierarchyApprovalRows = (payload) => {
  const hierarchyRows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const rows = [];

  hierarchyRows.forEach((item) => {
    if (Array.isArray(item?.employeeDetail) && item.employeeDetail.length > 0) {
      item.employeeDetail.forEach((employee) => {
        rows.push({
          approver: pickFirstValue(
            employee?.approver,
            employee?.employeeName,
            employee?.employeeFullname,
            employee?.name,
            employee?.username,
            employee?.employeeNo,
          ),
          role: pickFirstValue(
            employee?.role,
            employee?.roleName,
            employee?.positionName,
            item?.approvalName,
          ),
          status: pickFirstValue(employee?.status, "Waiting Approval"),
        });
      });
      return;
    }

    rows.push({
      approver: pickFirstValue(
        item?.approver,
        item?.employeeName,
        item?.employeeFullname,
        item?.name,
        item?.username,
        item?.employeeNo,
      ),
      role: pickFirstValue(item?.role, item?.roleName, item?.positionName, item?.approvalName),
      status: pickFirstValue(item?.status, "Waiting Approval"),
    });
  });

  return rows
    .filter((item) => item.approver || item.role || item.status)
    .map((item, idx) => ({
      key: idx,
      no: idx + 1,
      approver: item.approver || "-",
      role: item.role || "-",
      status: item.status || "-",
    }));
};

const extractAttachmentRows = (payload) => {
  const attachments = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  return attachments.map((item, idx) => ({
    key: item.id ?? idx,
    no: idx + 1,
    fileName: item.fileName || "-",
    category: item.fileCategoryName || item.category || "-",
    type: item.type || "-",
    description: item.description || "-",
    fileSize: item.fileSize ?? "-",
    uploadedBy: item.createdBy || item.updatedBy || "-",
    uploadDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
  }));
};

const ModalViewMutationDetail = ({
  isOpen,
  handleCancel = () => {},
  selectedData = {},
  selectedMutationDetail = {},
}) => {
  const mutationReferenceId =
    selectedMutationDetail?.mutationId ??
    selectedMutationDetail?.stgMutId ??
    selectedMutationDetail?.id;
  const mutationApphierId = selectedMutationDetail?.apphierId;
  const [approvalRows, setApprovalRows] = useState([]);
  const [attachmentRows, setAttachmentRows] = useState([]);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingAttachment, setLoadingAttachment] = useState(false);

  useEffect(() => {
    if (!isOpen || !mutationReferenceId) return;

    setLoadingApproval(true);
    const approvalPromise = mutationApphierId
      ? ratingBillingHttpService.getDetail(
          `/v1/dbs/api/billing/approval-hierarchy-detail/${mutationApphierId}`,
        )
      : ratingBillingHttpService.getDetail(
          `/v1/dbs/api/gas-deposit/approval-history/${mutationReferenceId}`,
        );

    approvalPromise
      .then((res) => {
        setApprovalRows(
          mutationApphierId ? extractHierarchyApprovalRows(res) : extractApprovalRows(res),
        );
      })
      .catch(() => setApprovalRows([]))
      .finally(() => setLoadingApproval(false));

    setLoadingAttachment(true);
    ratingBillingHttpService
      .getDetail(
        `/v1/dbs/api/gas-deposit/attachments?referenceId=${mutationReferenceId}&category=GAS_DEPOSIT_MUTATION`,
      )
      .then((res) => {
        setAttachmentRows(extractAttachmentRows(res));
      })
      .catch(() => setAttachmentRows([]))
      .finally(() => setLoadingAttachment(false));
  }, [isOpen, mutationReferenceId, mutationApphierId]);
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
