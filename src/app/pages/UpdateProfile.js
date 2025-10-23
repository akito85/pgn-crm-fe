import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Image, Popover, Spin } from "antd";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BaseContainer from "../../components/BaseContainer";
import ButtonComponent from "../../components/ButtonComponent";
import InputComponent from "../../components/InputComponent";
import LayoutMenu from "../../components/SidebarMenu/LayoutMenu";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const profileDetail = {
    employeeId: "8959",
    employeeName: "Jhon Doe",
    entity: "Perusahaan Gas Negara",
    phoneNumber: "089849887844",
    email: "johndoe@mail.com",
  };

  const [previewAction, setPreviewAction] = useState(false);
  const [employeeId, setEmployeeId] = useState(profileDetail.employeeId);
  const [employeeName, setEmployeeName] = useState(profileDetail.employeeName);
  const [entity, setEntity] = useState(profileDetail.entity);
  const [phoneNumber, setPhoneNumber] = useState(profileDetail.phoneNumber);
  const [email, setEmail] = useState(profileDetail.email);

  const clearStateAction = () => {
    setEmployeeName("");
    setEntity("");
    setPhoneNumber("");
    setEmail("");
  };

  const saveAction = () => {
    const body = {
      employeeName: employeeName,
      entity: entity,
      phoneNumber: phoneNumber,
      email: email,
    };
  };

  const previewActionConfirm = () => {
    setPreviewAction(true);
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
        <BaseContainer header={"UPDATE PROFILE"}>
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
              <div className="flex flex-col w-full gap-y-10">
                <div className="grid grid-cols-2 gap-y-5 gap-x-40 mr-16 mt-10">
                  <InputComponent
                    disabled
                    type="text"
                    label={"Employee ID"}
                    mandatory
                    value={employeeId}
                    // onChange={(e) => setName(e.target.value)}
                  ></InputComponent>
                  <InputComponent
                    type="text"
                    label={"Employee Name"}
                    mandatory
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  ></InputComponent>
                  <InputComponent
                    type="text"
                    label={"Entity"}
                    mandatory
                    value={entity}
                    onChange={(e) => setEntity(e.target.value)}
                  ></InputComponent>
                  <InputComponent
                    type="text"
                    label={"Phone Number"}
                    mandatory
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  ></InputComponent>
                  <InputComponent
                    type="text"
                    label={"Email"}
                    mandatory
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></InputComponent>
                </div>

                <div className="flex justify-end mt-52 mr-10 mb-2">
                  <ButtonComponent
                    icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                    onClick={() => clearStateAction()}
                    type="default"
                  >
                    Clear
                  </ButtonComponent>
                  {employeeName ? (
                    <ButtonComponent
                      onClick={() => previewActionConfirm()}
                      type="submit"
                    >
                      Save
                    </ButtonComponent>
                  ) : (
                    <Popover placement="top" content={content} trigger="hover">
                      <div>
                        <ButtonComponent
                          disabled
                          onClick={() => previewActionConfirm()}
                          type="submit"
                        >
                          Save
                        </ButtonComponent>
                      </div>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default UpdateProfile;
