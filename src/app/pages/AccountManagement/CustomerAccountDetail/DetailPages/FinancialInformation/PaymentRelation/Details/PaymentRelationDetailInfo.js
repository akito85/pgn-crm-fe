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
    accountNumber: "2027635461",
    accountName: "PT XYZ",
    priority: "1",
    startDate: "22 Aug 2022",
    endDate: "22 Aug 2022",
    status: "Active",
    description: "Lorem ipsum dolor sit amet consectetur. Malesuada turpis arcu morbi elit sed lorem at adipiscing imperdiet. Aliquam quis tempus feugiat amet. Viverra metus tincidunt nibh mauris nisi. At et etiam non dignissim ultricies tellus in lacus fermentum. Sollicitudin purus viverra tincidunt proin."
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
      <BaseContainer header={"PAYMENT RELATION"}>
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Payment Relation Information */}
          <DetailText label="Account Number">{data?.accountNumber || ServiceRequestDummy.accountNumber}</DetailText>
          <DetailText label="Account Name">{data?.accountName || ServiceRequestDummy.accountName}</DetailText>
          <DetailText label="Cost Center">{data?.priority || ServiceRequestDummy.priority}</DetailText>
          <DetailText label="Type">{data?.startDate || ServiceRequestDummy.startDate}</DetailText>
          <DetailText label="Category">{data?.endDate || ServiceRequestDummy.endDate}</DetailText>
          <DetailText label="Sub Category">{data?.status || ServiceRequestDummy.status}</DetailText>
        </div>
        <div className="w-full">
          <DetailText label="Description">{data?.description || ServiceRequestDummy.description}</DetailText>
        </div>
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
