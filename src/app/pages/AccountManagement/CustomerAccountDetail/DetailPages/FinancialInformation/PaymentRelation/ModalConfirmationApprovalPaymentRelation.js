import { useState } from "react";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../../utils";
import StatusComponent from "../../../../../../../components/StatusComponent";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
// import TablePaginationNew from "../../../../../../../components/TablePaginationNew";
import { TablePaginationNew } from "poc-table-dragandrop";

const ModalConfirmationApprovalPaymentRelation = ({
  dataSource,
  isOpen,
  handleCloseModal,
  onFinish,
  getColumnSearchProps,
  approveOrReject,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const columns = [
    {
      title: "NO",
      dataIndex: "no",
      width: 50,
      align: "center",
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "relatedAccountNumber",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("relatedAccountNumber"),
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      width: 100,
      sorter: true,
      ...getColumnSearchProps("priority"),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 150,
      align: "center",
      ...getColumnSearchProps("startDate", "date"),
      render: (startDate) => moment(startDate).format(dateFormatting.date),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 150,
      align: "center",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => moment(endDate).format(dateFormatting.date),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 100,
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
      sorter: true,
      fixed: "right",
      width: 100,
      ...getColumnSearchProps("status"),
      render: (status) => {
        const displayText = {
          "active": "Active",
          "inactive": "inactive",
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

  return (
    <ModalApproveOrReject
      isOpen={isOpen}
      handleCloseModal={handleCloseModal}
      onFinish={onFinish}
      width={1000}
      approveOrReject={approveOrReject}
      customMessage={"Are you sure you want to approve selected data?"}
      header={"CONFIRMATION"}
    >
      {/* <TablePaginationNew
        dataSource={dataSource}
        totalData={dataSource.length}
        columns={columns}
        onChange={handleChangeDetail}
        current={page}
        tableScrolled={{ y: 200, x: 1500 }}
        type="FE"
      /> */}
      <TablePaginationNew
        dataSource={dataSource.map((data, index) => ({
          ...data,
          no: (page - 1) * pageSize + index + 1,
        }))}
        onChange={handleChangeDetail}
        tableScrolled={{ y: 400, x: 2000 }}
        columns={columns}
        enableDragColumn={true}
        type="FE"
      />
    </ModalApproveOrReject>
  )
}

export default ModalConfirmationApprovalPaymentRelation;