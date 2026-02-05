import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import * as XLSX from "xlsx";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { applyFixedColumns } from "../../../../../../../utils/applyFixedColumns";
import { usePromo } from "../hooks/usePromo";
import promoHistoryRepository from "../repository/promoHistoryRepository";
import PopupDetailPromoHistory from "../Detail/PopupDetailPromoHistory";
import PopupDetailPromoHistoryDetail from "../Detail/PopupDetailPromoHistoryDetail";

/* =======================
 * COMPONENTS
 * ======================= */

const LoadingIndicator = ({ size = "default", isChild = false }) => (
  <div
    className={`flex flex-col items-center justify-center ${
      isChild
        ? "p-3 bg-transparent rounded-none m-0"
        : "p-6 bg-gray-50 rounded-lg m-4"
    }`}
  >
    <Spin
      indicator={
        <LoadingOutlined
          className={`${
            isChild ? "text-base" : size === "large" ? "text-2xl" : "text-xl"
          }`}
          spin
        />
      }
    />
    <div
      className={`mt-2.5 ${
        isChild ? "text-gray-500 text-xs" : "text-gray-500 text-sm"
      }`}
    >
      {isChild ? "Loading more details..." : "Loading more data..."}
    </div>
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

const ChildTableWithInfiniteScroll = ({
  record,
  childColumns,
  childState,
  loadMoreChildData,
}) => {
  const wrapperRef = useRef(null);
  const state = childState[record.billingCode] || {};
  const details = record.details || [];

  useEffect(() => {
    const tableBody = wrapperRef.current?.querySelector(".ant-table-body");

    if (!tableBody) return;

    const onScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;

      if (
        scrollHeight - scrollTop - clientHeight < 100 &&
        !state.loading &&
        state.hasMore !== false
      ) {
        loadMoreChildData(record.billingCode);
      }
    };

    tableBody.addEventListener("scroll", onScroll);
    return () => tableBody.removeEventListener("scroll", onScroll);
  }, [record.billingCode, state.loading, state.hasMore, loadMoreChildData]);

  return (
    <div ref={wrapperRef} className="p-4 bg-gray-50 rounded-lg relative">
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

      {state.loading && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t p-3">
          <LoadingIndicator isChild />
        </div>
      )}
    </div>
  );
};

/* =======================
 * HELPER FUNCTIONS
 * ======================= */

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
  const USE_DUMMY = false;
  const pageSize = 10;
  const childPageSize = 5;

  // State untuk data utama
  const [originalDataSource, setOriginalDataSource] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  // State untuk child tables
  const [childState, setChildState] = useState({});

  const updateChildState = (billingCode, patch) => {
    setChildState((prev) => ({
      ...prev,
      [billingCode]: {
        page: 1,
        loading: false,
        hasMore: true,
        ...(prev[billingCode] || {}),
        ...patch,
      },
    }));
  };

  /* =========================
     DOWNLOAD HANDLER
  ========================= */
  const downloadDummyPromoHistory = (data = []) => {
    if (!data.length) return;

    const excelData = data.map((item, i) => ({
      NO: i + 1,
      "BILLING CODE": item.billingCode,
      "PROMO NAME": item.promoName,
      "APPLIED DATE": item.appliedDate
        ? moment(item.appliedDate).format("MMM YYYY")
        : "-",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Promo History");

    XLSX.writeFile(
      wb,
      `PROMO_HISTORY_${accountId}_${moment().format("YYYYMMDDHHmmss")}.xlsx`,
    );
  };

  const handleDownload = useCallback(() => {
    if (USE_DUMMY) {
      downloadDummyPromoHistory(dataSource);
      return;
    }
    downloadPromoHistory({ accountId });
  }, [USE_DUMMY, dataSource, accountId]);

  useEffect(() => {
    onRegisterDownload?.(handleDownload);
  }, [handleDownload]);

  /* =========================
     ADVANCED SEARCH HANDLER
  ========================= */
  const handleAdvanceSearch = useCallback(
    (searchData) => {
      const mappedFilters = mapAdvanceSearchToBE(searchData);
      setActiveFilters(mappedFilters);

      if (USE_DUMMY) {
        const filteredData = applyDummyFilter(
          originalDataSource,
          mappedFilters,
        );
        setDataSource(filteredData);
        setHasMore(true);
        setPage(1);
        setExpandedRows([]);
      } else {
        setPage(1);
        setHasMore(true);
        setDataSource([]);
        setExpandedRows([]);
      }
    },
    [USE_DUMMY, originalDataSource],
  );

  /* =========================
     DATA LOADING
  ========================= */
  const loadMoreData = async (reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      if (USE_DUMMY) {
        const mock = promoHistoryRepository.getMockPromoHistoryList();

        // Simpan data original jika belum ada
        if (originalDataSource.length === 0 || reset) {
          setOriginalDataSource(mock);
        }

        // Jika ada filter aktif, gunakan applyDummyFilter
        let filteredMock = mock;
        if (activeFilters.length > 0) {
          filteredMock = applyDummyFilter(mock, activeFilters);
        }

        const currentPage = reset ? 1 : page;
        const start = (currentPage - 1) * pageSize;
        const slice = filteredMock.slice(start, start + pageSize);

        setDataSource((prev) => (reset ? slice : [...prev, ...slice]));
        setHasMore(start + pageSize < filteredMock.length);
        setPage(currentPage + 1);
        return;
      }

      // Real API call dengan filter jika ada
      const params = {
        page: reset ? 1 : page,
        size: pageSize,
        accountId,
      };

      // Tambahkan advanced search jika ada filter aktif
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

      await loadPromoHistoryList(params, advancedSearch);
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

  // Re-load data ketika filter berubah (untuk real API)
  useEffect(() => {
    if (!USE_DUMMY && activeFilters.length > 0) {
      loadMoreData(true);
    }
  }, [activeFilters, USE_DUMMY]);

  /* =========================
     CHILD DATA LOADING
  ========================= */
  const loadMoreChildData = async (billingCode) => {
    const state = childState[billingCode] || {};
    if (state.loading || state.hasMore === false) return;

    updateChildState(billingCode, { loading: true });

    await new Promise((r) => setTimeout(r, 400));

    const page = state.page || 1;
    const details = Array.from({ length: childPageSize }).map((_, i) => ({
      key: `${billingCode}-${page}-${i}`,
      detailId: `${billingCode}-${page}-${i}`,
      name: `PRM-${page}-${i}`,
      promotionType: "Promo",
      category: "BLAST",
      description: "Detail promo",
    }));

    setDataSource((prev) =>
      prev.map((item) =>
        item.billingCode === billingCode
          ? { ...item, details: [...(item.details || []), ...details] }
          : item,
      ),
    );

    updateChildState(billingCode, {
      page: page + 1,
      hasMore: page * childPageSize < 50,
      loading: false,
    });
  };

  const handleExpand = async (expanded, record) => {
    if (!expanded) {
      setExpandedRows((prev) => prev.filter((k) => k !== record.key));
      return;
    }

    setExpandedRows((prev) => [...prev, record.key]);

    if (!record.details?.length) {
      await loadMoreChildData(record.billingCode);
    }
  };

  /* =========================
     TABLE COLUMNS
  ========================= */
  const parentColumns = useMemo(
    () =>
      applyFixedColumns(
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
      promoHistoryRepository.getChildColumns((record) => {
        setSelectedHistoryDetailData(record);
        setPopupDetailHistoryDetailVisible(true);
      }),
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
                childState={childState}
                loadMoreChildData={loadMoreChildData}
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
