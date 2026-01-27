import { useState, useRef, Fragment } from "react";
import ConfirmationModalHierarchy from "./ConfirmationModalHierarchy";
import CardContainer from "../../../../../../../../../components/CardContainer";

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
    <CardContainer header={"APPROVAL"}>
      <ConfirmationModalHierarchy
        dataTable={dataTable}
        selectedAppHierId={selectedAppHierId}
        selectedApprovalName={selectedApprovalName}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
      />
    </CardContainer>
  );
};

export default ConfirmationModalApproval;
