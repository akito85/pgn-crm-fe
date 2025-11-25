/* eslint-disable default-case */
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  Loading3QuartersOutlined,
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

    switch (lowerColour) {
      case "active":
      case "success":
      case "completed":
      case "complete":
      case "full payment":
      case "true":
      case "paid":
      case "complete billing":
      case "sent":
        bgColor = "status-active";
        tColor = "text-white";
        break;

      case "open":
        bgColor = "bg-gray-600";
        tColor = "text-white";
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
      case "not_paid":
        bgColor = "status-inactive";
        tColor = "text-white";
        break;

      case "waiting":
      case "waiting approval":
      case "waiting_approval":
      case "partial payment":
      case "waiting to release":
        bgColor = "status-waiting";
        tColor = "text-yellow-700";
        break;

      case "in progress":
      case "INPROGRESS":
        bgColor = "bg-yellow-500";
        tColor = "text-white";
        break;

      case "draft":
        bgColor = "status-draft";
        tColor = "text-gray-700";
        break;

      case "approved":
      case "main":
        bgColor = "status-active";
        tColor = "text-white";
        break;

      case "expire":
        bgColor = "status-expire";
        tColor = "text-red-700";
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
    }

    return { bgcolor: bgColor, textColor: tColor };
  }, [colour]);

  const renderIconStatus = () => {
    if (!colour || typeof colour !== "string") return null;

    const lowerColour = colour.toLowerCase();

    switch (lowerColour) {
      case "completed":
      case "success":
      case "sent":
      case "approved":
      case "paid":
        return <CheckCircleFilled style={{ fontSize: "15px" }} />;
      case "generating":
      case "in progress":
      case "inprogress":
      case "INPROGRESS":
      case "waiting approval":
      case "waiting_approval":
        return <Loading3QuartersOutlined style={{ fontSize: "15px" }} />;
      case "failed":
      case "not paid":
      case "not_paid":
        return <CloseCircleFilled style={{ fontSize: "15px" }} />;
      case "scheduled":
        return <ClockCircleFilled style={{ fontSize: "15px" }} />;
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
