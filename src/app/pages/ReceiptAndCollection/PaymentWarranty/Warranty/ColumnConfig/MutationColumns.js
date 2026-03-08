import moment from "moment";
import { Tooltip, Popover, Space } from "antd";
import { dateFormatting, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { MoreOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";

export const columnMutation = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search = {},
  handleEdit = () => {},
  handleDelete = () => {},
  handleHistory = () => {},
  isCreate = false,
  disabled = false,
  isApprover = false
) => {
  const columns = [
    {
      key: "no",
      title: "NO",
      isClassification: true,
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "mutationNumber",
      title: "REFF. DOCUMENT NUMBER",
      dataIndex: "mutationNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("mutationNumber", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => text || record.documentNumber || "",
    },
    {
      key: "source",
      title: "SOURCE",
      dataIndex: "source",
      sorter: true,
      ...getColumnSearchPropsPaging("source", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => text || record?.payWarranty?.documentNumber || "",
    },
    {
      key: "type",
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      ...getColumnSearchPropsPaging("type", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => text || record?.warrantyTranstype?.warrantyTranstypeName || "",
    },
    {
      key: "category",
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      ...getColumnSearchPropsPaging("category", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => record?.category || "",
    },
    {
      key: "date",
      title: "DATE",
      dataIndex: "date",
      sorter: true,
      render: (text, record) => {
        const date = text || record.transactionDate || record.createdDate;
        return date ? moment(date).format("DD MMM YY") : "";
      },
    },
    {
      key: "amount",
      title: "AMOUNT",
      dataIndex: "amount",
      align: "right",
      sorter: true,
      render: (text, record) => {
        const currency = record.currency || record.currencyName;
        return (currency ? `${currency} ` : "") + text?.toLocaleString();
      }
    },
    {
      key: "convertedCurrency",
      title: "CONVERTED CURRENCY",
      dataIndex: "convertedCurrencyName",
      sorter: true,
      ...getColumnSearchPropsPaging("convertedCurrencyName", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => text || record.currency || "",
    },
    {
      key: "rate",
      title: "RATE",
      dataIndex: "rate",
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString(),
    },
    {
      key: "equivalentAmount",
      title: "EQV AMOUNT",
      dataIndex: "eqvAmount",
      align: "right",
      sorter: true,
      render: (text, record) => {
        const val = text || record.equivalentAmount;
        const currency = record.currency || record.currencyName;
        return (currency ? `${currency} ` : "") + val?.toLocaleString();
      }
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      ...getColumnSearchPropsPaging("description", searchInput, searchedColumn, searchText, handleSearch),
    },
  ];

  if (!isCreate) {
    columns.push(
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 150,
        fixed: "right",
        render: (text) => renderColumn("status", searchedColumn, searchText, text, false, "status", search),
      },
      {
        key: "statusApproval",
        title: "STATUS APPROVAL",
        dataIndex: "approvalStatus",
        width: 150,
        fixed: "right",
        render: (text) => renderColumn("statusApproval", searchedColumn, searchText, text, false, "status", search),
      }
    );
  }

  if (!disabled && !isApprover) {
    columns.push({
      title: "ACTION",
      key: "action",
      align: "center",
      fixed: "right",
      width: 120,
      render: (record) => {
        const isPending = record.approvalStatus === "Waiting Approval";
        const isInactive = record.status === "Inactive";
        const isDisabled = isPending || isInactive;
        const tooltipEdit = isPending ? "Waiting Approval" : isInactive ? "Inactive" : "Update";
        const tooltipDelete = isPending ? "Waiting Approval" : isInactive ? "Inactive" : "Delete";

        return (
          <div className="w-full flex justify-center items-center py-1 gap-2">
            <Tooltip title={isDisabled ? tooltipEdit : "Update"}>
              <div
                className={isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                onClick={() => !isDisabled && handleEdit(record)}
              >
                <SVGIcon name="IconEdit" width={18} color="#ACC424" />
              </div>
            </Tooltip>
            <Tooltip title={isDisabled ? tooltipDelete : "Delete"}>
              <div
                className={isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                onClick={() => !isDisabled && handleDelete(record)}
              >
                <SVGIcon name="IconDelete" width={18} color="#D90000" />
              </div>
            </Tooltip>
            {!isCreate && (
              <Popover
                trigger="click"
                placement="bottomRight"
                content={
                  <Space direction="vertical" style={{ width: 150 }}>
                    <div 
                      className="cursor-pointer flex items-center gap-2 p-1 hover:bg-gray-100"
                      onClick={() => handleHistory(record)}
                    >
                      <SVGIcon name="IconLogHistory" width={20} color="#000000" />
                      <span className="text-sm">Approval History</span>
                    </div>
                    <div className="cursor-pointer flex items-center gap-2 p-1 hover:bg-gray-100">
                      <SVGIcon name="IconHold" width={20} color="#000000" />
                      <span className="text-sm">Hold</span>
                    </div>
                    <div className="cursor-pointer flex items-center gap-2 p-1 hover:bg-gray-100">
                      <SVGIcon name="IconRefund" width={20} color="#000000" />
                      <span className="text-sm">Refund</span>
                    </div>
                  </Space>
                }
              >
                <div>
                  <MoreOutlined
                    style={{
                      fontSize: "20px",
                      color: "#0075bf",
                      cursor: "pointer",
                      transform: "rotate(90deg)",
                    }}
                  />
                </div>
              </Popover>
            )}
          </div>
        );
      },
    });
  }

  return columns;
};
