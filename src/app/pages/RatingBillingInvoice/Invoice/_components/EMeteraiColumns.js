import React from "react";
import { Popover, Menu, Typography } from "antd";
import {
  EditOutlined,
  RedoOutlined,
  FileProtectOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import StatusComponent from "../../../../../components/StatusComponent";
import SVGIcon from "../../../../../assets/Icon/index";

export const getEMeteraiColumns = ({
  onDetails,
  onProcessStamping,
  onProcessSigning,
  onRetry,
  onApprovalHistory,
}) => {
  return [
    {
      key: "no",
      title: "NO",
      isClassification: true,
      width: 50,
      render: (text, object, index) => index + 1,
    },
    {
      key: "invoiceNumber",
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      width: 180,
      sorter: true,
      render: (text) => <span>{text}</span>,
    },
    {
      key: "npwp",
      title: "NPWP",
      dataIndex: "npwp",
      width: 180,
      render: (text) => text || "-",
    },
    {
      key: "invoiceFileName",
      title: "Invoice File Name",
      dataIndex: "invoiceFileName",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      key: "taxAddress",
      title: "Tax Address",
      dataIndex: "taxAddress",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      key: "nitku",
      title: "NITKU",
      dataIndex: "nitku",
      width: 140,
      render: (text) => text || "-",
    },
    {
      key: "wpStatus",
      title: "WP Status",
      dataIndex: "wpStatus",
      width: 140,
      isClassification: true,
      render: (status) => {
        if (!status) return "-";
        const displayStatus = status.replace(/_/g, " ");
        return (
          <div className="flex justify-center">
            <StatusComponent colour={status.toLowerCase()}>
              {displayStatus}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "customer",
      title: "Customer",
      dataIndex: "customerName",
      width: 220,
      ellipsis: true,
      sorter: true,
    },
    {
      key: "customerNumber",
      title: "Customer Number",
      dataIndex: "customerNumber",
      width: 150,
      sorter: true,
    },
    {
      key: "accountNumber",
      title: "Account Number",
      dataIndex: "accountNumber",
      width: 150,
      sorter: true,
    },
    {
      key: "accountName",
      title: "Account Name",
      dataIndex: "accountName",
      width: 200,
      ellipsis: true,
      sorter: true,
    },
    {
      key: "billPeriod",
      title: "Bill Period",
      dataIndex: "billPeriod",
      width: 120,
      isClassification: true,
      sorter: true,
      render: (text) => text || "-",
    },
    {
      key: "invoiceDate",
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      width: 120,
      isClassification: true,
      sorter: true,
      render: (text) => text || "-",
    },
    {
      key: "sor",
      title: "SOR",
      dataIndex: "sor",
      width: 250,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      key: "costCenterName",
      title: "Cost Center",
      dataIndex: "costCenterName",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      key: "stampStatus",
      title: "Stamp Status",
      dataIndex: "stampStatus",
      width: 160,
      isClassification: true,
      sorter: true,
      render: (status) => {
        if (!status) return "-";
        const displayStatus = status.replace(/_/g, " ");
        return (
          <div className="flex justify-center">
            <StatusComponent colour={status.toLowerCase()}>
              {displayStatus}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "stampType",
      title: "Stamp Type",
      dataIndex: "stampType",
      width: 140,
      isClassification: true,
      render: (type) => {
        if (!type) return "-";
        const displayType = type.replace(/_/g, " ");
        return displayType;
      },
    },
    {
      key: "stampRequestDate",
      title: "Stamp Request Date",
      dataIndex: "stampRequestDate",
      width: 170,
      isClassification: true,
      render: (text) => text || "-",
    },
    {
      key: "stampCompletionDate",
      title: "Stamp Completion Date",
      dataIndex: "stampCompletionDate",
      width: 180,
      isClassification: true,
      render: (text) => text || "-",
    },
    {
      key: "stampRemark",
      title: "Stamp Remark",
      dataIndex: "stampRemark",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      key: "signStatus",
      title: "Sign Status",
      dataIndex: "signStatus",
      width: 150,
      isClassification: true,
      sorter: true,
      render: (status) => {
        if (!status) return "-";
        const displayStatus = status.replace(/_/g, " ");
        return (
          <div className="flex justify-center">
            <StatusComponent colour={status.toLowerCase()}>
              {displayStatus}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "signType",
      title: "Sign Type",
      dataIndex: "signType",
      width: 120,
      isClassification: true,
      render: (type) => {
        if (!type || type === "NONE") return "-";
        const displayType = type.replace(/_/g, " ");
        return displayType;
      },
    },
    {
      key: "signRequestDate",
      title: "Sign Request Date",
      dataIndex: "signRequestDate",
      width: 170,
      isClassification: true,
      render: (text) => text || "-",
    },
    {
      key: "signCompletionDate",
      title: "Sign Completion Date",
      dataIndex: "signCompletionDate",
      width: 180,
      isClassification: true,
      render: (text) => text || "-",
    },
    {
      key: "signRemark",
      title: "Sign Remark",
      dataIndex: "signRemark",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      key: "statusApproval",
      title: "Approval Status",
      dataIndex: "statusApproval",
      width: 160,
      isClassification: true,
      sorter: true,
      render: (status) => {
        if (!status) return "-";
        const displayStatus = status.replace(/_/g, " ");
        return (
          <div className="flex justify-center">
            <StatusComponent colour={status.toLowerCase()}>
              {displayStatus}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "createdBy",
      title: "Created By",
      dataIndex: "createdBy",
      width: 140,
      isClassification: true,
      sorter: true,
      render: (text) => text || "-",
    },
    {
      key: "createdDate",
      title: "Created Date",
      dataIndex: "createdDate",
      width: 170,
      isClassification: true,
      sorter: true,
      render: (text) => text || "-",
    },
    {
      key: "actions",
      title: "Actions",
      width: 100,
      isClassification: true,
      render: (_, record) => {
        const menuItems = [
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
          {
            key: "approval-history",
            label: "Approval History",
            icon: <HistoryOutlined />,
            onClick: () => onApprovalHistory(record),
          },
        ];

        const popoverContent = (
          <Menu
            items={menuItems}
            style={{ border: "none", boxShadow: "none", minWidth: 180 }}
          />
        );

        return (
          <div className="flex items-center gap-2 justify-center">
            <Popover
              content={popoverContent}
              trigger="click"
              placement="bottomRight"
            >
              <div className="cursor-pointer pt-1">
                <SVGIcon name="IconTripleDot" width={20} />
              </div>
            </Popover>
            <Typography.Link onClick={() => onDetails(record)} className="pt-1">
              <SVGIcon name="IconDetail" width={20} />
            </Typography.Link>
          </div>
        );
      },
    },
  ];
};
