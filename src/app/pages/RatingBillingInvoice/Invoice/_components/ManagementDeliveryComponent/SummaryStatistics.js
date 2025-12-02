import {
  ClockCircleFilled,
  CloseCircleFilled,
  FileTextFilled,
  SendOutlined,
} from "@ant-design/icons";
import { Card, Col, Row } from "antd";

// Summary Statistics Component
const SummaryStatistics = ({ totalSent, failed, pending, notProcessed }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#F5F5F5",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <SendOutlined
                style={{
                  fontSize: "14px",
                  color: "#1976D2",
                  marginRight: "6px",
                }}
              />
              <span
                style={{
                  color: "#1976D2",
                  fontSize: "13px",
                  fontWeight: "900",
                }}
              >
                Total Sending
              </span>
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "600", color: "#262626" }}
            >
              {totalSent.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#F5F5F5",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <CloseCircleFilled
                style={{
                  fontSize: "14px",
                  color: "#D32F2F",
                  marginRight: "6px",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "900",
                  color: "#D32F2F",
                }}
              >
                Failed
              </span>
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "600", color: "#262626" }}
            >
              {failed.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#F5F5F5",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <ClockCircleFilled
                style={{
                  fontSize: "14px",
                  color: "#F57C00",
                  marginRight: "6px",
                }}
              />
              <span
                style={{
                  color: "#F57C00",
                  fontSize: "13px",
                  fontWeight: "900",
                }}
              >
                Waiting
              </span>
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "600", color: "#262626" }}
            >
              {pending.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#F5F5F5",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FileTextFilled
                style={{
                  fontSize: "14px",
                  marginRight: "6px",
                }}
              />
              <span style={{ fontSize: "13px", fontWeight: "900" }}>
                Not Processed
              </span>
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "600", color: "#262626" }}
            >
              {notProcessed.toLocaleString()}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SummaryStatistics;
