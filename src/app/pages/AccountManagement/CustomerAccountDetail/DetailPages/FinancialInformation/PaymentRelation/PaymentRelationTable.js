import TablePagination from "../../../../../../../components/TablePagination";
import { Badge, Button, Checkbox, Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../../utils";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { Link } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import Toolbar from "../../../../../../../components/Toolbar";
import { CheckOutlined, DownloadOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";

const PaymentRelationTable = ({
  data = [],
  idAccount = 0,
  idCustomer = 0,
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  getColumnSearchProps = () => {},
  rowSelection,
  isApproval = false,
  handleInactivePrModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleIsApproval = () => {},
  handleDownload = () => {},
  tempFilters = [],
  setShowFilterModal = () => {},
}) => {
  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 120,
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      width: 50,
      sorter: true,
      ...getColumnSearchProps("priority"),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 90,
      align: "center",
      ...getColumnSearchProps("startDate", "date"),
      render: (startDate) => moment(startDate).format(dateFormatting.date),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 90,
      align: "center",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => moment(endDate).format(dateFormatting.date),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 70,
      sorter: true,
      align: "center",
      fixed: "right",
      ...getColumnSearchProps("statusApproval"),
      render: (status) => {
        const displayText = {
          "approved": "Approved",
          "waitingApproval": "Waiting Approval",
          "pending": "Pending",
          "rejected": "Rejected",
          "WAITING_APPROVAL": "Waiting Approval"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={status}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
      hidden: isApproval,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      fixed: "right",
      width: 50,
      ...getColumnSearchProps("status"),
      render: (status) => {
        const displayText = {
          "active": "Active",
          "inactive": "Inactive",
        };

        return (
          <div className={" flex justify-center"}>
            <StatusComponent colour={status}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        )
      },
    },
  ];

  const visibleColumns = columns.filter(column => !column.hidden);

  const itemActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          onClick={handleDownload}
          icon={
            <DownloadOutlined
              style={{
                color: "#fff",
                fontSize: 20,
              }}
            />
          }
          style={{
            backgroundColor: "#0075bf",
            color: "#fff",
            borderColor: "#0075bf",
            border: "1px solid #0075bf",
            borderRadius: "5px",
            height: "48px"
          }}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: "Approve",
      render: (
        <ButtonComponent
          type={"submit"}
          onClick={() => handleIsApproval(true)}
          icon={
            <CheckOutlined
              style={{
                color: "#fff",
                fontSize: 20,
              }}
            />
          }
          style={{
            backgroundColor: "#0075bf",
            color: "#fff",
            borderColor: "#0075bf",
            border: "1px solid #0075bf",
            borderRadius: "5px",
            height: "48px"
          }}
        >
          Approval
        </ButtonComponent>
      )
    },
    {
      action: "Create",
      render: (
        <Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_PAYMENT_RELATION} state={{
          idAccount,
          idCustomer,
        }}>
          <ButtonComponent
            type={"submit"}
            icon={
              <PlusOutlined
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              />
            }
            style={{
              backgroundColor: "#0075bf",
              color: "#fff",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              borderRadius: "5px",
              height: "48px"
            }}
          >
            Create
          </ButtonComponent>
        </Link>
      )
    },
    {
      action: 'View',
      type: 'table',
      render: (r, data_length) => {
        return (
          <Link to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION} state={{
            idPr: r.id,
            idAccount,
            idCustomer,
          }}>
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={24}
                />
              </div>
            </Tooltip>
          </Link>
        )
      }
    },
    {
      action: 'Update',
      type: 'table',
      render: (r, data_length) => {
        return (
          <Link to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PAYMENT_RELATION} state={{
            idPr: r.id,
            idAccount,
            idCustomer,
          }}>
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconUpdateAction"
                  color={"#0075bf"}
                  width={24}
                />
              </div>
            </Tooltip>
          </Link>
        )
      }
    },
    {
      action: 'Inactivate',
      type: 'table',
      render: (r, data_length) => {
        return (
          <Tooltip
            title="Inactivate"
          >
            <Checkbox
              className="inactive-check"
              disabled={r?.status === "ACTIVE" ? false : true}
              checked={r?.status === "ACTIVE" ? false : true}
              onClick={() => handleInactivePrModal(true, r?.id, r?.appHierId)}
            />
          </Tooltip>
        )
      }
    },
    {
      action: 'History',
      type: 'table',
      render: (r, data_length) => {
        return (
          <Tooltip title="History">
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
                onClick={() => handleApprovalHistoryModal(true, r?.id)}
              />
            </div>
          </Tooltip>
        )
      }
    }
  ];

  return (
    <div className="flex flex-col gap-y-6">
      {!isApproval && (
        <div className="flex justify-between items-center gap-5 mb-5">
          <Badge count={tempFilters.length}>
            <Button onClick={() => setShowFilterModal(true)}>
              Advanced Filter
            </Button>
          </Badge>
          <Toolbar items={itemActions} type="detail" />
        </div>
      )}
      <TablePagination
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 400, x: 2000 }}
        onSort={onSort}
        columns={[
          ...visibleColumns,
          ...useColumnActionPermission(
            ["Inactivate", "View", "Update", "History"],
            itemActions,
            "View",
            "detail"
          )
        ]}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default PaymentRelationTable;
