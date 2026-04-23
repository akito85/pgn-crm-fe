import React, { useState, useRef } from "react";
import { Spin } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import TableRBI from "../../../../../components/TableRBI";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";

// ──────────────────────────────────────────────────────────────────────────────
// MutationDetailTable (level 3 — innermost)
// ──────────────────────────────────────────────────────────────────────────────
const MutationDetailTable = ({ details = [] }) => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const columns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "left",
      render: (_, __, i) => i + 1,
    },
    {
      title: "DOC NUMBER",
      dataIndex: "docNumber",
      key: "docNumber",
      width: 150,
      align: "center",
      sorter: (a, b) => (a.docNumber || "").localeCompare(b.docNumber || ""),
      ...getColumnSearchProps("docNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: "TRANSACTION DATE",
      dataIndex: "transactionDate",
      key: "transactionDate",
      width: 160,
      sorter: (a, b) =>
        moment(a.transactionDate).valueOf() - moment(b.transactionDate).valueOf(),
      render: (v) => (v ? moment(v).format(dateFormatting.dateCapital) : "-"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      width: 130,
      align: "center",
      sorter: (a, b) => (a.category || "").localeCompare(b.category || ""),
      ...getColumnSearchProps("category", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
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

// ──────────────────────────────────────────────────────────────────────────────
// SummaryWarrantyTable (level 1 + level 2 embedded)
// ──────────────────────────────────────────────────────────────────────────────
const SummaryWarrantyTable = ({ data = [], loading = false }) => {
  const [expandedMutations, setExpandedMutations] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── Level 2: Mutation Header search state ──────────────────────────────────
  const mutationSearchInput = useRef(null);
  const [mutationSearchText, setMutationSearchText] = useState("");
  const [mutationSearchedColumn, setMutationSearchedColumn] = useState("");

  const handleMutationSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setMutationSearchText(selectedKeys[0]);
    setMutationSearchedColumn(dataIndex);
  };

  // ── Level 1: Account search state ─────────────────────────────────────────
  const accountSearchInput = useRef(null);
  const [accountSearchText, setAccountSearchText] = useState("");
  const [accountSearchedColumn, setAccountSearchedColumn] = useState("");

  const handleAccountSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setAccountSearchText(selectedKeys[0]);
    setAccountSearchedColumn(dataIndex);
  };

  // ── Mutation Header columns (Level 2) ──────────────────────────────────────
  const mutationColumns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "left",
      render: (_, __, i) => i + 1,
    },
    {
      title: "DOC NUMBER",
      dataIndex: "docNumber",
      key: "docNumber",
      width: 150,
      align: "center",
      sorter: (a, b) => (a.docNumber || "").localeCompare(b.docNumber || ""),
      ...getColumnSearchProps("docNumber", mutationSearchInput, mutationSearchedColumn, mutationSearchText, handleMutationSearch),
    },
    {
      title: "DOC DATE",
      dataIndex: "docDate",
      key: "docDate",
      width: 130,
      sorter: (a, b) =>
        moment(a.docDate).valueOf() - moment(b.docDate).valueOf(),
      render: (v) => (v ? moment(v).format(dateFormatting.dateCapital) : "-"),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      width: 120,
      align: "center",
      sorter: (a, b) => (a.type || "").localeCompare(b.type || ""),
      ...getColumnSearchProps("type", mutationSearchInput, mutationSearchedColumn, mutationSearchText, handleMutationSearch),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      key: "currency",
      width: 100,
      sorter: (a, b) => (a.currency || "").localeCompare(b.currency || ""),
      ...getColumnSearchProps("currency", mutationSearchInput, mutationSearchedColumn, mutationSearchText, handleMutationSearch),
    },
    {
      title: "ACCOUNT GROUP DATE",
      dataIndex: "accountGroupDate",
      key: "accountGroupDate",
      width: 180,
      sorter: (a, b) =>
        (a.accountGroupDate || "").localeCompare(b.accountGroupDate || ""),
      ...getColumnSearchProps("accountGroupDate", mutationSearchInput, mutationSearchedColumn, mutationSearchText, handleMutationSearch),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      render: (v) => v?.toLocaleString() ?? "-",
    },
  ];

  // ── Account columns (Level 1) ──────────────────────────────────────────────
  const accountColumns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "left",
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 160,
      align: "center",
      sorter: (a, b) =>
        (a.accountNumber || "").localeCompare(b.accountNumber || ""),
      ...getColumnSearchProps("accountNumber", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountSearch),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      key: "accountName",
      width: 200,
      sorter: (a, b) =>
        (a.accountName || "").localeCompare(b.accountName || ""),
      ...getColumnSearchProps("accountName", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountSearch),
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      key: "accountSegment",
      width: 160,
      align: "center",
      sorter: (a, b) =>
        (a.accountSegment || "").localeCompare(b.accountSegment || ""),
      ...getColumnSearchProps("accountSegment", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountSearch),
    },
    {
      title: "ACCOUNT GROUP DATE",
      dataIndex: "accountGroupDate",
      key: "accountGroupDate",
      width: 180,
      sorter: (a, b) =>
        (a.accountGroupDate || "").localeCompare(b.accountGroupDate || ""),
      ...getColumnSearchProps("accountGroupDate", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountSearch),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      key: "currency",
      width: 100,
      sorter: (a, b) => (a.currency || "").localeCompare(b.currency || ""),
      ...getColumnSearchProps("currency", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountSearch),
    },
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
            <div style={{ paddingLeft: "3.5em" }}>
              <div className="bg-[#0075BF] text-white text-center px-3 text-xs py-1 mb-1 uppercase tracking-wider">
                Mutation Header
              </div>
              <TableRBI
                idTable={`mutation-header-table-${record.key}`}
                dataSource={(record.mutations || []).map((m, i) => ({
                  ...m,
                  key: i,
                }))}
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
                    <div style={{ paddingLeft: "3.5em" }}>
                      <MutationDetailTable
                        details={mutationRecord.details || []}
                      />
                    </div>
                  ),
                  rowExpandable: (mutationRecord) =>
                    mutationRecord.details &&
                    mutationRecord.details.length > 0,
                }}
              />
            </div>
          ),
          rowExpandable: (record) =>
            record.mutations && record.mutations.length > 0,
        }}
      />
    </Spin>
  );
};

export default SummaryWarrantyTable;
