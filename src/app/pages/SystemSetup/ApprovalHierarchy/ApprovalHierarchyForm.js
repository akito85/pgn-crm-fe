import { Form, Input, PageHeader, Select, Spin, Table } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SVGIcon from "../../../../assets/Icon/index";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import {
  DeleteOutlined,
  FilterOutlined,
  LeftOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import {
  createHierarchy,
  detailPositionHierarchy,
  getAppCode,
  getAppType,
  getEmployeeByIdPosition,
  getPositionDDL,
  updateAppHier,
} from "../../../../redux/slices/user_management/hierarchySlice";
import { useDispatch, useSelector } from "react-redux";
import DetailText from "../../../../components/DetailText";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import {
  convertToTitleCase,
  formMessageRequired,
  hasValue,
} from "../../../../utils";
import SelectComponent from "../../../../components/SelectComponent";
import Highlighter from "react-highlight-words";
import InputComponent from "../../../../components/InputComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";

const { Option } = Select;

const transformDataDDL = (dataDDL, formValue) => {
  const { submitter, finalApprover, ...detail } = formValue;
  let listFilter = [];
  if (submitter) {
    listFilter.push(submitter);
  }
  if (finalApprover) {
    listFilter.push(finalApprover);
  }
  if (detail) {
    const myArray = Object.keys(detail).map((key) => detail[key]);
    listFilter = listFilter.concat(Object.values(myArray));
  }
  const filterDataDDL = dataDDL?.data?.filter(
    (item) => !listFilter.includes(item.text),
  );
  return filterDataDDL;
};

const tampilDataApp = (formValue, value) => {
  const { ...detail } = formValue;
  if (detail) {
    return detail[value];
  }
};

const ApprovalHierarchyForm = (props) => {
  const { type } = props;
  const {
    data_detail,
    data_code,
    data_type,
    data_DDL,
    loading,
    data_employee,
  } = useSelector((state) => state.apphierarchy);
  const { bodyError, isLoading } = useSelector((state) => state?.general);

  const location = useLocation("");
  const dispatch = useDispatch("");
  const navigate = useNavigate("");
  const [modalBack, setModalBack] = useState(false);
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const formValue = form.getFieldsValue();
  const [insertApprover, setInsertApprover] = useState([]);
  const [modalConfirmasi, setModalConfirmasi] = useState(false);
  const [modalChoosePosition, setModalChoosePosition] = useState(false);
  const id = location?.state?.id;
  const [dataDetailPositionList, setDataDetailPositionList] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [approvers, setApprovers] = useState("");
  const formModalValue = formModal.getFieldsValue();
  const formCardValue = form.getFieldsValue();
  const [bodyFinish, setBodyFinish] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState("");
  const [mandatoryApprover, setMandatoryApprover] = useState(false);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    dispatch(getAppCode());
    dispatch(getAppType());
    dispatch(getPositionDDL());
    if (id) {
      dispatch(detailPositionHierarchy(id));
    }
  }, [dispatch, id]);

  const dataAssert = useCallback(
    (data_detail) => {
      const dataFilter = data_detail?.detail?.filter(
        (data, index) =>
          index !== 0 && index !== data_detail?.detail.length - 1,
      );
      const dataInsert = dataFilter?.map((item, index) => {
        return {
          // index: index + 1,
          approver: item.text,
          name: item.positionName,
          id: item.positionId,
        };
      });
      setInsertApprover(dataInsert);

      const mapped = dataFilter?.map((item) => ({
        id: item.positionId,
        [item.positionName]: item.text,
      }));
      const newObj = Object.assign({}, ...mapped);
      const boddy = {
        ...newObj,
        id: data_detail?.appHierId,
        approvalName: data_detail?.approvalName,
        approvalCode: data_detail?.approvalCode,
        approvalType: data_detail?.approvalTypeValue,
        desc: data_detail?.desc,
        submitter: data_detail?.detail[0]?.text,
        finalApprover:
          data_detail?.detail[data_detail?.detail?.length - 1]?.text,
      };
      form.setFieldsValue(boddy);
    },
    [form],
  );
  useEffect(() => {
    if (
      id &&
      data_detail &&
      data_detail.detail &&
      data_detail?.appHierId === id
    ) {
      // form.resetFields();
      // setInsertApprover([])
      dataAssert(data_detail);
    }
  }, [id, data_detail, dataAssert]);

  useEffect(() => {
    if (data_employee) {
      setDataDetailPositionList(data_employee?.data[0]?.employee);
    }
  }, [data_employee]);

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_APPROVAL_HIERARCHY,
      breadcrumbName: " Approval Hierarchy",
    },
    {
      path: "",
      breadcrumbName: `${
        type === "update"
          ? "Update Approval Hierarchy"
          : "Create Approval Hierarchy"
      }`,
    },
  ];

  // handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  // get search props
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            handleSearch(selectedKeys, confirm, dataIndex);
          }}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columnChoose = [
    {
      title: "NO",
      dataIndex: "no",
      width: "5%",
      render: (t, r, i) => i + 1,
    },
    {
      title: "EMPLOYEE NUMBER",
      dataIndex: "empNumber",
      width: 15,
      key: "empNumber",
      sorter: (a, b) => a.empNumber?.localeCompare(b.empNumber),
      ...getColumnSearchProps("empNumber"),
    },
    {
      title: "EMPLOYEE NAME",
      dataIndex: "empName",
      width: 15,
      key: "empName",
      sorter: (a, b) => a.empName?.localeCompare(b.empName),
      ...getColumnSearchProps("empName"),
    },
  ];
  const handleInsertApprover = () => {
    setInsertApprover((prevState) => {
      const newIndex = prevState.length + 1;
      const newApprv = {
        // id: null,
        // index: newIndex,
        name: `Approver ${newIndex}`,
        approver: "",
      };
      form.setFieldsValue({ [`Approver ${newIndex}`]: "" });
      return [...prevState, newApprv];
    });
  };

  const handleDeleteApprover = (index, name) => {
    // const { ...detail } = formValue;
    const newApprover = [...insertApprover];
    const approverIndex = newApprover.findIndex((item) => item.name === name);
    const approverData = newApprover.find((item) => item.name === name);

    if (approverData) {
      let obj = {};
      for (let value of insertApprover) {
        obj[value.name] = value.approver;
      }

      // Remove the field from formValue
      delete obj[approverData.name];

      // Update form fields
      form.setFieldsValue(obj);

      // Remove the approver from insertApprover
      newApprover.splice(approverIndex, 1);

      // Update approver names
      const updatedApprover = newApprover.map((item, idx) => ({
        ...item,
        name: `Approver ${idx + 1}`,
      }));

      setInsertApprover(updatedApprover);
      if (newApprover.length > 0) {
        const remainingApprovers = {};
        updatedApprover.forEach((item) => {
          remainingApprovers[item.name] = item.approver;
        });
        form.setFieldsValue(remainingApprovers);
      }
    }
  };

  const handleCancel = () => {
    setModalConfirmasi(false);
    setModalChoosePosition(false);
  };

  const onFinish = async (formValue) => {
    try {
      let bodyRequest;
      let url;
      const {
        id,
        approvalCode,
        approvalName,
        desc,
        approvalType,
        submitter,
        finalApprover,
        ...detail
      } = formValue;
      const dataSubmitter = data_DDL?.data?.filter(
        (a) => a.text === submitter,
      )[0]?.id;
      const datafinalApproval = data_DDL?.data?.filter(
        (a) => a.text === finalApprover,
      )[0]?.id;

      const myArray = Object.keys(detail).map((key) => ({
        positionId: detail[key],
      }));
      const myArrayUpdate = Object.keys(detail).map((key) => ({
        level: key,
        positionId: detail[key],
      }));
      let arrayDetail = type === "create" ? myArray : myArrayUpdate;
      const transformArray = arrayDetail.map((dataArray) => {
        const tempData1 = data_DDL?.data?.filter((item) => {
          return item.text === dataArray.positionId;
        });
        if (type === "update") {
          const filterId = data_detail?.detail?.filter(
            (item) => item?.positionName === dataArray?.level,
          );
          return {
            id: filterId[0]?.id || null,
            positionId: tempData1[0]?.id,
            level: parseInt(dataArray?.level?.split(" ")[1]),
          };
        } else {
          return {
            positionId: tempData1[0]?.id,
          };
        }
      });
      if (type === "update") {
        bodyRequest = {
          ...formValue,
          id: data_detail?.appHierId,
          approvalName: formValue?.approvalName,
          approvalType: formValue?.approvalType,
          desc: formValue?.desc,
          submitter: dataSubmitter,
          finalApprover: datafinalApproval,
          detail: transformArray,
          finalApproverId: data_detail?.detail?.filter(
            (item) => item?.positionName === "Final Approver",
          )[0]?.id,
          submitterId: data_detail?.detail?.filter(
            (item) => item?.positionName === "Submitter",
          )[0]?.id,
        };
        url = "/v1/dbs/api/apphier/validate-update";
      } else {
        bodyRequest = {
          approvalName: formValue?.approvalName,
          approvalType: formValue?.approvalType,
          desc: formValue?.desc,
          submitter: dataSubmitter,
          finalApprover: datafinalApproval,
          detail: transformArray,
        };
        url = "/v1/dbs/api/apphier/validate-create";
      }

      setPayload({
        bodyRequest: bodyRequest,
        validateCreateUpdate: {
          body: bodyRequest,
          services: userHttpService,
          endPoint: url,
          type,
        },
      });

      await dispatch(
        validateCreateUpdate({
          body: bodyRequest,
          services: userHttpService,
          endPoint: url,
          type,
        }),
      )?.unwrap();
      const body = {
        id,
        approvalCode,
        approvalName,
        desc,
        approvalType,
        submitter: dataSubmitter,
        finalApprover: datafinalApproval,
        detail: transformArray,
      };

      const bodyUpdate = {
        ...body,
        finalApproverId: data_detail?.detail?.filter(
          (item) => item?.positionName === "Final Approver",
        )[0]?.id,
        submitterId: data_detail?.detail?.filter(
          (item) => item?.positionName === "Submitter",
        )[0]?.id,
      };
      setBodyFinish(type === "create" ? body : bodyUpdate);
      setModalConfirmasi(true);
    } catch (error) {}
  };

  const handleChoosePosition = (type) => {
    setModalChoosePosition(true);
    setApprovers(type);
    formModal.setFieldsValue({ [type]: formValue[type] });
    handleChangePosition(formValue[type]);
  };
  const handleChangePosition = async (val) => {
    let valueExist = hasValue(val);
    const filterDetailList = Object.assign(
      {},
      ...data_DDL?.data?.filter((item) => item?.text === val),
    );
    if (val) {
      dispatch(getEmployeeByIdPosition(filterDetailList?.id));
      setMandatoryApprover(false);
    } else {
      setDataDetailPositionList([]);
      setMandatoryApprover(true);
    }
  };

  const posisiNameFinal = data_DDL?.data?.find(
    (item) => item.text === formValue?.finalApprover,
  )?.text;
  const posisiName = data_DDL?.data?.find(
    (item) => item.text === formValue?.submitter,
  )?.text;

  const saveApp = () => {
    setModalConfirmasi(false);
    if (type === "update") {
      dispatch(updateAppHier(payload?.bodyRequest));
    } else {
      dispatch(createHierarchy(payload?.bodyRequest));
    }
  };

  const onFinishModal = (formValue) => {
    setInsertApprover((prevState) => {
      let temp = [...prevState];
      const index = temp?.findIndex((item) => item?.name === approvers);
      temp[index] = {
        approver: formValue[approvers],
        name: approvers,
      };
      return temp;
    });
    form.setFieldsValue(formValue);
    setModalChoosePosition(false);
  };
  const handleClear = useCallback(() => {
    if (type === "create") {
      form.resetFields();
      setInsertApprover([]);
    } else {
      dataAssert(data_detail);
    }
  }, [type, form, dataAssert, data_detail]);

  const cancelChoosePosition = () => {
    if (type === "create") {
      hasValue(formValue[approvers]) && form.resetFields([approvers]);
    } else {
      const formattedValue = convertToTitleCase(approvers);
      if (hasValue(formValue[approvers])) {
        // const filteredData = data_detail?.detail?.filter(item => item?.positionName === formattedValue)[0]?.text;
        form.setFieldsValue({ [approvers]: formValue[approvers] });
      } else {
        form.resetFields([approvers]);
      }
    }
    setModalChoosePosition(false);
  };

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "CREATE_APPROVAL_HIEARARCHY") {
      dispatch(createHierarchy(payload?.bodyRequest));
    } else if (bodyError?.action === "UPDATE_APPHIER") {
      dispatch(updateAppHier(payload?.bodyRequest));
    } else if (bodyError?.action === "GET_APPROVAL_HIERARCHY_DETAIL") {
      dispatch(detailPositionHierarchy(id));
    } else if (bodyError?.action === "VALIDATE_CREATE_UPDATE") {
      dispatch(validateCreateUpdate(payload?.validateCreateUpdate));
    } else {
      dispatch(getAppCode());
      dispatch(getAppType());
      dispatch(getPositionDDL());
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <PageHeader breadcrumb={<BreadCrumb routes={routes} />} />
      <Spin spinning={loading || isLoading}>
        <div className="flex w-full justify-end gap-5">
          <NavLink to={""} state={{ x: 1 }}>
            <ButtonComponent
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
              type="submit"
              onClick={handleInsertApprover}
            >
              Create Level
            </ButtonComponent>
          </NavLink>
        </div>
        <BreadCrumb
          pageName={[
            "System Setup",
            `${type === "update" ? " Update" : "Create"} Hierarchy`,
          ]}
        />
        <Form
          form={form}
          layout={"vertical"}
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
        >
          <div className={"flex w-full gap-6"}>
            <BaseContainer header={type === "update" ? "UPDATE" : "CREATE"}>
              <div className="flex flex-col w-full gap-5">
                <div className={"flex w-full gap-3"}>
                  <Form.Item
                    label={"Approval Hierarchy Name"}
                    name={"approvalName"}
                    rules={formMessageRequired("Approval Name")}
                    className="w-full"
                  >
                    <InputComponent disabled={type === "update"} />
                  </Form.Item>
                </div>
                {/* <div className={"flex w-full"}>
                  <Form.Item
                    label={"Approval Hierarchy Code"}
                    name={"approvalCode"}
                    rules={formMessageRequired("Approval Code")}
                    className="w-full"
                  >
                    <SelectComponent>
                      {data_code?.data?.map((index) => (
                        <Option value={index.value}>{index.name}</Option>
                      ))}
                    </SelectComponent>
                  </Form.Item>
                </div> */}
                <div className={"flex w-full"}>
                  <Form.Item
                    label={"Type"}
                    name={"approvalType"}
                    rules={formMessageRequired("Type")}
                    className="w-full"
                  >
                    <SelectComponent>
                      {data_type?.data?.map((index) => (
                        <Option value={index.value}>{index.name}</Option>
                      ))}
                    </SelectComponent>
                  </Form.Item>
                </div>
                <div className={"flex w-full"}>
                  <Form.Item
                    label={"Description"}
                    name={"desc"}
                    className="w-full"
                  >
                    <InputComponent type="textarea" />
                  </Form.Item>
                </div>
              </div>
            </BaseContainer>
            <div className={"basis-2/3"}>
              <BaseContainer header={"Hierarchy"}>
                <div className="flex flex-col w-full gap-5">
                  <div className="flex items-center w-full">
                    <Form.Item
                      label={"Submitter"}
                      name={"submitter"}
                      className="w-full"
                      rules={formMessageRequired("Submitter")}
                    >
                      <Input disabled></Input>
                    </Form.Item>
                    <ButtonComponent
                      icon={<PlusCircleOutlined style={{ fontSize: "24px" }} />}
                      type={"default"}
                      border={false}
                      onClick={() => handleChoosePosition("submitter")}
                    />
                  </div>
                  {insertApprover?.map((item, index) => (
                    <div className="flex items-center w-full" key={index}>
                      <Form.Item
                        // 'Approver 1
                        label={`${item.name}`}
                        // 'Approver 1
                        name={`${item.name}`}
                        className="w-full"
                        rules={formMessageRequired(item?.name)}
                      >
                        <Input
                          disabled
                          // value={selectedValue}
                          // onChange={handleChangePosition}
                        />
                      </Form.Item>
                      <ButtonComponent
                        icon={
                          <PlusCircleOutlined style={{ fontSize: "24px" }} />
                        }
                        type={"default"}
                        border={false}
                        onClick={() => handleChoosePosition(`${item.name}`)}
                      />
                      <ButtonComponent
                        icon={
                          <DeleteOutlined
                            style={{ fontSize: "24px", color: "red" }}
                          />
                        }
                        type={"default"}
                        border={false}
                        onClick={() => handleDeleteApprover(index, item.name)}
                      />
                    </div>
                  ))}
                  <div className="flex items-center w-full">
                    <Form.Item
                      label={"Final Approver"}
                      name={"finalApprover"}
                      className="w-full"
                      rules={formMessageRequired("Final Approver")}
                    >
                      <Input disabled />
                    </Form.Item>
                    <ButtonComponent
                      icon={<PlusCircleOutlined style={{ fontSize: "24px" }} />}
                      type={"default"}
                      border={false}
                      onClick={() => handleChoosePosition("finalApprover")}
                    />
                  </div>
                </div>
              </BaseContainer>
            </div>
          </div>
          <div className={"w-full flex my-5 gap-3"}>
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    justifyItems: "left",
                  }}
                ></LeftOutlined>
              }
            >
              Back
            </ButtonComponent>
            <div className={"w-full justify-end flex gap-3"}>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type={"submit"}
                border={false}
                onClick={handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent type={"submit"} htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>

        <ModalCustom
          isOpen={modalConfirmasi}
          type={"confirmation"}
          header={"CONFIRMATION"}
          handleCancel={handleCancel}
          width={800}
        >
          <div className={"w-full gap-5"}>
            <div className={"grid grid-cols-2"}>
              <div className={"grid grid-cols-1"}>
                <span className="text-primary text-xs">
                  APPROVAL HIERARCHY INFORMATION
                </span>
                <DetailText label={"Approval Hierarchy Name"}>
                  {formValue?.approvalName}
                </DetailText>
                {/* <DetailText label={"Approval Hierarchy Code"}>
                  {formValue?.approvalCode}
                </DetailText> */}
                <DetailText label={"Type"}>
                  {
                    data_type?.data?.filter(
                      (item) => item?.value === formValue?.approvalType,
                    )[0]?.name
                  }
                </DetailText>
                <DetailText label={"Description"}>{formValue?.desc}</DetailText>
              </div>

              <div className={"grid grid-cols-1"}>
                <span className="text-primary text-xs">APPROVAL HIERARCHY</span>
                <DetailText label={"Submitter"}>{posisiName}</DetailText>
                {insertApprover?.map((item, index) => (
                  <DetailText label={`${item.name}`} name={`${item.name}`}>
                    {tampilDataApp(formValue, item.name)}
                  </DetailText>
                ))}
                <DetailText label={"Final Approver"}>
                  {posisiNameFinal}
                </DetailText>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <ButtonComponent onClick={handleCancel} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent onClick={saveApp} type="submit">
                Submit
              </ButtonComponent>
            </div>
          </div>
        </ModalCustom>

        <ModalCustom
          isOpen={modalChoosePosition}
          type={"confirmation"}
          header={"Choose Position"}
          width={500}
          handleCancel={handleCancel}
        >
          <Form onFinish={onFinishModal} layout="vertical" form={formModal}>
            <div className="w-2/3 flex gap-10">
              <Form.Item
                label={"Position"}
                name={approvers}
                rules={formMessageRequired("Position")}
                className="w-full"
              >
                <SelectComponent onChange={(e) => handleChangePosition(e)}>
                  {data_DDL &&
                    formValue &&
                    transformDataDDL(data_DDL, formValue)?.map((ta, key) => (
                      <Option value={ta.text} key={key}>
                        {ta.text}
                      </Option>
                    ))}
                </SelectComponent>
              </Form.Item>
            </div>
            <div className="w-full  gap-5 my-5">
              <Table
                dataSource={dataDetailPositionList}
                size="middle"
                pagination={false}
                columns={columnChoose}
                bordered={true}
              />
            </div>
            <div className="flex justify-end gap-2">
              <ButtonComponent onClick={cancelChoosePosition} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent htmlType="submit" type="submit" onClick>
                Save
              </ButtonComponent>
            </div>
          </Form>
        </ModalCustom>
      </Spin>

      {/* modal back */}
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

      {/* render modal */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default ApprovalHierarchyForm;
