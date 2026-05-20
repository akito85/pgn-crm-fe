import {
  ClockCircleFilled,
  CloseCircleFilled,
  FileTextFilled,
  SendOutlined,
  MailOutlined,
  MessageOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Card, Col, Row } from "antd";

// Summary Statistics Component
const SummaryStatistics = ({
  totalSent,
  failed,
  pending,
  notProcessed,
  summaryChannel,
}) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      {/* Summary Status Section */}
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#F5F5F5",
              padding: "6px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <SendOutlined
                style={{
                  fontSize: "12px",
                  color: "#1976D2",
                  marginRight: "4px",
                }}
              />
              <span
                style={{
                  color: "#1976D2",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                Total Sending
              </span>
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "600", color: "#262626" }}
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
              padding: "6px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <CloseCircleFilled
                style={{
                  fontSize: "12px",
                  color: "#D32F2F",
                  marginRight: "4px",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: "#D32F2F",
                }}
              >
                Failed
              </span>
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "600", color: "#262626" }}
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
              padding: "6px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <ClockCircleFilled
                style={{
                  fontSize: "12px",
                  color: "#F57C00",
                  marginRight: "4px",
                }}
              />
              <span
                style={{
                  color: "#F57C00",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                Waiting
              </span>
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "600", color: "#262626" }}
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
              padding: "6px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <FileTextFilled
                style={{
                  fontSize: "12px",
                  marginRight: "4px",
                }}
              />
              <span style={{ fontSize: "11px", fontWeight: "500" }}>
                Not Processed
              </span>
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "600", color: "#262626" }}
            >
              {notProcessed.toLocaleString()}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Total Channel Section */}
      <div style={{ marginTop: "12px" }}>
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "400",
            color: "#1976D2",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          Total Channel
        </h3>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{
                background: "#F5F5F5",
                padding: "6px",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                border: "1px solid #f0f0f0",
              }}
              bodyStyle={{ padding: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <MailOutlined
                  style={{
                    fontSize: "12px",
                    marginRight: "4px",
                  }}
                />
                <span style={{ fontSize: "11px", fontWeight: "500" }}>
                  Total Email
                </span>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "400",
                  color: "#262626",
                }}
              >
                {(summaryChannel?.email ?? 0).toLocaleString()}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{
                background: "#F5F5F5",
                padding: "6px",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                border: "1px solid #f0f0f0",
              }}
              bodyStyle={{ padding: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <MessageOutlined
                  style={{
                    fontSize: "12px",
                    marginRight: "4px",
                  }}
                />
                <span style={{ fontSize: "11px", fontWeight: "500" }}>
                  Total SMS
                </span>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "400",
                  color: "#262626",
                }}
              >
                {(summaryChannel?.sms ?? 0).toLocaleString()}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{
                background: "#F5F5F5",
                padding: "6px",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                border: "1px solid #f0f0f0",
              }}
              bodyStyle={{ padding: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <WhatsAppOutlined
                  style={{
                    fontSize: "12px",
                    marginRight: "4px",
                  }}
                />
                <span style={{ fontSize: "11px", fontWeight: "500" }}>
                  Total WhatsApp
                </span>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "400",
                  color: "#262626",
                }}
              >
                {(summaryChannel?.whatsApp ?? 0).toLocaleString()}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SummaryStatistics;
