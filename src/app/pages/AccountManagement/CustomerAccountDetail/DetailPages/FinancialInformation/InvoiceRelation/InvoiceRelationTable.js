import TablePagination from "../../../../../../../components/TablePagination";
import { Badge, Button, Checkbox, Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../../utils";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { Link, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { CheckOutlined, DownloadOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import Toolbar from "../../../../../../../components/Toolbar";
import TablePaginationNew from "../../../../../../../components/TablePaginationNew";

const InvoiceRelationTable = ({
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
  handleInactiveModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleIsApproval = () => {},
  handleDownload = () => {},
  tempFilters = [],
  setShowFilterModal = () => {},
  setIsApproval = () => {},
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "NO",
      width: 100,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "relatedAccountName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("relatedAccountName"),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "relatedAccountNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("relatedAccountNumber"),
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      width: 150,
      align: "center",
      sorter: true,
      ...getColumnSearchProps("priority"),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 200,
      align: "center",
      ...getColumnSearchProps("startDate", "date"),
      render: (startDate) => moment(startDate, "DD-MM-YYYY").format(dateFormatting.date),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 200,
      align: "center",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => endDate ? moment(endDate, "DD-MM-YYYY").format(dateFormatting.date) : "",
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 200,
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
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      sorter: true,
      fixed: "right",
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
        <Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_INVOICE_RELATION} state={{
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
          <Link to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_INVOICE_RELATION} state={{
            idIr: r.id,
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
          <Button
            type="text"
            style={{ padding: 0, height: 'auto', border: 'none' }}
            onClick={() => navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_INVOICE_RELATION, { state: {
              idIr: r.id,
              idAccount,
              idCustomer,
            }})}
            disabled={r.statusApproval === "WAITING_APPROVAL" || r.status === "INACTIVE" || r.status === "ACTIVE"}
          >
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconUpdateAction"
                  color={"#0075bf"}
                  width={24}
                />
              </div>
            </Tooltip>
          </Button>
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
              onClick={() => handleInactiveModal(true, r?.id, r?.appHierId, r?.relatedAccountNumber)}
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
      {isApproval ? (
        <div className="flex justify-end gap-5 mb-5">
          <ButtonComponent
            type="reject"
            onClick={() => setIsApproval(false)}
          >
            Cancel
          </ButtonComponent>
        </div>
      ) : (
        <div className="flex justify-between items-center gap-5 mb-5">
          <Badge count={tempFilters.length}>
            <ButtonComponent
              type={"submit"}
              onClick={() => setShowFilterModal(true)}
              icon={
                <FilterOutlined
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
                width: "128px",
                height: "48px",
                borderRadius: "5px"
              }}
            >
              Filters
            </ButtonComponent>
          </Badge>
          <Toolbar items={itemActions} type="detail" />
        </div>
      )}
      <TablePaginationNew
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChangeSize}
        tableScrolled={{ y: 400, x: data.length ? "max-content" : "100%" }}
        onSort={onSort}
        columns={[
          ...columns,
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

export default InvoiceRelationTable;
