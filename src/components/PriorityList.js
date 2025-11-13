import React from "react";
import { Table, Tabs, Empty, Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const PriorityList = ({ data, onItemClick }) => {
  const getColumns = (color, type) => [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      align: "center",
      render: (rank) => (
        <Tag color={rank === 1 ? "gold" : rank === 2 ? "silver" : "default"}>
          #{rank}
        </Tag>
      ),
    },
    {
      title: "Account Number",
      dataIndex: "accountNum",
      key: "accountNum",
      width: 200,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      width: 100,
      align: "right",
      render: (count) => (
        <span style={{ fontWeight: 600, color: color }}>
          {count ? count.toLocaleString("id-ID") : 0}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      align: "center",
      render: () => (
        <a
          onClick={() => onItemClick(type)}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          View Details →
        </a>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Pending Transactions ({data?.priorPendingTransactions?.length || 0})
        </span>
      ),
      children: (
        <Table
          dataSource={data.priorPendingTransactions}
          columns={getColumns("#faad14", "pendingTransactions")}
          rowKey={(record, index) =>
            `pending-trans-${record.accountNum}-${index}`
          }
          pagination={false}
          size="small"
          scroll={{ x: 600 }}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          Pending Approvals ({data?.priorApprovalBatches?.length || 0})
        </span>
      ),
      children:
        data?.priorApprovalBatches && data.priorApprovalBatches.length > 0 ? (
          <Table
            dataSource={data.priorApprovalBatches}
            columns={getColumns("#1890ff", "pendingApprovals")}
            rowKey={(record, index) =>
              `approval-batch-${record.accountNum}-${index}`
            }
            pagination={false}
            size="small"
            scroll={{ x: 600 }}
          />
        ) : (
          <Empty
            description="No pending approvals anomalies"
            style={{ padding: "40px 0" }}
          />
        ),
    },
    {
      key: "3",
      label: (
        <span>
          <WarningOutlined style={{ marginRight: 8 }} />
          Gap Rating vs Billing ({data?.priorGapRatingBilling?.length || 0})
        </span>
      ),
      children:
        data?.priorGapRatingBilling && data.priorGapRatingBilling.length > 0 ? (
          <Table
            dataSource={data.priorGapRatingBilling}
            columns={getColumns("#f5222d", "gapRatingBilling")}
            rowKey={(record, index) =>
              `gap-rating-${record.accountNum}-${index}`
            }
            pagination={false}
            size="small"
            scroll={{ x: 600 }}
          />
        ) : (
          <Empty
            description="No gap rating billing anomalies"
            style={{ padding: "40px 0" }}
          />
        ),
    },
    {
      key: "4",
      label: (
        <span>
          <SyncOutlined style={{ marginRight: 8 }} />
          Gap Pra-Billing vs Master (
          {data?.priorGapPrabillingMaster?.length || 0})
        </span>
      ),
      children:
        data?.priorGapPrabillingMaster &&
        data.priorGapPrabillingMaster.length > 0 ? (
          <Table
            dataSource={data.priorGapPrabillingMaster}
            columns={getColumns("#722ed1", "gapPraBillingMaster")}
            rowKey={(record, index) =>
              `gap-prabil-${record.accountNum}-${index}`
            }
            pagination={false}
            size="small"
            scroll={{ x: 600 }}
          />
        ) : (
          <Empty
            description="No gap pra-billing master anomalies"
            style={{ padding: "40px 0" }}
          />
        ),
    },
  ];

  return <Tabs defaultActiveKey="1" type="card" items={items} />;
};

export default PriorityList;
