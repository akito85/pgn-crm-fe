import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import { Tooltip, Spin, Button } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import GridLayout from "../../../../components/GridLayout";
import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import DetailText from "../../../../components/DetailText";
import {
  getAssignmentDetail,
  getEmployeeDetail,
  getForwardTaskDetail,
} from "../../../../redux/slices/user_management/employee";
import moment from "moment";
import { dateFormatting, hasValue, renderColumn, renderDateColumn, toTitleCase } from "../../../../utils";

import SVGIcon from "../../../../assets/Icon/index";
import CardComponent from "../../../../components/Card/CardComponent";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import {
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import ForwardTasksDetail from "./ForwardTasksDetail";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";

const EmployeeDetail = () => {
  const { data_ass, data_info, data_detail, loading } = useSelector(
    (state) => state.employee
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const [detailAH, setDetailAH] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetail, setPageSizeDetail] = useState(10);
  const [modalBack, setModalBack] = useState(false);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  // forward tasks search
  const searchInputForwardTasks = useRef(null);
  const [searchedColumnForwardTasks, setSearchedColumnForwardTasks] = useState("");
  const [searchTextForwardTasks, setSearchTextForwardTasks] = useState("");
  const [searchForwardTasks, setSearchForwardTasks] = useState({});

  const { data: dataUser = {} } = useSelector((state) => state.profile);

  useEffect(() => {
    if (hasValue(id)) {
      dispatch(getEmployeeDetail(id));
    }
  }, [dispatch, id]);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageDetail(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
    setSearchedColumn(dataIndex)
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPageDetail(1);
    }
  };
  const handleSearchForwardTasks = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextForwardTasks(selectedKeys[0]);
    setSearchForwardTasks((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
    setSearchedColumnForwardTasks(dataIndex)
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
  };

  const handleDetailForwardTask = async (record) => {
    try {
      await dispatch(getForwardTaskDetail(record?.forwardTaskHdrId))?.unwrap();
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);
    }
  }

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) =>
        (pageDetail - 1) * pageSizeDetail + index + 1,
    },
    {
      title: "JOB",
      dataIndex: "jobName",
      sorter: (a, b) => sorterFunction('jobName', a, b),
      ...getColumnSearchProps(
        "jobName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('jobName', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "POSITION",
      dataIndex: "positionName",
      sorter: (a, b) => sorterFunction('positionName', a, b),
      ...getColumnSearchProps(
        "positionName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('positionName', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      sorter: (a, b) => sorterFunction('startDate', a, b, 'date'),
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'date'
      ),
      render: (v) => renderDateColumn('startDate', searchedColumn, searchText, v, 'date', search)
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "center",
      sorter: (a, b) => sorterFunction('endDate', a, b, 'date'),
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'date'
      ),
      render: (v) => renderDateColumn('endDate', searchedColumn, searchText, v, 'date', search)
    },
    {
      title: "PRIMARY",
      dataIndex: "isMain",
      editable: true,
      align: "left",
      width: 150,
      sorter: (a, b) => sorterFunction('isMain', a, b),
      ...getColumnSearchProps(
        "isMain",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'status'
      ),
      render: (text) => renderColumn('isMain', searchedColumn, searchText, text, false, 'status', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 120,
      fixed: 'right',
      sorter: (a, b) => sorterFunction('status', a, b),
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'status'
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: 'right',
      render: (v, r, i) => {
        return (
          <div className="flex justify-center gap-4">
            <Tooltip title="Detail">
              <ButtonComponent
                border={false}
                icon={<SVGIcon name="IconDetail" width={24} />}
                onClick={() => {
                  setDetailAH(true);
                  dispatch(getAssignmentDetail(r?.assignId));
                }}
                state={{ id: r?.assignId }}
              ></ButtonComponent>
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ];


  const columnForwardTasks = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) =>
        (pageDetail - 1) * pageSizeDetail + index + 1,
    },
    {
      title: "POSITION",
      dataIndex: "positionIdFromName",
      sorter: (a, b) => sorterFunction('jobName', a, b),
      ...getColumnSearchProps(
        "positionIdFromName",
        searchInputForwardTasks,
        searchedColumnForwardTasks,
        searchTextForwardTasks,
        handleSearchForwardTasks,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('positionIdFromName', searchedColumnForwardTasks, searchTextForwardTasks, text, true, 'input', searchForwardTasks)
    },
    {
      title: "FORWARD TO",
      dataIndex: "employeeCodeForwardName",
      sorter: (a, b) => sorterFunction('employeeCodeForwardName', a, b),
      ...getColumnSearchProps(
        "employeeCodeForwardName",
        searchInputForwardTasks,
        searchedColumnForwardTasks,
        searchTextForwardTasks,
        handleSearchForwardTasks,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('employeeCodeForwardName', searchedColumnForwardTasks, searchTextForwardTasks, text, true, 'input', searchForwardTasks)
    },
    {
      title: "FORWARD BY",
      dataIndex: "createdBy",
      sorter: (a, b) => sorterFunction('createdBy', a, b),
      ...getColumnSearchProps(
        "createdBy",
        searchInputForwardTasks,
        searchedColumnForwardTasks,
        searchTextForwardTasks,
        handleSearchForwardTasks,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('createdBy', searchedColumnForwardTasks, searchTextForwardTasks, text, true, 'input', searchForwardTasks)
    },
    {
      title: "FORWARD DATE",
      dataIndex: "createdDate",
      sorter: (a, b) => sorterFunction('createdDate', a, b, 'date'),
      align: 'center',
      ...getColumnSearchProps(
        "createdDate",
        searchInputForwardTasks,
        searchedColumnForwardTasks,
        searchTextForwardTasks,
        handleSearchForwardTasks,
        true,
        'datetime'
      ),
      render: (text) => renderDateColumn('', hasValue(searchForwardTasks['createdDate']), searchTextForwardTasks, text, 'datetime', searchForwardTasks)
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: 'right',
      render: (v, r, i) => {
        return (
          <div className="flex justify-center gap-4">
            <Tooltip title="Detail">
              <ButtonComponent
                border={false}
                icon={<SVGIcon name="IconDetail" width={24} />}
                onClick={() => handleDetailForwardTask(r)}
                state={{ id: r?.assignId }}
              ></ButtonComponent>
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ]

  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleChangeForwardTasks = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const handleChangeDetail = (pageChange, pageSizeChange) => {
    setPageDetail(pageSizeDetail !== pageSizeChange ? 1 : pageChange);
    setPageSizeDetail(pageSizeChange);
  };

  const handleRetry = () => {
    handleCancelTryAgain();
    dispatch(getEmployeeDetail(id))
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
  const EmployeeInformation = (
    <NxBaseContainer border>
      <GridLayout cols={4}>
        <DetailText label={"Employee Number"}>
          {data_detail?.empNumber}
        </DetailText>
        <DetailText label={"Employee Type"}>{data_detail?.empTypeName}</DetailText>
        <DetailText label={"First Name"}>{data_detail?.firstName}</DetailText>
        <DetailText label={"Last Name"}>{data_detail?.lastName}</DetailText>
        <DetailText label={"Email"}>{data_detail?.email}</DetailText>
        <DetailText label={"Mobile Phone"}>{data_detail?.phone}</DetailText>
        <DetailText label={"Start Date"}>
          {hasValue(data_detail?.startDate)
            ? moment(data_detail?.startDate).format(dateFormatting.dateCapital)
            : ""}
        </DetailText>
        <DetailText label={"End Date"}>
          {hasValue(data_detail?.endDate)
            ? moment(data_detail?.endDate).format(dateFormatting.dateCapital)
            : ""}
        </DetailText>
        <DetailText label={"Status"}>{toTitleCase(data_detail?.status)}</DetailText>
        <DetailText label={"Description"}>
          {data_detail?.description}
        </DetailText>
      </GridLayout>
    </NxBaseContainer>
  );
  const HistoryLogInformation = (
    <NxBaseContainer border>
      <GridLayout cols={5}>
        <DetailText label={"Record Id"}>
          {data_detail?.employeeId}
        </DetailText>
        <DetailText label={"Created Date"}>
          {data_detail?.createdDate
            ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")
            : ""}
        </DetailText>
        <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>

        <DetailText label={"Updated Date"}>
          {data_detail?.updatedDate
            ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
            : ""}
        </DetailText>
        <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
      </GridLayout>
    </NxBaseContainer>
  );
  const TerminateLogInformation = (
    <NxBaseContainer border>
      <GridLayout cols={4}>
        <DetailText label={"Terminate By"}>
          {data_detail?.terminateBy}
        </DetailText>
        <DetailText label={"Terminate Date"}>
          {data_detail?.terminateDate
            ? moment(data_detail?.terminateDate).format("DD MMM YYYY HH:mm:ss")
            : ""}
        </DetailText>
        <DetailText label={"Remark"}>{data_detail?.remark}</DetailText>

        <></>
      </GridLayout>
    </NxBaseContainer>
  );
  const EmployeeAssignmentHistory = (
    <>
      <div className={"w-full"}>
        <NxTable
          idTable="employee-assignment-history-table"
          userId={dataUser?.data?.username}
          usePagination={false}
          showAdvanceSearch={false}
          showSearchBar={false}
          type="FE"
          dataSource={data_detail?.assignmenTset?.map(item => ({ ...item, isMain: item?.isMain === true ? 'primary' : 'non primary' }))}
          current={pageDetail}
          pageSize={pageSizeDetail}
          onChange={handleChangeDetail}
          columns={columns}
          tableScrolled={{
            x: 1500,
            y: 300,
          }}
        />
      </div>
    </>
  );

  const ForwardedTaskLayout = (
    <>
      <div className={"w-full"}>
        <NxTable
          idTable="forwarded-task-table"
          userId={dataUser?.data?.username}
          usePagination={false}
          showAdvanceSearch={false}
          showSearchBar={false}
          type="FE"
          dataSource={data_detail?.forwardTasks}
          current={page}
          pageSize={pageSize}
          onChange={handleChangeForwardTasks}
          columns={columnForwardTasks}
          tableScrolled={{
            x: 1500,
            y: 300,
          }}
        />
      </div>
    </>
  );

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_EMPLOYEE,
      breadcrumbName: "Employee",
    },
    {
      path: "",
      breadcrumbName: "Detail Employee",
    },
  ];

  return (
    <>
      <Spin spinning={loading}>

        <div className="gap-5 w-full flex flex-col">
          <BreadCrumb routes={routes} />
          <NxCardContainer header={"EMPLOYEE INFORMATION"}>
            {EmployeeInformation}
          </NxCardContainer>
          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            {HistoryLogInformation}
          </NxCardContainer>
          <NxCardContainer header={"TERMINATE LOG INFORMATION"}>
            {TerminateLogInformation}
          </NxCardContainer>
          <NxCardContainer header={"FORWARDED TASK"}>
            {ForwardedTaskLayout}
          </NxCardContainer>
          <NxCardContainer header={"EMPLOYEE ASSIGNMENT HISTORY"}>
            {EmployeeAssignmentHistory}
          </NxCardContainer>
          <NxBaseContainer border>
            <div className="w-full flex justify-between">
              <Button
                type={"menu"}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>
          </NxBaseContainer>
        </div>

        <ModalCustom
          width={1000}
          isOpen={detailAH}
          handleCancel={() => setDetailAH(false)}
          header={"EMPLOYEE ASSIGNMENT DETAIL"}
        >
          <CardComponent header={"EMPLOYEE ASSIGNMENT HISTORY"}>
            <GridLayout cols={4}>
              <DetailText label={"Job"}>{data_ass?.jobName}</DetailText>
              <DetailText label={"Position"}>{data_ass?.positionName}</DetailText>
              <DetailText label={"Start Date"}>
                {data_ass?.startDate
                  ? moment(data_ass?.startDate).format("DD MMM YYYY")
                  : ""}
              </DetailText>
              <DetailText label={"End Date"}>
                {data_ass?.endDate
                  ? moment(data_ass?.endDate).format("DD MMM YYYY")
                  : ""}
              </DetailText>
              <DetailText label={"Status"}>{toTitleCase(data_ass?.status)}</DetailText>
            </GridLayout>
          </CardComponent>
          <CardComponent header={"HISTORY LOG INFORMATION"}>
            <GridLayout cols={5}>
              <DetailText label={"Record Id"}>
                {data_ass?.empAssignmentId}
              </DetailText>
              <DetailText label={"Created Date"}>
                {data_ass?.createdDate
                  ? moment(data_ass?.createdDate).format("DD MMM YYYY HH:mm:ss")
                  : ""}
              </DetailText>
              <DetailText label={"Created By"}>{data_ass?.createdBy}</DetailText>
              <DetailText label={"Update Date"}>
                {data_ass?.updatedDate
                  ? moment(data_ass?.updatedDate).format("DD MMM YYYY HH:mm:ss")
                  : ""}
              </DetailText>
              <DetailText label={"Updated By"}>{data_ass?.updatedBy}</DetailText>
            </GridLayout>
          </CardComponent>
          <div className="flex justify-end">
            <ButtonComponent
              
              // icon={<PlusCircleFilled style={{ fontSize: "16px" }} />}
              onClick={() => setDetailAH(false)}
              border={true}
            >
              Back
            </ButtonComponent>
          </div>
        </ModalCustom>

        <ModalCustom
          type={'detail'}
          isOpen={openModal}
          handleCancel={handleCancel}
          width={1000}
          header={'Forward Task Detail'}
          footer={
            <ButtonComponent
              onClick={handleCancel}
              border={true}
            >
              Back
            </ButtonComponent>
          }
        >
          <ForwardTasksDetail data={data_info} />
        </ModalCustom>

        {/* modal BACK */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>

        {/* modal try again */}
        {renderModal()}
      </Spin>

    </>
  );
};

export default EmployeeDetail;
