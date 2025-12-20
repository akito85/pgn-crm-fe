import { Fragment, useState } from "react";
import { Col, Divider, Row, Space } from "antd";
import HeaderText from "./components/HeaderText";
import HeadersTabs from "./components/HeadersTabs";
import FilterButton from "./components/FilterButton";
import ExportButton from "./components/ExportButton";
import { TablePaginationNew } from "poc-table-dragandrop";
import promoCriteriaRepository from "./repository/promoCriteriaRepository";
import promoConditionRepository from "./repository/promoConditionRepository";
import ModalCustomPromo from "./components/ModalCustomPromo";

const HeaderCriteriaAndCondition = ({ selectedTab, onChangeTab }) => {
  return (
    <HeadersTabs
      keys={[
        { label: "CRITERIA", value: "criteria" },
        { label: "CONDITIONS", value: "conditions" },
      ]}
      selectedTab={selectedTab}
      onChangeTab={onChangeTab}
      isModal={true}
    />
  );
};

const selectedRender = (selectedTab, handleClickDetail, setDetailData) => {
  switch (selectedTab) {
    case "criteria":
      return (
        <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
          <Row align={"middle"}>
            <Col span={3}>
              <HeaderText text="Criteria List" />
            </Col>
          </Row>
          <div className="flex justify-between">
            <FilterButton />
            <ExportButton />
          </div>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <TablePaginationNew
              enableDragColumn={true}
              enableColumnSorter={true}
              enableColumnFilter={true}
              freezeColumns={[{ key: "action", position: "right" }]}
              tableScrolled={{ x: 800 }}
              columns={promoCriteriaRepository.getColumns(
                handleClickDetail,
                setDetailData,
              )}
              dataSource={promoCriteriaRepository.getPromoCriteriaList()}
            />
          </div>
        </Space>
      );
    case "conditions":
      return (
        <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
          <Row align={"middle"}>
            <Col span={3}>
              <HeaderText text="Criteria List" />
            </Col>
          </Row>
          <div className="flex justify-between">
            <FilterButton />
            <ExportButton />
          </div>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <TablePaginationNew
              enableDragColumn={true}
              enableColumnSorter={true}
              enableColumnFilter={true}
              freezeColumns={[{ key: "action", position: "right" }]}
              tableScrolled={{ x: 800 }}
              columns={promoConditionRepository.getColumns(
                handleClickDetail,
                setDetailData,
              )}
              dataSource={promoConditionRepository.getPromoConditionList()}
            />
          </div>
        </Space>
      );
    default:
      return null;
  }
};

const selectedModalDetailRender = ({
  selectedTab,
  detailData,
  isModalVisible,
  setIsModalVisible,
  onCancel,
}) => {
  switch (selectedTab) {
    case "criteria":
      return (
        <ModalCustomPromo
          title="Detail Criteria"
          isOpen={isModalVisible}
          setIsOpen={setIsModalVisible}
          onCancel={onCancel}
        >
          <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
            <HeaderText text="Criteria Information" />
            <Row>
              <Col span={8}>
                {renderLabelDataValue("Service Type", detailData?.serviceType)}
              </Col>
              <Col span={8}>
                {renderLabelDataValue(
                  "Customer Segment",
                  detailData?.customerSegment,
                )}
              </Col>
              <Col span={8}>
                {renderLabelDataValue(
                  "Account Group",
                  detailData?.accountGroup,
                )}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                {renderLabelDataValue(
                  "Adjustment Type",
                  detailData?.adjustmentType,
                )}
              </Col>
              <Col span={8}>
                {renderLabelDataValue(
                  "Adjustment Value",
                  detailData?.adjustmentValue,
                )}
              </Col>
              <Col span={8}>{renderLabelDataValue("UOM", detailData?.uom)}</Col>
            </Row>
          </Space>
        </ModalCustomPromo>
      );
    case "conditions":
      return (
        <ModalCustomPromo
          title="Detail Condition"
          isOpen={isModalVisible}
          setIsOpen={setIsModalVisible}
          onCancel={onCancel}
        >
          <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
            <HeaderText text="Condition Information" />
            <Row>
              <Col span={8}>
                {renderLabelDataValue("Name", detailData?.name)}
              </Col>
              <Col span={8}>
                {renderLabelDataValue("Operator", detailData?.operator)}
              </Col>
              <Col span={8}>
                {renderLabelDataValue("Data Type", detailData?.dataType)}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                {renderLabelDataValue("Value", detailData?.value)}
              </Col>
              <Col span={8}>
                {renderLabelDataValue("Start Date", detailData?.startDate)}
              </Col>
              <Col span={8}>
                {renderLabelDataValue("End Date", detailData?.endDate)}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {renderLabelDataValue("Description", detailData?.description)}
              </Col>
            </Row>
          </Space>
        </ModalCustomPromo>
      );
    default:
      return "";
  }
};

const renderLabelDataValue = (label, value) => {
  return (
    <Space direction="vertical" size={"small"}>
      <strong>{label}</strong>
      <span>{value}</span>
    </Space>
  );
};

const CriteriaAndCondition = ({
  isVisible,
  setIsVisible,
  selectedTab,
  setSelectedTab,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const onChangeTab = (value) => {
    setSelectedTab(value);
  };

  const handleClickDetail = () => {
    setIsModalVisible(true);
    setIsVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
    setIsVisible(true);
  };

  return (
    <Fragment>
      <HeaderCriteriaAndCondition
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
      />
      <Divider style={{ margin: "1.5rem 0" }} />
      {selectedRender(selectedTab, handleClickDetail, setDetailData)}
      {selectedModalDetailRender({
        selectedTab,
        detailData,
        isModalVisible,
        setIsModalVisible,
        onCancel,
      })}
    </Fragment>
  );
};

export default CriteriaAndCondition;
