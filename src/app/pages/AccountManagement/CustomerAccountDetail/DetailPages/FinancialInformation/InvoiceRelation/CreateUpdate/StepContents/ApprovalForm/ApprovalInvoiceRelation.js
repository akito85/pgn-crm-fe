import { useRef, useState } from "react";
import ApprovalHierarchy from "./ApprovalHierarchy";
import NxCardContainer from "../../../../../../../../../../components/Nx/NxCardContainer";

const ApprovalSectionForm = ({
  dataTable,
  dataOption,
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
    <NxCardContainer header={"APPROVAL"} className={`${className}`}>
      <ApprovalHierarchy
        dataTable={dataTable}
        dataOption={dataOption}
        handleSelectHiararchy={handleSelectHiararchy}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
        showSelect={showSelect}
        disableSelect={disableSelect}
        approvalName={approvalName}
      />
    </NxCardContainer>
  );
};

export default ApprovalSectionForm;
