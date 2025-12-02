import { FilterOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Row, Select, Space } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

// Filter Section Component
const FilterSection = ({
  dateRange,
  setDateRange,
  status,
  setStatus,
  onApplyFilter,
  onResetFilter,
}) => {
  return (
    <Card
      title={
        <span style={{ fontSize: "16px", fontWeight: "600" }}>
          🔍 Filter Pencarian
        </span>
      }
      bordered={false}
      style={{
        marginBottom: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Row gutter={[16, 16]} className="p-5">
        <Col xs={24} sm={24} md={10}>
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#262626",
              }}
            >
              Rentang Tanggal
            </label>
          </div>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            placeholder={["Tanggal Mulai", "Tanggal Akhir"]}
            size="large"
          />
        </Col>
        <Col xs={24} sm={24} md={10}>
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#262626",
              }}
            >
              Status Pengiriman
            </label>
          </div>
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: "100%" }}
            placeholder="Pilih status pengiriman"
            size="large"
          >
            <Option value="all">🔘 Semua Status</Option>
            <Option value="terkirim">✅ Terkirim</Option>
            <Option value="gagal">❌ Gagal</Option>
            <Option value="menunggu">⏳ Menunggu</Option>
            <Option value="belum">📋 Belum Diproses</Option>
          </Select>
        </Col>
        <Col xs={24} sm={24} md={4}>
          <div style={{ marginBottom: "8px", opacity: 0 }}>
            <label>.</label>
          </div>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={onApplyFilter}
              style={{ width: "100%", height: "40px" }}
              size="large"
            >
              Terapkan
            </Button>
            {/* <Button
              icon={<ReloadOutlined />}
              onClick={onResetFilter}
              style={{ width: "100%", height: "40px" }}
              size="large"
            >
              Reset
            </Button> */}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterSection;
