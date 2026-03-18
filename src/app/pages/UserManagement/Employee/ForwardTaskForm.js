
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Form, Spin, Select } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { configApp } from "../../../../constants/configApp";
import GridLayout from "../../../../components/GridLayout";
import { countBadgeFieldsErrorMandatory, formMessageRequired, renderColumn, renderDateColumn } from "../../../../utils";
import DetailText from "../../../../components/DetailText";
import {
  getPendingTask,
  createForwardTask,
  getTo,
} from "../../../../redux/slices/user_management/employee";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import TablePagination from "../../../../components/TablePagination";
import { sorterFunction } from "../../../../utils/sorterFunction";
import RadioTabs from "../../../../components/RadioTabs";
import SelectComponent from "../../../../components/SelectComponent";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import {
  getAttachmentCategory,
  getConfigFileRBIBillingItem,
} from "../../../../redux/slices/rating_billing_invoice/billingItem";
import userHttpService from "../../../../redux/services/userHttpService";
import { hasValue } from "../../../../utils";
import { updatePagination } from "../../../../utils/updatePagination";
import ModalBack from "../../../../components/Modal/ModalBack";
import ForwardTaskConfirm from "./ForwardTaskConfirm";

const ForwardTaskForm = ({ type }) => {
  const {
    data_pending,
    data_to,
    loading,
  } = useSelector((state) => state.employee);

  
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.state?.id;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // state
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [tabForwardTask, setTabForwardTask] = useState([
    {
      value: "Forward Task",
      paramValue: ["from", "to", "remark"],
    },
    { value: "Attachment", paramValue: ['attachment'] },
  ]);
  const [valuePage, setValuePage] = useState(tabForwardTask[0].value);
  const isLoading = loading || loadingForm;

  
  // breadcrumbs routes
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
      breadcrumbName: "Forward Task",
    },
  ];


  useEffect(() => {
    if (id) {
      dispatch(getPendingTask(id));
    }
    dispatch(getAttachmentCategory());
  }, [dispatch, id]);

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleForwardTo = (value) => {
    dispatch(getTo(value));
    form.resetFields(['to'])
  };

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

  const handleClear = () => {
    form.resetFields(["from", "to", "remark"]);
  };

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const handleCancel = () => {
    setModalConfirm(false)
  }


  const handleConfirm = () => {
    const getPosition = data_to?.find(item => item?.uniqueId === bodyData?.to)?.positionIdForward || null;
    const getEmployeeCodeForward = data_to?.find(item => item?.uniqueId === bodyData?.to)?.employeeCodeForward || null;
    const approvalDTO = data_pending?.pendingTasks?.map(item => ({ tappId: item?.tappId }))
    const body = {
      positionIdFrom: bodyData?.from,
      positionIdTo: getPosition,
      employeeCode: data_pending?.employeeCode,
      employeeCodeForward: getEmployeeCodeForward,
      forwardApprovalDTOs: approvalDTO,
      remark: bodyData?.remark
    };
    
    dispatch(createForwardTask(body))
      .unwrap()
      .then(async (dataForm) => {
        const taxCodeId = dataForm?.data?.forwardTaskId;
        handleCancel();
        setLoadingForm(true);
        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          const body = {
            files: element.file,
            category: element.fileCategoryId,
          };
          await userHttpService.uploadImage(
            `/v1/dbs/api/forward-task/upload-attachment/${taxCodeId}`,
            body
          );
        }
        setLoadingForm(false);
      })
      .catch((error) => {
        handleCancel()
      });
  };


  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    countBadgeFieldsErrorMandatory(setTabForwardTask, listDataAttachment, errorFields)
  };


  const onFinish = (formValue) => {
    setBodyData({
      ...formValue,
      listDataAttachment: listDataAttachment
    });
    setModalConfirm(true);
  };

  const EmployeeInformation = (
    <>
      <GridLayout cols={2}>
        <DetailText label={"Employee Number"}>
          {data_pending?.employeeNumber}
        </DetailText>
        <DetailText label={"Employee Name"}>
          {data_pending?.employeeName}
        </DetailText>
      </GridLayout>
    </>
  );

  const columnsPendingTask = [
    {
      title: "NO",
      width: 60,
      align: "center",
      dataIndex: "no",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "POSITION",
      dataIndex: "positionName",
      sorter: (a, b) => sorterFunction("positionName", a, b),
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
      title: "APPROVAL TYPE",
      dataIndex: "approvalType",
      sorter: (a, b) => sorterFunction("approvalType", a, b),
      ...getColumnSearchProps(
        "approvalType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) => renderColumn('approvalType', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "TASK DATE",
      dataIndex: "taskDate",
      sorter: (a, b) => sorterFunction("taskDate", a, b, "date"),
      ...getColumnSearchProps(
        "taskDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'datetime'
      ),
      render: (text) => renderDateColumn('taskDate', hasValue(search['taskDate']), searchText, text, 'datetime', search)
    },
  ];

  return (
    <div>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <BaseContainer header={"Pending Task Information"}>
          <div className="text-primary text-xs font-bold uppercase mt-[-25px] pl-5">
            Employee Information
          </div>
          <div className="w-auto grid grid-cols-2 pl-5 mt-5">
            {EmployeeInformation}
          </div>
          <div className="text-primary text-xs font-bold uppercase mt-3 pl-5">
            Pending Task
          </div>
          <div className="mt-5 pl-5">
            <TablePagination
              dataSource={updatePagination(
                data_pending?.pendingTasks,
                "data",
                searchedColumn,
                searchText,
                page,
                pageSize,
                "string"
              )}
              totalData={
                updatePagination(data_pending?.pendingTasks,
                  "length",
                  searchedColumn,
                  searchText,
                  page,
                  pageSize,
                  "string")
              }
              columns={columnsPendingTask}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              tableScrolled={{ x: 900, y: 600 }}
            />
          </div>
        </BaseContainer>

        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <BaseContainer header={"Forward Task"}>
            <div className="flex flex-col mt-[-7px]">
              <RadioTabs
                data={tabForwardTask}
                onChange={onChange}
                currentPosition={valuePage}
              />
            </div>
            <div
              style={{
                display:
                  valuePage !== tabForwardTask[0].value ? "none" : undefined,
              }}
            >
              <div className="w-auto grid grid-cols-2 gap-5 mt-3">
                <Form.Item label={"From"} rules={formMessageRequired('From')} name={'from'}>
                  <SelectComponent onChange={handleForwardTo}>
                    {(data_pending?.fromPosition || []).map((data, index) => (
                      <Select.Option value={data.positionIdFrom} key={index}>
                        {data.name}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
                <Form.Item label={"To"} rules={formMessageRequired("To")} name={'to'}>
                  <SelectComponent>
                    {(data_to || []).map((data, index) => (
                      <Select.Option value={data?.uniqueId} key={index}>
                        {data.name}-{data.empName}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
              </div>
              <div className="w-auto grid grid-cols-1 ">
                <Form.Item
                  label={"Remark"}
                  rules={formMessageRequired("Remark")}
                  name={"remark"}
                >
                  <InputComponent type="textarea" />
                </Form.Item>
              </div>
            </div>
            <div
              style={{
                display:
                  valuePage !== tabForwardTask[1].value ? "none" : undefined,
                marginTop: "15px",
              }}
            >
              <Form.Item
                name={'attachment'}
                rules={[
                  {
                    validator: () => {
                      return listDataAttachment?.length > 0 ?
                        Promise.resolve()
                        :
                        Promise.reject(
                          new Error('Please upload your attachment!')
                        )
                    }
                  }
                ]}
              >
                <AttachmentComponent
                  type={type}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  dispatch={dispatch}
                  getAPICategory={getAttachmentCategory}
                  typeSelector="billing_item"
                  service={userHttpService}
                  configApplication={configApp.USER_MANAGEMENT_SERVICE}
                  getAPIGuard={getConfigFileRBIBillingItem}
                  mandatory={true}
                />
              </Form.Item>
            </div>
          </BaseContainer>

          <Form.Item>
            <div className={"w-full flex justify-between gap-5 my-5"}>
              <ButtonComponent
                icon={<ArrowLeftOutlined />}
                type={"submit"}
                onClick={() => setModalBack(true)}
              >
                Back
              </ButtonComponent>
              <div className="w-full justify-end flex gap-2">
                <ButtonComponent
                  type={"submit"}
                  onClick={() => {
                    handleClear();
                  }}
                  icon={<SVGIcon name={`IconButtonClear`} width={24} />}
                // disabled={firstStep}
                >
                  Clear
                </ButtonComponent>
                <ButtonComponent type={"submit"} htmlType={"submit"}>
                  Save
                </ButtonComponent>
              </div>
            </div>
          </Form.Item>
        </Form>

        {/* modal back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/* modal confirm */}
        <ForwardTaskConfirm
          isOpen={modalConfirm}
          handleClose={handleCancel}
          handleConfirm={handleConfirm}
          data={bodyData}
          ddl={{ dataFrom: data_pending?.fromPosition, dataTo: data_to }}
        />
      </Spin>
    </div>
  );
};

export default ForwardTaskForm;
