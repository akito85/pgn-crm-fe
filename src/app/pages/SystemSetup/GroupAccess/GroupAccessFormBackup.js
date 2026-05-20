import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { Form, Select, Space, Spin, Tree } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  createGroupAccess,
  detailGroupAccess,
  getAllGroupAccessMenu,
  getAllUserLevel,
  updateGroupAccess,
} from "../../../../redux/slices/system_setup/group_access";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../components/InputComponent";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { formMessageRequired } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { useGroupAccessHooks } from "./useGroupAccessHooks";

const GroupAccessForm = (props) => {
  const { type } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    data_detail,
    dataMenu,
    dataUserLevel,
    loading,
    loading_group_access,
  } = useSelector((state) => state.groupAccess);
  const { bodyError } = useSelector((state) => state?.general);
  const {
    transformTreeActions,
    transformDataDetailActions,
    transformGaMenuSelectedKeys,
    onCheckingKeys,
    transformBodyActions,
    detailActions,
    selectedKeys,
    clearAllState,
  } = useGroupAccessHooks();
  const [menu, setMenu] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const [description, setDescription] = useState("");
  const id = location?.state?.id;
  const [payload, setPayload] = useState({});
  useEffect(() => {
    dispatch(getAllGroupAccessMenu());
    dispatch(getAllUserLevel());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(detailGroupAccess(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (dataMenu) {
      setMenu(transformTreeActions(dataMenu));
    }
  }, [dataMenu, transformTreeActions]);

  useEffect(() => {
    if (id && data_detail && menu && menu.length > 0) {
      const resMenu = transformDataDetailActions(data_detail?.gaMenu);
      transformGaMenuSelectedKeys(menu, resMenu);
    }
  }, [
    menu,
    id,
    form,
    data_detail,
    transformDataDetailActions,
    transformGaMenuSelectedKeys,
  ]);

  useEffect(() => {
    if (id && dataUserLevel && dataUserLevel.length > 0 && data_detail) {
      /** set to form value */
      form.setFieldsValue({
        gaId: data_detail?.gaId,
        name: data_detail?.name,
        description: data_detail?.description,
        userLevel: data_detail?.userLevel,
      });
    }
  }, [id, form, data_detail, dataUserLevel, menu]);

  useEffect(() => {
    if (detailActions && id) {
      form.setFieldsValue({
        mApprovalHierarchyDtl: detailActions,
      });
    }
  }, [detailActions, form, id]);
  // const onFilterSearch = (values) => {
  //   if (Array.isArray(values) && values?.length > 0) {
  //     const dataMenus = transformDataAllMenu(dataMenu);
  //     const filteredMenu = dataMenus?.filter((item) =>
  //       values?.includes(item?.menuId)
  //     );
  //     setMenu(filteredMenu);
  //   } else {
  //     if (selectedKeys?.length > 0) {
  //       setSelectedKeys(selectedKeys);
  //     }
  //     setMenu(transformDataAllMenu(dataMenu));
  //   }
  // };

  const onFinish = async (FormValue) => {
    try {
      let body;
      let validateValueObj;
      // // give gaMenuId if undefined
      // for (let itemArrayForm of FormValue?.mApprovalHierarchyDtl) {
      //   let matchedItem = data_detail?.gaMenu.find(
      //     (detailedItem) => detailedItem.menuId === itemArrayForm.menuId
      //   );
      //   if (matchedItem) {
      //     itemArrayForm.gaMenuId = matchedItem.gaMenuId;
      //   }
      // }
      if (type === "update") {
        transformBodyActions(detailActions);
        body = {
          name: FormValue.name,
          description: FormValue.description,
          userLevel: FormValue?.userLevel,
          gaId: id,
          menu: transformBodyActions(detailActions),
          // menu: FormValue.mApprovalHierarchyDtl.map((menu) => {
          //   return {
          //     gaMenuId: menu.gaMenuId,
          //     menuId: menu.menuId,
          //     actionList: menu.children.map((action) => action.id),
          //   };
          // }),
        };

        validateValueObj = {
          body: body,
          services: userHttpService,
          endPoint: "/v1/dbs/api/ga/validate-update",
          type,
        };
      } else {
        body = {
          name: FormValue.name,
          description: FormValue.description,
          userLevel: FormValue?.userLevel,
          // menu: FormValue.mApprovalHierarchyDtl.map((menu) => {
          //   return {
          //     menuId: menu.menuId,
          //     actionList: menu.children.map((action) => action.id),
          //   };
          // }),
        };
        validateValueObj = {
          body: body,
          services: userHttpService,
          endPoint: "/v1/dbs/api/ga/validate-create",
          type,
        };
      }
      setPayload({
        body: body,
        validateValue: validateValueObj,
      });
      await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
      setModalConfirm(true);
    } catch (error) {
      setModalConfirm(false);
    }
  };

  const onFinishFailed = (e) => {
    setModalConfirm(false);
  };
  const handleCancelConfirm = () => {
    setModalConfirm(false);
  };

  const handleSave = () => {
    // give gaMenuId if undefined
    for (let itemArrayForm of formValue?.mApprovalHierarchyDtl) {
      let matchedItem = data_detail?.gaMenu.find(
        (detailedItem) => detailedItem.menuId === itemArrayForm.menuId
      );
      if (matchedItem) {
        itemArrayForm.gaMenuId = matchedItem.gaMenuId;
      }
    }
    const successBody = {
      title: `${type === "update" ? "Update" : "Create"} successful`,
      description: `Your data has been ${
        type === "update" ? "updated" : "created"
      }.`,
    };

    handleCancelConfirm();
    if (type === "update") {
      dispatch(
        updateGroupAccess({
          body: payload?.body,
          responseSuccess: successBody,
        })
      )
        .unwrap()
        .then(() => {
          form.resetFields();
          clearAllState();
        })
        .finally(() => {
          setModalConfirm(false);
        });
    } else {
      dispatch(
        createGroupAccess({
          body: payload?.body,
          responseSuccess: successBody,
        })
      )
        .unwrap()
        .then(() => {
          form.resetFields();
          clearAllState();
        })
        .finally(() => {
          setModalConfirm(false);
        });
    }
  };

  const handleClear = () => {
    clearAllState();
    if (type === "create") {
      form.resetFields();
    } else {
      dispatch(detailGroupAccess(id));
    }
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_GROUP_ACCESS,
      breadcrumbName: "Group Access",
    },
    {
      path: "",
      breadcrumbName: `${
        type === "update" ? "Update Group Access" : "Create Group Access"
      }`,
    },
  ];

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "CREATE_GROUP_ACCESS") {
      dispatch(createGroupAccess(payload));
    } else if (bodyError?.action === "UPDATE_GROUP_ACCESS") {
      dispatch(updateGroupAccess(payload));
    } else {
      dispatch(detailGroupAccess(id));
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <>
      <Spin spinning={loading || loading_group_access}>
        <BreadCrumb routes={routes} />
        <Form
          form={form}
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className={"flex w-full gap-6 mt-5"}>
            <BaseContainer
              header={
                type === "update"
                  ? "UPDATE GROUP ACCESS"
                  : "CREATE GROUP ACCESS"
              }
            >
              <div className="flex flex-col w-full gap-3">
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      name={"name"}
                      rules={formMessageRequired("name")}
                      className={"w-full no-margin-form"}
                      label={"Group Access Name"}
                      required
                    >
                      <InputComponent type="text" />
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      name={"userLevel"}
                      rules={formMessageRequired("user Level")}
                      className="no-margin-form"
                      label={"User Level"}
                      required
                    >
                      {/* {dataUserLevel && dataUserLevel.length > 0 && ( */}
                      <SelectComponent>
                        {dataUserLevel?.map((level) => (
                          <Select.Option key={level.id} value={level.value}>
                            {level.name}
                          </Select.Option>
                        ))}
                      </SelectComponent>
                      {/* )} */}
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-5"}>
                  <Form.Item
                    name={"description"}
                    rules={formMessageRequired("Description")}
                    className="w-full"
                    label={"Description"}
                    required
                  >
                    <InputComponent
                      type="textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></InputComponent>
                  </Form.Item>
                </div>
              </div>
            </BaseContainer>

            <div className={"basis-2/3"}>
              <BaseContainer header={"Menu Access"}>
                {/* <SelectComponent onChange={onFilterSearch} mode={'multiple'}>
                  {dataMenu?.map(item => (
                    <Select.Option value={item?.menuId}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent> */}
                <Form.Item
                  name={"mApprovalHierarchyDtl"}
                  rules={[
                    {
                      validator: () => {
                        if (detailActions?.length === 0) {
                          return Promise.reject(
                            "Please input your Menu Access!"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Tree
                    checkStrictly
                    checkable
                    defaultExpandAll
                    height={384}
                    checkedKeys={selectedKeys}
                    onCheck={(key, info) => {
                      onCheckingKeys(info.checked, info.node);
                    }}
                    treeData={menu || []}
                  />
                </Form.Item>
              </BaseContainer>
            </div>
          </div>

          <div className={"w-full flex my-5"}>
            <div>
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
            </div>
            <div className={"w-full justify-end flex"}>
              <Space direction="horizontal" size={"small"}>
                <ButtonComponent
                  type={"submit"}
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
                  border={false}
                  onClick={handleClear}
                >
                  {type === "update" ? "Reset" : "Clear"}
                </ButtonComponent>
                <ButtonComponent type={"submit"} htmlType={"submit"}>
                  Save
                </ButtonComponent>
              </Space>
            </div>
          </div>
        </Form>

        {/** Modal Confirm */}
        <ModalCustom
          isOpen={modalConfirm}
          header={"CONFIRMATION"}
          width={1000}
          type={"confirmation"}
          handleCancel={handleCancelConfirm}
          footer={
            <div className="w-full flex justify-end gap-5 mb-5">
              <ButtonComponent onClick={handleCancelConfirm} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent onClick={handleSave} type="submit">
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <div className="w-full flex flex-col flex-wrap gap-y-3">
            <div className="w-full">
              <span className="text-primary uppercase  font-semibold">
                GROUP ACCESS INFORMATION
              </span>
            </div>
            <div className={"w-full flex gap-5"}>
              <div className={"w-full grid grid-cols-3"}>
                <DetailText label={"Group Access Name"}>
                  {formValue?.name}
                </DetailText>
                <DetailText label={"User Level"}>
                  {formValue?.userLevel &&
                    dataUserLevel &&
                    dataUserLevel.filter(
                      (userLevel) => userLevel.value === formValue?.userLevel
                    )[0]?.name}
                </DetailText>
                <DetailText label={"Description"}>
                  {formValue?.description}
                </DetailText>
              </div>
            </div>

            <div className="w-full">
              <span className="text-primary uppercase gap-10 font-semibold">
                MENU ACCESS
              </span>
            </div>
            <div className={"w-full flex-col gap-10"}>
              <div className="grid grid-cols-4 gap-2">
                {formValue?.mApprovalHierarchyDtl &&
                  formValue?.mApprovalHierarchyDtl.length > 0 &&
                  formValue?.mApprovalHierarchyDtl.map((res) => (
                    <div key={res.title}>
                      <Tree treeData={[res]} height={159} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ModalCustom>
      </Spin>

      {/* modalback */}
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
    </>
  );
};
export default GroupAccessForm;
