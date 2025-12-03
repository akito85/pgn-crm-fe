import React from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BaseContainer from "../../../../../components/BaseContainer";
import { Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../../../../redux/slices/user_management/profile";
import { useState } from "react";
import RadioTabs from "../../../../../components/RadioTabs";
import UserInformationLayout from "./UserInformationLayout";
import ChangePasswordLayout from "./ChangePasswordLayout";
import ChangeProfileLayout from "./ChangeProfileLayout";
import ProfilePictureLayout from "./ProfilePictureLayout";
import useGrantAccessHooks from "../../../../../components/useGrantAccessHooks";

const ProfilePage = () => {
  const { data, loading } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useGrantAccessHooks();

  // state
  const [valuePage, setValuePage] = useState("User Profile");
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const tabPagesEmployee = [
    { value: "User Profile" },
    { value: "Change Profile" },
    { value: "Change Password" },
  ];

  const selectedEmployeeType = () => {
    let tabPages;

    if (data?.data?.authType?.toUpperCase() === "LOCAL") {
      let filteredTabsEmployee;
      if (actions?.includes("Update")) {
        filteredTabsEmployee = tabPagesEmployee.filter(
          (page) =>
            !(
              data?.data?.userType === "EMPLOYEE" &&
              page.value === "Change Profile"
            ),
        );
        tabPages = filteredTabsEmployee;
      } else {
        filteredTabsEmployee = tabPagesEmployee.filter(
          (page) => page.value === "User Profile",
        );
        tabPages = filteredTabsEmployee;
      }
    } else {
      const filteredTabsLDAP = tabPagesEmployee.filter(
        (page) =>
          !(
            data?.data?.userType === "EMPLOYEE" &&
            (page.value === "Change Profile" ||
              page.value === "Change Password")
          ),
      );
      tabPages = filteredTabsLDAP;
    }

    // switch (data?.data?.authType) {
    //     case "LDAP":
    //         const filteredTabsLDAP = tabPagesEmployee.filter((page) => !(
    //             data?.data?.userType === 'EMPLOYEE' && (page.value === 'Change Profile' || page.value ===
    //         'Change Password')
    //         ))
    //         tabPages = filteredTabsLDAP
    //         break;
    //     case "LOCAL":
    //         const filteredTabsEmployee = tabPagesEmployee.filter((page) => !(data?.data?.userType === "EMPLOYEE" && page.value === 'Change Profile'))
    //         tabPages = filteredTabsEmployee;
    //         break;
    //     default:
    //         tabPages = tabPagesEmployee;
    //         break;
    // }
    return tabPages;
  };
  const layout = (valuePage) => {
    switch (valuePage) {
      case "User Profile":
        return (
          <UserInformationLayout data={data} header={"USER INFORMATION"} />
        );
      case "Change Profile":
        return <ChangeProfileLayout data={data} header={"CHANGE PROFILE"} />;
      case "Change Password":
        return <ChangePasswordLayout header={"CHANGE PASSWORD"} />;
      default:
        return (
          <UserInformationLayout data={data} header={"USER INFORMATION"} />
        );
    }
  };
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <ButtonComponent
          onClick={() => navigate(-1)}
          border={false}
          icon={
            <LeftOutlined
              style={{
                fontSize: 16,
                justifyItems: "center",
              }}
            />
          }
        >
          {" "}
          Back
        </ButtonComponent>
        <div className={"flex w-full gap-6"}>
          <ProfilePictureLayout data={data} loading={loading} />
          <BaseContainer
            type={"profile"}
            element={
              <RadioTabs
                data={selectedEmployeeType()}
                onChange={onChange}
                currentPosition={valuePage}
              />
            }
          >
            <div className={"flex flex-col w-full"}>{layout(valuePage)}</div>
          </BaseContainer>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default ProfilePage;
