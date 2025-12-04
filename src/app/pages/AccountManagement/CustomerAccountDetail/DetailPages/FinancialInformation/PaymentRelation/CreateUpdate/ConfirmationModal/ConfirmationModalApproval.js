import { useState, useRef, Fragment } from "react";
import ConfirmationModalHierarchy from "./ConfirmationModalHierarchy";

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
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        APPROVAL
      </div>
      <ConfirmationModalHierarchy
        dataTable={dataTable}
        selectedAppHierId={selectedAppHierId}
        selectedApprovalName={selectedApprovalName}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
      />
    </Fragment>
  );
};

export default ConfirmationModalApproval;
