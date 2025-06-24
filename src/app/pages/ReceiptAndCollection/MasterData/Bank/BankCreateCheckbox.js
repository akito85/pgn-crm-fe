import { Checkbox } from "antd";
import React from "react";

const BankCreateCheckbox = ({ handlePage, isPage, disbled }) => {
  return (
    <div className="flex flex-col pt-[12px]">
      <Checkbox
        onChange={handlePage}
        checked={isPage}
        // disabled={disabledDraf}
      >
        Is Branch
      </Checkbox>
      <span className="text-[10px]">
        Click or tap this checkbox if data is branch.
      </span>
    </div>
  );
};

export default BankCreateCheckbox;
