import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from "antd";
import TablePagination from "../../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import { CloseOutlined, PauseCircleOutlined, PlayCircleOutlined, LockOutlined, PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getCustomerDetail } from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import { getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";


const CustomerServiceRequestDetailInfo = ({
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
  const [dataDetail, setDataDetail] = useState({});
  const dispatch = useDispatch();
  const [SRStatus, setSRStatus] = useState(null);

  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
    );
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  
  const isLoading = loading || loadingAccount;

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  
  useEffect(() => {
    dispatch(getGrantedAccessAccount('/account-management/customers'))
  }, [dispatch])

  useEffect(() => {
    if (id) {
      dispatch(getCustomerDetail(id));
    }
  }, [dispatch, id]);


  const log = []

  // Updated dummy data based on fikri.susilo extracted table data
  const dummyData = [
    {
      id: "1",
      date: "22 Jan 2022 19:35:23",
      username: "fikri.susilo",
      remark: "Update status to \"Closed\", remark: \"sudah selesai\""
    },
    {
      id: "2", 
      date: "22 Jan 2022 19:35:23",
      username: "fikri.susilo",
      remark: "Update status to \"Resolved\", remark: \"lanjut\""
    },
    {
      id: "3",
      date: "22 Jan 2022 19:35:23",
      username: "fikri.susilo",
      remark: "Update status to \"In Progress\", remark: \"lanjut\""
    },
    {
      id: "4",
      date: "22 Jan 2022 19:35:23",
      username: "fikri.susilo",
      remark: "Create service request"
    }
  ];

  const HistoryLogDummy = {
    recordId: "491",
    createdDate: "21 Dec 2021 23:11:09",
    createdBy: "Annisa",
    updatedDate: "28 Dec 2021 23:11:09",
    updatedBy: "Annisa"
  };

  const ServiceRequestDummy = {
    serviceRequestNumber: "SR20240800000002",
    serviceRequestReference: "SR20240800000004",
    costCenter: "015 - AREA BOGOR",
    type: "Field Service",
    category: "Gas Management",
    subCategory: "Gas Termination",
    channel: "Manual",
    priority: "High",
    requestSource: "Customer",
    requestDate: "21 Jan 2022 12:34:34",
    openDate: "21 Jan 2022 12:34:34",
    resolvedDate: "21 Jan 2022 12:34:34",
    closedDate: "21 Jan 2022 12:34:34",
    ageHour: "3.4",
    statusApproval: "Approved",
    statusPreRequisite: "Completed",
    status: "Open",
    description: "-"
  };

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

  const columns = [
    {
      title: "NO",
      width: 80,
      align: "center",
      render: (text, object, index) => (sanitizedPage - 1) * sanitizedPageSize + index + 1,
    },
    {
      title: "DATE",
      dataIndex: "date",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("date"),
    },
    {
      title: "USERNAME", 
      dataIndex: "username",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("username"),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 400,
      sorter: true,
      ...getColumnSearchProps("remark"),
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

  console.log(SRStatus)

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        {/* Left Side Buttons Group */}
        <div className="flex items-center gap-3">
          {/* Cancel Button */}
          {SRStatus !== "canceled" && SRStatus !== "closed" && SRStatus !== "resolved" && (
            <ButtonComponent
              type={"submit"}
              onClick={() => {setSRStatus("canceled")}}
              icon={<CloseOutlined className="text-2xl" />}
            >
              Cancel
            </ButtonComponent>
          )}

          {/* On Hold Button */}
          {SRStatus !== "canceled" && SRStatus !== "closed" && SRStatus !== "on-hold" && SRStatus !== "resolved" && (
            <ButtonComponent
              type={"submit"}
              onClick={() => {setSRStatus("on-hold")}}
              icon={<PauseCircleOutlined className="text-2xl" />}
            >
              Marks as On Hold
            </ButtonComponent>
          )}
        </div>

        {/* Right Side Buttons Group */}
        <div className="flex items-center gap-3">
          {/* Marks as Open Button */}
          {SRStatus !== "canceled" && SRStatus !== "closed" && (SRStatus === "on-hold" || SRStatus === "in-progress" || SRStatus === "resolved") && (
            <ButtonComponent
              type={"submit"}
              onClick={() => {setSRStatus("open")}}
              icon={<PlayCircleOutlined className="text-2xl" />}
            >
              Marks as Open
            </ButtonComponent>
          )}

          {/* Marks as In Progress Button */}
          {SRStatus !== "canceled" && SRStatus !== "closed" && SRStatus !== "in-progress" && (
            <ButtonComponent
              type={"submit"}
              onClick={() => {setSRStatus("in-progress")}}
              icon={<PlayCircleOutlined className="text-2xl" />}
            >
              Marks as In Progress
            </ButtonComponent>
          )}

          {/* Mark as Resolved Button */}
          {SRStatus !== "canceled" && SRStatus !== "closed" && SRStatus !== "resolved" && (
            <ButtonComponent
              type={"submit"}
              onClick={() => {setSRStatus("resolved")}}
              icon={<CheckCircleOutlined className="text-2xl" />}
            >
              Mark as Resolved
            </ButtonComponent>
          )}

          {/* Mark as Closed Button */}
          {SRStatus !== "canceled" && SRStatus !== "closed" && (
            <ButtonComponent
              type={"submit"}
              onClick={() => {setSRStatus("closed")}}
              icon={<LockOutlined className="text-2xl text-white" />}
              className="bg-[#0075bf] text-white hover:bg-[#0075bf]/90 transition-colors"
            >
              Mark as Closed
            </ButtonComponent>
          )}
        </div>
      </div>
      
      <BaseContainer header={"SERVICE REQUEST"}>
        <div className="w-full grid grid-cols-4 gap-4">
          {/* Service Request Information */}
          <DetailText label="Service Request Number">{data?.serviceRequestNumber || ServiceRequestDummy.serviceRequestNumber}</DetailText>
          <DetailText label="Service Request Reference"><u>{data?.serviceRequestReference || ServiceRequestDummy.serviceRequestReference}</u></DetailText>
          <DetailText label="Cost Center">{data?.costCenter || ServiceRequestDummy.costCenter}</DetailText>
          <DetailText label="Type">{data?.type || ServiceRequestDummy.type}</DetailText>
          <DetailText label="Category">{data?.category || ServiceRequestDummy.category}</DetailText>
          <DetailText label="Sub Category">{data?.subCategory || ServiceRequestDummy.subCategory}</DetailText>
          <DetailText label="Channel">{data?.channel || ServiceRequestDummy.channel}</DetailText>
          <DetailText label="Priority">{data?.priority || ServiceRequestDummy.priority}</DetailText>
          <DetailText label="Request Source">{data?.requestSource || ServiceRequestDummy.requestSource}</DetailText>
          <DetailText label="Request Date">{data?.requestDate || ServiceRequestDummy.requestDate}</DetailText>
          <DetailText label="Open Date">{data?.openDate || ServiceRequestDummy.openDate}</DetailText>
          <DetailText label="Resolved Date">{data?.resolvedDate || ServiceRequestDummy.resolvedDate}</DetailText>
          <DetailText label="Closed Date">{data?.closedDate || ServiceRequestDummy.closedDate}</DetailText>
          <DetailText label="Age (Hour)">{data?.ageHour || ServiceRequestDummy.ageHour}</DetailText>
          <DetailText label="Status Approval">{data?.statusApproval || ServiceRequestDummy.statusApproval}</DetailText>
          <DetailText label="Status Pre-Requisite">{data?.statusPreRequisite || ServiceRequestDummy.statusPreRequisite}</DetailText>
          <DetailText label="Status">{data?.status || ServiceRequestDummy.status}</DetailText>
        </div>
        <div className="w-full">
          <DetailText label="Description">{data?.description || ServiceRequestDummy.description}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"ACTION LOG"}>
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

      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-4">
          {/* History Log Information */}
          <DetailText label="Record Id">{log?.recordId || HistoryLogDummy.recordId}</DetailText>
          <DetailText label="Created Date">{log?.createdDate || HistoryLogDummy.createdDate}</DetailText>
          <DetailText label="Created By">{log?.createdBy || HistoryLogDummy.createdBy}</DetailText>
          <DetailText label="Updated Date">{log?.updatedDate || HistoryLogDummy.updatedDate}</DetailText>
          <DetailText label="Updated By">{log?.updatedBy || HistoryLogDummy.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestDetailInfo;
