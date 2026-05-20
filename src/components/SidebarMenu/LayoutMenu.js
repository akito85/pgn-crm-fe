import {
  Image,
  Layout,
  Avatar,
  Menu,
  Dropdown,
  Badge,
  Alert,
  Tooltip,
  Form,
  Input,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import SideMenu from "./Sidemenu";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SwitcherOutlined,
} from "@ant-design/icons";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import NotificationInline from "../Notifications/NotificationInline";
import NotificationPopup from "../Notifications/NotificationPopup";
import useNotificationDisplayOrchestrator from "../../hooks/useNotificationDisplayOrchestrator";
import { pgnLogo, pgnLogoKecil } from "../../assets/img/index";
import { useDispatch, useSelector } from "react-redux";
import {
  checkGrantedAccess,
  logout,
  logoutTokenExpired,
  reLogin,
  setClearDataExtend,
} from "../../redux/slices/user_management/auth";
import { useLocation, useNavigate } from "react-router-dom";
import IdleTimerContainer from "../../utils/idleTimer";
import ModalCustom from "../Modal/ModalCustom";
import ButtonComponent from "../ButtonComponent";
import { USER_ROUTES } from "../../routes/user_management/user_routes";
import { getProfile } from "../../redux/slices/user_management/profile";
import { ModalError, ModalSuccess } from "../Modal/ModalPopUp";
import {
  clearBodyMessage,
  hideModalError,
  hideModalSuccess,
  showModalError,
} from "../../redux/slices/general_slice";
// import { getGlobalFormatConfig } from "../../redux/slices/globalPropSlice";
import NotFound from "../../app/NotFound";
import { IconModal } from "../../utils/Icon";
import InputComponent from "../InputComponent";
import { errorCode } from "../../utils";

const { Content, Sider, Header } = Layout;

// Isolated sidebar — React.memo prevents LayoutMenu re-renders from reaching
// Sider. This stops SiderContext from creating new objects on every navigation/
// Redux dispatch, which was forcing antd Menu to re-render via context
// (bypassing React.memo on SideMenu) and triggering SubMenu animation.
const SidebarContainer = React.memo(({ collapsed, onToggle }) => (
  <Sider
    trigger={null}
    collapsible
    collapsed={collapsed}
    className={`site-layout-background ${
      collapsed === true ? "width-collapsed" : "width-not-collapsed"
    }`}
    style={{
      overflow: "auto",
      height: "auto",
      left: 0,
      top: 0,
      bottom: 0,
      minWidth: "255px !important",
    }}
  >
    <div
      className={`grid grid-cols-3 gap-1 logo ${
        collapsed
          ? "my-6 mx-4 justify-center"
          : "my-6 mx-4 justify-center"
      }`}
    >
      <div className="col-span-2">
        <Image
          src={collapsed ? pgnLogoKecil : pgnLogo}
          preview={false}
          wrapperClassName={!collapsed ? "w-[120px]" : undefined}
        />
      </div>
      <div className="flex self-center justify-end">
        {collapsed === false &&
          React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: onToggle,
              style: {
                fontSize: "24px",
                color: "#4B465C",
                width: "24px",
              },
            },
          )}
      </div>
    </div>
    <SideMenu isCollapsed={collapsed} />
  </Sider>
));

