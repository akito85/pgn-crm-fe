import React from "react";
import { Skeleton } from "antd";

// Status buckets split into two legend groups, mirroring the reference design:
//   - "terminal" outcomes on the left
//   - "in-flight / pending" states on the right (after the divider)
// Each bucket also feeds a proportional segment in the summary bar, rendered in
// this same order (left → right).
const TERMINAL = [
  { key: "SUCCEEDED", label: "Succeeded", colour: "#16a34a" }, // green
  { key: "FAILED",    label: "Failed",    colour: "#e5484d" }, // red
  { key: "CANCELLED", label: "Cancelled", colour: "#f2790d" }, // orange
  { key: "STALLED",   label: "Stalled",   colour: "#f2a20d" }, // amber
  { key: "DELETED",   label: "Deleted",   colour: "#9aa4b2" }, // gray
];

const ACTIVE = [
  { key: "PENDING",    label: "Pending",    colour: "#f2790d" }, // orange
  { key: "SCHEDULED",  label: "Scheduled",  colour: "#9aa4b2" }, // gray
  { key: "PROCESSING", label: "Processing", colour: "#f2790d" }, // orange
  { key: "ON_HOLD",    label: "On-hold",    colour: "#b89b1e" }, // gold
  { key: "SUSPENDED",  label: "Suspended",  colour: "#b89b1e" }, // gold
];

const BUCKETS = [...TERMINAL, ...ACTIVE];

const num = (v) => Number(v ?? 0);

const LegendItem = ({ colour, label, value }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
    <span style={{ width: 9, height: 9, borderRadius: "50%", background: colour, flexShrink: 0 }} />
    <span style={{ color: "#5b6573", fontSize: 14 }}>{label}</span>
    <span style={{ fontWeight: 700, color: num(value) > 0 ? "#1f2937" : "#9aa4b2", fontSize: 14 }}>
      {num(value).toLocaleString()}
    </span>
  </span>
);

const JobStatsSummary = ({ stats = {}, loading = false }) => {
  if (loading) {
    return (
      <div style={{ border: "1px solid #e6e8eb", borderRadius: 14, padding: "18px 22px", background: "#fcfcfd" }}>
        <Skeleton.Button active size="large" shape="round" style={{ width: 180, height: 36 }} />
        <Skeleton.Button active size="small" shape="round" block style={{ height: 12, marginTop: 16 }} />
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 16 }}>
          {BUCKETS.map((b) => (
            <Skeleton.Button key={b.key} active size="small" shape="round" style={{ width: 110, height: 22 }} />
          ))}
        </div>
      </div>
    );
  }

  const total = BUCKETS.reduce((sum, b) => sum + num(stats?.[b.key]), 0);
  const succeeded = num(stats?.SUCCEEDED);
  const succeededPct = total > 0 ? (succeeded / total) * 100 : 0;

  return (
    <div style={{ border: "1px solid #e6e8eb", borderRadius: 14, padding: "18px 22px", background: "#fcfcfd" }}>
      {/* Header: total on the left, succeeded ratio on the right */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1, letterSpacing: "-0.01em" }}>
            {total.toLocaleString()}
          </span>
          <span style={{ fontSize: 14, color: "#9aa4b2" }}>total executions</span>
        </div>
        <span style={{ fontSize: 14, color: "#9aa4b2" }}>
          {succeededPct.toFixed(1)}% succeeded
        </span>
      </div>

      {/* Proportional segment bar */}
      <div
        style={{
          display: "flex",
          height: 10,
          borderRadius: 6,
          overflow: "hidden",
          background: "#eef0f2",
          marginTop: 14,
        }}
      >
        {total > 0 &&
          BUCKETS.map((b) => {
            const v = num(stats?.[b.key]);
            if (v <= 0) return null;
            return (
              <div
                key={b.key}
                title={`${b.label}: ${v.toLocaleString()}`}
                style={{ width: `${(v / total) * 100}%`, background: b.colour }}
              />
            );
          })}
      </div>

      {/* Legend: terminal group | active group */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          {TERMINAL.map((b) => (
            <LegendItem key={b.key} colour={b.colour} label={b.label} value={stats?.[b.key]} />
          ))}
        </div>
        <div style={{ width: 1, alignSelf: "stretch", minHeight: 18, background: "#e6e8eb", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          {ACTIVE.map((b) => (
            <LegendItem key={b.key} colour={b.colour} label={b.label} value={stats?.[b.key]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobStatsSummary;
