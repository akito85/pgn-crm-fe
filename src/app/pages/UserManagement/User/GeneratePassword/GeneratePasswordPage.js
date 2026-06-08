import {
  LeftOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Form, InputNumber, Radio, Spin, Tooltip } from "antd";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { USER_ROUTES } from "../../../../../routes/user_management/user_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import { generatePasswordLink } from "../../../../../redux/slices/user_management/user";
import { ModalSuccess } from "../../../../../components/Modal/ModalPopUp";
import ModalBack from "../../../../../components/Modal/ModalBack";
import { formMessageRequired, hasValue } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
const GeneratePasswordPage = () => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const { loading, data_generate_link } = useSelector((state) => state.user);
  const [customValue, setCustomValue] = useState(1);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const location = useLocation();
  const id = location?.state?.id;
  const data = data_generate_link;
  const dataSplit = hasValue(data?.url) && data?.url?.split('/')
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [form] = Form.useForm();
  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_USER,
      breadcrumbName: "User",
    },
    {
      path: "",
      breadcrumbName: "Generate Link Password",
    },
  ];

  const onFinish = async (formValue) => {
    const customValueFrom =
      formValue.expTime === "Custome" ? customValue : formValue.expTime;
    const body = {
      remark: formValue.remark,
      userId: id,
      expTime: customValueFrom,
    };
    try {
      await dispatch(generatePasswordLink(body)).unwrap();
      setModalSuccess(true);
    } catch (error) {
      // console.error("Failed to generate password link:", error);
    }
  };

  const copyToClipboard = () => {
    const url = data?.url;
    if (hasValue(url)) {
      navigator?.clipboard?.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      });
    } else {
      fallbackCopy(url);
    }
  };

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Optionally show an error message
    }
    document.body.removeChild(textarea);
  }

  const handleChangeExpired = (e) => {
    if (e.target.value === "Custome") {
      setDisabled(false);
    } else {
      setDisabled(true);
      setCustomValue(null);
      form.setFieldsValue({ customeTime: null });
    }
  };

  const handleCloseModalSuccess = () => {
    setModalSuccess(false);
  };
  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <BaseContainer header={"GENERATE LINK PASSWORD"}>
            <div className={"w-full grid grid-cols-2 gap-8"}>
              <Form.Item
                label={"Remark"}
                name={"remark"}
                rules={formMessageRequired('Remark')}
              >
                <InputComponent />
              </Form.Item>
              <div className={"w-full flex flex-col"}>
                <label className="block mb-2">Set Expiration Time</label>
                <div className={"w-full flex items-center gap-2"}>
                  <Form.Item
                    className={"flex-1"}
                    name={"expTime"}
                    rules={formMessageRequired('Set Expiration Time')}
                  >
                    <Radio.Group onChange={handleChangeExpired}>
                      <Radio value={1}> 1 Min </Radio>
                      <Radio value={5}> 5 Min </Radio>
                      <Radio value={10}> 10 Min </Radio>
                      <Radio value={15}> 15 Min </Radio>
                      <Radio value={"Custome"}> Custome</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name={"customeTime"}>
                    <InputNumber
                      type={"number"}
                      disabled={disabled}
                      onChange={setCustomValue}
                      prefix={"Min"}
                      min={1}
                      // style={{
                      //   width: "100%",
                      // }}
                      controls={false}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </BaseContainer>
          <div className="mt-[30px] flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                icon={<SVGIcon name="IconButtonClear" width={24} />}
                type={"submit"}
                border={false}
                onClick={() => {
                  form.resetFields();
                }}
              >
                Clear
              </ButtonComponent>
              <ButtonComponent type={"submit"} htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
      </Spin>
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={handleCloseModalSuccess}
        handleCancel={handleCloseModalSuccess}
        width={400}
      >
        <div className="w-full px-6">
          <div className="flex items-center justify-center my-5">
            <SVGIcon name="IconSuccess" width={62} />
            <div className="w-full flex flex-col ml-5 my-4 justify-center">
              <span className="font-bold text-[18px]">
                Generate link successful
              </span>
              <span>
                Your password link has been generated.
              </span>
            </div>
          </div>
          <div className="flex items-center rounded-md bg-[#E6F1F9] py-3 px-5 my-5">
            <Link
              to={`/new-password/${dataSplit[dataSplit?.length - 1]}`}
              className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis"
            >
              <Tooltip title={data?.url}>
                <span className="text-[var(--primary)]">{data?.url}</span>
              </Tooltip>
            </Link>
            <CopyOutlined
              style={{
                color: 'var(--primary)',
                fontSize: 24,
              }}
              onClick={copyToClipboard}
            />
          </div>
          {copied && (
            <p className="text-primary mt-2 ml-5">
              Link copied to clipboard!
            </p>
          )}
        </div>
      </ModalSuccess>
    </>
  );
};

export default GeneratePasswordPage;
