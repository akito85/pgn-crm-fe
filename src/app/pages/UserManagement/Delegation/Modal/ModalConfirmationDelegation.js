import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import userHttpService from "../../../../../redux/services/userHttpService";
import { configApp } from "../../../../../constants/configApp";
import { dateFormatting } from "../../../../../utils";
import moment from "moment";

const ModalConfirmationAnnouncement = ({
  type,
  isOpen,
  data,
  handleCancel = () => {},
  handleConfirm = () => {},
  listDataAttachment = [],
  apiDelegateTo = [],
  apiPosition = [],
}) => {
  const position = apiPosition
    ?.filter((a) => a.id === data?.positionDelegateTo)
    ?.find((v) => v.name)?.name;

  const delegateTo = apiDelegateTo
    ?.filter((a) => a.id === data?.delegateTo)
    ?.find((v) => v.name)?.name;

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={950}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <p className="text-primary text-xs font-bold uppercase pt-[5px]">
        {"DELEGATION INFORMATION"}
      </p>
      <div className="w-full">
        <div className="grid grid-cols-4 gap-2">
          <DetailText label={"Position"}>{position}</DetailText>
          <DetailText label={"Delegate To"}>{delegateTo}</DetailText>
          <DetailText label={"Start Date"}>
            {data?.startDate
              ? moment(data?.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"End Date"}>
            {data?.endDate
              ? moment(data?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"Remark"}>{data?.remark}</DetailText>
        </div>
        <div className={"w-full flex flex-col"}>
          <AttachmentComponent
            type={"preview"}
            data={listDataAttachment}
            typeSelector="delegation"
            service={userHttpService}
            configApplication={configApp.USER_MANAGEMENT_SERVICE}
          />
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalConfirmationAnnouncement;
