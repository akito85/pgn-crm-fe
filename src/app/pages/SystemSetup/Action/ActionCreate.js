import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Spin, Form } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import React, { useEffect, useState } from "react";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../components/InputComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  createAction,
  getDetailAction,
  updateAction,
} from "../../../../redux/slices/system_setup/action";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { formMessageRequired } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
import userHttpService from "../../../../redux/services/userHttpService";

const ActionCreate = (props) => {
  const { type } = props;
  const { data_detail, loading } = useSelector(
    (state) => state.action
  );
  const { bodyError, isLoading } = useSelector((state) => state?.general);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    if (location.state?.id) {
      dispatch(getDetailAction(location.state?.id));
    }
  }, []);

  useEffect(() => {
    if (location.state?.id) {
      form.setFieldsValue({
        name: data_detail?.name,
        description: data_detail?.description,
      });
    }
  }, [data_detail]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Action",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_ACTION,
      breadcrumbName: "List Action",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Action" : "Create Action"
        }`,
    },
  ];
  const onFinish = async (formValue) => {
    try {
      let body;
      let url;
      if (type === 'update') {
        body = { ...formValue, actionId: location?.state?.id };
        url = '/v1/dbs/api/action/validate-update'
      } else {
        body = formValue
        url = '/v1/dbs/api/action/validate-create'
      }
      setPayload({
        requestBody: body,
        validateCreateUpdate: { body: body, services: userHttpService, endPoint: url, type }
      })
      await dispatch(validateCreateUpdate({ body: body, services: userHttpService, endPoint: url, type }))?.unwrap();
      setFormValues(formValue);
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinishFailed = () => {
    setOpenModal(false);
  };

  const saveAction = async () => {
    try {
      if (type === "update") {
        await dispatch(updateAction(payload?.requestBody))?.unwrap();
      } else {
        await dispatch(createAction(payload?.requestBody))?.unwrap();
      }
      setOpenModal(false);
    } catch (error) {
      setOpenModal(false);

    }
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
    } else {
      form.setFieldsValue({
        name: data_detail?.name,
        description: data_detail?.description,
      });
    }
  };

  const handleRetry = () => {
    handleCancelTryAgain()
    if (bodyError?.action === 'CREATE_ACTION') {
      dispatch(createAction(payload?.requestBody));
    } else if (bodyError?.action === 'UPDATE_ACTION') {
      dispatch(updateAction(payload?.requestBody))
    } else if (bodyError?.action === 'VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateCreateUpdate))
    } else {
      dispatch(getDetailAction(location?.state?.id));
    }
  }
  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Spin spinning={loading || isLoading}>
          <BaseContainer
            header={`${type === "update" ? "UPDATE ACTION" : "CREATE ACTION"}`}
          >
            <div className="flex flex-col w-full gap-2">
              <Form.Item
                label={"Name"}
                name={"name"}
                rules={formMessageRequired("Name")}
                className="max-w-md"
              >
                <InputComponent onInput={(e) =>
                  (e.target.value = e.target.value.trimStart())
                } />
              </Form.Item>
              <div></div>
              <Form.Item
                rules={formMessageRequired("Description")}
                label={"Description"}
                name={"description"}
                className={"w-full"}
              >
                <InputComponent type="textarea" />
              </Form.Item>
            </div>
          </BaseContainer>
        </Spin>
        <div className="mt-[30px] flex">
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
          <div className={"w-full flex justify-end gap-5"}>
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
            <Form.Item>
              <ButtonComponent type="submit" htmlType={"submit"}>
                Submit
              </ButtonComponent>
            </Form.Item>
          </div>
        </div>
      </Form>
      <ModalCustom
        isOpen={openModal}
        handleCancel={() => setOpenModal(false)}
        header={"CONFIRMATION"}
        width={500}
        type={"confirmation"}
      >
        <div className="flex flex-row w-full gap-5">
          <div className={"grid grid-cols-1 gap-3"}>
            <span className="text-dg-blue text-sm gap-5 py-3 px-5">
              ACTION INFORMATION
            </span>
            <div className="grid grid-cols-2 gap-5 px-5">
              <DetailText label={"Action Name"}>{formValues?.name}</DetailText>
              <DetailText label={"Description"}>
                {formValues?.description}
              </DetailText>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <ButtonComponent onClick={() => setOpenModal(false)} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent onClick={saveAction} type="submit">
            Confirm
          </ButtonComponent>
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

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default ActionCreate;
