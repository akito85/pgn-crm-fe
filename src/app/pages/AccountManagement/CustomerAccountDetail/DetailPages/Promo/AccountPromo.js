import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Col, Collapse, Divider, Row, Space } from "antd";
import { TablePaginationNew } from "poc-table-dragandrop";
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
import ExportButton from "./components/ExportButton";
import { usePromo } from "./hooks/usePromo";
import { transformValidPromoResponse } from "./utils/promoHelpers";

const HeaderAccountPromo = ({ onChangeTab, isPromoHistory }) => {
  const keys = [
    { label: "Promo", value: "promo" },
    { label: "Promo History", value: "promoHistory" },
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
  customerId,
}) => {
  const {
    validPromoList,
    loadValidPromoList,
    downloadValidPromo,
  } = usePromo();

  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Get columns from repository
  const columns = promoRepository.getColumns(setIsModalPromoVisible, setDetailPromoData);

  useEffect(() => {
    // Load promo list on mount with customerId
    if (customerId) {
      loadValidPromoList({ page: 0, size: 10, customerId });
    }
  }, [customerId, loadValidPromoList]);

  useEffect(() => {
    console.log('=== VALID PROMO LIST DEBUG ===');
    console.log('validPromoList full:', validPromoList);
    console.log('validPromoList.data:', validPromoList?.data);
    console.log('validPromoList.loading:', validPromoList?.loading);
    
    // Transform API response using helper
    if (validPromoList?.data && !validPromoList.loading) {
      console.log('Attempting transform with data:', validPromoList.data);
      
      const { dataSource: transformedData, pagination: paginationData } = 
        transformValidPromoResponse(validPromoList.data);
      
      console.log('Transformed dataSource:', transformedData);
      console.log('Transformed dataSource length:', transformedData?.length);
      console.log('Pagination:', paginationData);
      
      setDataSource(transformedData);
      setPagination(paginationData);
    } else if (validPromoList && !validPromoList.loading && !validPromoList.data) {
      // Reset when no data but not loading
      console.log('Resetting dataSource - no data');
      setDataSource([]);
    }
  }, [validPromoList]);

  const handleDownload = () => {
    if (customerId) {
      downloadValidPromo({ page: 0, size: 10, customerId });
    }
  };

  const handleTableChange = (paginationParams) => {
    const { current, pageSize } = paginationParams;
    
    if (customerId) {
      // API uses 0-based page index
      loadValidPromoList({ 
        page: current - 1, 
        size: pageSize, 
        customerId 
      });
    }
  };

  return (
    <Fragment>
      <Row align={"middle"} style={{ marginBottom: "1rem" }}>
        <Col span={4}>
          <HeaderText text="PROMO LIST" />
        </Col>
      </Row>
      <Row align={"middle"}>
        <Col span={3} offset={0} style={{ textAlign: "center" }}>
          <FilterButton />
        </Col>
        <Col span={3} offset={18} style={{ textAlign: "center" }}>
          <ExportButton onClick={handleDownload} />
        </Col>
      </Row>
      
      <div style={{ width: "100%", overflowX: "auto", marginTop: "1.5rem" }}>
        <TablePaginationNew
          enableDragColumn={true}
          enableColumnSorter={dataSource.length > 0}
          enableColumnFilter={dataSource.length > 0}
          freezeColumns={[{ key: "action", position: "right" }]}
          tableScrolled={{ x: 800 }}
          columns={columns}
          dataSource={dataSource}
          loading={validPromoList?.loading}
          pagination={pagination}
          onChange={handleTableChange}
          totalData={pagination.total}
        />
      </div>
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

      <div style={{ width: "100%", overflowX: "auto" }}>
        <TablePaginationNew
          enableDragColumn={true}
          enableColumnSorter={true}
          enableColumnFilter={true}
          freezeColumns={[{ key: "action", position: "right" }]}
          tableScrolled={{ x: 800 }}
          columns={promoHistoryRepository.getColumns(
            setIsModalHistoryVisible,
            setDetailHistoryData,
          )}
          dataSource={promoHistoryRepository.getPromoHistoryList()}
        />
      </div>
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
  customerId,
}) => {
  if (tab === "promoHistory") {
    return (
      <PromoHistoryViewData
        isModalHistoryVisible={isModalHistoryVisible}
        setIsModalHistoryVisible={setIsModalHistoryVisible}
        setDetailHistoryData={setDetailHistoryData}
        customerId={customerId}
      />
    );
  }
  return (
    <PromoViewData
      isModalPromoVisible={isModalPromoVisible}
      setIsModalPromoVisible={setIsModalPromoVisible}
      setDetailPromoData={setDetailPromoData}
      customerId={customerId}
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
  detailPromoData,
  selectedTabCriteriaAndCondition,
  setSelectedTabCriteriaAndCondition,
  isModalHistoryVisible,
  setIsModalHistoryVisible,
  detailHistoryData,
  onChangeDetailPromo,
  setOnChangeDetailPromo,
  onChangeDetailHistory,
  setOnChangeDetailHistory,
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
  // Get customerId from route state
  const location = useLocation();
  const { idCustomer } = location.state || {};

  const [selectedTab, setSelectedTab] = useState("promo");
  const [selectedTabCriteriaAndCondition, setSelectedTabCriteriaAndCondition] =
    useState("criteria");

  const [isModalPromoVisible, setIsModalPromoVisible] = useState(false);
  const [detailPromoData, setDetailPromoData] = useState({});
  const [isModalHistoryVisible, setIsModalHistoryVisible] = useState(false);
  const [detailHistoryData, setDetailHistoryData] = useState({});
  const [onChangeDetailPromo, setOnChangeDetailPromo] = useState("criteria");
  const [onChangeDetailHistory, setOnChangeDetailHistory] = useState("promoHistoryInformation");
  const isPromoHistory = selectedTab === "promoHistory";

  const onChangeTab = (tab) => {
    setSelectedTab(tab);
  };

  // Debug log
  useEffect(() => {
    console.log('Customer ID from route:', idCustomer);
  }, [idCustomer]);

  return (
    <Fragment>
      <HeaderAccountPromo
        onChangeTab={onChangeTab}
        isPromoHistory={isPromoHistory}
      />
      <ContainerWithTab
      marginTop="0px"
        children={
          <Fragment>
            {selectedRender({
              tab: selectedTab,
              isModalPromoVisible,
              setIsModalPromoVisible,
              setDetailPromoData,
              isModalHistoryVisible,
              setIsModalHistoryVisible,
              setDetailHistoryData,
              customerId: idCustomer,
            })}
          </Fragment>
        }
      ></ContainerWithTab>
      {renderModalAccountPromo({
        tab: selectedTab,
        isModalPromoVisible,
        setIsModalPromoVisible,
        detailPromoData,
        selectedTabCriteriaAndCondition,
        setSelectedTabCriteriaAndCondition,
        isModalHistoryVisible,
        setIsModalHistoryVisible,
        detailHistoryData,
        onChangeDetailPromo,
        setOnChangeDetailPromo,
        onChangeDetailHistory,
        setOnChangeDetailHistory,
      })}
    </Fragment>
  );
};

export default AccountPromo;
