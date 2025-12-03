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

const CustomerServiceRequestList = ({
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
  // State
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});

  // Dummy data
  const dummyData = [
    {
      id: "SR001",
      type: "Service Request",
      category: "Installation",
      priority: "High",
      createdDate: "2025-10-20",
      statusApproval: "approved",
      status: "active"
    },
    {
      id: "SR002",
      type: "Maintenance",
      category: "Repair",
      priority: "Medium",
      createdDate: "2025-10-18",
      statusApproval: "pending",
      status: "pending"
    },
    {
      id: "SR003",
      type: "Complaint",
      category: "Quality",
      priority: "High",
      createdDate: "2025-10-15",
      statusApproval: "rejected",
      status: "inactive"
    },
    {
      id: "SR004",
      type: "Service Request",
      category: "Upgrade",
      priority: "Low",
      createdDate: "2025-10-10",
      statusApproval: "approved",
      status: "active"
    },
    {
      id: "SR005",
      type: "Maintenance",
      category: "Inspection",
      priority: "Medium",
      createdDate: "2025-10-08",
      statusApproval: "approved",
      status: "active"
    }
  ];
  // nav
  const navigate = useNavigate();

  // Use dummy data if no data provided
  const tableData = (Array.isArray(data) && data.length > 0) ? data : dummyData;

  // Sanitize pagination values to prevent NaN
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;
  const sanitizedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const sanitizedTotalElement = Number(totalElement) > 0 ? Number(totalElement) : tableData.length;

  const handleDetail = (value) => {
    setDataDetail(value);
  };

  const renderDate = (date) => {
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
      title: "ID",
      dataIndex: "id",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("id"),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("type"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("priority"),
      render: (priority) => {
        const colorMap = {
          "High": "red",
          "Medium": "orange",
          "Low": "green"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[priority] || "gray"}>
              {priority || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "CREATED DATE",
      dataIndex: "createdDate",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("createdDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 180,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("statusApproval"),
      render: (status) => {
        const colorMap = {
          "approved": "green",
          "pending": "orange",
          "rejected": "red"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[status] || "gray"}>
              {toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 150,
      fixed: "right",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("status"),
      render: (status) => (
        <div className="flex justify-center">
          <StatusComponent colour={String(status || "gray")}>
            {toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Detail">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    navigate("/account-management/customers/view/service-requests/details");
                    // handleDetail(r);
                    // setModalDetail(true);
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
        tableScrolled={{ y: 525, x: 1500 }}
        onSort={onSort}
        columns={columns}
      />

      {/* Detail Modal */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Service Request Detail"
        width={800}
        handleCancel={() => {
          setModalDetail(false);
        }}
        footer={
          <div className="w-full flex justify-end">
            <ButtonComponent
              type="default"
              onClick={() => {
                setModalDetail(false);
              }}
            >
              Back
            </ButtonComponent>
          </div>
        }
      >
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">ID:</label>
              <p>{dataDetail?.id || "-"}</p>
            </div>
            <div>
              <label className="font-semibold">Type:</label>
              <p>{dataDetail?.type || "-"}</p>
            </div>
            <div>
              <label className="font-semibold">Category:</label>
              <p>{dataDetail?.category || "-"}</p>
            </div>
            <div>
              <label className="font-semibold">Priority:</label>
              <p>{dataDetail?.priority || "-"}</p>
            </div>
            <div>
              <label className="font-semibold">Created Date:</label>
              <p>{renderDate(dataDetail?.createdDate) || "-"}</p>
            </div>
            <div>
              <label className="font-semibold">Status Approval:</label>
              <p>{toTitleCase(String(dataDetail?.statusApproval || "")) || "-"}</p>
            </div>
            <div>
              <label className="font-semibold">Status:</label>
              <p>{toTitleCase(String(dataDetail?.status || "")) || "-"}</p>
            </div>
          </div>
        </div>
      </ModalCustom>
    </Fragment>
  );
};

export default CustomerServiceRequestList;
