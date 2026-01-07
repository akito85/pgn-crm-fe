import React, { useState } from "react";
import { Input } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { TablePaginationNew } from "poc-table-dragandrop";
import TablePagination from "../../../../../../components/TablePagination";

const { TextArea } = Input;

const MAX_REMARK_LENGTH = 255;

/**
 * Create nested column configuration for related detail
 * @param {string} title - Column title
 * @param {string} dataIndex - Data index for the column
 * @returns {Object} Column configuration
 */
const createNestedColumn = (title, dataIndex) => ({
  title: () => (
    <div className="flex items-center justify-between w-full">
      <span>{title}</span>
    </div>
  ),
  dataIndex,
  align: "left",
  sorter: (a, b) => (a[dataIndex] || "").localeCompare(b[dataIndex] || ""),
  render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
});

// Nested columns for related detail (memoized outside component)
const NESTED_COLUMNS = [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (
      <div style={{ padding: "8px 0" }}>{index + 1}</div>
    ),
  },
  createNestedColumn("ACCOUNT NUMBER", "accountNumber"),
  createNestedColumn("ACCOUNT NAME", "accountName"),
  createNestedColumn("ACCOUNT CATEGORY", "accountCategory"),
  createNestedColumn("SOR", "sor"),
  createNestedColumn("COST CENTER", "costCenter"),
  createNestedColumn("METER READING CODE", "meterReadingCode"),
];

// Expandable row renderer for Related Detail
const expandedRowRender = (record) => {
  const relatedDetailData = record?.relatedDetail || [];

  return (
    <div className="bg-blue-50 -mx-2 pl-6 py-2">
      <h4 className="text-[#0075bf] font-semibold text-sm my-2">RELATED DETAIL</h4>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={relatedDetailData}
        columns={NESTED_COLUMNS}
        className="related-detail-nested-table"
      />
    </div>
  );
};

const ModalConfirmApproval = ({
  isOpen = false,
  handleCancel = () => { },
  handleConfirm = () => { },
  type = "approve", // 'approve' or 'reject'
  selectedData = [],
}) => {
  const [remark, setRemark] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const remainingChars = 255 - remark.length;

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleSubmit = () => {
    handleConfirm(remark);
    setRemark("");
  };

  const handleClose = () => {
    handleCancel();
    setRemark("");
  };

  // Column order: NO, TYPE, CATEGORY, RELATED NAME, RELATED NUMBER
  const columns = [
    {
      title: "NO",
      width: 70,
      align: "center",
      render: (text, object, index) => (
        <div className="py-2.5">{(page - 1) * pageSize + index + 1}</div>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "relationshipTypeName",
      width: 200,
      sorter: true,
      render: (text) => <div>{text || "-"}</div>,
    },
    {
      title: "CATEGORY",
      dataIndex: "relationshipCategoryName",
      width: 150,
      sorter: true,
      render: (text) => <div>{text || "-"}</div>,
    },
    {
      title: "RELATED NAME",
      dataIndex: "subjectName",
      width: 200,
      sorter: true,
      render: (text, record) => (
        <div>{record.subjectName || record.objectName || "-"}</div>
      ),
    },
    {
      title: "RELATED NUMBER",
      dataIndex: "subjectValue",
      width: 200,
      sorter: true,
      render: (text, record) => (
        <div className="text-[#0075bf] cursor-pointer">
          {record.objectValue || "-"}
        </div>
      ),
    },
  ];

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="CONFIRMATION APPROVAL"
      width={1200}
      centered={false}
      style={{ top: 20 }}
      handleCancel={handleClose}
      footer={
        <div className="w-full flex justify-end gap-3">
          <ButtonComponent type="default" onClick={handleClose}>
            Cancel
          </ButtonComponent>
          <ButtonComponent type="submit" onClick={handleSubmit}>
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <div className="w-full">
        {/* Warning Message */}
        <div
          className="mb-6 p-4 rounded-lg flex items-start gap-3"
          style={{ backgroundColor: "#FEF3C7" }}
        >
          <div className="flex-shrink-0 mt-0.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                fill="#F59E0B"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-center font-medium text-[#65481C] mb-0">
              {type === "approve"
                ? "Are you sure you want to approve selected data?"
                : "Are you sure you want to reject selected data?"}
            </p>
          </div>
        </div>

        {/* Table with TablePaginationNew */}
        <div className="mb-6">
          <TablePaginationNew
            dataSource={selectedData}
            totalData={selectedData.length}
            current={page}
            pageSize={pageSize}
            tableScrolled={{ y: 300, x: 900 }}
            onChange={handleChange}
            columns={columns}
            rowKey="id"
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => record?.relatedDetail && record.relatedDetail.length > 0,
            }}
            enableDragColumn={false}
          />
        </div>

        {/* Remark */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Remark <span className="text-red-500">*</span>
          </label>
          <TextArea
            rows={3}
            placeholder="Type your remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            maxLength={MAX_REMARK_LENGTH}
          />
          <div className="text-xs text-gray-500 mt-1">
            You have {remainingChars} of {MAX_REMARK_LENGTH} characters remaining.
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalConfirmApproval;

