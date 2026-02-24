import { Form } from "antd";
import { useRef, useState } from "react";
import ApprovalHierarchy from "./ApprovalHierarchy";

const ApprovalSectionForm = ({
  dataTable,
  dataOption,
  handleSelectHiararchy = () => {},
  showSelect = true,
  disableSelect = false,
  form,
  formView = true,
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const appHierId = Form.useWatch("appHierId", form);
  const appHierName = Form.useWatch("appHierName", form);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  return (
    <ApprovalHierarchy
      dataTable={dataTable}
      dataOption={dataOption}
      handleSelectHiararchy={handleSelectHiararchy}
      selectedAppHierId={appHierId}
      searchInput={searchInput}
      searchedColumn={searchedColumn}
      searchText={searchText}
      handleSearch={handleSearch}
      showSelect={formView ? showSelect : false}
      disableSelect={formView ? disableSelect : true}
      approvalName={appHierName}
    />
  );
};

export default ApprovalSectionForm;
