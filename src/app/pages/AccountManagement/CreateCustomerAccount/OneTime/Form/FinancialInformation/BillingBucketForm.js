import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Spin, DatePicker, Input, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../../utils";
import TablePagination from "../../../../../../../components/TablePagination";

const BillingBucketForm = ({ dataFinancialInfo = [], type }) => {
  // Selector
  const { loading } = useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const dataTable = dataFinancialInfo?.billingBucket || [];

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [totalElements, setTotalElement] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  // Use Effect
  useEffect(() => {
    setTotalElement(dataSource?.length);
  }, [dataSource]);

  useEffect(() => {
    if (dataTable && dataTable?.length > 0) {
      const data = dataTable?.map((a, index) => ({
        ...a,
        key: index + 1,
        detail: a.details?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataSource(data);
    }
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

  // Column Billing Bucket Expand
  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => {}
    ) => {
      return [
        {
          title: "NO",
          width: 60,
          align: "center",
          render: (text, object, index) => index + 1,
        },
        {
          title: "BILLING CODE",
          dataIndex: "billingCode",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "billingCode",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          title: "BILLING ITEM",
          dataIndex: "billingItem",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "billingItem",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          title: "PRIORITY",
          dataIndex: "priority",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "priority",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          title: "GL ACCOUNT",
          dataIndex: "glAccount",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "glAccount",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          title: "TYPE",
          dataIndex: "type",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "type",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
      ];
    };
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase pt-4">
          BILLING BUCKET DETAIL INFORMATION
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record?.details}
          columns={columns()}
          className={"mb-4"}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BILLING BUCKET CODE",
      dataIndex: "billingBucketCode",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("billingBucketCode"),
    },
    {
      title: "BILLING BUCKET NAME",
      dataIndex: "billingBucketName",
      sorter: true,
      align: "left",
      ...getColumnSearchProps("billingBucketName"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("category"),
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
    let result = [...dataSource];
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
            BILLING BUCKET INFORMATION
          </span>

          <div className="w-full pt-[30px]">
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
              expandable={{
                expandedRowRender,
              }}
            />
          </div>
        </>
      ) : (
        <>
          <span className="text-primary uppercase font-bold">
            BILLING BUCKET INFORMATION
          </span>

          <div className="w-full pt-[30px]">
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
              expandable={{
                expandedRowRender,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BillingBucketForm;
