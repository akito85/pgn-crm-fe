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
import {
  downloadOriginalInvoice,
  getApprovalHierarchyList,
  getApphierDetail,
} from "../../../../../redux/slices/rating_billing_invoice/emeterai";

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
  const [remark, setRemark] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalDetail, setApprovalDetail] = useState([]);

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

  useEffect(() => {
    if (visible) {
      setStampingMethod("e-stamping");
      setFileList([]);
      setCurrentStep(0);
      setRemark("");
      setSelectedApproval(null);
      setApprovalDetail([]);
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
        downloadOriginalInvoice({ invoiceNumber: invoice.invoiceNumber })
      ).unwrap();
      // Success message already handled in slice
    } catch (error) {
      console.error("❌ Error downloading document:", error);
      // Error message already handled in slice
    }
  };

  const uploadProps = {
    fileList,
    multiple: true,
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

  const handleNext = () => {
    if (stampingMethod === "e-stamping") {
      handleSubmit();
    } else {
      // For manual, validate step before going to next
      if (currentStep === 0) {
        // Step 0: Select Method - no validation needed, just go to next step
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // Step 1: Attachment - validate file upload and remark
        if (fileList.length === 0) {
          message.error("Please upload at least one file!");
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
    if (stampingMethod === "manual") {
      if (fileList.length === 0) {
        message.error("Please upload at least one file!");
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
      if (onSubmit) {
        const submissionData = {
          invoiceNumber: invoice.invoiceNumber,
          customer: invoice.customer,
          amount: invoice.amount,
          stampingMethod: stampingMethod,
          files:
            stampingMethod === "manual"
              ? fileList.map((file) => file.originFileObj || file)
              : null,
          remark:
            stampingMethod === "manual" ? remark : "E-Meterai stamping request",
          apphierId: stampingMethod === "manual" ? selectedApproval : null,
          submittedAt: new Date().toISOString(),
        };

        await onSubmit(submissionData);
      } else {
        console.warn("⚠️ No onSubmit handler provided, using local simulation");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        message.success(
          stampingMethod === "e-stamping"
            ? "E-Stamping process submitted successfully!"
            : "Physical stamp request with approval submitted successfully!"
        );
        onClose();
      }

      setStampingMethod("e-stamping");
      setFileList([]);
      setCurrentStep(0);
      setRemark("");
      setSelectedApproval(null);
      setApprovalDetail([]);
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
    }
  };

  const handleCancel = () => {
    setStampingMethod("e-stamping");
    setFileList([]);
    setCurrentStep(0);
    setRemark("");
    setSelectedApproval(null);
    setApprovalDetail([]);
    onClose();
  };

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    setStampingMethod(newMethod);
    setFileList([]);
    setCurrentStep(0);
    setRemark("");
    setSelectedApproval(null);
    setApprovalDetail([]);

    if (newMethod === "manual") {
      dispatch(getApprovalHierarchyList());
    }
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

  const renderStep1 = () => (
    <>
      <div style={{ marginBottom: "32px" }}>
        <div className="flex flex-col w-full gap-2">
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
              Invoice:
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

      {stampingMethod === "e-stamping" && (
        <div className="flex gap-3 bg-[#F5F5F5] p-3 rounded-[10px]">
          <InfoCircleFilled
            style={{ paddingTop: "2px", color: "#0175BF", fontSize: "20px" }}
          />
          <div className="flex flex-col">
            <p style={{ fontWeight: 600 }}>E-Stamping Process</p>
            <p>
              Your invoice will be automatically stamped digitally through PJAP
              (Penyedia Jasa Aplikasi Perpajakan) system. This process typically
              takes 1-2 business days.
            </p>
          </div>
        </div>
      )}

      {stampingMethod === "manual" && (
        <div className="flex gap-3 bg-[#F5F5F5] p-3 rounded-[10px]">
          <InfoCircleFilled
            style={{ paddingTop: "2px", color: "#0175BF", fontSize: "20px" }}
          />
          <div className="flex flex-col">
            <p style={{ fontWeight: 600 }}>Manual (Physical Stamp)</p>
            <p>
              Your invoice requires manual stamping. Please allow up to 3–5
              business days for processing after submission.
            </p>
          </div>
        </div>
      )}
    </>
  );

  // Step 2: Attachment (for manual only)
  const renderStep2 = () => (
    <>
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
          <li>Upload the scanned file(s) below.</li>
        </ol>
      </div>

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
            : "Download Stamped Invoice (.PDF)"}
        </Button>
      </div>

      <Divider style={{ margin: "32px 0" }} />

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
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "15px",
            fontWeight: "600",
            color: "#262626",
          }}
        >
          Remark <span style={{ color: "red" }}>*</span>
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

  // Step 3: Approval (for manual only)
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

  // Step 4: Confirmation (for manual only)
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
              Files ({fileList.length})
            </p>
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

  const getModalTitle = () => {
    if (stampingMethod === "e-stamping") {
      return "Stamping Process Request";
    }
    // For manual
    if (currentStep === 0) return "Stamping Process Request";
    if (currentStep === 1) return "Upload Invoice with Physical Stamp";
    if (currentStep === 2) return "Select Approval";
    if (currentStep === 3) return "Confirmation";
    return "Stamping Process Request";
  };

  const getStepTitles = () => {
    if (stampingMethod === "manual") {
      return [
        { title: "Select Method" },
        { title: "Attachment" },
        { title: "Approval" },
        { title: "Confirmation" },
      ];
    }
    return [];
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
            {getModalTitle()}
          </h2>
        </div>

        {stampingMethod === "manual" && (
          <div style={{ padding: "24px 32px 0" }}>
            <Steps current={currentStep} size="small">
              {getStepTitles().map((step, index) => (
                <Step key={index} title={step.title} />
              ))}
            </Steps>
          </div>
        )}

        <div style={{ padding: "32px" }}>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && stampingMethod === "manual" && renderStep2()}
          {currentStep === 2 && stampingMethod === "manual" && renderStep3()}
          {currentStep === 3 && stampingMethod === "manual" && renderStep4()}
        </div>

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
          {currentStep > 0 && stampingMethod === "manual" && (
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

export default StampingRequestModal;
