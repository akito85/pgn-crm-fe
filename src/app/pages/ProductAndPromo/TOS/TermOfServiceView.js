import React, { useCallback, useEffect, useRef, useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip, Checkbox } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import SVGIcon from "../../../../assets/Icon/index";
import {
  downloadTOS,
  getAllTosPaginate,
  inactiveTos,
} from "../../../../redux/slices/product_promo/tos";
import TermOfServiceDetail from "./Modal/TermOfServiceDetail";
import TermOfServiceInactive from "./Modal/TermOfServiceInactive";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const PAGE_SIZE = 20;

const formatStatus = (value) => {
  switch (value) {
    case "WAITING APPROVAL":
    case "WAITING_FOR_APPROVAL":
    case "WAITING_APPROVAL":
      return "Waiting Approval";
    default:
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
  }
};

const TermOfServiceView = () => {
  // Selector
  const {
    list_tos: dataSource,
    pagination_tos: pagination,
    loading_listTos: loading,
  } = useSelector((state) => state.tos);

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

  const [modalInactive, setModalInactive] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [chooseId, setChooseId] = useState("");
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
    dispatch(getAllTosPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [dispatch, buildBody]);

  // Re-fetch page 1 whenever sort / search / filters change
  useEffect(() => {
    dispatch(getAllTosPaginate({ ...buildBody(1), isLoadMore: false }));
    setPage(1);
  }, [sort, search, searchText, filters, filterRules, limitData]); // intentionally omit dispatch/buildBody to avoid loop

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    // page is 0-based, totalPage is a count → last valid index is totalPage-1.
    if (nextPage <= (pagination.totalPage || 1)) {
      // await so NxTable's infinite-scroll gate stays closed until the fetch
      // settles — prevents duplicate page dispatches on fast scrolling.
      await dispatch(getAllTosPaginate({ ...buildBody(nextPage), isLoadMore: true }));
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
      path: PRODUCT_PROMO_ROUTES.VIEW_TOS_NEWS,
      breadcrumbName: "Terms Of Service",
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

  const columns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "NAME",
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
      title: "ATTRIBUTE",
      key: "attributes",
      dataIndex: "attributes",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "attributes",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "attributes",
          hasValue(search["attributes"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "CRITERIA",
      key: "criterias",
      dataIndex: "criterias",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "criterias",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "criterias",
          hasValue(search["criterias"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      key: "description",
      dataIndex: "description",
      sorter: true,
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
      key: "status",
      dataIndex: "status",
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
  ];

  // Handle Confirmation Inactive
  const handleInactive = (id) => {
    setModalInactive(true);
    setChooseId(id);
  };

  // Handle Modal Detail
  const handleDetail = (id) => {
    setModalDetail(true);
    setChooseId(id);
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadTOS({ ...buildBody(1) })
    );
  };

  // handle Active/Inactive
  const handleOk = () => {
    dispatch(inactiveTos({ id: chooseId }))
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

  const itemsActionView = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
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
        <NavLink
          to={PRODUCT_PROMO_ROUTES.CREATE_TERM_OF_SERVICE}
          state={{ x: 1 }}
        >
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Terms Of Service
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
                  handleDetail(record?.id);
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
        const isEditable = record?.status === "ACTIVE";

        const render =
          data_length > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
              border={false}
              disabled={!isEditable}
            >
              {data_length > 3 && (
                <span className="text-black ml-3"> Update</span>
              )}
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <div
                  className={
                    record?.status === "INACTIVE" ? "cursor-not-allowed" : ""
                  }
                >
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    color={
                      record?.status !== "INACTIVE" ? "#ACC424" : "#8D91A0"
                    }
                    className={
                      record?.status === "INACTIVE" ? "disabled" : undefined
                    }
                  />
                </div>
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <NavLink
            to={PRODUCT_PROMO_ROUTES.UPDATE_TERM_OF_SERVICE}
            state={{ id: record?.id, status: record?.approvalStatus }}
          >
            {render}
          </NavLink>
        ) : (
          render
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const isActivateOrInactivate = record?.status === "ACTIVE";

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
            onClick={() => handleInactive(record?.id)}
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
                onClick={() => {
                  handleInactive(record?.id);
                }}
                disabled={record?.status === "ACTIVE" ? false : true}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

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
    handleOk();
    setModalError(false);
    setBodyError({});
  };

  const tableColumns = [
    ...columns,
    ...useColumnActionPermission(
      ["view", "Update", "Activate"],
      itemsActionView
    ),
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="Terms Of Service Information" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={itemsActionView} type="page" />
          <NxTable
            idTable="tos-table"
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

      {/* Modal Detail TOS */}
      {chooseId !== "" ? (
        <TermOfServiceDetail
          openModal={modalDetail}
          closeModal={() => {
            setChooseId("");
            setModalDetail(false);
          }}
          id={chooseId}
        />
      ) : null}

      {/* Modal Detail Inactivate */}
      <TermOfServiceInactive
        isOpen={modalInactive}
        handleCancel={() => setModalInactive(false)}
        handleOk={() => handleOk()}
      />

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

export default TermOfServiceView;
