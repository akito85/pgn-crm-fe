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

const renderText = (text) => text || "-";

const renderStatus = (status) => {
  if (!status) return "-";
  const displayStatus = String(status).replace(/_/g, " ");

  return (
    <div className="flex justify-center">
      <StatusComponent colour={String(status).toLowerCase()}>
        {displayStatus}
      </StatusComponent>
    </div>
  );
};

const renderAmount = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return value;

  return `Rp${numericValue.toLocaleString("id-ID")}`;
};

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
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      width: 180,
      sorter: true,
      render: renderText,
    },
    {
      key: "customerNumber",
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 150,
      sorter: true,
      render: renderText,
    },
    {
      key: "customerName",
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 220,
      ellipsis: true,
      sorter: true,
      render: renderText,
    },
    {
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 150,
      sorter: true,
      render: renderText,
    },
    {
      key: "accountName",
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 200,
      ellipsis: true,
      sorter: true,
      render: renderText,
    },
    {
      key: "sor",
      title: "SOR",
      dataIndex: "sor",
      width: 180,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "costCenterName",
      title: "COST CENTER",
      dataIndex: "costCenterName",
      width: 160,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "accountSegment",
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      width: 160,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "accountGroupType",
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 170,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "meterReadingCode",
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      width: 170,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "accountType",
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      width: 150,
      render: renderText,
    },
    {
      key: "accountStatus",
      title: "ACCOUNT STATUS",
      dataIndex: "accountStatus",
      width: 150,
      render: renderText,
    },
    {
      key: "customerManagement",
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      width: 190,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "corporateCustomer",
      title: "CORPORATE CUSTOMER",
      dataIndex: "corporateCustomer",
      width: 180,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "billDate",
      title: "BILL DATE",
      dataIndex: "billDate",
      width: 120,
      isClassification: true,
      sorter: true,
      render: renderText,
    },
    {
      key: "totalAmountEqvIdr",
      title: "AMOUNT",
      dataIndex: "totalAmountEqvIdr",
      width: 150,
      align: "right",
      sorter: true,
      render: (value, record) => renderAmount(value ?? record?.amount),
    },
    {
      key: "npwp",
      title: "NPWP",
      dataIndex: "npwp",
      width: 160,
      render: renderText,
    },
    {
      key: "invoiceFileName",
      title: "INVOICE FILE NAME",
      dataIndex: "invoiceFileName",
      width: 260,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "invoiceDate",
      title: "INVOICE DATE",
      dataIndex: "invoiceDate",
      width: 130,
      isClassification: true,
      sorter: true,
      render: renderText,
    },
    {
      key: "taxAddress",
      title: "TAX ADDRESS",
      dataIndex: "taxAddress",
      width: 200,
      ellipsis: true,
      render: renderText,
    },
    {
      key: "nitku",
      title: "NITKU",
      dataIndex: "nitku",
      width: 140,
      render: renderText,
    },
    {
      key: "kopur",
      title: "KOPUR",
      dataIndex: "kopur",
      width: 120,
      render: renderText,
    },
    {
      key: "identificationType",
      title: "IDENTIFICATION TYPE",
      dataIndex: "identityType",
      width: 170,
      render: renderText,
    },
    {
      key: "identificationNumber",
      title: "IDENTIFICATION NUMBER",
      dataIndex: "identityNumber",
      width: 190,
      render: renderText,
    },
    {
      key: "stampStatus",
      title: "STAMPING STATUS",
      dataIndex: "stampStatus",
      width: 160,
      isClassification: true,
      sorter: true,
      render: renderStatus,
    },
    {
      key: "wpStatus",
      title: "WP STATUS",
      dataIndex: "wpStatus",
      width: 140,
      isClassification: true,
      render: renderStatus,
    },
    {
      key: "statusApproval",
      title: "APPROVAL STATUS",
      dataIndex: "statusApproval",
      width: 160,
      isClassification: true,
      sorter: true,
      render: (status, record) =>
        renderStatus(status ?? record?.approvalStatus),
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
