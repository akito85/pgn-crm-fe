import React from "react";
import { Skeleton } from "antd";

// Bucket order + display label + dot colour, matching the execution status palette.
const BUCKETS = [
  { key: "SUCCEEDED",  label: "Succeeded",  dot: "#16a34a" }, // green
  { key: "FAILED",     label: "Failed",     dot: "#e5484d" }, // red
  { key: "CANCELLED",  label: "Cancelled",  dot: "#f2790d" }, // orange
  { key: "STALLED",    label: "Stalled",    dot: "#f2a20d" }, // amber
  { key: "PENDING",    label: "Pending",    dot: "#f2790d" }, // orange
  { key: "SCHEDULED",  label: "Scheduled",  dot: "#9aa4b2" }, // gray
  { key: "PROCESSING", label: "Processing", dot: "#f2790d" }, // orange
  { key: "ON_HOLD",    label: "On-hold",    dot: "#b89b1e" }, // gold
  { key: "SUSPENDED",  label: "Suspended",  dot: "#b89b1e" }, // gold
  { key: "DELETED",    label: "Deleted",    dot: "#9aa4b2" }, // gray
];

const Chip = ({ dot, label, value }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "7px 14px", borderRadius: 22,
    border: "1px solid #e6e8eb", background: "#fff",
    fontSize: 13, lineHeight: 1, whiteSpace: "nowrap",
  }}>
    <span style={{ width: 9, height: 9, borderRadius: "50%", background: dot, flexShrink: 0 }} />
    <span style={{ color: "#5b6573" }}>{label}</span>
    <span style={{ fontWeight: 700, color: "#1f2937" }}>{Number(value ?? 0).toLocaleString()}</span>
  </div>
);

const JobStatsBar = ({ stats = {}, loading = false }) => {
  if (loading) {
    return (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "10px 4px", alignItems: "center" }}>
        <Skeleton.Button active size="large" shape="round" style={{ width: 120, height: 44 }} />
        {BUCKETS.map((b) => (
          <Skeleton.Button key={b.key} active size="small" shape="round" style={{ width: 110, height: 32 }} />
        ))}
      </div>
    );
  }

  const total = BUCKETS.reduce((sum, b) => sum + Number(stats?.[b.key] ?? 0), 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 4px", flexWrap: "wrap" }}>
      {/* Total */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          {total.toLocaleString()}
        </div>
        <div style={{ fontSize: 13, color: "#9aa4b2", marginTop: 2 }}>Total executions</div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, alignSelf: "stretch", minHeight: 44, background: "#e6e8eb", flexShrink: 0 }} />

      {/* Status chips */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {BUCKETS.map((b) => (
          <Chip key={b.key} dot={b.dot} label={b.label} value={stats?.[b.key]} />
        ))}
      </div>
    </div>
  );
};

export default JobStatsBar;
