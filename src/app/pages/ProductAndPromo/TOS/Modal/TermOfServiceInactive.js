import React from "react";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import { Alert } from "antd";
import { WarningOutlined } from "@ant-design/icons";

const TermOfServiceInactive = ({
  isOpen,
  handleCancel = () => {},
  handleOk = () => {},
  loading = false,
}) => {
  return (
    <ModalConfirm
      isOpen={isOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
      width={500}
      useOk={true}
      loading={loading}
    >
      <div className="flex justify-center gap-[20px] mt-6">
        <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
        <p className={"text-[18px] font-bold"}>
          {`Are you sure want to inactivate ?`}
        </p>
      </div>
      <Alert
        message="Warning! if you inactivate this data, it can’t be use."
        type={"error"}
      />
    </ModalConfirm>
  );
};

export default TermOfServiceInactive;
