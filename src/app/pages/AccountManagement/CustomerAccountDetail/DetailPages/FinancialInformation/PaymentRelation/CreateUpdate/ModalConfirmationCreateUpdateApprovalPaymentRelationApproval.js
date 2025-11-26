import { useState, useRef } from "react";
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
    <div className="flex flex-col gap-3">
      <ModalConfirmationCreateUpdateApprovalPaymentRelationHierarchy
        dataTable={dataTable}
        selectedHierarchy={selectedHierarchy}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default ModalConfirmationCreateUpdateApprovalPaymentRelationApproval;
