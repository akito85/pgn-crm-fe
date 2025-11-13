import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";

export const columnsMapping = (
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
  handleDetail = () => {},
  onFilter = () => {},
  sorter = () => {},
  dataCategoryMap = []
  // dataCategoryMapList = [],
) => {
  const res = [
    {
      title: "NO",
      align: "center",
      width: "5%",
      dataIndex: "no",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "categoryName",
      key: "categoryName",
      filteredValue: search?.["categoryName"] ? [search?.["categoryName"]] : null,
      // ...(type === "detail"
      //   ? { sorter: true }
      //   : {
      // onFilter: (value, record) => onFilter("categoryName", value, record),
      sorter: (a, b) => sorter("categoryName", a, b),
      // }),
      editable: true,
      inputType: "select",
      align: "center",
      required: true,
      options: dataCategoryMap,
      // ...getColumnSearchPropsPaging(
      //   "categoryName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "categoryName",
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
          "categoryName",
          hasValue(search["categoryName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      editable: true,
      inputType: "date",
      align: "center",
      filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
      // ...(type === "detail"
      //   ? { sorter: true }
      //   : {
      // onFilter: (value, record) => onFilter("startDate", value, record),
      sorter: (a, b) => sorter("startDate", a, b),
      // }),
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
      editable: true,
      align: "center",
      filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
      // ...(type === "detail"
      //   ? { sorter: true }
      //   : {
      // onFilter: (value, record) => onFilter("endDate", value, record),
      sorter: (a, b) => sorter("endDate", a, b),
      // }),
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
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      editable: true,
      inputType: "text",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      // ...(type === "detail"
      //   ? { sorter: true }
      //   : {
      // onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      // }),
      onInput: (e) => {
        return (e.target.value = e.target.value.replace(/\D/g, ""));
      },
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
        storedData
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
      // ...getColumnSearchPropsPaging(
      //   "description",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text) => {
      //   if (searchedColumn === "description") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "ACTION",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleDetail(r);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (type !== "detail") {
    return res.filter((column) => column.title !== "ACTION");
  }
  return res;
};

export default columnsMapping;
