import React from "react";
import FunctionalTableCriteria from "../Table/FunctionalTableCriteria";

const Criteria = (props) => {
  const {
    listDataCriteria = [],
    criteriaValues = [],
    setListDataCriteria = () => {},
    type,
    storedData = false,
    setStoredData = () => {},
  } = props;

  return (
    <div className="w-full flex justify-end mb-[30px]">
      <FunctionalTableCriteria
        type={type}
        data={listDataCriteria}
        dataCriteria={criteriaValues}
        updateData={setListDataCriteria}
        storedData={storedData}
        setStoredData={setStoredData}
      />
    </div>
  );
};

export default Criteria;
