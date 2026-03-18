import { DownloadOutlined } from "@ant-design/icons";
import { Checkbox, Form, Spin, Tooltip } from "antd";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadMasterJob,
  getDetailMasterJob,
  getListMasterJob,
  inactiveMasterJob,
} from "../../../../../redux/slices/system_setup/master_data/master_job";
import TablePagination from "../../../../../components/TablePagination";
import JobDetail from "./JobDetail";
import { renderColumn } from "../../../../../utils";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const Job = () => {
  const { data, loading, data_detail } = useSelector(
    (state) => state.master_job
  );
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;
  const [form] = Form.useForm();

  // use state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jobId, setJobId1] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [modalDetail, setModalDetail] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [body, setBody] = useState({});
  const [record, setRecord] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getListMasterJob({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  // use effect
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // columns
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "JOB NAME",
      dataIndex: "jobName",
      // width: 100,
      sorter: true,
      align: "left",
      ...getColumnSearchPropsPaging(
        "jobName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "jobName",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      // width: 240,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "description",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status",
          search
        ),
    },
  ];

  // handle change pagination
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // breadcrumb routes
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_JOB,
      breadcrumbName: "Job",
    },
  ];

  // handle cancel modals
  const handleCancelModal = () => {
    setModalConfirm(false);
    setModalDetail(false);
    form.resetFields();
    handleCancelTryAgain();
    setRecord({});
  };

  const handleDowload = () => {
    dispatch(
      downloadMasterJob({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  };
  // handle detail
  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(getDetailMasterJob(id))?.unwrap();
      setModalDetail(true);
    } catch (error) {
      setModalDetail(false);
    }
  };

  // onclick button
  const onClick = (r) => {
    setJobId1(r?.jobId);
    setModalConfirm(true);
    setRecord(r);
    if (r?.status === "ACTIVE") {
      setActiveOrInactive("Inactivate");
    }
    if (r?.status === "INACTIVE") {
      setActiveOrInactive("Activate");
    }
  };

  // handle confirm activation
  const handleConfirm = async (formValue, handleCancel) => {
    try {
      const data = {
        remark: formValue?.remark,
        status: activeOrInactive,
      };
      setBody({
        id: jobId,
        body: data,
      });
      handleCancel();
      handleCancelModal();
      await dispatch(
        inactiveMasterJob({
          id: jobId,
          body: data,
        })
      )?.unwrap();
      await handleFetch()?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap();
    }
  };

  // handle sort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle retry
  const handleRetry = () => {
    try {
      if (bodyError?.action === "INACTIVE_MASTER_JOB") {
        dispatch(inactiveMasterJob(body));
      } else if (bodyError?.action === "DOWNLOAD_MASTER_JOB") {
        handleDowload();
      } else {
        dispatch(getDetailMasterJob(body));
      }
      handleCancelModal();
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  // item actions
  const itemActions = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type={"submit"}
          onClick={handleDowload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES?.CREATE_JOB}>
          <ButtonComponent
            icon={<SVGIcon name={"IconButtonCreate"} width={24} />}
            type="submit"
          >
            Create Job
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
            <div
              onClick={() => {
                handleDetail(record?.jobId);
              }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            <div
              className={`${
                record?.status?.toLowerCase() === "inactive" &&
                "cursor-not-allowed"
              }`}
            >
              <Link
                to={
                  record?.status?.toLowerCase() !== "inactive" &&
                  SYSTEM_SETUP_ROUTES.UPDATE_JOB
                }
                state={
                  record?.status?.toLowerCase() !== "inactive" && {
                    id: record?.jobId,
                  }
                }
              >
                <SVGIcon
                  name="IconEdit"
                  className={`${
                    record?.status?.toLowerCase() === "inactive" &&
                    "cursor-not-allowed"
                  }`}
                  color={
                    record?.status?.toLowerCase() === "inactive"
                      ? "#8D91A0"
                      : "#ACC424"
                  }
                  width={24}
                />
              </Link>
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                onClick={() => {
                  onClick(record);
                }}
                checked={record.status !== "ACTIVE"}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];
  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />

        <BaseContainer header={"JOB LIST"}>
          <div className={"w-full"}>
            <TablePagination
              dataSource={dataSource}
              columns={[
                ...columns,
                ...useColumnActionPermission(
                  ["view", "update", "activate"],
                  itemActions
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              totalData={data?.page?.totalElements}
              onSort={onSort}
              tableScrolled={{ x: 800, y: 525 }}
            />
          </div>
        </BaseContainer>

        {/* Modal Detail */}
        <JobDetail
          data={data_detail}
          openModal={modalDetail}
          closeModal={handleCancelModal}
        />

        {/* Modal Active/Inactive */}
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancelModal}
          onFinish={handleConfirm}
          header={activeOrInactive === "INACTIVE" ? "activate" : "inactivate"}
          approveOrReject={
            activeOrInactive === "INACTIVE" ? "activate" : "inactivate"
          }
          menu={"Job"}
          named={record?.jobName}
          width={800}
        />

        {/* modal try again */}
        {renderModal()}
      </Spin>
    </>
  );
};

export default Job;
