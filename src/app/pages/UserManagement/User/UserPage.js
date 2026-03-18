import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Checkbox,
  Form,
  Spin,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import {
  donwloadedExcel,
  forwardTaskUser,
  getAllUserPaginate,
  inactiveUser,
} from "../../../../redux/slices/user_management/user";
import { useRef } from "react";
import TablePagination from "../../../../components/TablePagination";
import PendingTaskLayout from "./PendingTaskLayout";
import SVGIcon from "../../../../assets/Icon/index";
import InputComponent from "../../../../components/InputComponent";
import { formMessageRequired, hasValue, renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";
import { clearBodyMessage, hideModalError } from "../../../../redux/slices/general_slice";


const UserPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const dispatch = useDispatch();
  const { data, loading, data_status } = useSelector(
    (state) => state.user
  );
  const { bodyError } = useSelector(state => state?.general);

  // state
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activate, setActivate] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [form] = Form.useForm();
  const [body, setBody] = useState({});
  const [record, setRecord] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(getAllUserPaginate({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort }));
  }, [dispatch, page, pageSize, search, sort]);


  useEffect(() => {
    handleFetch()
  }, [handleFetch]);

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


  // handle cancel modals
  const handleCancel = async () => {
    setOpenModal(false);
    setOpenModalError(false);
    form.resetFields();
  };


  // handle download 
  const handleDownload = () => {
    dispatch(
      donwloadedExcel({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }))
  }

  // columns
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
      align: "left",
      width: 350,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "username",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('username', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "USER TYPE",
      dataIndex: "userType",
      key: "employee",
      width: 180,
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "userType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('userType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employeeName",
      key: "employeeName",
      // width: 220,
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "employeeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('employeeName', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "USER LEVEL",
      dataIndex: "userLevel",
      width: 180,
      align: "left",
      key: "user_level",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "userLevel",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('userLevel', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      // width: 200,
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "email",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('email', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "MOBILE PHONE",
      align: "left",
      dataIndex: "phone",
      width: 200,
      key: "phone",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "phone",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('phone', searchedColumn, searchText, text, false, 'input', search)
    },

    {
      title: "AUTH TYPE",
      dataIndex: "authType",
      key: "authType",
      width: 180,
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "authType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('authType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "GROUP ACCESS",
      dataIndex: "groupAccess",
      key: "group_access",
      // width: 240,
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "groupAccess",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('groupAccess', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      // width: 270,
      align: "left",
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
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    }
  ];

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_USER,
      breadcrumbName: "User",
    },
  ];

  // on finish
  const onFinish = async (formValue) => {
    try {
      const body = {
        userId,
        ...formValue,
        activate
      };
      setBody(body);
      handleCancel();
      await dispatch(inactiveUser(body))?.unwrap();
      await handleFetch()?.unwrap();
    } catch (error) {
      if (hasValue(error?.code) && error?.data?.length !== 0) {
        dispatch(clearBodyMessage())
        dispatch(hideModalError())
        setActivate('INACTIVE')
        setOpenModalError(true);
      }
    }

  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };


  // array items action
  const itemActions = [
    // toolbar items
    {
      action: "Change",
      render: (
        <NavLink to={USER_ROUTES?.CHANGE_AUTH}>
          <ButtonComponent
            type={"submit"}
            icon={<SVGIcon name={"IconRevers"} width={24} color={'#FFFFFF'} />}
          >
            {" "}
            Change Auth Type
          </ButtonComponent>
        </NavLink>
      )
    },
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type={"submit"}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: 'Upload',
      render: (
        <NavLink to={USER_ROUTES?.UPLOAD_USER}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink to={USER_ROUTES?.CREATE_USER}>
          <ButtonComponent
            icon={<SVGIcon name={"IconButtonCreate"} width={24} />}
            type="submit"
          >
            Create User
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
          <Tooltip title={"Detail"}>
            <Link
              to={USER_ROUTES.DETAIL_USER}
              state={{ id: record?.userCode }}
            >
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Link>
          </Tooltip>
        )
      }
    },
    {
      action: 'Update',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title={"Update"}>
            <Link
              to={record?.status === "ACTIVE" && USER_ROUTES.UPDATE_USER}
              state={record?.status === "ACTIVE" && { id: record?.userCode }}
            >
              <div className={`flex items-center ${record?.status?.toLowerCase() === 'inactive' && 'cursor-not-allowed'}`}>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name="IconEdit"
                      color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#0075bf"}
                      width={24}
                    />
                  }
                  border={false}
                  disabled={record?.status === "ACTIVE" ? false : true}
                >
                  {data_length > 3 && <span className={record?.status?.toLowerCase() === 'inactive' ? "text-[#8D91A0]" : "text-black ml-3"}> Update</span>}
                </ButtonComponent>
              </div>
            </Link>
          </Tooltip>
        )
      }
    },
    {
      action: 'Generate',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title={"Generate Link Password"}>
            <Link
              to={record?.status === "ACTIVE" && USER_ROUTES.GENERATE_PASSWORD}
              state={record?.status === "ACTIVE" && { id: record?.userId }}>
              <div className="flex items-center cursor-not-allowed">
                <ButtonComponent
                  icon={
                    <LinkOutlined
                      style={{
                        color: "#0075bf",
                        fontSize: 24,
                      }}
                    />
                  }
                  border={false}
                  disabled={record?.status === "ACTIVE" && record.authType !== "LDAP" ? false : true}
                >
                  {data_length > 3 && <span className="text-black ml-3"> Generate Link</span>}
                </ButtonComponent>
              </div>
            </Link>
          </Tooltip>
        )

      }
    },
    {
      action: 'Activate',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip
            title={
              record.status === "ACTIVE" ? "Inactivate" : "Activate"
            }
          >
            <ButtonComponent
              icon={
                <Checkbox
                  onClick={() => {
                    setOpenModal(true);
                    setUserId(record?.userId);
                    setActivate(record?.status);
                    setRecord(record)
                  }}
                  checked={record?.status !== "ACTIVE"}
                />
              }
              border={false}
              onClick={() => {
                setOpenModal(true);
                setUserId(record?.userId);
                setActivate(record?.status);
                setRecord(record)
              }}
            >
              {
                data_length > 3 &&
                <span className="text-black ml-5">
                  {record.status !== "ACTIVE"
                    ? "Activate"
                    : "Inactivate"}
                </span>
              }
            </ButtonComponent>
            <div></div>
          </Tooltip>)
      }
    }
  ];

  // handle retry
  const handleRetry = () => {
    handleCancelTryAgain()
    if (bodyError?.action === "GET_ALL_EMPLOYEE_PAGINATE") {
      handleFetch();
    } else if (bodyError?.action === "DOWNLOAD_USER_EXCEL") {
      handleDownload();
      handleFetch();
    } else if (bodyError?.action === "FORWARD_TASK_USER") {
      dispatch(forwardTaskUser(body))
    } else {
      dispatch(inactiveUser(body));
      handleFetch();
    }
  };

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);
  return (
    <div>
      <BreadCrumb routes={routes} />
      <Toolbar items={itemActions} />
      <Spin spinning={loading}>
        <BaseContainer header={"User List"}>
          <TablePagination
            dataSource={data?.result}
            totalData={data?.page?.totalElements}
            current={page}
            pageSize={pageSize}
            tableScrolled={{ y: 900, x: 3000 }}
            onChange={handleChange}
            onSizeChanger={handleChange}
            columns={[
              ...columns, ...useColumnActionPermission(['view', 'Update', 'Activate', 'Generate'], itemActions)
            ]}
            onSort={onSort}
          />
        </BaseContainer>
      </Spin>
      <ModalCustom
        isOpen={openModal}
        handleCancel={handleCancel}
        type={"confirmation"}
        header={
          activate === "INACTIVE"
            ? "Active Information"
            : "Inactive Information"
        }
        width={1000}
      >
        <div className={"w-full justify-center my-4 flex flex-col text-sm"}>
          <Alert
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            message={`Are you sure you want to ${activate === "INACTIVE" ? "activate" : "inactivate"
              } user named ${record?.username}?`}
            type={"warning"}
            showIcon
            className={"alert-icon"}
          />
          <div className={"mt-4"}>
            <Form
              form={form}
              layout="vertical"
              className="mt-3"
              onFinish={onFinish}
            >
              <Form.Item name={"remark"} rules={formMessageRequired("remark")} label={'Remark'}>
                <InputComponent
                  type={"textarea"}
                  rows={1}
                  placeholder="Type your remark"
                />
              </Form.Item>
              <div className={"w-full flex justify-end gap-2"}>
                <Form.Item>
                  <ButtonComponent
                    type={"default"}
                    onClick={handleCancel}
                    border={true}
                  >
                    Cancel
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type={"submit"}
                    htmlType={"submit"}
                    border={false}
                  >
                    Confirm
                  </ButtonComponent>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </ModalCustom>

      {/* modal pending task */}
      <ModalCustom
        isOpen={openModalError}
        handleCancel={handleCancel}
        type={"confirmation"}
        header={
          activate === "INACTIVE" ? "Inactive Information" : "Confirmation"
        }
        width={1000}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Link to={USER_ROUTES.FORWARD_TASK} state={Array.isArray(data_status?.data) && { id: data_status?.data[0]?.employeeCode }}>
              <ButtonComponent type={'submit'}>Forward Task</ButtonComponent>
            </Link>
            <ButtonComponent type={'default'} onClick={handleCancel} border={true}>Cancel</ButtonComponent>
          </div>
        }
      >
        <PendingTaskLayout
          typeLayout='pending'
          data={{
            dataTable: data_status?.data
          }}
          isOpen={openModalError}
        />
      </ModalCustom>

      {/* modal try again */}
      {renderModal()}
    </div>
  );
};

export default UserPage;
