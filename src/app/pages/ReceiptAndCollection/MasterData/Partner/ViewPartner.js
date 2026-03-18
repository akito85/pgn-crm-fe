import {
  Checkbox,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { EyeOutlined } from "@ant-design/icons";
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
  getAllApprovalList,
  getListApprovalById,
  getApprovalHistory,
  getDownloadPartner,
  getPaginatePartner,
  inactivePartner
} from "../../../../../redux/slices/receipt_collection/partner";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";

const ViewPartner = () => {
  // Selector
  const { loading, data, dataApprovalHistory } = useSelector(
    (state) => state.partner
  );
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
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
      getPaginatePartner({
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
      getPaginatePartner({
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
      getPaginatePartner({
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
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER,
      breadcrumbName: "Partner",
    },
  ];

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  // Function Search Column
  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  }, []);

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
          create: dataApprovalHistory?.dataApprover?.PARTNER || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_PARTNER || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PARTNER || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_PARTNER || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleApprovalHistory = async (data) => {
    try {
      setBody(data);
      await dispatch(getApprovalHistory(data))?.unwrap();
      setOpenModalHistory(true);

    } catch (error) {
      setOpenModalHistory(false);

    }
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "partnerCode",
        title: "PARTNER CODE",
        dataIndex: "partnerCode",
        width: 150,
        sorter: true,
        isClassification: true,
        filteredValue: search?.partnerCode !== undefined ? [search.partnerCode] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "partnerCode", searchInput, searchedColumn, searchText, handleSearch, true, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("partnerCode", hasValue(search["partnerCode"]), searchText, text, true, "input", search),
      },
      {
        key: "partnerName",
        title: "PARTNER NAME",
        dataIndex: "partnerName",
        width: 200,
        sorter: true,
        isClassification: true,
        filteredValue: search?.partnerName !== undefined ? [search.partnerName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "partnerName", searchInput, searchedColumn, searchText, handleSearch, true, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("partnerName", hasValue(search["partnerName"]), searchText, text, true, "input", search),
      },
      {
        key: "effStartDate",
        title: "START DATE",
        dataIndex: "effStartDate",
        width: 130,
        sorter: true,
        isClassification: true,
        align: "center",
        filteredValue: search?.effStartDate !== undefined ? [search.effStartDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "effStartDate", searchInput, searchedColumn, searchText, handleSearch, false, "date", [], handleReset
        ),
        render: (text) =>
          renderDateColumn("effStartDate", hasValue(search["effStartDate"]), searchText, text, "date", search),
      },
      {
        key: "effEndDate",
        title: "END DATE",
        dataIndex: "effEndDate",
        width: 130,
        sorter: true,
        isClassification: true,
        align: "center",
        filteredValue: search?.effEndDate !== undefined ? [search.effEndDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "effEndDate", searchInput, searchedColumn, searchText, handleSearch, false, "date", [], handleReset
        ),
        render: (text) =>
          renderDateColumn("effEndDate", hasValue(search["effEndDate"]), searchText, text, "date", search),
      },
      {
        key: "secKeySignature",
        title: "SEC KEY SIGNATURE",
        dataIndex: "secKeySignature",
        width: 180,
        sorter: true,
        isClassification: true,
        filteredValue: search?.secKeySignature !== undefined ? [search.secKeySignature] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "secKeySignature", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("secKeySignature", hasValue(search["secKeySignature"]), searchText, text, true, "input", search),
      },
      {
        key: "tokenExpirationTime",
        title: "TOKEN EXPIRATION TIME",
        dataIndex: "tokenExpirationTime",
        width: 190,
        sorter: true,
        isClassification: true,
        filteredValue: search?.tokenExpirationTime !== undefined ? [search.tokenExpirationTime] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "tokenExpirationTime", searchInput, searchedColumn, searchText, handleSearch, false, "input", [], handleReset
        ),
        render: (text) =>
          renderColumn("tokenExpirationTime", hasValue(search["tokenExpirationTime"]), searchText, text, true, "input", search),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 110,
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
        width: 160,
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





  // handle download
  const handleDownload = () => {
    dispatch(
      getDownloadPartner({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
      })
    );
  };

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(
      r?.partnerCode + " - " + r?.partnerName
    );
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
    dispatch(inactivePartner({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(getPaginatePartner({ search: tempSearch, page: 1, pageSize: initialPageSize, sort, isLoadMore: false }));
      });
  };

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
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PARTNER}>
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

    // column action
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Link
          to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PARTNER}
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
        const isEditable = record.statusApproval === "Draft" || record.statusApproval === "Rejected";
        return (
          <Tooltip title="Update">
            <div
              onClick={(e) => { if (!isEditable) e.preventDefault(); }}
              className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
              {isEditable ? (
                <Link
                  to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PARTNER}
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
          <Tooltip title={statusLowerCase === "active" || statusLowerCase === "draft" ? "Inactivate" : "Activate"}>
            <div>
              <Checkbox
                onClick={() => handleInactive(record)}
                checked={record?.status !== "Active"}
                disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
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
      if (bodyError?.action === "INACTIVE_RECEIPT_PARTNER") {
        dispatch(inactivePartner(body));
      } else if (bodyError?.action === "GET_APPROVAL_PARTNER") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_PARTNER") {
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
        width: 60,
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
      getPaginatePartner({
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
    <div>
      <BreadCrumb routes={routes} />
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">PARTNER LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }
      >
        <TableRBI
          idTable="partner-table"
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
        selector={"partner"}
        alertMessage={`Are you sure you want to inactivate this Partner with Partner Code ${nameModalActiveOrInactivate}?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSubmitModalInactivate}
      />
      {renderModal()}
    </div>
  );
};

export default ViewPartner;
