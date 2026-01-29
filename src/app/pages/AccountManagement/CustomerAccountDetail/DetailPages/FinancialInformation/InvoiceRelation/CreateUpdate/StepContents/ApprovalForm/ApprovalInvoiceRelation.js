import { useRef, useState } from "react";
import ApprovalHierarchy from "./ApprovalHierarchy";
import CardContainer from "../../../../../../../../../../components/CardContainer";

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
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  return (
    <CardContainer header={"APPROVAL"} className={`${className}`}>
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
    </CardContainer>
  );
};

export default ApprovalSectionForm;
