import { useState, useEffect, useRef, Fragment } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"

import TablePagination from "../../../../../../../components/TablePagination";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../components/BaseContainer";
import NxsDropdownMenu from "../../../../../../../components/NxsDropdownMenu";

import { Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";

import { USER_ROUTES } from "../../../../../../../routes/user_management/user_routes";

const CustomerServiceRequestContact = ({
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
  
  // Dummy data
  const dummyData = [
    {
      id: "1",
      type: "Mobile",
      value: "234123131321"
    },
     {
      id: "2",
      type: "Office",
      value: "234123131321"
    },
    {
      id: "3",
      type: "Home",
      value: "234123131321"
    },
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
  ]

  const columns = [
    {
      title: "NO",
      width: 80,
      align: "center",
      render: (text, object, index) => (sanitizedPage - 1) * sanitizedPageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("type"),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 300,
      sorter: true,
      ...getColumnSearchProps("value"),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="View">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconEye"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleViewFile(r);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return(
    <Fragment>
      <BaseContainer header={"ACCOUNT PRIMARY CONTACT INFORMATION"} >
        <div className="w-full grid grid-cols-3 gap-3 mb-5">
          {/* Service Request Information */}
          <DetailText label="Contact Name">Waluyo</DetailText>
          <DetailText label="Job">Marketing</DetailText>
          <DetailText label="Position">Product Strategy</DetailText>
        </div> 

        <div className="mb-5 text-primary text-xs font-bold uppercase">
          CONTACT DETAIL INFORMATION
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

      <BaseContainer header={"ACCOUNT PRIMARY CONTACT INFORMATION"} >
        <div className="w-full grid grid-cols-3 gap-3 mb-5">
          {/* Service Request Information */}
          <DetailText label="Contact Name">Waluyo</DetailText>
          <DetailText label="Job">Marketing</DetailText>
          <DetailText label="Position">Product Strategy</DetailText>
        </div> 

        <div className="mb-5 text-primary text-xs font-bold uppercase">
          CONTACT DETAIL INFORMATION
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

export default CustomerServiceRequestContact
