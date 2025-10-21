import React, { useMemo, useRef, useState } from "react";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const JobBatch = ({ data, page, pageSize, onChangePage, onSort }) => {
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({ ...prevState, [dataIndex]: selectedKeys[0] }));
  };

  const columns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "ID",
        dataIndex: "key",
        sorter: true,
        align: "center",
        width: 150,
        filteredValue: [search?.key] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "key",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "key",
            hasValue(search["key"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "BATCH TYPE",
        dataIndex: "batchType",
        sorter: true,
        align: "left",
        width: 150,
        filteredValue: [search?.batchType] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "batchType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "batchType",
            hasValue(search["batchType"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "BATCH NAME",
        dataIndex: "batchName",
        sorter: true,
        align: "left",
        filteredValue: [search?.batchName] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "batchName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "batchName",
            hasValue(search["batchName"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        align: "center",
        width: 150,
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          ),
      },
      {
        title: "CREATED DTM",
        dataIndex: "createdDtm",
        sorter: true,
        align: "center",
        width: 200,
        filteredValue: [search?.createdDtm] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDtm",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          renderDateColumn(
            "createdDtm",
            hasValue(search["createdDtm"]),
            searchText,
            text,
            "datetime",
            search
          ),
      },
      {
        title: "TRANSACTION CODE",
        dataIndex: "transactionCode",
        sorter: true,
        align: "left",
        filteredValue: [search?.transactionCode] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "transactionCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "transactionCode",
            hasValue(search["transactionCode"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  return (
    <div className="my-5">
      <TablePaginationNew
        columns={columns}
        dataSource={data.result || []}
        totalData={data?.page?.totalElements || 0}
        current={page}
        pageSize={pageSize}
        onChange={onChangePage}
        onSort={onSort}
        tableScrolled={{ x: 2000, y: 600 }}
      />
    </div>
  );
};

export default JobBatch;