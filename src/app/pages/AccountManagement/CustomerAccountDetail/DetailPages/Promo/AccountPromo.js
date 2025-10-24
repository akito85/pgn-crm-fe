import { Fragment, useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Col, Divider, Modal, Row, Space } from "antd";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import {
  ArrowLeftOutlined,
  FilterOutlined,
  LeftOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import HeaderText from "./components/HeaderText";
import FilterButton from "./components/FilterButton";
import promoRepository from "./repository/promoRepository";
import promoHistoryRepository from "./repository/promoHistoryRepository";

const HeaderAccountPromo = ({ onChangeTab, isPromoHistory }) => {
  return (
    <Row>
      <Col span={3}>
        <ButtonComponent
          type={isPromoHistory ? "default" : "submit"}
          size="small"
          fullButton
          border={!isPromoHistory}
          onClick={() => onChangeTab("promo")}
        >
          Promo
        </ButtonComponent>
      </Col>
      <Col span={3} offset={1}>
        <ButtonComponent
          type={isPromoHistory ? "submit" : "default"}
          size="small"
          fullButton
          border={isPromoHistory}
          onClick={() => onChangeTab("promoHistory")}
        >
          Promo History
        </ButtonComponent>
      </Col>
    </Row>
  );
};

const PromoViewData = ({ isModalPromoVisible, setIsModalPromoVisible }) => {
  return (
    <Fragment>
      <Row>
        <Col span={4}>
          <HeaderText text="PROMO LIST" />
        </Col>
        <Col span={2} offset={18}>
          <FilterButton />
        </Col>
      </Row>
      <Space direction="vertical" size={"large"}>
        <TablePaginationNew
          columns={promoRepository.getColumns()}
          dataSource={promoRepository.getPromoList()}
        />
        <Row>
          <Col span={2}>
            <ButtonComponent
              type="submit"
              size="small"
              fullButton
              icon={<LeftOutlined />}
            >
              Back
            </ButtonComponent>
          </Col>
        </Row>
      </Space>
    </Fragment>
  );
};

const PromoHistoryViewData = () => {
  return (
    <Fragment>
      <Row>
        <Col span={4}>
          <HeaderText text="PROMO HISTORY" />
        </Col>
        <Col span={2} offset={18}>
          <FilterButton />
        </Col>
      </Row>
      <Space direction="vertical" size={"large"}>
        <TablePaginationNew
          columns={promoHistoryRepository.getColumns()}
          dataSource={promoHistoryRepository.getPromoHistoryList()}
        />
        <Row>
          <Col span={2}>
            <ButtonComponent
              type="submit"
              size="small"
              fullButton
              icon={<LeftOutlined />}
            >
              Back
            </ButtonComponent>
          </Col>
        </Row>
      </Space>
    </Fragment>
  );
};

const selectedRender = (tab, isModalPromoVisible, setIsModalPromoVisible) => {
  if (tab === "promoHistory") {
    return <PromoHistoryViewData />;
  }
  return <PromoViewData />;
};

const AccountPromo = () => {
  const [selectedTab, setSelectedTab] = useState("promo");
  const [isModalPromoVisible, setIsModalPromoVisible] = useState(false);

  const onChangeTab = (tab) => {
    setSelectedTab(tab);
  };
  const isPromoHistory = selectedTab === "promoHistory";

  return (
    <Fragment>
      <BaseContainer>
        <HeaderAccountPromo
          onChangeTab={onChangeTab}
          isPromoHistory={isPromoHistory}
        />
        <Divider style={{ margin: "2rem 0" }} />
        {selectedRender(
          selectedTab,
          isModalPromoVisible,
          setIsModalPromoVisible,
        )}
      </BaseContainer>
      <Modal
        open={isModalPromoVisible}
        onCancel={() => setIsModalPromoVisible(false)}
        footer={null}
      >
        {/* Modal content goes here */}
      </Modal>
    </Fragment>
  );
};

export default AccountPromo;
