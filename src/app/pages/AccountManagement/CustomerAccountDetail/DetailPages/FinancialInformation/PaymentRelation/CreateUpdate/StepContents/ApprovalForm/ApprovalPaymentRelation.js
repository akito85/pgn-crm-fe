import React, { useRef, useState } from "react";
import ApprovalHierarchy from "./ApprovalHierarchy";
import BaseContainer from "../../../../../../../../../../components/BaseContainer";

const ApprovalSectionForm = ({
  dataTable,
  dataOption,
  selectedHierarchy = "",
  updateSelectedHierarchy = () => {},
  showSelect = true,
  disableSelect = false,
  approvalName = "",
  className,
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleUpdateSelectHierarchy = (val) => {
    updateSelectedHierarchy(val);
  };
  return (
    <div className={`flex flex-col gap-y-5 ${className} drop-shadow-lg bg-white rounded-lg w-full p-9`} >
      <span className="text-primary text-sm font-bold uppercase">
        APPROVAL
      </span>
      <ApprovalHierarchy
        dataTable={dataTable}
        dataOption={dataOption}
        updateSelectHierarchy={handleUpdateSelectHierarchy}
        selectedHierarchy={selectedHierarchy}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
        showSelect={showSelect}
        disableSelect={disableSelect}
        approvalName={approvalName}
      />
    </div>
  );
};

export default ApprovalSectionForm;
