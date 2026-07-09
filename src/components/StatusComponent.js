/* eslint-disable default-case */
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  Loading3QuartersOutlined,
  ExclamationCircleFilled,
  SyncOutlined,
  FileTextOutlined,
  StopOutlined,
} from "@ant-design/icons";
import React, { useMemo } from "react";

const StatusComponent = ({
  children,
  colour,
  type = "status",
  size = "default",
  margin = true,
}) => {
  const { bgcolor, textColor } = useMemo(() => {
    if (!colour || typeof colour !== "string") {
      return { bgcolor: "bg-slate-600", textColor: "text-white" };
    }

    const lowerColour = colour.toLowerCase();
    let bgColor = "bg-slate-600";
    let tColor = "text-white";

    switch (lowerColour) {
      // ===== SUCCESS STATUSES =====
      case "active":
      case "success":
      case "completed":
      case "complete":
      case "full payment":
      case "true":
      case "paid":
      case "complete billing":
      case "sent":
      case "approved":
      case "success_upload":
      case "standard":
        bgColor = "status-active";
        tColor = "text-white";
        break;

      case "open":
        bgColor = "status-active";
        tColor = "text-white";
        break;

      case "submitted":
        bgColor = "bg-[#1976D2]";
        tColor = "text-white";
        break;

      case "in_progress":
        bgColor = "bg-[#f57c00]";
        tColor = "text-white";
        break;

      case "on_hold":
        bgColor = "bg-[#F2D957]";
        tColor = "text-black";
        break;

      case "resolved":
        bgColor = "bg-[#0075BF]";
        tColor = "text-white";
        break;

      case "closed":
        bgColor = "bg-gray-600";
        tColor = "text-white";
        break;

      // ===== OK / NOT OK STATUSES =====
      case "ok":
        bgColor = "status-active";
        tColor = "text-white";
        break;

      case "not ok":
        bgColor = "bg-[#f57c00]";
        tColor = "text-white";
        break;

      // ===== FAILED/REJECTED STATUSES =====
      case "inactive":
      case "rejected":
      case "failed":
      case "close":
      case "no payment":
      case "false":
      case "unpaid":
      case "reject":
      case "not paid":
      case "failed billing":
      case "fail":
      case "not_paid":
      case "broken":
        bgColor = "status-inactive";
        tColor = "text-white";
        break;

      case "cancelled":
      case "CANCELLED":
      case "canceled":
        bgColor = "bg-[#f57c00]";
        tColor = "text-white";
        break;

      // Transient failure being auto-recovered by the reaper (distinct from hard FAILED).
      case "stalled":
        bgColor = "bg-[#E8833A]";
        tColor = "text-white";
        break;

      // ===== WAITING/PENDING STATUSES =====
      case "partial payment":
      case "waiting to release":
      case "need review":
        bgColor = "status-waiting";
        tColor = "text-yellow-700";
        break;

      // ===== PROCESSING STATUSES =====
      case "in progress":
      case "inprogress":
      case "awaiting_approval":
      case "awaiting approval":
      case "processing":
      case "waiting":
      case "waiting approval":
      case "waiting_approval":
      case "waiting_for_approval":
      case "waiting_cancellation_approval":
      case "waiting cancellation approval":
      case "waiting_upload_approval":
      case "waiting upload approval":
      case "partially paid": // recipt allocation
        bgColor = "bg-[#f57c00]";
        tColor = "text-white";
        break;

      // ===== DRAFT STATUSES =====
      case "draft":
      case "not_generated":
      case "not generated":
        bgColor = "bg-gray-600";
        tColor = "text-white";
        break;

      case "main":
        bgColor = "status-active";
        tColor = "text-white";
        break;

      case "break":
        bgColor = "bg-[#0075BF]";
        tColor = "text-white";
        break;

      case "expire":
      case "expired":
        bgColor = "status-inactive";
        tColor = "text-white";
        break;

      case "expire10":
        bgColor = "status-expire10";
        break;

      case "expire30":
        bgColor = "status-expire30";
        break;

      // ===== PENDING/ASSIGNED STATUSES =====
      case "pending":
      case "assigned":
        bgColor = "status-pending";
        tColor = "text-yellow-800";
        break;

      case "scheduled":
        bgColor = "bg-[#0075BF]";
        tColor = "text-white";
        break;

      case "primary":
      case "refund":
      case "unapplied":
        bgColor = "bg-[#0075BF]";
        tColor = "text-white";
        break;

      case "hold":
      case "rating":
      case "standby":
        bgColor = "bg-[#F57C00]";
        tColor = "text-white";
        break;

      case "applied":
        bgColor = "bg-[#288C44]";
        tColor = "text-white";
        break;

      case "reverse":
      case "reversed":
        bgColor = "bg-[#BE3036]";
        tColor = "text-white";
        break;

      case "non-primary":
        bgColor = "bg-gray-500";
        tColor = "text-white";
        break;

      case "rating and billing":
        bgColor = "rating-billing-pils";
        break;

      case "billing":
        bgColor = "billing-pils";
        break;

      case "pre paid":
        bgColor = "bg-lime-600";
        tColor = "text-white";
        break;

      case "registered":
        bgColor = "bg-[#0075BF]";
        tColor = "text-white";
        break;

      case "pra-active":
        bgColor = "bg-[#4D6AFE]";
        tColor = "text-white";
        break;

      case "suspended":
        bgColor = "bg-[#F2D957]";
        tColor = "text-black";
        break;

      case "terminated":
        bgColor = "bg-[#00CFE8]";
        tColor = "text-white";
        break;

      case "early payoff":
        bgColor = "bg-[#0075BF]";
        tColor = "text-white";
        break;

      case "prospect":
        bgColor = "bg-[#8D91A0]";
        tColor = "text-white";
        break;

      case "partially paid":
        bgColor = "bg-[#C6D681]";
        tColor = "text-black";
        break;

      case "generating":
        bgColor = "bg-[#F57C00]";
        tColor = "text-white";
        break;

      // ===== E-FAKTUR TYPE STATUSES =====
      case "normal":
        bgColor = "bg-blue-100";
        tColor = "text-blue-800";
        break;

      case "replacement":
        bgColor = "bg-orange-100";
        tColor = "text-orange-800";
        break;

      case "cancellation":
      case "replaced":
        bgColor = "bg-red-100";
        tColor = "text-red-800";
        break;

      case "manual_upload":
      case "manual upload":
        bgColor = "bg-purple-100";
        tColor = "text-purple-800";
        break;

      case "latest":
        bgColor = "bg-green-100";
        tColor = "text-green-800";
        break;
    }

    return { bgcolor: bgColor, textColor: tColor };
  }, [colour]);

  // eslint-disable-next-line no-unused-vars
  const renderIconStatus = () => {
    if (!colour || typeof colour !== "string") return null;

    const lowerColour = colour.toLowerCase();

    switch (lowerColour) {
      // ===== SUCCESS ICONS =====
      case "completed":
      case "success":
      case "sent":
      case "approved":
      case "paid":
      case "complete":
      case "success_upload":
      case "latest":
      case "standard":
        return <CheckCircleFilled style={{ fontSize: "13px" }} />;

      // ===== PROCESSING ICONS =====
      case "generating":
      case "in progress":
      case "inprogress":
      case "processing":
      case "submitted":
      case "waiting approval":
      case "waiting_approval":
      case "awaiting_approval":
      case "awaiting approval":
      case "waiting_cancellation_approval":
      case "waiting cancellation approval":
      case "waiting_upload_approval":
      case "waiting upload approval":
        return <Loading3QuartersOutlined style={{ fontSize: "13px" }} />;

      // ===== FAILED ICONS =====
      case "failed":
      case "not paid":
      case "not_paid":
      case "rejected":
      case "cancelled":
        return <CloseCircleFilled style={{ fontSize: "13px" }} />;

      // ===== PENDING/SCHEDULED ICONS =====
      case "scheduled":
      case "not_generated":
      case "not generated":
        return <ClockCircleFilled style={{ fontSize: "13px" }} />;

      case "cancellation":
        return <StopOutlined style={{ fontSize: "13px" }} />;

      case "replaced":
        return <ExclamationCircleFilled style={{ fontSize: "13px" }} />;

      case "replacement":
        return <SyncOutlined style={{ fontSize: "13px" }} />;

      case "normal":
      case "manual_upload":
      case "manual upload":
        return <FileTextOutlined style={{ fontSize: "13px" }} />;

      default:
        return null;
    }
  };

  if (!children) return null;

  const sizeClasses =
    size === "small"
      ? `px-2 py-0 text-xs ${margin ? "my-0.5" : ""}`
      : `px-3 py-0 ${margin ? "my-1" : ""}`;

  return (
    <div
      className={
        type === "status"
          ? `flex gap-2 justify-center items-center ${bgcolor} ${textColor} ${sizeClasses} rounded-3xl text-center w-fit text-none`
          : `${textColor} font-semibold`
      }
    >
      {/* {renderIconStatus()} */}
      {children.replace(/_/g, " ")}
    </div>
  );
};

export default StatusComponent;
