import { Fragment } from "react";
import ColoredPanel from "./components/ColoredPanel";
import HeaderText from "./components/HeaderText";
import { Col, Row, Space } from "antd";
import promoCriteriaRepository from "./repository/promoCriteriaRepository";

const renderHistoryData = (label, value) => {
  return (
    <Space direction="vertical" size={"small"}>
      <strong>{label}</strong>
      <span>{value}</span>
    </Space>
  );
};

const renderHistoryLogContent = (historyLog) => {
  const log = historyLog[0]; // Assuming we want to display the first log entry
  return (
    <Fragment>
      <HeaderText text="HISTORY LOG INFORMATION" />
      <Row className="mt-4">
        <Col span={6}>{renderHistoryData("Created Date", log.createdDate)}</Col>
        <Col span={6}>{renderHistoryData("Created By", log.createdBy)}</Col>
        <Col span={6}>
          {renderHistoryData("Modified Date", log.modifiedDate)}
        </Col>
        <Col span={6}>{renderHistoryData("Modified By", log.modifiedBy)}</Col>
      </Row>
    </Fragment>
  );
};

const HistoryLogInformation = ({ historyLog }) => {
  return <ColoredPanel> {renderHistoryLogContent(historyLog)} </ColoredPanel>;
};

export default HistoryLogInformation;
