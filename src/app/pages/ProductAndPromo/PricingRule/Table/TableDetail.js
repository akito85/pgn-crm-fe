import { FilterOutlined } from "@ant-design/icons";
import { Input, Space, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { hasValue, renderColumn } from "../../../../../utils";
  
  const separatorNumber = (text) => {
		const thousandSeparator = ",";
		return text?.toString()?.length > 0
			? text?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
			: "";
  }

const getColumnSearchProps = (
  search,
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false
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
          color: filtered && hasValue(search[dataIndex]) === true ? "#1890ff" : undefined,
        }}
      />
    ),
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
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  handleUpdate = () => {},
  handleDetailHistory = () => {},
  type,
  data,
  minimums = new Set()
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
    title: "MINIMUM",
    dataIndex: "min",
    sorter: true,
    align: "right",
    filteredValue: search?.["min"]
    ? [search?.["min"]]
    : null,
    ...getColumnSearchProps(
      search,
      "min",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
          search
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
    title: "MAXIMUM",
    dataIndex: "maximumName",
    sorter: true,
    align: "right",
    filteredValue: search?.["maximumName"]
    ? [search?.["maximumName"]]
    : null,
    ...getColumnSearchProps(
      search,
      "maximumName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, row, index) => {
      let obj = {
        children: renderColumn(
          "maximumName",
          hasValue(search["maximumName"]),
          search["maximumName"],
          separatorNumber(text),
          false,
          "input",
          search
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
    title: "PRICE CODE",
    dataIndex: "priceCodeName",
    sorter: true,
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
      handleSearch
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
          search
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
        title: "VALUE",
        dataIndex: "value",
        align: "right",
        // ...getColumnSearchProps(
        //   "value",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
        render: (value, record) => {
          if (typeof value === "number") {
            const dataTemp = new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(value);
            return dataTemp.slice(0, dataTemp.length - 2);
          } else {
            return value;
          }
        },
      },
      {
        title: "CURRENCY",
        dataIndex: "currency",
        align: "center",
        render: (value) => {
          return <div>{value}</div>;
        },
      },
      {
        title: "UOM",
        dataIndex: "uom",
        align: "center",
        render: (value) => {
          return <div>{value}</div>;
        },
      },
    ],
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    sorter: true,
    align: "left",
    filteredValue: search?.["description"]
    ? [search?.["description"]]
    : null,
    ...getColumnSearchProps(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
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
          search
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
          {type === "detail" ? (
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => handleDetailHistory(r)}
                />
              </div>
            </Tooltip>
          ) : (
            <>
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
                  color={r.type !== "exist" ? "#D90000" : "#8D91A0"}
                  className={
                    r.type === "exist"
                      ? "disabled cursor-not-allowed"
                      : undefined
                  }
                  onClick={
                    r.type !== "exist"
                      ? () =>
                          handleDelete(
                            `${r["priceCodeName"]}~${r["min"]}~${r["maximumName"]}`
                          )
                      : undefined
                  }
                />
              </Tooltip>
            </>
          )}
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
