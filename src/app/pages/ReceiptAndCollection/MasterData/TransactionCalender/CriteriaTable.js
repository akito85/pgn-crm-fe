import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Input } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import BaseContainer from "../../../../../components/BaseContainer";
import StatusComponent from "../../../../../components/StatusComponent";
import TablePagination from "../../../../../components/TablePagination";
import { dateFormatting } from "../../../../../utils";

const CriteriaTable = (props) => {
  const { data_detail, id } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const searchInput = useRef(null);

  //search
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
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
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
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "CUSTOMER SEGMENT",
      dataIndex: "customerSegment",
      sorter: true,
      ...getColumnSearchProps("beginCycle"),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "customerSegment",
      sorter: true,
      ...getColumnSearchProps("beginCycle"),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
      width: 200,
      ...getColumnSearchProps("startDate", "date"),
      render: (v) => (v ? moment(v).format(dateFormatting.date) : "-"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      sorter: true,
      align: "center",
      width: 200,
      ...getColumnSearchProps("endDate", "date"),
      render: (v) => (v ? moment(v).format(dateFormatting.date) : "-"),
    },
  ];

  return (
    <BaseContainer header={"CRITERIA INFORMATION"}>
      <TablePagination
        dataSource={data_detail?.criterias}
        columns={columns}
        pageSize={pageSize}
        current={page}
        onChange={handleChange}
        onSizeChanger={handleChange}
        //   totalData={data?.page?.totalElements}
        onSort={onSort}
        tableScrolled={{
          x: 1500,
          y: 525,
        }}
      />
    </BaseContainer>
  );
};

export default CriteriaTable;
