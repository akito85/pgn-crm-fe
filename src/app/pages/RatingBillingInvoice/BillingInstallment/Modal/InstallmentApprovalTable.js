import React, { useMemo, useRef, useState } from "react";
import { Table } from "antd";
import StatusComponent from "../../../../../components/StatusComponent";
import {
  hasValue,
  renderColumn,
} from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

const InstallmentApprovalTable = ({ data = [], rowSelection, type = false }) => {
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters?.();
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: "",
    }));
    setSearchText("");
    setSearchedColumn("");
  };

  const columns = useMemo(() => [
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "installmentNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        [],
        handleReset,
      ),
      onFilter: (value, record) =>
        String(record.installmentNumber || "")
          .toLowerCase()
          .includes(String(value || "").toLowerCase()),
      render: (text) =>
        renderColumn(
          "installmentNumber",
          hasValue(search["installmentNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        [],
        handleReset,
      ),
      onFilter: (value, record) =>
        String(record.accountNumber || "")
          .toLowerCase()
          .includes(String(value || "").toLowerCase()),
      render: (text) =>
        renderColumn(
          "accountNumber",
          hasValue(search["accountNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 180,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        [],
        handleReset,
      ),
      onFilter: (value, record) =>
        String(record.customerName || "")
          .toLowerCase()
          .includes(String(value || "").toLowerCase()),
      render: (text) =>
        renderColumn(
          "customerName",
          hasValue(search["customerName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        [],
        handleReset,
      ),
      onFilter: (value, record) =>
        String(record.startPeriod || "")
          .toLowerCase()
          .includes(String(value || "").toLowerCase()),
      render: (text) =>
        renderColumn(
          "startPeriod",
          hasValue(search["startPeriod"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
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
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "status",
        [],
        handleReset,
      ),
      onFilter: (value, record) =>
        String(record.statusApproval || "")
          .toLowerCase()
          .includes(String(value || "").toLowerCase()),
      render: (status) =>
        status ? (
          <div className="flex justify-center whitespace-nowrap">
            <StatusComponent colour={status} size="small">
              {status}
            </StatusComponent>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "REQUEST DATE",
      dataIndex: "requestDate",
      key: "requestDate",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "requestDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        [],
        handleReset,
      ),
      onFilter: (value, record) =>
        String(record.requestDate || "")
          .toLowerCase()
          .includes(String(value || "").toLowerCase()),
      render: (date) =>
        renderColumn(
          "requestDate",
          hasValue(search["requestDate"]),
          searchText,
          date ? new Date(date).toLocaleString("id-ID") : "-",
          false,
          "input",
          search,
        ),
    },
  ], [search, searchText, searchedColumn]);

  return (
    <Table
      className="nx-table"
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
