import moment from "moment";
import { Tooltip, Popover, Space } from "antd";
import { dateFormatting, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { MoreOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";
import { WARRANTY_STATUS, WARRANTY_APPROVAL_STATUS } from "../../../../../../constants/warranty";

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
  handleApprove = () => {},
  handleReject = () => {},
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
      key: "documentNumber",
      title: "REFF. DOCUMENT NUMBER",
      dataIndex: "documentNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("documentNumber", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => text || record.noDocumentMutation || record.mutationNumber || "",
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
      render: (text, record) => text || record?.type || "",
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
        return record.amount !== undefined && record.amount !== null ? record.amount.toLocaleString() : "";
      }
    },
    {
      key: "convertedCurrency",
      title: "CONVERTED CURRENCY",
      dataIndex: "convertedCurrency",
      sorter: true,
      ...getColumnSearchPropsPaging("convertedCurrency", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => record.convertedCurrencyName || record.currency || (typeof text === 'string' && isNaN(Number(text)) ? text : "") || "",
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
      dataIndex: "equivalentAmount",
      align: "right",
      sorter: true,
      render: (text, record) => {
        const val = record.equivalentAmount !== undefined ? record.equivalentAmount : record.eqvAmount;
        return val !== undefined && val !== null ? val.toLocaleString() : "";
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
    // ... existing logic for requester (Edit/Delete/More)
    columns.push({
      title: "ACTION",
      key: "action",
      align: "center",
      fixed: "right",
      width: 120,
      render: (record) => {
        const isLocal = !record.id;
        const isDraft = record.status === WARRANTY_STATUS.DRAFT;
        const isApprDraft = record.approvalStatus === WARRANTY_APPROVAL_STATUS.DRAFT;
        const isApprRejected = record.approvalStatus === WARRANTY_APPROVAL_STATUS.REJECTED;

        const canEditOrDelete = isLocal || (isDraft && (isApprDraft || isApprRejected));
        const isDisabled = !canEditOrDelete;
        
        const tooltipEdit = isDisabled ? "Update Not Allowed" : "Update";
        const tooltipDelete = isDisabled ? "Delete Not Allowed" : "Delete";

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

  if (isApprover) {
    columns.push({
      title: "ACTION",
      key: "action",
      align: "center",
      fixed: "right",
      width: 120,
      render: (record) => {
        if (!record.isApproval) return null;

        return (
          <div className="w-full flex justify-center items-center py-1 gap-4">
            <Tooltip title="Reject">
              <div
                className="cursor-pointer"
                onClick={() => handleReject(record)}
              >
                <SVGIcon name="IconReject" width={20} color="#D90000" />
              </div>
            </Tooltip>
            <Tooltip title="Approve">
              <div
                className="cursor-pointer"
                onClick={() => handleApprove(record)}
              >
                <SVGIcon name="IconApprove" width={20} color="#ACC424" />
              </div>
            </Tooltip>
          </div>
        );
      },
    });
  }

  return columns;
};
