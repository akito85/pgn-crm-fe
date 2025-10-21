import { WarningOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import React from "react";

const ActivationGlobalTypeValue = (props) => {
  const { selectedData } = props;
  console.log(selectedData);
  return (
    <div className="w-full flex flex-col mt-10 justify-end">
      <div className={"w-full flex flex-row items-center px-10"}>
        <WarningOutlined style={{ color: "red" }} className={"text-4xl"} />
        <span className={"text-lg text-black font-bold h-auto mx-auto"}>
          {`Are you sure want to ${
            selectedData?.status === "ACTIVE" ? "inactivate" : "activate"
          }?`}
        </span>
      </div>
    </div>
  );
};

export default ActivationGlobalTypeValue;
