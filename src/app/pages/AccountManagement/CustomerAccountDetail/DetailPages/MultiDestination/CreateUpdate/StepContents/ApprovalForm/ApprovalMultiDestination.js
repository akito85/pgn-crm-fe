import React, { useEffect, useRef, useState } from "react";
import ApprovalHierarchy from "./ApprovalHierarchy";

const ApprovalSectionForm = ({
  dataTable,
  dataOption,
  selectedAppHierId = 0,
  handleSelectHiararchy = () => {},
  showSelect = true,
  disableSelect = false,
  approvalName = "",
  className,
}) => {
  useEffect(() => {
    console.log("dataOption", dataOption);
  }, [dataOption])

  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  return (
    <div className={`flex flex-col gap-y-5 ${className} drop-shadow-lg bg-white rounded-lg w-full p-9`} >
      <span className="text-primary text-sm font-bold uppercase">
        APPROVAL
      </span>
      <ApprovalHierarchy
        dataTable={dataTable}
        dataOption={dataOption}
        handleSelectHiararchy={handleSelectHiararchy}
        selectedAppHierId={selectedAppHierId}
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
