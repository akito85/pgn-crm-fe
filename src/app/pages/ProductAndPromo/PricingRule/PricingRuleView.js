import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip, Checkbox } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import {
  downloadPricingRule,
  getAllPricingRulePaginate,
  getApprovalHistory,
  inactivePricingRule,
  getListAppHier,
  getListAppHierDetail,
} from "../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import {
  ModalInactiveErrorPricingRule,
  ModalInactiveSuccessPricingRule,
} from "./Modal/ModalInactivePricingRule";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import ModalInactivateWithHierarchy from "../../../../components/Modal/ModalInactivateWithHierarchy";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";

const PAGE_SIZE = 20;

const formatStatus = (value) => {
  switch (value) {
    case "WAITING APPROVAL":
    case "WAITING_FOR_APPROVAL":
    case "WAITING_APPROVAL":
    case "WAITING FOR APPROVAL":
      return "Waiting Approval";
    default:
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
  }
};

const PricingRuleView = () => {
  // Selector
  const {
    list_pricingRule: dataSource,
    pagination_pricingRule: pagination,
    loading_listPricingRule: loading,
    data_approval_history,
  } = useSelector((state) => state.pricingRule);

  const { data: dataUser = {} } = useSelector((state) => state.profile);

  // Declaration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useRef(null);

  const totalElement = pagination.totalElement;

  // State
  const [page, setPage] = useState(1);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);
  const [limitData, setLimitData] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const hasMore = !limitData && dataSource.length < (totalElement || 0);
  const [chooseId, setChooseId] = useState({});
  const [modalInactive, setModalInactive] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [loadingInactive, setLoadingInactive] = useState(false);

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

  const buildBodyDownload = useCallback(
    (pageNum) => ({
      page: pageNum,
      // Download always fetches every matching record regardless of the
      // "limit data" advanced-search filter (that only caps the table view) —
      // totalElement reflects the full count for the current search/filters.
      pageSize: totalElement || PAGE_SIZE,
      sort,
      search,
      searchText,
      filters,
      filterRules,
    }),
    [sort, search, searchText, filters, filterRules, totalElement]
  );

  const handleRefresh = useCallback(() => {
    dispatch(getAllPricingRulePaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [dispatch, buildBody]);

  // Re-fetch page 1 whenever sort / search / filters change
  useEffect(() => {
    dispatch(getAllPricingRulePaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [sort, search, searchText, filters, filterRules, limitData]); // intentionally omit dispatch/buildBody to avoid loop

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    // page is 0-based, totalPage is a count → last valid index is totalPage-1.
    if (nextPage <= (pagination.totalPage || 1)) {
      // await so NxTable's infinite-scroll gate stays closed until the fetch
      // settles — prevents duplicate page dispatches on fast scrolling.
      await dispatch(getAllPricingRulePaginate({ ...buildBody(nextPage), isLoadMore: true }));
      setPage(nextPage);
    }
  };

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.PRICING_RULE || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_PRICING_RULE || [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.PRICING_RULE || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_PRICING_RULE || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRICING_RULE,
      breadcrumbName: "Pricing Rule",
    },
  ];

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleSearchBar = useCallback((value) => {
    setSearchText(value || "");
  }, []);

  const handleAdvancedSearch = (searchData) => {
    setFilters(searchData?.filters || []);
    setFilterRules(searchData?.filterRules || []);
    const parsedLimit = parseInt(searchData?.limitData, 10);
    setLimitData(Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null);
    setPage(1);
  };

  // Column
  const columns = [
    {
      title: "NO",
      key: "no",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "PRICING RULE NAME",
      key: "name",
      dataIndex: "name",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "name",
          hasValue(search["name"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      sorter: true,
      key: "startDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "center",
      sorter: true,
      key: "endDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      sorter: true,
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 160,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (value) => {
        const text = formatStatus(value);
        return text ? (
          <div className="flex justify-center">
            <NxStatusComponent colour={text}>{text}</NxStatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      fixed: "right",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (value) => {
        const text = formatStatus(value);
        return text ? (
          <div className="flex justify-center">
            <NxStatusComponent colour={text}>{text}</NxStatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
  ];

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalConfirm(true);
    setChooseId(record);
  };

  // Handle Download
  const handleDownload = async () => {
    setLoadingDownload(true);
    await dispatch(downloadPricingRule({ ...buildBodyDownload(1) }));
    setLoadingDownload(false);
  };

  // Handle Cancel Modal Confirmation Inactive
  const handleCancel = () => {
    setChooseId({});
    setModalConfirm(false);
  };

  // handle Active/Inactive
  const handleOk = (res, handleClear) => {
    const dataValue = {
      pricingRuleId: chooseId.pricingRuleId,
      appHierId: res.approvalHierarchy,
      description: res.remark,
      name: chooseId.name,
    };
    setLoadingInactive(true);
    dispatch(inactivePricingRule(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        handleRefresh();
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      })
      .finally(() => {
        setLoadingInactive(false);
      });
  };

  // Handle Approval History
  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistory(id));
    setModalApprovalHistory(true);
  };

  // Same icon component/style as Pricing.js's table (nxGetAccountActions) —
  // Update/Activate keep Pricing Rule's own eligibility rules, overridden
  // after the shared action list is built so the markup stays identical.
  const itemsActionView = nxGetAccountActions({
    handleView: (record) =>
      navigate(PRODUCT_PROMO_ROUTES.DETAIL_PRICING_RULE, {
        state: { id: record?.pricingRuleId },
      }),
    handleCreate: () => navigate(PRODUCT_PROMO_ROUTES.CREATE_PRICING_RULE),
    handleUpdate: (record) =>
      navigate(PRODUCT_PROMO_ROUTES.UPDATE_PRICING_RULE, {
        state: {
          id: record?.pricingRuleId,
          statusPricingRule: record.status,
          statusApprovalPricingRule: record.approvalStatus,
        },
      }),
    handleDownload,
    loadingDownload,
    handleActivate: handleActiveOrInactive,
    handleApprovalHistory: (record) =>
      handleApprovalHistory(record?.pricingRuleId),
  }).map((item) => {
    if (item.action === "Update") {
      return {
        ...item,
        render: (record, actionLength, index) => {
          const isEditable =
            record.approvalStatus === "DRAFT" ||
            record.approvalStatus === "REJECTED" ||
            (record.status === "ACTIVE" && record.approvalStatus === "APPROVED");

          const navigateToUpdate = () =>
            navigate(PRODUCT_PROMO_ROUTES.UPDATE_PRICING_RULE, {
              state: {
                id: record?.pricingRuleId,
                statusPricingRule: record.status,
                statusApprovalPricingRule: record.approvalStatus,
              },
            });

          return actionLength > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color="#0075bf" width={20} />}
              disabled={!isEditable}
              onClick={() => isEditable && navigateToUpdate()}
              type={"action"}
            >
              Update
            </ButtonComponent>
          ) : (
            <Tooltip
              title={isEditable ? "Update" : ""}
              key={`table-action-${index}`}
            >
              <ButtonComponent
                onClick={() => isEditable && navigateToUpdate()}
                disabled={!isEditable}
                type="table-action"
              >
                <SVGIcon name="IconEdit" width={20} />
              </ButtonComponent>
            </Tooltip>
          );
        },
      };
    }
    if (item.action === "Activate") {
      return {
        ...item,
        render: (record, actionLength, index) => {
          const isActivateOrInactivate =
            (record?.approvalStatus === "APPROVED" && record?.status === "ACTIVE") ||
            (record?.approvalStatus === "DRAFT" && record?.status === "ACTIVE") ||
            (record?.approvalStatus === "REJECTED" && record?.status === "ACTIVE");
          const isActive = record?.status === "ACTIVE";

          return actionLength > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  disabled={!isActive}
                  checked={!isActive}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleActiveOrInactive(record)}
            >
              <span className="text-black ml-5">
                {isActive ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={isActive ? "Inactivate" : "Activate"}
              key={`table-action-${index}`}
            >
              <Checkbox
                className="inactive-check"
                onClick={() => handleActiveOrInactive(record)}
                disabled={!isActive}
                checked={!isActive}
              />
            </Tooltip>
          );
        },
      };
    }
    return item;
  });

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleOk(bodyError.body, bodyError.handleClear);
    setModalError(false);
    setBodyError({});
  };

  const tableColumns = [
    ...columns,
    ...useColumnActionPermission(
      ["view", "Update", "Activate", "History"],
      itemsActionView
    ),
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="Pricing Rule List" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemsActionView} type="page" />
          <NxTable
            idTable="pricing-rule-table"
            userId={dataUser?.data?.username}
            showRefresh={true}
            dataSource={dataSource}
            totalData={totalElement}
            current={page}
            tableScrolled={{ x: "max-content" }}
            onSort={onSort}
            columns={tableColumns}
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
      </NxCardContainer>

      <ModalInactivateWithHierarchy
        selector={"pricingRule"}
        dispatch={dispatch}
        getAPIOption={getListAppHier}
        getAPIDetail={getListAppHierDetail}
        alertMessage={`Are you sure you want to inactivate Pricing Rule named ${
          chooseId?.name || ""
        }?`}
        openModalInactivate={modalConfirm}
        handleCloseModalInactivate={handleCancel}
        onFinish={handleOk}
        loading={loadingInactive}
      />

      {/* Modal Success Inactive */}
      <ModalInactiveSuccessPricingRule
        isOpen={modalInactive}
        handleOk={() => setModalInactive(false)}
        handleCancel={() => setModalInactive(false)}
      />

      {/* Modal Error Inactive */}
      <ModalInactiveErrorPricingRule
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
      />

      {/* Modal Approval History */}
      <ModalHistory
        isOpen={modalApprovalHistory && dataApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />
    </>
  );
};

export default PricingRuleView;
