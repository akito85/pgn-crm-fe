import { Fragment, useState, useEffect } from "react";
import { Badge, Col, Divider, Row, Space } from "antd";
import HeaderText from "./components/HeaderText";
import HeadersTabs from "./components/HeadersTabs";
import FilterButton from "./components/FilterButton";
import ExportButton from "./components/ExportButton";
import { TablePaginationNew } from "poc-table-dragandrop";
import promoCriteriaRepository from "./repository/promoCriteriaRepository";
import promoConditionRepository from "./repository/promoConditionRepository";
import ModalCustomPromo from "./components/ModalCustomPromo";
import HistoryLogInformation from "./HistoryLogInformation";
import { usePromo } from "./hooks/usePromo";

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

const selectedRender = ({
  selectedTab,
  handleClickCriteriaDetail,
  handleClickConditionDetail,
  criteriaDataSource,
  conditionDataSource,
  promoCriteriaList,
  promoConditionList,
  criteriaPagination,
  conditionPagination,
  handleCriteriaTableChange,
  handleConditionTableChange,
  handleDownloadCriteria,
  handleDownloadCondition,
  handleFilterCriteria,
  handleFilterCondition,
  criteriaActiveFilters,
  conditionActiveFilters,
}) => {
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
            <Badge count={criteriaActiveFilters.length}>
              <FilterButton onApplyFilter={handleFilterCriteria} columnType="criteria" activeFilters={criteriaActiveFilters} />
            </Badge>
            <ExportButton onClick={handleDownloadCriteria} />
          </div>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <TablePaginationNew
              enableDragColumn={true}
              enableColumnSorter={criteriaDataSource.length > 0}
              enableColumnFilter={criteriaDataSource.length > 0}
              tableScrolled={{ x: 800 }}
              columns={promoCriteriaRepository.getColumns(handleClickCriteriaDetail)}
              dataSource={criteriaDataSource}
              loading={promoCriteriaList?.loading}
              pagination={criteriaPagination}
              onChange={handleCriteriaTableChange}
              totalData={criteriaPagination.total}
            />
          </div>
        </Space>
      );
    case "conditions":
      return (
        <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
          <Row align={"middle"}>
            <Col span={3}>
              <HeaderText text="Condition List" />
            </Col>
          </Row>
          <div className="flex justify-between">
            <Badge count={conditionActiveFilters.length}>
              <FilterButton onApplyFilter={handleFilterCondition} columnType="condition" activeFilters={conditionActiveFilters} />
            </Badge>
            <ExportButton onClick={handleDownloadCondition} />
          </div>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <TablePaginationNew
              enableDragColumn={true}
              enableColumnSorter={conditionDataSource.length > 0}
              enableColumnFilter={conditionDataSource.length > 0}
              freezeColumns={[{ key: "action", position: "right" }]}
              tableScrolled={{ x: 800 }}
              columns={promoConditionRepository.getColumns(handleClickConditionDetail)}
              dataSource={conditionDataSource}
              loading={promoConditionList?.loading}
              pagination={conditionPagination}
              onChange={handleConditionTableChange}
              totalData={conditionPagination.total}
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
          width={1200}
        >
          <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
            <HeaderText text="CRITERIA INFORMATION" />
            <Row gutter={[16, 16]}>
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
            <Row gutter={[16, 16]}>
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
            <Divider style={{ margin: "1rem 0" }} />
            <HistoryLogInformation data={detailData} />
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
          width={1200}
        >
          <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
            <HeaderText text="CONDITION INFORMATION" />
            <Row gutter={[16, 16]}>
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
            <Row gutter={[16, 16]}>
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
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {renderLabelDataValue("Description", detailData?.description)}
              </Col>
            </Row>
            <Divider style={{ margin: "1rem 0" }} />
            <HistoryLogInformation data={detailData} />
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
  promoId,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [criteriaDataSource, setCriteriaDataSource] = useState([]);
  const [conditionDataSource, setConditionDataSource] = useState([]);
  const [criteriaActiveFilters, setCriteriaActiveFilters] = useState([]);
  const [conditionActiveFilters, setConditionActiveFilters] = useState([]);
  const [criteriaPagination, setCriteriaPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [conditionPagination, setConditionPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const {
    promoCriteriaList,
    promoCriteriaDetail,
    promoConditionList,
    promoConditionDetail,
    loadPromoCriteriaList,
    loadPromoCriteriaDetail,
    loadPromoConditionList,
    loadPromoConditionDetail,
    downloadPromoCriteria,
    downloadPromoCondition,
    clearPromoCriteria,
    clearPromoCondition,
  } = usePromo();

  // Load criteria list when promoId changes or tab is criteria
  useEffect(() => {
    if (promoId && selectedTab === 'criteria') {
      loadPromoCriteriaList({
        page: 1,
        size: 10,
        promoId,
        sort: 'createdDate~desc'
      });
    }
  }, [promoId, selectedTab, loadPromoCriteriaList]);

  // Load condition list when promoId changes or tab is conditions
  useEffect(() => {
    if (promoId && selectedTab === 'conditions') {
      loadPromoConditionList({
        page: 1,
        size: 10,
        promoId,
        sort: 'createdDate~desc'
      });
    }
  }, [promoId, selectedTab, loadPromoConditionList]);

  // Transform criteria list response
  useEffect(() => {
    if (promoCriteriaList?.data && !promoCriteriaList.loading) {
      const result = promoCriteriaList.data.result || [];
      const page = promoCriteriaList.data.page || {};

      const transformedData = result.map((item, index) => ({
        ...item,
        key: item.id,
        no: (page.number || 0) * (page.size || 10) + index + 1,
      }));

      setCriteriaDataSource(transformedData);
      setCriteriaPagination({
        current: (page.number || 0) + 1,
        pageSize: page.size || 10,
        total: page.totalElements || 0,
      });
    }
  }, [promoCriteriaList]);

  // Transform condition list response
  useEffect(() => {
    if (promoConditionList?.data && !promoConditionList.loading) {
      const result = promoConditionList.data.result || [];
      const page = promoConditionList.data.page || {};

      const transformedData = result.map((item, index) => ({
        ...item,
        key: item.id,
        no: (page.number || 0) * (page.size || 10) + index + 1,
      }));

      setConditionDataSource(transformedData);
      setConditionPagination({
        current: (page.number || 0) + 1,
        pageSize: page.size || 10,
        total: page.totalElements || 0,
      });
    }
  }, [promoConditionList]);

  // Update detail data when criteria detail changes
  useEffect(() => {
    if (promoCriteriaDetail?.data && !promoCriteriaDetail.loading && selectedTab === 'criteria') {
      // Handle nested data structure (response.data.data)
      const data = promoCriteriaDetail.data.data || promoCriteriaDetail.data;
      setDetailData(data);
      setIsModalVisible(true);
    }
  }, [promoCriteriaDetail, selectedTab]);

  // Update detail data when condition detail changes
  useEffect(() => {
    if (promoConditionDetail?.data && !promoConditionDetail.loading && selectedTab === 'conditions') {
      // Handle nested data structure (response.data.data)
      const data = promoConditionDetail.data.data || promoConditionDetail.data;
      setDetailData(data);
      setIsModalVisible(true);
    }
  }, [promoConditionDetail, selectedTab]);

  // Clear detail state when modal is closed
  useEffect(() => {
    if (!isModalVisible) {
      clearPromoCriteria();
      clearPromoCondition();
      setDetailData(null);
    }
  }, [isModalVisible, clearPromoCriteria, clearPromoCondition]);

  // Clear detail state when switching tabs
  useEffect(() => {
    clearPromoCriteria();
    clearPromoCondition();
    setDetailData(null);
    setIsModalVisible(false);
  }, [selectedTab, clearPromoCriteria, clearPromoCondition]);

  const onChangeTab = (value) => {
    setSelectedTab(value);
  };

  const handleClickCriteriaDetail = (record) => {
    if (record?.id) {
      loadPromoCriteriaDetail(record.id);
      setIsVisible(false);
    }
  };

  const handleClickConditionDetail = (record) => {
    if (record?.id) {
      loadPromoConditionDetail(record.id);
      setIsVisible(false);
    }
  };

  const onCancel = () => {
    setIsModalVisible(false);
    setIsVisible(true);
  };

  const handleCriteriaTableChange = (current, pageSize) => {
    if (promoId) {
      const advancedSearch = {
        inputFields: criteriaActiveFilters.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };
      loadPromoCriteriaList({
        page: current,
        size: pageSize,
        promoId,
        sort: 'createdDate~desc'
      }, advancedSearch);
    }
  };

  const handleConditionTableChange = (current, pageSize) => {
    if (promoId) {
      const advancedSearch = {
        inputFields: conditionActiveFilters.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };
      loadPromoConditionList({
        page: current,
        size: pageSize,
        promoId,
        sort: 'createdDate~desc'
      }, advancedSearch);
    }
  };

  const handleDownloadCriteria = async () => {
    if (promoId) {
      const params = {
        page: criteriaPagination.current,
        size: criteriaPagination.pageSize,
        promoId,
      };

      const advancedSearch = {
        inputFields: criteriaActiveFilters.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };

      await downloadPromoCriteria(params, advancedSearch);
    }
  };

  const handleDownloadCondition = async () => {
    if (promoId) {
      const params = {
        page: conditionPagination.current,
        size: conditionPagination.pageSize,
        promoId,
      };

      const advancedSearch = {
        inputFields: conditionActiveFilters.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };

      await downloadPromoCondition(params, advancedSearch);
    }
  };

  const handleFilterCriteria = (queries) => {
    console.log('handleFilterCriteria called with queries:', queries);
    // Save active filters to state
    setCriteriaActiveFilters(queries || []);

    if (promoId) {
      // Transform queries to advanced search format
      const advancedSearch = {
        inputFields: queries.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };

      console.log('Calling loadPromoCriteriaList with advancedSearch:', advancedSearch);

      loadPromoCriteriaList(
        {
          page: 1,
          size: criteriaPagination.pageSize,
          promoId,
          sort: 'createdDate~desc'
        },
        advancedSearch
      );
    } else {
      console.warn('handleFilterCriteria: promoId is missing');
    }
  };

  const handleFilterCondition = (queries) => {
    console.log('handleFilterCondition called with queries:', queries);
    // Save active filters to state
    setConditionActiveFilters(queries || []);

    if (promoId) {
      // Transform queries to advanced search format
      const advancedSearch = {
        inputFields: queries.map(q => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || ""
        }))
      };

      loadPromoConditionList(
        {
          page: 1,
          size: conditionPagination.pageSize,
          promoId,
          sort: 'createdDate~desc'
        },
        advancedSearch
      );
    }
  };

  return (
    <Fragment>
      <HeaderCriteriaAndCondition
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
      />
      <Divider style={{ margin: "1.5rem 0" }} />
      {selectedRender({
        selectedTab,
        handleClickCriteriaDetail,
        handleClickConditionDetail,
        criteriaDataSource,
        conditionDataSource,
        promoCriteriaList,
        promoConditionList,
        criteriaPagination,
        conditionPagination,
        handleCriteriaTableChange,
        handleConditionTableChange,
        handleDownloadCriteria,
        handleDownloadCondition,
        handleFilterCriteria,
        handleFilterCondition,
        criteriaActiveFilters,
        conditionActiveFilters,
      })}
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
