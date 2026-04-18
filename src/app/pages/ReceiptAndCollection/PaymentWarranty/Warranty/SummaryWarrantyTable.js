import React, { useState } from "react";
import { Spin } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import TableRBI from "../../../../../components/TableRBI";

const MutationDetailTable = ({ details = [] }) => {
  const columns = [
    { title: "NO", key: "no", width: 60, align: "left", render: (_, __, i) => i + 1 },
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
      <div className="bg-[#0075BF] text-white text-center px-3 text-xs py-1 mb-1 uppercase tracking-wider">
        Mutation Detail
      </div>
      <TableRBI
        idTable="mutation-detail-table"
        dataSource={details.map((d, i) => ({ ...d, key: i }))}
        columns={columns}
        useSelect={false}
        usePagination={false}
        showSearchBar={false}
        showAdvanceSearch={false}
        tableScrolled={{ x: "max-content" }}
      />
    </div>
  );
};

const SummaryWarrantyTable = ({ data = [], loading = false }) => {
  const [expandedMutations, setExpandedMutations] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const mutationColumns = [
    { title: "NO", key: "no", width: 60, align: "left", render: (_, __, i) => i + 1 },
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
    { title: "NO", key: "no", width: 60, align: "left", render: (_, __, i) => (page - 1) * pageSize + i + 1 },
    { title: "ACCOUNT NUMBER", dataIndex: "accountNumber", key: "accountNumber", width: 160 },
    { title: "ACCOUNT NAME", dataIndex: "accountName", key: "accountName", width: 200 },
    { title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", key: "accountSegment", width: 160 },
    { title: "ACCOUNT GROUP DATE", dataIndex: "accountGroupDate", key: "accountGroupDate", width: 180 },
    { title: "CURRENCY", dataIndex: "currency", key: "currency", width: 100 },
  ];

  return (
    <Spin spinning={loading}>
      <TableRBI
        idTable="summary-warranty-account-table"
        dataSource={data.map((d, i) => ({ ...d, key: i }))}
        columns={accountColumns}
        current={page}
        pageSize={pageSize}
        totalData={data.length}
        onChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
        onSizeChanger={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
        tableScrolled={{ x: "max-content" }}
        useSelect={false}
        showSearchBar={false}
        showAdvanceSearch={false}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ marginLeft: 75, backgroundColor: "red" }}>
              <div className="bg-[#0075BF] text-white text-center px-3 text-xs py-1 mb-1 uppercase tracking-wider">
                Mutation Header
              </div>
              <TableRBI
                idTable={`mutation-header-table-${record.key}`}
                dataSource={(record.mutations || []).map((m, i) => ({ ...m, key: i }))}
                columns={mutationColumns}
                useSelect={false}
                usePagination={false}
                showSearchBar={false}
                showAdvanceSearch={false}
                tableScrolled={{ x: "max-content" }}
                expandedRowKeys={expandedMutations}
                onExpandedRowsChange={setExpandedMutations}
                expandable={{
                  expandedRowRender: (mutationRecord) => (
                    <div style={{ marginLeft: 75, backgroundColor: "#000000" }}>
                      <MutationDetailTable details={mutationRecord.details || []} />
                    </div>
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
