import { ArrowLeftOutlined } from "@ant-design/icons";
import { Image, Spin, Avatar } from "antd";
<<<<<<< HEAD
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BaseContainer from "../components/BaseContainer";
import ButtonComponent from "../components/ButtonComponent";
import DetailTextNonPopUp from "../components/DetailTextNonPopUp";
import LayoutMenu from "../components/SidebarMenu/LayoutMenu";
||||||| (empty tree)
=======
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BaseContainer from "../components/BaseContainer";
import BreadCrumb from "../components/BreadCrumb";
import ButtonComponent from "../components/ButtonComponent";
import DetailText from "../components/DetailText";
import DetailTextNonPopUp from "../components/DetailTextNonPopUp";
import LayoutMenu from "../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../assets/Icon/IconEdit";
>>>>>>> 20b7779 (Init)

const Profile = () => {
  const navigate = useNavigate();

  const profileDetail = {
    employeeId: "8959",
    employeeName: "Jhon Doe",
    entity: "Perusahaan Gas Negara",
    phoneNumber: "089849887844",
    email: "johndoe@mail.com",
  };

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
        <BaseContainer header={"USER PROFILE"}>
          <div className="grid grid-cols-3 w-full gap-10">
            {/* IMG */}
            <div className="col-span-1">
              <div className="flex flex-col items-center justify-center mt-10">
                <Avatar
                  size={187}
                  src={
                    <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                  }
                />

                <h2 className="m-10 text-dg-blue font-bold">
                  {profileDetail.employeeName}
                </h2>

                <ButtonComponent
                  // onClick={() => setModalConfirmation(true)}
                  type={"submit"}
                >
                  Upload Profile Picture
                </ButtonComponent>

                <h3 className=" text-dg-grey-dark">Or</h3>

                <ButtonComponent
                  // onClick={() => setModalConfirmation(true)}
                  type={"grey"}
                >
                  Reset Profile Picture
                </ButtonComponent>
              </div>
            </div>

            {/* PROFILE DETAIL */}
            <div className="col-span-2">
              <div className="flex justify-end mr-6 pb-6 pr-6">
                <NavLink
                  to={"/update-profile"}
                  state={{ x: 1 }}
                >
                  <ButtonComponent
                    // onClick={() => setModalConfirmation(true)}
                    type={"submit"}
                  >
                    Change Profile
                  </ButtonComponent>
                </NavLink>
                <NavLink
                  to={"/update-profile"}
                  state={{ x: 1 }}
                >
                  <ButtonComponent
                    // onClick={() => setModalConfirmation(true)}
                    type={"submit"}
                  >
                    Change Password
                  </ButtonComponent>
                </NavLink>
              </div>

              <div className="flex flex-col w-full gap-y-10">
                <div className="grid grid-cols-2 gap-y-2.5">
                  <DetailTextNonPopUp label={"Employee ID"}>
                    {profileDetail.employeeId}
                  </DetailTextNonPopUp>
                  <DetailTextNonPopUp label={"Employee Name"}>
                    {profileDetail.employeeName}
                  </DetailTextNonPopUp>
                  <DetailTextNonPopUp label={"Entity"}>
                    {profileDetail.entity}
                  </DetailTextNonPopUp>
                  <DetailTextNonPopUp label={"Phone Number"}>
                    {profileDetail.phoneNumber}
                  </DetailTextNonPopUp>
                  <DetailTextNonPopUp label={"Email"}>
                    {profileDetail.email}
                  </DetailTextNonPopUp>
                </div>
              </div>
            </div>
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default Profile;
