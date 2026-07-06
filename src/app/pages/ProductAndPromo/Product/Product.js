import React, { useCallback, useEffect, useRef, useState } from "react";
import { Checkbox, Switch, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Link, NavLink } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalWarningConfirmation from "../../../../components/Modal/ModalWarningConfirmation";
import {
  downloadProduct,
  getAllProductPaginate,
  inactiveProduct,
  lockProduct,
  getListAppHierInactive,
  getListAppHierDetailInactive,
  getApprovalHistoryProduct,
} from "../../../../redux/slices/product_promo/product";
import {
  getColumnSearchPropsUseFilteredValue,
} from "../../../../utils/getColumnSearchProps";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const PAGE_SIZE = 20;

const formatStatus = (value) => {
  switch (value) {
    case "WAITING APPROVAL":
    case "WAITING FOR APPROVAL":
    case "WAITING_FOR_APPROVAL":
    case "WAITING_APPROVAL":
      return "Waiting Approval";
    default:
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
  }
};

const columns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => {
  return [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "LATEST VERSION",
      key: "lastVersion",
      width: 240,
      sorter: true,
      align: "right",
      dataIndex: "lastVersion",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lastVersion",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "lastVersion",
          hasValue(search["lastVersion"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "PRODUCT NAME",
      key: "productName",
      width: 240,
      sorter: true,
      dataIndex: "productName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "productName",
          hasValue(search["productName"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "PRODUCT TYPE",
      key: "productTypeName",
      width: 240,
      sorter: true,
      dataIndex: "productTypeName",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "productTypeName",
          hasValue(search["productTypeName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "SERVICE TYPE",
      key: "serviceTypeName",
      width: 240,
      sorter: true,
      dataIndex: "serviceTypeName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serviceTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "serviceTypeName",
          hasValue(search["serviceTypeName"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "PRODUCT CLASS",
      key: "productClassName",
      width: 240,
      sorter: true,
      dataIndex: "productClassName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productClassName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "productClassName",
          hasValue(search["productClassName"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "PRICING",
      key: "pricing",
      width: 240,
      sorter: true,
      dataIndex: "pricing",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "pricing",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "pricing",
          hasValue(search["pricing"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "LOCKED BY",
      key: "lockedBy",
      width: 240,
      sorter: true,
      dataIndex: "lockedBy",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lockedBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "lockedBy",
          hasValue(search["lockedBy"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "MAKER POSITION",
      key: "makerPosition",
      width: 240,
      sorter: true,
      dataIndex: "makerPosition",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "makerPosition",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "makerPosition",
          hasValue(search["makerPosition"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "START DATE",
      key: "startDate",
      width: 200,
      sorter: true,
      align: "center",
      dataIndex: "startDate",
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
      key: "endDate",
      width: 200,
      sorter: true,
      align: "center",
      dataIndex: "endDate",
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
      key: "productDescription",
      width: 320,
      sorter: true,
      dataIndex: "productDescription",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productDescription",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "productDescription",
          hasValue(search["productDescription"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      width: 160,
      sorter: true,
      fixed: "right",
      dataIndex: "status",
      key: "status",
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
      width: 240,
      sorter: true,
      fixed: "right",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "approvalStatus",
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
};
// Breadcrumbs
const routes = [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRODUCT,
    breadcrumbName: "Product",
  },
];

const itemsActionView = (
  handleOpenModalInactivate = () => {},
  handleApprovalHistory = () => {},
  handleOpenModalLock = () => {},
  handleDownload = () => {},
  dataUser = {},
  loadingDownload = false,
) => [
  {
    action: "Download",
    render: (
      <ButtonComponent
        icon={<SVGIcon name="IconButtonDownload" width={24} />}
        type="submit"
        onClick={handleDownload}
        loading={loadingDownload}
        disabled={loadingDownload}
      >
        Download List
      </ButtonComponent>
    ),
  },
  {
    action: "Create",
    render: (
      <NavLink
        to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT}
        state={{ prevPage: "table-product" }}
      >
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
        >
          Create Product
        </ButtonComponent>
      </NavLink>
    ),
  },
  //table
  //last placement for outside popover
  {
    action: "view",
    type: "table",
    render: (record, data_length) => {
      return (
        <Tooltip title="Detail">
          <Link
            to={PRODUCT_PROMO_ROUTES.DETAIL_PRODUCT}
            state={{ id: record?.id }}
          >
            <SVGIcon name="IconDetail" width={24} />
          </Link>
        </Tooltip>
      );
    },
  },
  {
    action: "Lock",
    type: "table",
    render: (record, data_length) => {
      const isEditable =
        record.status !== "INACTIVE" &&
        (!record.lockedBy || record.lockedBy === dataUser?.data?.username);

      return (
        <ButtonComponent
          icon={
            <Switch
              className="inactive-check"
              checked={record?.lockStatus === "Y"}
              // disabled={isEditable}
            />
          }
          border={false}
          disabled={!isEditable}
          onClick={() => handleOpenModalLock(record)}
        >
          <span className={"text-black"}>
            {record?.lockStatus === "Y" && data_length > 3 ? "Unlock" : "Lock"}
          </span>
        </ButtonComponent>
      );
    },
  },
  {
    action: "Activate",
    type: "table",
    render: (record, data_length) => {
      const isActivateOrInactivate =
        (record.approvalStatus === "APPROVED" && record.status === "ACTIVE") ||
        (record.approvalStatus === "DRAFT" && record.status === "ACTIVE") ||
        (record.approvalStatus === "REJECTED" && record.status === "ACTIVE");

      return data_length > 3 ? (
        <ButtonComponent
          icon={
            <Checkbox
              className="inactive-check"
              disabled={record?.status === "ACTIVE" ? false : true}
              checked={record?.status === "ACTIVE" ? false : true}
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
        <Tooltip
          title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
        >
          <div className="pt-1">
            <Checkbox
              className="inactive-check"
              onClick={() => handleOpenModalInactivate(record)}
              disabled={record?.status === "ACTIVE" ? false : true}
              checked={record?.status === "ACTIVE" ? false : true}
            />
          </div>
        </Tooltip>
      );
    },
  },
  {
    action: "History",
    type: "table",
    render: (record, data_length) => {
      return data_length > 3 ? (
        <ButtonComponent
          icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />}
          border={false}
          onClick={() => handleApprovalHistory(record)}
        >
          <span className={"text-black ml-3"}>Approval History</span>
        </ButtonComponent>
      ) : (
        <Tooltip title="Approval History">
          <div className="pt-1">
            <SVGIcon
              name="IconLogHistory"
              color={"#0075bf"}
              width={24}
              onClick={() => handleApprovalHistory(record)}
            />
          </div>
        </Tooltip>
      );
    },
  },
];
const Product = () => {
  const dispatch = useDispatch();
  const {
    list_product: dataSource,
    pagination_product: pagination,
    loading_listProduct: loading,
    dataApprovalHistoryProduct = {},
  } = useSelector((state) => state.product);

  const totalElement = pagination.totalElement;

  const searchInput = useRef(null);
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

  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [openModalLock, setOpenModalLock] = useState(false);
  const [dataLock, setDataLock] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const { data: dataUser = {} } = useSelector((state) => state.profile);

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
    dispatch(getAllProductPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [dispatch, buildBody]);

  // Re-fetch page 1 whenever sort / search / filters change
  useEffect(() => {
    dispatch(getAllProductPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [sort, search, searchText, filters, filterRules, limitData]); // intentionally omit dispatch/buildBody to avoid loop

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    // page is 0-based, totalPage is a count → last valid index is totalPage-1.
    if (nextPage <= (pagination.totalPage || 1)) {
      // await so NxTable's infinite-scroll gate stays closed until the fetch
      // settles — prevents duplicate page dispatches on fast scrolling.
      await dispatch(getAllProductPaginate({ ...buildBody(nextPage), isLoadMore: true }));
      setPage(nextPage);
    }
  };

  useEffect(() => {
    if (dataApprovalHistoryProduct?.dataApprover) {
      const temp = {
        dataApprover:
          dataApprovalHistoryProduct?.dataApprover?.INACTIVE_PRODUCT || [],
        dataHistory:
          dataApprovalHistoryProduct?.dataHistory?.INACTIVE_PRODUCT || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [dataApprovalHistoryProduct]);

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

  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistoryProduct(data.id));
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
      id: dataInactivate.id, //Product Id
      apphierId: res.approvalHierarchy,
      description: res.remark,
    };
    dispatch(inactiveProduct({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
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
          setBodyError({
            body: { ...res },
            type: "INACTIVE",
            handleClear,
            message,
          });
          setModalError(true);
        }
      });
  };
  const handleOpenModalLock = (data) => {
    setDataLock(data);
    setOpenModalLock(true);
  };
  const handleCancelModalLock = () => {
    setDataLock({});
    setOpenModalLock(false);
  };
  const handleSubmitModalLock = (res, handleClear) => {
    const data = {
      refId: dataLock.id, //ID Product
      lockType: dataLock?.lockStatus === "Y" ? "UNLOCK" : "LOCK", //LOCK, UNLOCK
      description: res.remark,
    };
    dispatch(lockProduct({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalLock();
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
          setBodyError({
            body: { ...res },
            type: data.lockType,
            handleClear,
            message,
          });
          setModalError(true);
        }
      });
  };
  const onSort = (_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    switch (bodyError.type) {
      case "LOCK":
      case "UNLOCK":
        handleSubmitModalLock(bodyError.body, bodyError.handleClear);
        break;
      case "INACTIVE":
        handleSubmitModalInactivate(bodyError.body, bodyError.handleClear);
        break;
      default:
        break;
    }
    setModalError(false);
    setBodyError({});
  };

  const handleDownload = async () => {
    setLoadingDownload(true);
    await dispatch(downloadProduct({ ...buildBodyDownload(1) }));
    setLoadingDownload(false);
  };

  const renderType = () => {
    let text = "";
    if (bodyError.type) {
      switch (bodyError.type) {
        case "UNLOCK":
          text = "unlocked";
          break;
        case "LOCK":
          text = "locked";
          break;
        case "INACTIVE":
          text = "submitted";
          break;
        default:
          break;
      }
    }
    return text;
  };

  const itemActions = itemsActionView(
    handleOpenModalInactivate,
    handleApprovalHistory,
    handleOpenModalLock,
    handleDownload,
    dataUser,
    loadingDownload,
  );

  const actionCols = useColumnActionPermission(
    ["view", "Lock", "Activate", "History"],
    itemActions
  );

  const tableColumns = [
    ...columns(search, searchInput, searchedColumn, searchText, handleSearch),
    ...actionCols,
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer header="Product List" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemActions} type="page" />
          <NxTable
            idTable="product-table"
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
      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistory}
        handleClose={() => setOpenModalHistory(false)}
        header={"Inactive Approval History"}
        width={850}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />
      <ModalInactivateWithHierarchy
        dispatch={dispatch}
        getAPIOption={getListAppHierInactive}
        getAPIDetail={getListAppHierDetailInactive}
        selector="product"
        alertMessage={`Are you sure you want to inactivate Product named ${
          dataInactivate?.productName || ""
        }?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSubmitModalInactivate}
      />
      <ModalWarningConfirmation
        header={`${
          dataLock?.lockStatus === "Y" ? "Unlock" : "Lock"
        } Information`}
        alertMessage={`Are you sure you want to ${
          dataLock?.lockStatus === "Y" ? "Unlock" : "Lock"
        } Product named ${dataLock?.productName || ""}?`}
        openModal={openModalLock}
        handleClose={handleCancelModalLock}
        onFinish={handleSubmitModalLock}
      />

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
          <p className="pl-[70px]">{`Your data was not ${renderType()}, ${
            bodyError.message
          }.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default Product;
