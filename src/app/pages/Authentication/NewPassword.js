import React, { useState } from "react";
import { Form, Input, Card, Spin, Tooltip, Button, Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { bgLogin, pgnLogo } from "../../../assets/img";
import { useDispatch, useSelector } from "react-redux";
import {
  checkCredential,
  checkValidateLink,
  confirmNewPassword,
} from "../../../redux/slices/user_management/auth";
import { ModalError, ModalSuccess } from "../../../components/Modal/ModalPopUp";
import {
  hideModalError,
  hideModalSuccess,
} from "../../../redux/slices/general_slice";
import SVGIcon from "../../../assets/Icon/index.js";
import { useEffect } from "react";
const NewPassword = () => {
  const { loading, data } = useSelector((state) => state?.auth);
  const { bodyError, modalError, bodySuccess, modalSuccess } = useSelector(
    (state) => state.general,
  );
  const params = useParams();
  const navigate = useNavigate();
  const urlDecrypt = Object.values(params)[0];
  const dispatch = useDispatch();
  const [isMatches, setIsMatches] = useState(true);
  const [isNotValid, setIsNotValid] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  // console.log(Object.values(params), ' params');
  // use effect
  useEffect(() => {
    dispatch(checkValidateLink(urlDecrypt));
  }, [dispatch, urlDecrypt]);

  useEffect(() => {
    dispatch(checkCredential());
  }, [dispatch]);

  const handleCloseModalSuccess = () => {
    dispatch(hideModalSuccess());
    navigate("/");
  };
  const handleCloseModalError = () => {
    dispatch(hideModalError());
    if (bodyError?.description === "Link is expired") {
      navigate("/");
    }
  };
  const handleSave = async (formValue) => {
    if (formValue.newPassword === formValue.confirmNewPassword) {
      if (
        data?.pComplexity === "true" &&
        validatePassword(formValue.newPassword)
      ) {
        setIsNotValid(true);
        setTooltipVisible(true);
        // setIsMatches(true)
      } else {
        const body = {
          ...formValue,
          decrypt: urlDecrypt,
        };
        await dispatch(confirmNewPassword(body)).unwrap();
        // setIsMatches(false)
        setTooltipVisible(false);
      }
    } else {
      // setIsMatches(false);
    }
  };
  const validatePassword = (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/;
    if (regex.test(value) === false) {
      return true;
    } else {
      return false;
    }
  };
  const renderMessage = () => {
    if (isNotValid) {
      return (
        <Tooltip
          open={tooltipVisible}
          color={"#0075BF"}
          title={
            <span className={"w-1/2"}>
              Your password must contain at least:
              <br />- {data?.pLength} characters <br />
              {data?.pComplexity === "true" && (
                <>
                  - 1 number
                  <br />
                  - 1 symbol
                  <br />
                  - Upper case letter
                  <br />- Lower case letter
                </>
              )}
            </span>
          }
          onOpenChange={() => setTooltipVisible(!tooltipVisible)}
          placement="bottomLeft"
        >
          <Button
            type={"text"}
            border={false}
            icon={<ExclamationCircleOutlined style={{ color: "#0075BF" }} />}
          />
        </Tooltip>
      );
    }
  };

  const onChangeConfirmationPassword = (e) => {
    if (formValue.newPassword === e.target.value) {
      setIsMatches(true);
    } else {
      setIsMatches(false);
    }
  };
  return (
    <Spin spinning={loading}>
      <div className="w-screen h-screen flex">
        <div className="col-span-12 flex bg-no-repeat bg-cover w-full justify-end items-center">
          <div className={"w-2/3 h-screen bg-transparent"}>
            <div className="flex justify-center items-center h-screen">
              <img
                src={bgLogin}
                className={"h-full w-full  object-cover"}
                alt={"login"}
              />
            </div>
          </div>
          <Card style={{ width: "50%", height: "100%" }} className="card-login">
            <div className={"flex flex-col gap-8"}>
              <img
                className="mx-auto mt-7 h-12 w-auto"
                src={pgnLogo}
                alt="Your Company"
              />
            </div>
            {/* form */}
            <div
              className={
                "flex flex-col justify-between pt-16 h-[541px] items-center w-full px-11 gap-2"
              }
            >
              <Form
                name="normal_login"
                layout="vertical"
                form={form}
                onFinish={handleSave}
                className={"w-full"}
              >
                <Form.Item
                  label={"New Password"}
                  name="newPassword"
                  className={"mt-9"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                    {
                      min: data?.pLength,
                      message: `Minimal password ${data?.pLength} characters`,
                    },
                    // { pattern: /^(?!.*<>).*$/, message: `Format password incorrect, password can not contain` }
                  ]}
                >
                  <Input.Password
                    className="bg-transparent mb-2 !text-base"
                    style={{ borderRadius: "9px" }}
                  />
                </Form.Item>
                <Form.Item
                  label={"Confirm New Password"}
                  name="confirmNewPassword"
                  className={"mt-9"}
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                    {
                      min: data?.pLength,
                      message: `Minimal password ${data?.pLength} characters`,
                    },
                    // { pattern: /^(?!.*<>).*$/, message: `Format password incorrect, password can not contain` },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(" Password not matches");
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    className="bg-transparent mb-2 !text-base"
                    style={{ borderRadius: "9px" }}
                  />
                </Form.Item>
                <div className={"w-full text-end mt-2 pr-2s"}>
                  {renderMessage()}
                </div>
                {/* {isMatches === false && (
										<span className={"text-red-600 "}>
											{" "}
											Password not matches
										</span>
									)} */}
                <div
                  className={
                    "w-full flex flex-col items-center justify-center mt-5"
                  }
                >
                  <Form.Item className={"w-full"}>
                    <button
                      type="submit"
                      className={
                        "bg-[#3C6DB2] hover:bg-[#3663a2] text-white text-sm px-4 py-4 border rounded-lg w-full border-none cursor-pointer"
                      }
                    >
                      <span> Submit</span>
                    </button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            {/* footer card*/}
            <span className="text-[#3C6DB2] text-[10px] flex justify-center">
              Copyrights © 2022 Astra Graphia Information Technology. All
              rights reserved
            </span>
          </Card>
        </div>
      </div>
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={handleCloseModalSuccess}
        handleCancel={handleCloseModalSuccess}
        width={550}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconSuccess" width={48} />
            <p className="text-[18px] font-bold">{bodySuccess?.title}</p>
          </div>
          <p className="pl-[70px]">{bodySuccess?.description}</p>
          {bodySuccess?.alertDescription && (
            <Alert type="error" message={bodySuccess?.alertDescription} />
          )}
        </div>
      </ModalSuccess>
      <ModalError
        isOpen={modalError}
        handleOk={handleCloseModalError}
        handleCancel={handleCloseModalError}
        width={550}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{bodyError?.title}</p>
          </div>
          <p className="pl-[70px]">{bodyError?.description}</p>
        </div>
      </ModalError>
    </Spin>
  );
};

export default NewPassword;
