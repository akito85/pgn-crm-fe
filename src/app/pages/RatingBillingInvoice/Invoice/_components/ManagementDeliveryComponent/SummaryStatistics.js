import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

// Summary Statistics Component
const SummaryStatistics = ({ totalSent, failed, pending, notProcessed }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
              padding: "10px",
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px" }}
                >
                  Total Terkirim
                </span>
              }
              value={totalSent}
              valueStyle={{
                color: "#fff",
                fontSize: "32px",
                fontWeight: "700",
              }}
              prefix={<SendOutlined style={{ fontSize: "24px" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(245, 87, 108, 0.15)",
              padding: "10px",
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px" }}
                >
                  Gagal
                </span>
              }
              value={failed}
              valueStyle={{
                color: "#fff",
                fontSize: "32px",
                fontWeight: "700",
              }}
              prefix={<CloseCircleOutlined style={{ fontSize: "24px" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(252, 182, 159, 0.15)",
              padding: "10px",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(0,0,0,0.65)", fontSize: "14px" }}>
                  Menunggu
                </span>
              }
              value={pending}
              valueStyle={{
                color: "#d46b08",
                fontSize: "32px",
                fontWeight: "700",
              }}
              prefix={<ClockCircleOutlined style={{ fontSize: "24px" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #e0e7ff 0%, #cfd9ff 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(207, 217, 255, 0.15)",
              padding: "10px",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(0,0,0,0.65)", fontSize: "14px" }}>
                  Belum Diproses
                </span>
              }
              value={notProcessed}
              valueStyle={{
                color: "#595959",
                fontSize: "32px",
                fontWeight: "700",
              }}
              prefix={<FileTextOutlined style={{ fontSize: "24px" }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SummaryStatistics;
