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
  Select,
  Spin,
  Table,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  InboxOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  downloadStampedInvoice,
  getApprovalHierarchyList,
  getApphierDetail,
} from "../../../../../redux/slices/rating_billing_invoice/emeterai";

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
  const { downloadLoading, data_approval_hierarchy, data_apphier_detail } =
    useSelector((state) => state.emeterai);

  const [signingMethod, setSigningMethod] = useState("digital");
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [remark, setRemark] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalDetail, setApprovalDetail] = useState([]);

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
      setSelectedApproval(null);
      setApprovalDetail([]);
      // Fetch approval hierarchy list
      dispatch(getApprovalHierarchyList());
    }
  }, [visible, dispatch]);

  useEffect(() => {
    if (data_apphier_detail && Array.isArray(data_apphier_detail)) {
      const data = data_apphier_detail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: Array.isArray(a.employeeDetail)
          ? a.employeeDetail.map((b, idx) => ({
              ...b,
              key: idx + 1,
            }))
          : [],
      }));
      setApprovalDetail(data || []);
    }
  }, [data_apphier_detail]);

  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return `IDR ${new Intl.NumberFormat("id-ID").format(amount)}`;
    }
    return amount;
  };

  const handleDownloadFile = async () => {
    try {
      await dispatch(
        downloadStampedInvoice({ invoiceNumber: invoice.invoiceNumber })
      ).unwrap();
      // Success message already handled in slice
    } catch (error) {
      console.error("❌ Error downloading document:", error);
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
      // For manual, validate step before going to next
      if (currentStep === 0) {
        // Step 0: Select Method - no validation needed, just go to next step
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // Step 1: Upload Document - validate file upload and remark
        if (fileList.length === 0) {
          message.error("Please upload the signed invoice file!");
          return;
        }
        if (!remark || remark.trim() === "") {
          message.error("Please provide a remark!");
          return;
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Step 2: Approval - validate approval selection
        if (!selectedApproval) {
          message.error("Please select approval hierarchy!");
          return;
        }
        setCurrentStep(3);
      }
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
      if (!selectedApproval) {
        message.error("Please select approval hierarchy!");
        return;
      }
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
          apphierId: signingMethod === "manual" ? selectedApproval : null,
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
      setSelectedApproval(null);
      setApprovalDetail([]);
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
    setSelectedApproval(null);
    setApprovalDetail([]);
    onClose();
  };

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    setSigningMethod(newMethod);
    setFileList([]);
    setCurrentStep(0);
    setRemark("");
    setSelectedApproval(null);
    setApprovalDetail([]);
  };

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

  // Render Step 1: Select Method & Invoice Info
  const renderStep1 = () => (
    <>
      {/* Invoice Information (Readonly) */}
      <div style={{ marginBottom: "32px" }}>
        <div className="flex flex-col w-full gap-2">
          {/* Invoice Number */}
          <div className="w-full">
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
        <div className="flex gap-3 bg-[#F5F5F5] p-3 rounded-[10px]">
          <InfoCircleFilled
            style={{ paddingTop: "2px", color: "#0175BF", fontSize: "20px" }}
          />
          <div className="flex flex-col">
            <p style={{ fontWeight: 600 }}>Digital Signing Process</p>
            <p>
              The Invoice will be signed electronically using a valid digital
              certificate. This process is secure and legally binding.
            </p>
          </div>
        </div>
      )}

      {signingMethod === "manual" && (
        <div className="flex gap-3 bg-[#F5F5F5] p-3 rounded-[10px]">
          <InfoCircleFilled
            style={{ paddingTop: "2px", color: "#0175BF", fontSize: "20px" }}
          />
          <div className="flex flex-col">
            <p style={{ fontWeight: 600 }}>Manual (Wet Ink Signature)</p>
            <p>
              Your invoice requires a physical signature using wet ink. Please
              print, sign, and upload the signed document.
            </p>
          </div>
        </div>
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
            : "Download Stamped Invoice (.pdf)"}
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

  // Render Step 3: Approval (Manual Only)
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
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#262626",
            }}
          >
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

  // Render Step 4: Confirmation (Manual Only)
  const renderStep4 = () => {
    const selectedApprovalName = data_approval_hierarchy?.find(
      (a) => a.appHierId === selectedApproval
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
            <p
              style={{
                fontSize: "14px",
                color: "#8c8c8c",
                marginBottom: "8px",
              }}
            >
              Remark
            </p>
            <p style={{ fontSize: "15px", color: "#262626" }}>{remark}</p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#8c8c8c",
                marginBottom: "8px",
              }}
            >
              Approval Hierarchy
            </p>
            <p style={{ fontSize: "15px", color: "#262626" }}>
              {selectedApprovalName || "-"}
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#8c8c8c",
                marginBottom: "12px",
              }}
            >
              Approvers
            </p>
            <div
              style={{
                background: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                padding: "16px",
              }}
            >
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
                    {approval.employeeDetail &&
                      approval.employeeDetail.length > 0 && (
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
            <p
              style={{
                fontSize: "14px",
                color: "#8c8c8c",
                marginBottom: "12px",
              }}
            >
              File
            </p>
            <div
              style={{
                background: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                padding: "16px",
              }}
            >
              {fileList.length > 0 && (
                <span style={{ fontSize: "14px", color: "#262626" }}>
                  {fileList[0].name} ({(fileList[0].size / 1024).toFixed(2)}{" "}
                  KB)
                </span>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

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
          padding: "20px 24px",
          borderBottom: "2px solid #e8e8e8",
          background: "#efefef",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            color: "#0175BF",
          }}
        >
          {signingMethod === "manual" && currentStep === 1
            ? "Upload Invoice with Wet Ink Signature"
            : signingMethod === "manual" && currentStep === 2
            ? "Select Approval"
            : signingMethod === "manual" && currentStep === 3
            ? "Confirmation"
            : "Process Digital Signing"}
        </h2>
      </div>

      {/* Steps Indicator (for Manual only) */}
      {signingMethod === "manual" && (
        <div style={{ padding: "24px 32px 0" }}>
          <Steps current={currentStep} size="small">
            <Step title="Select Method" />
            <Step title="Upload Document" />
            <Step title="Approval" />
            <Step title="Confirmation" />
          </Steps>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "32px" }}>
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && signingMethod === "manual" && renderStep2()}
        {currentStep === 2 && signingMethod === "manual" && renderStep3()}
        {currentStep === 3 && signingMethod === "manual" && renderStep4()}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 32px",
          borderTop: "1px solid #e8e8e8",
          background: "#fafafa",
          display: "flex",
          justifyContent: currentStep > 0 ? "space-between" : "flex-end",
          gap: "12px",
        }}
      >
        {currentStep > 0 && signingMethod === "manual" && (
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
          ) : currentStep < 3 ? (
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              loading={externalLoading}
              style={{
                minWidth: "160px",
                height: "44px",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              onClick={handleSubmit}
              loading={externalLoading}
              style={{
                minWidth: "160px",
                height: "44px",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Submit Request
            </Button>
          )}
        </div>
      </div>
      </Spin>
    </Modal>
  );
};

export default ProcessSigningModal;
