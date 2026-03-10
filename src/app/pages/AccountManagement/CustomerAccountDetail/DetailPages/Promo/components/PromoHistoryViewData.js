import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { usePromo } from "../hooks/usePromo";
import promoHistoryRepository from "../repository/promoHistoryRepository";
import PopupDetailPromoHistory from "../Detail/PopupDetailPromoHistory";
import PopupDetailPromoHistoryDetail from "../Detail/PopupDetailPromoHistoryDetail";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";

/* =======================
 * COMPONENTS
 * ======================= */

const LoadingIndicator = ({ size = "default" }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg m-4">
    <Spin
      indicator={
        <LoadingOutlined
          className={size === "large" ? "text-2xl" : "text-xl"}
          spin
        />
      }
    />
    <div className="mt-2.5 text-gray-500 text-sm">Loading more data...</div>
  </div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-lg text-center text-red-600">
    <div>Error loading data: {error}</div>
    <button
      onClick={onRetry}
      className="mt-3 px-6 py-2 bg-blue-500 text-white rounded"
    >
      Retry
    </button>
  </div>
);

/* =======================
 * CHILD TABLE
 * ======================= */

const ChildTableWithInfiniteScroll = ({ record, childColumns }) => {
  const details = record.details || [];

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="text-xs font-semibold mb-3 text-blue-600">
        PROMO HISTORY DETAIL
      </div>

      <NxTable
        idTable={`promo-history-child-${record.billingCode}`}
        rowKey="key"
        dataSource={details}
        columns={childColumns}
        usePagination={false}
        showSearchBar={false}
        showAdvanceSearch={false}
        showExport={false}
        useSelect={false}
        showRefresh={false}
        tableScrolled={{ y: 110 }}
        scrollBodyStyle={{ minHeight: 110 }}
      />
    </div>
  );
};

/* =======================
 * HELPER FUNCTIONS
 * ======================= */

// Fungsi untuk mapping advanced search format
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

/* =======================
 * MAIN VIEW
 * ======================= */

