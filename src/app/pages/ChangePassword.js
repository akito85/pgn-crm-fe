import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Form, Input, Popover, Spin, Tooltip } from "antd";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BaseContainer from "../../components/BaseContainer";
import ButtonComponent from "../../components/ButtonComponent";
import LayoutMenu from "../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../assets/Icon/index";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const saveAction = () => {
    const body = {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    console.log(body);
  };

  const clearStateAction = () => {
    setNewPassword("");
    setConfirmPassword("");
  };

  const content = (
    <span className="text-[11px] font-bold  text-[#3C6DB2]">
      Please fill mandatory form
    </span>
  );

  return (
    <LayoutMenu>
      <Spin spinning={false} className={"w-full top-20"} tip={"Loading..."}>
        {/* <BreadCrumb pageName={["System Setup", "Action", "Create Action"]} /> */}
        <NavLink onClick={() => navigate(-1)}>
          <div className="flex align-middle gap-x-2 mb-4 mt-4">
            <ArrowLeftOutlined
              style={{ fontSize: "24px", color: "#3C6DB2" }}
            ></ArrowLeftOutlined>
            <span className="text-dg-blue">Back</span>
          </div>
        </NavLink>
        <BaseContainer header={"CHANGE PASSWORD"}>
          <div className="flex w-full ml-10 mt-10">
            <div className="w-2/3">
              <div className="flex w-full gap-y-10">
                <Form
                  name="normal_login"
                  layout="vertical"
                  // initialValues={{
                  //   remember: true,
                  // }}
                  // onFinish={handleLogin}
                  className={"w-full"}
                >
                  <Form.Item
                    label={<span>Enter your new password</span>}
                    name="New password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your new password!",
                      },
                      {
                        pattern: /^(?!.*<>).*$/,
                        message: `Format password incorrect, password can not contain`,
                      },
                    ]}
                  >
                    <Input.Password
                      type="password"
                      size="large"
                      // prefix={<IconsLock />}
                      placeholder="New password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      className="bg-transparent mb-2 !text-base"
                      style={{ borderRadius: "9px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span>Confirm your new password</span>}
                    name="Confirm new password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your confirmation password!",
                      },
                      {
                        pattern: /^(?!.*<>).*$/,
                        message: `Format password incorrect, password can not contain`,
                      },
                    ]}
                  >
                    <Input.Password
                      type="password"
                      size="large"
                      // prefix={<IconsLock />}
                      placeholder="Confirm new password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      className="bg-transparent mb-2 !text-base"
                      style={{ borderRadius: "9px" }}
                    />
                  </Form.Item>
                </Form>
              </div>
            </div>

            <div className="w-3/3">
              <div className="flex mt-7 w-full gap-y-10 ml-2">
                <Tooltip
                  // color="#CEDBEC"
                  placement="bottomLeft"
                  title="Your password  must contain at least 8 characters, one number, one symbol, upper case, and lower case letter"
                >
                  <div>
                    <SVGIcon
                      name="IconInfo"
                      width={44}
                      style={{
                        color: "#0880AE",
                        fontSize: 24,
                        justifyItems: "center",
                      }}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-52 mb-2">
            <ButtonComponent
              icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
              onClick={() => clearStateAction()}
              type="default"
            >
              Clear
            </ButtonComponent>
            {newPassword && confirmPassword ? (
              <ButtonComponent
                // onClick={() => previewActionConfirm()}
                type="submit"
              >
                Save
              </ButtonComponent>
            ) : (
              <Popover placement="top" content={content} trigger="hover">
                <div>
                  <ButtonComponent
                    disabled
                    // onClick={() => previewActionConfirm()}
                    type="submit"
                  >
                    Save
                  </ButtonComponent>
                </div>
              </Popover>
            )}
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default ChangePassword;
