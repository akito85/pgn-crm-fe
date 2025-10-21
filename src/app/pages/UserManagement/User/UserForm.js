import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Select, Spin } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import InputComponent from "../../../../components/InputComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import {
  createUser,
  getAllAuthType,
  getAllEmployees,
  getAllGroupAccess,
  getAllUserLevel,
  getAllUserType,
  getDetailUpdateUser,
  getEmployeeById,
  updateUser,
} from "../../../../redux/slices/user_management/user";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
} from "../../../../utils";
import SelectComponent from "../../../../components/SelectComponent";
import { useCallback } from "react";
import userHttpService from "../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
const { Option } = Select;
const UserForm = (props) => {
  const { type } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [modalBack, setModalBack] = useState(false);
  const {
    data_employee,
    data_group_access,
    data_user_level,
    data_auth_type,
    data_user_type,
    loading,
    data_user,
    data_employee_id,
  } = useSelector((state) => state.user);
  const { bodyError, isLoading } = useSelector((state) => state?.general);
  const [openModal, setOpenModal] = useState(false);
  const [employeeType, setEmployeeType] = useState("");
  const dataDetail = data_user?.data;
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const id = location?.state?.id;
  const [levelId, setLevelId] = useState();
  const [mandatoryFieldType, setMandatoryFieldType] = useState(false);
  const [disableDate, setDisableDate] = useState(false);
  const [payload, setPayload] = useState({});

  const assert = useCallback(
    (data) => {
      if (data) {
        form.setFieldsValue({
          username: data?.username,
          employeeId: data?.employeeId,
          email: data?.email,
          phone: data?.phone !== null ? data?.phone?.substring(2) : 0,
          startDateUser:
            data?.startDate === null
              ? moment()
              : moment(data?.startDate).clone(),
          endDateUser:
            data?.endDate === null ? "" : moment(data?.endDate).clone(),
          authType: data?.authTypeId,
          userType: data?.userTypeId,
          userLevel: data?.userLevelId,
          description: data?.description,
          gaId: data?.gaId,
          startDateUserGa: hasValue(data?.startDateDetail)
            ? moment(data?.startDateDetail)
            : "",
          endDateUserGa: hasValue(data?.endDateDetail)
            ? moment(data?.endDateDetail)
            : "",
        });
        setEmployeeType(data?.userTypeId);
        setLevelId(data?.userLevelId);
        setMandatoryFieldType(data?.employeeId ? true : false);
        setDisableDate(
          moment(data?.startDateDetail) < moment().add(-1, "days"),
        );
      }
    },
    [form],
  );

  // useEffect
  useEffect(() => {
    if (id) {
      dispatch(getDetailUpdateUser(id));
    }
    dispatch(getAllUserLevel());
    dispatch(getAllAuthType());
    dispatch(getAllUserType());
  }, [dispatch, id]);

  // assert data
  useEffect(() => {
    if (id && dataDetail?.userCode === id) {
      assert(dataDetail);
    }
  }, [assert, dataDetail, id]);

  // get all employee use effect
  useEffect(() => {
    if (hasValue(dataDetail?.employeeId)) {
      dispatch(getAllEmployees(dataDetail?.employeeId));
    } else {
      dispatch(getAllEmployees(0));
    }
  }, [dataDetail, dispatch]);

  useEffect(() => {
    if (id && levelId) {
      dispatch(getAllGroupAccess(levelId));
    }
  }, [levelId, id, dispatch]);

  useEffect(() => {
    if (
      employeeType === "NON_EMP" ||
      employeeType === undefined ||
      form.getFieldValue("employeeId") === undefined
    ) {
      if (id) {
        assert(dataDetail);
      } else {
        form.resetFields(["employeeId", "username", "email", "phone"]);
      }
    }
  }, [data_employee_id, employeeType, form, id, assert, dataDetail]);

  useEffect(() => {
    if (data_employee_id?.code === 200) {
      form.setFieldsValue({
        username: data_employee_id?.data?.email?.split("@")[0],
        email: data_employee_id?.data?.email,
        phone: data_employee_id?.data?.phone?.substring(2),
      });
    }
  }, [data_employee_id, form]);

  const handleCancelConfirmation = () => {
    setOpenModal(false);
  };
  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_USER,
      breadcrumbName: "List User",
    },
    {
      path: "",
      breadcrumbName: type === "update" ? "Update User" : "Create User",
    },
  ];

  const handleSave = async () => {
    setOpenModal(false);
    if (type === "update") {
      await dispatch(updateUser(payload?.requestBody))?.unwrap();
    } else {
      setOpenModal(false);
      await dispatch(createUser(payload?.requestBody))?.unwrap();
    }
  };

  const onFinish = async (values) => {
    try {
      let body;
      let url;
      if (type === "update") {
        body = {
          ...values,
          userId: data_user?.data?.userId,
          groupAccessId: values?.gaId,
          username: values?.username?.toLowerCase(),
          phone: `62${values?.phone}`,
          startDateUser: moment(values?.startDateUser).format("DD MMM YYYY"),
          endDateUser:
            hasValue(values?.endDateUser) === false
              ? null
              : moment(values?.endDateUser).format("DD MMM YYYY"),
          startDateGa: moment(values?.startDateUserGa).format("DD MMM YYYY"),
          endDateGa:
            hasValue(values?.endDateUserGa) === false
              ? null
              : moment(values?.endDateUserGa).format("DD MMM YYYY"),
        };
        url = "/v1/dbs/api/mu/validate-update";
      } else {
        body = {
          ...values,
          groupAccessId: values?.gaId,
          username: values?.username?.toLowerCase(),
          phone: `62${values?.phone}`,
          startDateUser: moment(values?.startDateUser).format("DD MMM YYYY"),
          endDateUser:
            hasValue(values?.endDateUser) === false
              ? null
              : moment(values?.endDateUser).format("DD MMM YYYY"),
          startDateGa: moment(values?.startDateUserGa).format("DD MMM YYYY"),
          endDateGa:
            hasValue(values?.endDateUserGa) === false
              ? null
              : moment(values?.endDateUserGa).format("DD MMM YYYY"),
        };
        url = "/v1/dbs/api/mu/validate-create";
      }
      setPayload({
        requestBody: body,
        validateCreateUpdate: {
          body: body,
          services: userHttpService,
          endPoint: url,
          type,
        },
      });

      await dispatch(
        validateCreateUpdate({
          body: body,
          services: userHttpService,
          endPoint: url,
          type,
        }),
      )?.unwrap();
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinishFailed = () => {
    setOpenModal(false);
  };
  const handleClear = () => {
    if (type === "update") {
      assert(dataDetail);
    } else {
      form.resetFields();
    }
  };

  const getName = () => {
    const userTypeName = data_user_type?.data?.filter(
      (item) => item?.value === formValue?.userType,
    )[0]?.name;
    const authTypeName = data_auth_type?.data?.filter(
      (item) => item?.value === formValue?.authType,
    )[0]?.name;
    const employeeName = data_employee?.data?.filter(
      (item) => item?.id === formValue?.employeeId,
    )[0]?.name;
    const userLevelName = data_user_level?.data?.filter(
      (item) => item?.value === formValue?.userLevel,
    )[0]?.name;
    const gaName = data_group_access?.data?.filter(
      (item) => item?.id === formValue?.gaId,
    )[0]?.name;

    return { userTypeName, authTypeName, employeeName, userLevelName, gaName };
  };

  const RenderPreview = () => (
    <div className="w-full">
      <span className="text-primary uppercase">User Information</span>
      <div className="w-full grid grid-cols-3 gap-5 mt-5 pl-5">
        <DetailText label={"User Type"}>{getName()?.userTypeName}</DetailText>
        <DetailText label={"Employee"}>
          {formValue?.employeeId === undefined ? "" : getName()?.employeeName}
        </DetailText>
        <DetailText label={"Username"}>{formValue?.username}</DetailText>
        <DetailText label={"User Level"}>{getName()?.userLevelName}</DetailText>
        <DetailText label={"Start Date"}>
          {moment(formValue?.startDateUser).format("DD MMM YYYY")}
        </DetailText>
        <DetailText label={"End Date"}>
          {formValue?.endDateUser &&
            moment(formValue?.endDateUser).format("DD MMM YYYY")}
        </DetailText>
        <DetailText label={"Email"}>{formValue?.email}</DetailText>
        <DetailText
          label={"Mobile Phone"}
        >{`62${formValue?.phone}`}</DetailText>
        <DetailText label={"Auth Type"}>{getName()?.authTypeName}</DetailText>
      </div>
      <div className="w-full pl-5">
        <DetailText label={"Description"}>{formValue?.description}</DetailText>
      </div>
      <span className="text-primary uppercase">Group Access</span>
      <div className="w-full grid grid-cols-3 gap-5  mt-5 pl-5">
        <DetailText label={"Group Access"}>{getName()?.gaName}</DetailText>
        <DetailText label={"Start Date"}>
          {moment(formValue?.startDateUserGa).format("DD MMM YYYY")}
        </DetailText>
        <DetailText label={"End Date"}>
          {formValue?.endDateUserGa &&
            moment(formValue?.endDateUserGa).format("DD MMM YYYY")}
        </DetailText>
      </div>
    </div>
  );

  const handleChangeUserType = (value) => {
    const userTypeName = Object.assign(
      {},
      ...data_user_type?.data?.filter((item) => item?.value === value),
    )?.value;
    setEmployeeType(userTypeName);
    setMandatoryFieldType(
      value === undefined || value === "NON_EMP" ? false : true,
    );
  };

  // change user level
  const handleChangeUserLevel = async (id) => {
    form.resetFields(["gaId"]);
    id !== undefined && (await dispatch(getAllGroupAccess(id)).unwrap());
  };
  // handle employee id
  const handleEmployeeId = async (e) => {
    e !== undefined && (await dispatch(getEmployeeById(e)).unwrap());
  };

  const checkDisableDate = (formValue) => {
    if (type === "update" && formValue < moment().add(-1, "days")) {
      return true;
    } else {
      return false;
    }
  };

  const handleChangeGroupAccess = (e) => {
    if (
      type === "update" &&
      formValue.startDateUserGa < moment().add(-1, "days") &&
      e === dataDetail?.gaId
    ) {
      setDisableDate(true);
    } else {
      setDisableDate(false);
    }
  };

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "CREATE_USER") {
      dispatch(createUser(payload?.requestBody));
    } else if (bodyError?.action === "UPDATE_USER") {
      dispatch(updateUser(payload?.requestBody));
    } else if (bodyError?.action === "VALIDATE_CREATE_UPDATE") {
      dispatch(validateCreateUpdate(payload?.validateCreateUpdate));
    } else if (bodyError?.action === "GET_DETAIL_USER" && id) {
      dispatch(getDetailUpdateUser(id));
    } else if (bodyError?.action === "GET_ALL_USER_TYPE") {
      dispatch(getAllUserType());
    } else if (bodyError?.action === "GET_ALL_USER_LEVEL") {
      dispatch(getAllUserLevel());
    } else if (bodyError?.action === "GET_ALL_AUTH_TYPE") {
      dispatch(getAllAuthType());
    } else if (bodyError?.action === "GET_ALL_GROUP_ACCES" && levelId && id) {
      dispatch(getAllGroupAccess(levelId));
    } else {
      dispatch(getAllEmployees(dataDetail?.employeeId || 0));
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <div className={"flex flex-col "}>
        <BreadCrumb routes={routes} />
        <Spin spinning={loading || isLoading}>
          <Form
            layout={"vertical"}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <BaseContainer
              header={type === "update" ? "UPDATE USER" : "CREATE USER"}
            >
              <div className="w-full flex flex-col">
                <div className={"w-full flex flex-col gap-4"}>
                  <div className={"flex w-full gap-5"}>
                    <div className="flex flex-col w-full">
                      <Form.Item
                        label={"User Type"}
                        name={"userType"}
                        rules={formMessageRequired("user type")}
                      >
                        <SelectComponent
                          onChange={(value) => handleChangeUserType(value)}
                        >
                          {data_user_type?.data?.map((item) => (
                            <Option value={item?.value}>{item?.name}</Option>
                          ))}
                        </SelectComponent>
                      </Form.Item>
                      <Form.Item
                        label={"User Level"}
                        name={"userLevel"}
                        rules={formMessageRequired("user level")}
                      >
                        <SelectComponent
                          onChange={(e) => handleChangeUserLevel(e)}
                        >
                          {data_user_level?.data?.map((item) => (
                            <Option value={item?.value}>{item?.name}</Option>
                          ))}
                        </SelectComponent>
                      </Form.Item>
                      <Form.Item
                        label={"Email"}
                        name={"email"}
                        rules={[
                          ...formMessageRequired("Email"),
                          {
                            type: "email",
                            message: "The input is not valid E-mail!",
                          },
                        ]}
                      >
                        <InputComponent
                          disabled={
                            form.getFieldValue("userType") !== "NON_EMP" ||
                            form.getFieldValue("userType") === undefined
                          }
                          maxLength={50}
                        />
                      </Form.Item>
                    </div>
                    <div className={"flex flex-col w-full"}>
                      <Form.Item
                        label={"Employee"}
                        name={"employeeId"}
                        rules={
                          mandatoryFieldType
                            ? formMessageRequired("employee")
                            : undefined
                        }
                      >
                        <SelectComponent
                          onChange={handleEmployeeId}
                          disabled={
                            form.getFieldValue("userType") === "NON_EMP" ||
                            form.getFieldValue("userType") === undefined
                          }
                        >
                          {data_employee?.data?.map((index, key) => (
                            <Option value={index?.id}>{index?.name}</Option>
                          ))}
                        </SelectComponent>
                      </Form.Item>
                      <Form.Item
                        label={"Start Date"}
                        name={"startDateUser"}
                        rules={formMessageRequired("start date")}
                      >
                        <DatePicker
                          format={dateFormatting.dateCapital}
                          disabled={checkDisableDate(formValue?.startDateUser)}
                          disabledDate={(current) => {
                            return (
                              current && current < moment().add(-1, "days")
                            );
                          }}
                          className={"w-full"}
                        />
                      </Form.Item>
                      <Form.Item
                        label={"Mobile Phone"}
                        name={"phone"}
                        rules={formMessageRequired("Mobile Phone")}
                        className={"w-full"}
                      >
                        <Input
                          allowClear
                          addonBefore={"62"}
                          disabled={
                            form.getFieldValue("userType") !== "NON_EMP" ||
                            form.getFieldValue("userType") === undefined
                          }
                          maxLength={11}
                          onInput={(e) =>
                            (e.target.value = e.target.value.replace(
                              /[^\d]|^0+/g,
                              "",
                            ))
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className={"flex flex-col w-full"}>
                      <Form.Item
                        label={"Username"}
                        name={"username"}
                        rules={[
                          ...formMessageRequired("User Name"),
                          {
                            pattern: /^[^\s]+$/,
                            message: "Username contains space",
                          },
                        ]}
                      >
                        <InputComponent
                          disabled={
                            form.getFieldValue("userType") !== "NON_EMP" ||
                            form.getFieldValue("userType") === undefined ||
                            type === "update"
                          }
                        />
                      </Form.Item>
                      <Form.Item label={"End Date"} name={"endDateUser"}>
                        <DatePicker
                          format={dateFormatting.dateCapital}
                          disabledDate={(current) => {
                            if (
                              form.getFieldValue("startDateUser") ===
                                undefined ||
                              form.getFieldValue("startDateUser") === null
                            ) {
                              return (
                                current && current < moment().add(-1, "days")
                              );
                            } else {
                              return (
                                current &&
                                current <
                                  moment(form.getFieldValue("startDateUser"))
                              );
                            }
                          }}
                          className={"w-full"}
                        />
                      </Form.Item>
                      <Form.Item
                        label={"Auth Type"}
                        name={"authType"}
                        rules={formMessageRequired("Auth Type")}
                      >
                        <SelectComponent>
                          {data_auth_type?.data?.map((item) => (
                            <Option value={item?.value}>{item?.name}</Option>
                          ))}
                        </SelectComponent>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className={"w-full"}>
                  <Form.Item label={"Description"} name={"description"}>
                    <InputComponent type="textarea" />
                  </Form.Item>
                </div>
              </div>
            </BaseContainer>
            <BaseContainer header={"GROUP ACCESS USER"}>
              <div className="w-full flex flex-col">
                <div className={"w-full grid grid-cols-3 gap-4"}>
                  <Form.Item
                    label={"Group Access"}
                    name={"gaId"}
                    className={"w-full"}
                    rules={formMessageRequired("group access")}
                  >
                    <SelectComponent onChange={handleChangeGroupAccess}>
                      {data_group_access?.data?.map((item) => (
                        <Option value={item?.id}>{item?.name}</Option>
                      ))}
                    </SelectComponent>
                  </Form.Item>
                  <Form.Item
                    label={"Start Date"}
                    className={"w-full"}
                    name={"startDateUserGa"}
                    rules={formMessageRequired("start date group access")}
                  >
                    <DatePicker
                      format={dateFormatting.dateCapital}
                      disabled={disableDate}
                      disabledDate={(current) => {
                        return current && current < moment().add(-1, "days");
                      }}
                      className={"w-full"}
                    />
                  </Form.Item>
                  <Form.Item
                    label={"End Date"}
                    name={"endDateUserGa"}
                    className={"w-full"}
                  >
                    <DatePicker
                      format={dateFormatting.dateCapital}
                      disabledDate={(current) => {
                        if (
                          form.getFieldValue("startDateUserGa") === undefined ||
                          form.getFieldValue("startDateUserGa") === null
                        ) {
                          return current && current < moment().add(-1, "days");
                        } else {
                          return (
                            current &&
                            current <
                              moment(form.getFieldValue("startDateUserGa"))
                          );
                        }
                      }}
                      className={"w-full"}
                    />
                  </Form.Item>
                </div>
              </div>
            </BaseContainer>
            <div className={"w-full flex my-5"}>
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

              <div className={"w-full justify-end flex gap-2"}>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name={
                        type === "update"
                          ? `IconButtonReset`
                          : `IconButtonClear`
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
        </Spin>
      </div>
      <ModalCustom
        isOpen={openModal}
        handleCancel={handleCancelConfirmation}
        header={"CONFIRMATION"}
        width={900}
        type={"confirmation"}
        footer={
          <div className={"flex w-full justify-end gap-2 mb-5"}>
            <ButtonComponent onClick={handleCancelConfirmation}>
              Cancel
            </ButtonComponent>
            <ButtonComponent type={"submit"} onClick={handleSave}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div className={"w-full flex flex-col"}>
          <div className={"w-full px-9"}>
            <RenderPreview />
          </div>
        </div>
      </ModalCustom>

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

      {/* try again modal */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default UserForm;
