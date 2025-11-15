import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { Form, Input, Spin,InputNumber } from "antd";
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
import {
  getDetailTemplateRemindingPaginate,
  createUpdateTemplateReminding,
  validateCreateUpdateTemplateReminding
} from "../../../../redux/slices/debt_and_collection/templateReminding";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { formMessageRequired, hasValue } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";

const FormTemplateReminding = (props) => {
  const { type } = props;
  const { dataDetailTemplateReminding,  loading } = useSelector((state) => state.templateReminding);


  const location = useLocation();

  // console.log("location", location);
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [payload, setPayload] = useState({});

  const assert = () => {
    console.log("dataDetail", dataDetailTemplateReminding);
    form.setFieldsValue({
      remindingType: dataDetailTemplateReminding?.remindingType,
      content: dataDetailTemplateReminding?.content,
      emailSubject: dataDetailTemplateReminding?.emailSubject,
      emailBody: dataDetailTemplateReminding?.emailBody,
      templateCode: dataDetailTemplateReminding?.templateCode,
    });
  };

  // call id 
  useEffect(() => {
    if (id) {
      // console.log("id", id);
      dispatch(getDetailTemplateRemindingPaginate(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // jika type update maka set form dengan data detail
    if (type === 'update') {
      assert();
    }
  }, [dataDetailTemplateReminding, form, type]);


  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_TEMPLATE_REMINDING,
      breadcrumbName: "Template Reminding",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Template Reminding" : "Create Template Reminding"}`,
    },
  ];


  const saveAction = async () => {
    try {
      setOpenModal(false);
      if (type === "update") {
        const bodyUpdate = {
          ...payload?.body,
          id: dataDetailTemplateReminding?.id,
        };
        await dispatch(createUpdateTemplateReminding(bodyUpdate))?.unwrap()
      }else{
        await dispatch(createUpdateTemplateReminding(payload?.body))?.unwrap()
      }
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinish = async (formValue) => {
    try {
      const dataValue = {
        remindingType: formValue.remindingType,
        content: formValue.content,
        emailSubject: formValue.emailSubject,
        emailBody: formValue.emailBody,
        templateCode: formValue.templateCode
      };
      
      const bodyValidasiUpdate = {
        ...dataValue,
        id: dataDetailTemplateReminding?.id,
      };

      setPayload(
        {
          body: formValue
        }
      )
      if (type !== "update") {
        dispatch(validateCreateUpdateTemplateReminding(dataValue))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setOpenModal(false);
            }
            setOpenModal(true);
          });
      }
      dispatch(validateCreateUpdateTemplateReminding(bodyValidasiUpdate))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setOpenModal(false);
          }
          setOpenModal(true);
        });

      

      // console.log("payload", { body: formValue });
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
    dispatch(createUpdateTemplateReminding(payload?.body));
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
              header={type === "update" ? "UPDATE TEMPLATE REMINDING" : "CREATE TEMPLATE REMINDING"}
            >
              <div className="flex flex-col w-full gap-4">

                {/* Baris: Type + Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Type */}
                  <Form.Item
                    label="Reminding Type"
                    name="remindingType"
                    rules={formMessageRequired("Reminding Type")}
                    className="w-full no-margin-form"
                  >
                    <Input
                      onChange={(e) => (e.target.value = e.target.value.trimStart())}
                    />
                  </Form.Item>

                  {/* Content (string) */}
                  <Form.Item
                    label="Content"
                    name="content"
                    className="w-full no-margin-form"
                  >
                    <Input
                      onChange={(e) => (e.target.value = e.target.value.trimStart())}
                    />
                  </Form.Item>
                </div>

                {/* Email Subject (vertikal) */}
                <Form.Item
                  label="Email Subject"
                  name="emailSubject"
                  className="w-full no-margin-form"
                >
                  <Input
                    onChange={(e) => (e.target.value = e.target.value.trimStart())}
                  />
                </Form.Item>

                {/* Email Body (vertikal) */}
                <Form.Item
                  label="Email Body"
                  name="emailBody"
                  className="w-full no-margin-form"
                >
                  <Input
                    onChange={(e) => (e.target.value = e.target.value.trimStart())}
                  />
                </Form.Item>

                {/* Template Code */}
                <Form.Item
                  label="Template Code"
                  name="templateCode"
                  rules={formMessageRequired("Template Code")}
                  className="w-full"
                >
                  <InputComponent type="textarea" />
                </Form.Item>

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
            <span className="text-primary uppercase">Template Reminding</span>
          </div>
          <div className={"w-full flex"}>
            <div className={"w-full flex-col"}>
              <DetailText label={"Reminding Type"}>{payload?.body?.remindingType}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Content"}>{payload?.body?.content}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Email Subject"}>{payload?.body?.emailSubject}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Email Body"}>{payload?.body?.emailBody}</DetailText>
            </div>
          </div>
          <div className="w-full">
            <DetailText label={"Template Code"}>{payload?.body?.templateCode}</DetailText>
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

export default FormTemplateReminding;
