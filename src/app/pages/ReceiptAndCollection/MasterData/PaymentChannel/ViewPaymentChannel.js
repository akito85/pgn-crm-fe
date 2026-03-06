import {
  Checkbox,
  Tooltip,
} from "antd";
import React, { useEffect, useRef, useState, useMemo } from "react";
import CardContainer from "../../../../../components/CardContainer";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
  EyeOutlined,
} from "@ant-design/icons";
import {
  renderColumn,
  renderDateColumn,
  hasValue,
  disabledActionByStatus,
} from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import {
  getApprovalHistory,
  getDownloadPaymentChannel,
  getPaginatePaymentChannel,
  inactivePaymentChannel,
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/receipt_collection/paymentChannel";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

const ViewPaymentChannel = () => {
  // Selector
  const { loading, data, dataApprovalHistory } = useSelector(
    (state) => state.paymentChannel
  );
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [body, setBody] = useState({});
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [nameModalActiveOrInactivate, setNameModalActiveOrInactivate] = useState("");
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  const initialPageSize = 100;

  useEffect(() => {
    dispatch(
      getPaginatePaymentChannel({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
        isLoadMore: false,
      })
    );
    setPage(1);
  }, [dispatch, search, sort]);

  const hasMore =
    (data?.result?.length || 0) < (data?.page?.totalElements || 0);

  const handleLoadMore = async () => {
    if (!hasMore) return;
    const currentDataLength = data?.result?.length || 0;
    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;
    await dispatch(
      getPaginatePaymentChannel({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      })
    );
    setPage(nextPage);
  };

  const handleRefresh = () => {
    dispatch(
      getPaginatePaymentChannel({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
        isLoadMore: false,
      })
    );
    setPage(1);
  };

  // Breadcrumbs
  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: "", breadcrumbName: "Master Data" },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_CHANNEL,
      breadcrumbName: "Delivery Channel",
    },
  ];

  const handleOptions = () => {
    const d = dataApprovalHistoryFix?.dataApprover || {};
    return Object.keys(d).map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearch((prev) => {
      const next = { ...prev };
      delete next[dataIndex];
      return next;
    });
    setSearchText("");
  };

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.PAYMENT_CHANNEL || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_CHANNEL || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PAYMENT_CHANNEL || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_CHANNEL || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleApprovalHistory = async (id) => {
    try {
      setBody(id);
      await dispatch(getApprovalHistory(id))?.unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      setOpenModalHistory(false);
    }
  };
  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(r?.ciCode + " - " + r?.name);
    setStatus(r?.status);
  };

  const handleCancelModalInactivate = () => {
    setOpenModalInactivate(false);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      id: id,
      appHierId: res.approvalHierarchy,
      status: status === "Inactive" ? "Active" : "Inactive",
      remark: res.remark,
    };
    setBody({ body });
    dispatch(inactivePaymentChannel({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        handleRefresh();
      });
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle download
  const handleDownload = () => {
    dispatch(
      getDownloadPaymentChannel({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
      })
    );
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "code",
        title: "DELIVERY CHANNEL CODE",
        dataIndex: "code",
        width: 180,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.code] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "code", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("code", hasValue(search["code"]), searchText, text, true, "input", search),
      },
      {
        key: "name",
        title: "NAME",
        dataIndex: "name",
        width: 180,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.name] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "name", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("name", hasValue(search["name"]), searchText, text, true, "input", search),
      },
      {
        key: "category",
        title: "CATEGORY",
        dataIndex: "category",
        width: 150,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.category] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "category", searchInput, searchedColumn, searchText, handleSearch, false
        ),
        render: (text) =>
          renderColumn("category", hasValue(search["category"]), searchText, text, true, "input", search),
      },
      {
        key: "startDate",
        title: "START DATE",
        dataIndex: "startDate",
        width: 130,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.startDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "startDate", searchInput, searchedColumn, searchText, handleSearch, false, "date"
        ),
        render: (text) =>
          renderDateColumn("startDate", hasValue(search["startDate"]), searchText, text, "date", search),
      },
      {
        key: "endDate",
        title: "END DATE",
        dataIndex: "endDate",
        width: 130,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.endDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "endDate", searchInput, searchedColumn, searchText, handleSearch, false, "date"
        ),
        render: (text) =>
          renderDateColumn("endDate", hasValue(search["endDate"]), searchText, text, "date", search),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 110,
        sorter: true,
        isClassification: true,
        fixed: "right",
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "status", searchInput, searchedColumn, searchText, handleSearch, false
        ),
        render: (text) =>
          renderColumn("status", hasValue(search["status"]), searchText, text, false, "status", search),
      },
      {
        key: "statusApproval",
        title: "STATUS APPROVAL",
        dataIndex: "statusApproval",
        width: 160,
        sorter: true,
        isClassification: true,
        fixed: "right",
        filteredValue: [search?.statusApproval] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, false
        ),
        render: (text) =>
          renderColumn("status", hasValue(search["statusApproval"]), searchText, text, false, "status", search),
      },
    ],
    [search, searchText, searchedColumn]
  );


  const itemActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PAYMENT_CHANNEL}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            border={false}
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Link
          to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_CHANNEL}
          state={{ id: record?.id }}
          style={{ lineHeight: 0 }}
        >
          <Tooltip title="Detail">
            <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
          </Tooltip>
        </Link>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record) => {
        const isEditable =
          record.statusApproval === "Draft" || record.statusApproval === "Rejected";
        return (
          <Tooltip title="Update">
            <div
              onClick={(e) => { if (!isEditable) e.preventDefault(); }}
              className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
              {isEditable ? (
                <Link
                  to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PAYMENT_CHANNEL}
                  state={{ id: record?.id }}
                >
                  <SVGIcon name="IconEdit" color="#ACC424" width={20} />
                </Link>
              ) : (
                <SVGIcon name="IconEdit" color="#8D91A0" width={20} />
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record) => {
        const statusLowerCase = record?.status?.toLowerCase();
        return (
          <Tooltip
            title={
              statusLowerCase === "active" || statusLowerCase === "draft"
                ? "Inactivate"
                : "Activate"
            }
          >
            <div>
              <Checkbox
                onClick={() => handleInactive(record)}
                checked={record?.status !== "Active"}
                disabled={disabledActionByStatus(
                  "activate",
                  record?.status,
                  record?.statusApproval
                )}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "history",
      type: "table",
      render: (record) => (
        <Tooltip title="Approval History">
          <div
            style={{ lineHeight: 0 }}
            onClick={() => handleApprovalHistory(record?.id)}
          >
            <SVGIcon name="IconLogHistory" color="#0075bf" width={20} />
          </div>
        </Tooltip>
      ),
    },
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "GET_APPROVAL_PAYMENT_CHANNEL") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_PAYMENT_CHANNEL") {
        handleDownload();
      }
      handleRefresh();
    } catch (error) {
      handleRefresh();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);


  const actionCols = useColumnActionPermission(
    ["view", "update", "activate", "history"],
    itemActions
  ).map((col) => ({
    ...col,
    key: col.action,
    width: 60,
    align: "center",
  }));

  const allColumns = useMemo(() => {
    const cols = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return cols;
  }, [baseColumns, actionCols]);

  const columnDefinitions = useMemo(
    () =>
      allColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [allColumns]
  );

  const handleAdvanceSearch = (searchData) => {
    const simpleSearch = {};

    if (searchData?.filters && Array.isArray(searchData.filters)) {
      searchData.filters.forEach((rule) => {
        if (
          rule.column &&
          rule.value !== undefined &&
          rule.value !== null &&
          rule.value !== ""
        ) {
          simpleSearch[rule.column] = rule.value;
        }
      });
    }

    if (searchData?.filterRules && Array.isArray(searchData.filterRules)) {
      searchData.filterRules.forEach((ruleGroup) => {
        if (Array.isArray(ruleGroup)) {
          ruleGroup.forEach((rule) => {
            if (
              rule?.column &&
              rule?.value !== undefined &&
              rule?.value !== null &&
              rule?.value !== "" &&
              rule?.condition
            ) {
              const conditionKey = rule.condition === "Equal to" ? "" : rule.condition;
              simpleSearch[`${rule.column}${conditionKey}`] = rule.value;
            }
          });
        }
      });
    }

    setSearch(simpleSearch);
    setSearchedColumn(Object.keys(simpleSearch)[0]);
    setSearchText(Object.values(simpleSearch)[0]);
    setPage(1);

    dispatch(
      getPaginatePaymentChannel({
        search: encodeURIComponent(JSON.stringify(simpleSearch)),
        page: 1,
        pageSize: initialPageSize,
        sort,
        isLoadMore: false,
      })
    );
  };

  const columns = useMemo(() => {
    const base = [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        isClassification: true,
        render: (text, object, index) => index + 1,
      },
      ...allColumns,
    ];
    return applyFixedColumns(base, fixedColumns);
  }, [allColumns, fixedColumns]);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">DELIVERY CHANNEL LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }
      >
        <TableRBI
          idTable="delivery-channel-table"
          size="small"
          dataSource={data?.result}
          loading={loading}
          columns={columns}
          onSort={onSort}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          totalData={data?.page?.totalElements}
          tableScrolled={{ x: "max-content", y: 525 }}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          columnDefinitions={columnDefinitions}
          handleDownload={handleDownload}
          showExport={false}
          usePagination={false}
          showRefresh={true}
          onRefresh={handleRefresh}
          loadMoreThreshold={20}
          onAdvanceSearch={handleAdvanceSearch}
        />
      </CardContainer>

      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
      <ModalActiveInactive
        dispatch={dispatch}
        getAPIOption={getAllApprovalList}
        getAPIDetail={getListApprovalById}
        selector={"paymentChannel"}
        alertMessage={`Are you sure you want to inactivate this Delivery Channel with Delivery Channel Code ${nameModalActiveOrInactivate}?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSubmitModalInactivate}
      />
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewPaymentChannel;
