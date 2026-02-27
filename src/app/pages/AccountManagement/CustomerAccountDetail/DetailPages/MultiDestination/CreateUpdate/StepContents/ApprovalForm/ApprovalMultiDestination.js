import { Form, Input } from "antd";
import { useRef, useState } from "react";
import ApprovalHierarchy from "./ApprovalHierarchy";

const ApprovalSectionForm = ({
  form,
  dataTable,
  dataOption,
  handleSelectHiararchy = () => {},
  showSelect = true,
  disableSelect = false,
  formView = true,
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const appHierId = Form.useWatch("appHierId", { form });
  const appHierName = Form.useWatch("appHierName", { form, preserve: true });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  return (
    <div className="flex flex-col gap-y-4">
      {formView ? (
        <>
          <Form.Item name={"appHierName"} hidden>
            <Input />
          </Form.Item>
          <ApprovalHierarchy
            dataTable={dataTable}
            dataOption={dataOption}
            handleSelectHiararchy={handleSelectHiararchy}
            selectedAppHierId={appHierId}
            searchInput={searchInput}
            searchedColumn={searchedColumn}
            searchText={searchText}
            handleSearch={handleSearch}
            showSelect={showSelect}
            disableSelect={disableSelect}
            approvalName={appHierName}
          />
        </>
      ) : (
        <ApprovalHierarchy
          dataTable={dataTable}
          selectedAppHierId={appHierId}
          showSelect={false}
          disableSelect={true}
          approvalName={appHierName}
        />
      )}
    </div>
  );
};

export default ApprovalSectionForm;
