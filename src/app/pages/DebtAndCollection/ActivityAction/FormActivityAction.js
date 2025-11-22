import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { Form, Input, Spin,Select} from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SelectComponent from "../../../../components/SelectComponent";
import {
  getDetailActivityActionPaginate,
  createActivityAction,
  updateActivityAction,
  getActivityNameList
} from "../../../../redux/slices/debt_and_collection/activityAction";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { formMessageRequired, hasValue } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
const { Option } = Select;


const FormActivityAction = (props) => {
  const { type } = props;
  const { dataDetailActivityAction, dataActivityName, loading } = useSelector((state) => state.activityAction);

  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const navigate = useNavigate();
  console.log("Location state:", location?.state);
  const id = location?.state?.id;
  const [payload, setPayload] = useState({});

  const assert = () => {
    console.log("dataDetail", dataDetailActivityAction);
    form.setFieldsValue({
      activityId: dataDetailActivityAction?.activityId,
      resultCode: dataDetailActivityAction?.resultCode,
      description: dataDetailActivityAction?.description
    });
  };
  
  useEffect(() => {
    dispatch(getActivityNameList());
  }, [dispatch])

  // Fetch detail data when in update mode
  useEffect(() => {
    if (id) {
      dispatch(getDetailActivityActionPaginate(id));
    }
  }, [dispatch, id]);

  // Set form values when detail data is available
  useEffect(() => {
    if (type === 'update' ) {
      console.log("Detail data received, setting form values:", dataDetailActivityAction);
      assert();
    }
  }, [dataDetailActivityAction, form, type]);


  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_ACTION,
      breadcrumbName: "Activity Action",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Activity Action" : "Create Activity Action"}`,
    },
  ];


  const saveAction = async () => {
    try {
      setOpenModal(false);
      if (type === "update") {
        
        await dispatch(updateActivityAction({ body: payload?.body, id: id }))?.unwrap()
      }else{
        await dispatch(createActivityAction(payload?.body))?.unwrap()
      }
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinish = async (formValue) => {
    try {
      setPayload({ body: formValue });
      setOpenModal(true);
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

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
    } else {
        assert();
    }
  };


  const handleRetry = () => {
    handleCancelTryAgain()
    if (type === "update") {
        dispatch(updateActivityAction({ body: payload?.body, id: id }))?.unwrap()
    }else{
        dispatch(createActivityAction(payload?.body))?.unwrap()
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form
          form={form}
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className={"flex w-full gap-12 mt-5"}>
            <BaseContainer
              header={type === "update" ? "UPDATE ACTIVITY ACTION" : "CREATE ACTIVITY ACTION"}
            >
              <div className="flex flex-col w-full gap-3">
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Activity Name"}
                      name={"activityId"}
                      className="no-margin-form"
                      rules={formMessageRequired('Activity Name')}
                    >
                      <SelectComponent
                      >
                        {dataActivityName?.data?.map((index, key) => (
                          <Option key={key} value={index.id}>
                            {index.name}
                          </Option>
                        ))}
                      </SelectComponent>
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Result Code"}
                      name={"resultCode"}
                      rules={formMessageRequired("Result Code")}
                      className={"w-full no-margin-form"}
                    >
                      <Input
                        onInput={(e) =>
                          (e.target.value = e.target.value.trimStart())
                        }
                      />
                    </Form.Item>
                  </div>
                  

                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Description"}
                      name={"description"}
                      className={"w-full no-margin-form"}
                    >
                      <Input
                        onInput={(e) =>
                          (e.target.value = e.target.value.trimStart())
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
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
            <span className="text-primary uppercase">Activity Action</span>
          </div>
          <div className={"w-full flex"}>
            <div className={"w-full flex-col"}>
              <DetailText label={"Activity Name"}>{payload?.body?.activityId}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Result Code"}>{payload?.body?.resultCode}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Description"}>{payload?.body?.description}</DetailText>
            </div>
          </div>
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
    </LayoutMenu>
  );
};

export default FormActivityAction;
