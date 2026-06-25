import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Button,
  Radio,
  Space,
  Divider,
  message,
  Upload,
  Steps,
  Input,
  Select,
  Table,
  Spin,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  InboxOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import {
  downloadOriginalInvoice,
  getApprovalHierarchyList,
  getApphierDetail,
} from "../../../../../redux/slices/rating_billing_invoice/emeterai";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";

const { Dragger } = Upload;
const { Step } = Steps;
const { TextArea } = Input;

const StampingRequestModal = ({
  visible,
  onClose,
  invoiceData,
  onSubmit,
  loading: externalLoading = false,
}) => {
  const dispatch = useDispatch();
  const { downloadLoading, data_approval_hierarchy, data_apphier_detail } =
    useSelector((state) => state.emeterai);

  const [stampingMethod, setStampingMethod] = useState("e-stamping");
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);

  // Shared fields for both methods
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");

  // Manual-only fields
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalDetail, setApprovalDetail] = useState([]);

  const invoice = React.useMemo(() => {
    if (!invoiceData) {
      return { invoiceNumber: "-", customer: "-", amount: 0, id: null };
    }
    return {
      invoiceNumber: invoiceData.invoiceNumber || "-",
      customer: invoiceData.customer || invoiceData.customerName || "-",
      amount: invoiceData.amount || invoiceData.totalAmountEqvIdr || 0,
      // id field required by new digital API — sesuai dokumen user pakai recordId
      id: invoiceData.recordId ?? null,
    };
  }, [invoiceData]);

  // Reset all state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setStampingMethod("e-stamping");
      setFileList([]);
      setCurrentStep(0);
      setRemarks("");
      setRemarksError("");
      setSelectedApproval(null);
      setApprovalDetail([]);
    }
  }, [visible]);

  // Map apphier detail into table-ready data
  useEffect(() => {
    if (data_apphier_detail && Array.isArray(data_apphier_detail)) {
      const data = data_apphier_detail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: Array.isArray(a.employeeDetail)
          ? a.employeeDetail.map((b, idx) => ({ ...b, key: idx + 1 }))
          : [],
      }));
      setApprovalDetail(data);
    }
  }, [data_apphier_detail]);

  const handleDownloadFile = async () => {
    try {
      await dispatch(
        downloadOriginalInvoice({ invoiceNumber: invoice.invoiceNumber }),
      ).unwrap();
    } catch (error) {
      console.error("❌ Error downloading document:", error);
    }
  };

  const uploadProps = {
    fileList,
    multiple: true,
    beforeUpload: (file) => {
      const isValidType =
        file.type === "application/pdf" ||
        file.type === "image/jpeg" ||
        file.type === "image/png";

      if (!isValidType) {
        message.error("You can only upload PDF/JPG/PNG files!");
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  // ─── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (stampingMethod === "e-stamping") {
      if (!remarks || remarks.trim() === "") {
        setRemarksError("Remarks are required for e-stamping.");
        message.error("Remarks are required for e-stamping!");
        return;
      }
      setRemarksError("");
      handleSubmit();
      return;
    }

    // Manual flow validation per step
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (fileList.length === 0) {
        message.error("Please upload at least one file!");
        return;
      }
      if (!remarks || remarks.trim() === "") {
        message.error("Please provide a remark!");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedApproval) {
        message.error("Please select approval hierarchy!");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApprovalSelect = (value) => {
    setSelectedApproval(value);
    dispatch(getApphierDetail({ id: value }));
  };

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    setStampingMethod(newMethod);
    setFileList([]);
    setCurrentStep(0);
    setRemarks("");
    setSelectedApproval(null);
    setApprovalDetail([]);

    if (newMethod === "manual") {
      dispatch(getApprovalHierarchyList());
    }
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (stampingMethod === "e-stamping") {
      if (!remarks || remarks.trim() === "") {
        setRemarksError("Remarks are required for e-stamping.");
        message.error("Remarks are required for e-stamping!");
        return;
      }
      setRemarksError("");
    }

    if (stampingMethod === "manual") {
      if (fileList.length === 0) {
        message.error("Please upload at least one file!");
        return;
      }
      if (!remarks || remarks.trim() === "") {
        message.error("Please provide a remark!");
        return;
      }
      if (!selectedApproval) {
        message.error("Please select approval hierarchy!");
        return;
      }
    }

    try {
      if (onSubmit) {
        const submissionData =
          stampingMethod === "e-stamping"
            ? {
                invoiceNumber: invoice.invoiceNumber,
                stampingMethod: "e-stamping",
                id: invoice.id,
                remarks: remarks.trim(),
              }
            : {
                invoiceNumber: invoice.invoiceNumber,
                stampingMethod: "manual",
                files: fileList.map((file) => file.originFileObj || file),
                remark: remarks,
                apphierId: selectedApproval,
                submittedAt: new Date().toISOString(),
              };

        await onSubmit(submissionData);
      }

      resetForm();
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStampingMethod("e-stamping");
    setFileList([]);
    setCurrentStep(0);
    setRemarks("");
    setRemarksError("");
    setSelectedApproval(null);
    setApprovalDetail([]);
  };

  // ─── Column definitions for approval table ──────────────────────────────────

  const columnsApproval = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "HIERARCHY",
      dataIndex: "hierarchy",
      key: "hierarchy",
      width: 150,
    },
    {
      title: "POSITION",
      dataIndex: "position",
      key: "position",
      width: 200,
    },
  ];

  const columnsExpandApproval = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employeeName",
      key: "employeeName",
      width: 250,
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
  ];

  // ─── Step renders ────────────────────────────────────────────────────────────

  // Step 0 — Select method + e-stamping remarks field
  const renderStep1 = () => (
    <>
      <div style={{ marginBottom: "15px" }}>
        <div className="grid grid-cols-2 w-full gap-2">
          <div className="w-full">
            <InputComponent
              label="Invoice Number"
              value={invoice.invoiceNumber}
              disabled
            />
          </div>

          <div className="w-full">
            <InputComponent
              label="Customer"
              value={invoice.customer}
              disabled
            />
          </div>

          <div className="col-span-2 w-full">
            <InputComponent
              typeNumber
              label="Amount"
              value={invoice.amount}
              disabled
            />
          </div>
        </div>
      </div>

      <Divider style={{ margin: "15px 0" }} />

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "15px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#262626",
          }}
        >
          Select Stamping Method:
        </label>
        <Radio.Group
          value={stampingMethod}
          onChange={handleMethodChange}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Radio
              value="e-stamping"
              style={radioStyle(stampingMethod === "e-stamping")}
            >
              <span style={{ fontWeight: "500" }}>
                E-Stamping (Digital via PJAP)
              </span>
            </Radio>
            <Radio
              value="manual"
              style={radioStyle(stampingMethod === "manual")}
            >
              <span style={{ fontWeight: "500" }}>Manual (Physical Stamp)</span>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Info banner */}
      <div
        className="flex gap-3 bg-[#F5F5F5] p-3 rounded-[10px]"
        style={{ marginBottom: "15px" }}
      >
        <InfoCircleFilled
          style={{ paddingTop: "2px", color: "#0175BF", fontSize: "16px" }}
        />
        <div className="flex flex-col">
          {stampingMethod === "e-stamping" ? (
            <>
              <p style={{ fontWeight: 600, fontSize: "13px" }}>
                E-Stamping Process
              </p>
              <p style={{ fontSize: "13px" }}>
                Your invoice will be automatically stamped digitally through
                PJAP (Penyedia Jasa Aplikasi Perpajakan) system. This process
                typically takes 1-2 business days.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 600, fontSize: "13px" }}>
                Manual (Physical Stamp)
              </p>
              <p style={{ fontSize: "13px" }}>
                Your invoice requires manual stamping. Please allow up to 3–5
                business days for processing after submission.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Remarks field shown on step 0 for e-stamping only */}
      {stampingMethod === "e-stamping" && (
        <div>
          <InputComponent
            type="textarea"
            label="Remarks"
            mandatory
            rows={4}
            placeholder="Enter remarks for e-stamping request"
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (e.target.value.trim()) {
                setRemarksError("");
              }
            }}
          />
          {remarksError && (
            <span
              style={{
                color: "#ff4d4f",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {remarksError}
            </span>
          )}
        </div>
      )}
    </>
  );

  // Step 1 (manual) — Upload attachment + remark
  const renderStep2 = () => (
    <>
      <div
        style={{
          background: "#f0f5ff",
          border: "1px solid #adc6ff",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "15px",
        }}
      >
        <h3
          style={{
            margin: "0 0 10px 0",
            fontSize: "15px",
            fontWeight: "600",
            color: "#262626",
          }}
        >
          Instructions:
        </h3>
        <ol
          style={{
            margin: "0",
            paddingLeft: "20px",
            fontSize: "14px",
            lineHeight: "1.8",
            color: "#595959",
          }}
        >
          <li>Download the original invoice file.</li>
          <li>Print and affix a valid physical stamp.</li>
          <li>Scan the document into PDF format.</li>
          <li>Upload the scanned file(s) below.</li>
        </ol>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <Button
          type="default"
          size="large"
          icon={<DownloadOutlined />}
          onClick={handleDownloadFile}
          loading={downloadLoading}
          disabled={downloadLoading}
          style={{
            width: "100%",
            height: "48px",
            fontSize: "15px",
            fontWeight: "500",
            borderWidth: "2px",
          }}
        >
          {downloadLoading
            ? "Downloading..."
            : "Download Original Invoice (.PDF)"}
        </Button>
      </div>

      <Divider style={{ margin: "15px 0" }} />

      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#262626",
            textTransform: "uppercase",
          }}
        >
          Scanned File <span style={{ color: "red" }}>*</span>
        </label>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: "#1890ff", fontSize: "48px" }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: "15px", fontWeight: "500", color: "#262626" }}
          >
            Click or drag file to this area to upload
          </p>
          <p
            className="ant-upload-hint"
            style={{ fontSize: "13px", color: "#8c8c8c" }}
          >
            Support for PDF, JPG, or PNG files. Maximum file size is 5MB.
          </p>
        </Dragger>
      </div>

      {fileList.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#262626",
              textTransform: "uppercase",
            }}
          >
            Files Upload
          </label>
          <div
            style={{
              background: "#f5f5f5",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              padding: "16px",
            }}
          >
            {fileList.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom:
                    index < fileList.length - 1 ? "1px solid #e8e8e8" : "none",
                }}
              >
                <span style={{ fontSize: "14px", color: "#262626" }}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <InputComponent
          label="Remark"
          type="textarea"
          mandatory
          rows={4}
          placeholder="Enter remark for manual stamping (required)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          maxLength={500}
          showCount
          style={{ fontSize: "14px" }}
        />
      </div>
    </>
  );

  // Step 2 (manual) — Select approval hierarchy
  const renderStep3 = () => (
    <>
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#0175BF",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Approval Information
        </p>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ ...labelStyle, marginBottom: "8px" }}>
            Approval Hierarchy <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            value={selectedApproval}
            onChange={handleApprovalSelect}
            placeholder="Select approval hierarchy"
            style={{ width: "100%" }}
            size="large"
            showSearch
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {data_approval_hierarchy &&
              data_approval_hierarchy.map((data) => (
                <Select.Option value={data.appHierId} key={data.appHierId}>
                  {data.approvalName}
                </Select.Option>
              ))}
          </Select>
        </div>

        {selectedApproval && approvalDetail.length > 0 && (
          <Table
            dataSource={approvalDetail}
            columns={columnsApproval}
            pagination={false}
            size="small"
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: "16px 0" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#0175BF",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    Employee Information
                  </p>
                  <Table
                    dataSource={record?.employeeDetail || []}
                    columns={columnsExpandApproval}
                    pagination={false}
                    size="small"
                  />
                </div>
              ),
            }}
          />
        )}
      </div>
    </>
  );

  // Step 3 (manual) — Confirmation
  const renderStep4 = () => {
    const selectedApprovalName = data_approval_hierarchy?.find(
      (a) => a.appHierId === selectedApproval,
    )?.approvalName;

    return (
      <>
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#262626",
              marginBottom: "24px",
            }}
          >
            Please review your submission
          </h3>

          <div style={{ marginBottom: "24px" }}>
            <p style={summaryLabelStyle}>Remark</p>
            <p style={summaryValueStyle}>{remarks}</p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <p style={summaryLabelStyle}>Approval Hierarchy</p>
            <p style={summaryValueStyle}>{selectedApprovalName || "-"}</p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <p style={summaryLabelStyle}>Approvers</p>
            <div style={cardBoxStyle}>
              {approvalDetail.length > 0 ? (
                approvalDetail.map((approval, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom:
                        idx < approvalDetail.length - 1 ? "16px" : "0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#262626",
                        marginBottom: "8px",
                      }}
                    >
                      {approval.hierarchy} - {approval.position}
                    </p>
                    {approval.employeeDetail?.length > 0 && (
                      <div style={{ paddingLeft: "16px" }}>
                        {approval.employeeDetail.map((emp, empIdx) => (
                          <p
                            key={empIdx}
                            style={{
                              fontSize: "14px",
                              color: "#595959",
                              marginBottom: "4px",
                            }}
                          >
                            • {emp.employeeName} ({emp.email})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#8c8c8c",
                    fontStyle: "italic",
                  }}
                >
                  No approvers selected
                </p>
              )}
            </div>
          </div>

          <div>
            <p style={summaryLabelStyle}>Files ({fileList.length})</p>
            <div style={cardBoxStyle}>
              {fileList.map((file, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px 0",
                    borderBottom:
                      index < fileList.length - 1
                        ? "1px solid #e8e8e8"
                        : "none",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#262626" }}>
                    {index + 1}. {file.name} ({(file.size / 1024).toFixed(2)}{" "}
                    KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const getModalTitle = () => {
    if (stampingMethod === "e-stamping") return "Stamping Process Request";
    const titles = [
      "Stamping Process Request",
      "Upload Invoice with Physical Stamp",
      "Select Approval",
      "Confirmation",
    ];
    return titles[currentStep] || "Stamping Process Request";
  };

  const getStepTitles = () => [
    { title: "Select Method" },
    { title: "Attachment" },
    { title: "Approval" },
    { title: "Confirmation" },
  ];

  const isLastStep = currentStep === 3;
  const isFirstStep = currentStep === 0;

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      width={850}
      footer={null}
      closeIcon={<CloseOutlined />}
      bodyStyle={{ padding: 0 }}
    >
      <Spin spinning={externalLoading}>
        {/* Header */}
        <div
          style={{
            padding: "10px 14px",
            borderBottom: "2px solid #e8e8e8",
            background: "#efefef",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "600",
              color: "#0175BF",
            }}
          >
            {getModalTitle()}
          </h2>
        </div>

        {/* Steps indicator (manual only) */}
        {stampingMethod === "manual" && (
          <div style={{ padding: "24px 32px 0" }}>
            <Steps current={currentStep} size="small">
              {getStepTitles().map((step, index) => (
                <Step key={index} title={step.title} />
              ))}
            </Steps>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && stampingMethod === "manual" && renderStep2()}
          {currentStep === 2 && stampingMethod === "manual" && renderStep3()}
          {currentStep === 3 && stampingMethod === "manual" && renderStep4()}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 32px",
            borderTop: "1px solid #e8e8e8",
            background: "#fafafa",
            display: "flex",
            justifyContent: !isFirstStep ? "space-between" : "flex-end",
            gap: "12px",
          }}
        >
          {!isFirstStep && stampingMethod === "manual" && (
            <ButtonComponent onClick={handleBack} size="small">
              Back
            </ButtonComponent>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <ButtonComponent onClick={handleCancel} size="small">
              Cancel
            </ButtonComponent>

            {!isLastStep ? (
              <ButtonComponent
                type="primary"
                size="small"
                icon={
                  isFirstStep && stampingMethod === "e-stamping" ? (
                    <CheckOutlined />
                  ) : undefined
                }
                onClick={handleNext}
                loading={externalLoading}
              >
                {stampingMethod === "e-stamping" || isFirstStep
                  ? stampingMethod === "e-stamping"
                    ? "Submit Request"
                    : "Next"
                  : "Next"}
              </ButtonComponent>
            ) : (
              <ButtonComponent
                type="primary"
                size="small"
                icon={<UploadOutlined />}
                onClick={handleSubmit}
                loading={externalLoading}
              >
                Submit Request
              </ButtonComponent>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

// ─── Shared style constants ──────────────────────────────────────────────────

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#262626",
};

const radioStyle = (active) => ({
  fontSize: "12px",
  padding: "8px 10px",
  border: "2px solid",
  borderRadius: "8px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  backgroundColor: active ? "#e6f7ff" : "#ffffff",
  borderColor: active ? "#1890ff" : "#d9d9d9",
  transition: "all 0.3s",
});

const summaryLabelStyle = {
  fontSize: "14px",
  color: "#8c8c8c",
  marginBottom: "8px",
};

const summaryValueStyle = {
  fontSize: "15px",
  color: "#262626",
};

const cardBoxStyle = {
  background: "#f5f5f5",
  border: "1px solid #d9d9d9",
  borderRadius: "6px",
  padding: "16px",
};

export default StampingRequestModal;
