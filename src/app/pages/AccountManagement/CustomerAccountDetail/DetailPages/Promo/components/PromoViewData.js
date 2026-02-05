import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { applyFixedColumns } from "../../../../../../../utils/applyFixedColumns";
import { usePromo } from "../hooks/usePromo";
import promoRepository from "../repository/promoRepository";
import "../infiniteScroll.css";
import {
  dummyPromoData,
  dummyPromoDetailMap,
  formatDate,
} from "../utils/promoHelpers";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LoadingIndicator = ({ size = "default" }) => {
  const fontSize = size === "large" ? 32 : 24;
  return (
    <div className="promo-loading-indicator">
      <Spin indicator={<LoadingOutlined style={{ fontSize }} spin />} />
      <div style={{ marginTop: "10px", color: "#888" }}>
        Loading more data...
      </div>
    </div>
  );
};

const ErrorMessage = ({ error, onRetry }) => {
  // Extract error message from object if needed
  const errorMessage =
    typeof error === "object"
      ? error.message || error.error || JSON.stringify(error)
      : error;

  return (
    <div
      className="promo-error-message"
      style={{ padding: "20px", textAlign: "center", color: "#ff4d4f" }}
    >
      <div>Error loading data: {errorMessage}</div>
      <button
        onClick={onRetry}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#1890ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
};

const PromoViewData = ({
  isModalPromoVisible,
  setIsModalPromoVisible,
  setDetailPromoData,
  customerId,
  accountId,
  onRegisterDownload,
}) => {
  const {
    validPromoList,
    loadValidPromoList,
    downloadValidPromo,
    clearValidPromo,
    loadValidPromoDetail,
    validPromoDetail,
  } = usePromo();

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: ["action"],
  });

  const [dataSource, setDataSource] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0); // API menggunakan zero-based index
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 20;
  const containerRef = useRef(null);
  const USE_DUMMY = true; // Ubah ke false untuk API real

  // Destructure validPromoList state
  const {
    loading: loadingInitial,
    error: apiError,
    data: apiData,
  } = validPromoList;

  // Handlers
  const handleViewDetail = useCallback(
    async (record) => {
      if (!record?.id) return;

      if (USE_DUMMY) {
        const dummyDetail = dummyPromoDetailMap[record.id];
        if (!dummyDetail) {
          console.warn("Dummy promo detail not found:", record.id);
          return;
        }
        setDetailPromoData(dummyDetail);
      } else {
        try {
          // Load detail dari Redux store
          await loadValidPromoDetail(record.id);
        } catch (error) {
          console.error("Error loading promo detail:", error);
          // Fallback ke data record yang ada
          setDetailPromoData(record);
        }
      }
      setIsModalPromoVisible(true);
    },
    [
      USE_DUMMY,
      loadValidPromoDetail,
      setDetailPromoData,
      setIsModalPromoVisible,
    ],
  );

  // Effect untuk menangani perubahan validPromoDetail
  useEffect(() => {
    if (!USE_DUMMY && validPromoDetail?.data && !validPromoDetail.loading) {
      // Perhatikan: validPromoDetail.data adalah response API penuh
      const apiResponse = validPromoDetail.data;
      console.log("Detail API Response:", apiResponse);

      // Extract data dari response
      const detailData = apiResponse?.data;
      if (detailData) {
        const transformedData = {
          key: detailData.id,
          id: detailData.id,
          name: detailData.name || detailData.promoName,
          promotionType: detailData.promotionType || detailData.type,
          typeName: detailData.typeName || detailData.promoType,
          categoryName: detailData.categoryName || detailData.category,
          criteria: detailData.criteria || detailData.criteriaCount,
          startDate: detailData.startDate || detailData.startDateTime,
          endDate: detailData.endDate || detailData.endDateTime,
          description: detailData.description,
          status: detailData.status,
          createdBy: detailData.createdBy,
          createdDate: detailData.createdDate || detailData.createdAt,
          updatedBy: detailData.updatedBy,
          updatedDate: detailData.updatedDate || detailData.updatedAt,
        };
        setDetailPromoData(transformedData);
      }
    }
  }, [validPromoDetail, USE_DUMMY, setDetailPromoData]);

  const downloadDummyPromo = (data) => {
    if (!data || data.length === 0) return;

    const formattedData = data.map((promo, index) => ({
      NO: index + 1,
      NAME: promo.name,
      "PROMOTION TYPE": promo.promotionTypeName,
      "TYPE NAME": promo.typeName,
      "CATEGORY NAME": promo.categoryName,
      CRITERIAS: promo.criterias,
      "START DATE": formatDate(promo.startDate),
      "END DATE": formatDate(promo.endDate),
      DESCRIPTION: promo.description,
      STATUS: promo.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PROMO");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `PROMO_UNDER_ACCOUNT_${new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14)}.xlsx`;

    saveAs(blob, fileName);
  };

  const handleDownload = useCallback(async () => {
    try {
      if (USE_DUMMY) {
        downloadDummyPromo(dataSource);
        return;
      }

      if (!accountId) {
        console.error("Account ID is required for download");
        return;
      }

      const params = {
        page: 0,
        size: totalElements || 1000,
        accountId,
        sort: "id~desc",
      };

      // Gabungkan activeFilters dengan searchKeyword untuk download
      let allFilters = [...activeFilters];
      if (searchKeyword) {
        allFilters.push({
          condition: "OR",
          column: "name",
          operator: "Contains",
          value: searchKeyword,
        });
      }

      const advancedSearch = {
        inputFields:
          allFilters.length > 0
            ? allFilters
            : [{ condition: "", column: "", operator: "", value: "" }],
      };

      await downloadValidPromo(params, advancedSearch);
    } catch (err) {
      console.error("Download promo failed:", err);
      // Fallback: Download dari data yang sudah dimuat
      if (dataSource.length > 0) {
        const formattedData = dataSource.map((promo, index) => ({
          NO: index + 1,
          NAME: promo.name,
          "PROMOTION TYPE": promo.promotionType,
          "TYPE NAME": promo.typeName,
          "CATEGORY NAME": promo.categoryName,
          CRITERIA: promo.criteria,
          "START DATE": formatDate(promo.startDate),
          "END DATE": formatDate(promo.endDate),
          DESCRIPTION: promo.description,
          STATUS: promo.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PROMO");

        const timestamp = new Date()
          .toISOString()
          .replace(/[-:T.Z]/g, "")
          .slice(0, 14);
        const fileName = `PROMO_UNDER_ACCOUNT_${timestamp}.xlsx`;

        XLSX.writeFile(workbook, fileName);
      }
    }
  }, [
    USE_DUMMY,
    dataSource,
    accountId,
    activeFilters,
    searchKeyword,
    totalElements,
    downloadValidPromo,
  ]);

  // Register download handler
  useEffect(() => {
    if (onRegisterDownload) {
      onRegisterDownload(handleDownload);
    }
  }, [handleDownload, onRegisterDownload]);

  // Transform apiData dari Redux ke dataSource - PERBAIKAN UTAMA
  useEffect(() => {
    if (USE_DUMMY) return;

    console.log("API Data from Redux:", apiData);
    console.log("API Error from Redux:", apiError);
    console.log("Loading State:", loadingInitial);

    // Handle API errors
    if (apiError) {
      console.error("API Error received:", apiError);
      // Extract error message properly
      const errorMessage =
        typeof apiError === "object"
          ? apiError.message || apiError.error || JSON.stringify(apiError)
          : apiError;
      setError(errorMessage);
      return;
    }

    // Process API data when available
    if (apiData && !loadingInitial) {
      try {
        console.log("Processing API data:", apiData);

        // Extract data from API response - ini adalah kunci perbaikan
        // apiData adalah response API penuh: {success, code, message, data}
        const responseData = apiData.data; // Ambil data property

        if (!responseData) {
          console.warn("No data property in API response:", apiData);
          setDataSource([]);
          setTotalElements(0);
          setHasMore(false);
          return;
        }

        const content = responseData.content || responseData.data || [];
        console.log("Content data:", content);

        const total =
          responseData.totalElements || responseData.total || content.length;
        const currentPage = responseData.pageable?.pageNumber || page;
        const pageSizeApi = responseData.pageable?.pageSize || pageSize;

        // Transform data for table
        const transformedData = content.map((item, index) => {
          console.log("Transforming item:", item);

          return {
            key: item.id || `promo-${currentPage}-${index}`,
            no: currentPage * pageSizeApi + index + 1,
            id: item.id,
            name: item.name || item.promoName || "-",
            promotionType: item.promotionType || item.type || "-",
            typeName: item.typeName || item.promoType || "-",
            categoryName: item.categoryName || item.category || "-",
            criteria: item.criteria || item.criteriaCount || "-",
            startDate: item.startDate || item.startDateTime,
            endDate: item.endDate || item.endDateTime,
            description: item.description || "-",
            status: item.status || "-",
            _original: item,
          };
        });

        console.log("Transformed data:", transformedData);

        if (page === 0) {
          // First page - replace data
          setDataSource(transformedData);
        } else {
          // Append data - filter duplicates
          setDataSource((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const filtered = transformedData.filter(
              (item) => item.id && !existingIds.has(item.id),
            );
            return [...prev, ...filtered];
          });
        }

        setTotalElements(total);

        // Check if has more data
        const loadedCount =
          page === 0
            ? transformedData.length
            : dataSource.length + transformedData.length;
        setHasMore(loadedCount < total);

        // Clear any previous errors
        setError(null);
      } catch (error) {
        console.error("Error transforming API data:", error);
        setError("Failed to process data: " + error.message);
      }
    } else if (!loadingInitial && !apiData) {
      // No data loaded yet
      setDataSource([]);
      setHasMore(true);
    }
  }, [
    apiData,
    loadingInitial,
    apiError,
    page,
    USE_DUMMY,
    dataSource.length,
    pageSize,
  ]);

  const normalize = (val = "") => String(val).toLowerCase().trim();

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

  const handleSearch = useCallback(
    (keyword) => {
      setSearchKeyword(keyword);

      if (USE_DUMMY) {
        if (!keyword) {
          setDataSource(dummyPromoData);
        } else {
          const keywordLower = keyword.toLowerCase();
          const filteredData = dummyPromoData.filter((item) =>
            Object.values(item).some(
              (value) =>
                value !== null &&
                value !== undefined &&
                String(value).toLowerCase().includes(keywordLower),
            ),
          );
          setDataSource(filteredData);
        }
        setHasMore(false);
      } else {
        // Untuk API real, reset state dan load data dengan keyword
        setActiveFilters([]);
        setPage(0);
        setHasMore(true);
        setDataSource([]);
        setTotalElements(0);
        setError(null);
      }
    },
    [USE_DUMMY],
  );

  const loadMoreData = useCallback(
    async (reset = false) => {
      if (USE_DUMMY) return;
      if (!accountId) {
        console.warn("Account ID is required for loading data");
        return;
      }

      const currentPage = reset ? 0 : page;

      const params = {
        page: currentPage,
        size: pageSize,
        accountId,
        sort: "id~desc",
      };

      let allFilters = [...activeFilters];
      if (searchKeyword) {
        allFilters.push({
          condition: "OR",
          column: "name",
          operator: "Contains",
          value: searchKeyword,
        });
      }

      const advancedSearch = {
        inputFields:
          allFilters.length > 0
            ? allFilters
            : [{ condition: "", column: "", operator: "", value: "" }],
      };

      console.log("Loading data with params:", { params, advancedSearch });

      try {
        await loadValidPromoList(params, advancedSearch);

        if (reset) {
          setPage(0);
        }
      } catch (err) {
        console.error("Error in loadMoreData:", err);
        setError(err.message || "Failed to load data");
      }
    },
    [
      page,
      accountId,
      activeFilters,
      searchKeyword,
      loadValidPromoList,
      USE_DUMMY,
      pageSize,
    ],
  );

  // Effect untuk load data saat searchKeyword atau accountId berubah
  useEffect(() => {
    if (!USE_DUMMY && accountId) {
      const timer = setTimeout(() => {
        loadMoreData(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchKeyword, accountId, USE_DUMMY]);


  const loadDataWithFilter = useCallback(
    async (filters = [], reset = true) => {
      if (USE_DUMMY) {
        const filteredData = applyDummyFilter(dummyPromoData, filters);
        setDataSource(filteredData);
        setHasMore(false);
      } else {
        setActiveFilters(filters);
        setSearchKeyword("");
        if (reset) {
          setPage(0);
          setHasMore(true);
          setDataSource([]);
          setTotalElements(0);
          setError(null);
          setTimeout(() => {
            loadMoreData(true);
          }, 0);
        }
      }
    },
    [USE_DUMMY, loadMoreData],
  );

  // Inisialisasi data
  useEffect(() => {
    if (USE_DUMMY) {
      setDataSource(dummyPromoData);
      setHasMore(false);
    } else if (accountId) {
      console.log("Initializing with accountId:", accountId);
      loadMoreData(true);
    }
  }, [USE_DUMMY, accountId]);

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

  const handleAdvanceSearch = useCallback(
    (searchData) => {
      const mappedFilters = mapAdvanceSearchToBE(searchData);
      loadDataWithFilter(mappedFilters, true);
    },
    [loadDataWithFilter],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (!USE_DUMMY) {
        clearValidPromo();
      }
      setDetailPromoData({});
    };
  }, [clearValidPromo, setDetailPromoData, USE_DUMMY]);

  const baseColumns = useMemo(
    () => promoRepository.getColumns(handleViewDetail),
    [handleViewDetail],
  );

  const allColumns = useMemo(() => {
    return baseColumns.map((col, index) => ({
      ...col,
      key: col.key || col.dataIndex || `col-${index}`,
      render: col.render
        ? (text, record, index) => {
            const result = col.render(text, record, index);
            if (
              result &&
              typeof result === "object" &&
              !React.isValidElement(result)
            ) {
              console.warn("Invalid render result:", result);
              return String(result);
            }
            return result;
          }
        : undefined,
    }));
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, setFixedColumns);
  }, [allColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key,
      title: col.title,
    }));
  }, [allColumns]);

  // Cek dataSource sebelum render
  // console.log("Current dataSource:", dataSource);
  // console.log("Has error:", error);
  // console.log("Loading:", loadingInitial);

  return (
    <div
      ref={containerRef}
      className="infinite-scroll-container"
    >
      {!error && (
        <NxTable
          idTable="account-promo-table"
          dataSource={dataSource}
          columns={processedColumns}
          loading={loadingInitial}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          showSearchBar
          onSearch={handleSearch}
          showAdvanceSearch
          onAdvanceSearch={handleAdvanceSearch}
          usePagination={false}
          useInfiniteScroll
          hasMore={hasMore}
          onLoadMore={() => {
            if (!loadingInitial && hasMore) {
              setPage((prev) => {
                const nextPage = prev + 1;
                loadMoreData();
                return nextPage;
              });
            }
          }}
          loadMoreThreshold={50}
          tableScrolled={{ y: 110 }}
          scrollBodyStyle={{ minHeight: 110 }}
        />
      )}

      {loadingInitial && page > 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <LoadingIndicator size="small" />
        </div>
      )}

      {loadingInitial && page === 0 && !error && (
        <LoadingIndicator size="large" />
      )}

      {error && (
        <ErrorMessage
          error={error}
          onRetry={() => {
            setError(null);
            loadMoreData(true);
          }}
        />
      )}
    </div>
  );
};

export default PromoViewData;
