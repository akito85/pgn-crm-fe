import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Button, Checkbox, DatePicker, Form, Input, Select, Spin } from "antd";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import GridLayout from "../../../../components/GridLayout";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  createEmployee,
  getEmployeeDetail,
  getListEmpType,
  getListJob,
  getListPosition,
  updateEmployee,
} from "../../../../redux/slices/user_management/employee";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import {
  ModalAttention,
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import { dateFormatting, formMessageRequired, hasValue, renderColumn, renderDateColumn, renderDateConverter } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import TableInlineEmployee from "./TableInlineEmployee";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import EmployeeConfirmation from "./EmployeeConfirmation";
import { sorterFunction } from "../../../../utils/sorterFunction";
import userHttpService from "../../../../redux/services/userHttpService";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
const { Option } = Select;

const EmployeeForm = (props) => {
  const { type } = props;
  const { data_detail, loading, data_emp, data_post, data_job } = useSelector(
    (state) => state.employee
  );
  const { bodyError, isLoading } = useSelector(state => state.general);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const employeeStartDate = Form.useWatch("startDate", form);
  const [modalConfirmasi, setModalConfirmasi] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState({});
  const [payload, setPayload] = useState({});
  const id = location?.state?.id;
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAssigmentListIsNull, setIsAssignmentListIsNull] = useState(false);
  const deleteNumber62 = (numb) => {
    let numbWithout62 = numb?.replace(/^62/, "");
    let result = parseInt(numbWithout62);
    return result;
  };
  const [disabledButton, setDisabledButton] = useState(false);
  // isPreparing guards the Spin in edit mode until the correct employee's detail
  // AND all lookup data (job, position) are present. Without this guard the shared
  // Redux `loading` flag collapses the spinner as soon as the first action resolves,
  // leaving the form visually blank while getEmployeeDetail is still in-flight.
  const [isPreparing, setIsPreparing] = useState(!!id);

  useEffect(() => {
    dispatch(getListEmpType());
    dispatch(getListJob());
    dispatch(getListPosition());
    if (id) {
      dispatch(getEmployeeDetail(id));
    }
  }, [dispatch, id]);

  const assert = () => {
    const dataTable = data_detail?.assignmenTset?.map((item, index) => {
      let jobId;
      let positionId
      if (hasValue(data_job?.data) && hasValue(data_post?.data)) {
        const job = data_job?.data?.find(itemjob => itemjob?.jobId === item?.jobId);
        jobId = job ? { label: job.jobName, key: job.jobId, value: job.jobId, disabled: job.disabled } : null;
        const position = data_post?.data?.find(itemPosition => itemPosition?.positionId === item?.positionId);
                    positionId = position ? { label: position?.name, key: position?.positionId, value: position?.positionId, disabled: position?.disabled } : null;
      }
      return {
        id: item?.assignId,
        employeeCode: item?.employeeCode,
        key: (index + 1).toString(),
        jobId: jobId,
        positionId: positionId,
        startDate:
          item?.startDate === null ? moment() : moment(item?.startDate).clone(),
        endDate:
          item?.endDate === undefined || item?.endDate === null
            ? ""
            : moment(item?.endDate).clone(),
        isMain: item?.isMain,
        status: item?.status,
      };
    });
    form.setFieldsValue({
      employeeId: data_detail?.employeeId,
      employeeCode: data_detail?.employeeCode,
      empNumber: data_detail?.empNumber,
      firstName: data_detail?.firstName,
      lastName: data_detail?.lastName,
      empType: data_detail?.empType,
      phone: deleteNumber62(data_detail?.phone),
      phoneEdit: data_detail?.phone,
      email: data_detail?.email,
      startDate:
        data_detail?.startDate === null
          ? moment()
          : moment(data_detail?.startDate).clone(),
      endDate:
        data_detail?.endDate != null
          ? moment(data_detail?.endDate).clone()
          : "",
      description: data_detail?.description,
    });
    setTableData(dataTable);
    setPage(1);
    setPageSize(pageSize);
  };

  // Populate form and assignment table only when the right employee's detail AND
  // the job/position lookups are all loaded. Without data_job/data_post in the
  // dependency list, assert() can run before lookups arrive and leave assignment
  // rows with null job/position values.
  // Guarded to run once per id: getListJob/getListPosition/getEmployeeDetail can
  // resolve a second time after the form is already interactive (e.g. StrictMode's
  // double-invoked mount effect in dev), producing new data_detail/data_job/data_post
  // references. Without this guard, assert() re-fires and wipes out any row the user
  // has already added to the (still-unsaved) assignment table.
  const assertedForIdRef = useRef(null);
  useEffect(() => {
    if (
      id &&
      data_detail?.employeeCode === id &&
      hasValue(data_job?.data) &&
      hasValue(data_post?.data) &&
      assertedForIdRef.current !== id
    ) {
      assert();
      assertedForIdRef.current = id;
    }
  }, [id, data_detail, data_job, data_post]);

  // Clear isPreparing once the correct employee's detail is loaded AND all lookups
  // are present. Checking employeeCode === id prevents stale Redux data from a
  // previous edit session from prematurely dismissing the spinner.
  useEffect(() => {
    if (!id) return;
    const allReady =
      data_detail?.employeeCode === id &&
      Array.isArray(data_emp?.data) &&
      Array.isArray(data_job?.data) &&
      Array.isArray(data_post?.data);
    if (allReady) setIsPreparing(false);
  }, [id, data_detail, data_emp, data_job, data_post]);

  const dataJob = data_job?.data?.map((item) => {
    return {
      value: item.jobId,
      label: item.jobName,
    };
  });
  const dataPost = data_post?.data?.map((item) => {
    return {
      value: item.positionId,
      label: item.name,
    };
  });


  // handle confirmation
  const handleConfirmation = async (formValue) => {
    try {
      const isDuplicateTax = tableData?.map((item) => item?.positionId?.value);
      const tableAssignmentMap = tableData?.map(item => (
        {
          ...item,
          startDate: hasValue(item?.startDate) ? renderDateConverter(item?.startDate, 'date') : null,
          endDate: hasValue(item?.endDate) ? renderDateConverter(item?.endDate, 'date') : null,
        }
      ));

      let message = "";
      if (tableData.length === 0) {
        message = "Please input your employee assignment";
      } else if (
        tableData
          .filter((item) => item.status === "ACTIVE")
          .filter((item) => item["isMain"] === true).length !== 1
      ) {
        message = "There cannot be more than one or null primary";
      } else if (
        isDuplicateTax.some(function (item, idx) {
          return isDuplicateTax.indexOf(item) !== idx;
        })
      ) {
        let findRow = isDuplicateTax.filter((item, index) => {
          let ind = isDuplicateTax.findIndex(
            (item2) => item?.positionId === item2?.positionId
          );
          return index === ind;
        })?.toString();
        const positionNameFiltered = dataPost.filter((a) => a.value === findRow)
        message = `Position is already exist`;
      }
      if (tableData?.length === 0) {
        setIsAssignmentListIsNull(true);
      } else if (message) {
        const errorBody = {
          title: "Attention",
          description: `Your data was not created. ${message}. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        let body;
        let url;
        const request = {
          ...formValue,
          email: formValue?.email?.toLowerCase(),
          phone: `62${formValue?.phone}`,
          startDate: hasValue(formValue?.startDate) ? renderDateConverter(formValue?.startDate, 'date') : null,
          endDate: hasValue(formValue?.endDate) ? renderDateConverter(formValue?.endDate, 'date') : null,
        }
        setData(
          {
            ...request,
            assignment: tableAssignmentMap
          }
        );

        // check double value
        if (type === 'update') {
          body = {
            ...request,
            employeeId: data_detail?.employeeId,
            assignment: tableAssignmentMap?.map(item => (
              {
                ...item,
                positionId: item?.positionId?.value,
                jobId: item?.jobId?.value,
              }
            ))
          }
          url = '/v1/dbs/api/employees/validate-update'
        } else {
          body = {
            ...request,
            assignment: tableAssignmentMap?.map(item => (
              {
                ...item,
                positionId: item?.positionId?.value,
                jobId: item?.jobId?.value,
              }
            ))
          }
          url = '/v1/dbs/api/employees/validate-create'
        }

        setPayload({
          requesBody: body,
          validateCreateUpdate: { body: body, services: userHttpService, endPoint: url, type: type }
        });


        await dispatch(validateCreateUpdate({ body: body, services: userHttpService, endPoint: url, type: type }))?.unwrap()
        setModalConfirmasi(true);
      }
    } catch (error) {
      setModalConfirmasi(false);
    }
  };

  //sorter dan filter
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

  const column = [
    {
      title: "NO",
      dataIndex: "no",
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "JOB",
      dataIndex: "jobId",
      kye: "jobId",
      inputType: "select",
      editable: true,
      required: true,
      ...getColumnSearchProps(
        "jobId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => sorterFunction('jobId', a?.jobId?.label, b?.jobId?.label, 'select'),
      options: dataJob,
      render: (text) => renderColumn('jobId', searchedColumn, searchText, text?.label, true, 'input', search)

    },
    {
      title: "POSITION",
      dataIndex: "positionId",
      editable: true,
      inputType: "select",
      key: "positionId",
      // width: 300,
      required: true,
      ...getColumnSearchProps(
        "positionId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => sorterFunction('positionId', a?.positionId?.label, b?.positionId?.label, 'select'),
      options: dataPost,
      render: (text) => renderColumn('positionId', searchedColumn, searchText, text?.label, true, 'input', search)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      inputType: "date",
      align: "center",
      editable: true,
      key: "startDate",
      width: 180,
      required: true,
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'date'
      ),
      sorter: (a, b) => sorterFunction('startDate', a, b, 'date'),
      render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      inputType: "date",
      align: "center",
      editable: true,
      width: 180,
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'date'
      ),
      sorter: (a, b) => sorterFunction('endDate', a, b, 'date'),
      render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
    },
    {
      title: "PRIMARY",
      dataIndex: "isMain",
      editable: true,
      align: "center",
      ...getColumnSearchProps(
        "isMain",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'boolean'
      ),
      sorter: true,
      inputType: "checkbox",
      width: 150,
      render: (isMain) => {
        return (
          <Checkbox checked={isMain} defaultChecked={false} />
        );
      },
    },
  ];

  // routes
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
      breadcrumbName: type === "update" ? "Update Employee" : "Create Employee",
    },
  ];

  // handle cancel
  const handleCancel = () => {
    setModalConfirmasi(false);
  };


  // handle save
  const saveEmployee = async () => {
    try {
      setModalConfirmasi(false);
      if (type === "update") {
        await dispatch(updateEmployee(payload?.requesBody))?.unwrap();
      } else {
        await dispatch(createEmployee(payload?.requesBody))?.unwrap();
      }
    } catch (error) {
      setModalConfirmasi(false);
    }
  };


  const handleDisableDate = (current) => {
    return moment() >= current;
  };


  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setTableData([]);
    } else {
      assert();
    }
  };


  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleDetailInline = (id) => {
  };
  const handleInactiveInline = (id) => {
  };


  // handle retry 
  const handleRetry = () => {
    handleCancelTryAgain()
    if (bodyError?.action === 'CREATE_EMPLOYEE') {
      dispatch(createEmployee(payload?.requesBody))
    } else if (bodyError?.action === 'UPDATE_EMPLOYEE') {
      dispatch(updateEmployee(payload?.requesBody))
    } else if (bodyError?.action === 'GET_LIST_EMPLOYEE_TYPE') {
      dispatch(getListEmpType())
    } else if (bodyError?.action === 'GET_LIST_EMPLOYEE_JOB') {
      dispatch(getListJob())
    } else if (bodyError?.action === 'GET_LIST_EMPLOYEE_Position') {
      dispatch(getListPosition());
    } else if (bodyError?.action === 'VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateCreateUpdate))
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <>
      <Spin spinning={isPreparing || isLoading}>
        <BreadCrumb routes={routes} />
        <Form form={form} layout={"vertical"} onFinish={handleConfirmation}>
          <NxCardContainer
            header={type === "update" ? "UPDATE EMPLOYEE" : "CREATE EMPLOYEE"}
          >
            <GridLayout cols={4}>
              <Form.Item
                label={"Employee Number"}
                name={"empNumber"}
                rules={formMessageRequired("Employee Number")}
              >
                <InputComponent disabled={type === "update"} />
              </Form.Item>
              <Form.Item
                label={"First Name"}
                name={"firstName"}
                rules={formMessageRequired("First Name")}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Last Name"}
                name={"lastName"}
                rules={formMessageRequired("Last Name")}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Employee Type"}
                name={"empType"}
                className={"w-full"}
                rules={formMessageRequired("Employee Type")}
              >
                <SelectComponent>
                  {data_emp?.data?.map((index) => (
                    <Option value={index?.value}>{index?.name}</Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label={"Mobile Phone"}
                name={"phone"}
                rules={formMessageRequired("Mobile Phone")}
              >
                <Input
                  allowClear
                  addonBefore={"62"}
                  maxLength={11}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))
                  }
                />
              </Form.Item>
              <Form.Item
                label={"Email"}
                name={"email"}
                rules={[...formMessageRequired("Email"), {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },]}
              >
                <InputComponent maxLength={50} />
              </Form.Item>
              <Form.Item
                label={"Start Date"}
                name={"startDate"}
                rules={formMessageRequired("Start Date")}
              >
                <DatePicker
                  format={dateFormatting?.dateCapital}
                  disabledDate={(current) => {
                    return current && current < moment().add(-1, "days");
                  }}
                  className={"w-full"}
                />
              </Form.Item>
              <Form.Item
                label={"End Date"}
                name={"endDate"}
              // rules={formMessageRequired("End Date")}
              >
                <DatePicker
                  format={dateFormatting?.dateCapital}
                  disabledDate={(current) => {
                    if (
                      form.getFieldValue("startDate") === undefined ||
                      form.getFieldValue("startDate") === null
                    ) {
                      return current && current < moment().add(-1, "days");
                    } else {
                      return (
                        current &&
                        current < moment(form.getFieldValue("startDate"))
                      );
                    }
                  }}
                  className={"w-full"}
                />
              </Form.Item>
              <div className="col-span-4">
                <Form.Item label={"Description"} name={"description"}>
                  <InputComponent type="textarea" />
                </Form.Item>
              </div>
            </GridLayout>
          </NxCardContainer>
          <div className={"my-5"}>
            <TableInlineEmployee
              header={"EMPLOYEE ASSIGNMENT"}
              tableData={tableData}
              onDataChange={setTableData}
              cols={column}
              mode={type}
              disableDate={handleDisableDate}
              scrollTable={{ x: 1300, y: 500 }}
              usePagination={true}
              useSelect={true}
              totalData={tableData?.length}
              pageSize={pageSize}
              current={page}
              onDetail={handleDetailInline}
              onInactive={handleInactiveInline}
              onChangePage={handleChangePage}
              onSizeChanger={handleChangePage}
              actionButton={["update", "delete"]}
              checkInputBy={"positionId"}
              checkNameColumn={"Position"}
              setInserted={setDisabledButton}
              employeeStartDate={employeeStartDate}
            />
          </div>
          <NxBaseContainer border>
            <div className={"w-full flex"}>
              <Button
                type="menu"
                onClick={() => setModalBack(true)}
                disabled={disabledButton}
              >
                Back
              </Button>
              <div className={"w-full flex justify-end gap-5"}>
                <Button
                  type="reject"
                  icon={<SVGIcon name="IconButtonClear" width={14} />}
                  onClick={handleClear}
                  disabled={disabledButton}
                >
                  {type === "update" ? "Reset" : "Clear"}
                </Button>
                <Button type="approve" disabled={disabledButton}>
                  Save
                </Button>
              </div>
            </div>
          </NxBaseContainer>
        </Form>

        <ModalCustom
          isOpen={modalConfirmasi}
          type={"confirmation"}
          header={"CONFIRMATION"}
          handleCancel={handleCancel}
          width={1000}
          footer=
          {
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent type={"default"} onClick={handleCancel}>
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                onClick={saveEmployee}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <EmployeeConfirmation data={data} data_emp={data_emp?.data} />
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
        <ModalAttention
          isOpen={isAssigmentListIsNull}
          handleCancel={() => setIsAssignmentListIsNull(false)}
          handleOk={() => setIsAssignmentListIsNull(false)}
          textList={"employee assigmnent"}
        />
      </Spin>

      {/* try again */}
      {renderModal()}
    </>
  );
};

export default EmployeeForm;
