import React from "react";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import userHttpService from "../../../../redux/services/userHttpService";
import { configApp } from "../../../../constants/configApp";

const ForwardTaskConfirm = ({
  isOpen,
  handleClose = () => {},
  handleConfirm = () => {},
  data,
  ddl = {},
}) => {
  const fromName =
    ddl?.dataFrom?.find((item) => item?.positionIdFrom === data?.from)?.name ||
    "";
  const toName =
    ddl?.dataTo?.find((item) => item?.uniqueId === data?.to)?.name || "";

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={950}
      handleCancel={handleClose}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleClose}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={() => handleConfirm()}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <p className="text-primary text-xs font-bold uppercase pt-[5px]">
        {"Forward Task INFORMATION"}
      </p>
      <div className="w-full">
        <div className="grid grid-cols-4 gap-2">
          <DetailText label={"From"}>{fromName}</DetailText>
          <DetailText label={"To"}>{toName}</DetailText>
          <DetailText label={"Remark"}>{data.remark}</DetailText>
        </div>
        <div className={"w-full flex flex-col"}>
          <AttachmentComponent
            type={"preview"}
            data={data?.listDataAttachment}
            typeSelector="delegation"
            service={userHttpService}
            configApplication={configApp.USER_MANAGEMENT_SERVICE}
          />
        </div>
      </div>
    </ModalCustom>
  );
};

export default ForwardTaskConfirm;
