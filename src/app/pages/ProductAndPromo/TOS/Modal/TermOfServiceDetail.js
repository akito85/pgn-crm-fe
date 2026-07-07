import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import {
  getTosAttribute,
  getTosDetail,
  getSelectCriteria,
} from "../../../../../redux/slices/product_promo/tos";
import { lowerCaseStatus } from "../../Product/utils";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";
import { getCriteriaIdByCode } from "../../UtilsProduct/UtilsAllProduct";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";

const TermOfServiceDetail = ({ openModal, closeModal, id }) => {
  // Selector
  const { data_detail, data_attribute, data_criteria } = useSelector(
    (state) => state.tos
  );

  // Declaration
  const dispatch = useDispatch();

  // Use Effect
  useEffect(() => {
    if (id) {
      dispatch(getTosDetail(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    dispatch(getTosAttribute());
    dispatch(getSelectCriteria());
  }, [dispatch]);

  const criteriaOptions = (data_criteria || []).map((item) => ({
    name: item.text,
    value: item.id,
    code: item?.code,
  }));
  const countryCriteriaId = getCriteriaIdByCode(criteriaOptions, "COUNTRY");

  const criteria = (data_detail?.criterias || [])?.map((item) => {
    return {
      id: item?.id || null,
      idCriteria: item?.criteriaId || null,
      idTos: item?.idTos || null,
    };
  })
  ?.map((item) => item.idCriteria);

  // find data attribute
  const matchedObjects = data_attribute?.data?.filter((obj) =>
    data_detail?.attributes
      ?.map((a) => a.attributeId)
      ?.includes(obj.glbTypeValId)
  );

  const matchedNames = matchedObjects
    ?.map((obj) => obj.name)
    ?.reduce((current, next) => current + `, ${next}`, "");

  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="detail"
      header="Detail Term Of Services"
      width={800}
      footer={
        <ButtonComponent type={"default"} onClick={closeModal}>
          Back
        </ButtonComponent>
      }
    >
      <CardComponent header={"TERM OF SERVICE INFORMATION"} cols={1}>
        <DetailText label="Name">{data_detail?.name}</DetailText>
        <DetailText label="Attribute">{matchedNames?.slice(2)}</DetailText>
        <DetailText label="Criteria">{data_detail?.criteria}</DetailText>
        <DetailText label="Status">
          {data_detail?.status ? lowerCaseStatus(data_detail?.status) : ""}
        </DetailText>
        <DetailText label="Description">{data_detail?.description}</DetailText>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">{data_detail?.id}</DetailText>
        <DetailText label="Created Date">
          {data_detail?.createdDate
            ? moment(data_detail.createdDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
        <DetailText label="Updated Date">
          {data_detail?.updatedDate
            ? moment(data_detail.updatedDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
      </CardComponent>

      {!criteria.includes(37) ? (
        <div className="w-full">
          <p className="text-primary text-xs font-semibold uppercase">
            CRITERIA INFORMATION
          </p>

          <div className="w-full pt-[30px]">
            <FunctionalCriteriaProduct
              type={"detail"}
              data={data_detail?.listCriterias} //data
              dataCriteria={criteria} //ddl
              selector="tos"
              idTable="tos-detail-criteria-table"
              columnsTable={columnsTableCriteriaAll}
              countryCriteriaId={countryCriteriaId}
            />
            {/* <TableDetailCriteria
              type={"detail"}
              dataCriteria={criteria}
              listCriteria={(data_detail?.listCriterias || []).filter(
                (item) => item.allCriteria !== true
              )}
            /> */}
          </div>
        </div>
      ) : null}
    </ModalCustom>
  );
};

export default TermOfServiceDetail;
