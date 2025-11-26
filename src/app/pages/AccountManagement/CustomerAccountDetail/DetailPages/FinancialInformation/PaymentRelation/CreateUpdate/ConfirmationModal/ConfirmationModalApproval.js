import { useState, useRef, Fragment } from "react";
import ConfirmationModalHierarchy from "./ConfirmationModalHierarchy";

const ConfirmationModalApproval = ({
  dataTable = [],
  selectedHierarchy = "",
  dataOption = [],
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
        selectedHierarchy={selectedHierarchy}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
        dataOption={dataOption}
      />
    </Fragment>
  );
};

export default ConfirmationModalApproval;
