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
  search = {}
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
      key: "reffDocumentNumber",
      title: "REFF. DOCUMENT NUMBER",
      dataIndex: "reffDocumentNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("reffDocumentNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      key: "source",
      title: "SOURCE",
      dataIndex: "source",
      sorter: true,
      ...getColumnSearchPropsPaging("source", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      key: "type",
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      ...getColumnSearchPropsPaging("type", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      key: "category",
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      ...getColumnSearchPropsPaging("category", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      key: "date",
      title: "DATE",
      dataIndex: "date",
      sorter: true,
      render: (text) => (text ? moment(text).format("DD MMM YY") : ""),
    },
    {
      key: "amount",
      title: "AMOUNT",
      dataIndex: "amount",
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString(),
    },
    {
      key: "convertedCurrency",
      title: "CONVERTED CURRENCY",
      dataIndex: "convertedCurrency",
      sorter: true,
      ...getColumnSearchPropsPaging("convertedCurrency", searchInput, searchedColumn, searchText, handleSearch),
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
      render: (text) => text?.toLocaleString(),
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      ...getColumnSearchPropsPaging("description", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      key: "statusApproval",
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 150,
      fixed: "right",
      render: (text) => renderColumn("statusApproval", searchedColumn, searchText, text, false, "status", search),
    }
  ];

  columns.push({
    title: "ACTION",
    key: "action",
    align: "center",
    fixed: "right",
    width: 120,
    render: (record) => {
      const isDisabled = false; 
      
      return (
        <div className="w-full flex justify-center items-center py-1 gap-2">
            <Tooltip title="Update">
              <div 
                className={isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              >
                <SVGIcon name="IconEdit" width={18} color="#ACC424" />
              </div>
            </Tooltip>
            <Tooltip title="Delete">
              <div 
                className={isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              >
                <SVGIcon name="IconDelete" width={18} color="#D90000" />
              </div>
            </Tooltip>
            <Popover
              trigger="click"
              placement="bottomRight"
              content={
                <Space direction="vertical" style={{ width: 150 }}>
                  <div className="cursor-pointer flex items-center gap-2 p-1 hover:bg-gray-100">
                    <SVGIcon name="IconLogHistory" width={20} color="#000000" />
                    <span className="text-sm">Approval History</span>
                  </div>
                  <div className="cursor-pointer flex items-center gap-2 p-1 hover:bg-gray-100">
                    <span className="text-sm">Hold</span>
                  </div>
                  <div className="cursor-pointer flex items-center gap-2 p-1 hover:bg-gray-100">
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
                    transform: "rotate(90deg)"
                  }}
                />
              </div>
            </Popover>
        </div>
      );
    }
  });

  return columns;
};
