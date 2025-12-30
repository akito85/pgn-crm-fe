import moment from "moment";
import { useEffect, useState } from "react";
import { ModalError } from "./Modal/ModalPopUp";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ButtonComponent from "./ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/user_management/auth";
import ModalNotification from "./Modal/ModalNotification";

const Timer = ({ durations }) => {
  const dispatch = useDispatch();
  const { failedRequest } = useSelector((state) => state.auth);
  const duration = moment.duration(parseInt(durations), "minutes");
  const timeSeconds = duration.asSeconds();
  const [timer, setTimer] = useState(timeSeconds);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setShowModal(true);
    }
  }, [timer]);

  const closeModal = () => {
    dispatch(logout());
  };
  return (
    <>
      {/* <div>{formattedTime}</div> */}
      {showModal && (
        <ModalError isOpen={showModal} handleCancel={closeModal} isAlert={true}>
          <div className={"flex px-8 py-8"}>
            <ExclamationCircleFilled
              style={{ fontSize: "24px", color: "#C81912" }}
              className="my-2"
            />
            <div className="w-full flex-col">
              <div className="pl-4">
                <span className="text-xl font-bold  text-[#C81912]">
                  Token expired
                </span>
              </div>
              <div className="pl-4 pt-4">
                <span className={"text-l"}>
                  Your token is expired. Please login again!
                </span>
              </div>
            </div>
          </div>
          <div className={"w-full justify-end flex py-5 px-5"}>
            <ButtonComponent type={"submit"} onClick={closeModal}>
              Ok
            </ButtonComponent>
          </div>
        </ModalError>
      )}
      <ModalNotification isFailed={failedRequest} typeModal={"delete"} />
    </>
  );
};

export default Timer;
