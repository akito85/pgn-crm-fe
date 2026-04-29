import React from "react";
import { Table } from "antd";

const InstallmentApprovalTable = ({ data = [], rowSelection, type = false }) => {
  const columns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "INSTALLMENT NUMBER",
      dataIndex: "installmentNumber",
      key: "installmentNumber",
      width: 180,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 180,
    },
    {
      title: "TENOR",
      dataIndex: "tenor",
      key: "tenor",
      width: 80,
      align: "center",
      render: (tenor) => `${tenor} Bulan`,
    },
    {
      title: "START PERIOD",
      dataIndex: "startPeriod",
      key: "startPeriod",
      width: 120,
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      align: "right",
      render: (amount, record) => {
        const formatted = new Intl.NumberFormat("id-ID").format(amount || 0);
        return `${record.currency || ""} ${formatted}`;
      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      width: 140,
      render: (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === "waiting_approval") {
          return <span style={{ color: "#faad14", fontWeight: 500 }}>{status}</span>;
        }
        return <span>{status}</span>;
      },
    },
    {
      title: "REQUEST DATE",
      dataIndex: "requestDate",
      key: "requestDate",
      width: 150,
      render: (date) => (date ? new Date(date).toLocaleString("id-ID") : "-"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      rowSelection={type ? undefined : rowSelection}
      pagination={false}
      size="small"
      scroll={{ y: 300 }}
    />
  );
};

export default InstallmentApprovalTable;
