import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CardComponent from "../../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../../components/DetailText";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../../components/TablePagination";

const ModalDetailDM = ({
  openModal,
  closeModal = () => {},
  data,
  totalData,
  page,
  pageSize,
  handleChange,
  columns,
  onSort,
}) => {
  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="detail"
      header="Detail Distribution Media"
      width={800}
      footer={
        <ButtonComponent type={"default"} onClick={closeModal}>
          Cancel
        </ButtonComponent>
      }
    >
      <CardComponent header={"Product Information"} cols={3}>
        <DetailText label={"Product Name"}>{data.productName}</DetailText>
        <DetailText label={"Price Code"}>{data.pricing}</DetailText>
        <DetailText label={"Product Description"}>
          {data.description}
        </DetailText>
        <DetailText label={"Start Date"}>{data.startDate}</DetailText>
        <DetailText label={"Remark"}>{data.remark}</DetailText>
      </CardComponent>

      <div className="w-full flex flex-col gap-[30px]">
        <span className="text-primary uppercase font-bold">
          PRODUCT DETAIL INFORMATION
        </span>

        <TablePagination
          dataSource={data.productDetail}
          totalData={data?.productDetail?.length}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          columns={columns}
          onSort={onSort}
        />
      </div>
    </ModalCustom>
  );
};

export default ModalDetailDM;
