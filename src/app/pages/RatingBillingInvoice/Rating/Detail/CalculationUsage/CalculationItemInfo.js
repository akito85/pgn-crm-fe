import React from "react";

const CalculationItemInfo = ({ calculationCode, ratingCodeId }) => {
  return (
    <div className="pt-4">
      <div className="flex flex-row gap-8">
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
            {ratingCodeId || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculationItemInfo;