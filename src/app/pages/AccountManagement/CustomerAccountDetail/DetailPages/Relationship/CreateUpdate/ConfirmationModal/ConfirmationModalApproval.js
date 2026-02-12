import { useState, useRef } from "react";
import ConfirmationModalHierarchy from "./ConfirmationModalHierarchy";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";

const ConfirmationModalApproval = ({
  dataTable = [],
  selectedAppHierId = "",
  selectedApprovalName = "",
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  return (
    <NxBaseContainer border header={"APPROVAL"}>
      <ConfirmationModalHierarchy
        dataTable={dataTable}
        selectedAppHierId={selectedAppHierId}
        selectedApprovalName={selectedApprovalName}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
      />
    </NxBaseContainer>
  );
};

export default ConfirmationModalApproval;
