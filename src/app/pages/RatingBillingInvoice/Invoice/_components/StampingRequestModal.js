// _components/StampingRequestModal.js
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
  Alert,
  Steps,
  Input,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { previewOriginalInvoice } from "../../../../../redux/slices/rating_billing_invoice/emeterai";

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
  const { previewLoading } = useSelector((state) => state.emeterai);

  const [stampingMethod, setStampingMethod] = useState("e-stamping");
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [remark, setRemark] = useState("");

  // Safe invoice data with proper fallback
  const invoice = React.useMemo(() => {
    if (!invoiceData) {
      return {
        invoiceNumber: "-",
        customer: "-",
        amount: 0,
      };
    }
    return {
      invoiceNumber: invoiceData.invoiceNumber || "-",
      customer: invoiceData.customer || invoiceData.customerName || "-",
      amount: invoiceData.amount || invoiceData.totalAmountEqvIdr || 0,
    };
  }, [invoiceData]);

  // Reset state when modal closes or opens
  useEffect(() => {
    if (visible) {
      setStampingMethod("e-stamping");
      setFileList([]);
      setCurrentStep(0);
      setRemark("");
    }
  }, [visible]);

  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return `IDR ${new Intl.NumberFormat("id-ID").format(amount)}`;
    }
    return amount;
  };

  const handlePreviewFile = async () => {
    try {
      const result = await dispatch(
        previewOriginalInvoice({ invoiceNumber: invoice.invoiceNumber })
      ).unwrap();

      // Create blob and open in new tab
      const blob = new Blob([result], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");

      if (newTab) {
        newTab.document.title = `Preview - ${invoice.invoiceNumber}`;
      }

      console.log("✅ Preview opened successfully");
    } catch (error) {
      console.error("❌ Error previewing document:", error);
      // Error message already handled in slice
    }
  };

  const uploadProps = {
    fileList,
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isValidType = isPDF || isJPG || isPNG;

      if (!isValidType) {
        message.error("You can only upload PDF/JPG/PNG files!");
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
    onChange: (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1); // Keep only the last file
      setFileList(newFileList);
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleNext = () => {
    if (stampingMethod === "e-stamping") {
      // Direct submit for e-stamping
      handleSubmit();
    } else {
      // Go to step 2 for manual
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
    setFileList([]);
  };

  const handleSubmit = async () => {
    if (stampingMethod === "manual") {
      if (fileList.length === 0) {
        message.error("Please upload the stamped invoice file!");
        return;
      }
      if (!remark || remark.trim() === "") {
        message.error("Please provide a remark!");
        return;
      }
    }

    if (stampingMethod === "manual" && fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];
      console.log("📁 File Details:", {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString("id-ID"),
      });
    }

    try {
      // Call parent onSubmit handler
      if (onSubmit) {
        const submissionData = {
          invoiceNumber: invoice.invoiceNumber,
          customer: invoice.customer,
          amount: invoice.amount,
          stampingMethod: stampingMethod,
          file:
            stampingMethod === "manual"
              ? fileList[0].originFileObj || fileList[0]
              : null,
          remark: remark,
          submittedAt: new Date().toISOString(),
        };

        await onSubmit(submissionData);
      } else {
        // Fallback if no onSubmit handler provided
        console.warn("⚠️ No onSubmit handler provided, using local simulation");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        message.success(
          stampingMethod === "e-stamping"
            ? "E-Stamping request submitted successfully!"
            : "Stamped invoice uploaded successfully!"
        );
        onClose();
      }

      // Reset state
      setStampingMethod("e-stamping");
      setFileList([]);
      setCurrentStep(0);
      setRemark("");
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      // Error handling is done in parent component
    }
  };

  const handleCancel = () => {
    console.log("❌ Stamping request cancelled");
    setStampingMethod("e-stamping");
    setFileList([]);
    setCurrentStep(0);
    setRemark("");
    onClose();
  };

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    console.log("🔄 Stamping method changed:", newMethod);
    setStampingMethod(newMethod);
    setFileList([]);
    setCurrentStep(0);
    setRemark("");
  };

  // Render Step 1: Select Method & Invoice Info
  const renderStep1 = () => (
    <>
      {/* Invoice Information (Readonly) */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "16px",
          }}
        >
          {/* Invoice Number */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#262626",
              }}
            >
              Invoice #:
            </label>
            <div
              style={{
                padding: "10px 12px",
                background: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                fontSize: "14px",
                color: "#595959",
              }}
            >
              {invoice.invoiceNumber}
            </div>
          </div>

          <div></div>

          {/* Customer */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#262626",
              }}
            >
              Customer:
            </label>
            <div
              style={{
                padding: "10px 12px",
                background: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                fontSize: "14px",
                color: "#595959",
              }}
            >
              {invoice.customer}
            </div>
          </div>

          <div></div>

          {/* Total Amount */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#262626",
              }}
            >
              Total Amount:
            </label>
            <div
              style={{
                padding: "10px 12px",
                background: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                fontSize: "14px",
                color: "#595959",
                fontWeight: "600",
              }}
            >
              {formatAmount(invoice.amount)}
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      {/* Select Stamping Method */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "16px",
            fontSize: "16px",
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
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Radio
              value="e-stamping"
              style={{
                fontSize: "15px",
                padding: "12px 16px",
                border: "2px solid #d9d9d9",
                borderRadius: "8px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  stampingMethod === "e-stamping" ? "#e6f7ff" : "#ffffff",
                borderColor:
                  stampingMethod === "e-stamping" ? "#1890ff" : "#d9d9d9",
                transition: "all 0.3s",
              }}
            >
              <span style={{ fontWeight: "500" }}>
                E-Stamping (Digital via PJAP)
              </span>
            </Radio>
            <Radio
              value="manual"
              style={{
                fontSize: "15px",
                padding: "12px 16px",
                border: "2px solid #d9d9d9",
                borderRadius: "8px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  stampingMethod === "manual" ? "#e6f7ff" : "#ffffff",
                borderColor:
                  stampingMethod === "manual" ? "#1890ff" : "#d9d9d9",
                transition: "all 0.3s",
              }}
            >
              <span style={{ fontWeight: "500" }}>Manual (Physical Stamp)</span>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Method Description */}
      {stampingMethod === "e-stamping" && (
        <Alert
          message="E-Stamping Process"
          description="Your invoice will be automatically stamped digitally through PJAP (Penyedia Jasa Aplikasi Perpajakan) system. This process typically takes 1-2 business days."
          type="info"
          showIcon
          style={{ marginTop: "16px" }}
        />
      )}

      {stampingMethod === "manual" && (
        <Alert
          message="Manual Stamping Process"
          description="You will need to download, print, stamp, and upload the invoice. Instructions will be provided in the next step."
          type="warning"
          showIcon
          style={{ marginTop: "16px" }}
        />
      )}
    </>
  );

  // Render Step 2: Upload Document (Manual Only)
  const renderStep2 = () => (
    <>
      {/* Instructions */}
      <div
        style={{
          background: "#f0f5ff",
          border: "1px solid #adc6ff",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
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
          <li>Upload the scanned file below.</li>
        </ol>
      </div>

      {/* Download Button */}
      <div style={{ marginBottom: "32px" }}>
        <Button
          type="default"
          size="large"
          icon={<DownloadOutlined />}
          onClick={handlePreviewFile}
          loading={previewLoading}
          disabled={previewLoading}
          style={{
            width: "100%",
            height: "48px",
            fontSize: "15px",
            fontWeight: "500",
            borderWidth: "2px",
          }}
        >
          {previewLoading ? "Loading..." : "Download Original Invoice (.pdf)"}
        </Button>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      {/* Upload Area */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "15px",
            fontWeight: "600",
            color: "#262626",
          }}
        >
          Scanned File (PDF/JPG/PNG, max 5MB):{" "}
          <span style={{ color: "red" }}>*</span>
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
        <Alert
          message="File Ready"
          description={`${fileList[0].name} (${(
            fileList[0].size / 1024
          ).toFixed(2)} KB)`}
          type="success"
          showIcon
          style={{ marginBottom: "24px" }}
        />
      )}

      {/* Remark Field */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "15px",
            fontWeight: "600",
            color: "#262626",
          }}
        >
          Remark: <span style={{ color: "red" }}>*</span>
        </label>
        <TextArea
          rows={4}
          placeholder="Enter remark for manual stamping (required)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          maxLength={500}
          showCount
          style={{
            fontSize: "14px",
          }}
        />
      </div>
    </>
  );

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      width={750}
      footer={null}
      closeIcon={<CloseOutlined />}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "2px solid #e8e8e8",
          background: "#0175BF",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            color: "#ffffff",
          }}
        >
          {stampingMethod === "manual" && currentStep === 1
            ? "Upload Invoice with Physical Stamp"
            : "Stamping Process Request"}
        </h2>
      </div>

      {/* Steps Indicator (for Manual only) */}
      {stampingMethod === "manual" && (
        <div style={{ padding: "24px 32px 0" }}>
          <Steps current={currentStep} size="small">
            <Step title="Select Method" />
            <Step title="Upload Document" />
          </Steps>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "32px" }}>
        {currentStep === 0 ? renderStep1() : renderStep2()}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 32px",
          borderTop: "1px solid #e8e8e8",
          background: "#fafafa",
          display: "flex",
          justifyContent: currentStep === 1 ? "space-between" : "flex-end",
          gap: "12px",
        }}
      >
        {currentStep === 1 && (
          <Button
            onClick={handleBack}
            size="large"
            style={{
              minWidth: "120px",
              height: "44px",
              fontSize: "15px",
            }}
          >
            Back
          </Button>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            onClick={handleCancel}
            size="large"
            style={{
              minWidth: "120px",
              height: "44px",
              fontSize: "15px",
            }}
          >
            Cancel
          </Button>

          {currentStep === 0 ? (
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={handleNext}
              loading={externalLoading}
              style={{
                minWidth: "160px",
                height: "44px",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              {stampingMethod === "e-stamping" ? "Submit Request" : "Next"}
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              onClick={handleSubmit}
              loading={externalLoading}
              disabled={
                fileList.length === 0 || !remark || remark.trim() === ""
              }
              style={{
                minWidth: "160px",
                height: "44px",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Submit File
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StampingRequestModal;
