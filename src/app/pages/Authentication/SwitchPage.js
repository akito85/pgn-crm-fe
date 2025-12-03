import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import {
  getListSwitchEntity,
  getListSwitchPosition,
  logout,
} from "../../../redux/slices/user_management/auth";
import ButtonComponent from "../../../components/ButtonComponent";
import ModalCustom from "../../../components/Modal/ModalCustom";
import { useDispatch, useSelector } from "react-redux";
import CarouselListSelection from "./CarouselListSelection";
import Timer from "../../../components/Timer";

const SwitchPage = (props) => {
  const { type } = props;
  const { loading, token, user, data_entity, data_position, remember } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [data, setData] = useState();
  const tokenJSON = JSON.parse(token);
  useEffect(() => {
    if (type === "switch-entity") {
      dispatch(getListSwitchEntity());
    } else {
      dispatch(getListSwitchPosition());
    }
  }, []);
  const handleLogout = async () => {
    setOpenModal2(false);
    await dispatch(logout());
    if (tokenJSON?.userLevel !== "Super User") {
      navigate("/login");
    } else {
      navigate("/login-su");
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
  };
  return (
    <Spin spinning={loading}>
      <div className="h-screen w-full">
        <div className={"flex w-full bg-white px-5 pt-10 justify-between"}>
          <ButtonComponent
            onClick={() => navigate(-1)}
            icon={<LeftOutlined style={{ color: "#0075BF" }} type="default" />}
            border={false}
          >
            Back
          </ButtonComponent>
          <ButtonComponent type={"submit"}>
            Welcome,{" "}
            {type === "switch-entity"
              ? data_entity?.username
              : data_position?.username}
          </ButtonComponent>
        </div>
        <div className={"w-full justify-center flex mt-10"}>
          <span className={" text-5xl text-[#0075BF]"}>
            {type === "switch-position"
              ? "Choose Your Position"
              : "Choose Your Entity"}
          </span>
        </div>
        <CarouselListSelection
          type={type}
          data={
            type === "switch-entity"
              ? data_entity?.listEntity
              : data_position?.listPosition
          }
          remember={JSON.parse(remember)}
        />
        <ModalCustom
          isOpen={openModal}
          handleCancel={handleCancel}
          header={"LOGOUT"}
          handleOk={handleLogout}
          isAlert={true}
        >
          <div className={"flex flex-col px-8 py-4"}>
            <div className="w-full justify-center flex my-6">
              <span className={"text-xl text-[#3C6DB2]"}>
                Are you sure want to log out?
              </span>
            </div>
            <div className={"w-full justify-center flex gap-2"}>
              <ButtonComponent type={"default"} onClick={handleCancel}>
                Cancel
              </ButtonComponent>
              <ButtonComponent type={"submit"} onClick={handleLogout}>
                Back
              </ButtonComponent>
            </div>
          </div>
        </ModalCustom>
      </div>
      <Timer durations={tokenJSON.expired} />
      {/* <ModalNotification isOpen={openModal2} typeModal={'delete'} handleAction={() => { }} /> */}
    </Spin>
  );
};

export default SwitchPage;
