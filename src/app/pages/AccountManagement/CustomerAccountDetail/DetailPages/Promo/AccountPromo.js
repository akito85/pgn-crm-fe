import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Badge, Col, Collapse, Divider, Row, Space } from "antd";
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
import moment from "moment";
import { UnorderedListOutlined } from "@ant-design/icons";

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
    validPromoDetail,
    loadValidPromoList,
    loadValidPromoDetail,
    downloadValidPromo,
    clearValidPromo,
  } = usePromo();

  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Handle view detail - fetch detail from API
  const handleViewDetail = (record) => {
    if (record?.id) {
      loadValidPromoDetail(record.id);
    }
  };

  // Get columns from repository
  const columns = promoRepository.getColumns(handleViewDetail);

  useEffect(() => {
    // Load promo list on mount with accountId
    if (accountId) {
      loadValidPromoList({ page: 1, size: 10, accountId, sort: 'id~desc' });
    }
  }, [accountId, loadValidPromoList]);

  useEffect(() => {

    // Transform API response using helper
    if (validPromoList?.data && !validPromoList.loading) {

      const { dataSource: transformedData, pagination: paginationData } =
        transformValidPromoResponse(validPromoList.data);

      setDataSource(transformedData);
      setPagination(paginationData);
    } else if (validPromoList && !validPromoList.loading && !validPromoList.data) {
      // Reset when no data but not loading
      // console.log('Resetting dataSource - no data');
      setDataSource([]);
    }
  }, [validPromoList]);

  // Update detail promo data when validPromoDetail changes and open modal
  useEffect(() => {
    if (validPromoDetail?.data?.data && !validPromoDetail.loading) {
      setDetailPromoData(validPromoDetail.data.data);  // Access nested data
      // Open modal only after data is loaded
      setIsModalPromoVisible(true);
    }
  }, [validPromoDetail, setDetailPromoData, setIsModalPromoVisible]);

  // Clear detail state when modal is closed
  useEffect(() => {
    if (!isModalPromoVisible) {
      clearValidPromo();
      setDetailPromoData({});
    }
  }, [isModalPromoVisible, clearValidPromo, setDetailPromoData]);

  // Clear detail state when component unmounts (tab switch)
  useEffect(() => {
    return () => {
      clearValidPromo();
      setDetailPromoData({});
    };
  }, [clearValidPromo, setDetailPromoData]);

  const handleDownload = async () => {
    if (accountId) {
      try {
        const params = {
          page: pagination.current,
          size: pagination.pageSize,
          accountId: accountId,
        };

        const advancedSearch = {
          inputFields: activeFilters.map(q => ({
            condition: q.condition || "",
            column: q.column || "",
            operator: q.operator || "",
            value: q.value || ""
          }))
        };

        await downloadValidPromo(params, advancedSearch);
      } catch (error) {
        console.error('Download failed:', error);
      }
    } else {
      console.warn('Cannot download: accountId is missing');
    }
  };

  const handleTableChange = (current, pageSize) => {
    if (accountId) {
      const advancedSearch = {
        inputFields: activeFilters.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };
      // API uses 1-based page index (same as PaymentRelation)
      loadValidPromoList({
        page: current,
        size: pageSize,
        accountId,
        sort: 'id~desc'
      }, advancedSearch);
    }
  };

  const handleFilterPromo = (queries) => {
    console.log('handleFilterPromo called with queries:', queries);
    // Save active filters to state
    setActiveFilters(queries || []);

    if (accountId) {
      // Transform queries to advanced search format
      const advancedSearch = {
        inputFields: queries.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };

      console.log('Calling loadValidPromoList with advancedSearch:', advancedSearch);

      loadValidPromoList(
        {
          page: 1,
          size: pagination.pageSize,
          accountId,
          sort: 'id~desc'
        },
        advancedSearch
      );
    } else {
      console.warn('handleFilterPromo: accountId is missing');
    }
  };

  return (
    <Fragment>
      <Row align={"middle"} style={{ marginBottom: "1rem" }}>
        <Col span={4}>
          <HeaderText text="PROMO LIST" />
        </Col>
      </Row>
      <Row align={"middle"} justify={"space-between"} style={{ marginBottom: "1.5rem" }}>
        <Col>
          <Badge count={activeFilters.length}>
            <FilterButton
              columnType="promo"
              onApplyFilter={handleFilterPromo}
              activeFilters={activeFilters}
            />
          </Badge>
        </Col>
        <Col>
          <ExportButton onClick={handleDownload} />
        </Col>
      </Row>
      
      <div style={{ width: "100%", overflowX: "auto", marginTop: "1.5rem" }}>
        <TablePaginationNew
          enableDragColumn={true}
          enableColumnSorter={dataSource.length > 0}
          enableColumnFilter={dataSource.length > 0}
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
  isModalHistoryDetailVisible,
  setIsModalHistoryVisible,
  setIsModalHistoryDetailVisible,
  setDetailHistoryData,
  setDetailDetailHistoryData,
  customerId,
  accountId,
}) => {
  const {
    promoHistoryList,
    promoHistoryDetail,
    promoHistoryDetailDetail,
    loadPromoHistoryList,
    loadPromoHistoryDetail,
    loadPromoHistoryDetailDetail,
    downloadPromoHistory,
    clearPromoHistory,
    clearDetailOfPromoHistory,
  } = usePromo();

  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Handle view detail - fetch detail from API
  const handleViewDetail = (record) => {
    if (record?.billingCode) {
      console.log('Fetching detail for billing code:', record.billingCode, 'accountId:', accountId);
      loadPromoHistoryDetail(record.billingCode, accountId);
    }
  };

  // Get columns from repository
  const columns = promoHistoryRepository.getColumns(handleViewDetail);

  useEffect(() => {
    // Load promo history on mount with customerId
    if (accountId) {
      loadPromoHistoryList({ page: 1, size: 10, accountId, sort: 'id~desc' });
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

  // Update detail history data when promoHistoryDetail changes and open modal
  useEffect(() => {
    if (promoHistoryDetail?.data?.data && !promoHistoryDetail.loading) {
      console.log('Setting detail history data:', promoHistoryDetail.data.data);
      setDetailHistoryData(promoHistoryDetail.data.data);
      // Open modal only after data is loaded
      setIsModalHistoryVisible(true);
    }
  }, [promoHistoryDetail, setDetailHistoryData, setIsModalHistoryVisible]);

  // Update detail of history data detail when promoHistoryDetailDetail changes and open modal
  useEffect(() => {
    if (promoHistoryDetailDetail?.data?.data && !promoHistoryDetailDetail.loading) {
      setDetailDetailHistoryData(promoHistoryDetailDetail.data.data);
      // Open modal only after data is loaded
      setIsModalHistoryDetailVisible(true);
    }
  }, [promoHistoryDetailDetail, setDetailHistoryData, setIsModalHistoryDetailVisible]);

  // Clear detail state when modal is closed
  useEffect(() => {
    if (!isModalHistoryVisible) {
      clearPromoHistory();
      setDetailHistoryData({});
    }
  }, [isModalHistoryVisible, clearPromoHistory, setDetailHistoryData]);

  // Clear detail detail state when modal is closed
  useEffect(() => {
    if (!isModalHistoryDetailVisible) {
      clearDetailOfPromoHistory();
      setDetailDetailHistoryData({});
    }
  }, [isModalHistoryDetailVisible, clearDetailOfPromoHistory, setDetailDetailHistoryData]);

  // Clear detail state when component unmounts (tab switch)
  useEffect(() => {
    return () => {
      clearPromoHistory();
      setDetailHistoryData({});
    };
  }, [clearPromoHistory, setDetailHistoryData]);

  // Clear detail detail state when component unmounts (tab switch)
  useEffect(() => {
    return () => {
      clearDetailOfPromoHistory();
      setDetailDetailHistoryData({});
    };
  }, [clearDetailOfPromoHistory, setDetailDetailHistoryData]);

  const handleDownload = async () => {
    if (accountId) {
      try {
        const params = {
          page: pagination.current,
          size: pagination.pageSize,
          accountId: accountId,
        };

        const advancedSearch = {
          inputFields: activeFilters.map(q => ({
            condition: q.condition || "",
            column: q.column || "",
            operator: q.operator || "",
            value: q.value || ""
          }))
        };

        await downloadPromoHistory(params, advancedSearch);
      } catch (error) {
        console.error('Download failed:', error);
      }
    } else {
      console.warn('Cannot download: accountId is missing');
    }
  };

  const handleTableChange = (current, pageSize) => {
    if (accountId) {
      const advancedSearch = {
        inputFields: activeFilters.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };
      loadPromoHistoryList({
        page: current,
        size: pageSize,
        accountId,
        sort: 'id~desc'
      }, advancedSearch);
    }
  };

  const handleFilterPromoHistory = (queries) => {
    console.log('handleFilterPromoHistory called with queries:', queries);
    // Save active filters to state
    setActiveFilters(queries || []);

    if (accountId) {
      // Transform queries to advanced search format
      const advancedSearch = {
        inputFields: queries.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };

      console.log('Calling loadPromoHistoryList with advancedSearch:', advancedSearch);

      loadPromoHistoryList(
        {
          page: 1,
          size: pagination.pageSize,
          accountId,
          sort: 'id~desc'
        },
        advancedSearch
      );
    } else {
      console.warn('handleFilterPromoHistory: accountId is missing');
    }
  };

  // Handle view detail detail - fetch detail detail from API
  const handleViewDetailDetail = (record, detailRecord) => {
    if (record?.billingCode, detailRecord?.id) {
      console.log('Fetching detail for billing code:', record.billingCode, 'accountId:', accountId);
      loadPromoHistoryDetailDetail(record.billingCode, detailRecord.id, accountId);
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
        width: 200,
        ellipsis: true,
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
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 80,
        fixed: 'right',
        render: (_, detailRecord) => (
          <Col span={24} className="text-center">
            <UnorderedListOutlined
              style={{ cursor: "pointer" }}
              onClick={() => handleViewDetailDetail(record, detailRecord)}
            />
          </Col>
        ),
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
      <Row align={"middle"} justify={"space-between"} style={{ marginBottom: "1.5rem" }}>
        <Col>
          <Badge count={activeFilters.length}>
            <FilterButton
              columnType="history"
              onApplyFilter={handleFilterPromoHistory}
              activeFilters={activeFilters}
            />
          </Badge>
        </Col>
        <Col>
          <ExportButton onClick={handleDownload} />
        </Col>
      </Row>

      <div style={{ width: "100%", overflowX: "auto", marginTop: "1.5rem" }}>
        <TablePaginationNew
          enableDragColumn={true}
          enableColumnSorter={dataSource.length > 0}
          enableColumnFilter={dataSource.length > 0}
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
  isModalHistoryDetailVisible,
  setIsModalHistoryVisible,
  setIsModalHistoryDetailVisible,
  setDetailHistoryData,
  setDetailDetailHistoryData,
  customerId,
  accountId,
}) => {
  if (tab === "promoHistory") {
    return (
      <PromoHistoryViewData
        isModalHistoryVisible={isModalHistoryVisible}
        isModalHistoryDetailVisible={isModalHistoryDetailVisible}
        setIsModalHistoryVisible={setIsModalHistoryVisible}
        setIsModalHistoryDetailVisible={setIsModalHistoryDetailVisible}
        setDetailHistoryData={setDetailHistoryData}
        setDetailDetailHistoryData={setDetailDetailHistoryData}
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
const formatDate = (dateString) => {
  if (!dateString) return "";
  // Format from "2025-12-05" or "2025-12-05T04:47:09.210+00:00" to "05 Dec 2025"
  return moment(dateString).format("DD MMM YYYY");
};

const renderLabelDataValue = (label, value) => {
  return (
    <Space direction="vertical" size={"small"}>
      <strong>{label}</strong>
      <span>{value || ""}</span>
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
  isModalHistoryDetailVisible,
  setIsModalHistoryVisible,
  setIsModalHistoryDetailVisible,
  detailHistoryData,
  detailDetailHistoryData,
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
              defaultActiveKey={["general"]}
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
                      {renderLabelDataValue("Promotion Type", detailPromoData?.promotionTypeName)}
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
                        detailPromoData?.criterias,
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "Start Date",
                        formatDate(detailPromoData?.startDate),
                      )}
                    </Col>
                    <Col span={8}>
                      {renderLabelDataValue(
                        "End Date",
                        formatDate(detailPromoData?.endDate),
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
                  promoId={detailPromoData?.id}
                />
              </Collapse.Panel>
            </Collapse>
            <HistoryLogInformation
              data={detailPromoData}
            />
          </Space>
        </ModalCustomPromo>
      );
    case "promoHistory":
      // Define columns for detail table
      const historyDetailColumns = [
        {
          title: "NO",
          dataIndex: "no",
          key: "no",
          width: 60,
          render: (_, __, index) => index + 1,
        },
        {
          title: "BILLING DATE",
          dataIndex: "billingDate",
          key: "billingDate",
          width: 120,
        },
        {
          title: "NAME",
          dataIndex: "name",
          key: "name",
          width: 150,
        },
        {
          title: "PROMOTION TYPE",
          dataIndex: "promotionType",
          key: "promotionType",
          width: 150,
        },
        {
          title: "TYPE",
          dataIndex: "type",
          key: "type",
          width: 150,
        },
        {
          title: "CATEGORY",
          dataIndex: "category",
          key: "category",
          width: 130,
        },
        {
          title: "CRITERIA",
          dataIndex: "criteria",
          key: "criteria",
          width: 200,
          ellipsis: true,
        },
        {
          title: "DESCRIPTION",
          dataIndex: "description",
          key: "description",
          width: 200,
          ellipsis: true,
        },
      ];

      return (
        <>
          <ModalCustomPromo
            title={"DETAIL PROMO HISTORY"}
            isOpen={isModalHistoryVisible}
            setIsOpen={setIsModalHistoryVisible}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {/* Basic Information Section */}
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    {renderLabelDataValue("Billing No.", detailHistoryData?.billingCode)}
                  </Col>
                  <Col span={8}>
                    {renderLabelDataValue("Billing Period", detailHistoryData?.billingPeriod)}
                  </Col>
                  <Col span={8}>
                    {renderLabelDataValue("Billing Cycle", detailHistoryData?.billingCycle)}
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                  <Col span={8}>
                    {renderLabelDataValue("Promo Applied", detailHistoryData?.promosApplied)}
                  </Col>
                </Row>
              </div>

              {/* Promo History Detail Table */}
              <div>
                <p className="text-primary text-xs font-bold uppercase mb-2">
                  PROMO HISTORY DETAIL
                </p>
                <TablePaginationNew
                  enableDragColumn={true}
                  enableColumnSorter={true}
                  enableColumnFilter={true}
                  dataSource={detailHistoryData?.details || []}
                  columns={historyDetailColumns}
                  tableScrolled={{
                    x: 1200,
                  }}
                  useSelect={false}
                  usePagination={false}
                />
              </div>

              {/* History Log Information */}
              <HistoryLogInformation
                data={detailHistoryData?.historyLog}
              />
            </Space>
          </ModalCustomPromo>

          <ModalCustomPromo
            title={"DETAIL OF PROMO HISTORY DETAIL"}
            isOpen={isModalHistoryVisible}
            setIsOpen={setIsModalHistoryVisible}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {/* Basic Information Section */}
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    {renderLabelDataValue("Billing Date", detailDetailHistoryData?.billingDate)}
                  </Col>
                  <Col span={8}>
                    {renderLabelDataValue("Name", detailDetailHistoryData?.name)}
                  </Col>
                  <Col span={8}>
                    {renderLabelDataValue("Promotion Type", detailDetailHistoryData?.promotionType)}
                  </Col>
                  <Col span={8}>
                    {renderLabelDataValue("Type", detailDetailHistoryData?.type)}
                  </Col>
                  <Col span={8}>
                    {renderLabelDataValue("Category", detailDetailHistoryData?.category)}
                  </Col>
                  <Col span={8}>
                    {renderLabelDataValue("Criteria", detailDetailHistoryData?.criteria)}
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                  <Col span={8}>
                    {renderLabelDataValue("Description", detailDetailHistoryData?.description)}
                  </Col>
                </Row>
              </div>

              {/* History Log Information */}
              <HistoryLogInformation
                data={detailDetailHistoryData?.historyLog}
              />
            </Space>
          </ModalCustomPromo>
        </>
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
  const [isModalHistoryDetailVisible, setIsModalHistoryDetailVisible] = useState(false);
  const [detailHistoryData, setDetailHistoryData] = useState({});
  const [detailDetailHistoryData, setDetailDetailHistoryData] = useState({});
  const [onChangeDetailPromo, setOnChangeDetailPromo] = useState("criteria");
  const [onChangeDetailHistory, setOnChangeDetailHistory] = useState("promoHistoryInformation");
  const isPromoHistory = selectedTab === "promoHistory";

  const onChangeTab = (tab) => {
    setSelectedTab(tab);
  };

  // Debug log
  // useEffect(() => {
  //   console.log('Customer ID from route:', idCustomer);
  // }, [idCustomer]);

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
              isModalHistoryDetailVisible,
              setIsModalHistoryVisible,
              setIsModalHistoryDetailVisible,
              setDetailHistoryData,
              setDetailDetailHistoryData,
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
        isModalHistoryDetailVisible,
        setIsModalHistoryVisible,
        setIsModalHistoryDetailVisible,
        detailHistoryData,
        detailDetailHistoryData,
        onChangeDetailPromo,
        setOnChangeDetailPromo,
        onChangeDetailHistory,
        setOnChangeDetailHistory,
      })}
    </Fragment>
  );
};

export default AccountPromo;
