import React, { Fragment } from "react";
import { Tag } from "antd";

import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

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

// ─── Main component ──────────────────────────────────────────────────────────

const CustomerServiceRequestDetailInfo = ({ data_detail }) => {
  const sr               = data_detail  || {};
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
      width: 200,
      sorter: true,
      filter: true,
    },
    {
      title: "VALUE",
      dataIndex: "drValue",
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
      render: (v) => NxDate.formatDate(v, "DD MMM YYYY HH:mm:ss"),
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
      title: "REMARK",
      dataIndex: "newValue",
      sorter: true,
      filter: true,
      render: (v) => v || "-",
    },
  ];

  return (
    <Fragment>
      {/* ── SERVICE REQUEST INFORMATION ── */}
      <NxBaseContainer header="SERVICE REQUEST INFORMATION" border>
        <div className="flex flex-col gap-y-4">
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label="Service Request Reference">
              {sr.requestNumber || "-"}
            </NxDetailText>
            <NxDetailText label="Type">{sr.requestTypeName || "-"}</NxDetailText>
            <NxDetailText label="Category">{sr.requestCategoryName || "-"}</NxDetailText>

            <NxDetailText label="Sub Category">{sr.requestSubCategoryName || "-"}</NxDetailText>
            <NxDetailText label="Channel">{sr.channelName || "-"}</NxDetailText>
            <NxDetailText label="Priority">{sr.priorityName || "-"}</NxDetailText>

            <NxDetailText label="Request Source">{sr.sourceName || "-"}</NxDetailText>
            <NxDetailText label="Request Date">{NxDate.formatDate(sr.requestDate, "DD MMM YYYY")}</NxDetailText>
            <NxDetailText label="Open Date">{NxDate.formatDate(sr.openDate, "DD MMM YYYY")}</NxDetailText>

            <NxDetailText label="Resolved Date">{NxDate.formatDate(sr.resolvedDate, "DD MMM YYYY")}</NxDetailText>
            <NxDetailText label="Age (Hour)">{sr.duration ?? "-"}</NxDetailText>
            <NxDetailText label="Closed Date">{NxDate.formatDate(sr.closedDate, "DD MMM YYYY")}</NxDetailText>

            <NxDetailText label="Status">
              <StatusBadge value={sr.status} />
            </NxDetailText>
            <NxDetailText label="Status Pre-Requisite">
              <StatusBadge value={sr.statusPrerequisite} />
            </NxDetailText>
            <NxDetailText label="Status Approval">
              <StatusBadge value={sr.statusApproval} />
            </NxDetailText>
          </div>
          <div className="w-full">
            <NxDetailText label="Description">{sr.description || "-"}</NxDetailText>
          </div>
        </div>
      </NxBaseContainer>

      {/* ── DATA REQUIREMENT ── */}
      <NxBaseContainer header="DATA REQUIREMENT" border>
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
      </NxBaseContainer>

      {/* ── ACTION LOG ── */}
      <NxBaseContainer header="ACTION LOG" border>
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
      </NxBaseContainer>

      {/* ── HISTORY LOG INFORMATION ── */}
      <NxBaseContainer header="HISTORY LOG INFORMATION" border>
        <div className="w-full grid grid-cols-5 gap-4">
          <NxDetailText label="Record ID">
            {historyLog.recordId || sr.id || "-"}
          </NxDetailText>
          <NxDetailText label="Created Date">
            {NxDate.formatDate(historyLog.createdDate || sr.createdDate, "DD MMM YYYY HH:mm:ss")}
          </NxDetailText>
          <NxDetailText label="Created By">
            {historyLog.createdBy || sr.createdBy || "-"}
          </NxDetailText>
          <NxDetailText label="Updated Date">
            {NxDate.formatDate(historyLog.updatedDate || sr.updatedDate, "DD MMM YYYY HH:mm:ss")}
          </NxDetailText>
          <NxDetailText label="Updated By">
            {historyLog.updatedBy || sr.updatedBy || "-"}
          </NxDetailText>
        </div>
      </NxBaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestDetailInfo;
