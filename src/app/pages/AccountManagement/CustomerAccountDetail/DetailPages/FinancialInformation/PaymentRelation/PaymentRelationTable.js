import React, { useEffect, useRef } from "react";
import TablePagination from "../../../../../../../components/TablePagination";
import { Fragment } from "react";
import Highlighter from "react-highlight-words";
import { Checkbox, Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../../utils";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { Link } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";

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
      dataIndex: "priorty",
      width: 100,
      sorter: true,
      ...getColumnSearchProps("priorty"),
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
    {
      title: "ACTION",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-x-4">
            {/* {!isApproval && (
              <Tooltip>
                <div className="pt-1">
                  <SVGIcon
                    name="IconActionDropdown"
                    color={"#0075bf"}
                    width={24}
                    onClick={() => {}}
                  />
                </div>
              </Tooltip>
            )} */}
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
            {
              // isApproval &&
              (
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
            {
              !isApproval && (
                <>
                  <Tooltip
                    title="Inactive"
                  >
                    <Checkbox
                      className="inactive-check"
                      disabled={r?.status === "ACTIVE" ? false : true}
                      checked={r?.status === "ACTIVE" ? false : true}
                      onClick={() => handleInactivePrModal(true, r?.id, r?.appHierId)}
                    />
                  </Tooltip>
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
                </>
              )
            }
          </div>
        );
      },
    },
  ];

  const visibleColumns = columns.filter(column => !column.hidden)

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 400, x: 2000 }}
        onSort={onSort}
        columns={visibleColumns}
        rowSelection={rowSelection}
      />
    </Fragment>
  );
};

export default PaymentRelationTable;
