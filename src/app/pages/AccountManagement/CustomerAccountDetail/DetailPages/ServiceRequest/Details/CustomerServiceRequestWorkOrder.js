import { Fragment } from "react"

import TablePagination from "../../../../../../../components/TablePagination";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import BaseContainer from "../../../../../../../components/BaseContainer";

import {
  PlusOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined
} from "@ant-design/icons";
import { Tooltip, Tag } from "antd";

const CustomerServiceRequestWorkOrder = ({
  data = [],
  data_detail,
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
  handleSearch,
  id,
  idAccount,
  idCustomer,
  accountType,
  data_accountDetail,
  data_customerDetail,
}) => {
  // Updated dummy data based on the HTML structure
  const dummyData = [
    {
      id: "1",
      no: "1",
      workOrderNumber: "ORD20240000001",
      type: "Field Service",
      category: "Terminate",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "Open"
    },
    {
      id: "2",
      no: "2",
      workOrderNumber: "ORD20240000001",
      type: "Gas In",
      category: "Gas In",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "On Hold"
    },
    {
      id: "3",
      no: "3",
      workOrderNumber: "ORD20240000001",
      type: "Suspend",
      category: "Suspend",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "In Progress"
    },
    {
      id: "4",
      no: "4",
      workOrderNumber: "ORD20240000001",
      type: "Meter Replacement",
      category: "Meter Replacement",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "Close"
    },
    {
      id: "5",
      no: "5",
      workOrderNumber: "ORD20240000001",
      type: "Suspend",
      category: "Suspend",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "Cancel"
    },
    {
      id: "6",
      no: "6",
      workOrderNumber: "ORD20240000001",
      type: "Terminate",
      category: "Terminate",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "Close"
    },
    {
      id: "7",
      no: "7",
      workOrderNumber: "ORD20240000001",
      type: "Terminate",
      category: "Terminate",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "In Progress"
    },
    {
      id: "8",
      no: "8",
      workOrderNumber: "ORD20240000001",
      type: "Suspend",
      category: "Suspend",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "On Hold"
    },
    {
      id: "9",
      no: "9",
      workOrderNumber: "ORD20240000001",
      type: "Terminate",
      category: "Terminate",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "Close"
    },
    {
      id: "10",
      no: "10",
      workOrderNumber: "ORD20240000001",
      type: "Terminate",
      category: "Terminate",
      openDate: "22 Jan 2022 12:55:34",
      closedDate: "22 Jan 2022 12:55:34",
      completionPlanDate: "12 Aug 2022",
      completionActualDate: "12 Aug 2022",
      completionRemark: "Test description",
      status: "In Progress"
    }
  ];

  const apiData = data_detail?.workOrders;
  const tableData = (Array.isArray(apiData) && apiData.length > 0)
    ? apiData
    : (Array.isArray(data) && data.length > 0) ? data : dummyData;

  // Sanitize pagination values to prevent NaN
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;
  const sanitizedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const sanitizedTotalElement = Number(totalElement) > 0 ? Number(totalElement) : tableData.length;

  const handleViewFile = (fileData) => {
    // Placeholder for view file action
    console.log("View file:", fileData);
    // Add your file viewing logic here
  };

  const handleEdit = (record) => {
    // Placeholder for edit action
    console.log("Edit record:", record);
    // Add your edit logic here
  };

  const handleCreate = () => {
    // Placeholder for create action
    console.log("Create new work order");
    // Add your create logic here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "#0d9488"; // teal-600
      case "On Hold":
        return "#f59e0b"; // amber-400
      case "In Progress":
        return "#84cc16"; // lime-400
      case "Close":
        return "#ef4444"; // red-500
      case "Cancel":
        return "#52525b"; // zinc-600
      default:
        return "#a1a1aa"; // zinc-400
    }
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case "Open":
        return "success";
      case "On Hold":
        return "warning";
      case "In Progress":
        return "processing";
      case "Close":
        return "error";
      case "Cancel":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "NO",
      dataIndex: "no",
      width: 80,
      align: "center",
      sorter: true,
    },
    {
      title: "WORK ORDER NUMBER",
      dataIndex: "workOrderNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("workOrderNumber"),
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
      width: 150,
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "OPEN DATE",
      dataIndex: "openDate",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("openDate"),
    },
    {
      title: "CLOSED DATE",
      dataIndex: "closedDate",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("closedDate"),
    },
    {
      title: "COMPLETION PLAN DATE",
      dataIndex: "completionPlanDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("completionPlanDate"),
    },
    {
      title: "COMPLETION ACTUAL DATE",
      dataIndex: "completionActualDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("completionActualDate"),
    },
    {
      title: "COMPLETION REMARK",
      dataIndex: "completionRemark",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("completionRemark"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      align: "center",
      sorter: true,
      render: (status) => (
        <Tag 
          color={getStatusTagColor(status)}
          style={{
            backgroundColor: getStatusColor(status),
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "2px 8px",
            fontSize: "12px",
            minWidth: "80px",
            textAlign: "center"
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (record) => {
        const hasActions = record.status === "Open" || record.status === "In Progress" || record.status === "On Hold";
        
        return (
          <div className="flex w-full justify-center gap-2">
            <Tooltip title="View">
              <div className="cursor-pointer p-1">
                <EyeOutlined 
                  style={{ color: "#0075bf", fontSize: "16px" }}
                  onClick={() => handleViewFile(record)}
                />
              </div>
            </Tooltip>
            
            {hasActions && (
              <>
                <Tooltip title="Edit">
                  <div className="cursor-pointer p-1">
                    <EditOutlined 
                      style={{ color: "#0075bf", fontSize: "16px" }}
                      onClick={() => handleEdit(record)}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="More">
                  <div className="cursor-pointer p-1">
                    <MoreOutlined 
                      style={{ color: "#0075bf", fontSize: "16px" }}
                    />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return(
    <Fragment>
      <BaseContainer header={"WORK ORDER INFORMATION"} >
        <div className="mb-5 flex items-center justify-between">
          {/* Left Side Buttons Group */}
          <div className="flex items-center gap-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => {/* trigger filter */}}
              icon={<FilterOutlined className="text-2xl" />}
            >
              Filter
            </ButtonComponent>
          </div>

          {/* Right Side Buttons Group */}
          <div className="flex items-center gap-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => {/* trigger download list */}}
              icon={<DownloadOutlined className="text-2xl" />}
            >
              Download List
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              onClick={handleCreate}
              icon={<PlusOutlined className="text-2xl" />}
            >
              Create
            </ButtonComponent>
          </div>
        </div>

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
          tableScrolled={{ y: 525, x: 2000 }}
          onSort={onSort}
          columns={columns}
        />
      </BaseContainer>
    </Fragment>
  )
}

export default CustomerServiceRequestWorkOrder
