import React, { Fragment } from "react";
import { Tag } from "antd";
import moment from "moment";

import DetailText from "../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../components/BaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { dateFormatting } from "../../../../../../../utils";

// ─── Status badge helper ────────────────────────────────────────────────────

const STATUS_COLOR = {
  OPEN:             { bg: "#22c55e", label: "Open" },
  IN_PROGRESS:      { bg: "#f97316", label: "In Progress" },
  ON_HOLD:          { bg: "#eab308", label: "On Hold" },
  RESOLVED:         { bg: "#3b82f6", label: "Resolved" },
  CLOSED:           { bg: "#6b7280", label: "Closed" },
  CANCELLED:        { bg: "#ef4444", label: "Cancelled" },
  CANCELED:         { bg: "#ef4444", label: "Cancelled" },
  DRAFT:            { bg: "#a855f7", label: "Draft" },
  ACTIVE:           { bg: "#22c55e", label: "Active" },
  WAITING_APPROVAL: { bg: "#f59e0b", label: "Waiting Approval" },
  APPROVED:         { bg: "#10b981", label: "Approved" },
  REJECTED:         { bg: "#ef4444", label: "Rejected" },
  COMPLETED:        { bg: "#10b981", label: "Completed" },
  COMPLETE:         { bg: "#10b981", label: "Completed" },
  NONE:             { bg: "#9ca3af", label: "None" },
};

const StatusBadge = ({ value }) => {
  const key = (value || "").toUpperCase().replace(/ /g, "_");
  const cfg = STATUS_COLOR[key] || { bg: "#9ca3af", label: value || "-" };
  return (
    <Tag
      style={{
        backgroundColor: cfg.bg,
        color: "#fff",
        border: "none",
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {cfg.label}
    </Tag>
  );
};

// ─── Date formatters ─────────────────────────────────────────────────────────

const fmt     = (d) => (d ? moment(d).format(dateFormatting?.dateTime || "DD MMM YYYY HH:mm:ss") : "-");
const fmtDate = (d) => (d ? moment(d).format(dateFormatting?.date     || "DD MMM YYYY")           : "-");

// ─── Main component ──────────────────────────────────────────────────────────

const CustomerServiceRequestDetailInfo = ({ data_detail }) => {
  const sr             = data_detail  || {};
  const dataRequirements = Array.isArray(sr.dataRequirements) ? sr.dataRequirements : [];
  const actionLog        = Array.isArray(sr.actionLog)        ? sr.actionLog        : [];
  const historyLog       = sr.historyLog || {};

  // ── Data Requirement columns ──
  const drColumns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "TYPE",
      dataIndex: "drType",
      width: 100,
      sorter: true,
      filter: true,
    },
    {
      title: "VALUE",
      dataIndex: "drValue",
      sorter: true,
      filter: true,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "drDesc",
      sorter: true,
      filter: true,
    },
  ];

  // ── Action Log columns ──
  const logColumns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "DATE",
      dataIndex: "createdDate",
      width: 180,
      sorter: true,
      filter: true,
      render: (v) => fmt(v),
    },
    {
      title: "USERNAME",
      dataIndex: "createdBy",
      width: 150,
      sorter: true,
      filter: true,
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 250,
      sorter: true,
      filter: true,
    },
    {
      title: "NEW VALUE",
      dataIndex: "newValue",
      sorter: true,
      filter: true,
      render: (v) =>
        v ? (
          <span className="text-xs text-gray-500 truncate max-w-xs block">{v}</span>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <Fragment>
      {/* ── SERVICE REQUEST INFORMATION ── */}
      <BaseContainer header="SERVICE REQUEST INFORMATION">
        <div className="w-full grid grid-cols-4 gap-4">
          <DetailText label="Service Request Reference">
            {sr.requestNumber || "-"}
          </DetailText>
          <DetailText label="Type">{sr.requestTypeName || "-"}</DetailText>
          <DetailText label="Category">{sr.requestCategoryName || "-"}</DetailText>
          <DetailText label="Sub Category">
            {sr.requestSubCategoryName || "-"}
          </DetailText>

          <DetailText label="Channel">{sr.channelName || "-"}</DetailText>
          <DetailText label="Priority">{sr.priorityName || "-"}</DetailText>
          <DetailText label="Request Source">{sr.sourceName || "-"}</DetailText>
          <DetailText label="Cost Center">{sr.costCenterName || "-"}</DetailText>

          <DetailText label="Request Date">{fmtDate(sr.requestDate)}</DetailText>
          <DetailText label="Open Date">{fmtDate(sr.openDate)}</DetailText>
          <DetailText label="Resolved Date">{fmtDate(sr.resolvedDate)}</DetailText>
          <DetailText label="Age (Hour)">{sr.duration ?? "-"}</DetailText>

          <DetailText label="Closed Date">{fmtDate(sr.closedDate)}</DetailText>
          <DetailText label="Reference">{sr.reference || "-"}</DetailText>
          <div />
          <div />

          <DetailText label="Status">
            <StatusBadge value={sr.status} />
          </DetailText>
          <DetailText label="Status Pre-Requisite">
            <StatusBadge value={sr.statusPrerequisite} />
          </DetailText>
          <DetailText label="Status Approval">
            <StatusBadge value={sr.statusApproval} />
          </DetailText>
          <div />
        </div>
        <div className="w-full mt-2">
          <DetailText label="Description">{sr.description || "-"}</DetailText>
        </div>
      </BaseContainer>

      {/* ── DATA REQUIREMENT ── */}
      <BaseContainer header="DATA REQUIREMENT">
        <NxTable
          dataSource={dataRequirements.map((item, i) => ({
            ...item,
            key: item.id || i,
          }))}
          columns={drColumns}
          usePagination={false}
          fontSize="small"
          tablePadding="small"
          tableScrolled={{ x: "max-content" }}
        />
      </BaseContainer>

      {/* ── ACTION LOG ── */}
      <BaseContainer header="ACTION LOG">
        <NxTable
          dataSource={actionLog.map((item, i) => ({
            ...item,
            key: item.id || i,
          }))}
          columns={logColumns}
          usePagination={true}
          fontSize="small"
          tablePadding="small"
          tableScrolled={{ x: "max-content", y: 300 }}
        />
      </BaseContainer>

      {/* ── HISTORY LOG INFORMATION ── */}
      <BaseContainer header="HISTORY LOG INFORMATION">
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="Record ID">
            {historyLog.recordId || sr.id || "-"}
          </DetailText>
          <DetailText label="Created Date">
            {fmt(historyLog.createdDate || sr.createdDate)}
          </DetailText>
          <DetailText label="Created By">
            {historyLog.createdBy || sr.createdBy || "-"}
          </DetailText>
          <DetailText label="Updated Date">
            {fmt(historyLog.updatedDate || sr.updatedDate)}
          </DetailText>
          <DetailText label="Updated By">
            {historyLog.updatedBy || sr.updatedBy || "-"}
          </DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestDetailInfo;
