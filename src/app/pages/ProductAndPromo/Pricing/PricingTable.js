import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, Tooltip } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import {
  getAllPricingPaginate,
  downloadPricing,
  getApprovalHistory,
  inactivePricing,
  getListAppHier,
  getListAppHierDetail,
} from "../../../../redux/slices/product_promo/pricing";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import getPricingColumns from "./getPricingColumns";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";

const PAGE_SIZE = 20;

const PricingTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list_pricing: dataSource,
    pagination_pricing: pagination,
    loading_listPricing: loading,
    dataApprovalHistory,
  } = useSelector((state) => state.pricing);
  
  const { data: dataUser = {} } = useSelector((state) => state.profile);

  const totalElement = pagination.totalElement;

  // --- Search / sort / filter state ---
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);
  const [limitData, setLimitData] = useState(null);
  const hasMore = !limitData && dataSource.length < (totalElement || 0);

  // --- Modal state ---
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  // --- Approval history reshape ---
  useEffect(() => {
    if (dataApprovalHistory?.dataApprover) {
      setDataApprovalHistoryFix({
        dataApprover: {
          create: dataApprovalHistory.dataApprover.PRICING || [],
          inactive: dataApprovalHistory.dataApprover.INACTIVE_PRICING || [],
        },
        dataHistory: {
          create: dataApprovalHistory.dataHistory?.PRICING || [],
          inactive: dataApprovalHistory.dataHistory?.INACTIVE_PRICING || [],
        },
      });
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  // --- Fetch helpers ---
  const buildBody = useCallback(
    (pageNum) => ({
      page: pageNum,
      pageSize: limitData || PAGE_SIZE,
      sort,
      search,
      searchText,
      filters,
      filterRules,
    }),
    [sort, search, searchText, filters, filterRules, limitData]
  );

  const handleRefresh = useCallback(() => {
    dispatch(getAllPricingPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [dispatch, buildBody]);

  // Re-fetch page 1 whenever sort / search / filters change
  useEffect(() => {
    dispatch(getAllPricingPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [sort, search, searchText, filters, filterRules, limitData]); // intentionally omit dispatch/buildBody to avoid loop

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    // page is 0-based, totalPage is a count → last valid index is totalPage-1.
    if (nextPage <= (pagination.totalPage || 1)) {
      // await so NxTable's infinite-scroll gate stays closed until the fetch
      // settles — prevents duplicate page dispatches on fast scrolling.
      await dispatch(getAllPricingPaginate({ ...buildBody(nextPage), isLoadMore: true }));
      setPage(nextPage);
    }
  };

  // --- Handlers ---
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
    setSearch((prev) => {
      if (prev[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prev, [dataIndex]: selectedKeys[0] };
    });
  };

  const handleSearchBar = useCallback((value) => {
    setSearchText(value || "");
  }, []);

  const onSort = (_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleAdvancedSearch = (searchData) => {
    setFilters(searchData?.filters || []);
    setFilterRules(searchData?.filterRules || []);
    const parsedLimit = parseInt(searchData?.limitData, 10);
    setLimitData(Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null);
    setPage(1);
  };

  const handleDownload = useCallback(() => {
    dispatch(downloadPricing({ ...buildBody(1) }));
  }, [dispatch, buildBody]);

  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistory(data.id));
    setOpenModalHistory(true);
  };

  const handleOpenModalInactivate = (data) => {
    setDataInactivate(data);
    setOpenModalInactivate(true);
  };

  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setOpenModalInactivate(false);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const data = {
      id: dataInactivate.id,
      priceCode: dataInactivate.priceCode,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactivePricing({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        handleRefresh();
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message || error?.message || error?.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSubmitModalInactivate(bodyError.body, bodyError.handleClear);
    setModalError(false);
    setBodyError({});
  };

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    return Object.keys(data).map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  // --- Action column items ---
  const itemActions = useMemo(() => nxGetAccountActions({
    handleView: ({ id }) =>
      navigate(PRODUCT_PROMO_ROUTES.DETAIL_PRICING, {
        state: { id }
      }),
    handleCreate: () =>
      navigate(PRODUCT_PROMO_ROUTES.CREATE_PRICING),
    handleUpdate: ({ id, status, statusApproval }) => 
      navigate(PRODUCT_PROMO_ROUTES.CREATE_PRICING, {
        state: {
          id, statusPricing: status, statusApprovalPricing: statusApproval
        }
      }),
    handleActivate: handleOpenModalInactivate,
    handleApprovalHistory,
    handleDownload,
  }), [handleDownload, handleOpenModalInactivate, handleApprovalHistory]);

  // --- Columns ---
  const actionCols = useColumnActionPermission(
    ["View", "Update", "Activate", "History"],
    itemActions
  );

  const baseColumns = useMemo(
    () => getPricingColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchedColumn, searchText]
  );

  const columns = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  // --- Render ---
  return (
    <Fragment>
      <div className="flex flex-col gap-y-4">
        <Toolbar items={itemActions} type="page" />
        <NxTable
          idTable="pricing-table"
          userId={dataUser?.data?.username}
          showRefresh={true}
          dataSource={dataSource}
          totalData={totalElement}
          current={page}
          tableScrolled={{ x: "max-content" }}
          onSort={onSort}
          columns={columns}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loading={loading}
          onAdvanceSearch={handleAdvancedSearch}
          onRefresh={handleRefresh}
          onSearch={handleSearchBar}
        />
      </div>

      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header="Approval History"
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      <ModalInactivateWithHierarchy
        dispatch={dispatch}
        getAPIOption={getListAppHier}
        getAPIDetail={getListAppHierDetail}
        alertMessage={`Are you sure you want to inactivate Pricing with Price Code ${dataInactivate?.priceCode || ""}?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSubmitModalInactivate}
      />

      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText="Try Again"
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">{`Your data was not submitted, ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default PricingTable;
