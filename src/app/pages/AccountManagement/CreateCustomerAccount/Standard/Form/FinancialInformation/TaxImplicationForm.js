import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Spin, DatePicker, Input, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../../utils";
import TablePagination from "../../../../../../../components/TablePagination";

const TaxImplicationForm = ({ dataFinancialInfo = [], type }) => {
  // Selector
  const { loading } = useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const dataTable = dataFinancialInfo?.taxImpli || [];

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [totalElements, setTotalElement] = useState(0);

  // Use Effect
  useEffect(() => {
    setTotalElement(dataTable?.length);
  }, [dataTable]);

  // Search Column Table
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
    onFilter: (value, record) => {
      let result =
        type === "date"
          ? moment(record[dataIndex])
              .format(dateFormatting.dateFormal)
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : record[dataIndex]
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase());
      return result;
    },
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
              ? moment([searchText]).format(dateFormatting.dateFormal)
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
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSortDetail = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TAX IMPLICATION NAME",
      dataIndex: "name",
      sorter: true,
      align: "left",
      ...getColumnSearchProps("name"),
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("serviceType"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("category"),
    },
    {
      title: "IMPLICATION TYPE",
      dataIndex: "type",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("type"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("description"),
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
  ];

  const filterDataByPage = () => {
    let result = [...dataTable];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format(dateFormatting.date)
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };
  return (
    <div>
      {type === "confirmation" ? (
        <>
          <span className="text-primary uppercase font-bold">
            TAX IMPLICATION INFORMATION
          </span>
          <div className="w-full pt-[15px]">
            <TablePagination
              dataSource={filterDataByPage()}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              onSort={onSortDetail}
              totalData={totalElements}
              tableScrolled={{
                x: 1500,
                y: 300,
              }}
            />
          </div>
        </>
      ) : (
        <>
          <span className="text-primary uppercase font-bold">
            TAX IMPLICATION INFORMATION
          </span>
          <div className="w-full pt-[15px]">
            <TablePagination
              dataSource={filterDataByPage()}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              onSort={onSortDetail}
              totalData={totalElements}
              tableScrolled={{
                x: 1500,
                y: 300,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TaxImplicationForm;
