import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  getAllPricingAdjustPaginate,
  downloadPriceAdjust,
  getApprovalHistory,
  inactivePricingAdjust,
  getListAppHier,
  getListAppHierDetail,
} from "../../../../redux/slices/product_promo/pricingAdjust";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import getPricingAdjustColumns from "./getPricingAdjustColumns";

const PAGE_SIZE = 20;

const PricingAdjustTable = () => {
  const dispatch = useDispatch();
  const {
    list_pricingAdjust: dataSource,
    pagination_pricingAdjust: pagination,
    loading_listPricingAdjust: loading,
    dataApprovalHistory,
  } = useSelector((state) => state.pricingAdjust);

  const totalElement = pagination.totalElement;
  const hasMore = dataSource.length < (totalElement || 0);

  // --- Search / sort / filter state ---
  const searchInput = useRef(null);
  const [page, setPage] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

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
          create: dataApprovalHistory.dataApprover.PRICING_ADJUSTMENT || [],
          inactive: dataApprovalHistory.dataApprover.INACTIVE_PRICING_ADJUSTMENT || [],
        },
        dataHistory: {
          create: dataApprovalHistory.dataHistory?.PRICING_ADJUSTMENT || [],
          inactive: dataApprovalHistory.dataHistory?.INACTIVE_PRICING_ADJUSTMENT || [],
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
      pageSize: PAGE_SIZE,
      sort,
      search: encodeURIComponent(JSON.stringify(search)),
      filters,
      filterRules,
    }),
    [sort, search, filters, filterRules]
  );

  const handleRefresh = useCallback(() => {
    dispatch(getAllPricingAdjustPaginate({ ...buildBody(0), isLoadMore: false }));
    setPage(0);
  }, [dispatch, buildBody]);

  // Re-fetch page 0 whenever sort / search / filters change
  useEffect(() => {
    dispatch(getAllPricingAdjustPaginate({ ...buildBody(0), isLoadMore: false }));
    setPage(0);
  }, [sort, search, filters, filterRules]); // intentionally omit dispatch/buildBody to avoid loop

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= (pagination.totalPage || 0)) {
      dispatch(getAllPricingAdjustPaginate({ ...buildBody(nextPage), isLoadMore: true }));
    }
    setPage(nextPage);
  };

  // --- Handlers ---
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => {
      if (prev[dataIndex] !== selectedKeys[0]) setPage(0);
      return { ...prev, [dataIndex]: selectedKeys[0] };
    });
  };

  const onSort = (_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleAdvancedSearch = (searchData) => {
    setFilters(searchData?.filters || []);
    setFilterRules(searchData?.filterRules || []);
    setPage(0);
  };

  const handleDownload = useCallback(() => {
    dispatch(downloadPriceAdjust({
      page: 0,
      pageSize: PAGE_SIZE,
      sort,
      search: encodeURIComponent(JSON.stringify(search)),
      filters,
      filterRules,
    }));
  }, [dispatch, sort, search, filters, filterRules]);

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
      appHierId: res.approvalHierarchy,
      description: res.remark,
    };
    dispatch(inactivePricingAdjust({ data }))
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

  // --- Toolbar items ---
  const toolbarItems = useMemo(() => [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
  ], [handleDownload]);

  // --- Action column items ---
  const itemsActionView = useMemo(() => [
    {
      action: "view",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <Link to={PRODUCT_PROMO_ROUTES.DETAIL_PRICING_ADJUSTMENT} state={{ id: record?.id }}>
            <SVGIcon name="IconDetail" width={24} />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED" ||
          (record.status === "ACTIVE" && record.statusApproval === "APPROVED");
        const icon =
          data_length > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
              border={false}
              disabled={!isEditable}
            >
              <span className="text-black ml-3">Update</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );
        return isEditable ? (
          <Link
            to={PRODUCT_PROMO_ROUTES.UPDATE_PRICING_ADJUSTMENT}
            state={{
              id: record?.id,
              prevPage: "table-price-adjust",
              statusPriceAdjust: record?.status,
              statusApprovalPriceAdjust: record?.statusApproval,
            }}
          >
            {icon}
          </Link>
        ) : icon;
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const isActivateOrInactivate =
          (record.statusApproval === "APPROVED" && record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" && record.status === "ACTIVE");
        return data_length > 3 ? (
          <ButtonComponent
            icon={
              <Checkbox
                className="inactive-check"
                disabled={record?.status !== "ACTIVE"}
                checked={record?.status !== "ACTIVE"}
              />
            }
            border={false}
            disabled={!isActivateOrInactivate}
            onClick={() => handleOpenModalInactivate(record)}
          >
            <span className="text-black ml-5">
              {record?.status !== "ACTIVE" ? "Activate" : "Inactivate"}
            </span>
          </ButtonComponent>
        ) : (
          <Tooltip title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}>
            <div className="pt-1">
              <Checkbox
                className="inactive-check"
                onClick={() => handleOpenModalInactivate(record)}
                disabled={record?.status !== "ACTIVE"}
                checked={record?.status !== "ACTIVE"}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data_length) =>
        data_length > 3 ? (
          <ButtonComponent
            icon={<SVGIcon name="IconLogHistory" color="#0075bf" width={24} />}
            border={false}
            onClick={() => handleApprovalHistory(record)}
          >
            <span className="text-black ml-3">Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Approval History">
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color="#0075bf"
                width={24}
                onClick={() => handleApprovalHistory(record)}
              />
            </div>
          </Tooltip>
        ),
    },
  ], [handleOpenModalInactivate, handleApprovalHistory]);

  // --- Columns ---
  const actionCols = useColumnActionPermission(
    ["View", "Update", "Activate", "History"],
    itemsActionView
  );

  const baseColumns = useMemo(
    () => getPricingAdjustColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchedColumn, searchText]
  );

  const columns = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  // --- Render ---
  return (
    <Fragment>
      <div className="flex flex-col gap-y-4">
        <Toolbar items={toolbarItems} type="page" />
        <NxTable
          idTable="pricing-adjust-table"
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
        alertMessage={`Are you sure you want to inactivate Pricing Adjustment with ID ${dataInactivate?.id || ""}?`}
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

export default PricingAdjustTable;
