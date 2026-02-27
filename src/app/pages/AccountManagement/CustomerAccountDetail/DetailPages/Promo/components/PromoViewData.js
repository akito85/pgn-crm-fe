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

      try {
        await loadValidPromoDetail(record.id);
      } catch (error) {
        console.error("Error loading promo detail:", error);
        setDetailPromoData(record);
      }
      setIsModalPromoVisible(true);
    },
    [loadValidPromoDetail, setDetailPromoData, setIsModalPromoVisible],
  );

  // Effect untuk menangani perubahan validPromoDetail
  useEffect(() => {
    if (validPromoDetail?.data && !validPromoDetail.loading) {
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
          promotionTypeName: detailData.promotionTypeName,
          typeName: detailData.typeName || detailData.promoType,
          criterias: detailData.criterias,
          startDate: detailData.startDate || detailData.startDateTime,
          endDate: detailData.endDate ?? detailData.endDateTime ?? null,
          description: detailData.description,
          statusApproval: detailData.statusApproval || detailData.status,
          createdBy: detailData.createdBy,
          createdDate: detailData.createdDate || detailData.createdAt,
          updatedBy: detailData.updatedBy,
          updatedDate: detailData.updatedDate ?? detailData.updatedAt ?? null,
        };
        setDetailPromoData(transformedData);
      }
    }
  }, [validPromoDetail, setDetailPromoData]);

  const handleDownload = useCallback(async () => {
    try {
      if (!accountId) return;

      const payload = {
        page: 0,
        size: totalElements || 1000,
        sort: "id~desc",
        filters: [...activeFilters],
        filterRules: [],
      };

      // optional search keyword
      if (searchKeyword) {
        payload.filters.push({
          column: "name",
          operator: "Contains",
          value: searchKeyword,
          logic: "OR",
        });
      }

      await downloadValidPromo(accountId, payload);
    } catch (err) {
      console.error("Download promo failed:", err);
    }
  }, [
    accountId,
    totalElements,
    searchKeyword,
    activeFilters,
    downloadValidPromo,
  ]);

  // Register download handler
  useEffect(() => {
    if (onRegisterDownload) {
      onRegisterDownload(handleDownload);
    }
  }, [handleDownload, onRegisterDownload]);

  // Transform apiData dari Redux ke dataSource
  useEffect(() => {
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

        // Extract data from API response
        // apiData (axios response) -> .data (response body: {success, code, message, data})
        //   -> .data (inner: {result: [...], links: [...], page: {totalElements, number, size}})
        const responseBody = apiData.data;

        if (!responseBody) {
          console.warn("No data property in API response:", apiData);
          setDataSource([]);
          setTotalElements(0);
          setHasMore(false);
          return;
        }

        const innerData = responseBody.data;
        const content =
          innerData?.result || innerData?.content || innerData?.data || [];
        console.log("Content data:", content);

        const total =
          innerData?.page?.totalElements ||
          innerData?.totalElements ||
          content.length;
        const currentPage = innerData?.page?.number ?? page;
        const pageSizeApi = innerData?.page?.size || pageSize;

        // Transform data for table
        const transformedData = content.map((item, index) => {
          console.log("Transforming item:", item);

          return {
            key: item.id || `promo-${currentPage}-${index}`,
            no: currentPage * pageSizeApi + index + 1,
            id: item.id,
            name: item.name || item.promoName || "",
            promotionType: item.promotionType || item.type || "",
            typeName: item.typeName || item.promoType || "",
            criteria: item.criteria || item.criteriaCount || "",
            startDate: item.startDate || item.startDateTime,
            endDate: item.endDate || item.endDateTime,
            description: item.description || "",
            status: item.status || "",
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
    dataSource.length,
    pageSize,
  ]);

  const handleSearch = useCallback(
    (keyword) => {
      setSearchKeyword(keyword);
      setActiveFilters([]);
      setPage(0);
      setHasMore(true);
      setDataSource([]);
      setTotalElements(0);
      setError(null);
    },
    [],
  );

  const loadMoreData = useCallback(
    async (pageNumber = 0) => {
      if (!accountId) return;

      const validatedPage =
        typeof pageNumber === "number"
          ? pageNumber
          : pageNumber === true
            ? 1
            : 0; // Handle boolean true

      const payload = {
        page: validatedPage,
        size: pageSize,
        sort: "id~desc",
        filters: [...activeFilters],
        filterRules: [],
      };

      if (searchKeyword) {
        payload.filters.push({
          column: "name",
          operator: "Contains",
          value: searchKeyword,
          logic: "OR",
        });
      }

      await loadValidPromoList(accountId, payload);
    },
    [accountId, activeFilters, searchKeyword, loadValidPromoList],
  );

  // Effect untuk load data saat searchKeyword atau accountId berubah
  useEffect(() => {
    if (accountId) {
      const timer = setTimeout(() => {
        loadMoreData(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchKeyword, accountId]);

  const loadDataWithFilter = useCallback(
    async (filters = [], reset = true) => {
      setActiveFilters(filters);
      setSearchKeyword("");
      if (reset) {
        setPage(0);
        setHasMore(true);
        setDataSource([]);
        setTotalElements(0);
        setError(null);
        setTimeout(() => {
          loadMoreData(0);
        }, 0);
      }
    },
    [loadMoreData],
  );

  // Inisialisasi data
  useEffect(() => {
    if (accountId) {
      console.log("Initializing with accountId:", accountId);
      loadMoreData(true);
    }
  }, [accountId]);

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
      clearValidPromo();
      setDetailPromoData({});
    };
  }, [clearValidPromo, setDetailPromoData]);

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

  return (
    <div ref={containerRef} className="infinite-scroll-container">
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
            const nextPage = page + 1;
            setPage(nextPage);
            loadMoreData(nextPage);
          }
        }}
        loadMoreThreshold={50}
        tableScrolled={{ y: 115 }}
        scrollBodyStyle={{ minHeight: 115 }}
      />
    </div>
  );
};

export default PromoViewData;
