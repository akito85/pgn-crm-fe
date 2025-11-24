import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "antd";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import StatusComponent from "../../../../../../components/StatusComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { toTitleCase } from "../../../../../../utils";

const CustomerTable = ({
  data = [],
  handleChange = () => {},
  handleChangeSize = () => {},
  totalElement = 0,
  page = 1,
  pageSize = 10,
  searchText = "",
  searchedColumn = "",
  onSort = () => {},
  getColumnSearchProps = () => {},
  searchInput,
  handleSearch
}) => {
  // nav
  const navigate = useNavigate();

  // Use dummy data if no data provided
  const tableData = (Array.isArray(data) && data.length > 0) ? data : dummyData;

  // Sanitize pagination values to prevent NaN
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;
  const sanitizedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const sanitizedTotalElement = Number(totalElement) > 0 ? Number(totalElement) : tableData.length;


  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY HH:mm:ss");
    }
    return "";
  };

  const renderSimpleDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    }
    return "";
  };

  const columns = [
    {
      title: "NO",
      width: 80,
      align: "center",
      render: (text, object, index) => (sanitizedPage - 1) * sanitizedPageSize + index + 1,
    },
    {
      title: "SERVICE REQUEST NUMBER",
      dataIndex: "serviceRequestNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("serviceRequestNumber"),
    },
    {
      title: "SERVICE REQUEST REFERENCE",
      dataIndex: "serviceRequestReference",
      width: 220,
      sorter: true,
      ...getColumnSearchProps("serviceRequestReference"),
      render: (reference) => (
        <span className="underline cursor-pointer text-blue-600">
          {reference || "-"}
        </span>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("type"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 160,
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "SUB CATEGORY",
      dataIndex: "subCategory",
      width: 160,
      sorter: true,
      ...getColumnSearchProps("subCategory"),
    },
    {
      title: "CHANNEL",
      dataIndex: "channel",
      width: 140,
      sorter: true,
      ...getColumnSearchProps("channel"),
    },
    {
      title: "REQUEST SOURCE",
      dataIndex: "requestSource",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("requestSource"),
    },
    {
      title: "REQUEST DATE",
      dataIndex: "requestDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("requestDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "OPEN DATE",
      dataIndex: "openDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("openDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "RESOLVED DATE",
      dataIndex: "resolvedDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("resolvedDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "CLOSED DATE",
      dataIndex: "closedDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("closedDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "AGE (HOUR)",
      dataIndex: "age",
      width: 120,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("age"),
      render: (age) => age || "0",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("description"),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 160,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("statusApproval"),
      render: (status) => {
        const colorMap = {
          "approved": "green",
          "waitingApproval": "orange",
          "pending": "orange",
          "rejected": "red"
        };
        const displayText = {
          "approved": "Approved",
          "waitingApproval": "Waiting Approval",
          "pending": "Pending",
          "rejected": "Rejected"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[status] || "gray"}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS PRE-REQUISITE",
      dataIndex: "statusPrerequisite",
      width: 180,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("statusPrerequisite"),
      render: (status) => {
        const colorMap = {
          "completed": "green",
          "pending": "red",
          "none": "blue"
        };
        const displayText = {
          "completed": "Completed",
          "pending": "Pending",
          "none": "None"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[status] || "gray"}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 140,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("status"),
      render: (status) => {
        const colorMap = {
          "inProgress": "blue",
          "onHold": "orange",
          "closed": "red",
          "canceled": "gray",
          "open": "green",
          "active": "green",
          "pending": "orange"
        };
        const displayText = {
          "inProgress": "In Progress",
          "onHold": "On Hold",
          "closed": "Closed",
          "canceled": "Canceled",
          "open": "Open"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[status] || "gray"}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Detail">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => {
                    navigate("/account-management/account-standard/service-requests/details");
                    // handleDetail(r);
                    // setModalDetail(true);
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="Update">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconEdit"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => {
                    // Handle update action
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <TablePagination
        dataSource={tableData.map((item, idx) => ({
          ...item,
          key: item.id || idx,
        }))}
        totalData={sanitizedTotalElement}
        current={sanitizedPage}
        pageSize={sanitizedPageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 3000 }}
        onSort={onSort}
        columns={columns}
      />
    </Fragment>
  );
};

export default CustomerTable;
