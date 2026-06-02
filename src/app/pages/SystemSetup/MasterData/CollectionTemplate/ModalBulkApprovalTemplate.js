import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Modal, Table, Form, Input, Checkbox, Tooltip, Spin } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import StatusComponent from "../../../../../components/StatusComponent";
import {
  bulkApproveRejectCollectionTemplate,
  getDetailCollectionTemplate,
} from "../../../../../redux/slices/system_setup/master_data/collectionTemplate";

// ─── Helper ────────────────────────────────────────────────────────────────────
const formatDate = (d) => (d ? moment(d).format("DD MMM YYYY") : "-");

const approvalTypeLabel = (type) => {
  if (type === "INACTIVE_PAY_COLLECTION_TEMPLATE") return "Inactivate";
  if (type === "ACTIVATED_PAY_COLLECTION_TEMPLATE") return "Activate";
  return "Create";
};

// ─── Stepper ───────────────────────────────────────────────────────────────────
const Stepper = ({ step }) => (
  <div className="flex items-center justify-center py-2 mb-2">
    <div className="flex items-center gap-0">
      {/* Step 1 circle */}
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold border-2 ${
          step >= 1
            ? "bg-[#0075bf] border-[#0075bf] text-white"
            : "bg-white border-gray-300 text-gray-400"
        }`}
      >
        {step > 1 ? <SVGIcon name="IconCheck" width={16} color="white" /> : "1"}
      </div>
      {/* Step 1 label */}
      <span
        className={`ml-2 mr-8 text-xs font-semibold tracking-wide ${
          step === 1 ? "text-black" : "text-gray-400"
        }`}
      >
        TEMPLATE COLLECTION
      </span>
      {/* Line */}
      <div className="w-24 h-[2px] bg-gray-300 mx-2" />
      {/* Step 2 circle */}
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold border-2 ${
          step >= 2
            ? "bg-[#0075bf] border-[#0075bf] text-white"
            : "bg-white border-gray-300 text-gray-400"
        }`}
      >
        2
      </div>
      {/* Step 2 label */}
      <span
        className={`ml-2 text-xs font-semibold tracking-wide ${
          step === 2 ? "text-black" : "text-gray-400"
        }`}
      >
        CONFIRMATION
      </span>
    </div>
  </div>
);

// ─── Activities sub-table ──────────────────────────────────────────────────────
const activitiesColumns = [
  {
    title: "NO",
    key: "no",
    width: 50,
    align: "center",
    render: (_, __, i) => i + 1,
  },
  {
    title: "ACTIVITIES NAME",
    dataIndex: ["activity", "activityName"],
    key: "activityName",
    render: (v) => v || "-",
  },
  {
    title: "ACTIVITIES CODE",
    dataIndex: ["activity", "activityCode"],
    key: "activityCode",
    align: "center",
    render: (v) => v || "-",
  },
  {
    title: "CATEGORY",
    dataIndex: ["activity", "category"],
    key: "category",
    render: (v) => v || "-",
  },
  {
    title: "MEDIA",
    dataIndex: ["activity", "media"],
    key: "media",
    render: (v) => v || "-",
  },
  {
    title: "SEQUENCE",
    dataIndex: "sequenceNo",
    key: "sequenceNo",
    align: "center",
    render: (v) => v ?? "-",
  },
  {
    title: "START DATE",
    dataIndex: ["activity", "startDate"],
    key: "startDate",
    align: "center",
    render: (v) => formatDate(v),
  },
];

// ─── Criteria sub-table ────────────────────────────────────────────────────────
const criteriaColumns = [
  {
    title: "NO",
    key: "no",
    width: 50,
    align: "center",
    render: (_, __, i) => i + 1,
  },
  {
    title: "CUSTOMER SEGMENT",
    key: "customerSegment",
    render: (_, record) =>
      record.criteria?.criteriaValueDisplay ||
      record.criteria?.criteriaValueText ||
      "-",
  },
  {
    title: "ACCOUNT GROUP TYPE",
    key: "accountGroupType",
    render: (_, record) => record.criteria?.category || "-",
  },
  {
    title: "START DATE",
    key: "startDate",
    align: "center",
    render: (_, record) => formatDate(record.criteria?.startDate),
  },
  {
    title: "END DATE",
    key: "endDate",
    align: "center",
    render: (_, record) => formatDate(record.criteria?.endDate),
  },
];

