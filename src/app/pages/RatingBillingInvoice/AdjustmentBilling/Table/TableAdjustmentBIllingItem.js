import { Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";

export const columnsTableABI = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  dataDetailType = [],
  handleSearch = () => {},
  handleUpdate = () => {},
  handleDelete = () => {},
  onFilter = () => {},
  sorter = () => {},
  handleDetail = () => {},
  showAction,
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ITEM",
    dataIndex: "item",
    onFilter: (value, record) => onFilter("item", value, record),
    sorter: (a, b) => sorter("item", a, b),
    ...getColumnSearchPropsPaging(
      "item",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "QUANTITY",
    dataIndex: "quantity",
    align: "right",
    onFilter: (value, record) => onFilter("quantity", value, record),
    sorter: (a, b) => sorter("quantity", a, b),
    ...getColumnSearchPropsPaging(
      "quantity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => {
      if (searchedColumn === "quantity") {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      } else {
        return text;
        // if (text) {
        //   return text;
        // }
        // return "";
      }
    },
  },
  {
    title: "PRICE",
    dataIndex: "price",
    align: "right",
    onFilter: (value, record) => onFilter("price", value, record),
    sorter: (a, b) => sorter("price", a, b),
    ...getColumnSearchPropsPaging(
      "price",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, record) => {
      const tempValue = text ? (text + "").split(".") : [];
      const thousandSeparator = ",";
      const decimalSeparator = ".";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : 0 + descimal;
      if (searchedColumn === "price") {
        const highlight = (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value || ""}
          />
        );
        if (value) {
          return highlight;
        }
        return highlight;
      } else {
        if (value) {
          return value;
        }
        return "";
      }
    },
  },
  {
    title: "UOM",
    dataIndex: "uom",
    align: "center",
    onFilter: (value, record) => onFilter("uom", value, record),
    sorter: (a, b) => sorter("uom", a, b),
    ...getColumnSearchPropsPaging(
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "CURRENCY",
    dataIndex: "currency",
    align: "center",
    onFilter: (value, record) => onFilter("currency", value, record),
    sorter: (a, b) => sorter("currency", a, b),
    ...getColumnSearchPropsPaging(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "TYPE",
    dataIndex: "type",
    align: "center",
    onFilter: (value, record) => onFilter("type", value, record),
    sorter: (a, b) => sorter("type", a, b),
    ...getColumnSearchPropsPaging(
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) => {
      if (typeof text !== "string") {
        const itemName = dataDetailType
          ?.filter((item) => item?.id === text)
          .map((name) => name?.name)
          .shift();

        if (itemName) {
          return <span>{itemName}</span>;
        }
      } else {
        return <span>{text}</span>;
      }
    },
  },
  {
    title: "ORIGINAL AMOUNT",
    dataIndex: "amount",
    align: "right",
    onFilter: (value, record) => onFilter("amount", value, record),
    sorter: (a, b) => sorter("amount", a, b),
    ...getColumnSearchPropsPaging(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, record) => {
      const tempValue = text ? (text + "").split(".") : [];
      const thousandSeparator = ",";
      const decimalSeparator = ".";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : 0 + descimal;
      if (searchedColumn === "amount") {
        const highlight = (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value || ""}
          />
        );
        if (value) {
          return highlight;
        }
        return highlight;
      } else {
        if (value) {
          return value;
        }
        return "";
      }
    },
  },
  {
    title: "ADJUSTMENT AMOUNT",
    dataIndex: "adjustmentAmount",
    align: "right",
    onFilter: (value, record) => onFilter("adjustmentAmount", value, record),
    sorter: (a, b) => sorter("adjustmentAmount", a, b),
    ...getColumnSearchPropsPaging(
      "adjustmentAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, record) => {
      const tempValue = text ? (text + "").split(".") : [];
      const thousandSeparator = ",";
      const decimalSeparator = ".";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : 0 + descimal;
      if (searchedColumn === "adjustmentAmount") {
        const highlight = (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value || ""}
          />
        );
        if (value) {
          return highlight;
        }
        return highlight;
      } else {
        if (value) {
          return value;
        }
        return "";
      }
    },
  },
  {
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    align: "right",
    onFilter: (value, record) => onFilter("totalAmount", value, record),
    sorter: (a, b) => sorter("totalAmount", a, b),
    ...getColumnSearchPropsPaging(
      "totalAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, record) => {
      const tempValue = text ? (text + "").split(".") : [];
      const thousandSeparator = ",";
      const decimalSeparator = ".";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : 0 + descimal;
      if (searchedColumn === "totalAmount") {
        const highlight = (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value || ""}
          />
        );
        if (value) {
          return highlight;
        }
        return highlight;
      } else {
        if (value) {
          return value;
        }
        return "";
      }
    },
  },
  {
    title: "TOTAL AMOUNT EQV IDR",
    dataIndex: "totalAmountEqvIdr",
    align: "right",
    onFilter: (value, record) => onFilter("totalAmountEqvIdr", value, record),
    sorter: (a, b) => sorter("totalAmountEqvIdr", a, b),
    ...getColumnSearchPropsPaging(
      "totalAmountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, record) => {
      const tempValue = text ? (text + "").split(".") : [];
      const thousandSeparator = ",";
      const decimalSeparator = ".";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : 0 + descimal;
      if (searchedColumn === "totalAmountEqvIdr") {
        const highlight = (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value || ""}
          />
        );
        if (value) {
          return highlight;
        }
        return highlight;
      } else {
        if (value) {
          return value;
        }
        return "";
      }
    },
  },
  {
    title: "TOTAL AMOUNT EQV USD",
    dataIndex: "totalAmountEqvUsd",
    align: "right",
    onFilter: (value, record) => onFilter("totalAmountEqvUsd", value, record),
    sorter: (a, b) => sorter("totalAmountEqvUsd", a, b),
    ...getColumnSearchPropsPaging(
      "totalAmountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, record) => {
      const tempValue = text ? (text.toFixed(2) + "").split(".") : [];
      const thousandSeparator = ",";
      const decimalSeparator = ".";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : 0 + descimal;
      if (searchedColumn === "totalAmountEqvUsd") {
        const highlight = (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value || ""}
          />
        );
        if (value) {
          return highlight;
        }
        return highlight;
      } else {
        if (value) {
          return value;
        }
        return "";
      }
    },
  },
  {
    title: "REMARK",
    dataIndex: "remark",
    width: 240,
    ellipsis: {
      showTitle: false,
    },
    onFilter: (value, record) => onFilter("remark", value, record),
    sorter: (a, b) => sorter("remark", a, b),
    ...getColumnSearchPropsPaging(
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => {
      if (searchedColumn === "remark") {
        return (
          <Tooltip placement="topLeft" title={text}>
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          </Tooltip>
        );
      } else {
        if (text) {
          return (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          );
        }
        return "";
      }
    },
  },
  {
    title: "ACTION",
    align: "center",
    width: 100,
    dataIndex: "id",
    fixed: "right",
    render: (id, record) => {
      return (
        <div className="flex w-full justify-center gap-4">
          {showAction === "show" ? (
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => handleDetail(record)}
                />
              </div>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Update">
                <div className="pt-1">
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    onClick={() => handleUpdate(record)}
                  />
                </div>
              </Tooltip>

              <Tooltip title="Delete">
                <div className="pt-1">
                  <SVGIcon
                    name="IconDelete"
                    color={"#D90000"}
                    width={24}
                    onClick={() => handleDelete(record)}
                  />
                </div>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
  },
];
