import React from "react";

const CalculationItemInfo = ({ calculationCode, ratingCode, accountNumber }) => {
  return (
    <div className="pt-4">
      <div className="flex flex-row gap-8 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-normal text-gray-600">
            Calculation Code
          </p>
          <p className="text-[15px] font-semibold text-gray-900">
            {calculationCode || "-"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-normal text-gray-600">
            Rating Code
          </p>
          <p className="text-[15px] font-semibold text-gray-900">
            {ratingCode || "-"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-normal text-gray-600">
            Account Number
          </p>
          <p className="text-[15px] font-semibold text-gray-900">
            {accountNumber || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculationItemInfo;