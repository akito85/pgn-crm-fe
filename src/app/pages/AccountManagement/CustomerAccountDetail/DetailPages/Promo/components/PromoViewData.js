import {
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
import { dummyPromoData, dummyPromoDetailMap } from "../utils/promoHelpers";
import { transformValidPromoResponse } from "../utils/promoHelpers";
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

const ErrorMessage = ({ error, onRetry }) => (
  <div className="promo-error-message">
    <div>Error loading data: {error}</div>
    <button onClick={onRetry}>Retry</button>
  </div>
);

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
  } = usePromo();
  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: ["action"],
  });

  const [dataSource, setDataSource] = useState([]);
  const [activeFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const pageSize = 20;
  const containerRef = useRef(null);
  const USE_DUMMY = true;

  // Handlers
  const handleViewDetail = useCallback(
    (record) => {
      if (!record?.id) return;

      if (USE_DUMMY) {
        const dummyDetail = dummyPromoDetailMap[record.id];

        if (!dummyDetail) {
          console.warn("Dummy promo detail not found:", record.id);
          return;
        }

        setDetailPromoData(dummyDetail);
      } else {
        setDetailPromoData(record);
      }

      setIsModalPromoVisible(true);
    },
    [USE_DUMMY, setDetailPromoData, setIsModalPromoVisible],
  );

  const downloadDummyPromo = (data) => {
    if (!data || data.length === 0) return;

    const formattedData = data.map((promo, index) => ({
      NO: index + 1,
      NAME: promo.name,
      "PROMOTION TYPE": promo.promotionTypeName,
      "TYPE NAME": promo.typeName,
      "CATEGORY NAME": promo.categoryName,
      CRITERIAS: promo.criterias,
      "START DATE": promo.startDate,
      "END DATE": promo.endDate,
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

      if (!accountId) return;

      const params = {
        page: 1,
        size: dataSource.length,
        accountId,
      };

      const advancedSearch = {
        inputFields: activeFilters.map((q) => ({
          condition: q.condition || "",
          column: q.column || "",
          operator: q.operator || "",
          value: q.value || "",
        })),
      };

      await downloadValidPromo(params, advancedSearch);
    } catch (err) {
      console.error("Download promo failed:", err);
    }
  }, [USE_DUMMY, dataSource, accountId, activeFilters, downloadValidPromo]);

  // Register download handler
  useEffect(() => {
    if (onRegisterDownload) {
      onRegisterDownload(handleDownload);
    }
  }, [handleDownload, onRegisterDownload]);

  // Data Loading function
  const loadMoreData = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) return;

      try {
        setLoading(true);
        setError(null);
        const currentPage = reset ? 1 : page;

        if (USE_DUMMY) {
          // Handle dummy data
          if (reset) {
            setDataSource(dummyPromoData);
            setPage(1);
            setHasMore(false);
          }
        } else {
          // Handle real API data
          const params = {
            page: currentPage,
            size: pageSize,
            accountId,
            sort: "id~desc",
          };

          const advancedSearch =
            activeFilters.length > 0
              ? {
                  inputFields: activeFilters.map((q) => ({
                    condition: q.condition || "",
                    column: q.column || "",
                    operator: q.operator || "",
                    value: q.value || "",
                  })),
                }
              : undefined;

          await loadValidPromoList(params, advancedSearch);

          if (reset) {
            setPage(1);
            setHasMore(true);
          } else {
            setPage((prev) => prev + 1);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
        setLoadingInitial(false);
      }
    },
    [
      loading,
      hasMore,
      page,
      accountId,
      activeFilters,
      loadValidPromoList,
      USE_DUMMY,
    ],
  );

  useEffect(() => {
    if (USE_DUMMY) {
      setDataSource(dummyPromoData);
      setLoadingInitial(false);
      setHasMore(false);
    } else {
      loadMoreData(true);
    }
  }, [loadMoreData, USE_DUMMY]);

  // Transform API response
  useEffect(() => {
    if (USE_DUMMY) return;

    if (validPromoList?.data && !validPromoList.loading) {
      const { dataSource: transformedData } = transformValidPromoResponse(
        validPromoList.data,
      );

      if (page === 1) {
        setDataSource(transformedData);
      } else {
        setDataSource((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const filtered = transformedData.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...filtered];
        });
      }

      if (validPromoList.data.length < pageSize) {
        setHasMore(false);
      }
    }
  }, [validPromoList, page, USE_DUMMY]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearValidPromo();
      setDetailPromoData({});
    };
  }, [clearValidPromo, setDetailPromoData]);

  // Table Columns
  const baseColumns = useMemo(
    () => promoRepository.getColumns(handleViewDetail),
    [handleViewDetail],
  );

  const allColumns = useMemo(() => {
    return baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key,
      title: col.title,
    }));
  }, [allColumns]);

  const enhancedDataSource = useMemo(() => {
    const result = [...dataSource];
    if (loading && page > 1 && !USE_DUMMY) {
      result.push({
        key: "loading-row",
        isLoading: true,
      });
    }
    return result;
  }, [dataSource, loading, page, USE_DUMMY]);

  return (
    <Fragment>
      <div
        ref={containerRef}
        className="infinite-scroll-container"
        style={{
          backgroundColor: "#FFFFFF",
          marginTop: 0,
        }}
      >
        <NxTable
          idTable="account-promo-table"
          dataSource={enhancedDataSource}
          columns={processedColumns}
          loading={loadingInitial}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          showSearchBar
          showAdvanceSearch
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={loadMoreData}
          loadMoreThreshold={20}
          tableScrolled={{ y: 110 }}
          scrollBodyStyle={{ minHeight: 110 }}
        />

        {loadingInitial && !USE_DUMMY && <LoadingIndicator size="large" />}
        {error && !USE_DUMMY && (
          <ErrorMessage error={error} onRetry={() => loadMoreData(true)} />
        )}
      </div>
    </Fragment>
  );
};

export default PromoViewData;
