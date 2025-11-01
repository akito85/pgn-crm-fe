import { Fragment, useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Col, Collapse, Divider, Modal, Row, Space } from "antd";
import { TablePaginationNew } from "poc-table-dragandrop";
import { LeftOutlined } from "@ant-design/icons";
import HeaderText from "./components/HeaderText";
import FilterButton from "./components/FilterButton";
import promoRepository from "./repository/promoRepository";
import promoHistoryRepository from "./repository/promoHistoryRepository";
import ContainerWithTab from "./components/ContainerWithTab";
import CriteriaAndCondition from "./CriteriaAndCondition";
import HeadersTabs from "./components/HeadersTabs";
import HistoryLogInformation from "./HistoryLogInformation";
import ModalCustomPromo from "./components/ModalCustomPromo";
import promoCriteriaRepository from "./repository/promoCriteriaRepository";
import promoConditionRepository from "./repository/promoConditionRepository";

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
      <Row align={"middle"}>
        <Col span={4}>
          <HeaderText text="PROMO LIST" />
        </Col>
        <Col span={2} offset={18}>
          <FilterButton />
        </Col>
      </Row>
      <Space direction="vertical" size={"large"}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <TablePaginationNew
            enableDragColumn={true}
            enableColumnSorter={true}
            enableColumnFilter={true}
            freezeColumns={[{ key: "action", position: "left" }]}
            tableScrolled={{ x: 800 }}
            columns={promoRepository.getColumns(
              setIsModalPromoVisible,
              setDetailPromoData,
            )}
            dataSource={promoRepository.getPromoList()}
          />
        </div>
      </Space>
    </Fragment>
  );
};

const PromoHistoryViewData = ({
  isModalHistoryVisible,
  setIsModalHistoryVisible,
  setDetailHistoryData,
}) => {
  return (
    <Fragment>
      <Row align={"middle"}>
        <Col span={4}>
          <HeaderText text="PROMO HISTORY" />
        </Col>
        <Col span={2} offset={18}>
          <FilterButton />
        </Col>
      </Row>
      <Space direction="vertical" size={"large"}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <TablePaginationNew
            enableDragColumn={true}
            enableColumnSorter={true}
            enableColumnFilter={true}
            freezeColumns={[{ key: "action", position: "left" }]}
            tableScrolled={{ x: 800 }}
            columns={promoHistoryRepository.getColumns(
              setIsModalHistoryVisible,
              setDetailHistoryData,
            )}
            dataSource={promoHistoryRepository.getPromoHistoryList()}
          />
        </div>
      </Space>
    </Fragment>
  );
};

const selectedRender = ({
  tab,
  isModalPromoVisible,
  setIsModalPromoVisible,
  setDetailPromoData,
  isModalHistoryVisible,
  setIsModalHistoryVisible,
  setDetailHistoryData,
}) => {
  if (tab === "promoHistory") {
    return (
      <PromoHistoryViewData
        isModalHistoryVisible={isModalHistoryVisible}
        setIsModalHistoryVisible={setIsModalHistoryVisible}
        setDetailHistoryData={setDetailHistoryData}
      />
    );
  }
  return (
    <PromoViewData
      isModalPromoVisible={isModalPromoVisible}
      setIsModalPromoVisible={setIsModalPromoVisible}
      setDetailPromoData={setDetailPromoData}
    />
  );
};
const renderLabelDataValue = (label, value) => {
  return (
    <Space direction="vertical" size={"small"}>
      <strong>{label}</strong>
      <span>{value}</span>
    </Space>
  );
};

