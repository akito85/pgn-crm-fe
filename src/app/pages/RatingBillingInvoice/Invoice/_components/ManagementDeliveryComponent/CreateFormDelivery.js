import { Button, DatePicker, Select, Row, Col, Modal, Form, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import {
  createDeliveryJob,
  getBillingPeriod,
} from "../../../../../../redux/slices/rating_billing_invoice/managementDeliveryInvoice";

const { Option } = Select;
const { TextArea } = Input;

const CreateFormDelivery = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data_billingPeriod, loading } = useSelector(
    (state) => state.managementDeliveryInvoice
  );

  const [isScheduled, setIsScheduled] = useState(false);

  console.log("Billing Period Data:", data_billingPeriod);
  // Fetch Billing Period ketika modal dibuka
  useEffect(() => {
    if (visible) {
      dispatch(getBillingPeriod());
    }
  }, [visible, dispatch]);

  // Submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedScheduledAt = values?.scheduledAt
        ? moment(values.scheduledAt).format("YYYY-MM-DD HH:mm:ss")
        : null;

      const payload = {
        billPeriod: values.billingPeriod,
        scheduleType: values.scheduleType,
        scheduleTime: formattedScheduledAt,
        remark: values.remark || "",
      };

      console.log("Payload:", payload);

      await dispatch(createDeliveryJob(payload)).unwrap();

      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Create job failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={visible}
      title={
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
          <SendOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Create New Delivery Job
        </div>
      }
      onCancel={handleCancel}
      width={650}
      footer={[
        <Button key="cancel" size="large" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          size="large"
          icon={<SendOutlined />}
          loading={loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>,
      ]}
      style={{ top: 30 }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={20}>
          <Col span={24}>
            {/* Billing Period (Dynamic) */}
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Billing Period</span>}
              name="billingPeriod"
              rules={[
                { required: true, message: "Billing period wajib dipilih!" },
              ]}
            >
              <Select
                size="large"
                placeholder="Pilih billing period"
                loading={loading}
              >
                {data_billingPeriod?.map((item, idx) => (
                  <Option key={idx} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Schedule Type */}
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Schedule Type</span>}
              name="scheduleType"
              rules={[
                { required: true, message: "Schedule type wajib dipilih!" },
              ]}
            >
              <Select
                size="large"
                placeholder="Pilih schedule type"
                onChange={(v) => setIsScheduled(v === "schedule")}
              >
                <Option value="immediate">Immediate</Option>
                <Option value="schedule">Schedule</Option>
              </Select>
            </Form.Item>

            {/* Date & Time Selector */}
            {isScheduled && (
              <Form.Item
                label={
                  <span style={{ fontWeight: 500 }}>Choose Date & Time</span>
                }
                name="scheduledAt"
                rules={[
                  { required: true, message: "Tanggal dan waktu wajib diisi!" },
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm:ss" }}
                  format="DD/MM/YYYY HH:mm:ss"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            )}

            {/* Remark */}
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Remark</span>}
              name="remark"
            >
              <TextArea
                rows={3}
                size="large"
                placeholder="Masukkan remark (opsional)"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateFormDelivery;
