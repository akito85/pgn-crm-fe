import { useEffect, useState } from "react";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../utils";
import StatusComponent from "../../../../../../components/StatusComponent";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
// import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { TablePaginationNew } from "poc-table-dragandrop";

const ModalConfirmationApprovalMultiDestination = ({
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
      title: "MULTI DESTINATION",
      dataIndex: "id",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("id"),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "identificationType",
      width: 250,
      align: "center",
      ...getColumnSearchProps("identificationType"),
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      width: 250,
      align: "center",
      ...getColumnSearchProps("customerIdentificationNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 250,
      align: "center",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      width: 250,
      align: "center",
      ...getColumnSearchProps("customerType"),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 250,
      align: "center",
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 250,
      align: "center",
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 250,
      align: "center",
      ...getColumnSearchProps("category"),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      width: 250,
      align: "center",
      ...getColumnSearchProps("sor"),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 250,
      align: "center",
      ...getColumnSearchProps("costCenter"),
    },
    {
      title: "METER READING CODES",
      dataIndex: "meterReadingCodes",
      width: 250,
      align: "center",
      ...getColumnSearchProps("meterReadingCodes"),
    },
    {
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      width: 250,
      align: "center",
      ...getColumnSearchProps("customerManagement"),
    },
    {
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      width: 250,
      align: "center",
      ...getColumnSearchProps("classificationType"),
    },
    {
      title: "SEGMENT",
      dataIndex: "segment",
      width: 250,
      align: "center",
      ...getColumnSearchProps("segment"),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 250,
      align: "center",
      ...getColumnSearchProps("accountGroupType"),
    },
    {
      title: "PREMISE ADDRESS",
      dataIndex: "premiseAddress",
      width: 250,
      align: "center",
      ...getColumnSearchProps("premiseAddress"),
    },
    {
      title: "SUBDISTRICT",
      dataIndex: "subdistrict",
      width: 250,
      align: "center",
      ...getColumnSearchProps("subdistrict"),
    },
    {
      title: "DISTRICT",
      dataIndex: "district",
      width: 250,
      align: "center",
      ...getColumnSearchProps("district"),
    },
    {
      title: "CITY",
      dataIndex: "city",
      width: 250,
      align: "center",
      ...getColumnSearchProps("city"),
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      width: 250,
      align: "center",
      ...getColumnSearchProps("country"),
    },
    {
      title: "LONGITUDE",
      dataIndex: "longitude",
      width: 250,
      align: "center",
      ...getColumnSearchProps("longitude"),
    },
    {
      title: "LATITUDE",
      dataIndex: "latitude",
      width: 250,
      align: "center",
      ...getColumnSearchProps("latitude"),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 250,
      align: "center",
      ...getColumnSearchProps("startDate", "date"),
      render: (startDate) => startDate ? moment(startDate, "DD-MM-YYYY").format(dateFormatting.date) : "",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 250,
      align: "center",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => endDate ? moment(endDate, "DD-MM-YYYY").format(dateFormatting.date) : "",
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

export default ModalConfirmationApprovalMultiDestination;