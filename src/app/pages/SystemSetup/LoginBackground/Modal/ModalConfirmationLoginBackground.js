import moment from "moment";
import { Image } from "antd";
import { dateFormatting } from "../../../../../utils";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const ModalConfirmationLoginBackground = ({
  isOpen,
  data,
  handleCancel = () => {},
  handleConfirm = () => {},
  type,
}) => {
  console.log(type);
  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"Confirmation"}
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
        {type === "create"
          ? "Create Login Background"
          : "Update Login Background"}
      </p>
      <div className="w-full grid grid-cols-2 gap-[30px]">
        <div>
          <DetailText label={"Login Background Name"}>
            {data.backgroundName}
          </DetailText>
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
          <DetailText label={"Description"}>{data.description}</DetailText>
        </div>
        <div className="w-full gap-3 pl-4">
          <DetailText label={"Content"}>
            {data.imageBackground === undefined ? (
              <Image width={300} src={data?.urlImage} className="my-2" />
            ) : (
              <Image
                width={300}
                src={`data:image/png;base64,${data?.imageBackground}`}
                className="my-2"
              />
            )}
          </DetailText>
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalConfirmationLoginBackground;
