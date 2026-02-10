import React, { useCallback, useEffect, useMemo, useState } from "react";
import NxTable from "../../../../../../components/Nx/NxTable";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";
import promoCriteriaRepository from "./repository/promoCriteriaRepository";
import promoConditionRepository from "./repository/promoConditionRepository";
import PopupDetailCriteria from "./Detail/PopupDetailCriteria";
import PopupDetailCondition from "./Detail/PopupDetailCondition";

const USE_DUMMY = false;

// Helper function untuk normalisasi nilai
const normalize = (val = "") => String(val).toLowerCase().trim();

// Helper function untuk apply filter pada data dummy
const applyDummyFilter = (data, filters) => {
  if (!filters || filters.length === 0) return data;

  return data.filter((item) => {
    let result = true;

    filters.forEach((f, index) => {
      const rawValue = item[f.column];
      if (rawValue === undefined || rawValue === null) return;

      const itemValue = normalize(rawValue);
      const filterValue = normalize(f.value);

      let match = false;

      switch (f.operator) {
        case "Equal to":
        case "Equals":
        case "=":
          match = itemValue === filterValue;
          break;

        case "Not equal to":
        case "!=":
          match = itemValue !== filterValue;
          break;

        case "Contains":
          match = itemValue.includes(filterValue);
          break;

        case "Does not contain":
          match = !itemValue.includes(filterValue);
          break;

        case "Greater than":
          match = Number(rawValue) > Number(f.value);
          break;

        case "Less than":
          match = Number(rawValue) < Number(f.value);
          break;

        case "Is empty":
          match = itemValue === "";
          break;

        case "Is not empty":
          match = itemValue !== "";
          break;

        default:
          match = false;
      }

      if (index === 0) {
        result = match;
      } else if (f.condition === "OR") {
        result = result || match;
      } else {
        result = result && match;
      }
    });

    return result;
  });
};

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

  // Data state
  const [originalCriteriaData, setOriginalCriteriaData] = useState([]);
  const [originalConditionData, setOriginalConditionData] = useState([]);
  const [criteriaDataSource, setCriteriaDataSource] = useState([]);
  const [conditionDataSource, setConditionDataSource] = useState([]);

  // Filter state
  const [criteriaFilters, setCriteriaFilters] = useState([]);
  const [conditionFilters, setConditionFilters] = useState([]);

  // Modal state
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [detailType, setDetailType] = useState(null);

  // Fixed columns state
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
          const criteriaData = promoCriteriaRepository.getMockCriteriaData();
          const conditionData = promoConditionRepository.getMockConditionData();

          setOriginalCriteriaData(criteriaData);
          setOriginalConditionData(conditionData);
          setCriteriaDataSource(criteriaData);
          setConditionDataSource(conditionData);
        } else {
          const pagingParams = { promoId, page: 1, size: 1000 };

          // Criteria
          const criteriaRes =
            await promoCriteriaRepository.getPromoCriteriaList(
              pagingParams,
              {},
            );
          setOriginalCriteriaData(criteriaRes.data || []);
          setCriteriaDataSource(criteriaRes.data || []);

          // Condition
          const conditionRes =
            await promoConditionRepository.getPromoConditionList(
              pagingParams,
              {},
            );
          setOriginalConditionData(conditionRes.data || []);
          setConditionDataSource(conditionRes.data || []);
        }
      } catch (error) {
        console.error("Failed to load criteria & condition data", error);
      }
    };

    fetchData();
  }, [promoId]);

  /* =========================
     FILTER HANDLERS
  ========================= */
  const mapAdvanceSearchToBE = (searchData) => {
    if (!searchData) return [];

    const result = [];

    // main filters
    searchData.filters?.forEach((f) => {
      if (f.column && f.operator) {
        result.push({
          condition: f.logic || "AND",
          column: f.column,
          operator: f.operator,
          value: f.value || "",
        });
      }
    });

    // rule groups
    searchData.filterRules?.forEach((rule) => {
      rule.filters?.forEach((f, idx) => {
        if (f.column && f.operator) {
          result.push({
            condition: idx === 0 ? rule.groupLogic : f.logic,
            column: f.column,
            operator: f.operator,
            value: f.value || "",
          });
        }
      });
    });

    return result;
  };

  // Fungsi untuk memproses filter criteria
  const handleCriteriaAdvanceSearch = useCallback(
    (searchData) => {
      const mappedFilters = mapAdvanceSearchToBE(searchData);
      setCriteriaFilters(mappedFilters);

      if (USE_DUMMY) {
        const filteredData = applyDummyFilter(
          originalCriteriaData,
          mappedFilters,
        );
        setCriteriaDataSource(filteredData);
      } else {
        // Panggil API dengan filter
        const fetchFilteredCriteria = async () => {
          try {
            const pagingParams = { promoId, page: 1, size: 1000 };
            const response = await promoCriteriaRepository.getPromoCriteriaList(
              pagingParams,
              searchData, // Kirim filter ke API
            );
            setCriteriaDataSource(response.data || []);
          } catch (error) {
            console.error("Error fetching filtered criteria:", error);
          }
        };
        fetchFilteredCriteria();
      }
    },
    [USE_DUMMY, originalCriteriaData, promoId],
  );

  // Fungsi serupa untuk condition
  const handleConditionAdvanceSearch = useCallback(
    (searchData) => {
      const mappedFilters = mapAdvanceSearchToBE(searchData);
      setConditionFilters(mappedFilters);

      if (USE_DUMMY) {
        const filteredData = applyDummyFilter(
          originalConditionData,
          mappedFilters,
        );
        setConditionDataSource(filteredData);
      } else {
        const fetchFilteredCondition = async () => {
          try {
            const pagingParams = { promoId, page: 1, size: 1000 };
            const response =
              await promoConditionRepository.getPromoConditionList(
                pagingParams,
                searchData,
              );
            setConditionDataSource(response.data || []);
          } catch (error) {
            console.error("Error fetching filtered condition:", error);
          }
        };
        fetchFilteredCondition();
      }
    },
    [USE_DUMMY, originalConditionData, promoId],
  );

  // Reset filter ketika tab berubah
  useEffect(() => {
    if (USE_DUMMY) {
      if (activeTab === "criteria") {
        setCriteriaDataSource(originalCriteriaData);
      } else {
        setConditionDataSource(originalConditionData);
      }
    }
  }, [activeTab, USE_DUMMY, originalCriteriaData, originalConditionData]);

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

  /* =========================
     COLUMNS
  ========================= */
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

    const columnsWithOrder = baseColumns.map((col, index) => ({
      ...col,
      key: col.key || col.dataIndex || `condition-col-${index}`,
      order: index + 1,
    }));

    const sortedColumns = [...columnsWithOrder].sort(
      (a, b) => (a.order || 999) - (b.order || 999),
    );

    return applyFixedColumns(sortedColumns, setConditionFixedColumns);
  }, [handleViewConditionDetail]);

  /* =========================
     RENDER TABLE
  ========================= */
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
          onAdvanceSearch={handleCriteriaAdvanceSearch}
          usePagination={false}
          useInfiniteScroll
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
        useInfiniteScroll
        onAdvanceSearch={handleConditionAdvanceSearch}
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
