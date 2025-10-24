import { Fragment, useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Col, Collapse, Divider, Modal, Row, Space } from "antd";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { LeftOutlined } from "@ant-design/icons";
import HeaderText from "./components/HeaderText";
import FilterButton from "./components/FilterButton";
import promoRepository from "./repository/promoRepository";
import promoHistoryRepository from "./repository/promoHistoryRepository";
import ContainerWithTab from "./components/ContainerWithTab";
import CriteriaAndCondition from "./CriteriaAndCondition";
import HeadersTabs from "./components/HeadersTabs";

const HeaderAccountPromo = ({ onChangeTab, isPromoHistory }) => {
  const keys = [
    { label: "PROMO", value: "promo" },
    { label: "PROMO HISTORY", value: "promoHistory" },
  ];
  return (
    <HeadersTabs
      keys={keys}
      selectedTab={isPromoHistory ? "promoHistory" : "promo"}
      onChangeTab={onChangeTab}
    />
  );
};

const PromoViewData = ({
  isModalPromoVisible,
  setIsModalPromoVisible,
  setDetailPromoData,
}) => {
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
          columns={promoRepository.getColumns(
            setIsModalPromoVisible,
            setDetailPromoData,
          )}
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

const selectedRender = (
  tab,
  isModalPromoVisible,
  setIsModalPromoVisible,
  setDetailPromoData,
) => {
  if (tab === "promoHistory") {
    return <PromoHistoryViewData />;
  }
  return (
    <PromoViewData
      isModalPromoVisible={isModalPromoVisible}
      setIsModalPromoVisible={setIsModalPromoVisible}
      setDetailPromoData={setDetailPromoData}
    />
  );
};

const AccountPromo = () => {
  const [selectedTab, setSelectedTab] = useState("promo");
  const [isModalPromoVisible, setIsModalPromoVisible] = useState(false);
  const [detailPromoData, setDetailPromoData] = useState({});
  const [onChangeDetailPromo, setOnChangeDetailPromo] = useState("criteria");

  const onChangeTab = (tab) => {
    setSelectedTab(tab);
  };
  const isPromoHistory = selectedTab === "promoHistory";

  return (
    <Fragment>
      <ContainerWithTab
        children={
          <Fragment>
            <HeaderAccountPromo
              onChangeTab={onChangeTab}
              isPromoHistory={isPromoHistory}
            />
            <Divider style={{ margin: "2rem 0" }} />
            {selectedRender(
              selectedTab,
              isModalPromoVisible,
              setIsModalPromoVisible,
              setDetailPromoData,
            )}
          </Fragment>
        }
      ></ContainerWithTab>
      <Modal
        title={"DETAIL PROMO"}
        open={isModalPromoVisible}
        onCancel={() => setIsModalPromoVisible(false)}
        footer={null}
        width={1000}
        closable={true}
        className="custom-modal-header"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Collapse
            defaultActiveKey={["criteria"]}
            onChange={(key) => setOnChangeDetailPromo(key)}
            style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
          >
            <Collapse.Panel header="Promo Information" key="general">
              {/* Isi dari detail promo */}
            </Collapse.Panel>
          </Collapse>
          <Collapse
            defaultActiveKey={["criteria"]}
            onChange={(key) => setOnChangeDetailPromo(key)}
            style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
          >
            <Collapse.Panel
              header="Criteria & Conditions Information"
              key="criteria"
            >
              <CriteriaAndCondition />
            </Collapse.Panel>
          </Collapse>
        </Space>
      </Modal>
    </Fragment>
  );
};

export default AccountPromo;
