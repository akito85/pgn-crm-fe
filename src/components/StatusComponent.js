import React, { useState } from "react";
import { useEffect } from "react";

const StatusComponent = ({ children, colour, type = "status" }) => {
  const [bgcolor, setBgColor] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (colour) {
      switch (colour.toLowerCase()) {
        case "active":
        case "success":
        case "completed":
        case "complete":
        case "open":
        case "full payment":
        case "true":
        case "paid":
        case "complete billing":
          setBgColor("status-active");
          setColor("text-[#14a38b]");
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
          setBgColor("status-inactive");
          setColor("text-[#be3036]");
          break;
        case "waiting":
        case "waiting approval":
        case "WAITING_APPROVAL":
        case "in progress":
        case "inprogress":
        case "partial payment":
        case "waiting to release":
          setBgColor("status-waiting");
          break;
        case "draft":
          setBgColor("status-draft");
          break;
        case "approved":
        case "main":
          setBgColor("status-approved");
          break;
        case "expire":
          setBgColor("status-expire");
          break;
        case "expire10":
        case "need review":
          setBgColor("status-expire10");
          break;
        case "expire30":
          setBgColor("status-expire30");
          break;
        case "pending":
        case "assigned":
          setBgColor("status-pending");
          break;
        case "primary":
        case "Primary":
        case "refund":
        case "unapplied":
        case "hold":
        case "rating":
        case "standby":
          setBgColor("bg-blue-500");
          break;
        case "applied":
          setBgColor("bg-[#ACC424]");
          break;
        case "reverse":
          setBgColor("bg-[#910000]");
          break;
        case "non-primary":
        case "Non Primary":
          setBgColor("bg-gray-500");
          break;
        case "rating and billing":
          setBgColor("rating-billing-pils");
          break;
        case "billing":
          setBgColor("billing-pils");
          break;
        case "pre paid":
          setBgColor("bg-lime-600");
          break;
        case "registered":
          setBgColor("bg-[#0075BF]");
          break;
        case "pra-active":
          setBgColor("bg-[#4D6AFE]");
          break;
        case "suspended":
          setBgColor("bg-[#F2D957]");
          break;
        case "terminated":
          setBgColor("bg-[#BE3036]");
          break;
        case "prospect":
          setBgColor("bg-[#8D91A0]");
          break;
        case "partially paid":
          setBgColor("bg-[#C6D681]");
          break;
        default:
          setBgColor("bg-slate-600");
          break;
      }
    }
  }, [colour]);

  return (
    <p
      // className={`text-white ${bg} mx-8 my-0 p-1 rounded-2xl text-center w-40`}
      className={
        type === "status"
          ? `text-white ${bgcolor} my-0 py-1 px-2 rounded-2xl text-center w-auto`
          : `${color} font-semibold`
      }
    >
      {children}
    </p>
  );
};
export default StatusComponent;
