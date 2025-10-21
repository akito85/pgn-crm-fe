import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../../assets/Icon/index";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import { Tooltip } from "antd";

export const columnsCondition = (
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
  handleDetail = () => {},
  showAction,
  data_condition_name,
  data_condition_operator,
  data_condition_type,
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
    sorter: true,
    onFilter: (value, record) => onFilter("name", value, record),
    sorter: (a, b) => sorter("name", a, b),
    ...getColumnSearchPropsPaging(
      "name",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) => {
      const itemName = data_condition_name
        ?.filter((item) => item?.code === text)
        .map((name) => name?.text)
        .shift();

      if (itemName) {
        return <span>{itemName}</span>;
      }
    },
  },
  {
    title: "OPERATOR",
    dataIndex: "operator",
    sorter: true,
    align: "center",
    onFilter: (value, record) => onFilter("operator", value, record),
    sorter: (a, b) => sorter("operator", a, b),
    ...getColumnSearchPropsPaging(
      "operator",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) => {
      const operatorName = data_condition_operator
        ?.filter((item) => item?.code === text)
        .map((name) => name?.text)
        .shift();

      if (operatorName) {
        return <span>{operatorName}</span>;
      }
    },
  },
  {
    title: "DATA TYPE",
    dataIndex: "dataType",
    align: "center",
    sorter: true,
    onFilter: (value, record) => onFilter("dataType", value, record),
    sorter: (a, b) => sorter("dataType", a, b),
    ...getColumnSearchPropsPaging(
      "dataType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) => {
      const dataTypeName = data_condition_type
        ?.filter((item) => item?.code === text)
        .map((name) => name?.text)
        .shift();

      if (dataTypeName) {
        return <span>{dataTypeName}</span>;
      }
    },
  },
  {
    title: "VALUE",
    dataIndex: "value",
    sorter: true,
    align: "right",
    onFilter: (value, record) => onFilter("value", value, record),
    sorter: (a, b) => sorter("value", a, b),
    ...getColumnSearchPropsPaging(
      "value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text, record) => {
      const tempValue = text ? (text + "").split(".") : [];
      const thousandSeparator = ",";
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
          : 0;
      if (searchedColumn === "value") {
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
    title: "START DATE",
    sorter: true,
    align: "center",
    dataIndex: "startDate",
    ...getColumnSearchPropsPaging(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "dateCapital",
    ),
    render: (text) =>
      searchedColumn === "startDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "DD MMM YYYY").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    title: "END DATE",
    sorter: true,
    align: "center",
    dataIndex: "endDate",
    ...getColumnSearchPropsPaging(
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "dateCapital",
    ),
    render: (text) =>
      searchedColumn === "endDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "DD MMM YYYY").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    onFilter: (value, record) => onFilter("description", value, record),
    sorter: (a, b) => sorter("description", a, b),
    ...getColumnSearchPropsPaging(
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
    render: (text) =>
      searchedColumn === "description" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "ACTION",
    fixed: "right",
    align: "center",
    width: 100,
    dataIndex: "key",
    render: (id, record) => {
      const isDelete =
        (status === "DRAFT" && statusApproval === "DRAFT") ||
        record.type !== "exist";
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
                    color={isDelete ? "#D90000" : "#8D91A0"}
                    width={24}
                    className={
                      isDelete ? undefined : "disabled cursor-not-allowed"
                    }
                    onClick={isDelete ? () => handleDelete(record) : undefined}
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
