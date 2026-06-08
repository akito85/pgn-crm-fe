import React from "react";
import { Tooltip, Dropdown, Menu } from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { dateFormatting, toTitleCase } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";
import SVGIcon from "../../../../../assets/Icon/index";

const renderText = (text, searchedCol, searchText, columnKey) => {
  if (searchedCol === columnKey) {
    return (
      <Tooltip placement="topLeft" title={text}>
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      </Tooltip>
    );
  }
  if (text) {
    return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>;
  }
  return "";
};

const renderAmount = (text, searchedCol, searchText, columnKey) => {
  if (searchedCol === columnKey) {
    return (
      <Tooltip placement="topLeft" title={text}>
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      </Tooltip>
    );
  }
  if (text !== null && text !== undefined) {
    return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>;
  }
  return "";
};

const renderDate = (text, searchedCol, searchText, columnKey, format = dateFormatting.dateTime) => {
  if (searchedCol === columnKey) {
    return (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[
          searchText ? moment(searchText, "YYYY-MM-DD").format(format) : "",
        ]}
        autoEscape
        textToHighlight={text ? moment(text).format(format) : ""}
      />
    );
  }
  return text ? moment(text).format(format) : "";
};

export const columnsAllocation = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  _handleReset,
  handleEdit = () => {},
  handleDelete = () => {},
  _handleOptions,
  editingKey = null,
  handleSave = () => {},
  handleCancel = () => {},
  handleReverse = () => {},
  handleInputChange = () => {}
) => [
  // 1. NO
  {
    title: "NO",
    width: 45,
    align: "center",
    fixed: "left",
    render: (_text, _object, index) => (page - 1) * pageSize + index + 1,
  },
  // 2. ALLOCATION NUMBER
  {
    title: "ALLOCATION NUMBER",
    dataIndex: "allocationNumber",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging("allocationNumber", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderText(text, searchedColumn, searchText, "allocationNumber"),
  },
  // 3. ITEM (billingItem)
  {
    title: "ITEM",
    dataIndex: "billingItem",
    sorter: true,
    width: 110,
    ...getColumnSearchPropsPaging("billingItem", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderText(text, searchedColumn, searchText, "billingItem"),
  },
  // 4. ALLOCATION DATE
  {
    title: "ALLOCATION DATE",
    dataIndex: "allocationDate",
    sorter: true,
    align: "center",
    width: 150,
    ...getColumnSearchPropsPaging("allocationDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"),
    render: (text) => renderDate(text, searchedColumn, searchText, "allocationDate", dateFormatting.dateTime),
  },
  // 5. AMOUNT
  {
    title: "AMOUNT",
    dataIndex: "allocationAmount",
    align: "right",
    inputType: "number",
    sorter: true,
    width: 110,
    ...getColumnSearchPropsPaging("allocationAmount", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text, record) => {
      if (editingKey === record.key) {
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-full border rounded px-2 py-1"
              defaultValue={text}
              onBlur={(e) => handleInputChange(record.key, "allocationAmount", e.target.value)}
              autoFocus
            />
          </div>
        );
      }
      return renderAmount(text, searchedColumn, searchText, "allocationAmount");
    },
  },
  // 6. INVOICE NUMBER
  {
    title: "INVOICE NUMBER",
    dataIndex: "invoiceNumber",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging("invoiceNumber", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderText(text, searchedColumn, searchText, "invoiceNumber"),
  },
  // 7. INVOICE CURRENCY
  {
    title: "INVOICE CURRENCY",
    dataIndex: "invoiceCurrency",
    sorter: true,
    align: "center",
    width: 90,
    ...getColumnSearchPropsPaging("invoiceCurrency", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderText(text, searchedColumn, searchText, "invoiceCurrency"),
  },
  // 8. BILLING PERIOD
  {
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    sorter: true,
    align: "center",
    width: 110,
    ...getColumnSearchPropsPaging("billingPeriod", searchInput, searchedColumn, searchText, handleSearch, true, "datePeriod"),
    render: (text) =>
      searchedColumn === "billingPeriod" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod) : ""]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.datePeriod) : ""}
        />
      ) : text ? moment(text).format(dateFormatting.datePeriod) : "",
  },
  // 9. BILLING ITEM AMOUNT
  {
    title: "BILLING ITEM AMOUNT",
    dataIndex: "billingItemAmount",
    align: "right",
    sorter: true,
    width: 140,
    ...getColumnSearchPropsPaging("billingItemAmount", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderAmount(text, searchedColumn, searchText, "billingItemAmount"),
  },
  // 10. TYPE (allocationType)
  {
    title: "TYPE",
    dataIndex: "allocationType",
    sorter: true,
    width: 90,
    ...getColumnSearchPropsPaging("allocationType", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderText(text, searchedColumn, searchText, "allocationType"),
  },
  // 11. BILLING ITEM BALANCE
  {
    title: "BILLING ITEM BALANCE",
    dataIndex: "billingItemBalance",
    align: "right",
    sorter: true,
    width: 140,
    ...getColumnSearchPropsPaging("billingItemBalance", searchInput, searchedColumn, searchText, handleSearch),
    render: (text) => renderAmount(text, searchedColumn, searchText, "billingItemBalance"),
  },
  // 12. CONVERTED CURRENCY
  {
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    sorter: true,
    align: "center",
    width: 100,
    ...getColumnSearchPropsPaging("convertedCurrency", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderText(text, searchedColumn, searchText, "convertedCurrency"),
  },
  // 13. RATE TYPE
  {
    title: "RATE TYPE",
    dataIndex: "rateType",
    sorter: true,
    align: "center",
    width: 90,
    ...getColumnSearchPropsPaging("rateType", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderText(text, searchedColumn, searchText, "rateType"),
  },
  // 14. RATE DATE
  {
    title: "RATE DATE",
    dataIndex: "rateDate",
    sorter: true,
    align: "center",
    width: 110,
    ...getColumnSearchPropsPaging("rateDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"),
    render: (text) => renderDate(text, searchedColumn, searchText, "rateDate", dateFormatting.date),
  },
  // 15. RATE
  {
    title: "RATE",
    dataIndex: "rateAmount",
    align: "right",
    sorter: true,
    width: 90,
    ...getColumnSearchPropsPaging("rateAmount", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderAmount(text, searchedColumn, searchText, "rateAmount"),
  },
  // 16. EQV ALLOCATION AMOUNT
  {
    title: "EQV ALLOCATION AMOUNT",
    dataIndex: "equivalentAmount",
    align: "right",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging("equivalentAmount", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderAmount(text, searchedColumn, searchText, "equivalentAmount"),
  },
  // 17. ACCOUNTING DATE
  {
    title: "ACCOUNTING DATE",
    dataIndex: "accountingDate",
    sorter: true,
    align: "center",
    width: 150,
    ...getColumnSearchPropsPaging("accountingDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"),
    render: (text) => renderDate(text, searchedColumn, searchText, "accountingDate", dateFormatting.dateTime),
  },
  // 18. BILLING PERIOD
  {
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    key: "billingPeriod2",
    sorter: true,
    align: "center",
    width: 110,
    ...getColumnSearchPropsPaging("billingPeriod", searchInput, searchedColumn, searchText, handleSearch, true, "datePeriod"),
    render: (text) =>
      text ? moment(text).format(dateFormatting.datePeriod) : "",
  },
  // 19. ALLOCATION STATUS — fixed right
  {
    title: "ALLOCATION STATUS",
    dataIndex: "allocationStatus",
    sorter: true,
    align: "center",
    width: 150,
    fixed: "right",
    ...getColumnSearchPropsPaging("allocationStatus", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => {
      if (searchedColumn === "allocationStatus") {
        return (
          <Tooltip placement="topLeft" title={text}>
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          </Tooltip>
        );
      }
      if (text) {
        return (
          <div className="flex justify-center">
            <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
          </div>
        );
      }
      return "";
    },
  },
  // 20. ACTION — fixed right
  {
    title: "ACTION",
    dataIndex: "action",
    align: "center",
    width: 70,
    fixed: "right",
    render: (_text, record) => {
      if (editingKey === record.key) {
        return (
          <div className="flex justify-center gap-2">
            <Tooltip title="Save">
              <button onClick={() => handleSave(record.key)} className="text-blue-600">
                <StatusComponent colour="Paid">Save</StatusComponent>
              </button>
            </Tooltip>
            <Tooltip title="Cancel">
              <button onClick={() => handleCancel()} className="text-red-600 ml-2">
                <StatusComponent colour="Rejected">Cancel</StatusComponent>
              </button>
            </Tooltip>
          </div>
        );
      }

      const menu = (
        <Menu className="min-w-[120px] rounded-lg shadow-md py-1">
          {!record.allocationNumber && (
            <Menu.Item key="delete" onClick={() => handleDelete(record.key)}>
              <div className="flex items-center gap-2 px-1">
                <SVGIcon name="IconDelete" width={18} color="#BE3036" />
                <span className="text-[#BE3036] text-[14px]">Delete</span>
              </div>
            </Menu.Item>
          )}
          {!record.allocationNumber && (
            <Menu.Item key="update" onClick={() => handleEdit(record)}>
              <div className="flex items-center gap-2 px-1">
                <SVGIcon name="IconEdit" width={18} color="#000000" />
                <span className="text-[#000000] text-[14px]">Update</span>
              </div>
            </Menu.Item>
          )}
          {record.allocationNumber && (
            <Menu.Item key="reverse" onClick={() => handleReverse(record)}>
              <div className="flex items-center gap-2 px-1">
                <SVGIcon name="IconRevers" width={18} color="#000000" />
                <span className="text-[#000000] text-[14px]">Reverse</span>
              </div>
            </Menu.Item>
          )}
        </Menu>
      );

      return (
        <div className="flex justify-center cursor-pointer">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <div className="text-blue-500 text-xl font-bold flex items-center justify-center p-1">⋮</div>
          </Dropdown>
        </div>
      );
    },
  },
];

export const columnAllocation = columnsAllocation;
