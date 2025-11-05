// _components/ProcessSigningModal.js
import React, { useEffect, useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { previewStampedInvoice } from "../../../../../redux/slices/rating_billing_invoice/emeterai";

const { Dragger } = Upload;
const { Step } = Steps;
const { TextArea } = Input;

const ProcessSigningModal = ({
  visible,
  onClose,
  invoiceData,
  onSubmit,
  loading: externalLoading = false,
}) => {
  const dispatch = useDispatch();
  const { previewLoading } = useSelector((state) => state.emeterai);

  const [signingMethod, setSigningMethod] = useState("digital");
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
      setSigningMethod("digital");
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
        previewStampedInvoice({ invoiceNumber: invoice.invoiceNumber })
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
    if (signingMethod === "digital") {
      // Direct submit for digital signing
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
    if (signingMethod === "manual") {
      if (fileList.length === 0) {
        message.error("Please upload the signed invoice file!");
        return;
      }
      if (!remark || remark.trim() === "") {
        message.error("Please provide a remark!");
        return;
      }
    }

    if (signingMethod === "manual" && fileList.length > 0) {
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
          signingMethod: signingMethod,
          file:
            signingMethod === "manual"
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
          signingMethod === "digital"
            ? "Digital signing request submitted successfully!"
            : "Signed invoice uploaded successfully!"
        );
        onClose();
      }

      // Reset state
      setSigningMethod("digital");
      setFileList([]);
      setCurrentStep(0);
      setRemark("");
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      // Error handling is done in parent component
    }
  };

  const handleCancel = () => {
    setSigningMethod("digital");
    setFileList([]);
    setCurrentStep(0);
    setRemark("");
    onClose();
  };

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    setSigningMethod(newMethod);
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

      {/* Select Signing Method */}
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
          Select Signing Method:
        </label>
        <Radio.Group
          value={signingMethod}
          onChange={handleMethodChange}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Radio
              value="digital"
              style={{
                fontSize: "15px",
                padding: "12px 16px",
                border: "2px solid #d9d9d9",
                borderRadius: "8px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  signingMethod === "digital" ? "#e6f7ff" : "#ffffff",
                borderColor:
                  signingMethod === "digital" ? "#1890ff" : "#d9d9d9",
                transition: "all 0.3s",
              }}
            >
              <span style={{ fontWeight: "500" }}>
                Digital Signature (Electronic)
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
                  signingMethod === "manual" ? "#e6f7ff" : "#ffffff",
                borderColor: signingMethod === "manual" ? "#1890ff" : "#d9d9d9",
                transition: "all 0.3s",
              }}
            >
              <span style={{ fontWeight: "500" }}>
                Manual (Wet Ink Signature)
              </span>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Method Description */}
      {signingMethod === "digital" && (
        <Alert
          message="Digital Signing Process"
          description="The invoice will be signed electronically using a valid digital certificate. This process is secure and legally binding."
          type="info"
          showIcon
          style={{ marginTop: "16px" }}
        />
      )}

      {signingMethod === "manual" && (
        <Alert
          message="Manual Signing Process"
          description="You will need to download, print, sign with wet ink, and upload the invoice. Instructions will be provided in the next step."
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
          <li>Download the stamped invoice file.</li>
          <li>Print and apply a wet ink signature.</li>
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
          {previewLoading ? "Loading..." : "Download Stamped Invoice (.pdf)"}
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
          placeholder="Enter remark for manual signing (required)"
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
          {signingMethod === "manual" && currentStep === 1
            ? "Upload Invoice with Wet Ink Signature"
            : "Process Digital Signing"}
        </h2>
      </div>

      {/* Steps Indicator (for Manual only) */}
      {signingMethod === "manual" && (
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
              {signingMethod === "digital" ? "Process Signing" : "Next"}
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

export default ProcessSigningModal;
