import { Fragment } from "react";
import ColoredPanel from "./components/ColoredPanel";
import HeaderText from "./components/HeaderText";
import { Col, Row, Space } from "antd";
import moment from "moment";

const renderHistoryData = (label, value) => {
  return (
    <Space direction="vertical" size={"small"}>
      <strong>{label}</strong>
      <span>{value || ""}</span>
    </Space>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  // Format from "2025-12-05T04:47:09.210+00:00" to "12 Dec 2025"
  return moment(dateString).format("DD MMM YYYY");
};

const renderHistoryLogContent = (data) => {
  if (!data) {
    return (
      <Fragment>
        <HeaderText text="HISTORY LOG INFORMATION" />
        <Row className="mt-4">
          <Col span={24}>
            <span>No data available</span>
          </Col>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <HeaderText text="HISTORY LOG INFORMATION" />
      <Row className="mt-4">
        <Col span={6}>{renderHistoryData("Record Id", data?.recordId || data?.id)}</Col>
        <Col span={6}>{renderHistoryData("Created Date", formatDate(data?.createdDate))}</Col>
        <Col span={6}>{renderHistoryData("Created By", data?.createdBy)}</Col>
        <Col span={6}>
          {renderHistoryData("Updated Date", formatDate(data?.updatedDate))}
        </Col>
        <Col span={6}>{renderHistoryData("Updated By", data?.updatedBy)}</Col>
      </Row>
    </Fragment>
  );
};

const HistoryLogInformation = ({ data }) => {
  return <ColoredPanel> {renderHistoryLogContent(data)} </ColoredPanel>;
};

export default HistoryLogInformation;
