import React, { useRef, useState } from "react";
import { Input, message } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import RadioTabs from "../../../../../components/RadioTabs";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import ColumnSettings from "../../../../../components/ColumnSettings/ColumnSettings";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import BaseContainer from "../../../../../components/BaseContainer";
import { getListCategory } from "../../../../../redux/slices/receipt_collection/bankSlice";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";

const buildVAAccountColumns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "no",
    title: "NO",
    width: 60,
    dataIndex: "no",
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: true,
    align: "left",
    ...getColumnSearchProps(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    sorter: true,
    align: "left",
    ...getColumnSearchProps(
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    sorter: true,
    align: "left",
    ...getColumnSearchProps(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    align: "left",
    ...getColumnSearchProps(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "vaNumber",
    title: "VA NUMBER",
    dataIndex: "vaNumber",
    sorter: true,
    align: "left",
    ...getColumnSearchProps(
      "vaNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
];

const ModalApprovalActivation = ({
  isOpen,
  onCancel,
  onNext,
  dataVAAccount,
}) => {
  const dispatch = useDispatch();

  // Tab state
  const [activeTab, setActiveTab] = useState("VA Account Information");

  // VA Account tab state
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Attachment tab state
  const [listAttachment, setListAttachment] = useState([]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const columns = buildVAAccountColumns(
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
  );

  const visibleColumns = columns.filter(
    (col) => !optionSelectedCol.includes(col.key)
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };

  const dataSource = (dataVAAccount?.result || []).filter(
    (row) => row.statusApproval !== "APPROVED"
  );
  const totalData = dataSource.length;

  const handleNext = () => {
    if (selectedRows.length === 0) {
      message.warning("Please select at least one VA account.");
      return;
    }
    if (listAttachment.length === 0) {
      message.warning("Please add at least one attachment.");
      return;
    }
    onNext(selectedRows, listAttachment);
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setListAttachment([]);
    setActiveTab("VA Account Information");
    onCancel();
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancel}
      header="Approval Activation"
      width={1100}
      type="confirmation"
      footer={
        <div className="w-full flex justify-between p-4">
          <ButtonComponent type="default" onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent type="submit" onClick={handleNext}>
            Next
          </ButtonComponent>
        </div>
      }
    >
      <RadioTabs
        data={[
          { value: "VA Account Information" },
          { value: "Attachment File" },
        ]}
        onChange={(e) => setActiveTab(e.target.value)}
        currentPosition={activeTab}
      />

      {/* VA Account Information Tab */}
      <div className={activeTab !== "VA Account Information" ? "hidden" : ""}>
        <BaseContainer header="VA ACCOUNT INFORMATION">
          <div className="flex justify-between items-center mb-3 gap-2">
            <div className="flex items-center gap-2">
              <ColumnSettings
                columns={columns}
                hiddenColumns={optionSelectedCol}
                onHiddenColumnsChange={setOptionSelectedCol}
                fixedColumns={fixedColumns}
                onFixedColumnsChange={setFixedColumns}
                buttonText="Column Settings"
                buttonStyle={{ height: "32px", fontSize: "12px" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <ButtonComponent
                type="default"
                onClick={() => {}}
                icon={<FilterOutlined style={{ fontSize: "14px" }} />}
              >
                Advanced Search
              </ButtonComponent>
              <Input
                placeholder="Search Content"
                style={{ width: 200, height: 32, fontSize: 12 }}
                value={searchContent}
                onChange={(e) => {
                  setSearchContent(e.target.value);
                  setPage(1);
                }}
                allowClear
              />
            </div>
          </div>
          <TablePagination
            dataSource={dataSource}
            pageSize={pageSize}
            columns={visibleColumns}
            current={page}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            onSizeChanger={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            totalData={totalData}
            rowSelection={rowSelection}
          />
        </BaseContainer>
      </div>

      {/* Attachment File Tab */}
      <div className={activeTab !== "Attachment File" ? "hidden" : ""}>
        <BaseContainer header="ATTACHMENT FILE">
          <AttachmentSectionForm
            type="create"
            data={listAttachment}
            updateData={setListAttachment}
            typeSelector="bank"
            dispatch={dispatch}
            getAPICategory={getListCategory}
          />
        </BaseContainer>
      </div>
    </ModalCustom>
  );
};

export default ModalApprovalActivation;
