import React, { useState, useRef, useEffect } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import TablePagination from "../../../../../components/TablePagination";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { getAttachmentListDetailPricingRule } from "../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { bytesConverter } from "../../../../../utils/bytesConverter";

const Attachment = ({ id }) => {
  // Selector
  const { data_attachment, loading } = useSelector(
    (state) => state.pricingRule
  );

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const dataSource = data_attachment?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(
      getAttachmentListDetailPricingRule({ id, page, pageSize, sort, search })
    );
  }, [id, page, pageSize, sort, search]);

  // Search Column Table
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Column
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      sorter: true,
      width: 240,
      title: "CATEGORY",
      dataIndex: "category",
      align: "left",
      ...getColumnSearchProps("category"),
    },
    {
      sorter: true,
      width: 240,
      title: "FILENAME",
      dataIndex: "fileName",
      align: "left",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("fileName"),
      render: (filename) => (
        <Tooltip placement="topLeft" title={filename}>
          {filename}
        </Tooltip>
      ),
    },
    {
      sorter: true,
      width: 240,
      title: "UPLOAD BY",
      dataIndex: "createdBy",
      align: "center",
      ...getColumnSearchProps("createdBy"),
    },
    {
      sorter: true,
      width: 240,
      title: "UPLOAD DATE",
      dataIndex: "createdDate",
      align: "center",
      ...getColumnSearchProps("createdDate"),
      render: (createdDate) => moment(createdDate).format("DD MMM YYYY"),
    },
    {
      sorter: true,
      width: 240,
      title: "FILE SIZE",
      dataIndex: "fileSize",
      align: "center",
      ...getColumnSearchProps("fileSize"),
      render: (fileSize) => bytesConverter(fileSize),
    },
  ];

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

  return (
    <BaseContainer header={"attachment information"}>
      <div className="w-full">
        <TablePagination
          dataSource={dataSource}
          columns={columns}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          totalData={dataSource?.page?.totalElements}
          onSort={onSort}
          tableScrolled={{
            x: 1500,
            y: 300,
          }}
        />
      </div>
    </BaseContainer>
  );
};

export default Attachment;
