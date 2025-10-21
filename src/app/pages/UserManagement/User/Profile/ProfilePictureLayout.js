import React from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import { Avatar } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useState } from "react";
import ModalUpload from "../../../../../components/Modal/ModalUpload";
import { useDispatch } from "react-redux";
import {
  getProfile,
  removePicture,
} from "../../../../../redux/slices/user_management/profile";
import { UserOutlined } from "@ant-design/icons";
import useGrantAccessHooks from "../../../../../components/useGrantAccessHooks";

const ProfilePictureLayout = (props) => {
  const { data, loading } = props;
  const dispatch = useDispatch();
  const { actions } = useGrantAccessHooks();

  // state
  const [openModal, setOpenModal] = useState(false);

  // open modals
  const handleCancel = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);
  const initialAvatar = (fullName) => {
    const names = fullName?.replace(".", " ").split(" ");
    const initials = names?.map((name) => name.charAt(0).toUpperCase());
    return initials?.join("");
  };

  const handleResetProfilePicture = async () => {
    await dispatch(removePicture()).unwrap();
    await dispatch(getProfile()).unwrap();
  };

  return (
    <div className="basis-2/3">
      <BaseContainer header={"USER AVATAR"}>
        <div
          className={"w-full flex flex-col justify-center items-center gap-7"}
        >
          {data?.data?.urlImage2 === null ? (
            data?.data?.username === "" ? (
              <Avatar size={180} icon={<UserOutlined />} />
            ) : (
              <Avatar size={180}>
                <span className={"text-[3.5rem]"}>
                  {initialAvatar(data?.data?.username)}
                </span>
              </Avatar>
            )
          ) : (
            <Avatar size={180} src={data?.data?.urlImage2} />
          )}
          <span className={"text-[1.5rem] font-semibold"}>
            {data?.data?.employeeName}
          </span>

          {/* check access */}
          {actions?.includes("Upload") && (
            <>
              <ButtonComponent
                border={false}
                type={"submit"}
                onClick={handleOpen}
              >
                Upload Profile
              </ButtonComponent>
              <span className={"text-[1rem] font-normal"}>or</span>
              <ButtonComponent
                border={false}
                type={"default"}
                onClick={handleResetProfilePicture}
              >
                Reset Profile Picture
              </ButtonComponent>
            </>
          )}
        </div>
      </BaseContainer>
      <ModalUpload
        openUpload={openModal}
        handleCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default ProfilePictureLayout;
