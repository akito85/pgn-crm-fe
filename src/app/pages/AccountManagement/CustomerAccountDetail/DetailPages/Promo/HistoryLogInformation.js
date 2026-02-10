import ColoredPanel from "./components/ColoredPanel";
import { Col, Row, Space } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const renderHistoryData = (label, value) => {
  return (
    <Space direction="vertical" size="small">
      <strong>{label}</strong>
      <span>{value || "-"}</span>
    </Space>
  );
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  return moment(dateString).format(dateFormatting.dateTime);
};

const renderHistoryLogContent = (data) => {
  if (!data) {
    return <span>No data available</span>;
  }

  return (
    <Row gutter={[16, 8]}>
      <Col span={4}>
        {renderHistoryData("Record Id", data?.recordId || data?.id)}
      </Col>

      <Col span={4}>
        {renderHistoryData("Created Date", formatDateTime(data?.createdDate))}
      </Col>

      <Col span={4}>{renderHistoryData("Created By", data?.createdBy)}</Col>

      <Col span={4}>
        {renderHistoryData("Updated Date", formatDateTime(data?.updatedDate))}
      </Col>

      <Col span={4}>{renderHistoryData("Updated By", data?.updatedBy)}</Col>
    </Row>
  );
};

const HistoryLogInformation = ({ data }) => {
  return (
    <ColoredPanel title="HISTORY LOG INFORMATION">
      {renderHistoryLogContent(data)}
    </ColoredPanel>
  );
};

export default HistoryLogInformation;
