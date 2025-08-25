import { Image } from "antd";
import { dateFormatting } from "../../../../../utils";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const ModalConfirmationAnnouncement = ({
  isOpen,
  data,
  handleCancel = () => {},
  handleConfirm = () => {},
  valuePage,
}) => {
  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
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
        {"ANNOUNCEMENT INFORMATION"}
      </p>
      <div className="w-full grid grid-cols-2 gap-[30px]">
        <div>
          <DetailText label={"Announcement Name"}>{data?.annName}</DetailText>
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
          <DetailText label={"Description"}>{data?.description}</DetailText>
        </div>
        <div className="w-full gap-3 pl-4">
          {valuePage === "HTML" ? (
            <DetailText label={"Content"}>{data?.annContent}</DetailText>
          ) : (
            <DetailText label={"Content"}>
              {data?.image === undefined ? (
                <Image width={300} src={data?.urlImage} className="my-2" />
              ) : (
                <Image
                  width={300}
                  src={`data:image/png;base64,${data?.image}`}
                  className="my-2"
                />
              )}
            </DetailText>
          )}
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalConfirmationAnnouncement;
