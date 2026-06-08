import { LeftOutlined, WarningOutlined, UploadOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Select, Spin, Upload, Button, Space } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import {
  getActions,
  getCreateMenu,
  getMenuDetail,
  getParent,
  updateMenu,
} from "../../../../redux/slices/system_setup/menu";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { formMessageRequired, hasValue } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
const { Option } = Select;

const FormMenu = (props) => {
  const { type } = props;
  const { data_detail, data, data_actions, loading } = useSelector(
    (state) => state.main_Menu
  );
  const { bodyError, isLoading} = useSelector(state => state?.general);


  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const navigate = useNavigate();
  const formValue = form.getFieldsValue();
  const [topPage, setTopPage] = useState(false);
  const [isPage, setIsPage] = useState(false);
  const [actions, setActions] = useState([]);
  const id = location?.state?.id;
  const [payload, setPayload] = useState({});
  const [iconFile, setIconFile] = useState(null);

  // All sidebar-appropriate icons from SVGIcon registry (sorted alphabetically)
  const availableIcons = [
    "IconAccountManagement",
    "IconBilling",
    "IconCalendarEvent",
    "IconHome",
    "IconInvoice",
    "IconJobExecution",
    "IconJobGroup",
    "IconJobList",
    "IconLogHistory",
    "IconMonitoringSession",
    "IconProduct",
    "IconRating",
    "IconReceipt",
    "IconReport",
    "IconReporting",
    "IconSupport",
    "IconSystemSetup",
    "IconUserManagement",
  ];

  const assert = () => {
    form.setFieldsValue({
      name: data_detail?.data?.name,
      menuOrder: data_detail?.data?.menuOrder,
      path: data_detail?.data?.path,
      description: data_detail?.data?.description,
      type: data_detail?.data?.type,
      isPage: data_detail?.data?.isPage,
      isTopParent: data_detail?.data?.isTopParent,
      parentName:
        data_detail?.data?.parentId === 0 ? "" : data_detail?.data?.parentId,
      actions: data_detail?.data?.actions.map((action) => action.actionId),
      icon: data_detail?.data?.icon,
    });
    setIsPage(data_detail?.data?.isPage);
    setTopPage(data_detail?.data?.isTopParent);
  };


  useEffect(() => {
    dispatch(getParent());
    dispatch(getActions());
    if (id) {
      dispatch(getMenuDetail(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (type === 'update' && data_detail && data) {
      assert();
    }
  }, [data_detail, data, form, type]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_MENU,
      breadcrumbName: "List Menu",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Menu" : "Create Menu"}`,
    },
  ];


  const saveAction = async () => {
    try {
      setOpenModal(false);
      if (type === "update") {
        await dispatch(
          updateMenu(payload?.body)
        )?.unwrap();
      } else {
        await dispatch(
          getCreateMenu(payload?.body)
        )?.unwrap();
      }
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinish = async (formValue) => {
    try {
      let body;
      let validateCreateUpdateObj = {};
      if (type === 'update') {
        body = {
          name: formValue.name,
          menuOrder: formValue.menuOrder,
          path: formValue.path,
          description: formValue.description,
          isTopParent: hasValue(formValue?.isTopParent) ? formValue.isTopParent : false,
          isPage: hasValue(formValue.isPage) ? formValue.isPage : false,
          parentId: formValue?.isPage === true ? formValue?.parentName : null,
          menuId: location?.state.id,
          actions: hasValue(formValue?.actions) && Array.isArray(formValue?.actions) ? formValue?.actions : [],
          icon: formValue.icon || null
        }
        validateCreateUpdateObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/menus/validate-update', type }
      } else {
        body = {
          name: formValue.name,
          menuOrder: formValue.menuOrder,
          path: formValue.path,
          description: formValue.description,
          isTopParent: hasValue(formValue?.isTopParent) ? formValue.isTopParent : false,
          isPage: hasValue(formValue.isPage) ? formValue.isPage : false,
          parentId: formValue?.isPage === true ? formValue?.parentName : null,
          actions: hasValue(formValue?.actions) && Array.isArray(formValue?.actions) ? formValue?.actions : [],
          icon: formValue.icon || null
        }
        validateCreateUpdateObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/menus/validate-create', type }
      }
      setPayload(
        {
          body: body,
          validateValue: validateCreateUpdateObj
        }
      )
      await dispatch(validateCreateUpdate(validateCreateUpdateObj))?.unwrap()
      setOpenModal(true)
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinishFailed = () => {
    setOpenModal(false);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleTopPage = (e) => {
    setTopPage(e.target.checked);
    if (form.getFieldValue('isTopParent') === true) {
      form.resetFields(['actions', 'isPage', 'parentName']);
      setActions([]);
      setTopPage(true);
    } else {
      form.setFieldsValue({ isPage: true });
      setTopPage(false);
    }
  };
  const handlePage = (e) => {
    setIsPage(e.target.checked);
    if (form.getFieldValue('isPage') === true) {
      form.setFieldsValue({ isTopParent: false });
      setActions([])
      setTopPage(false)
    } else {
      form.resetFields(['actions', 'parentName']);
      form.setFieldsValue({ isTopParent: true });
      setTopPage(true)
    }
  };
  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setTopPage(false);
      setActions([]);
    } else {
      setActions([]);
      assert();
    }
  };


  const handleRetry = () => {
    handleCancelTryAgain()
    if (bodyError?.action === 'CREATE_MENU') {
      dispatch(getCreateMenu(payload?.body));
    } else if (bodyError?.action === 'UPDATE_MENU') {
      dispatch(updateMenu(payload?.body))
    } else if (bodyError?.action === 'GET_MENU_DETAIL') {
      dispatch(getMenuDetail(id))
    } else if (bodyError?.action === 'VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateValue))
    } else {
      dispatch(getParent());
      dispatch(getActions());
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  const handleIconUpload = (file) => {
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      form.setFieldsValue({ icon: reader.result });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleIconSelect = (value) => {
    // Clear uploaded file when user picks from the dropdown instead
    setIconFile(null);
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading || isLoading}>
        <Form
          form={form}
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className={"flex w-full gap-6 mt-5"}>
            <BaseContainer
              header={type === "update" ? "UPDATE MENU" : "CREATE MENU"}
            >
              <div className="flex flex-col w-full gap-3">
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Menu Name"}
                      name={"name"}
                      rules={formMessageRequired("Menu Name")}
                      className={"w-full no-margin-form"}
                    >
                      <Input
                        onInput={(e) =>
                          (e.target.value = e.target.value.trimStart())
                        }
                        disabled={type === "update"}
                      />
                    </Form.Item>
                    <Form.Item name={"isTopParent"} valuePropName="checked">
                      <Checkbox onChange={handleTopPage} value={topPage} disabled={form.getFieldValue('isPage')}>
                        Top Parent{" "}
                      </Checkbox>
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Parent Menu"}
                      name={"parentName"}
                      className="no-margin-form"
                      rules={formValue?.isPage && formMessageRequired('Parent Menu')}
                    >
                      <SelectComponent
                        disabled={
                          type === "update" ? formValue?.isTopParent : topPage
                        }
                      >
                        {data?.data?.map((index, key) => (
                          <Option key={key} value={index.menuId}>
                            {index.name}
                          </Option>
                        ))}
                      </SelectComponent>
                    </Form.Item>
                    <Form.Item name={"isPage"} valuePropName="checked">
                      <Checkbox onChange={handlePage} value={isPage} disabled={topPage}>
                        {" "}
                        Page{" "}
                      </Checkbox>
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-5"}>
                  <Form.Item
                    label={"Order"}
                    name={"menuOrder"}
                    className="w-full"
                    rules={formMessageRequired('Order')}
                  >
                    <Input
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={"Path"}
                    name={"path"}
                    rules={formMessageRequired("Path")}
                    className="w-full"
                  >
                    <Input
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\s+/g, ""))
                      }
                      disabled={type === "update"}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label={"Description"}
                  name={"description"}
                  // rules={formMessageRequired("Description")}
                  className="w-full"
                >
                  <InputComponent type="textarea" />
                </Form.Item>
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                  <label className="font-semibold text-sm">Icon Management</label>

                  <Form.Item
                    label={"Select Icon"}
                    name={"icon"}
                    className="w-full"
                  >
                    <SelectComponent
                      placeholder="Choose from available icons"
                      onChange={handleIconSelect}
                      allowClear
                    >
                      <Option key="none" value="">
                        <Space size="small">
                          <span style={{ display: "inline-block", width: 16 }} />
                          <span style={{ color: "#8D91A0" }}>(No Icon)</span>
                        </Space>
                      </Option>
                      {availableIcons.map((icon) => (
                        <Option key={icon} value={icon}>
                          <Space size="small">
                            <SVGIcon name={icon} width={16} />
                            <span>{icon}</span>
                          </Space>
                        </Option>
                      ))}
                    </SelectComponent>
                  </Form.Item>

                  <div className="border-t pt-3">
                    <label className="text-sm font-medium block mb-2">Or Upload Custom Icon</label>
                    <Upload
                      accept="image/*,.svg"
                      maxCount={1}
                      beforeUpload={handleIconUpload}
                      onRemove={() => {
                        setIconFile(null);
                        form.setFieldsValue({ icon: undefined });
                      }}
                    >
                      <Button icon={<UploadOutlined />}>
                        Upload Icon File
                      </Button>
                    </Upload>
                  </div>
                </div>
              </div>
            </BaseContainer>
            <BaseContainer header={"ACTIONS"}>
              <Form.Item name={"actions"} valuePropName="checked" rules={formValue?.isPage && formMessageRequired('Actions')}>
                <Checkbox.Group
                  value={formValue.actions}
                  onChange={(checkedValues) => setActions(checkedValues)}
                  className="w-full"
                  disabled={
                    form.getFieldValue("isPage") === undefined ||
                    form.getFieldValue("isPage") === false
                  }
                >
                  <div className={"w-full grid grid-cols-2 gap-3"}>
                    {data_actions?.data?.map((item) => (
                      <Checkbox
                        key={item.actionId}
                        value={item.actionId}
                      // You can disable checkboxes based on your condition
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </Form.Item>
            </BaseContainer>
          </div>
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
            <div className={"w-full justify-end flex gap-5"}>
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
      </Spin>

      <ModalCustom
        isOpen={openModal}
        header={"CONFIRMATION"}
        width={500}
        type={"confirmation"}
        handleCancel={handleCancel}
      >
        <div className="w-full flex flex-col flex-wrap gap-y-3">
          <div className="w-full">
            <span className="text-primary uppercase">Menu Information</span>
          </div>
          <div className={"w-full flex"}>
            <div className={"w-full flex-col"}>
              <DetailText label={"Menu Name"}>{payload?.body?.name}</DetailText>
              <DetailText label={"Path"}>{payload?.body?.path}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Type"}>
                {payload?.body?.isTopParent === true ? "Top Parent" : "Child"}
              </DetailText>
              <DetailText label={"Action"}>{
                payload?.body?.actions?.length > 0 &&
                data_actions?.data?.filter(item => payload?.body?.actions?.includes(item?.actionId))?.map(item => item?.name)?.join(', ')
              }</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Parent Menu"}>{
                hasValue(payload?.body?.parentId) && data?.data?.find(item => item?.menuId === payload?.body?.parentId)?.name
              }</DetailText>
              <DetailText label={"Order"}>{payload?.body?.menuOrder}</DetailText>
            </div>
          </div>
          <div className="w-full">
            <DetailText label={"Description"}>{payload?.body?.description}</DetailText>
          </div>
          {payload?.body?.icon && (
            <div className="w-full border-t pt-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Icon:</span>
                <SVGIcon name={payload?.body?.icon} width={20} />
                <span className="text-sm">{payload?.body?.icon}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-5">
          <ButtonComponent onClick={handleCancel} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent onClick={saveAction} type="submit">
            Confirm
          </ButtonComponent>
        </div>
      </ModalCustom>

      {/* modal Back */}
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

      {/* render modal try again */}
      {renderModal()}
    </>
  );
};

export default FormMenu;
