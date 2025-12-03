import { DatePicker, Input, TimePicker, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import moment from "moment";
import SVGIcon from "../../../../../../assets/Icon/index";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import { FilterOutlined } from "@ant-design/icons";

const getColumnSearchPropsUseFilteredValueFE = (
  search,
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  typeFilter = "input",
  storedData = false,
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : null);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };

      return storedData === false ? (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeFilter === "date" ? (
            <DatePicker
              onChange={onDataChange}
              format={dateFormatting.date}
              ref={searchInput}
              value={
                hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()
              }
            />
          ) : null}
          {typeFilter === "dateCapital" ? (
            <DatePicker
              onChange={onDataChange}
              format={dateFormatting.dateCapital}
              ref={searchInput}
              value={
                hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()
              }
            />
          ) : null}
          {typeFilter === "datetime" ? (
            <DatePicker
              onChange={onDataChange}
              showTime={true}
              format={dateFormatting.dateTime}
              ref={searchInput}
              value={
                hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()
              }
            />
          ) : null}
          {typeFilter === "datePeriod" ? (
            <DatePicker
              onChange={onDataChange}
              picker="month"
              format={dateFormatting.datePeriod}
              ref={searchInput}
              value={
                hasValue(search[dataIndex]) && moment(search[dataIndex]).clone()
              }
            />
          ) : null}
          {typeFilter === "hour" ? (
            <TimePicker
              format={dateFormatting?.hour_format}
              onChange={onDataChange}
            />
          ) : null}
          {typeFilter === "input" ||
          typeFilter === "status" ||
          typeFilter === "select" ||
          typeFilter === "currency" ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              styleGroup={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}
          {typeFilter === "boolean" ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Y/N/y/n)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^YyNn]/g, "")
                  ?.charAt(0);
              }}
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={1}
            />
          ) : null}
          {typeFilter === "yes_or_no" ? (
            <Input
              ref={searchInput}
              placeholder={`Search (Yes/No)`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^yesnoYESNO]/g, "");
              }}
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              maxLength={3}
            />
          ) : null}
        </div>
      ) : null;
    },
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // onFilter: (value, record) => {
    //   if (typeFilter === 'status') {
    //     return record[dataIndex].toString().toLowerCase() === value?.toLowerCase()
    //   } else if (typeFilter === 'dateCapital') {
    //     return moment(record[dataIndex])?.format(dateFormatting?.dateCapital)?.toLowerCase() === moment(value)?.format(dateFormatting.dateCapital)?.toLowerCase()
    //   } else if (typeFilter === 'datetime') {
    //     return moment(record[dataIndex]).format(dateFormatting?.dateTime)?.toLowerCase() === moment(value)?.format(dateFormatting.dateTime)?.toLowerCase()
    //   } else if (typeFilter === 'datePeriod') {
    //     return moment(record[dataIndex]).format(dateFormatting.datePeriod).toLowerCase() === moment(value)?.format(dateFormatting.datePeriod)?.toLowerCase()
    //   } else if (typeFilter === 'date') {
    //     return moment(record[dataIndex])?.format(dateFormatting?.date)?.toLowerCase() === moment(value)?.format(dateFormatting.date)?.toLowerCase()
    //   } else if (typeFilter === 'boolean') {
    //     let result;
    //     if (value?.toLowerCase() === 'y') {
    //       result = record[dataIndex] === true
    //     } else {
    //       result = record[dataIndex] === false
    //     }
    //     return result;
    //   } else {
    //     if (typeFilter === 'contact' && dataIndex === 'value') {
    //       let changeDataIndex = dataIndex === 'value' ? 'fullValue' : dataIndex;
    //       return record[changeDataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()) || record[changeDataIndex]?.label?.toString()?.toLowerCase()?.includes(value?.toLowerCase());
    //     } else if (typeFilter === "currency") {
    //       const tempValue = record[dataIndex]
    //         ? (record[dataIndex] + "").split(".")
    //         : [];
    //       const thousandSeparator = ",";
    //       const decimalSeparator = ".";
    //       const descimal = tempValue[1]
    //         ? `${decimalSeparator}${tempValue[1]}`
    //         : `${decimalSeparator}00`;
    //       const format =
    //         tempValue.length > 0
    //           ? tempValue[0].replace(
    //             /\B(?=(\d{3})+(?!\d))/g,
    //             thousandSeparator
    //           ) + descimal
    //           : "";
    //       return format?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
    //     } else {
    //       return record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()) || record[dataIndex]?.label?.toString()?.toLowerCase()?.includes(value?.toLowerCase());
    //     }
    //   }
    // },
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
  dataCurrency = [],
  dataBillingItem = [],
  handleSearch = () => {},
  handleUpdate = () => {},
  handleDelete = () => {},
  onFilter = () => {},
  sorter = () => {},
  status,
  statusApproval,
  handleDetail = () => {},
  showAction,
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "BILLING ITEM",
    dataIndex: "billingItem",
    onFilter: (value, record) => onFilter("billingItem", value, record),
    sorter: (a, b) => sorter("billingItem", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "billingItem",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text, record) => {
      const itemName = dataBillingItem
        ?.filter((item) => item?.value === text)
        .map((name) => name?.name)
        .shift();

      return text
        ? renderColumn(
            "billingItem",
            hasValue(search["billingItem"]),
            searchText,
            itemName,
            false,
            "input",
            search,
          )
        : itemName;
      // if (searchedColumn === "billingItem") {
      //   const highlight = (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={itemName || ""}
      //     />
      //   );
      //   if (itemName) {
      //     return highlight;
      //   }
      //   return highlight;
      // } else {
      //   if (itemName) {
      //     return itemName;
      //   }
      //   return "";
      // }
    },
  },
  {
    title: "CURRENCY",
    dataIndex: "currency",
    align: "center",
    onFilter: (value, record) => onFilter("currency", value, record),
    sorter: (a, b) => sorter("currency", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text, record) => {
      const itemName = dataCurrency
        ?.filter((item) => item?.id === text)
        .map((name) => name?.text)
        .shift();

      return text
        ? renderColumn(
            "currency",
            hasValue(search["currency"]),
            searchText,
            itemName,
            false,
            "input",
            search,
          )
        : itemName;
      // if (searchedColumn === "currency") {
      //   const highlight = (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={itemName || ""}
      //     />
      //   );
      //   if (itemName) {
      //     return highlight;
      //   }
      //   return highlight;
      // } else {
      //   if (itemName) {
      //     return itemName;
      //   }
      //   return "";
      // }
    },
  },
  {
    title: "SEQUENCE",
    dataIndex: "sequence",
    align: "right",
    onFilter: (value, record) => onFilter("sequence", value, record),
    sorter: (a, b) => sorter("sequence", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "sequence",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text, record) =>
      renderColumn(
        "sequence",
        hasValue(search["sequence"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "START DATE",
    align: "center",
    dataIndex: "startDate",
    onFilter: (value, record) => onFilter("startDate", value, record),
    sorter: (a, b) => sorter("startDate", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "dateCapital",
    ),
    render: (text) =>
      renderDateColumn(
        "startDate",
        hasValue(search["startDate"]),
        searchText,
        text,
        "dateCapital",
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
    align: "center",
    dataIndex: "endDate",
    onFilter: (value, record) => onFilter("endDate", value, record),
    sorter: (a, b) => sorter("endDate", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "dateCapital",
    ),
    render: (text) =>
      renderDateColumn(
        "endDate",
        hasValue(search["endDate"]),
        searchText,
        text,
        "dateCapital",
        search,
      ),
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
  },
  {
    title: "PRIORITY",
    dataIndex: "priority",
    align: "center",
    onFilter: (value, record) => onFilter("priority", value, record),
    sorter: (a, b) => sorter("priority", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "priority",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) => {
      const tempValue = text === true ? "Yes" : "No";

      return tempValue
        ? renderColumn(
            "priority",
            hasValue(search["priority"]),
            searchText,
            tempValue,
            false,
            "input",
            search,
          )
        : tempValue;
    },
    // render: (text) => {
    //   const tempValue = text === true ? "Yes" : "No";
    //   if (searchedColumn === "priority") {
    //     const highlight = (
    //       <Highlighter
    //         highlightStyle={{
    //           backgroundColor: "#ffc069",
    //           padding: 0,
    //         }}
    //         searchWords={[searchText]}
    //         autoEscape
    //         textToHighlight={tempValue || ""}
    //       />
    //     );
    //     if (tempValue) {
    //       return highlight;
    //     }
    //     return highlight;
    //   } else {
    //     if (tempValue) {
    //       return tempValue;
    //     }
    //     return "";
    //   }
    // },
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    onFilter: (value, record) => onFilter("description", value, record),
    sorter: (a, b) => sorter("description", a, b),
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
    align: "center",
    width: 100,
    dataIndex: "id",
    fixed: "right",
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
