/* eslint-disable default-case */
import {
  CheckCircleFilled,
  CloseCircleFilled,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import React, { useMemo } from "react";

const StatusComponent = ({ children, colour, type = "status" }) => {
  // ✅ Gunakan useMemo untuk menghitung styles
  const { bgcolor, color } = useMemo(() => {
    // Safety check
    if (!colour || typeof colour !== "string") {
      return { bgcolor: "bg-slate-600", color: "" };
    }

    const lowerColour = colour.toLowerCase();
    let bgColor = "bg-slate-600";
    let textColor = "";

    switch (lowerColour) {
      case "active":
      case "success":
      case "completed":
      case "complete":
      case "open":
      case "full payment":
      case "true":
      case "paid":
      case "complete billing":
        bgColor = "status-active";
        textColor = "text-[#14a38b]";
        break;
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
        bgColor = "status-inactive";
        textColor = "text-[#be3036]";
        break;
      case "waiting":
      case "waiting approval":
      case "WAITING_APPROVAL":
      case "in progress":
      case "inprogress":
      case "partial payment":
      case "waiting to release":
        bgColor = "status-waiting";
        break;
      case "draft":
        bgColor = "status-draft";
        break;
      case "approved":
      case "main":
        bgColor = "status-approved";
        break;
      case "expire":
        bgColor = "status-expire";
        break;
      case "expire10":
      case "need review":
        bgColor = "status-expire10";
        break;
      case "expire30":
        bgColor = "status-expire30";
        break;
      case "pending":
      case "assigned":
        bgColor = "status-pending";
        break;
      case "primary":
      case "refund":
      case "unapplied":
      case "hold":
      case "rating":
      case "standby":
        bgColor = "bg-blue-500";
        break;
      case "applied":
        bgColor = "bg-[#ACC424]";
        break;
      case "reverse":
        bgColor = "bg-[#910000]";
        break;
      case "non-primary":
        bgColor = "bg-gray-500";
        break;
      case "rating and billing":
        bgColor = "rating-billing-pils";
        break;
      case "billing":
        bgColor = "billing-pils";
        break;
      case "pre paid":
        bgColor = "bg-lime-600";
        break;
      case "registered":
        bgColor = "bg-[#0075BF]";
        break;
      case "pra-active":
        bgColor = "bg-[#4D6AFE]";
        break;
      case "suspended":
        bgColor = "bg-[#F2D957]";
        break;
      case "terminated":
        bgColor = "bg-[#BE3036]";
        break;
      case "prospect":
        bgColor = "bg-[#8D91A0]";
        break;
      case "partially paid":
        bgColor = "bg-[#C6D681]";
        break;
      case "generating":
        bgColor = "bg-[#F57C00]";
        break;
    }

    return { bgcolor: bgColor, color: textColor };
  }, [colour]);

  // ✅ Render icon dengan safety check
  const renderIconStatus = () => {
    if (!colour || typeof colour !== "string") return null;

    const lowerColour = colour.toLowerCase();

    switch (lowerColour) {
      case "completed":
        return <CheckCircleFilled style={{ fontSize: "20px" }} />;
      case "generating":
        return <Loading3QuartersOutlined style={{ fontSize: "20px" }} />;
      case "failed":
        return <CloseCircleFilled style={{ fontSize: "20px" }} />;
      default:
        return null;
    }
  };

  if (!children) return null;

  return (
    <p
      className={
        type === "status"
          ? `flex gap-2 items-center text-white ${bgcolor} px-4 py-1 mt-3 rounded-3xl text-center w-fit`
          : `${color} font-semibold`
      }
    >
      {renderIconStatus()}
      {children}
    </p>
  );
};

export default StatusComponent;
