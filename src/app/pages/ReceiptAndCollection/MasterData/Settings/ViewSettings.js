import { Checkbox, Tooltip } from "antd";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import CardContainer from "../../../../../components/CardContainer";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
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
  getAllApprovalListPayChannelConfig,
  getListApprovalByIdPayChannelConfig,
  getApprovalHistoryPayChannelConfig,
  getDownloadPayChannelConfig,
  getPaginatePayChannelConfig,
  inactivePayChannelConfig,
} from "../../../../../redux/slices/receipt_collection/setting";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";

const COLUMN_WIDTH = {
  PARTNER: 180,
  COLLECTING_AGENT: 200,
  DELIVERY_CHANNEL: 200,
  NAME: 200,
  TYPE: 150,
  DATE: 150,
  HOUR: 120,
  STATUS: 110,
  STATUS_APPROVAL: 160,
  ACTION: 60,
  NO: 60,
};

const ViewSettings = () => {
  const { loading, data, dataApprovalHistory } = useSelector(
    (state) => state.receiptSetting
  );
  const { bodyError } = useSelector((state) => state?.general);

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

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
    let isMounted = true;

    const fetchData = async () => {
      try {
        await dispatch(
          getPaginatePayChannelConfig({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: initialPageSize,
            sort,
            isLoadMore: false,
          })
        )?.unwrap?.();
        if (isMounted) {
          setPage(1);
        }
      } catch (error) {
        console.error("Failed to fetch pay channel config list", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, search, sort]);

  const hasMore = (data?.result?.length || 0) < (data?.page?.totalElements || 0);

  const handleLoadMore = async () => {
    if (!hasMore) return;
    const currentDataLength = data?.result?.length || 0;
    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;
    await dispatch(
      getPaginatePayChannelConfig({
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
      getPaginatePayChannelConfig({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
        isLoadMore: false,
      })
    );
    setPage(1);
  };

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS,
      breadcrumbName: "Payment Channel Configuration",
    },
  ];

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleSearch = useMemo(
    () => debounce((selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
    }, 500),
    []
  );

  const handleReset = useCallback((clearFilters, dataIndex) => {
    clearFilters();
    setSearch((prev) => {
      const next = { ...prev };
      delete next[dataIndex];
      return next;
    });
    setSearchText("");
  }, []);

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.PAY_CHANNEL_CONFIG || [],
          inactive: dataApprovalHistory?.dataApprover?.INACTIVE_PAY_CHANNEL_CONFIG || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PAY_CHANNEL_CONFIG || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_PAY_CHANNEL_CONFIG || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleApprovalHistory = async (data) => {
    try {
      await dispatch(getApprovalHistoryPayChannelConfig(data))?.unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      setOpenModalHistory(false);
    }
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "mappingName",
        title: "CA CI MAPPING NAME",
        dataIndex: "mappingName",
        width: COLUMN_WIDTH.NAME,
        sorter: true,
        isClassification: true,
        filteredValue: search?.mappingName !== undefined ? [search.mappingName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "mappingName", searchInput, searchedColumn, searchText, handleSearch, true, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("mappingName", hasValue(search["mappingName"]), searchText, text, true, "input", search),
      },
      {
        key: "partnerName",
        title: "PARTNER CODE",
        dataIndex: "partnerName",
        width: COLUMN_WIDTH.PARTNER,
        sorter: true,
        isClassification: true,
        filteredValue: search?.partnerName !== undefined ? [search.partnerName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "partnerName", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text, record) =>
          renderColumn("partnerName", hasValue(search["partnerName"]), searchText,
            record.partnerCode ? `${record.partnerCode} - ${record.partnerName}` : text, true, "input", search),
      },
      {
        key: "collectingAgentName",
        title: "COLLECTING AGENT",
        dataIndex: "collectingAgentName",
        width: COLUMN_WIDTH.COLLECTING_AGENT,
        sorter: true,
        isClassification: true,
        filteredValue: search?.collectingAgentName !== undefined ? [search.collectingAgentName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "collectingAgentName", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text, record) =>
          renderColumn("collectingAgentName", hasValue(search["collectingAgentName"]), searchText,
            record.caCode ? `${record.caCode} - ${record.collectingAgentName}` : text, true, "input", search),
      },
      {
        key: "deliveryChannelName",
        title: "DELIVERY CHANNEL",
        dataIndex: "deliveryChannelName",
        width: COLUMN_WIDTH.DELIVERY_CHANNEL,
        sorter: true,
        isClassification: true,
        filteredValue: search?.deliveryChannelName !== undefined ? [search.deliveryChannelName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "deliveryChannelName", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text, record) =>
          renderColumn("deliveryChannelName", hasValue(search["deliveryChannelName"]), searchText,
            record.deliveryChannelCode ? `${record.deliveryChannelCode} - ${record.deliveryChannelName}` : text, true, "input", search),
      },
      {
        key: "type",
        title: "TYPE",
        dataIndex: "type",
        width: COLUMN_WIDTH.TYPE,
        sorter: true,
        isClassification: true,
        filteredValue: search?.type !== undefined ? [search.type] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "type", searchInput, searchedColumn, searchText, handleSearch, true, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("type", hasValue(search["type"]), searchText, text, true, "input", search),
      },
      {
        key: "startDate",
        title: "START DATE",
        dataIndex: "startDate",
        width: COLUMN_WIDTH.DATE,
        sorter: true,
        isClassification: true,
        align: "center",
        filteredValue: search?.startDate !== undefined ? [search.startDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "startDate", searchInput, searchedColumn, searchText, handleSearch, false, "date", [], handleReset
        ),
        render: (text) =>
          renderDateColumn("startDate", hasValue(search["startDate"]), searchText, text, "date", search),
      },
      {
        key: "endDate",
        title: "END DATE",
        dataIndex: "endDate",
        width: COLUMN_WIDTH.DATE,
        sorter: true,
        isClassification: true,
        align: "center",
        filteredValue: search?.endDate !== undefined ? [search.endDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "endDate", searchInput, searchedColumn, searchText, handleSearch, false, "date", [], handleReset
        ),
        render: (text) =>
          renderDateColumn("endDate", hasValue(search["endDate"]), searchText, text, "date", search),
      },
      {
        key: "startHour",
        title: "START HOUR",
        dataIndex: "startHour",
        width: COLUMN_WIDTH.HOUR,
        sorter: true,
        isClassification: true,
        filteredValue: search?.startHour !== undefined ? [search.startHour] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "startHour", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text, record) =>
          renderColumn("startHour", hasValue(search["startHour"]), searchText,
            record.startHour ? `${record.startHour}:${record.startMinute}` : text, true, "input", search),
      },
      {
        key: "endHour",
        title: "END HOUR",
        dataIndex: "endHour",
        width: COLUMN_WIDTH.HOUR,
        sorter: true,
        isClassification: true,
        filteredValue: search?.endHour !== undefined ? [search.endHour] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "endHour", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text, record) =>
          renderColumn("endHour", hasValue(search["endHour"]), searchText,
            record.endHour ? `${record.endHour}:${record.endMinute}` : text, true, "input", search),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: COLUMN_WIDTH.STATUS,
        sorter: true,
        isClassification: true,
        fixed: "right",
        filteredValue: search?.status !== undefined ? [search.status] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "status", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("status", hasValue(search["status"]), searchText, text, false, "status", search),
      },
      {
        key: "statusApproval",
        title: "STATUS APPROVAL",
        dataIndex: "statusApproval",
        width: COLUMN_WIDTH.STATUS_APPROVAL,
        sorter: true,
        isClassification: true,
        fixed: "right",
        filteredValue: search?.statusApproval !== undefined ? [search.statusApproval] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("status", hasValue(search["statusApproval"]), searchText, text, false, "status", search),
      },
    ],
    [search, searchText, searchedColumn, handleSearch, handleReset]
  );

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    dispatch(
      getDownloadPayChannelConfig({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: Math.max(loadMoreSize, data?.page?.totalElements || 10),
        sort,
      })
    );
  };

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(r?.mappingName);
    setStatus(r?.status);
  };

  const handleCancelModalInactivate = () => {
    setOpenModalInactivate(false);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      id,
      appHierId: res.approvalHierarchy,
      status: status === "Inactive" ? "Active" : "Inactive",
      remark: res.remark,
    };
    dispatch(inactivePayChannelConfig({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        dispatch(
          getPaginatePayChannelConfig({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: initialPageSize,
            sort,
            isLoadMore: false,
          })
        );
      });
  };

  const itemActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type="submit"
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
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_SETTINGS}>
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
        <Tooltip title={"Detail"}>
          <Link to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_SETTINGS} state={{ id: record?.id }}>
            <SVGIcon name="IconDetail" width={20} />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isEditable =
          record.statusApproval === "Draft" || record.statusApproval === "Rejected";
        return data_length > 3 ? (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_SETTINGS}
            state={{ id: record?.id }}
            className={!isEditable ? "pointer-events-none" : ""}
          >
            <ButtonComponent
              className="gap-5"
              icon={<SVGIcon name="IconEdit" width={24} color={isEditable ? "#0075bf" : "#8D91A0"} />}
              border={false}
              disabled={!isEditable}
              type="action"
            >
              <span className={"text-black gap-2 text-center"}>Update</span>
            </ButtonComponent>
          </Link>
        ) : (
          <Tooltip title="Update">
            <div
              onClick={(e) => { if (!isEditable) e.preventDefault(); }}
              className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
              <Link
                to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_SETTINGS}
                state={{ id: record?.id }}
                className={!isEditable ? "pointer-events-none" : ""}
              >
                <SVGIcon name="IconEdit" color={isEditable ? "#ACC424" : "#8D91A0"} width={20} />
              </Link>
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <div className="w-full">
            <ButtonComponent
              border={false}
              className={"gap-5"}
              onClick={() => handleInactive(record)}
              disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
              type="action"
            >
              <Checkbox
                onClick={() => handleInactive(record)}
                checked={record?.status !== "Active"}
                disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
              />
              <span className={"text-black ml-6 gap-2 text-center"}>
                {record?.status === "Active" ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
          </div>
        ) : (
          <Tooltip title={record?.status === "Active" ? "Inactivate" : "Activate"}>
            <div>
              <Checkbox
                checked={record?.status !== "Active"}
                onClick={() => handleInactive(record)}
                disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
              />
            </div>
          </Tooltip>
        )
      ),
    },
    {
      action: "history",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <ButtonComponent
            className="gap-5"
            icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />}
            border={false}
            onClick={() => handleApprovalHistory(record?.id)}
            type="action"
          >
            <span className={"text-black gap-2 text-center"}>Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title={"Approval History"}>
            <div onClick={() => handleApprovalHistory(record?.id)} className="cursor-pointer">
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
            </div>
          </Tooltip>
        )
      ),
    },
  ];

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "DOWNLOAD_PAY_CHANNEL_CONFIG") {
        handleDownload();
      }
      handleRefresh();
    } catch (error) {
      handleRefresh();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  const actionColsRaw = useColumnActionPermission(
    ["view", "update", "activate", "history"],
    itemActions
  );

  const actionCols = useMemo(
    () =>
      actionColsRaw.map((col) => ({
        ...col,
        key: col.action,
        width: COLUMN_WIDTH.ACTION,
        align: "center",
      })),
    [actionColsRaw]
  );

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
        if (rule.column && rule.value !== undefined && rule.value !== null && rule.value !== "") {
          simpleSearch[rule.column] = rule.value;
        }
      });
    }
    if (searchData?.filterRules && Array.isArray(searchData.filterRules)) {
      searchData.filterRules.forEach((ruleGroup) => {
        if (Array.isArray(ruleGroup)) {
          ruleGroup.forEach((rule) => {
            if (rule?.column && rule?.value !== undefined && rule?.value !== null && rule?.value !== "" && rule?.condition) {
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
      getPaginatePayChannelConfig({
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
        width: COLUMN_WIDTH.NO,
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
            <p className="mt-[15px] font-bold uppercase">PAYMENT CHANNEL CONFIGURATION</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }
      >
        <TableRBI
          idTable="pay-channel-config-table"
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
          showPaginationInfo={true}
          paginationInfoRenderer={(total, loaded) => `Showing ${loaded} of ${total} records`}
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
        header="Approval History"
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
      <ModalActiveInactive
        dispatch={dispatch}
        getAPIOption={getAllApprovalListPayChannelConfig}
        getAPIDetail={getListApprovalByIdPayChannelConfig}
        selector="receiptSetting"
        alertMessage={`Are you sure you want to inactivate this Payment Channel Configuration: ${nameModalActiveOrInactivate}?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSubmitModalInactivate}
      />
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewSettings;
