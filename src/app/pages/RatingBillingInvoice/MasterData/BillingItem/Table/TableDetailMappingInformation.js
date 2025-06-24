import moment from "moment";
import { getColumnSearchPropsPaging, getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";

export const columnsDetail = (
  search,
  storedData = false,
  type = "detail",
  // dataSourceBy = "BE",
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  onFilter = () => {},
  sorterDetail = () => {},
  dataMappingItem = [],
  handleDetailHistory = () => {}
  // dataMapDetailItemList = [],
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    dataIndex: "no",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ITEM",
    dataIndex: "itemName",
    key: "itemName",
    align: "center",
    filteredValue: search?.["itemName"] ? [search?.["itemName"]] : null,
    // ...(type === "detail"
    //   ? { sorter: true }
    //   : {
          // onFilter: (value, record) => onFilter("itemName", value, record),
          sorter: (a, b) => sorterDetail("itemName", a, b),
        // }),
    editable: true,
    inputType: "select",
    required: true,
    options: dataMappingItem,
    // ...getColumnSearchPropsPaging(
    //   "itemName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "itemName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData
    ),
    render: (text) =>
      renderColumn(
        "itemName",
        hasValue(search["itemName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // render: (text) => {
    //   // if (dataSourceBy !== "BE") {
    //   //   const itemName = dataMapDetailItemList
    //   //     ?.filter((item) => item?.id === text)
    //   //     .find((item) => item?.name)?.name;

    //   //   if (itemName) {
    //   //     return <span>{itemName}</span>;
    //   //   }
    //   // } else {
    //   return <span>{text}</span>;
    // },
    // },
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
    // ...(type === "detail"
    //   ? { sorter: true }
    //   : {
          // onFilter: (value, record) => onFilter("startDate", value, record),
          sorter: (a, b) => sorterDetail("startDate", a, b),
        // }),
    editable: true,
    inputType: "date",
    align: "center",
    required: true,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
      storedData
    ),
    render: (text) =>
      renderDateColumn(
        "startDate",
        hasValue(search["startDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "startDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "dateCapital"
    // ),
    // render: (index) => {
    //   const text = index ? moment(index).format("DD MMM YYYY") : "";
    //   if (searchedColumn === "startDate") {
    //     return (
    //       <Highlighter
    //         highlightStyle={{
    //           backgroundColor: "#ffc069",
    //           padding: 0,
    //         }}
    //         searchWords={[searchText]}
    //         autoEscape
    //         textToHighlight={text ? text.toString() : ""}
    //       />
    //     );
    //   } else {
    //     return text || "";
    //   }
    // },
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
    // ...(type === "detail"
    //   ? { sorter: true }
    //   : {
          // onFilter: (value, record) => onFilter("endDate", value, record),
          sorter: (a, b) => sorterDetail("endDate", a, b),
        // }),
    editable: true,
    align: "center",
    inputType: "date",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
      storedData
    ),
    render: (text) =>
      renderDateColumn(
        "endDate",
        hasValue(search["endDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "endDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "dateCapital"
    // ),
    // render: (index) => {
    //   const text = index ? moment(index).format("DD MMM YYYY") : "";
    //   if (searchedColumn === "endDate") {
    //     return (
    //       <Highlighter
    //         highlightStyle={{
    //           backgroundColor: "#ffc069",
    //           padding: 0,
    //         }}
    //         searchWords={[searchText]}
    //         autoEscape
    //         textToHighlight={text ? text.toString() : ""}
    //       />
    //     );
    //   } else {
    //     return text || "";
    //   }
    // },
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
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleDetailHistory(record)}
              />
            </div>
          </Tooltip>
        </div>
      );
    },
  },
];

export default columnsDetail;
