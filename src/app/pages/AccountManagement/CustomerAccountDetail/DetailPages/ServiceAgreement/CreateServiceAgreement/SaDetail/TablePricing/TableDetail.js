import { FilterOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { NumericFormat } from "react-number-format";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import { hasValue, renderColumn } from "../../../../../../../../../utils";
const separatorNumber = (text) => {
  const thousandSeparator = ",";
  return text?.toString()?.length > 0
    ? text?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    : "";
};

const getColumnSearchProps = (
  search,
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  // onFilter = (value, record) =>
  // 	record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
) => {
  let obj = {
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
          color:
            filtered && hasValue(search[dataIndex]) === true
              ? "#1890ff"
              : undefined,
        }}
      />
    ),
    // onFilter: onFilter,
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
        text || ""
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

export const columnsDetail = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  handleUpdate = () => {},
  data,
  minimums = new Set(),
  isCustomTiering,
) => [
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
    filteredValue: search?.["min"] ? [search?.["min"]] : null,
    align: "right",
    ...getColumnSearchProps(
      search,
      "min",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, row, index) => {
      let obj = {
        children: renderColumn(
          "min",
          hasValue(search["min"]),
          search["min"],
          separatorNumber(text),
          false,
          "input",
          search,
        ),
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
    filteredValue: search?.["max"] ? [search?.["max"]] : null,
    align: "right",
    ...getColumnSearchProps(
      search,
      "max",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, row, index) => {
      let obj = {
        children: renderColumn(
          "max",
          hasValue(search["max"]),
          search["max"],
          separatorNumber(text),
          false,
          "input",
          search,
        ),
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
    dataIndex: "priceCodeName",
    align: "left",
    filteredValue: search?.["priceCodeName"]
      ? [search?.["priceCodeName"]]
      : null,
    ...getColumnSearchProps(
      search,
      "priceCodeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text, row, index) => {
      let obj = {
        children: renderColumn(
          "priceCodeName",
          hasValue(search["priceCodeName"]),
          search["priceCodeName"],
          text,
          false,
          "input",
          search,
        ),
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
        // sorter: true,
        title: "VALUE",
        dataIndex: "value",
        align: "right",
        // ...getColumnSearchProps(
        // 	search,
        // 	"value",
        // 	searchInput,
        // 	searchedColumn,
        // 	searchText,
        // 	handleSearch
        // ),
        render: (value, record) => (
          <NumericFormat
            displayType="text"
            value={value}
            className="text-right"
            thousandSeparator={record.currency === "USD" ? "," : "."}
            decimalSeparator={record.currency === "USD" ? "." : ","}
            decimalScale={2}
            fixedDecimalScale
          />
        ),
      },
      {
        // sorter: true,
        title: "CURRENCY",
        dataIndex: "currency",
        align: "center",
        // ...getColumnSearchProps(
        // 	search,
        // 	"currency",
        // 	searchInput,
        // 	searchedColumn,
        // 	searchText,
        // 	handleSearch
        // ),
      },
      {
        // sorter: true,
        title: "UOM",
        dataIndex: "uomName",
        align: "center",
        // ...getColumnSearchProps(
        // 	search,
        // 	"uomName",
        // 	searchInput,
        // 	searchedColumn,
        // 	searchText,
        // 	handleSearch
        // ),
      },
      {
        // sorter: true,
        title: "PRICE ADJUSTMENT",
        dataIndex: "adjustment",
        align: "center",
        // ...getColumnSearchProps(
        // 	search,
        // 	"adjustment",
        // 	searchInput,
        // 	searchedColumn,
        // 	searchText,
        // 	handleSearch
        // ),
        render: (data) => <span>{data}</span>,
      },
    ],
  },
  {
    sorter: true,
    title: "DESCRIPTION",
    dataIndex: "description",
    align: "left",
    filteredValue: search?.["description"] ? [search?.["description"]] : null,
    ...getColumnSearchProps(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text, row, index) => {
      let obj = {
        children: renderColumn(
          "description",
          hasValue(search["description"]),
          search["description"],
          text,
          true,
          "input",
          search,
        ),
        props: {
          colSpan: 1,
          rowSpan: row.rowSpan,
        },
      };
      return obj;
    },
  },
  {
    title: "ACTION",
    fixed: "right",
    align: "center",
    width: 110,
    dataIndex: "key",
    render: (v, r, i) => {
      const children = (
        <div className="flex w-full justify-center gap-6">
          <Tooltip title="Update">
            <SVGIcon
              name="IconEdit"
              width={24}
              onClick={() => {
                handleUpdate(r);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <SVGIcon
              name="IconDelete"
              width={24}
              className={
                r.type === "exist" ? "disabled cursor-not-allowed" : undefined
              }
              onClick={
                r.type !== "exist"
                  ? () => handleDelete(r.priceCode, r.max, r.min)
                  : undefined
              }
            />
          </Tooltip>
        </div>
      );
      let obj = {
        children: children,
        props: {
          colSpan: 1,
          rowSpan: r.rowSpan,
        },
      };
      return obj;
    },
  },
];
