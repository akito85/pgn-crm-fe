import React from "react";
import { ModalConfirm } from "./ModalPopUp";
import { WarningOutlined } from "@ant-design/icons";

const ModalBack = ({
  isOpen = false,
  handleCancel = () => {},
  handleOk = () => {},
  width = 400,
}) => {
  return (
    <ModalConfirm
      isOpen={isOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
      width={width}
    >
      <div className="flex justify-center mt-5 gap-[20px]">
        <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
        <p className="text-[18px] font-bold">Are you sure you want to back?</p>
      </div>
    </ModalConfirm>
  );
};

export default ModalBack;
