import SVGIcon from "../../../../../assets/Icon/index";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { Space, Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import { separatorCurrency } from "../../UtilsProduct/UtilsAllProduct";

export const tableConditionPromo = (
  type,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  handleUpdate = () => {},
  onFilter = () => {},
  sorter = () => {},
  status,
  statusApproval,
  handleDetailHistory = () => {},
  search,
  storedData,
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "NAME",
    dataIndex: "name",
    // sorter: true,
    filteredValue: search?.["name"] ? [search?.["name"]] : null,
    // onFilter: (value, record) => onFilter("name", value, record),
    sorter: (a, b) => sorter("name", a, b),
    // ...getColumnSearchPropsPaging(
    //   "name",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "name",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData,
    ),
    render: (text) =>
      renderColumn(
        "name",
        hasValue(search["name"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "OPERATOR",
    dataIndex: "operator",
    // sorter: true,
    align: "center",
    filteredValue: search?.["operator"] ? [search?.["operator"]] : null,
    // onFilter: (value, record) => onFilter("operator", value, record),
    sorter: (a, b) => sorter("operator", a, b),
    // ...getColumnSearchPropsPaging(
    //   "operator",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "operator",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData,
    ),
    render: (text) =>
      renderColumn(
        "operator",
        hasValue(search["operator"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "DATA TYPE",
    dataIndex: "dataType",
    align: "center",
    // sorter: true,
    filteredValue: search?.["dataType"] ? [search?.["dataType"]] : null,
    // onFilter: (value, record) => onFilter("dataType", value, record),
    sorter: (a, b) => sorter("dataType", a, b),
    // ...getColumnSearchPropsPaging(
    //   "dataType",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "dataType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData,
    ),
    render: (text) =>
      renderColumn(
        "dataType",
        hasValue(search["dataType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "VALUE",
    dataIndex: "value",
    // sorter: true,
    align: "right",
    filteredValue: search?.["value"] ? [search?.["value"]] : null,
    // onFilter: (value, record) => onFilter("value", value, record),
    sorter: (a, b) => sorter("value", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "quantity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "currency",
    ),
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(search["quantity"]),
        searchText,
        separatorCurrency(text),
        false,
        "input",
        search,
      ),
    // ...getColumnSearchPropsPaging(
    //   "value",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    // render: (text, record) => {
    //   const tempValue = text ? (text + "").split(".") : [];
    //   const thousandSeparator = ",";
    //   const value =
    //     tempValue.length > 0
    //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    //       : 0;
    //   if (searchedColumn === "value") {
    //     const highlight = (
    //       <Highlighter
    //         highlightStyle={{
    //           backgroundColor: "#ffc069",
    //           padding: 0,
    //         }}
    //         searchWords={[searchText]}
    //         autoEscape
    //         textToHighlight={value || ""}
    //       />
    //     );
    //     if (value) {
    //       return highlight;
    //     }
    //     return highlight;
    //   } else {
    //     if (value) {
    //       return value;
    //     }
    //     return "";
    //   }
    // },
  },
  {
    title: "START DATE",
    // sorter: true,
    align: "center",
    dataIndex: "startDate",
    filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
    sorter: (a, b) => sorter("startDate", a, b),
    // ...getColumnSearchPropsPaging(
    //   "startDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "dateCapital"
    // ),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
      storedData,
    ),
    render: (text) =>
      renderDateColumn(
        "startDate",
        hasValue(search["startDate"]),
        searchText,
        text,
        "date",
        search,
      ),
    // render: (text) =>
    //   searchedColumn === "startDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "DD MMM YYYY").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    title: "END DATE",
    // sorter: true,
    align: "center",
    dataIndex: "endDate",
    filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
    sorter: (a, b) => sorter("endDate", a, b),
    // ...getColumnSearchPropsPaging(
    //   "endDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "dateCapital"
    // ),
    // render: (text) =>
    //   searchedColumn === "endDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "DD MMM YYYY").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
      storedData,
    ),
    render: (text) =>
      renderDateColumn(
        "endDate",
        hasValue(search["endDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    filteredValue: search?.["description"] ? [search?.["description"]] : null,
    // onFilter: (value, record) => onFilter("description", value, record),
    sorter: (a, b) => sorter("description", a, b),
    // ...getColumnSearchPropsPaging(
    //   "description",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true
    // ),
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData,
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(search["description"]),
        searchText,
        text,
        true,
        "input",
        search,
      ),
    // render: (text) =>
    //   searchedColumn === "description" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : text ? (
    //     <Tooltip placement="topLeft" title={text}>
    //       {text}
    //     </Tooltip>
    //   ) : (
    //     ""
    //   ),
  },
  {
    title: "ACTION",
    fixed: "right",
    align: "center",
    width: 120,
    dataIndex: "key",
    render: (id, record) => {
      const isDelete =
        (status === "DRAFT" && statusApproval === "DRAFT") ||
        record.type !== "exist";
      return (
        <Space className="my-3 gap-2">
          {type === "detail" ? (
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => handleDetailHistory(record)}
                />
              </div>
            </Tooltip>
          ) : (
            <div className="flex w-full justify-center gap-4">
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
                    color={isDelete ? "#D90000" : "#8D91A0"}
                    width={24}
                    className={
                      isDelete ? undefined : "disabled cursor-not-allowed"
                    }
                    onClick={isDelete ? () => handleDelete(record) : undefined}
                  />
                </div>
              </Tooltip>
            </div>
          )}
        </Space>
      );
    },
  },
];