const renderModalAccountPromo = ({
  tab,
  isModalPromoVisible,
  setIsModalPromoVisible,
  setOnChangeDetailPromo,
  detailPromoData,
  selectedTabCriteriaAndCondition,
  setSelectedTabCriteriaAndCondition,
  isModalHistoryVisible,
  setIsModalHistoryVisible,
  setOnChangeDetailHistory,
  detailHistoryData,
}) => {
  switch (tab) {
    case "promo":
      return (
        <ModalCustomPromo
          title={"DETAIL PROMO"}
          isOpen={isModalPromoVisible}
          setIsOpen={setIsModalPromoVisible}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Collapse
              defaultActiveKey={["criteria"]}
              onChange={(key) => setOnChangeDetailPromo(key)}
              style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
            >
              <Collapse.Panel header="Promo Information" key="general">
                <Space
                  direction="vertical"
                  size={"small"}
                  style={{ width: "100%" }}
                >
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue("Name", detailPromoData?.name)}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue("Type", detailPromoData?.type)}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue("Item", detailPromoData?.item)}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Category",
                        detailPromoData?.category,
                      )}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Criteria",
                        detailPromoData?.startDate,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Start Date",
                        detailPromoData?.startDate,
                      )}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "End Date",
                        detailPromoData?.endDate,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {renderLabelDataValue(
                        "Description",
                        detailPromoData?.description,
                      )}
                    </Col>
                  </Row>
                </Space>
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
                <CriteriaAndCondition
                  isVisible={isModalPromoVisible}
                  setIsVisible={setIsModalPromoVisible}
                  selectedTab={selectedTabCriteriaAndCondition}
                  setSelectedTab={setSelectedTabCriteriaAndCondition}
                />
              </Collapse.Panel>
            </Collapse>
            <HistoryLogInformation
              historyLog={
                selectedTabCriteriaAndCondition === "criteria"
                  ? promoCriteriaRepository.getHistoryLog()
                  : promoConditionRepository.getHistoryLog()
              }
            />
          </Space>
        </ModalCustomPromo>
      );
    case "promoHistory":
      return (
        <ModalCustomPromo
          title={"DETAIL PROMO HISTORY"}
          isOpen={isModalHistoryVisible}
          setIsOpen={setIsModalHistoryVisible}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Collapse
              defaultActiveKey={["promoHistoryInformation"]}
              onChange={(key) => setOnChangeDetailHistory(key)}
              style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
            >
              <Collapse.Panel
                header="Promo History Information"
                key="promoHistoryInformation"
              >
                <Space
                  direction="vertical"
                  size={"small"}
                  style={{ width: "100%" }}
                >
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue("Name", detailHistoryData?.name)}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue("Type", detailHistoryData?.type)}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Category",
                        detailHistoryData?.category,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Criteria",
                        detailHistoryData?.criteria,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Start Date",
                        detailHistoryData?.startDate,
                      )}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "End Date",
                        detailHistoryData?.endDate,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {renderLabelDataValue(
                        "Description",
                        detailHistoryData?.description,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Billing Date",
                        detailHistoryData?.billingDate,
                      )}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Billing No.",
                        detailHistoryData?.billingNo,
                      )}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Billing Period",
                        detailHistoryData?.billingPeriod,
                      )}
                    </Col>
                  </Row>
                </Space>
              </Collapse.Panel>
            </Collapse>
            <Collapse
              defaultActiveKey={["criteria"]}
              onChange={(key) => setOnChangeDetailHistory(key)}
              style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
            >
              <Collapse.Panel
                header="Criteria & Conditions Information"
                key="criteria"
              ></Collapse.Panel>
            </Collapse>
          </Space>
        </ModalCustomPromo>
      );
    default:
      return "";
  }
};

const AccountPromo = () => {
  const [selectedTab, setSelectedTab] = useState("promo");
  const [selectedTabCriteriaAndCondition, setSelectedTabCriteriaAndCondition] =
    useState("criteria");

  const [isModalPromoVisible, setIsModalPromoVisible] = useState(false);
  const [detailPromoData, setDetailPromoData] = useState({});
  const [isModalHistoryVisible, setIsModalHistoryVisible] = useState(false);
  const [detailHistoryData, setDetailHistoryData] = useState({});
  const [onChangeDetailPromo, setOnChangeDetailPromo] = useState("criteria");
  const [onChangeDetailHistory, setOnChangeDetailHistory] = useState(
    "promoHistoryInformation",
  );
  const isPromoHistory = selectedTab === "promoHistory";

  const onChangeTab = (tab) => {
    setSelectedTab(tab);
  };

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
            {selectedRender({
              tab: selectedTab,
              isModalPromoVisible,
              setIsModalPromoVisible,
              setDetailPromoData,
              isModalHistoryVisible,
              setIsModalHistoryVisible,
              setDetailHistoryData,
            })}
          </Fragment>
        }
      ></ContainerWithTab>
      {renderModalAccountPromo({
        tab: selectedTab,
        isModalPromoVisible,
        setIsModalPromoVisible,
        setOnChangeDetailPromo,
        detailPromoData,
        selectedTabCriteriaAndCondition,
        setSelectedTabCriteriaAndCondition,
        isModalHistoryVisible,
        setIsModalHistoryVisible,
        setOnChangeDetailHistory,
        detailHistoryData,
      })}
    </Fragment>
  );
};

export default AccountPromo;
