import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tooltip, Checkbox, Alert } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import {
  downloadProductClass,
  getAllProductClassPaginate,
  getDetailProductClass,
  inactiveProductClass,
} from "../../../../redux/slices/product_promo/ProductClass/ProductClassSlice";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import ProductClassDetail from "./ProductClassDetail";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";

const PAGE_SIZE = 20;

const formatStatus = (value) => {
  switch (value) {
    case "WAITING_FOR_APPROVAL":
      return "Waiting Approval";
    default:
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
  }
};

const ProductClassView = () => {
  // Selector
  const {
    list_productClass: dataSource,
    pagination_productClass: pagination,
    loading_listProductClass: loading,
    data_detail,
  } = useSelector((state) => state.productClass);

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

  const [modalDetail, setModalDetail] = useState(false);
  const [chooseId, setChooseId] = useState("");
  const [modalInactive, setModalInactive] = useState(false);
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
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
    dispatch(getAllProductClassPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [dispatch, buildBody]);

  // Re-fetch page 1 whenever sort / search / filters change
  useEffect(() => {
    dispatch(getAllProductClassPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [sort, search, searchText, filters, filterRules, limitData]); // intentionally omit dispatch/buildBody to avoid loop

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    // page is 0-based, totalPage is a count → last valid index is totalPage-1.
    if (nextPage <= (pagination.totalPage || 1)) {
      // await so NxTable's infinite-scroll gate stays closed until the fetch
      // settles — prevents duplicate page dispatches on fast scrolling.
      await dispatch(getAllProductClassPaginate({ ...buildBody(nextPage), isLoadMore: true }));
      setPage(nextPage);
    }
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRODUCT_CLASS,
      breadcrumbName: "Product Class",
    },
  ];

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

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Download
  const handleDownload = async () => {
    setLoadingDownload(true);
    await dispatch(downloadProductClass({ ...buildBodyDownload(1) }));
    setLoadingDownload(false);
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalInactive(true);
    setChooseId(record?.productClassId);
    setActiveOrInactive(record?.status);
  };

  // handle Active/Inactive
  const handleOk = () => {
    setLoadingInactive(true);
    dispatch(
      inactiveProductClass({
        id: chooseId,
        activeOrInactive:
          activeOrInactive === "ACTIVE" ? "Inactivated" : "Activated",
      })
    )
      .unwrap()
      .then(() => {
        setModalInactive(false);
        handleRefresh();
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message });
          setModalError(true);
        }
      })
      .finally(() => {
        setLoadingInactive(false);
      });
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
      sorter: true,
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 240,
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
      sorter: true,
      title: "DESCRIPTION",
      key: "description",
      with: 240,
      dataIndex: "description",
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
      sorter: true,
      title: "STATUS",
      key: "status",
      dataIndex: "status",
      fixed: "right",
      width: 160,
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
  ];

  // Same icon component/style as Pricing.js's table (nxGetAccountActions) —
  // Update/Activate keep ProductClass's own eligibility rules, overridden
  // after the shared action list is built so the markup stays identical.
  const itemActions = nxGetAccountActions({
    handleView: (record) => {
      dispatch(getDetailProductClass(record?.productClassId));
      setModalDetail(true);
    },
    handleCreate: () => navigate(PRODUCT_PROMO_ROUTES.CREATE_PRODUCT_CLASS),
    handleUpdate: (record) =>
      navigate(PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT_CLASS, {
        state: { id: record?.productClassId },
      }),
    handleDownload,
    loadingDownload,
    handleActivate: handleActiveOrInactive,
  }).map((item) => {
    if (item.action === "Update") {
      return {
        ...item,
        render: (record, actionLength, index) => {
          const isEditable = record?.status !== "INACTIVE";
          return actionLength > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color="#0075bf" width={20} />}
              disabled={!isEditable}
              onClick={() =>
                isEditable &&
                navigate(PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT_CLASS, {
                  state: { id: record?.productClassId },
                })
              }
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
                onClick={() =>
                  isEditable &&
                  navigate(PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT_CLASS, {
                    state: { id: record?.productClassId },
                  })
                }
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
              disabled={!isActive}
              onClick={() => handleActiveOrInactive(record)}
            >
              <span className="text-black ml-3">
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

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleOk();
    setModalError(false);
    setBodyError({});
  };

  const tableColumns = [
    ...columns,
    ...useColumnActionPermission(["view", "Update", "Activate"], itemActions),
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="Product Class List" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemActions} type="page" />
          <NxTable
            idTable="product-class-table"
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

      {/* Modal Detail */}
      <ProductClassDetail
        data_detail={data_detail}
        openModal={modalDetail}
        closeModal={() => setModalDetail(false)}
      />

      {/* Modal Confirmation Inactive */}
      <ModalConfirm
        isOpen={modalInactive}
        handleCancel={() => setModalInactive(false)}
        handleOk={handleOk}
        width={activeOrInactive === "ACTIVE" ? 600 : 400}
        useOk={true}
        loading={loadingInactive}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            {`Are you sure want to ${
              activeOrInactive === "ACTIVE" ? "inactivate" : "activate"
            } ?`}
          </p>
        </div>
        {activeOrInactive === "ACTIVE" ? (
          <Alert
            message="Warning! if you inactivate this data, it can't be used."
            type={"error"}
          />
        ) : null}
      </ModalConfirm>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not inactivated. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default ProductClassView;
