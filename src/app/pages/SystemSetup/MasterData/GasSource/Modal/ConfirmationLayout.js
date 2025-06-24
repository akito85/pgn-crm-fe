import React from "react";
import DetailText from "../../../../../../components/DetailText";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../components/TablePagination";

const ConfirmationLayout = ({
  data,
  modalConfirm,
  handleCancel = () => {},
  handleConfirm,
  column,
  apiUOM,
}) => {
  const labelUOM = apiUOM
    ?.filter((a) => a.uomId === data?.uom)
    ?.find((b) => b.uomName)?.uomName;

  return (
    <ModalCustom
      isOpen={modalConfirm}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
      handleCancel={handleCancel}
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
      <div className="w-full p-5">
        <span className="text-primary uppercase font-bold">
          gas source information
        </span>

        <div className="w-full grid grid-cols-3 gap-5 pt-[30px]">
          <DetailText label="Calorie Code">{data?.calorieCode}</DetailText>
          <DetailText label="Name">{data?.name}</DetailText>
          <DetailText label="UOM">{labelUOM}</DetailText>
          <div className="col-span-3">
            <DetailText label="Description">{data?.description}</DetailText>
          </div>
        </div>
      </div>

      <div className="w-full p-5">
        <span className="text-primary uppercase font-bold mt-[30px]">
          gas quality criteria information
        </span>

        <div className="w-full pt-[30px]">
          <TablePagination
            dataSource={data?.criteria}
            columns={column?.filter((item) => item.title !== "ACTION")}
            pageSize={10}
            current={1}
            totalData={data?.criteria?.length}
            tableScrolled={{ x: 2000, y: 500 }}
          />
        </div>
      </div>
    </ModalCustom>
  );
};

export default ConfirmationLayout;
