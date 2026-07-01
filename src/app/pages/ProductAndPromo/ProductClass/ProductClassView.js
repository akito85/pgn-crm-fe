import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, Checkbox, Alert, Popover, Skeleton } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { NavLink, Link } from "react-router-dom";
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
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";

const PAGE_SIZE = 20;

const RenderProductClassActions = ({ record, itemRender = [], totalLength, permissions = [] }) => {
  const [open, setOpen] = useState(false);
  const sliceColumn = "view";

  if (totalLength > 2) {
    return (
      <div className="w-full flex justify-center items-center gap-2.5">
        <Popover
          open={open}
          onOpenChange={setOpen}
          trigger="click"
          placement="bottomRight"
          showArrow={false}
          overlayInnerStyle={{ border: "1px solid #C8CDD4" }}
          className="text-black transition-colors duration-300 hover:text-[#0075bf]"
          content={
            <div className="flex flex-col">
              {itemRender
                ?.filter((item) => item?.action !== sliceColumn)
                ?.sort((a, b) => (a?.action || "").localeCompare(b?.action || ""))
                ?.map((item, index) => {
                  if (permissions?.includes(item?.action)) {
                    return (
                      <div key={item.action} className="inline-flex items-center text-black" onClick={() => setOpen(false)}>
                        {item?.render(record, totalLength, index)}
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          }
        >
          <div className="inline-flex items-center cursor-pointer">
            <IconThreeDots />
          </div>
        </Popover>
        <div className="inline-flex items-center">
          {itemRender
            ?.filter((item) => item?.action === sliceColumn)
            ?.map((item, index) => {
              if (permissions?.includes(sliceColumn)) {
                return item?.render(record, totalLength, index);
              }
              return null;
            })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center gap-2.5 items-center">
      {itemRender?.map((item, index) => {
        if (permissions?.includes(item?.action)) {
          return (
            <span key={item.action} className="inline-flex items-center">
              {item?.render(record, totalLength, index)}
            </span>
          );
        }
        return null;
      })}
    </div>
  );
};

const useProductClassActionPermission = (permissionList = [], itemsRender = []) => {
  const access = useGrantAccessHooks("page");
  const isLoading = access?.loading;

  const lowerCaseAccessList = useMemo(
    () => access?.actions?.map((item) => item?.toLowerCase()),
    [access]
  );
  const lowerCasePermissionList = useMemo(
    () => permissionList?.map((item) => item?.toLowerCase()),
    [permissionList]
  );
  const lowerCaseItemsRender = useMemo(
    () =>
      itemsRender
        ?.map((item) => ({ ...item, action: item?.action?.toLowerCase() }))
        ?.filter((item) => item?.type === "table"),
    [itemsRender]
  );

  const arrayActions = useMemo(() => {
    const filtered = lowerCaseAccessList?.filter((item) =>
      lowerCasePermissionList?.includes(item)
    );
    return lowerCaseItemsRender
      ?.filter((itemRender) => filtered?.includes(itemRender?.action))
      ?.map((item) => item?.action);
  }, [lowerCaseAccessList, lowerCaseItemsRender, lowerCasePermissionList]);

  return useMemo(() => {
    if (isLoading) {
      return [
        {
          key: "action",
          title: "ACTION",
          dataIndex: "action",
          fixed: "right",
          width: 111,
          render: () => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", transform: "scaleY(0.55)", transformOrigin: "center" }}>
                <Skeleton.Button active size="small" shape="round" block />
              </div>
            </div>
          ),
        },
      ];
    }
    if (!arrayActions || arrayActions.length === 0) return [];
    return [
      {
        key: "action",
        title: "ACTION",
        dataIndex: "action",
        fixed: "right",
        width: 90,
        render: (text, record, index) => (
          <RenderProductClassActions
            text={text}
            record={record}
            index={index}
            itemRender={lowerCaseItemsRender}
            totalLength={arrayActions.length}
            permissions={arrayActions}
          />
        ),
      },
    ];
  }, [isLoading, arrayActions, lowerCaseItemsRender]);
};

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
  const hasMore = !limitData && dataSource.length < (totalElement || 0);

  const [modalDetail, setModalDetail] = useState(false);
  const [chooseId, setChooseId] = useState("");
  const [modalInactive, setModalInactive] = useState(false);
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

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
  const handleDownload = () => {
    dispatch(
      downloadProductClass({ ...buildBody(1) })
    );
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalInactive(true);
    setChooseId(record?.productClassId);
    setActiveOrInactive(record?.status);
  };

  // handle Active/Inactive
  const handleOk = () => {
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

  const itemsActionView = [
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
    {
      action: "Create",
      render: (
        <NavLink to={PRODUCT_PROMO_ROUTES.CREATE_PRODUCT_CLASS}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Product Class
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
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => {
                  dispatch(getDetailProductClass(record?.productClassId));
                  setModalDetail(true);
                }}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const render =
          data_length >= 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
              border={false}
            >
              {data_length >= 3 && (
                <span className="text-black ml-1"> Update</span>
              )}
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={record?.status !== "INACTIVE" ? "#ACC424" : "#8D91A0"}
                  className={
                    record?.status === "INACTIVE" ? "disabled" : undefined
                  }
                />
              </div>
            </Tooltip>
          );

        return record?.status !== "INACTIVE" ? (
          <Link
            to={PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT_CLASS}
            state={{ id: record?.productClassId}}
          >
            {render}
          </Link>
        ) : (
          render
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        return data_length >= 3 ? (
          <ButtonComponent
            icon={
              <Checkbox
                className="inactive-check"
                disabled={record?.status === "ACTIVE" ? false : true}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            }
            border={false}
            onClick={() => handleActiveOrInactive(record)}
          >
            <span className="text-black ml-3">
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
                onClick={() => handleActiveOrInactive(record)}
                disabled={record?.status === "ACTIVE" ? false : true}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

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
    ...useProductClassActionPermission(
      ["view", "Update", "Activate"],
      itemsActionView
    ),
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="Product Class List" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemsActionView} type="page" />
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
