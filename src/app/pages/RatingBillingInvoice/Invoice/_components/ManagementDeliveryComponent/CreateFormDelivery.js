import {
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

const CreateFormDelivery = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success("Delivery job berhasil dibuat!");
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
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
            {/* Billing Period */}
            <Form.Item
              label={
                <span style={{ fontWeight: 500, fontSize: 14 }}>
                  Billing Period
                </span>
              }
              name="billingPeriod"
              rules={[
                { required: true, message: "Billing period wajib dipilih!" },
              ]}
            >
              <Select size="large" placeholder="Pilih billing period">
                <Option value="jan">1 – 31 Januari</Option>
                <Option value="feb">1 – 28 Februari</Option>
                <Option value="mar">1 – 31 Maret</Option>
                <Option value="apr">1 – 30 April</Option>
                <Option value="may">1 – 31 Mei</Option>
                <Option value="jun">1 – 30 Juni</Option>
                <Option value="jul">1 – 31 Juli</Option>
                <Option value="aug">1 – 31 Agustus</Option>
                <Option value="sep">1 – 30 September</Option>
                <Option value="oct">1 – 31 Oktober</Option>
                <Option value="nov">1 – 30 November</Option>
                <Option value="dec">1 – 31 Desember</Option>
              </Select>
            </Form.Item>

            {/* Schedule Type */}
            <Form.Item
              label={
                <span style={{ fontWeight: 500, fontSize: 14 }}>
                  Schedule Type
                </span>
              }
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

            {/* Schedule DateTime */}
            {isScheduled && (
              <Form.Item
                label={
                  <span style={{ fontWeight: 500, fontSize: 14 }}>
                    Choose Date & Time
                  </span>
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
              label={
                <span style={{ fontWeight: 500, fontSize: 14 }}>Remark</span>
              }
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
