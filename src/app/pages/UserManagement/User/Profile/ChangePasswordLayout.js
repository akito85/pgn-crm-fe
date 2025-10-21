import { Button, Form, Input, Tooltip } from "antd";
import React, { useEffect } from "react";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  updatePassword,
} from "../../../../../redux/slices/user_management/profile";
import { useNavigate } from "react-router-dom";
import {
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import { formMessageRequired } from "../../../../../utils";
import { checkCredential } from "../../../../../redux/slices/user_management/auth";

const ChangePasswordLayout = (props) => {
  const { header } = props;
  const { data } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const { data_update_password } = useSelector((state) => state.profile);
  const [isMatches, setIsMatches] = useState(true);
  const [isNotValid, setIsNotValid] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();

  useEffect(() => {
    dispatch(checkCredential());
  }, [dispatch]);

  const handleSave = async (formValue) => {
    try {
      if (formValue.newPassword === formValue.confirmNewPassword) {
        if (
          data?.pComplexity === "true" &&
          validatePassword(formValue.newPassword)
        ) {
          setIsNotValid(true);
          setTooltipVisible(true);
          // setIsMatches(true)
        } else {
          await dispatch(updatePassword(formValue)).unwrap();
          await dispatch(getProfile()).unwrap();
          setModalSuccess(true);
          // setIsMatches(false)
          setTooltipVisible(false);
        }
      } else {
        // setIsMatches(false);
      }
    } catch (error) {
      setModalError(true);
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
  const handleClose = () => {
    setModalSuccess(false);
    setModalError(false);
    dispatch(getProfile());
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
    <div>
      <span className={"text-primary text-xs font-bold my-3"}> {header}</span>
      <Form form={form} layout={"vertical"} onFinish={handleSave}>
        <div className={"mt-2"}>
          <Form.Item
            label={"Current Password"}
            name={"currentPassword"}
            rules={[
              ...formMessageRequired("current password"),
              {
                min: data?.pLength,
                message: `Minimal password ${data?.pLength} characters`,
              },
              // { pattern: /^(?!.*<>).*$/, message: `Format password incorrect, password can not contain` }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={"New Password"}
            name={"newPassword"}
            rules={[
              ...formMessageRequired("new password"),
              {
                min: data?.pLength,
                message: `Minimal password ${data?.pLength} characters`,
              },
              // { pattern: /^(?!.*<>).*$/, message: `Format password incorrect, password can not contain` }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={"Confirm New Password"}
            name={"confirmNewPassword"}
            dependencies={["newPassword"]}
            rules={[
              ...formMessageRequired("confirm new password"),
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
            <Input.Password />
          </Form.Item>
          {/* {isMatches === false &&
                        <span className={'text-red-600 '}> Password not matches</span>
                    } */}
        </div>
        <Form.Item>
          <div className={"w-full flex"}>
            <div>
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
                  icon={
                    <ExclamationCircleOutlined style={{ color: "#0075BF" }} />
                  }
                />
              </Tooltip>
            </div>
            <div className={"flex w-full justify-end  gap-2"}>
              <ButtonComponent
                type={"submit"}
                icon={<SVGIcon name="IconButtonClear" width={24} />}
                onClick={() => {
                  form.resetFields();
                }}
              >
                Clear
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                border={false}
              >
                Submit
              </ButtonComponent>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordLayout;
