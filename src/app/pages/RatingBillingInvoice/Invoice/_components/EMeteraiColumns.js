import React from "react";
import { Button, Dropdown, Menu } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  RedoOutlined,
  EyeOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import StatusComponent from "../../../../../components/StatusComponent";

export const getEMeteraiColumns = ({
  onDetails,
  onProcessStamping,
  onProcessSigning,
  onRetry,
}) => {
  return [
    {
      key: "invoiceNumber",
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      width: 180,
      render: (text) => <span style={{ fontWeight: "600" }}>{text}</span>,
    },
    {
      key: "customer",
      title: "Customer",
      dataIndex: "customer",
      width: 220,
      ellipsis: true,
    },
    {
      key: "customerNumber",
      title: "Customer Number",
      dataIndex: "customerNumber",
      width: 150,
    },
    {
      key: "accountNumber",
      title: "Account Number",
      dataIndex: "accountNumber",
      width: 150,
    },
    {
      key: "accountName",
      title: "Account Name",
      dataIndex: "accountName",
      width: 200,
      ellipsis: true,
    },
    {
      key: "issueDate",
      title: "Issue Date",
      dataIndex: "issueDate",
      width: 120,
      align: "center",
    },
    {
      key: "amount",
      title: "Amount (IDR)",
      dataIndex: "amount",
      width: 150,
      align: "right",
      render: (amount) => (
        <span style={{ fontWeight: "600", color: "#1890ff" }}>
          {new Intl.NumberFormat("id-ID").format(amount)}
        </span>
      ),
    },
    {
      key: "stampingStatus",
      title: "Stamping Status",
      dataIndex: "stampingStatus",
      width: 160,
      align: "center",
      render: (status) => {
        const text = status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : status;
        return text ? (
          <div className="flex justify-center">
            <StatusComponent colour={status}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      key: "stampType",
      title: "Stamp Type",
      dataIndex: "stampType",
      width: 120,
      align: "center",
    },
    {
      key: "stampRequestDate",
      title: "Stamp Request Date",
      dataIndex: "stampRequestDate",
      width: 150,
      align: "center",
    },
    {
      key: "stampCompletionDate",
      title: "Stamp Completion Date",
      dataIndex: "stampCompletionDate",
      width: 170,
      align: "center",
    },
    {
      key: "signingStatus",
      title: "Signing Status",
      dataIndex: "signingStatus",
      width: 150,
      align: "center",
      render: (status) => {
        const text = status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : status;
        return text ? (
          <div className="flex justify-center">
            <StatusComponent colour={status}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      key: "signType",
      title: "Sign Type",
      dataIndex: "signType",
      width: 120,
      align: "center",
    },
    {
      key: "signRequestDate",
      title: "Sign Request Date",
      dataIndex: "signRequestDate",
      width: 150,
      align: "center",
    },
    {
      key: "signCompletionDate",
      title: "Sign Completion Date",
      dataIndex: "signCompletionDate",
      width: 170,
      align: "center",
    },
    {
      key: "actions",
      title: "Actions",
      width: 80,
      align: "center",
      render: (_, record) => {
        const menuItems = [
          {
            key: "details",
            label: "Details",
            icon: <EyeOutlined />,
            onClick: () => onDetails(record),
          },
          {
            key: "process-stamping",
            label: "Process Stamping",
            icon: <FileProtectOutlined />,
            disabled: record.stampStatus === "SUCCESS",
            onClick: () => onProcessStamping(record),
          },
          {
            key: "process-signing",
            label: "Process Signing",
            icon: <EditOutlined />,
            disabled:
              record.stampStatus === null ||
              record.stampStatus === "FAILED" ||
              record.signStatus === "SUCCESS",
            onClick: () => onProcessSigning(record),
          },
          {
            key: "retry",
            label: "Retry",
            icon: <RedoOutlined />,
            disabled: record.stampingStatus !== "Failed",
            onClick: () => onRetry(record),
          },
        ];

        const menu = <Menu items={menuItems} />;

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              icon={<EllipsisOutlined style={{ fontSize: "18px" }} />}
            />
          </Dropdown>
        );
      },
    },
  ];
};
