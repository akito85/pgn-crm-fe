import {
  Alert,
  Form,
  Spin,
  Tooltip,
} from "antd";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Link, NavLink } from "react-router-dom";
import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../assets/Icon/index";
import {
  downloadEmployee,
  getAllEmployeePaginate,
  terminateEmployee,
} from "../../../../redux/slices/user_management/employee";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "../../../../components/TablePagination";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../utils";
import moment from "moment";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import PendingTaskLayout from "../User/PendingTaskLayout";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { clearBodyMessage, hideModalError } from "../../../../redux/slices/general_slice";

const Employee = () => {
  const dispatch = useDispatch();
  const { data, loading, data_status } =
    useSelector((state) => state.employee);
  const { bodyError } = useSelector(state => state?.general);
  const [modalTerm, setModalTerm] = useState(false);
  const [empId, setEmpId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [openPending, setOpenPending] = useState(false);
  const [body, setBody] = useState({});


  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(getAllEmployeePaginate({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort }));
  }, [dispatch, page, pageSize, search, sort]);

  // use effect
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

  // handle download
  const handleDownload = () => {
    dispatch(
      downloadEmployee({
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
      title: "EMPLOYEE NUMBER",
      dataIndex: "empNumber",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "empNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      sorter: true,
      render: (text) => renderColumn('empNumber', searchedColumn, searchText, text, false, 'input', search)

    },
    {
      title: "FIRST NAME",
      dataIndex: "firstName",
      width: 200,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "firstName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      sorter: true,
      render: (text) => renderColumn('firstName', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "LAST NAME",
      dataIndex: "lastName",
      width: 200,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lastName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      sorter: true,
      render: (text) => renderColumn('lastName', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "EMPLOYEE TYPE",
      dataIndex: "empType",
      align: "center",
      width: 180,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "empType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      sorter: true,
      render: (text) => renderColumn('empType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "MOBILE PHONE",
      dataIndex: "phone",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
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
      title: "EMAIL",
      dataIndex: "email",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
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
      title: "JOB",
      dataIndex: "jobName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "jobName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('jobName', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "POSITION",
      dataIndex: "positionName",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "positionName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('positionName', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
      width: 140,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      sorter: true,
      align: "center",
      width: 140,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
    },
    {
      title: "DESCRIPTION",
      sorter: true,
      dataIndex: "description",
      width: 270,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
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
      sorter: true,
      fixed: "right",
      width: 120,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
  ];

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: "",
      breadcrumbName: "Employee",
    },
  ];

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleCancel = () => {
    form.resetFields();
    setModalTerm(false);
  };

  // on finsih
  const onFinish = async (formValue) => {
    const body = {
      ...formValue,
      employeeId: empId,
      executionDate: formValue?.executionDate.format(dateFormatting?.dateTime),
    };

    setBody(body);
    handleCancel()
    await dispatch(terminateEmployee(body))
      .unwrap()
      .then(() => {
        handleFetch()
      })
      .catch((e) => {
        if (hasValue(e?.data) && e?.data?.data?.length > 0) {
          dispatch(clearBodyMessage());
          dispatch(hideModalError());
          setOpenPending(true);
        }
      });
  };

  // close modal pending
  const handleCloseForwardTask = () => setOpenPending(false);

  // sorting
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
      handleCancelTryAgain()
      if (bodyError?.action === "GET_ALL_EMPLOYEE_PAGINATE") {
        handleFetch();
      } else if (bodyError?.action === "DOWNLOAD_ACTION") {
        handleDownload();
        handleFetch();
      } else {
        dispatch(terminateEmployee(body));
        handleFetch();
      }
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
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink to={USER_ROUTES.UPLOAD_EMPLOYEE}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={USER_ROUTES.CREATE_EMPLOYEE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Employee
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
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
    {
      action: "forward",
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title={"Forward Task"}>
            <Link
              to={record?.status === "ACTIVE" && USER_ROUTES.FORWARD_TASK}
              state={
                record?.status === "ACTIVE" && {
                  id: record?.employeeCode,
                }
              }
            >
              <div>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name="IconReleaseApprover"
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
                      {" "}
                      Forward Task
                    </span>
                  )}
                </ButtonComponent>
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "terminate",
      type: 'table',
      render: (r, data_length) => {
        return (
          <Tooltip title={"Terminate"}>
            <Link
              onClick={() => {
                r?.status === "ACTIVE" && setEmpId(r?.employeeId);
                r?.status === "ACTIVE" && setModalTerm(true);
              }}
              state={r?.status === "ACTIVE" && { id: r?.employeeId }}
            >
              <div border={false}>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name="IconInactive"
                      color={r?.status === "ACTIVE" ? "#BE3036" : "#C0BEC6"}
                      width={24}
                    />
                  }
                  border={false}
                  disabled={r?.status === "ACTIVE" ? false : true}
                >
                  {data_length > 3 && (
                    <span
                      className={
                        r?.status === "ACTIVE"
                          ? "text-black ml-3"
                          : "text-[#C0BEC6]"
                      }
                    >
                      {" "}
                      Terminate
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

  return (
    <div>
      <Spin spinning={loading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer header={"EMPLOYEE LIST"}>
          <div className={"w-full"}>
            <TablePagination
              dataSource={data?.result}
              totalData={data?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              tableScrolled={{ y: 900, x: 3000 }}
              onChange={handleChange}
              columns={[
                ...columns,
                ...useColumnActionPermission(
                  ["forward", "view", "update", "terminate"],
                  itemActions,
                  "view"
                ),
              ]}
              onSort={onSort}
            />
          </div>
        </BaseContainer>
      </Spin>

      <ModalCustom
        isOpen={modalTerm}
        handleCancel={() => {
          setModalTerm(false);
          form.resetFields();
        }}
        header={"TERMINATE INFORMATION"}
        type={"confirmation"}
        width={800}
      >
        <div className="w-full modalTerminate">
          <Alert
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            message={"Are you sure want to terminate this Employee?"}
            description={
              "if you terminate this employee, the user with this employee will be inactived."
            }
            type={"warning"}
            showIcon
          />
        </div>
        <div className={"mt-4"}>
          <Form
            form={form}
            layout="vertical"
            className="mt-3"
            onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label={"Remark"}
              name={"remark"}
              rules={formMessageRequired("remark")}
            >
              <InputComponent rows={1} type="textarea" />
            </Form.Item>
            <Form.Item label={"Execution Date"} name={"executionDate"}>
              <DateComponent>
                {moment(formValue?.executionDate).format()}
              </DateComponent>
            </Form.Item>
            <div className="flex mt-4 w-full justify-end gap-5">
              <ButtonComponent
                type={"default"}
                onClick={() => {
                  setModalTerm(false);
                  form.resetFields();
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent type={"submit"} htmlType={"submit"}>
                Confirm
              </ButtonComponent>
            </div>
          </Form>
        </div>
      </ModalCustom>
      <ModalCustom
        isOpen={openPending}
        handleCancel={() => setOpenPending(false)}
        type={"confirmation"}
        header={"Terminate Information"}
        width={900}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Link
              to={USER_ROUTES.FORWARD_TASK}
              state={
              Array?.isArray(data_status?.data?.data) &&
              { id: data_status?.data?.data[0]?.employeeCode }}>
              <ButtonComponent type={'submit'} border={true}>Forward Task</ButtonComponent>
            </Link>
            <ButtonComponent type={'default'} onClick={handleCloseForwardTask} border={true}>Cancel</ButtonComponent>
          </div>
        }
      >
        <PendingTaskLayout
          typeLayout={'pending'}
          data={{ dataTable: data_status?.data?.data }}
        />
      </ModalCustom>

      {renderModal()}
    </div>
  );
};

export default Employee;
