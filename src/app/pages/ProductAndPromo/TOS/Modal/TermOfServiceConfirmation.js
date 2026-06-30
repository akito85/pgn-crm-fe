import React from "react";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";

const TermOfServiceConfirmation = ({
  data,
  openModal,
  closeModal = () => {},
  handleConfirm = () => {},
  listDataCriteria = [],
  criteriaValues = [],
  apiAttribute,
  apiCriteria,
  countryCriteriaId,
}) => {
  // find data attribute
  const matchedObjectsAttribute = apiAttribute?.filter((obj) =>
    data?.attribute?.includes(obj.glbTypeValId)
  );
  const matchedNamesAttribute = matchedObjectsAttribute
    ?.map((obj) => obj.name)
    ?.reduce((current, next) => current + `, ${next}`, "");

  // find data criteria
  const matchedObjectsCriteria = apiCriteria?.filter((obj) =>
    data?.rPricingRuleCriterias?.includes(obj.glbTypeValId || obj?.id)
  );
  const matchedNamesCriteria = matchedObjectsCriteria
    ?.map((obj) => obj.name || obj?.text)
    ?.reduce((current, next) => current + `, ${next}`, "");

  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="confirmation"
      header="CONFIRMATION"
      width={1000}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={closeModal}>
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
        <div>
          <span className="text-primary uppercase font-bold">
            terms of service information
          </span>
        </div>

        <div className="w-full grid grid-cols-2 gap-2 pt-[30px]">
          <DetailText label="Name">{data?.name}</DetailText>
          <div className="col-span-2">
            <DetailText label="Attribute">
              {matchedNamesAttribute?.slice(2)}
            </DetailText>
          </div>
          <div className="col-span-2">
            <DetailText label="Criteria">
              {matchedNamesCriteria?.slice(2)}
            </DetailText>
          </div>
          <div className="col-span-2">
            <DetailText label="Description">{data?.description}</DetailText>
          </div>
        </div>

        <div className="w-full pt-[30px]">
          <span className="text-primary uppercase font-bold">
            criteria information
          </span>
          <div className="pt-[30px]">
          <FunctionalCriteriaProduct
              type={"preview"}
              data={listDataCriteria}
              dataCriteria={criteriaValues}
              columnsTable={columnsTableCriteriaAll}
              countryCriteriaId={countryCriteriaId}
            />
            {/* <FunctionalTableCriteriaTOS
              type={"detail"}
              data={listDataCriteria}
              dataCriteria={criteriaValues}
            /> */}
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

export default TermOfServiceConfirmation;
