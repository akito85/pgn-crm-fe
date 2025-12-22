/* eslint-disable default-case */
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  Loading3QuartersOutlined,
  ExclamationCircleFilled,
  MinusCircleFilled,
  SyncOutlined,
  FileTextOutlined,
  StopOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import React, { useMemo } from "react";

const StatusComponent = ({ children, colour, type = "status" }) => {
  const { bgcolor, textColor } = useMemo(() => {
    if (!colour || typeof colour !== "string") {
      return { bgcolor: "bg-slate-600", textColor: "text-white" };
    }

    const lowerColour = colour.toLowerCase();
    let bgColor = "bg-slate-600";
    let tColor = "text-white";

    console.log("status: ", colour);

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
      case "standard": // ✅ E-Faktur: Generated successfully
        bgColor = "status-active";
        tColor = "text-white";
        break;

      case "open":
        bgColor = "bg-gray-600";
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
      case "cancelled":
      case "CANCELLED":
        bgColor = "status-inactive";
        tColor = "text-white";
        break;

      // ===== WAITING/PENDING STATUSES =====
      case "partial payment":
      case "waiting to release":
      case "need review": // ✅ Billing status
        bgColor = "status-waiting";
        tColor = "text-yellow-700";
        break;

      // ===== PROCESSING STATUSES =====
      case "in progress":
      case "inprogress":
      case "awaiting_approval":
      case "awaiting approval":
      case "processing":
      case "submitted":
      case "waiting":
      case "waiting approval":
      case "waiting_approval":
      case "waiting_cancellation_approval":
      case "waiting cancellation approval":
      case "waiting_upload_approval":
      case "waiting upload approval":
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

      case "expire":
        bgColor = "status-expire";
        tColor = "text-red-700";
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
        bgColor = "bg-[#EEEEEE]";
        tColor = "text-[#000]";
        break;

      case "primary":
      case "refund":
      case "unapplied":
      case "hold":
      case "rating":
      case "standby":
        bgColor = "bg-blue-500";
        tColor = "text-white";
        break;

      case "applied":
        bgColor = "bg-[#ACC424]";
        tColor = "text-white";
        break;

      case "reverse":
        bgColor = "bg-[#910000]";
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
        bgColor = "bg-white";
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
        return <CheckCircleFilled style={{ fontSize: "15px" }} />;

      // ===== PROCESSING ICONS =====
      case "generating":
      case "in progress":
      case "inprogress":
      case "processing": // ✅ E-Faktur processing
      case "submitted": // ✅ E-Faktur submitted
      case "waiting approval":
      case "waiting_approval":
      case "waiting approval":
      case "awaiting_approval":
      case "awaiting approval":
      case "waiting_cancellation_approval": // ✅ E-Faktur
      case "waiting cancellation approval":
      case "waiting_upload_approval": // ✅ E-Faktur
      case "waiting upload approval":
        return <Loading3QuartersOutlined style={{ fontSize: "15px" }} />;

      // ===== FAILED ICONS =====
      case "failed":
      case "not paid":
      case "not_paid":
      case "rejected":
      case "cancelled":
        return <CloseCircleFilled style={{ fontSize: "15px" }} />;

      // ===== PENDING/SCHEDULED ICONS =====
      case "scheduled":
      case "not_generated":
      case "not generated":
        return <ClockCircleFilled style={{ fontSize: "15px" }} />;

      case "cancellation":
        return <StopOutlined style={{ fontSize: "15px" }} />;

      case "replaced":
        return <ExclamationCircleFilled style={{ fontSize: "15px" }} />;

      case "replacement":
        return <SyncOutlined style={{ fontSize: "15px" }} />;

      case "normal":
      case "manual_upload":
      case "manual upload":
        return <FileTextOutlined style={{ fontSize: "15px" }} />;

      default:
        return null;
    }
  };

  if (!children) return null;

  return (
    <div
      className={
        type === "status"
          ? `flex gap-2 justify-center items-center ${bgcolor} ${textColor} px-3 py-0 rounded-3xl text-center w-fit`
          : `${textColor} font-semibold`
      }
    >
      {renderIconStatus()}
      {children}
    </div>
  );
};

export default StatusComponent;