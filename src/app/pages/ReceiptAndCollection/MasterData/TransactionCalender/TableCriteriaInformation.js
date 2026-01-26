import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Input } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../utils";
import DynamicTableInlinePayment from "../../DynamicTableInlinePayment";

const TableCriteriaInformation = (props) => {
  const { tableData, onDataChange, type } = props;
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [rowCount, setRowCount] = useState(0);

  //SEARCH
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.date)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const columns = [
    {
      key: "no",
      title: "NO",
      dataIndex: "no",
      width: "5%",
      align: "center",
      render: (t, r, i) => i + 1,
    },
    {
      key: "bankAccount",
      title: "CUSTOMER SEGMENT",
      dataIndex: "bankAccount",
      align: "",
      sorter: true,
      ...getColumnSearchProps("bankAccount"),
    },
    {
      key: "glAccount",
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "glAccount",
      align: "",
      sorter: true,
      ...getColumnSearchProps("glAccount"),
    },
    {
      key: "startDate",
      title: "START DATE",
      dataIndex: "startDate",
      inputType: "date",
      align: "center",
      editable: true,
      ...getColumnSearchProps("startDate", "date"),
      sorter: (a, b) => a.startDate - b.startDate,
      render: (startDate) => moment(startDate).format("DD MMM YYYY"),
    },
    {
      key: "endDate",
      title: "END DATE",
      dataIndex: "endDate",
      inputType: "date",
      align: "center",
      editable: true,
      ...getColumnSearchProps("endDate", "date"),
      sorter: true,
      render: (endDate) => moment(endDate).format("DD MMM YYYY"),
    },
  ];
  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleDisableDate = (current) => {
    return moment() >= current;
  };
  return (
    <div className={"my-5"}>
      <DynamicTableInlinePayment
        header={"CRITERIA INFORMATION"}
        // tableData={""}
        // onDataChange={"setTableData"}
        // cols={columns}
        // row={rowCount}
        // mode={"update"}
        // // disableDate={handleDisableDate}
        scrollTable={{ x: 2000, y: 500 }}
        // usePagination={true}
        // useSelect={true}
        // totalData={""}
        pageSize={pageSize}
        current={page}
        // onDetail={handleDetailInline}
        // onInactive={handleInactiveInline}
        onChangePage={handleChangePage}
        onSizeChanger={handleChangePage}
        tableData={tableData}
        onDataChange={onDataChange}
        cols={columns}
        mode={type}
        showCreateButton={true}
        onSort={onSort}
        actionButton={["update", "delete"]}
      />
    </div>
  );
};

export default TableCriteriaInformation;
