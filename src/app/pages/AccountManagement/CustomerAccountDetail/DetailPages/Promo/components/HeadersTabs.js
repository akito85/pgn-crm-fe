import { Col, Row } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

const HeadersTabs = ({ keys, selectedTab, onChangeTab, isModal = false }) => {
  return (
    <Row>
      {keys.map((key, index) => (
        <Col span={isModal ? 4 : 3} key={index} offset={index === 0 ? 0 : 1}>
          <ButtonComponent
            type={selectedTab === key.value ? "submit" : "default"}
            size="small"
            fullButton
            border={selectedTab === key.value}
            onClick={() => onChangeTab(key.value)}
          >
            <span className={isModal ? "text-[14px]" : ""}>{key.label}</span>
          </ButtonComponent>
        </Col>
      ))}
    </Row>
  );
};

export default HeadersTabs;
