import React, { useState } from "react";
import { Input, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { FilterOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import RadioTabs from "../../../../../components/RadioTabs";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import ColumnSettings from "../../../../../components/ColumnSettings/ColumnSettings";
import BaseContainer from "../../../../../components/BaseContainer";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import { useRef } from "react";

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

const buildAttachmentColumns = () => [
  {
    key: "no",
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => index + 1,
  },
  {
    key: "fileCategoryName",
    title: "CATEGORY",
    dataIndex: "fileCategoryName",
    align: "left",
  },
  {
    key: "fileName",
    title: "FILENAME",
    dataIndex: "fileName",
    align: "left",
  },
  {
    key: "action",
    title: "ACTION",
    align: "center",
    width: 80,
    render: (_, record) => {
      if (!record.base64) return null;
      const handlePreview = () => {
        const raw = record.base64.includes(",")
          ? record.base64.split(",")[1]
          : record.base64;
        const byteChars = atob(raw);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteArr[i] = byteChars.charCodeAt(i);
        }
        const blob = new Blob([byteArr], {
          type: record.fileType || "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      };
      return (
        <Tooltip title="Preview">
          <EyeOutlined
            style={{ fontSize: 16, cursor: "pointer", color: "#1890ff" }}
            onClick={handlePreview}
          />
        </Tooltip>
      );
    },
  },
];

const ModalConfirmApprovalActivation = ({
  isOpen,
  onCancel,
  onConfirm,
  selectedRows,
  listAttachment,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState("VA Account Information");
  const [searchContent, setSearchContent] = useState("");
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const vaColumns = buildVAAccountColumns(
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
  );

  const visibleVAColumns = vaColumns.filter(
    (col) => !optionSelectedCol.includes(col.key)
  );

  const attachmentColumns = buildAttachmentColumns();

  const handleCancel = () => {
    setActiveTab("VA Account Information");
    onCancel();
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancel}
      header="Confirmation"
      width={1100}
      type="confirmation"
      footer={
        <div className="w-full flex justify-between p-4">
          <ButtonComponent type="default" onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent type="submit" onClick={onConfirm} loading={loading}>
            Confirm
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
                columns={vaColumns}
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
            dataSource={selectedRows || []}
            pageSize={pageSize}
            columns={visibleVAColumns}
            current={page}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            onSizeChanger={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            totalData={selectedRows?.length || 0}
          />
        </BaseContainer>
      </div>

      {/* Attachment File Tab */}
      <div className={activeTab !== "Attachment File" ? "hidden" : ""}>
        <BaseContainer header="ATTACHMENT FILE">
          <TablePagination
            dataSource={listAttachment || []}
            pageSize={10}
            columns={attachmentColumns}
            current={1}
            onChange={() => {}}
            onSizeChanger={() => {}}
            totalData={listAttachment?.length || 0}
          />
        </BaseContainer>
      </div>
    </ModalCustom>
  );
};

export default ModalConfirmApprovalActivation;
