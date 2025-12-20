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
import { transformValidPromoResponse, transformPromoHistoryResponse } from "./utils/promoHelpers";

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
      isPromo
    />
  );
};

const PromoViewData = ({
  isModalPromoVisible,
  setIsModalPromoVisible,
  setDetailPromoData,
  customerId,
  accountId,
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
    // Load promo list on mount with accountId
    if (accountId) {
      loadValidPromoList({ page: 0, size: 10, accountId, sort: 'id~desc' });
    }
  }, [accountId, loadValidPromoList]);

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

  const handleDownload = async () => {
    if (customerId) {
      try {
        console.log('Starting download...');
        // Download with same params as current table state
        const params = {
          page: pagination.current - 1, // Convert to 0-based for API
          size: pagination.pageSize,
          customerId: customerId,
        };
        
        console.log('Download params:', params);
        await downloadValidPromo(params);
        console.log('Download completed');
      } catch (error) {
        console.error('Download failed:', error);
      }
    } else {
      console.warn('Cannot download: customerId is missing');
    }
  };

  const handleTableChange = (paginationParams) => {
    const { current, pageSize } = paginationParams;
    
    if (customerId) {
      // API uses 0-based page index
      loadValidPromoList({ 
        page: current - 1, 
        size: pageSize, 
        customerId,
        sort: 'id~desc'
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
          <FilterButton 
            columnType="promo"
            onApplyFilter={(queries) => {
              console.log('Apply filter with queries:', queries);
              // TODO: Implement filter logic
            }}
          />
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
  customerId,
  accountId,
}) => {
  const {
    promoHistoryList,
    loadPromoHistoryList,
    downloadPromoHistory,
  } = usePromo();

  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Get columns from repository
  const columns = promoHistoryRepository.getColumns(setIsModalHistoryVisible, setDetailHistoryData);

  useEffect(() => {
    // Load promo history on mount with customerId
    if (accountId) {
      loadPromoHistoryList({ page: 0, size: 10, accountId, sort: 'id~desc' });
    }
  }, [accountId, loadPromoHistoryList]);

  useEffect(() => {
    // Transform API response using helper
    if (promoHistoryList?.data && !promoHistoryList.loading) {
      const { dataSource: transformedData, pagination: paginationData } = 
        transformPromoHistoryResponse(promoHistoryList.data);
      
      setDataSource(transformedData);
      setPagination(paginationData);
    } else if (promoHistoryList && !promoHistoryList.loading && !promoHistoryList.data) {
      setDataSource([]);
    }
  }, [promoHistoryList]);

  const handleDownload = async () => {
    if (customerId) {
      try {
        const params = {
          page: pagination.current - 1,
          size: pagination.pageSize,
          customerId: customerId,
        };
        
        await downloadPromoHistory(params);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const handleTableChange = (paginationParams) => {
    const { current, pageSize } = paginationParams;
    
    if (customerId) {
      loadPromoHistoryList({ 
        page: current - 1, 
        size: pageSize, 
        customerId,
        sort: 'id~desc'
      });
    }
  };

  const expandedRowRender = (record) => {
    const detailColumns = [
      {
        title: "No",
        dataIndex: "id",
        key: "id",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 200,
      },
      {
        title: "Promotion Type",
        dataIndex: "promotionType",
        key: "promotionType",
        width: 130,
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 130,
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        width: 130,
      },
      {
        title: "Criteria",
        dataIndex: "criteria",
        key: "criteria",
        width: 150,
      },
      {
        title: "Billing Date",
        dataIndex: "billingDate",
        key: "billingDate",
        width: 120,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 200,
      },
    ];

    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase mb-2 mt-4">
          PROMO HISTORY DETAILS
        </p>
        <TablePaginationNew
          enableDragColumn={true}
          enableColumnSorter={true}
          enableColumnFilter={true}
          dataSource={record.details || []}
          columns={detailColumns}
          tableScrolled={{
            x: 1000,
          }}
          useSelect={false}
          usePagination={false}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Row align={"middle"} style={{ marginBottom: "1rem" }}>
        <Col span={4}>
          <HeaderText text="PROMO HISTORY" />
        </Col>
      </Row>
      <Row align={"middle"}>
        <Col span={3} offset={0} style={{ textAlign: "center" }}>
          <FilterButton 
            columnType="history"
            onApplyFilter={(queries) => {
              console.log('Apply filter with queries:', queries);
              // TODO: Implement filter logic
            }}
          />
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
          freezeColumns={[
            { key: "no", position: "left" },
            { key: "action", position: "right" }
          ]}
          tableScrolled={{ x: 800 }}
          columns={columns}
          dataSource={dataSource}
          loading={promoHistoryList?.loading}
          pagination={pagination}
          onChange={handleTableChange}
          totalData={pagination.total}
          expandable={{ expandedRowRender }}
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
  accountId,
}) => {
  if (tab === "promoHistory") {
    return (
      <PromoHistoryViewData
        isModalHistoryVisible={isModalHistoryVisible}
        setIsModalHistoryVisible={setIsModalHistoryVisible}
        setDetailHistoryData={setDetailHistoryData}
        customerId={customerId}
        accountId={accountId}
      />
    );
  }
  return (
    <PromoViewData
      isModalPromoVisible={isModalPromoVisible}
      setIsModalPromoVisible={setIsModalPromoVisible}
      setDetailPromoData={setDetailPromoData}
      customerId={customerId}
      accountId={accountId}
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
                      {renderLabelDataValue("Promotion Type", detailPromoData?.promotionType)}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue("Type", detailPromoData?.typeName)}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Category",
                        detailPromoData?.categoryName,
                      )}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Criteria",
                        detailPromoData?.criteriaName,
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

const AccountPromo = ({ id }) => {
  // Get customerId from route state
  const location = useLocation();
  const { idCustomer } =  location.state || {};

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
              accountId: id,
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
