import React from "react";
import { Skeleton } from "antd";
import StatusComponent from "../../../../components/StatusComponent";

// Bucket order + display label + StatusComponent colour key.
const BUCKETS = [
  { key: "SUCCEEDED",  label: "Succeeded",  colour: "completed" },
  { key: "FAILED",     label: "Failed",     colour: "failed" },
  { key: "CANCELLED",  label: "Cancelled",  colour: "cancelled" },
  { key: "STALLED",    label: "Stalled",    colour: "stalled" },
  { key: "PENDING",    label: "Pending",    colour: "pending" },
  { key: "SCHEDULED",  label: "Scheduled",  colour: "scheduled" },
  { key: "PROCESSING", label: "Processing", colour: "processing" },
  { key: "ON_HOLD",    label: "On-hold",    colour: "hold" },
  { key: "SUSPENDED",  label: "Suspended",  colour: "suspended" },
  { key: "DELETED",    label: "Deleted",    colour: "inactive" },
];

const JobStatsBar = ({ stats = {}, loading = false }) => {
  if (loading) {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
        {BUCKETS.map((b) => (
          <Skeleton.Button key={b.key} active size="small" shape="round" style={{ width: 96 }} />
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: "8px 0", alignItems: "center" }}>
      {BUCKETS.map((b) => (
        <div key={b.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StatusComponent colour={b.colour} size="small">{b.label}</StatusComponent>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#1f2937" }}>
            {Number(stats?.[b.key] ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default JobStatsBar;
