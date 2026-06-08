import React, { useRef, useState } from "react";
import FunctionalApproval from "./FuctionalApproval";

const ApprovalComponentGeneral = ({
  type,
  dataTable = [],
  dataOption = [],
  selectedHierarchy = "",
  updateSelectedHierarchy = () => {},
  showSelect = true,
  disableSelect = false,
  approvalName = "",
  loading = false,
}) => {
  // Declaration
  const searchInput = useRef(null);

  // State
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
    <div className="flex flex-col gap-y-4">
      <FunctionalApproval
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
        loading={loading}
      />
    </div>
  );
};

export default ApprovalComponentGeneral;
