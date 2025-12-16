import React, { useState } from "react";
import { Input } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../components/TablePagination";

const { TextArea } = Input;

const ModalConfirmApproval = ({
  isOpen = false,
  handleCancel = () => {},
  handleConfirm = () => {},
  type = "approve", // 'approve' or 'reject'
  selectedData = [],
}) => {
  const [remark, setRemark] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const remainingChars = 255 - remark.length;

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
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
      title: "NAME",
      dataIndex: "subjectName",
      render: (text, record) => (
        <div>{record.subjectName || record.objectName || "-"}</div>
      ),
    },
    {
      title: "PROMOTION TYPE",
      dataIndex: "relationshipType",
      render: (text) => <div>{text || "-"}</div>,
    },
    {
      title: "TYPE",
      dataIndex: "relationshipCategory",
      render: (text) => <div>{text || "-"}</div>,
    },
    {
      title: "CATEGORY",
      dataIndex: "directionalFlag",
      render: (text) => <div>{text || "-"}</div>,
    },
  ];

  return (
    <ModalCustom
      isOpen={isOpen}
      type="default"
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
            <p className="text-sm font-medium text-gray-800 mb-0">
              {type === "approve"
                ? "Are you sure you want to approve selected data?"
                : "Are you sure you want to reject selected data?"}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-3">
            Showing 1 to 10 of {selectedData.length} Records
          </div>
          <TablePagination
            useSelect={false}
            usePagination={true}
            dataSource={selectedData.slice((page - 1) * pageSize, page * pageSize)}
            columns={columns}
            current={page}
            pageSize={pageSize}
            totalData={selectedData.length}
            onChange={handleChange}
            onShowSizeChange={handleChange}
          />
        </div>

        {/* Remark */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Remark <span className="text-red-500">*</span>
          </label>
          <TextArea
            rows={4}
            placeholder="Type your remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            maxLength={255}
          />
          <div className="text-xs text-gray-500 mt-1">
            You have 0 of {remainingChars} characters remaining.
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalConfirmApproval;


