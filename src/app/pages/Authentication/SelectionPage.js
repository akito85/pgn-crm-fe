import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import {
  logout,
  logoutTokenExpired,
  takeOverDelegation,
} from "../../../redux/slices/user_management/auth";
import ButtonComponent from "../../../components/ButtonComponent";
import ModalCustom from "../../../components/Modal/ModalCustom";
import { useDispatch, useSelector } from "react-redux";
import CarouselListSelection from "./CarouselListSelection";
import Timer from "../../../components/Timer";
import SVGIcon from "../../../assets/Icon/index";
import { ModalError } from "../../../components/Modal/ModalPopUp";
import { hideModalError } from "../../../redux/slices/general_slice";
import { useTryAgainHooks } from "../../../utils/useTryAgainHooks";
const SelectionPage = (props) => {
  const { type } = props;
  const { loading, token, positions, entities, remember } = useSelector(
    (state) => state.auth,
  );
  const { bodyError, modalError } = useSelector((state) => state.general);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState();
  const [body, setBody] = useState({});
  const tokenJSON = JSON.parse(token);
  useEffect(() => {
    if (type === "position") {
      setData(JSON.parse(positions));
    } else {
      setData(JSON.parse(entities));
    }
  }, [positions, entities, type]);
  const handleLogout = async () => {
    try {
      handleCancel();
      await dispatch(logout())?.unwrap();
      if (tokenJSON?.userLevel !== "Super User") {
        navigate("/login");
      } else {
        navigate("/login-su");
      }
    } catch (error) {
      handleCancel();
    }
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleCloseModalError = () => {
    dispatch(hideModalError());
    if (bodyError?.return === true) {
      navigate(-1);
    } else if (bodyError?.code === 401 || bodyError?.code === 500) {
      dispatch(logoutTokenExpired());
    }
  };

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "TAKE_OVER_DELEGATION") {
      dispatch(takeOverDelegation(body));
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <Spin spinning={loading}>
      <div className="h-screen w-full">
        <div className={"flex w-full bg-white px-5 pt-10 justify-between"}>
          <ButtonComponent
            onClick={() => setOpenModal(true)}
            icon={<LeftOutlined style={{ color: "#0075BF" }} type="default" />}
            border={false}
          >
            Log Out
          </ButtonComponent>
          <ButtonComponent type={"submit"}>
            Welcome, {tokenJSON?.username}
          </ButtonComponent>
        </div>
        <div className={"w-full justify-center flex mt-10"}>
          <span className={" text-5xl text-[#0075BF]"}>
            {type === "position"
              ? "Choose Your Position"
              : "Choose Your Entity"}
          </span>
        </div>
        <CarouselListSelection
          type={type}
          data={data}
          remember={remember}
          setBody={setBody}
        />
        <ModalCustom
          isOpen={openModal}
          handleCancel={handleCancel}
          header={"LOGOUT"}
          handleOk={handleLogout}
          isAlert={true}
          type={"confirmation"}
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
                Logout
              </ButtonComponent>
            </div>
          </div>
        </ModalCustom>
      </div>
      <Timer durations={tokenJSON.expired} />
      <ModalError
        isOpen={modalError}
        handleOk={handleCloseModalError}
        handleCancel={handleCloseModalError}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{bodyError?.title}</p>
          </div>
          <p className="pl-[70px]">{bodyError?.description}</p>
          {(bodyError?.data || []).map((item) => (
            <ul className="pl-[70px]">
              <li>{Object.values(item)[0]}</li>
            </ul>
          ))}
        </div>
      </ModalError>

      {/* modal try again */}
      {renderModal()}
    </Spin>
  );
};

export default SelectionPage;
