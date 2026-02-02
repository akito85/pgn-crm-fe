import React, { useCallback, useEffect, useMemo, useState } from "react";
import NxTable from "../../../../../../components/Nx/NxTable";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";
import promoCriteriaRepository from "./repository/promoCriteriaRepository";
import promoConditionRepository from "./repository/promoConditionRepository";
import PopupDetailCriteria from "./Detail/PopupDetailCriteria";
import PopupDetailCondition from "./Detail/PopupDetailCondition";

const USE_DUMMY = true;

const CriteriaConditionTabs = ({ selectedTab, onChangeTab }) => (
  <div
    style={{
      display: "flex",
      gap: 24,
      borderBottom: "1px solid #EAECF0",
      marginBottom: 16,
    }}
  >
    {["criteria", "condition"].map((tab) => (
      <div
        key={tab}
        onClick={() => onChangeTab(tab)}
        style={{
          paddingBottom: 8,
          fontWeight: 600,
          cursor: "pointer",
          color: selectedTab === tab ? "#1570EF" : "#667085",
          borderBottom:
            selectedTab === tab ? "2px solid #1570EF" : "2px solid transparent",
        }}
      >
        {tab === "criteria" ? "Criteria" : "Condition"}
      </div>
    ))}
  </div>
);

const CriteriaAndCondition = ({ promoId, onRegisterDownload }) => {
  const [activeTab, setActiveTab] = useState("criteria");
  const [criteriaDataSource, setCriteriaDataSource] = useState([]);
  const [conditionDataSource, setConditionDataSource] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [detailType, setDetailType] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: ["action"],
  });
  const [conditionFixedColumns, setConditionFixedColumns] = useState({
    left: ["no"],
    right: ["action"],
  });

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    if (!promoId) return;

    const fetchData = async () => {
      try {
        if (USE_DUMMY) {
          setCriteriaDataSource(promoCriteriaRepository.getMockCriteriaData());
          setConditionDataSource(
            promoConditionRepository.getMockConditionData(),
          );
        } else {
          const pagingParams = { promoId, page: 1, size: 1000 };

          const criteriaRes =
            await promoCriteriaRepository.getPromoCriteriaList(
              pagingParams,
              {},
            );
          const criteriaList =
            promoCriteriaRepository.transformPromoCriteriaList(criteriaRes);
          setCriteriaDataSource(criteriaList);

          const conditionRes =
            await promoConditionRepository.getPromoConditionList(
              pagingParams,
              {},
            );
          const conditionList =
            promoConditionRepository.transformPromoConditionList(conditionRes);
          setConditionDataSource(conditionList);
        }
      } catch (error) {
        console.error("Failed to load criteria & condition data", error);
        setCriteriaDataSource([]);
        setConditionDataSource([]);
      }
    };

    fetchData();
  }, [promoId]);

  /* =========================
     DETAIL HANDLER
  ========================= */
  const handleViewCriteriaDetail = useCallback((record) => {
    setDetailData(record);
    setDetailType("criteria");
    setIsDetailModalVisible(true);
  }, []);

  const handleViewConditionDetail = useCallback((record) => {
    setDetailData(record);
    setDetailType("condition");
    setIsDetailModalVisible(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalVisible(false);
    setDetailData({});
    setDetailType(null);
  }, []);

  /* =========================
     DOWNLOAD HANDLER
  ========================= */
  const handleDownload = useCallback(() => {
    if (USE_DUMMY) {
      if (activeTab === "criteria") {
        promoCriteriaRepository.downloadMockExcel(criteriaDataSource);
      } else {
        promoConditionRepository.downloadMockExcel(conditionDataSource);
      }
      return;
    }

    if (activeTab === "criteria") {
      promoCriteriaRepository.downloadPromoCriteria(promoId);
    } else {
      promoConditionRepository.downloadPromoCondition(promoId);
    }
  }, [activeTab, criteriaDataSource, conditionDataSource, promoId]);

  useEffect(() => {
    if (onRegisterDownload) {
      onRegisterDownload(handleDownload);
    }
  }, [handleDownload, onRegisterDownload]);

  const criteriaColumns = useMemo(() => {
    const baseColumns = promoCriteriaRepository.getColumns(
      handleViewCriteriaDetail,
    );

    const orderedColumns = baseColumns.map((col, index) => ({
      ...col,
      key: col.key || col.dataIndex || `criteria-col-${index}`,
      order: index,
    }));

    return applyFixedColumns(orderedColumns, setFixedColumns);
  }, [handleViewCriteriaDetail]);
  const conditionColumns = useMemo(() => {
    const baseColumns = promoConditionRepository.getColumns(
      handleViewConditionDetail,
    );

    // Tambahkan properti order yang eksplisit untuk setiap kolom
    const columnsWithOrder = baseColumns.map((col, index) => ({
      ...col,
      key: col.key || col.dataIndex || `condition-col-${index}`,
      order: index + 1, // Pastikan order dimulai dari 1
    }));

    // Sort berdasarkan order sebelum diterapkan fixed columns
    const sortedColumns = [...columnsWithOrder].sort(
      (a, b) => (a.order || 999) - (b.order || 999),
    );

    return applyFixedColumns(sortedColumns, setConditionFixedColumns);
  }, [handleViewConditionDetail]);

  const renderTable = () => {
    if (activeTab === "criteria") {
      return (
        <NxTable
          idTable="criteria-table"
          dataSource={criteriaDataSource}
          columns={criteriaColumns}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={false}
          showSearchBar
          showAdvanceSearch
          usePagination={false}
          tableScrolled={{ y: 250 }}
        />
      );
    }

    return (
      <NxTable
        idTable="condition-table"
        dataSource={conditionDataSource}
        columns={conditionColumns}
        fixedColumns={conditionFixedColumns}
        setFixedColumns={setConditionFixedColumns}
        loading={false}
        showSearchBar
        showAdvanceSearch
        usePagination={false}
        tableScrolled={{ y: 250 }}
      />
    );
  };

  return (
    <>
      <CriteriaConditionTabs
        selectedTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {renderTable()}

      {detailType === "criteria" && (
        <PopupDetailCriteria
          open={isDetailModalVisible}
          data={detailData}
          onClose={handleCloseDetailModal}
        />
      )}

      {detailType === "condition" && (
        <PopupDetailCondition
          open={isDetailModalVisible}
          data={detailData}
          onClose={handleCloseDetailModal}
        />
      )}
    </>
  );
};

export default CriteriaAndCondition;
