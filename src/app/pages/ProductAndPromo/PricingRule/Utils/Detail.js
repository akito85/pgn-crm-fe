import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import TablePagination from "../../../../../components/TablePagination";
import { NumericFormat } from "react-number-format";
import { columnsDetail } from "../Table/TableDetail";
import { useEffect } from "react";
import { list } from "postcss";

const Detail = ({ id = 0, getAPI, selector = "pricingRule" }) => {
  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const { data_pricing_rule_detail = {} } = useSelector(
    (state) => state[selector]
  );

  useEffect(() => {
    if (id !== 0 && getAPI) {
      dispatch(getAPI({ id, page, pageSize, search, sort }));
    }
  }, [id, page, pageSize, search, sort]);

  // Data Detail Pricing Rule
  const dataDetailPricingRule = (data_pricing_rule_detail?.result || []).map(
    (item) => {
      return {
        pricingRuleDetailId: item.pricingRuleDetailId,
        lineNumber: item.lineNumber,
        priceCode: item.priceCode,
        min: item.min,
        max: item.max,
        maximumName: item.unlimited === true ? "Unlimited" : item.max,
        description: item.description,
        unlimited: item.unlimited,
        value: item.value,
        uom: item.uom,
        currency: item.currency,
      };
    }
  );

  // Search Column
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
          searchWords={[searchText]}
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

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (value, row, index) => {
        let obj = {
          children: (page - 1) * pageSize + row.number + 1,
          props: {
            colSpan: 1,
            rowSpan: row.rowSpan,
          },
        };
        return obj;
      },
    },
    {
      sorter: true,
      title: "MINIMUM",
      dataIndex: "min",
      align: "right",
      ...getColumnSearchProps(
        "minimum",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (value, row, index) => {
        let obj = {
          children: value,
          props: {
            colSpan: 1,
            rowSpan: row.rowSpan,
          },
        };
        return obj;
      },
    },
    {
      sorter: true,
      title: "MAXIMUM",
      dataIndex: "max",
      align: "right",
      ...getColumnSearchProps(
        "max",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (value, row, index) => {
        let obj = {
          children: value,
          props: {
            colSpan: 1,
            rowSpan: row.rowSpan,
          },
        };
        return obj;
      },
    },
    {
      sorter: true,
      title: "PRICE CODE",
      dataIndex: "priceCode",
      align: "left",
      ...getColumnSearchProps(
        "priceCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (value, row, index) => {
        let obj = {
          children: value,
          props: {
            colSpan: 1,
            rowSpan: row.rowSpan,
          },
        };
        return obj;
      },
    },
    {
      title: "PRICE DETAIL",
      children: [
        {
          sorter: true,
          title: "VALUE",
          dataIndex: "value",
          align: "right",
          ...getColumnSearchProps(
            "value",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
          render: (value) => (
            <NumericFormat
              displayType="text"
              value={value}
              className="text-right"
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale
            />
          ),
        },
        {
          sorter: true,
          title: "CURRENCY",
          dataIndex: "currency",
          align: "center",
          ...getColumnSearchProps(
            "currency",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          sorter: true,
          title: "UOM",
          dataIndex: "uom",
          align: "center",
          ...getColumnSearchProps(
            "uom",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
      ],
    },
    {
      sorter: true,
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      render: (value, row, index) => {
        let obj = {
          children: value,
          props: {
            colSpan: 1,
            rowSpan: row.rowSpan,
          },
        };
        return obj;
      },
    },
  ];

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const mergedTable = (rowsData = []) => {
    const uniquePriceCode = new Set();
    let pageNo = 0;
    let pageNumber = 0;
    const mergedData = rowsData.map((rowData, index) => {
      const updatedRowsData = { ...rowData };
      if (index !== 0 && index % pageSize === 0) {
        uniquePriceCode.clear();
        pageNo += 1;
      }
      if (uniquePriceCode.has(rowData.priceCode)) {
        updatedRowsData.rowSpan = 0;
      } else {
        const occurCount = rowsData
          .slice(pageNo * pageSize, (pageNo + 1) * pageSize)
          .filter((data) => data.priceCode === rowData.priceCode).length;
        updatedRowsData.rowSpan = Math.min(pageSize, occurCount);
        updatedRowsData.number = pageNumber;
        uniquePriceCode.add(rowData.priceCode);
        pageNumber++;
      }
      return updatedRowsData;
    });
    return mergedData;
  };

  return (
    <div className="w-full">
      <TablePagination
        dataSource={mergedTable(dataDetailPricingRule)}
        columns={columns}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onShowSizeChange={handleChange}
        totalData={data_pricing_rule_detail?.page?.totalElements || 0}
        onSort={onSort}
        tableScrolled={{
          x: 1500,
          y: 300,
        }}
      />
    </div>
  );
};

export default Detail;