const LayoutMenu = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const publicPaths = ["/invoice/generate-invoice", "/relationship", "/notifications/view", "/notifications/settings/view"];
  const isPublicPath = publicPaths.some((path) =>
    location.pathname.includes(path),
  );

  const { user, remember, data_switch } = useSelector((state) => state.auth);
  const { data: data_profile } = useSelector((state) => state.profile);
  const {
    bodyError,
    modalError,
    bodySuccess,
    modalSuccess,
    data_grant_access,
  } = useSelector((state) => state.general);
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(() => {
    // Check if collapsed state is stored in localStorage
    const savedCollapsed = localStorage.getItem('sidebar_collapsed');
    return savedCollapsed ? JSON.parse(savedCollapsed) : false;
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const newState = !prev;
      // Save the new state to localStorage
      localStorage.setItem('sidebar_collapsed', JSON.stringify(newState));
      return newState;
    });
  }, []);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const tokenJSON = JSON.parse(
    localStorage.getItem("token") || window.sessionStorage.getItem("token"),
  );
  // const config =
  //   localStorage.getItem("config") || window.sessionStorage.getItem("config");
  // const configParsed = parseInt(
  //   JSON.parse(config)?.find((item) => item?.name === "SESSION_TIME")?.value
  // );
  // const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [isTimedout, setIsTimedout] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  // const [showModalExpired, setShowModalExpired] = useState(false);
  const [showModalExtendToken, setShowModalExtendToken] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  // Notification display states
  const [inlineNotifications, setInlineNotifications] = useState([]);
  const [popupNotification, setPopupNotification] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Notification handlers
  const handlePopupNotification = (notification) => {
    setPopupNotification(notification);
    setShowPopup(true);
  };

  const handleInlineNotification = (notification) => {
    setInlineNotifications((prev) => {
      // Check if notification already exists
      const exists = prev.find((n) => n.id === notification.id);
      if (exists) return prev;
      // Add new notification (keep max 5)
      return [notification, ...prev].slice(0, 5);
    });
  };

  const handleDismissInline = (notificationId) => {
    setInlineNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );
  };

  const handleDismissAllInline = () => {
    setInlineNotifications([]);
  };

  const handleNavigateNotification = (notification) => {
    if (notification.redirectUrl) {
      navigate(notification.redirectUrl);
    }
  };

  // Initialize notification display orchestrator
  useNotificationDisplayOrchestrator({
    onPopupNotification: handlePopupNotification,
    onInlineNotification: handleInlineNotification,
    onNavigate: handleNavigateNotification,
    enabled: true,
  });

  // use effect check grant access
  useEffect(() => {
    dispatch(checkGrantedAccess(location?.pathname));
    dispatch(getProfile());
  }, [dispatch, location, data_switch]);

  // useEffect(() => {
  //   dispatch(getGlobalFormatConfig());
  // }, [dispatch]);

  // use effect kick user
  useEffect(() => {
    if (user?.response?.data?.code === 300) {
      const errorBody = {
        title: user?.response?.data?.data,
        description: user?.response?.data?.message,
        code: user?.response?.data?.code,
      };
      dispatch(showModalError(errorBody));
    }
  }, [user, dispatch]);

  // use effect continue session
  // useEffect(() => {
  //   // setTimeout(() => {
  //     if (moment(tokenJSON?.dateExpired).subtract(5, 'minutes').isBefore(moment()) === true && showModalExtendToken === false) {
  //       dispatch(setClearDataExtend());
  //       const errorBody = {
  //         title: "Session Expired",
  //         description: `Your session will be expire in 5 minutes`,
  //         code: 501
  //       };
  //       setTimeout(() => {
  //         dispatch(showModalError(errorBody));
  //       }, 2000)
  //     }
  //   // }, 2000)
  // }, [dispatch, showModalExtendToken, tokenJSON?.dateExpired]);

  // useEffect(() => {
  //   if (showModalExtendToken === true || data_extended?.code === 200) {
  //     dispatch(hideModalError())
  //   }
  // })

  useEffect(() => {
    if (bodyError?.response?.data?.code === 419) {
      const error = {
        title: "Session Expired",
        description: `Your session will be expire in 5 minutes`,
        code: bodyError?.response?.data?.code,
      };
      dispatch(showModalError(error));
    }
  }, [bodyError, dispatch]);

  const handleCloseModalError = () => {
    dispatch(hideModalError());
    // dispatch(getProfile());
    if (bodyError?.return === true) {
      navigate(-1);
    } else if (
      bodyError?.code === 401 ||
      bodyError?.code === 300 ||
      bodyError?.description === "User locked, user can login after 5 minute"
    ) {
      handleLogout();
    } else if (
      bodyError?.code === 501 ||
      bodyError?.code === 419 ||
      bodyError?.description ===
      "Oops, login failed Username or Password is incorrect"
    ) {
      form.setFieldsValue({
        username: tokenJSON?.username,
      });
      setShowModalExtendToken(true);
    }
  };

  const handleCloseModalSuccess = () => {
    dispatch(hideModalSuccess());
    dispatch(getProfile());
    if (bodySuccess?.return) {
      navigate(-1);
    } else if (bodySuccess?.type === "update-password") {
      handleLogout();
    }
  };

  const handleLogoutModal = () => {
    setModalConfirmation(true);
  };

  // const handleCancel = () => {
  //   setOpenModal(false);
  //   setIsTimedout(false);
  // };

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      dispatch(clearBodyMessage());
      setModalConfirmation(false);
      await dispatch(logout())?.unwrap();
      await dispatch(logoutTokenExpired())?.unwrap();
      if (tokenJSON?.userLevel !== "Super User") {
        navigate("/login");
      } else {
        navigate("/login-su");
      }
    } catch (error) {
      dispatch(clearBodyMessage());
      setModalConfirmation(false);
      setLoadingLogout(false);
    }
  };
  const initialAvatar = (fullName) => {
    const names = fullName?.replace(".", " ").split(" ");
    const initials = names?.map((name) => name.charAt(0).toUpperCase());
    return initials?.join("");
  };
  const menu = (
    <Menu
      items={[
        {
          label: (
            <div className="flex gap-1">
              <div className="flex self-center">
                {data_profile?.data?.urlImage2 === null ? (
                  data_profile?.data?.username === "" ? (
                    <Avatar size={"middle"} icon={<UserOutlined />} />
                  ) : (
                    <Avatar size={"middle"}>
                      <span className={"text-[1rem]"}>
                        {initialAvatar(data_profile?.data?.username)}
                      </span>
                    </Avatar>
                  )
                ) : (
                  <Avatar size={"middle"} src={data_profile?.data?.urlImage2} />
                )}
              </div>
              <div className="flex flex-col gap-1 max-w-[100px]">
                <Tooltip
                  placement="topLeft"
                  title={data_profile?.data?.username}
                >
                  <div className="truncate">{data_profile?.data?.username}</div>
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={`${data_profile?.data?.entity} ${data_profile?.data?.currentPosition === undefined
                      ? ""
                      : ` - ${data_profile?.data?.currentPosition}`
                    }`}
                >
                  <div className="truncate">
                    {`${data_profile?.data?.entity} ${data_profile?.data?.currentPosition === undefined
                        ? ""
                        : ` - ${data_profile?.data?.currentPosition}`
                      }`}
                  </div>
                </Tooltip>
              </div>
            </div>
          ),
          key: "0",
        },
        {
          type: "divider",
        },
        {
          label: (
            <div onClick={() => navigate(USER_ROUTES.VIEW_PROFILE)}>
              <UserOutlined className="mr-4" /> Profile
            </div>
          ),
          key: "1",
        },
        {
          type: "divider",
        },
        {
          label: (tokenJSON?.userType === "Employee" ||
            tokenJSON?.userLevel === "Super User") && (
              <div
                onClick={() =>
                  navigate(
                    tokenJSON?.userLevel === "Super User"
                      ? "/switch-entity"
                      : "/switch-position",
                  )
                }
              >
                <SwitcherOutlined className="mr-4" />{" "}
                {tokenJSON?.userLevel === "Super User"
                  ? "Switch Entity"
                  : "Switch Position"}
              </div>
            ),
          key: "3",
        },
        {
          label: (
            <div onClick={() => handleLogoutModal()}>
              <LogoutOutlined className="mr-4" />
              Logout
            </div>
          ),
          key: "4",
        },
      ]}
    />
  );

  const handleIconSuccess = (key) => {
    if (key) {
      const temp = IconModal[key];
      return temp || IconModal["icon_success_default"];
    }
    return IconModal["icon_success_default"];
  };
  const handleIconError = (key) => {
    if (key) {
      const temp = IconModal[key];
      return temp || IconModal["icon_error_default"];
    }
    return IconModal["icon_error_default"];
  };

  /* For Billing Cycle */
  const handleLoadPage = (index, api) => {
    if (index === 1) {
      const temp = dispatch(api);
      return temp || false;
    }
  };

  // handle continue session
  const handleContinueSession = (formValue) => {
    dispatch(reLogin({ body: formValue, remember: remember }));
    dispatch(setClearDataExtend());
    dispatch(clearBodyMessage());
    setShowModalExtendToken(false);
    form.resetFields();
  };

  return errorCode(data_grant_access) === 503 ? (
    <>
      <NotFound type={"maintenance"} />
    </>
  ) : (
    <>
      <IdleTimerContainer
        handleLogout={handleLogout}
        timeout={isTimedout}
        timeoutModal={() => setShowIdleModal(true)}
        timedoutHandler={setIsTimedout}
      />
      <Layout
        hasSider
        style={{
          minHeight: "100vh",
        }}
        className="site-layout"
      >
        <SidebarContainer collapsed={collapsed} onToggle={toggleCollapsed} />
        <Layout className="site-layout2 p-4">
          <Header
            className="site-layout-background2"
            style={{
              padding: 0,
            }}
          >
            <div className="flex w-full h-full justify-between">
              <div className="pl-4">
                {collapsed === true &&
                  React.createElement(
                    MenuUnfoldOutlined,
                    {
                      className: "trigger",
                      onClick: toggleCollapsed,
                      style: {
                        fontSize: "24px",
                        color: "#FFFFFF",
                        width: "24px",
                      },
                    },
                  )}
              </div>
              <div className="flex justify-end items-center align-middle gap-x-5 mr-5">
                <NotificationDropdown />
                <Dropdown overlay={menu} trigger={["click"]}>
                  <button type="button" onClick={(e) => e.preventDefault()} style={{ border: 'none', background: 'transparent' }}>
                    {data_profile?.data?.urlImage2 === null ? (
                      data_profile?.data?.username === "" ? (
                        <Avatar size={"middle"} icon={<UserOutlined />} />
                      ) : (
                        <Avatar size={"middle"}>
                          <span className={"text-[1rem]"}>
                            {initialAvatar(data_profile?.data?.username)}
                          </span>
                        </Avatar>
                      )
                    ) : (
                      <Avatar
                        size={"middle"}
                        src={data_profile?.data?.urlImage2}
                      />
                    )}
                  </button>
                </Dropdown>
                {/* <IconArrowNarrowLeft
                  name={"IconArrowNarrowLeft"}
                  style={{ fontSize: "24px" }}
                  className="flex items-center text-white hover:text-white"
                  onClick={() => {
                    handleLogoutModal();
                  }}
                /> */}
              </div>
            </div>
          </Header>
          <Content
            style={{
              overflow: "initial",
            }}
          >
            {/* Inline Notifications */}
            {inlineNotifications.length > 0 && (
              <div style={{ padding: "0 24px", marginTop: "16px" }}>
                <NotificationInline
                  notifications={inlineNotifications}
                  onDismiss={handleDismissInline}
                  onViewDetails={handleNavigateNotification}
                  onDismissAll={handleDismissAllInline}
                />
              </div>
            )}

            {modalSuccess ? (
              <ModalSuccess
                isOpen={modalSuccess}
                handleOk={handleCloseModalSuccess}
                handleCancel={handleCloseModalSuccess}
                width={bodySuccess?.width}
              >
                <div className="px-8 py-8 justify-center">
                  <div className="w-full flex gap-[20px]">
                    {handleIconSuccess(bodySuccess?.icon)}
                    <p className="text-[18px] font-bold">
                      {bodySuccess?.title}
                    </p>
                  </div>
                  <p className="pl-[70px]">{bodySuccess?.description}</p>
                  {bodySuccess?.alertDescription && (
                    <Alert
                      type="error"
                      message={bodySuccess?.alertDescription}
                    />
                  )}
                </div>
              </ModalSuccess>
            ) : null}
            {modalError ? (
              <ModalError
                // isOpen={modalError && errorCode(bodyError) !== 500}
                isOpen={modalError}
                handleOk={handleCloseModalError}
                handleCancel={handleCloseModalError}
                customText={bodyError?.code === 500 ? "Try Again" : "OK"}
              >
                <div className="px-5 pt-5 pb-[10px] justify-center">
                  <div className="w-full flex gap-[20px]">
                    {handleIconError(bodyError?.icon)}
                    <p className="text-[18px] font-bold">{bodyError?.title}</p>
                  </div>
                  <p className="pl-[70px]">{bodyError?.description}</p>
                  {bodyError?.code === 500 ? (
                    <span className="pl-[70px]">
                      Please Contact Administrator
                    </span>
                  ) : (
                    bodyError?.data?.map((item) => (
                      <ul className="pl-[70px]">
                        <li>{Object.values(item)[0]}</li>
                      </ul>
                    ))
                  )}
                </div>
              </ModalError>
            ) : null}
            {/* For Billing Cycle */}
            {modalError && bodyError?.loadPage === true ? (
              <ModalError
                isOpen={modalError}
                handleOk={() => {
                  handleCloseModalError();
                  handleLoadPage(bodyError?.index, bodyError?.api);
                }}
                handleCancel={() => {
                  handleCloseModalError();
                  handleLoadPage(bodyError?.index, bodyError?.api);
                }}
                customText={bodyError?.code === 500 ? "Try Again" : "OK"}
              >
                <div className="px-5 pt-5 pb-[10px] justify-center">
                  <div className="w-full flex gap-[20px]">
                    {handleIconError(bodyError?.icon)}
                    <p className="text-[18px] font-bold">{bodyError?.title}</p>
                  </div>
                  <p className="pl-[70px]">{bodyError?.description}</p>
                  {bodyError?.code === 500 ? (
                    <span className="pl-[70px]">
                      Please Contact Administrator
                    </span>
                  ) : (
                    bodyError?.data?.map((item) => (
                      <ul className="pl-[70px]">
                        <li>{Object.values(item)[0]}</li>
                      </ul>
                    ))
                  )}
                </div>
              </ModalError>
            ) : null}
            {location.pathname === '/' ? (
              // Always render dashboard regardless of permission check state
              <div className="mt-[15px]">{children}</div>
            ) :
            (data_grant_access?.response?.data?.data?.isGranted === false &&
              !isPublicPath) ? (
              <NotFound type={"unauthorized"} />
            ) : (
              <div className="mt-[15px]">{children}</div>
            )}
            {/* <div className="mt-[30px]">{children}</div> */}
          </Content>

          {/* modal logout */}
          <ModalCustom
            isOpen={modalConfirmation}
            handleCancel={() => setModalConfirmation(false)}
            header={"LOGOUT"}
            width={500}
            type={"confirmation"}
          >
            <div className={"flex flex-col px-8 py-4"}>
              <div className="w-full justify-center flex my-6">
                <span className={"text-xl text-[#3C6DB2]"}>
                  {" "}
                  Are you sure want to log out?
                </span>
              </div>
              <div className={"w-full justify-center flex gap-2"}>
                <ButtonComponent
                  type={"default"}
                  onClick={() => setModalConfirmation(false)}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent type={"submit"} onClick={handleLogout}>
                  Logout
                </ButtonComponent>
              </div>
            </div>
          </ModalCustom>

          {/* modal idle */}
          <ModalError
            isOpen={showIdleModal}
            header={"LOGOUT"}
            width={500}
            handleOk={handleLogout}
            loading={loadingLogout}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px] my-5">
                {handleIconError("icon_error_default")}
                <p className="text-[18px] font-bold my-auto justify-center">
                  Idle Timeout
                </p>
              </div>
              <Alert
                message="The system has automatically logged you out!"
                type="error"
              />
            </div>
          </ModalError>

          {/* extend token */}
          <ModalCustom
            isOpen={showModalExtendToken}
            header={"Session Expired"}
            width={500}
            type={"confirmation"}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleContinueSession}
            >
              <div className={"flex flex-col px-8 py-4"}>
                <div>
                  <div className="w-full flex gap-[20px] items-center">
                    {handleIconError("icon_error_default")}
                    <div className="w-full grid-cols-2">
                      <p className="text-[18px] font-bold text-yellow-400 p-0 m-0">
                        Session Expired!
                      </p>
                      <p className="text-yellow-400 m-0">
                        Input your password and continue your session
                      </p>
                    </div>
                  </div>
                </div>
                <Form.Item label={"Username"} name={"username"}>
                  <InputComponent disabled={true} />
                </Form.Item>
                <Form.Item label={"Password"} name={"password"}>
                  <Input.Password />
                </Form.Item>
                <div className={"w-full justify-end flex gap-2"}>
                  <ButtonComponent
                    type={"default"}
                    onClick={() => {
                      setShowModalExtendToken(false);
                      form.resetFields();
                    }}
                  >
                    Logout
                  </ButtonComponent>
                  <ButtonComponent type={"submit"} htmlType={"submit"}>
                    Continue Session
                  </ButtonComponent>
                </div>
              </div>
            </Form>
          </ModalCustom>

          {/* Notification Popup Modal */}
          <NotificationPopup
            notification={popupNotification}
            visible={showPopup}
            onClose={() => {
              setShowPopup(false);
              setPopupNotification(null);
            }}
            onViewDetails={handleNavigateNotification}
          />
        </Layout>
      </Layout>
    </>
  );
};

export default React.memo(LayoutMenu);