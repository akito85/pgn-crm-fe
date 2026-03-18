import React, { useCallback, useEffect, useState } from "react";
import {
  Checkbox,
  Form,
  Spin,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  downloadMasterPosition,
  getDetailMasterPosition,
  getListMasterPosition,
  inactiveMasterPosition,
} from "../../../../../redux/slices/system_setup/master_data/master_position";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import { useRef } from "react";
import PositionDetail from "./PositionDetail";
import TablePagination from "../../../../../components/TablePagination";
import SVGIcon from "../../../../../assets/Icon/index";
import { renderColumn } from "../../../../../utils";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
const PositionPage = () => {
  const dispatch = useDispatch();
  const {
    data,
    data_detail,
    loading,
  } = useSelector((state) => state.master_position);
  const { bodyError } = useSelector(state => state?.general);

  // use state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [positionId, setPositionId] = useState("");
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [statusData, setStatusData] = useState("");
  const [record, setRecord] = useState({});
  const [body, setBody] = useState({});
  const [form] = Form.useForm();

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(getListMasterPosition({ search: encodeURIComponent(JSON.stringify(search)), page, pageSize, sort }))
  }, [page, pageSize, search, sort, dispatch]);


  // use effect
  useEffect(() => {
    handleFetch()
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

  // handle detail
  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(getDetailMasterPosition(id))?.unwrap();
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);

    }
  };

  // handle cancel modals
  const handleCancelModal = async () => {
    setOpenDelete(false);
    setOpenModal(false);
    form.resetFields();
    handleCancelTryAgain();
  };

  // handle retry
  const handleRetry = () => {
    if (bodyError?.action === "INACTIVE_MASTER_POSITION") {
      dispatch(inactiveMasterPosition(body))
    } else if (bodyError?.action === "DOWNLOAD_MASTER_POSITION") {
      handleDownlaod();
    } else if (bodyError?.action === 'GET_DETAIL_MASTER_POSITION') {
      dispatch(getDetailMasterPosition(body))
    }
    handleCancelModal();
    handleFetch();
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
      title: "POSITION",
      dataIndex: "name",
      key: "name",
      // width: 115,
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      ...getColumnSearchPropsPaging(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('name', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "COST CENTER",
      dataIndex: "costcenter",
      key: "costcenter",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      // width: 235,
      ...getColumnSearchPropsPaging(
        "costcenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('costcenter', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 340,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      align: "center",
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)

    }
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
      path: SYSTEM_SETUP_ROUTES.VIEW_MASTER_POSITION,
      breadcrumbName: "List Position",
    },
  ];

  // on finish activation
  const onFinish = async (formValue, handleCancel) => {
    const body = { ...formValue, id: positionId, statusData };
    setBody(body);
    handleCancel();
    handleCancelModal();
    await dispatch(inactiveMasterPosition(body))?.unwrap();
    await handleFetch()?.unwrap();
  };

  // handle sort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle download 
  const handleDownlaod = () => {
    dispatch(
      downloadMasterPosition({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }))
  }

  // item toolbar
  const itemActions = [
    // toolbar items
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type={"submit"}
          onClick={handleDownlaod}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_MASTER_POSITION}>
          <ButtonComponent
            type={"submit"}
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          >
            Create Position
          </ButtonComponent>
        </NavLink>
      )
    },

    // column action
    {
      action: 'View',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
            <div
              onClick={() => {
                handleDetail(record?.positionId);
                setTypeModal("detail");
              }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: 'Update',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            <div className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}>
              <Link
                to={record?.status?.toLowerCase() !== "inactive" && SYSTEM_SETUP_ROUTES.UPDATE_MASTER_POSITION}
                state={record?.status?.toLowerCase() !== "inactive" && { id: record?.positionId }}
              >
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                  color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"} />
              </Link>
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: 'Activate',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title={record.status}>
            <div
              onClick={() => {
                setOpenDelete(true);
                setPositionId(record?.positionId);
                setTypeModal("confirmation");
                setStatusData(record?.status);
                setRecord(record);
              }}
            >
              <Checkbox checked={record.status !== "ACTIVE"} />
            </div>
          </Tooltip>
        )
      }
    }
  ];

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
  return (
    <>
      <Spin spinning={loading}>

        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer>
          <div className={"flex flex-col w-full"}>
            <TablePagination
              dataSource={data?.result}
              columns={[...columns, ...useColumnActionPermission(['view', 'update', 'Activate'], itemActions)]}
              current={page}
              pageSize={pageSize}
              totalData={data?.page?.totalElements}
              onChange={handleChange}
              onSort={onSort}
              tableScrolled={{ x: 1300, y: 525 }}
            />
          </div>
        </BaseContainer>
      </Spin>


      {/* modal detail or activation */}
      <PositionDetail
        data={data_detail}
        isOpen={openModal}
        onClick={handleCancelModal}
      />



      {/* Modal Active/Inactive */}
      <ModalApproveOrReject
        isOpen={openDelete}
        handleCloseModal={handleCancelModal}
        onFinish={onFinish}
        header={statusData === "INACTIVE" ? "activate" : "inactivate"}
        approveOrReject={
          statusData === "INACTIVE" ? "activate" : "inactivate"
        }
        menu={"Position"}
        named={record?.name}
        width={800}
      />

      {/* modal try again */}
      {renderModal()}
    </>
  );
};

export default PositionPage;