// ─── Main component ────────────────────────────────────────────────────────────
const ModalBulkApprovalTemplate = ({
  open,
  onClose,
  waitingData,
  dispatch,
  onRefresh,
  onError,
}) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [detailCache, setDetailCache] = useState({});
  const [loadingDetail, setLoadingDetail] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-select all waiting approval items when data changes or modal opens
  useEffect(() => {
    if (open && waitingData) {
      setSelectedIds(
        waitingData.map((item) => item.collectionTemplateId || item.id),
      );
    }
  }, [open, waitingData]);

  // Reset state when modal closes
  const handleReset = useCallback(() => {
    setStep(1);
    setSelectedIds([]);
    setExpandedRowId(null);
    setDetailCache({});
    setLoadingDetail({});
    setSubmitting(false);
    form.resetFields();
  }, [form]);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // ── Row expand ───────────────────────────────────────────────────────────────
  const handleToggleExpand = async (templateId) => {
    if (expandedRowId === templateId) {
      setExpandedRowId(null);
      return;
    }
    setExpandedRowId(templateId);
    if (!detailCache[templateId]) {
      setLoadingDetail((prev) => ({ ...prev, [templateId]: true }));
      try {
        const detail = await dispatch(
          getDetailCollectionTemplate(templateId),
        ).unwrap();
        setDetailCache((prev) => ({ ...prev, [templateId]: detail }));
      } catch (_) {
        // silently ignore
      } finally {
        setLoadingDetail((prev) => ({ ...prev, [templateId]: false }));
      }
    }
  };

  // ── Checkbox logic ───────────────────────────────────────────────────────────
  const allIds = useMemo(
    () => waitingData.map((item) => item.collectionTemplateId || item.id),
    [waitingData],
  );
  const allChecked = allIds.length > 0 && selectedIds.length === allIds.length;
  const indeterminate =
    selectedIds.length > 0 && selectedIds.length < allIds.length;

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? [...allIds] : []);
  };

  const handleSelectRow = (templateId, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, templateId] : prev.filter((id) => id !== templateId),
    );
  };

  // ── Step navigation ──────────────────────────────────────────────────────────
  const handleNext = async () => {
    try {
      await form.validateFields();
      if (selectedIds.length === 0) return;
      setStep(2);
    } catch (_) {
      // validation failed – Form.Item will show errors
    }
  };

  // ── Approve / Reject (single bulk API call) ──────────────────────────────────
  const handleSubmit = async (action) => {
    const remarkValue = form.getFieldValue("remark");
    setSubmitting(true);
    try {
      const result = await dispatch(
        bulkApproveRejectCollectionTemplate({
          ids: selectedIds,
          remark: remarkValue,
          action,
        }),
      ).unwrap();

      // result.data contains { successCount, failedCount, successIds, failedIds, failedReasons }
      const data = result?.data || result;
      const failedCount = data?.failedCount ?? 0;
      const successCount = data?.successCount ?? 0;

      if (failedCount === 0) {
        handleReset();
        onClose();
        onRefresh();
      } else {
        const reasons = (data?.failedReasons || []).join("; ");
        onError(
          successCount > 0
            ? `${successCount} item(s) processed successfully, but ${failedCount} item(s) failed. ${reasons}`
            : `Bulk ${action.toLowerCase()} failed. ${reasons}`,
        );
        if (successCount > 0) {
          onRefresh();
          handleReset();
          onClose();
        }
      }
    } catch (e) {
      onError(e?.message || `Failed to ${action.toLowerCase()} templates`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Expanded row render ──────────────────────────────────────────────────────
  const renderExpandedRow = (templateId) => {
    if (loadingDetail[templateId]) {
      return (
        <div className="flex justify-center py-4">
          <Spin size="small" />
        </div>
      );
    }
    const detail = detailCache[templateId];
    if (!detail) return null;

    const activityDetails = (detail.details || []).filter(
      (d) => d.sourceType === "ACTIVITY",
    );
    const criteriaDetails = (detail.details || []).filter(
      (d) => d.sourceType === "CRITERIA",
    );

    return (
      <div className="bg-white border border-gray-200 rounded">
        {activityDetails.length > 0 && (
          <div>
            <div className="bg-[#0075bf] text-white text-center text-xs font-semibold py-2 tracking-wide">
              ACTIVITIES INFORMATION
            </div>
            <Table
              size="small"
              columns={activitiesColumns}
              dataSource={activityDetails.map((d, i) => ({
                ...d,
                key: d.collectionTemplateDetailId || i,
              }))}
              pagination={false}
              scroll={{ x: 600 }}
            />
          </div>
        )}
        {criteriaDetails.length > 0 && (
          <div>
            <div className="bg-[#0075bf] text-white text-center text-xs font-semibold py-2 tracking-wide">
              CRITERIA INFORMATION
            </div>
            <Table
              size="small"
              columns={criteriaColumns}
              dataSource={criteriaDetails.map((d, i) => ({
                ...d,
                key: d.collectionTemplateDetailId || i,
              }))}
              pagination={false}
              scroll={{ x: 600 }}
            />
          </div>
        )}
        {activityDetails.length === 0 && criteriaDetails.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">
            No activity or criteria data.
          </p>
        )}
      </div>
    );
  };

  // ── Step 1 columns ───────────────────────────────────────────────────────────
  const step1Columns = useMemo(
    () => [
      {
        title: (
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={handleSelectAll}
          />
        ),
        key: "checkbox",
        width: 48,
        align: "center",
        render: (_, record) => {
          const id = record.collectionTemplateId || record.id;
          return (
            <Checkbox
              checked={selectedIds.includes(id)}
              onChange={(e) => handleSelectRow(id, e.target.checked)}
            />
          );
        },
      },
      {
        title: "NO",
        key: "no",
        width: 52,
        align: "center",
        render: (_, __, i) => i + 1,
      },
      {
        title: "TEMPLATE CODE",
        dataIndex: "templateCode",
        key: "templateCode",
        render: (v) => v || "-",
      },
      {
        title: "TEMPLATE NAME",
        dataIndex: "templateName",
        key: "templateName",
        render: (v) => v || "-",
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        key: "startDate",
        align: "center",
        render: (v) => formatDate(v),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        key: "endDate",
        align: "center",
        render: (v) => formatDate(v),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        key: "description",
        render: (v) => v || "-",
      },
      {
        title: "ACTION",
        key: "action",
        width: 72,
        align: "center",
        render: (_, record) => {
          const id = record.collectionTemplateId || record.id;
          const isExpanded = expandedRowId === id;
          return (
            <Tooltip title={isExpanded ? "Collapse" : "Detail"}>
              <span
                className="cursor-pointer"
                onClick={() => handleToggleExpand(id)}
              >
                <SVGIcon
                  name="IconDetail"
                  width={20}
                  color={isExpanded ? "#0075bf" : undefined}
                />
              </span>
            </Tooltip>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, allChecked, indeterminate, expandedRowId],
  );

  // ── Step 2 columns ───────────────────────────────────────────────────────────
  const step2Columns = [
    {
      title: "NO",
      key: "no",
      width: 52,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "TEMPLATE CODE",
      dataIndex: "templateCode",
      key: "templateCode",
      render: (v) => v || "-",
    },
    {
      title: "TEMPLATE NAME",
      dataIndex: "templateName",
      key: "templateName",
      render: (v) => v || "-",
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (v) => formatDate(v),
    },
    {
      title: "TYPE",
      dataIndex: "approvalType",
      key: "approvalType",
      align: "center",
      render: (v) => approvalTypeLabel(v),
    },
    {
      title: "APPROVAL STATUS",
      dataIndex: "statusApproval",
      key: "statusApproval",
      align: "center",
      render: (v) =>
        v ? (
          <StatusComponent colour={v} size="small">
            {v}
          </StatusComponent>
        ) : (
          "-"
        ),
    },
  ];

  const selectedData = useMemo(
    () =>
      waitingData.filter((item) =>
        selectedIds.includes(item.collectionTemplateId || item.id),
      ),
    [waitingData, selectedIds],
  );

  const dataSource = useMemo(
    () =>
      waitingData.map((item, i) => ({
        ...item,
        key: item.collectionTemplateId || item.id || i,
      })),
    [waitingData],
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        <span className="text-base font-bold tracking-wide">
          APPROVAL TEMPLATE COLLECTION
        </span>
      }
      footer={null}
      width={1100}
      destroyOnClose
      maskClosable={false}
    >
      {/* Stepper */}
      <div className="flex items-center justify-between mb-2">
        {/* Left arrow */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={step === 1 || submitting}
          onClick={() => setStep(1)}
        >
          &lt;
        </button>

        <Stepper step={step} />

        {/* Right arrow */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={step === 2 || submitting}
          onClick={handleNext}
        >
          &gt;
        </button>
      </div>

      <Form form={form} layout="vertical">
        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <div className="border border-gray-200 rounded mb-4">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-[#0075bf] tracking-wide">
                  TEMPLATE ACTIVITIES INFORMATION
                </span>
                <span className="text-xs text-gray-500">
                  {selectedIds.length} of {waitingData.length} selected
                </span>
              </div>

              <Table
                size="small"
                columns={step1Columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{ y: 300, x: 900 }}
                expandable={{
                  expandedRowKeys: expandedRowId ? [expandedRowId] : [],
                  showExpandColumn: false,
                  expandedRowRender: (record) =>
                    renderExpandedRow(record.collectionTemplateId || record.id),
                }}
                footer={() => (
                  <span className="text-xs text-gray-400">
                    Showing {waitingData.length} of {waitingData.length} entries
                    &nbsp;&middot;&nbsp;
                    <span className="text-blue-500">All data showed</span>
                  </span>
                )}
              />
            </div>

            <Form.Item
              name="remark"
              label={
                <span className="font-semibold">
                  Remark<span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Remark is required" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Remark..."
                maxLength={255}
                showCount
              />
            </Form.Item>

            {/* Footer */}
            <div className="flex justify-between mt-4">
              <ButtonComponent type="default" onClick={handleClose}>
                Cancel
              </ButtonComponent>
              <div className="flex gap-2">
                <ButtonComponent type="default" disabled>
                  Previous
                </ButtonComponent>
                <ButtonComponent
                  type="submit"
                  onClick={handleNext}
                  loading={submitting}
                  disabled={selectedIds.length === 0}
                >
                  Next
                </ButtonComponent>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <div className="border border-gray-200 rounded mb-4">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-[#0075bf] tracking-wide">
                  TEMPLATE ACTIVITIES INFORMATION
                </span>
              </div>

              <Table
                size="small"
                columns={step2Columns}
                dataSource={selectedData.map((item, i) => ({
                  ...item,
                  key: item.collectionTemplateId || item.id || i,
                }))}
                pagination={false}
                scroll={{ y: 300, x: 800 }}
                footer={() => (
                  <span className="text-xs text-gray-400">
                    Showing {selectedData.length} of {selectedData.length}{" "}
                    entries &nbsp;&middot;&nbsp;
                    <span className="text-blue-500">All data showed</span>
                  </span>
                )}
              />
            </div>

            {/* Remark display */}
            <div className="mb-4">
              <p className="text-sm font-semibold mb-1">Remark</p>
              <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded px-3 py-2 min-h-[40px]">
                {form.getFieldValue("remark") || "-"}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-4">
              <ButtonComponent type="default" onClick={handleClose}>
                Cancel
              </ButtonComponent>
              <div className="flex gap-2">
                <ButtonComponent
                  type="default"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                >
                  Previous
                </ButtonComponent>
                <ButtonComponent
                  danger
                  onClick={() => handleSubmit("REJECT")}
                  loading={submitting}
                  icon={
                    <SVGIcon
                      name="IconRejectApprover"
                      style={{ fontSize: "16px", color: "white" }}
                    />
                  }
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="submit"
                  onClick={() => handleSubmit("APPROVE")}
                  loading={submitting}
                  icon={
                    <SVGIcon
                      name="IconSubmitApprover"
                      style={{ fontSize: "16px", color: "white" }}
                    />
                  }
                >
                  Approve
                </ButtonComponent>
              </div>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ModalBulkApprovalTemplate;
