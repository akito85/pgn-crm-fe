import {
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Divider,
  Space,
  Modal,
  Form,
  Input,
  Checkbox,
  Upload,
  message,
} from "antd";
import { SendOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// Create Job Modal Component
const CreateJobModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      message.success("Job pengiriman berhasil dibuat!");
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

  const uploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error("Hanya file PDF yang diperbolehkan!");
      }
      return false;
    },
    maxCount: 1,
    accept: ".pdf",
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
          <SendOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          Buat Job Pengiriman Baru
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
      footer={[
        <Button key="cancel" size="large" onClick={handleCancel}>
          Batal
        </Button>,
        <Button
          key="submit"
          type="primary"
          size="large"
          icon={<SendOutlined />}
          onClick={handleSubmit}
        >
          Simpan Konfigurasi
        </Button>,
      ]}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          customerType: "industri",
        }}
      >
        <Row gutter={24}>
          {/* Left Column */}
          <Col span={12}>
            {/* Job Name */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  Nama Job
                </span>
              }
              name="jobName"
              rules={[{ required: true, message: "Nama job wajib diisi!" }]}
            >
              <Input
                placeholder='Contoh: "Job Pengiriman Bulanan Industri Oktober"'
                size="large"
              />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  Deskripsi
                </span>
              }
              name="description"
              rules={[{ required: true, message: "Deskripsi wajib diisi!" }]}
            >
              <TextArea
                placeholder='Contoh: "Pengiriman invoice untuk semua pelanggan industri"'
                rows={3}
                size="large"
              />
            </Form.Item>

            {/* Active Date Range */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  Rentang Tanggal Aktif
                </span>
              }
              name="activeDateRange"
              rules={[
                { required: true, message: "Rentang tanggal wajib diisi!" },
              ]}
            >
              <RangePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder={["Tanggal Mulai", "Tanggal Akhir"]}
                size="large"
              />
            </Form.Item>

            {/* Delivery Date */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  Tanggal Pengiriman
                </span>
              }
              name="deliveryDate"
              rules={[
                { required: true, message: "Tanggal pengiriman wajib diisi!" },
              ]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Pilih tanggal dan waktu"
                size="large"
              />
            </Form.Item>

            {/* Delivery Channels */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  Kanal Pengiriman
                </span>
              }
              name="channels"
              rules={[
                {
                  required: true,
                  message: "Minimal pilih satu kanal pengiriman!",
                },
              ]}
            >
              <Checkbox.Group style={{ width: "100%" }}>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Checkbox value="email" style={{ fontSize: "14px" }}>
                      <span style={{ fontWeight: "500" }}>📧 Email</span>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="whatsapp" style={{ fontSize: "14px" }}>
                      <span style={{ fontWeight: "500" }}>📱 WhatsApp</span>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="sms" style={{ fontSize: "14px" }}>
                      <span style={{ fontWeight: "500" }}>💬 SMS</span>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="pgn_mobile" style={{ fontSize: "14px" }}>
                      <span style={{ fontWeight: "500" }}>📲 PGN Mobile</span>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="fisik" style={{ fontSize: "14px" }}>
                      <span style={{ fontWeight: "500" }}>🚚 Fisik</span>
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>

          {/* Right Column */}
          <Col span={12}>
            {/* Customer Type */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  Kriteria Pelanggan
                </span>
              }
              name="customerType"
              rules={[
                { required: true, message: "Tipe pelanggan wajib dipilih!" },
              ]}
            >
              <Select size="large" placeholder="Pilih tipe pelanggan">
                <Option value="industri">🏭 Industri</Option>
                <Option value="ritel">🏪 Ritel</Option>
                <Option value="korporat">🏢 Korporat</Option>
                <Option value="umum">👥 Umum</Option>
              </Select>
            </Form.Item>

            <Divider
              orientation="left"
              style={{ margin: "16px 0", fontSize: "14px", fontWeight: "500" }}
            >
              📝 Template Pesan
            </Divider>

            {/* Email Template */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  Email
                </span>
              }
              name="emailTemplate"
            >
              <Select size="large" placeholder="Pilih template email">
                <Option value="template_industri_email">
                  Template Industri (Email)
                </Option>
                <Option value="template_ritel_email">
                  Template Ritel (Email)
                </Option>
                <Option value="template_korporat_email">
                  Template Korporat (Email)
                </Option>
              </Select>
            </Form.Item>

            {/* WhatsApp Template */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  WhatsApp
                </span>
              }
              name="waTemplate"
            >
              <Select size="large" placeholder="Pilih template WhatsApp">
                <Option value="template_industri_wa">
                  Template Industri (WA)
                </Option>
                <Option value="template_ritel_wa">Template Ritel (WA)</Option>
                <Option value="template_korporat_wa">
                  Template Korporat (WA)
                </Option>
              </Select>
            </Form.Item>

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{ width: "100%", marginBottom: "16px" }}
              size="large"
            >
              Atur Template Pesan
            </Button>

            <Divider
              orientation="left"
              style={{ margin: "16px 0", fontSize: "14px", fontWeight: "500" }}
            >
              📎 Lampiran Invoice
            </Divider>

            {/* Invoice Attachments */}
            <Form.Item
              label={
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  File Lampiran
                </span>
              }
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="small"
              >
                <Upload {...uploadProps}>
                  <Button
                    icon={<UploadOutlined />}
                    style={{ width: "100%" }}
                    size="large"
                  >
                    📄 Upload File 1
                  </Button>
                </Upload>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    paddingLeft: "4px",
                  }}
                >
                  Contoh: Brosur Promo Oktober 2025.pdf
                </div>

                <Upload {...uploadProps}>
                  <Button
                    icon={<UploadOutlined />}
                    style={{ width: "100%" }}
                    size="large"
                  >
                    📄 Upload File 2
                  </Button>
                </Upload>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8c8c8c",
                    paddingLeft: "4px",
                  }}
                >
                  Contoh: Panduan Pembayaran via VA.pdf
                </div>
              </Space>
            </Form.Item>

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{ width: "100%", marginTop: "8px" }}
              size="large"
            >
              Atur Lampiran Invoice
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateJobModal;
