import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Form, Upload, message, Spin } from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CardContainer from "../../../../components/CardContainer";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import BaseContainer from "../../../../components/BaseContainer";

const CreateDeliveryJobPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jobNames, setJobNames] = useState([]);
  const [customerSegments, setCustomerSegments] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState([]);
  const [smsTemplates, setSmsTemplates] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [selectedJobNames, setSelectedJobNames] = useState([]);

  // Fetch job names
  const fetchJobNames = async () => {
    try {
      const response = await ratingBillingHttpService.getAll(
        "/v1/dbs/api/rbi/delivery/jobname",
      );
      if (response?.data) {
        setJobNames(response.data);
      }
    } catch (error) {
      console.error("Error fetching job names:", error);
      message.error("Gagal memuat data Job Name");
    }
  };

  // Fetch customer segments
  const fetchCustomerSegments = async () => {
    try {
      const response = await ratingBillingHttpService.getAll(
        "/v1/dbs/api/rbi/delivery/customer-segment",
      );
      if (response?.data) {
        setCustomerSegments(response.data);
      }
    } catch (error) {
      console.error("Error fetching customer segments:", error);
      message.error("Gagal memuat data Customer Segment");
    }
  };

  // Fetch email templates
  const fetchEmailTemplates = async () => {
    try {
      const response = await ratingBillingHttpService.getAll(
        "/v1/dbs/api/rbi/delivery/template/email",
      );
      if (response?.data) {
        setEmailTemplates(response.data);
      }
    } catch (error) {
      console.error("Error fetching email templates:", error);
      message.error("Gagal memuat data Email Template");
    }
  };

  // Fetch WhatsApp templates
  const fetchWhatsappTemplates = async () => {
    try {
      const response = await ratingBillingHttpService.getAll(
        "/v1/dbs/api/rbi/delivery/template/whatsapp",
      );
      if (response?.data) {
        setWhatsappTemplates(response.data);
      }
    } catch (error) {
      console.error("Error fetching WhatsApp templates:", error);
      message.error("Gagal memuat data WhatsApp Template");
    }
  };

  // Fetch SMS templates
  const fetchSmsTemplates = async () => {
    try {
      const response = await ratingBillingHttpService.getAll(
        "/v1/dbs/api/rbi/delivery/template/sms",
      );
      if (response?.data) {
        setSmsTemplates(response.data);
      }
    } catch (error) {
      console.error("Error fetching SMS templates:", error);
      // SMS template is optional, so just log the error
      console.log("SMS templates not available");
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchJobNames();
    fetchCustomerSegments();
    fetchEmailTemplates();
    fetchWhatsappTemplates();
    fetchSmsTemplates();
  }, []);

  // Handle job name change to determine which templates to show
  const handleJobNameChange = (selectedCodes) => {
    setSelectedJobNames(selectedCodes);

    // Clear template fields that are no longer selected
    const currentValues = form.getFieldsValue();
    const newValues = { ...currentValues };

    // Get channels from selected codes
    const selectedChannels = selectedCodes
      .map((code) => {
        const jobName = jobNames.find((job) => job.code === code);
        return jobName ? jobName.code.toLowerCase() : null;
      })
      .filter(Boolean);

    // Clear template fields that are no longer relevant
    ["email", "whatsapp", "wa", "sms"].forEach((channel) => {
      const fieldName = `template_${channel}`;
      if (!selectedChannels.includes(channel) && currentValues[fieldName]) {
        newValues[fieldName] = undefined;
      }
    });

    form.setFieldsValue(newValues);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Prepare FormData for multipart/form-data
      const formData = new FormData();

      // Add job names array
      if (values.jobNames && values.jobNames.length > 0) {
        values.jobNames.forEach((jobName) => {
          formData.append("jobNames[]", jobName);
        });
      }

      // Add description
      formData.append("description", values.description);

      // Add date range
      if (values.activeDateRange && values.activeDateRange.length === 2) {
        formData.append(
          "startDate",
          values.activeDateRange[0].format("YYYY-MM-DD"),
        );
        formData.append(
          "endDate",
          values.activeDateRange[1].format("YYYY-MM-DD"),
        );
      }

      // Add customer segment
      formData.append("customerSegment", values.customerSegment);

      // Add template IDs (optional) - using dynamic field names
      if (values.template_email) {
        formData.append("emailTemplateId", values.template_email);
      }
      if (values.template_whatsapp || values.template_wa) {
        formData.append(
          "whatsappTemplateId",
          values.template_whatsapp || values.template_wa,
        );
      }
      if (values.template_sms) {
        formData.append("smsTemplateId", values.template_sms);
      }

      // Add attachments
      if (fileList && fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append("additionalAttachments", file.originFileObj);
        });
      }

      // Submit via API
      await ratingBillingHttpService.uploadAttachment(
        "/v1/dbs/api/rbi/delivery/create-job-delivery",
        formData,
        (percent) => {
          console.log(`Upload progress: ${percent}%`);
        },
      );

      message.success("Job delivery berhasil dibuat!");
      // Navigate back to management delivery invoice page
      navigate(INVOICE_ROUTES.MANAGEMENT_DELIVERY_INVOICE);
    } catch (error) {
      console.error("Validation or submission failed:", error);
      if (error.response) {
        message.error(
          error.response?.data?.message || "Gagal membuat job delivery",
        );
      } else if (error.errorFields) {
        message.error("Mohon lengkapi semua field yang wajib diisi");
      } else {
        message.error("Terjadi kesalahan saat membuat job delivery");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(INVOICE_ROUTES.MANAGEMENT_DELIVERY_INVOICE);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isValid = isPDF || isJPG || isPNG;

      if (!isValid) {
        message.error("Hanya file PDF, JPG, atau PNG yang diperbolehkan!");
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Ukuran file maksimal 5MB!");
        return false;
      }

      return false; // Prevent auto upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    fileList,
    multiple: true,
    accept: ".pdf,.jpg,.jpeg,.png",
  };

  return (
    <>
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
              CREATE NEW DELIVERY JOB
            </p>
          </div>
        }
        type={"tabs"}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              jobNames: [],
            }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <BaseContainer header={"Delivery Job Information"} border>
              <div className="flex flex-col w-full gap-3">
                {/* Job Name - Multi Select */}
                <div style={{ width: "30%" }}>
                  <Form.Item
                    name="jobNames"
                    rules={[
                      { required: true, message: "Job name wajib dipilih!" },
                      {
                        validator: (_, value) => {
                          if (value && value.length > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Minimal pilih satu job name"),
                          );
                        },
                      },
                    ]}
                  >
                    <SelectComponent
                      label="Job Name"
                      mandatory={true}
                      mode="multiple"
                      placeholder="Choose Multiple..."
                      onChange={handleJobNameChange}
                      options={jobNames.map((job) => ({
                        label: job.text,
                        value: job.code,
                      }))}
                    />
                  </Form.Item>
                </div>

                {/* Description */}
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldError }) => {
                    const hasJobNameError =
                      getFieldError("jobNames").length > 0;
                    return (
                      <div
                        style={{
                          flex: 1,
                          marginTop: hasJobNameError ? "0px" : "-25px",
                        }}
                      >
                        <Form.Item
                          name="description"
                          rules={[
                            {
                              required: true,
                              message: "Deskripsi wajib diisi!",
                            },
                          ]}
                        >
                          <InputComponent
                            label="Description"
                            mandatory={true}
                            type="textarea"
                            placeholder='Contoh: "Pengiriman invoice untuk semua pelanggan industri"'
                            rows={3}
                            maxLength={255}
                          />
                        </Form.Item>
                      </div>
                    );
                  }}
                </Form.Item>
              </div>

              <Form.Item noStyle shouldUpdate>
                {({ getFieldError }) => {
                  const hasDescriptionError =
                    getFieldError("description").length > 0;
                  return (
                    <div
                      className="flex w-full gap-3"
                      style={{
                        marginTop: hasDescriptionError ? "0px" : "-15px",
                      }}
                    >
                      {/* Active Date Range */}
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          label={
                            <span
                              style={{ fontWeight: "400", fontSize: "14px" }}
                            >
                              Active Date Range
                            </span>
                          }
                          name="activeDateRange"
                          rules={[
                            {
                              required: true,
                              message: "Rentang tanggal wajib diisi!",
                            },
                          ]}
                        >
                          <DatePicker.RangePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                            placeholder={["Start Date", "End Date"]}
                            size="medium"
                            disabledDate={(current) => {
                              // Disable dates before today
                              return (
                                current && current < dayjs().startOf("day")
                              );
                            }}
                          />
                        </Form.Item>
                      </div>

                      {/* Customer Criteria */}
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          label={
                            <span
                              style={{ fontWeight: "400", fontSize: "14px" }}
                            >
                              Customer Criteria
                            </span>
                          }
                          name="customerSegment"
                          rules={[
                            {
                              required: true,
                              message: "Customer criteria wajib dipilih!",
                            },
                          ]}
                        >
                          <SelectComponent
                            placeholder="Select Customer Criteria"
                            options={customerSegments.map((segment) => ({
                              label: segment.text,
                              value: segment.code,
                            }))}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  );
                }}
              </Form.Item>
            </BaseContainer>
            <BaseContainer header={"Message Template"} border>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {selectedJobNames.length > 0 ? (
                  <>
                    {(() => {
                      const availableTemplates = [];
                      const unavailableTemplates = [];

                      selectedJobNames.forEach((jobCode) => {
                        const jobName = jobNames.find(
                          (job) => job.code === jobCode,
                        );
                        if (!jobName) return;

                        const channelCode = jobName.code.toLowerCase();
                        const channelText = jobName.text;

                        // Determine which template list to use based on channel
                        let templateOptions = [];
                        let fieldName = `template_${channelCode}`;

                        if (channelCode === "email") {
                          templateOptions = emailTemplates;
                        } else if (
                          channelCode === "whatsapp" ||
                          channelCode === "wa"
                        ) {
                          templateOptions = whatsappTemplates;
                        } else if (channelCode === "sms") {
                          templateOptions = smsTemplates;
                        }

                        // Categorize templates
                        if (templateOptions.length > 0) {
                          availableTemplates.push({
                            jobCode,
                            channelCode,
                            channelText,
                            fieldName,
                            templateOptions,
                          });
                        } else {
                          unavailableTemplates.push({
                            channelText,
                          });
                        }
                      });

                      return (
                        <>
                          {/* Render available template fields */}
                          {availableTemplates.map(
                            ({
                              jobCode,
                              channelText,
                              fieldName,
                              templateOptions,
                            }) => (
                              <Form.Item
                                key={jobCode}
                                name={fieldName}
                                style={{ marginBottom: 0 }}
                                rules={[
                                  {
                                    required: true,
                                    message: `${channelText} template wajib dipilih!`,
                                  },
                                ]}
                              >
                                <SelectComponent
                                  label={channelText}
                                  mandatory={true}
                                  placeholder={`Select ${channelText} Template`}
                                  allowClear
                                  options={templateOptions.map((template) => ({
                                    label: template.text,
                                    value: template.code,
                                  }))}
                                />
                              </Form.Item>
                            ),
                          )}

                          {/* Show message for unavailable templates */}
                          {unavailableTemplates.length > 0 && (
                            <div
                              style={{
                                padding: "12px 16px",
                                background: "#fff7e6",
                                border: "1px solid #ffd591",
                                borderRadius: "6px",
                                marginTop:
                                  availableTemplates.length > 0 ? "8px" : "0",
                              }}
                            >
                              <div
                                style={{
                                  color: "#d46b08",
                                  fontSize: "14px",
                                  marginBottom: "4px",
                                  fontWeight: "500",
                                }}
                              >
                                Template Not Available
                              </div>
                              <div
                                style={{ color: "#8c8c8c", fontSize: "13px" }}
                              >
                                Template Message{" "}
                                <strong>
                                  {unavailableTemplates
                                    .map((t) => t.channelText)
                                    .join(", ")}
                                </strong>{" "}
                                has not been created yet. Please add a template
                                via Content Management to continue.
                              </div>
                            </div>
                          )}

                          {/* Add New Template Button */}
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            style={{
                              width: "100%",
                              marginTop: "16px",
                              marginBottom: "16px",
                            }}
                            size="large"
                            onClick={() =>
                              navigate(
                                "/system-setup/content-management/create",
                              )
                            }
                          >
                            Add New Message Template
                          </Button>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      color: "#8c8c8c",
                    }}
                  >
                    Please select a job name to configure message templates
                  </div>
                )}
              </div>
            </BaseContainer>

            {/* INVOICE ATTACHMENT Section */}
            <BaseContainer header={"Invoice Attachment"} border>
              <Form.Item
                label={
                  <span style={{ fontWeight: "500", fontSize: "14px" }}>
                    Multiple File Upload
                  </span>
                }
              >
                <Upload.Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <PlusCircleOutlined
                      style={{ color: "var(--primary)", fontSize: "32px" }}
                    />
                  </p>
                  <p
                    className="ant-upload-text"
                    style={{ fontWeight: "500", fontSize: "14px" }}
                  >
                    <span
                      style={{
                        color: "var(--primary)",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Click
                    </span>{" "}
                    or Drag file to this area to upload
                  </p>
                  <p
                    className="ant-upload-hint"
                    style={{ color: "#8c8c8c", fontSize: "14px" }}
                  >
                    <InboxOutlined style={{ marginRight: "4px" }} />
                    PDF, JPG, PNG • Max 5MB
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </BaseContainer>
          </Form>
        </Spin>
      </CardContainer>
      {/* Action Buttons */}
      <div className="flex w-full bg-white rounded-md p-3 mt-3 justify-between">
        <Button size="large" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={loading}
        >
          Save Configuration
        </Button>
      </div>
    </>
  );
};

export default CreateDeliveryJobPage;
