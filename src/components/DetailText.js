import moment from "moment";
import React from "react";
import { dateFormat } from "../utils";

const DetailText = ({ label, children, className, classTextAdditional }) => {
  return (
    <div className={className}>
      <label className="text-xs font-semibold">{label}</label>
      <p className={`text-xs ${classTextAdditional}`}>
        {children}
      </p>
    </div>
  );
};

export default DetailText;
