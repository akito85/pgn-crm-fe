import { useState, useRef, Fragment } from "react";
import ModalConfirmationCreateUpdateApprovalPaymentRelationHierarchy from "./ModalConfirmationCreateUpdateApprovalPaymentRelationHierarchy";

const ModalConfirmationCreateUpdateApprovalPaymentRelationApproval = ({
  dataTable = [],
  selectedHierarchy = "",
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
      <ModalConfirmationCreateUpdateApprovalPaymentRelationHierarchy
        dataTable={dataTable}
        selectedHierarchy={selectedHierarchy}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
      />
    </Fragment>
  );
};

export default ModalConfirmationCreateUpdateApprovalPaymentRelationApproval;
