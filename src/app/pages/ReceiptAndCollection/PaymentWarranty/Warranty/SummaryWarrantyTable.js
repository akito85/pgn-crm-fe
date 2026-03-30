import React, { useState } from "react";
import { Table, Spin } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";

const MutationDetailTable = ({ details = [] }) => {
  const columns = [
    { title: "NO", key: "no", width: 60, render: (_, __, i) => i + 1 },
    { title: "DOC NUMBER", dataIndex: "docNumber", key: "docNumber", width: 150 },
    {
      title: "TRANSACTION DATE",
      dataIndex: "transactionDate",
      key: "transactionDate",
      width: 150,
      render: (v) => (v ? moment(v).format(dateFormatting.dateCapital) : "-"),
    },
    { title: "CATEGORY", dataIndex: "category", key: "category", width: 120 },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (v) => v?.toLocaleString() ?? "-",
    },
  ];

  return (
    <div>
      <div className="bg-[#0075BF] text-white text-center text-xs font-bold py-1 mb-1 uppercase tracking-wider">
        Mutation Detail
      </div>
      <Table
        size="small"
        bordered
        rowKey={(r, i) => `detail-${r.id ?? i}`}
        columns={columns}
        dataSource={details.map((d, i) => ({ ...d, key: i }))}
        pagination={false}
        tableLayout="fixed"
      />
    </div>
  );
};

const SummaryWarrantyTable = ({ data = [], loading = false }) => {
  const [expandedMutations, setExpandedMutations] = useState([]);

  const mutationColumns = [
    { title: "NO", key: "no", width: 60, render: (_, __, i) => i + 1 },
    { title: "DOC NUMBER", dataIndex: "docNumber", key: "docNumber", width: 150 },
    {
      title: "DOC DATE",
      dataIndex: "docDate",
      key: "docDate",
      width: 130,
      render: (v) => (v ? moment(v).format(dateFormatting.dateCapital) : "-"),
    },
    { title: "TYPE", dataIndex: "type", key: "type", width: 120 },
    { title: "CURRENCY", dataIndex: "currency", key: "currency", width: 100 },
    { title: "ACCOUNT GROUP DATE", dataIndex: "accountGroupDate", key: "accountGroupDate", width: 160 },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (v) => v?.toLocaleString() ?? "-",
    },
  ];

  const accountColumns = [
    { title: "NO", key: "no", width: 60, render: (_, __, i) => i + 1 },
    { title: "ACCOUNT NUMBER", dataIndex: "accountNumber", key: "accountNumber", width: 160 },
    { title: "ACCOUNT NAME", dataIndex: "accountName", key: "accountName", width: 200 },
    { title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", key: "accountSegment", width: 160 },
    { title: "ACCOUNT GROUP DATE", dataIndex: "accountGroupDate", key: "accountGroupDate", width: 180 },
    { title: "CURRENCY", dataIndex: "currency", key: "currency", width: 100 },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        size="small"
        bordered
        rowKey={(r, i) => `account-${r.id ?? i}`}
        columns={accountColumns}
        dataSource={data.map((d, i) => ({ ...d, key: i }))}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-2 bg-gray-50">
              <div className="bg-[#0075BF] text-white text-center text-xs font-bold py-1 mb-2 uppercase tracking-wider">
                Mutation Header
              </div>
              <Table
                size="small"
                bordered
                rowKey={(r, i) => `mutation-${r.id ?? i}`}
                columns={mutationColumns}
                dataSource={(record.mutations || []).map((m, i) => ({ ...m, key: i }))}
                pagination={false}
                scroll={{ x: "max-content" }}
                expandedRowKeys={expandedMutations}
                onExpandedRowsChange={setExpandedMutations}
                expandable={{
                  expandedRowRender: (mutationRecord) => (
                    <MutationDetailTable details={mutationRecord.details || []} />
                  ),
                  rowExpandable: (mutationRecord) =>
                    mutationRecord.details && mutationRecord.details.length > 0,
                }}
              />
            </div>
          ),
          rowExpandable: (record) => record.mutations && record.mutations.length > 0,
        }}
      />
    </Spin>
  );
};

export default SummaryWarrantyTable;
