import { useState, useEffect, useRef, Fragment } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"

import TablePagination from "../../../../../../../components/TablePagination";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../components/BaseContainer";
import NxDropdownMenu from "../../../../../../../components/Nx/NxDropdownMenu";

import { 
  CloseOutlined, 
  PauseCircleOutlined, 
  PlayCircleOutlined, 
  LockOutlined, 
  PlusOutlined, 
  CheckCircleOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined
} from "@ant-design/icons";
import { Tooltip, Tag } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";

import { USER_ROUTES } from "../../../../../../../routes/user_management/user_routes";

const CustomerServiceRequestPreRequisite = ({
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
  const [dataDetail, setDataDetail] = useState({});
  
  // Dummy data extracted from the HTML structure
  const dummyData = [
    {
      id: "1",
      no: "1",
      type: "Administrative",
      preRequisiteName: "Menerbitkan BBG",
      completionDate: "22 Jan 2024",
      reference: "",
      description: "Contoh description",
      status: "Pending"
    },
    {
      id: "2",
      no: "2",
      type: "Administrative",
      preRequisiteName: "Menerbitkan berita acara",
      completionDate: "22 Jan 2024",
      reference: "",
      description: "Contoh description",
      status: "Pending"
    },
    {
      id: "3",
      no: "3",
      type: "Point of Sales",
      preRequisiteName: "Biaya instalasi IDR 910,000.00",
      completionDate: "Biaya instalasi IDR 910,000.00",
      reference: "POS20240500000001",
      description: "Contoh description",
      status: "Completed"
    },
    {
      id: "4",
      no: "4",
      type: "Point of Sales",
      preRequisiteName: "Biaya instalasi IDR 910,000.00",
      completionDate: "Biaya instalasi IDR 910,000.00",
      reference: "POS20240500000001",
      description: "Contoh description",
      status: "Pending"
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "default";
      case "In Progress":
        return "processing";
      default:
        return "default";
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "Completed":
        return "#0d9488"; // teal-600
      case "Pending":
        return "#a1a1aa"; // zinc-400
      default:
        return "#a1a1aa";
    }
  };

  const itemActions = [
    {
      action: "View",
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              to={USER_ROUTES.DETAIL_EMPLOYEE}
              state={{ id: record?.employeeCode }}
            >
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            <Link
              to={record?.status === "ACTIVE" && USER_ROUTES.UPDATE_EMPLOYEE}
              state={
                record?.status === "ACTIVE" && { id: record?.employeeCode }
              }
            >
              <div
                className={
                  record?.status === "INACTIVE" && " cursor-not-allowed"
                }
              >
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name="IconEdit"
                      color={
                        record?.status === "ACTIVE" ? "#0075bf" : "#C0BEC6"
                      }
                      width={24}
                    />
                  }
                  border={false}
                  disabled={record?.status === "ACTIVE" ? false : true}
                >
                  {data_length > 3 && (
                    <span
                      className={
                        record?.status === "ACTIVE"
                          ? "text-black ml-3"
                          : "text-[#C0BEC6]"
                      }
                    >
                      Update
                    </span>
                  )}
                </ButtonComponent>
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  const columns = [
    {
      title: "NO",
      dataIndex: "no",
      width: 80,
      align: "center",
      sorter: true,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("type"),
    },
    {
      title: "PRE-REQUISITE NAME",
      dataIndex: "preRequisiteName",
      width: 300,
      sorter: true,
      ...getColumnSearchProps("preRequisiteName"),
    },
    {
      title: "COMPLETION DATE",
      dataIndex: "completionDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("completionDate"),
    },
    {
      title: "REFERENCE",
      dataIndex: "reference",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("reference"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("description"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      align: "center",
      sorter: true,
      render: (status) => (
        <Tag 
          color={getStatusColor(status)}
          style={{
            backgroundColor: getStatusBackgroundColor(status),
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "2px 8px",
            fontSize: "12px"
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
        const hasActions = record.status === "Pending";
        
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
      <BaseContainer header={"PRE-REQUISITE INFORMATION"} >
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
          tableScrolled={{ y: 525, x: 1500 }}
          onSort={onSort}
          columns={columns}
        />
      </BaseContainer>
    </Fragment>
  )
}

export default CustomerServiceRequestPreRequisite
