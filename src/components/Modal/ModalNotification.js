import { ExclamationCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { ModalError } from "./ModalPopUp";
import useStatusModal from "./useStatusModal";

const ModalNotification = (props) => {
  const {
    isFailed,
    isSuccess,
    typeModal,
    handleAction = () => {},
    status,
  } = props;
  const { textHead, textDesc } = useStatusModal({
    isFailed,
    isSuccess,
    status,
    typeModal,
  });
  const [modalFailed, setModalFailed] = useState();
  useEffect(() => {
    setModalFailed(isFailed);
  }, [isFailed]);
  const handleClose = () => {
    setModalFailed(false);
  };
  return (
    <div>
      {/* <ModalSuccess isOpen={isSuccess} handleCancel={handleAction}>
				<div className="w-full justify-center flex mt-6 mb-2 text-[#a4be37]">
					<CloseCircleOutlined className={"text-2xl mr-3"} />
					<span className={"text-xl text-bold text-black"}>
						{textHead}
					</span>
				</div>
				<div className={"w-full justify-center flex"}>
					<span>{textDesc}.</span>
				</div>
				<div className={"w-full justify-end flex pr-8 pb-5"}>
					<ButtonComponent
						type={"submit"}
						onClick={handleAction}
						border={false}
					>
						Ok
					</ButtonComponent>
				</div>
			</ModalSuccess> */}
      <ModalError
        isOpen={modalFailed}
        handleCancel={handleClose}
        handleOk={handleClose}
      >
        <div className={"flex px-8 py-8"}>
          <ExclamationCircleFilled
            style={{ fontSize: "24px", color: "#C81912" }}
            className="my-2"
          />
          <div className="w-full flex-col">
            <div className="pl-4">
              <span className="text-xl font-bold  text-[#C81912]">
                {textHead}
              </span>
            </div>
            <div className="pl-4 pt-4">
              <span className={"text-l"}>{textDesc}</span>
            </div>
          </div>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalNotification;