const PromoHistoryViewData = ({
  onRegisterDownload,
  popupDetailHistoryVisible,
  setPopupDetailHistoryVisible,
  popupDetailHistoryDetailVisible,
  setPopupDetailHistoryDetailVisible,
  selectedHistoryData,
  setSelectedHistoryData,
  selectedHistoryDetailData,
  setSelectedHistoryDetailData,
  accountId,
}) => {
  const { promoHistoryList, loadPromoHistoryList, downloadPromoHistory } =
    usePromo();
  const containerRef = useRef(null);
  const pageSize = 10;

  // Destructure Redux state
  const {
    loading: apiLoading,
    error: apiError,
    data: apiData,
  } = promoHistoryList;

  // State untuk data utama
  const [dataSource, setDataSource] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  // Ref untuk menentukan replace vs append
  const isFirstPageRef = useRef(true);

  /* =========================
     DOWNLOAD HANDLER
  ========================= */
  const handleDownload = useCallback(() => {
    downloadPromoHistory({ accountId });
  }, [accountId]);

  useEffect(() => {
    onRegisterDownload?.(handleDownload);
  }, [handleDownload]);

  /* =========================
     API DATA HANDLER
  ========================= */
  useEffect(() => {
    if (apiError) {
      const errMsg =
        typeof apiError === "object"
          ? apiError.message || apiError.error || JSON.stringify(apiError)
          : apiError;
      setError(errMsg);
      setLoadingInitial(false);
      return;
    }

    if (apiData && !apiLoading) {
      try {
        const responseBody = apiData.data;
        if (!responseBody) {
          setDataSource([]);
          setHasMore(false);
          setLoadingInitial(false);
          return;
        }

        const innerData = responseBody.data;
        const content =
          innerData?.result || innerData?.content || innerData?.data || [];
        const total =
          innerData?.page?.totalElements ||
          innerData?.totalElements ||
          content.length;

        const transformedData = content.map((item, index) => ({
          key: item.billingCode || `history-${index}`,
          no: index + 1,
          billingCode: item.billingCode,
          billingPeriod: item.billingPeriod,
          billingCycle: item.billingCycle,
          promoApplied: item.promoApplied,
          details: item.details || [],
          _original: item,
        }));

        if (isFirstPageRef.current) {
          setDataSource(transformedData);
        } else {
          setDataSource((prev) => {
            const existingKeys = new Set(prev.map((i) => i.billingCode));
            const filtered = transformedData.filter(
              (i) => !existingKeys.has(i.billingCode),
            );
            return [...prev, ...filtered];
          });
        }

        const loadedCount = isFirstPageRef.current
          ? transformedData.length
          : dataSource.length + transformedData.length;
        setHasMore(loadedCount < total);
        setError(null);
      } catch (err) {
        setError("Failed to process data: " + err.message);
      } finally {
        setLoadingInitial(false);
      }
    }
  }, [apiData, apiLoading, apiError]);

  /* =========================
     ADVANCED SEARCH HANDLER
  ========================= */
  const handleAdvanceSearch = useCallback(
    (searchData) => {
      const mappedFilters = mapAdvanceSearchToBE(searchData);
      setActiveFilters(mappedFilters);
      setPage(1);
      setHasMore(true);
      setDataSource([]);
      setExpandedRows([]);
      loadMoreData(true, mappedFilters);
    },
    [],
  );

  /* =========================
     DATA LOADING
  ========================= */
  const loadMoreData = async (reset = false, overrideFilters) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // Real API call
      const currentPage = reset ? 1 : page;
      isFirstPageRef.current = reset;

      const filters = overrideFilters !== undefined ? overrideFilters : activeFilters;
      const payload = {
        page: currentPage,
        size: pageSize,
        sort: "id~desc",
        searchs: {},
        filters,
        filterRules: [],
      };

      await loadPromoHistoryList(accountId, payload);
      setPage(currentPage + 1);
    } catch (e) {
      setError(e.message || "Load failed");
    } finally {
      setLoading(false);
      setLoadingInitial(false);
    }
  };

  // Load data awal
  useEffect(() => {
    loadMoreData(true);
  }, []);

  const handleExpand = (expanded, record) => {
    if (!expanded) {
      setExpandedRows((prev) => prev.filter((k) => k !== record.key));
      return;
    }
    setExpandedRows((prev) => [...prev, record.key]);
  };

  /* =========================
     TABLE COLUMNS
  ========================= */
  const parentColumns = useMemo(
    () =>
      nxApplyFixedColumns(
        promoHistoryRepository.getParentColumns((record) => {
          setSelectedHistoryData(record);
          setPopupDetailHistoryVisible(true);
        }),
        { left: ["no"], right: ["action"] },
      ),
    [setSelectedHistoryData, setPopupDetailHistoryVisible],
  );

  const childColumns = useMemo(
    () =>
      nxApplyFixedColumns(
        promoHistoryRepository.getChildColumns((record) => {
          setSelectedHistoryDetailData(record);
          setPopupDetailHistoryDetailVisible(true);
        }),
        { left: ["no"], right: ["action"] },
      ),
    [setSelectedHistoryDetailData, setPopupDetailHistoryDetailVisible],
  );

  /* =======================
   * RENDER
   * ======================= */

  return (
    <Fragment>
      <div
        ref={containerRef}
        className="infinite-scroll-container"
      >
        <NxTable
          idTable="promo-history-parent"
          rowKey="key"
          dataSource={dataSource}
          columns={parentColumns}
          usePagination={false}
          useInfiniteScroll
          hasMore={hasMore}
          onLoadMore={loadMoreData}
          showSearchBar
          showAdvanceSearch
          onAdvanceSearch={handleAdvanceSearch}
          tableScrolled={{ y: 255 }}
          scrollBodyStyle={{ minHeight: 255 }}
          expandable={{
            expandedRowKeys: expandedRows,
            onExpand: handleExpand,
            expandedRowRender: (record) => (
              <ChildTableWithInfiniteScroll
                record={record}
                childColumns={childColumns}
              />
            ),
          }}
        />

        {loadingInitial && dataSource.length === 0 && (
          <LoadingIndicator size="large" />
        )}

        {error && (
          <ErrorMessage error={error} onRetry={() => loadMoreData(true)} />
        )}

        <PopupDetailPromoHistory
          open={popupDetailHistoryVisible}
          onClose={() => setPopupDetailHistoryVisible(false)}
          data={selectedHistoryData}
        />

        <PopupDetailPromoHistoryDetail
          open={popupDetailHistoryDetailVisible}
          onClose={() => setPopupDetailHistoryDetailVisible(false)}
          data={selectedHistoryDetailData}
        />
      </div>
    </Fragment>
  );
};

export default PromoHistoryViewData;
