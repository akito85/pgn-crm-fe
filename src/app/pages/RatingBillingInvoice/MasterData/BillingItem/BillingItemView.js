import { Checkbox, Tooltip } from "antd";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { columns } from "./Table/TableBillingItem";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import {
  getBillingItemList,
  getAvailableApproval,
  getSelectedApproval,
  inactiveBillingItem,
  getApprovalHistory,
  downloadBillingItem,
} from "../../../../../redux/slices/rating_billing_invoice/billingItem";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import CardContainer from "../../../../../components/CardContainer";
import { clearBodyMessage } from "../../../../../redux/slices/general_slice";

const INITIAL_PAGE_SIZE = 100;
const LOAD_MORE_SIZE = 20;

const BillingItemView = () => {
  // Selector
  const { data_view, data_ApprovalHistory, loading } = useSelector(
    (state) => state.billing_item,
  );
  const { bodyError: bodyErrorGeneral } = useSelector(
    (state) => state?.general,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  const [modalInactive, setModalInactive] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [chooseId, setChooseId] = useState();
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  // ─── Infinite Scroll: initial fetch & re-fetch on filter/sort change ───────
  useEffect(() => {
    dispatch(
      getBillingItemList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: INITIAL_PAGE_SIZE,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);

  // trigger modal try again from general slice
  useEffect(() => {
    if (bodyErrorGeneral?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyErrorGeneral]);

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: "", breadcrumbName: "Transaction Mapping" },
  ];

  useEffect(() => {
    if (data_ApprovalHistory && data_ApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_ApprovalHistory?.dataApprover?.BILLING_ITEM || [],
          inactive:
            data_ApprovalHistory?.dataApprover?.INACTIVE_BILLING_ITEM || [],
        },
        dataHistory: {
          create: data_ApprovalHistory?.dataHistory?.BILLING_ITEM || [],
          inactive:
            data_ApprovalHistory?.dataHistory?.INACTIVE_BILLING_ITEM || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_ApprovalHistory]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // ─── Infinite Scroll: load more handler ──────────────────────────────────
  const currentList = useMemo(
    () => data_view?.result || [],
    [data_view],
  );
  const totalElements = data_view?.page?.totalElements || 0;
  const hasMore = currentList.length < totalElements;

  const handleLoadMore = async () => {
    if (!hasMore) return;

    const nextPage = Math.floor(currentList.length / LOAD_MORE_SIZE) + 1;

    await dispatch(
      getBillingItemList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: LOAD_MORE_SIZE,
        sort,
        isLoadMore: true,
      }),
    );
    setPage(nextPage);
  };

  // ─── Refresh ──────────────────────────────────────────────────────────────
  const handleRefresh = () => {
    dispatch(
      getBillingItemList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: INITIAL_PAGE_SIZE,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  };

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistory(id));
    setModalApprovalHistory(true);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    dispatch(
      downloadBillingItem({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: LOAD_MORE_SIZE,
        sort,
      }),
    );
  };

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleRetry = () => {
    if (bodyError?.body && bodyError?.handleClear) {
      handleOk(bodyError?.body, bodyError?.handleClear);
    }
    setModalError(false);
    setBodyError({});
    dispatch(clearBodyMessage());
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
    dispatch(clearBodyMessage());
  };

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      id: chooseId.id,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveBillingItem(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        // Refresh list after inactivate
        dispatch(
          getBillingItemList({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: INITIAL_PAGE_SIZE,
            sort,
            isLoadMore: false,
          }),
        );
        setPage(1);
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
      });
  };

  // Grant Access Item
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.BILLING_ITEM_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Transaction Mapping
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.BILLING_ITEM_DETAIL}
            state={{ id: record.billingItemCode }}
          >
            <Tooltip title="Detail">
              <div>
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED" ||
          (record.status === "ACTIVE" && record.statusApproval === "APPROVED");

        const linkContent =
          data > 3 ? (
            isEditable ? (
              <ButtonComponent
                icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
                border={false}
              >
                <span className="text-black ml-3">Update</span>
              </ButtonComponent>
            ) : (
              <div className="flex items-center px-1 py-1 cursor-not-allowed">
                <span className="pointer-events-none">
                  <SVGIcon name="IconEdit" color="#8D91A0" width={24} />
                </span>
                <span className="text-[#8D91A0] ml-4 pointer-events-none">
                  Update
                </span>
              </div>
            )
          ) : (
            <Tooltip title="Update">
              <div>
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={isEditable ? "#ACC424" : "#8D91A0"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={RBI_ROUTES.BILLING_ITEM_UPDATE}
            state={{
              id: record.billingItemCode,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div>{linkContent}</div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActivateOrInactivate =
          (record.statusApproval === "APPROVED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "WAITING APPROVAL" &&
            record.status === "ACTIVE");

        const isActive = record.status === "ACTIVE";

        const Content =
          data > 3 ? (
            isActivateOrInactivate ? (
              <ButtonComponent
                icon={
                  <Checkbox
                    className="inactive-check"
                    disabled={false}
                    checked={!isActive}
                  />
                }
                border={false}
                onClick={() => handleInactive(record)}
              >
                <span className="text-black ml-5">Inactivate</span>
              </ButtonComponent>
            ) : (
              <div className="flex items-center px-2 py-1">
                <Checkbox
                  className="inactive-check"
                  disabled={true}
                  checked={false}
                />
                <span className="text-[#8D91A0] ml-5">Inactivate</span>
              </div>
            )
          ) : (
            <Tooltip title="Inactivate">
              <div>
                <Checkbox
                  className="inactive-check"
                  onClick={
                    isActivateOrInactivate
                      ? () => handleInactive(record)
                      : undefined
                  }
                  disabled={!isActivateOrInactivate}
                  checked={isActivateOrInactivate && !isActive}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record.id)}
            >
              <span className={"text-black ml-3"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div>
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => handleApprovalHistory(record.id)}
                />
              </div>
            </Tooltip>
          );
        return Content;
      },
    },
  ];

  // Get base columns from TableBillingItem
  const baseColumns = useMemo(() => {
    return columns(
      search,
      page,
      LOAD_MORE_SIZE,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    );
  }, [search, page, searchedColumn, searchText]);

  const actionCols = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: 100,
    align: "center",
  }));

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px]">TRANSACTION MAPPING LIST</p>
            <div className="mt-[15px] flex gap-[20px]">
              <Toolbar items={itemGrantAccess} />
            </div>
          </div>
        }
      >
        <div className="my-0">
          <TableRBI
            dataSource={currentList}
            columns={processedColumns}
            totalData={totalElements}
            tableScrolled={{ x: 2300, y: 525 }}
            onSort={onSort}
            showExport={true}
            columnDefinitions={columnDefinitions}
            handleDownload={handleDownload}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            showRefresh={true}
            onRefresh={handleRefresh}
            loadMoreThreshold={20}
            enableRowClick={false}
          />
        </div>
      </CardContainer>

      {/* Modal Inactive */}
      {modalInactive ? (
        <ModalInactivateWithHierarchy
          selector={"billing_item"}
          dispatch={dispatch}
          getAPIOption={getAvailableApproval}
          getAPIDetail={getSelectedApproval}
          alertMessage={`Are you sure you want to inactivate this Transaction mapping with name ${
            chooseId?.billingItemCode || ""
          }?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />
      ) : null}

      {/* Modal Approval History */}
      <ModalHistory
        isOpen={modalApprovalHistory && dataApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        width={1000}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />

      {/* Modal Error Inactive */}
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
          <p className="pl-[70px]">
            {bodyError?.message ||
              bodyErrorGeneral?.response?.data?.message?.toString()}
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </LayoutMenu>
  );
};

export default BillingItemView;