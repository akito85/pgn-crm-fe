import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import NxModal from "../../../../../../../components/Nx/NxModal";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxTabs from "../../../../../../../components/Nx/NxTabs";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../../utils/getColumnSearchProps";
import { previewFileAttachment } from "../../../../../../../utils/previewFileAttachment";

const sectionKeys = ["warrantyInfo", "approval", "attachment"];

const toLowerText = (value) => {
  if (value === null || value === undefined) return "";
  return value.toString().toLowerCase();
};

const formatAmount = (amount, currency) => {
  if (amount === undefined || amount === null || amount === "") return "-";
  const num = parseFloat(amount);
  if (isNaN(num)) return "-";
  if (currency === "USD") {
    const parts = num.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${currency} ${parts.join(",")}`;
  }
  return `${currency || ""} ${Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`.trim();
};

const ContentModalConfirm = ({
  isOpen,
  loadingSubmit = false,
  handleCancel = () => {},
  handleConfirm = () => {},
  warrantyObj = {},
  selectedHierarchy,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  listApproval = [],
}) => {
  const [activeTab, setActiveTab] = useState(sectionKeys[0]);

  const approvalSearchInput = useRef(null);
  const attachmentSearchInput = useRef(null);

  const [approvalSearch, setApprovalSearch] = useState({});
  const [approvalSearchedColumn, setApprovalSearchedColumn] = useState("");
  const [approvalSearchText, setApprovalSearchText] = useState("");

  const [attachmentSearch, setAttachmentSearch] = useState({});
  const [attachmentSearchedColumn, setAttachmentSearchedColumn] = useState("");
  const [attachmentSearchText, setAttachmentSearchText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setActiveTab(sectionKeys[0]);
    }
  }, [isOpen]);

  const activeTabIndex = sectionKeys.indexOf(activeTab);
  const isLastTab = activeTabIndex === sectionKeys.length - 1;

  const approvalName = useMemo(
    () => listApproval?.find((item) => item?.value === selectedHierarchy)?.name || "-",
    [listApproval, selectedHierarchy]
  );

  const handleApprovalSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setApprovalSearchText(selectedKeys[0]);
    setApprovalSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setApprovalSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  }, []);

  const handleAttachmentSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setAttachmentSearchText(selectedKeys[0]);
    setAttachmentSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setAttachmentSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  }, []);

  const handleNextTab = () => {
    if (!isLastTab) setActiveTab(sectionKeys[activeTabIndex + 1]);
  };

  const handlePrevTab = () => {
    if (activeTabIndex > 0) setActiveTab(sectionKeys[activeTabIndex - 1]);
  };

  const detailRows = useMemo(
    () =>
      (listDataAppHierDetail || []).map((item, index) => ({
        key: item?.key || item?.id || index + 1,
        ...item,
      })),
    [listDataAppHierDetail]
  );

  const employeeColumns = useMemo(
    () => [
      {
        title: "NO",
        key: "no",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "EMPLOYEE",
        dataIndex: "employeeName",
        key: "employeeName",
        width: 500,
        sorter: (a, b) => toLowerText(a?.employeeName).localeCompare(toLowerText(b?.employeeName)),
      },
    ],
    []
  );

  const approvalColumns = useMemo(
    () => [
      {
        title: "NO",
        key: "no",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "HIERARCHY",
        dataIndex: "approvalLevel",
        key: "approvalLevel",
        width: 220,
        sorter: (a, b) => toLowerText(a?.approvalLevel).localeCompare(toLowerText(b?.approvalLevel)),
        ...getColumnSearchPropsUseFilteredValueFE(
          approvalSearch,
          "approvalLevel",
          approvalSearchInput,
          approvalSearchedColumn,
          approvalSearchText,
          handleApprovalSearch,
          true
        ),
      },
      {
        title: "POSITION",
        dataIndex: "position",
        key: "position",
        width: 240,
        sorter: (a, b) => toLowerText(a?.position).localeCompare(toLowerText(b?.position)),
        ...getColumnSearchPropsUseFilteredValueFE(
          approvalSearch,
          "position",
          approvalSearchInput,
          approvalSearchedColumn,
          approvalSearchText,
          handleApprovalSearch,
          true
        ),
      },
    ],
    [approvalSearch, approvalSearchedColumn, approvalSearchText, handleApprovalSearch]
  );

  const attachmentRows = useMemo(
    () =>
      (listDataAttachment || []).map((item, index) => ({
        key: item?.key || item?.id || index + 1,
        fileCategoryName: item?.fileCategoryName || item?.fileCategory || item?.category || "-",
        fileName: item?.fileName || "-",
        fileSize: item?.fileSize || "-",
      })),
    [listDataAttachment]
  );

  const attachmentColumns = useMemo(
    () => [
      {
        title: "NO",
        key: "no",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "CATEGORY",
        dataIndex: "fileCategoryName",
        key: "fileCategoryName",
        width: 200,
        sorter: (a, b) => toLowerText(a?.fileCategoryName).localeCompare(toLowerText(b?.fileCategoryName)),
        ...getColumnSearchPropsUseFilteredValueFE(
          attachmentSearch,
          "fileCategoryName",
          attachmentSearchInput,
          attachmentSearchedColumn,
          attachmentSearchText,
          handleAttachmentSearch,
          true
        ),
      },
      {
        title: "FILE NAME",
        dataIndex: "fileName",
        key: "fileName",
        width: 260,
        sorter: (a, b) => toLowerText(a?.fileName).localeCompare(toLowerText(b?.fileName)),
        ...getColumnSearchPropsUseFilteredValueFE(
          attachmentSearch,
          "fileName",
          attachmentSearchInput,
          attachmentSearchedColumn,
          attachmentSearchText,
          handleAttachmentSearch,
          true
        ),
      },
      {
        title: "FILE SIZE",
        dataIndex: "fileSize",
        key: "fileSize",
        width: 160,
        align: "center",
        sorter: (a, b) => toLowerText(a?.fileSize).localeCompare(toLowerText(b?.fileSize)),
        ...getColumnSearchPropsUseFilteredValueFE(
          attachmentSearch,
          "fileSize",
          attachmentSearchInput,
          attachmentSearchedColumn,
          attachmentSearchText,
          handleAttachmentSearch,
          true
        ),
      },
      {
        title: "ACTION",
        key: "action",
        width: 120,
        align: "center",
        render: (_, record) => (
          <Tooltip title="Preview">
            <span className="flex justify-center">
              <EyeOutlined
                style={{ fontSize: "18px", color: "#0075bf" }}
                onClick={() => {
                  if (record?.base64) {
                    previewFileAttachment(record.base64);
                    return;
                  }
                  const fileUrl = record?.urlFile1 || record?.urlFile;
                  if (fileUrl) {
                    window.open(fileUrl, "_blank", "noopener,noreferrer");
                  }
                }}
              />
            </span>
          </Tooltip>
        ),
      },
    ],
    [attachmentSearch, attachmentSearchedColumn, attachmentSearchText, handleAttachmentSearch]
  );

  return (
    <NxModal
      isOpen={isOpen}
      handleCancel={handleCancel}
      header="CONFIRMATION"
      width={1000}
      loading={loadingSubmit}
      footer={[
        <div className="w-full flex justify-between gap-5" key="footer-confirm-warranty">
          <ButtonComponent type="default" onClick={handleCancel} disabled={loadingSubmit}>
            Cancel
          </ButtonComponent>
          <div className="flex gap-2">
            <ButtonComponent
              type="default"
              onClick={handlePrevTab}
              disabled={loadingSubmit || activeTabIndex <= 0}
            >
              Previous
            </ButtonComponent>
            {!isLastTab ? (
              <ButtonComponent
                type="submit"
                border={false}
                onClick={handleNextTab}
                disabled={loadingSubmit}
              >
                Next
              </ButtonComponent>
            ) : (
              <ButtonComponent
                type="submit"
                border={false}
                onClick={handleConfirm}
                disabled={loadingSubmit}
                loading={loadingSubmit}
              >
                Submit
              </ButtonComponent>
            )}
          </div>
        </div>,
      ]}
    >
      <div className="p-4">
        <NxTabs
          activeKey={activeTab}
          onChange={(key) => {
            if (!loadingSubmit) setActiveTab(key);
          }}
          items={[
            {
              key: "warrantyInfo",
              label: "Warranty Term Information",
              children: (
                <NxBaseContainer header="WARRANTY TERM INFORMATION" border>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailText label="Document Number">
                      {warrantyObj?.docNumber || "-"}
                    </DetailText>
                    <DetailText label="Document Date">
                      {warrantyObj?.docDate
                        ? moment(warrantyObj.docDate).format(dateFormatting.date)
                        : "-"}
                    </DetailText>
                    <DetailText label="Start Date">
                      {warrantyObj?.startDate
                        ? moment(warrantyObj.startDate).format(dateFormatting.date)
                        : "-"}
                    </DetailText>
                    <DetailText label="End Date">
                      {warrantyObj?.endDate
                        ? moment(warrantyObj.endDate).format(dateFormatting.date)
                        : "-"}
                    </DetailText>
                    <DetailText label="Currency">
                      {warrantyObj?.currency || "-"}
                    </DetailText>
                    <DetailText label="Amount">
                      {formatAmount(warrantyObj?.amount, warrantyObj?.currency)}
                    </DetailText>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <DetailText label="Description">
                      {warrantyObj?.description || "-"}
                    </DetailText>
                  </div>
                </NxBaseContainer>
              ),
            },
            {
              key: "approval",
              label: "Approval",
              children: (
                <NxBaseContainer header="APPROVAL INFORMATION" border>
                  <div className="grid grid-cols-3 gap-4 mb-1">
                    <DetailText label="Approval Hierarchy">{approvalName}</DetailText>
                  </div>
                  <NxTable
                    idTable="warranty-confirm-approval-table"
                    useSelect={false}
                    usePagination={false}
                    showAdvanceSearch={false}
                    showSearchBar={false}
                    tableScrolled={{ x: "max-content", y: 320 }}
                    dataSource={detailRows}
                    columns={approvalColumns}
                    expandable={{
                      rowExpandable: (record) => (record?.employeeDetail || []).length > 0,
                      expandIcon: ({ expanded, onExpand, record }) => (
                        <button
                          type="button"
                          className="text-[22px] leading-none cursor-pointer bg-transparent border-0 p-0"
                          onClick={(event) => onExpand(record, event)}
                        >
                          {expanded ? "-" : "+"}
                        </button>
                      ),
                      expandedRowRender: (record) => (
                        <NxTable
                          idTable={`warranty-confirm-approval-employee-${record?.key || "row"}`}
                          useSelect={false}
                          usePagination={false}
                          showAdvanceSearch={false}
                          showSearchBar={false}
                          tableScrolled={{ x: "max-content", y: 220 }}
                          dataSource={(record?.employeeDetail || []).map((item, index) => ({
                            key: item?.id || `${record?.key}-${index + 1}`,
                            employeeName: item?.employeeName || item?.name || "-",
                          }))}
                          columns={employeeColumns}
                        />
                      ),
                    }}
                  />
                </NxBaseContainer>
              ),
            },
            {
              key: "attachment",
              label: "Attachment",
              children: (
                <NxBaseContainer header="ATTACHMENT INFORMATION" border>
                  <NxTable
                    idTable="warranty-confirm-attachment-table"
                    usePagination={false}
                    tableScrolled={{ x: "max-content", y: 320 }}
                    dataSource={attachmentRows}
                    columns={attachmentColumns}
                    showAdvanceSearch={true}
                    showSearchBar={true}
                  />
                </NxBaseContainer>
              ),
            },
          ]}
        />
      </div>
    </NxModal>
  );
};

export default ContentModalConfirm;
