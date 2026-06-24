import { Spin, Checkbox, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { DownloadOutlined } from "@ant-design/icons";
import { renderColumn } from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  getPaginateRateIndex,
  getDownloadRateIndex,
  getApprovalHistory,
  activeInactiveRateIndex,
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/receipt_collection/liborRate";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { disabledActionByStatus } from "../../../../../utils";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";


const ViewLiborRate = () => {
  const navigate = useNavigate();
  const { loading, data, dataApprovalHistory } = useSelector((state) => state.liborRate);
  const { bodyError } = useSelector((state) => state?.general);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const initialPageSize = 100;
  const loadMoreSize = 20;
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
    right: ["status", "approvalStatus", "action"],
  }));
  const [selectedSource, setSelectedSource] = useState(null);
  // const rateIndexRef = useRef(null);

  const [allData, setAllData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const shouldResetRef = useRef(true);

  const hasMore = allData.length < (data?.page?.totalElements || 0);

  useEffect(() => {
    dispatch(
      getPaginateRateIndex({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
      })
    );
  }, [search, sort, dispatch, refreshKey]);

  useEffect(() => {
    if (data?.result) {
      if (shouldResetRef.current || page === 1) {
        setAllData(data.result);
        shouldResetRef.current = false;
      } else {
        setAllData((prev) => {
          const ids = new Set(prev.map((item) => item.id));
          const newItems = data.result.filter((item) => !ids.has(item.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  const handleRefresh = useCallback(() => {
    shouldResetRef.current = true;
    if (page === 1) {
      setRefreshKey((prev) => prev + 1);
    } else {
      setPage(1);
    }
  }, [page]);

  const handleLoadMore = useCallback(async () => {
    if (allData.length >= (data?.page?.totalElements || 0)) return;
    const nextPage = Math.floor(allData.length / loadMoreSize) + 1;
    setPage(nextPage);
    await dispatch(
      getPaginateRateIndex({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
      })
    );
  }, [allData.length, data?.page?.totalElements, search, sort, dispatch, loadMoreSize]);

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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LIBOR_RATE,
      breadcrumbName: "Libor Rate",
    },
  ];

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    return Object.keys(data).map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    shouldResetRef.current = true;
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const handleChange = (pageChange) => {
    setPage(pageChange);
  };

  const onSort = (s) => {
    const dataSort = s.order ? `${s.field}~${s.order === "ascend" ? "asc" : "desc"}` : "";
    shouldResetRef.current = true;
    setPage(1);
    setSort(dataSort);
  };

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      setDataApprovalHistoryFix({
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.RATE_INDEX || [],
          inactive: dataApprovalHistory?.dataApprover?.INACTIVE_RATE_INDEX || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.RATE_INDEX || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_RATE_INDEX || [],
        },
      });
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleApprovalHistory = async (id) => {
    try {
      setBody(id);
      await dispatch(getApprovalHistory(id)).unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      setOpenModalHistory(false);
    }
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      key: "no",
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CODE",
      dataIndex: "indexCode",
      key: "indexCode",
      sorter: true,
      ...getColumnSearchPropsPaging("indexCode", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn("indexCode", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "SOURCE",
      dataIndex: ["rateSource", "sourceCode"],
      key: "sourceCode",
      sorter: true,
      ...getColumnSearchPropsPaging("rateSource.sourceCode", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text, record) => renderColumn("sourceCode", searchedColumn, searchText, record?.rateSource?.sourceCode, true, "input", search),
    },
    {
      title: "SOURCE NAME",
      dataIndex: ["rateSource", "sourceName"],
      key: "sourceName",
      sorter: true,
      ...getColumnSearchPropsPaging("rateSource.sourceName", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text, record) => renderColumn("sourceName", searchedColumn, searchText, record?.rateSource?.sourceName, true, "input", search),
    },
    {
      title: "RATE INDEX CODE",
      dataIndex: "indexCode",
      key: "indexCode_2",
      sorter: true,
      ...getColumnSearchPropsPaging("indexCode", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("indexCode", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "RATE INDEX NAME",
      dataIndex: "indexName",
      key: "indexName",
      sorter: true,
      ...getColumnSearchPropsPaging("indexName", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("indexName", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "TENOR",
      dataIndex: "tenorValue",
      key: "tenorValue",
      sorter: true,
      ...getColumnSearchPropsPaging("tenorValue", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("tenorValue", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "RATE VALUE",
      dataIndex: "ratePercentage",
      key: "ratePercentage",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging("ratePercentage", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => `${text}%`,
    },
    {
      title: "UNIT",
      dataIndex: "tenorUnit",
      key: "tenorUnit",
      sorter: true,
      ...getColumnSearchPropsPaging("tenorUnit", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("tenorUnit", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "CURRENCY",
      dataIndex: "currencyCode",
      key: "currencyCode",
      sorter: true,
      ...getColumnSearchPropsPaging("currencyCode", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("currencyCode", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      sorter: true,
      render: (text) => renderColumn("startDate", searchedColumn, searchText, text, false, "date"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      sorter: true,
      render: (text) => renderColumn("endDate", searchedColumn, searchText, text, false, "date"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "remarks",
      key: "remarks",
      sorter: true,
      ...getColumnSearchPropsPaging("remarks", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("remarks", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: 100,
      fixed: "right",
      render: (text) => renderColumn("status", searchedColumn, searchText, text, false, "status"),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      sorter: true,
      width: 150,
      fixed: "right",
      render: (text) => renderColumn("approvalStatus", searchedColumn, searchText, text, false, "status"),
    },
  ];

  const handleDownload = () => {
    dispatch(getDownloadRateIndex({ search: encodeURIComponent(JSON.stringify(search)), page: 1, pageSize: initialPageSize, sort }));
  };

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(r?.indexName);
    setStatus(r?.status);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const bodyPayload = { id, appHierId: res.approvalHierarchy, status: status === "Inactive" ? "Active" : "Inactive", remark: res.remark };
    setBody({ body: bodyPayload });
    dispatch(activeInactiveRateIndex({ body: bodyPayload })).unwrap().then(() => {
      handleClear();
      setOpenModalInactivate(false);
      shouldResetRef.current = true;
      setPage(1);
      dispatch(
        getPaginateRateIndex({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
        })
      );
    });
  };

  const itemActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent onClick={handleDownload} type={"submit"} border={false} icon={<DownloadOutlined style={{ fontSize: "24px" }} />}>
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_LIBOR_RATE}>
          <ButtonComponent icon={<SVGIcon name="IconButtonCreate" width={24} />} type="submit">
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
    // {
    //   action: "Rate Index",
    //   type: "table",
    //   render: (record, data_length) => (
    //     data_length > 3 ? (
    //       <ButtonComponent
    //         className="gap-5"
    //         icon={<SVGIcon name="IconRateSource" color={"#0075bf"} width={24} />}
    //         border={false}
    //         type="action"
    //         onClick={() => {
    //           setSelectedSource(record);
    //           setTimeout(() => {
    //             rateIndexRef.current?.scrollIntoView({ behavior: "smooth" });
    //           }, 100);
    //         }}
    //       >
    //         <span className={"text-black gap-2 text-center"}>Rate Index</span>
    //       </ButtonComponent>
    //     ) : (
    //       <Tooltip title={'Rate Index'}>
    //         <div className="cursor-pointer" onClick={() => {
    //           setSelectedSource(record);
    //           setTimeout(() => {
    //             rateIndexRef.current?.scrollIntoView({ behavior: "smooth" });
    //           }, 100);
    //         }}>
    //           <SVGIcon name="IconRateSource" color={"#0075bf"} width={24} />
    //         </div>
    //       </Tooltip>
    //     )
    //   ),
    // },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title={"Detail"}>
          <Link to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_LIBOR_RATE} state={{ id: record?.id }}>
            <div className="pt-0">
              <SVGIcon name="IconDetail" width={20} />
            </div>
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isEditable = record.approvalStatus === "Draft" || record.approvalStatus === "Rejected";
        return (
          data_length > 3 ? (
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_LIBOR_RATE}
              state={{ id: record?.id }}
            >
            <ButtonComponent
                className="gap-5"
                icon={
                  <SVGIcon name="IconEdit" width={24} color={isEditable ? "#0075bf" : "#8D91A0"} />
                }
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
                onClick={(e) => {
                  if (!isEditable) e.preventDefault();
                }}
                className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              >
                <Link to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_LIBOR_RATE} state={{ id: record?.id }} className={!isEditable ? "pointer-events-none" : ""}>
                   <SVGIcon name="IconEdit" width={24} color={isEditable ? "#ACC424" : "#8D91A0"} />
                </Link>
              </div>
            </Tooltip>
          )
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
              className={'gap-5'}
              onClick={() => handleInactive(record)}
              disabled={disabledActionByStatus('activate', record?.status, record?.approvalStatus)}
              type="action"
            >
              <Checkbox
                onClick={() => handleInactive(record)}
                checked={record?.status !== "Active"}
                disabled={disabledActionByStatus('activate', record?.status, record?.approvalStatus)}
              />
              <span className={"text-black ml-6 gap-2 text-center"}>
                {record?.status === "Active" ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
          </div>
        ) : (
          <Tooltip title={record?.status === "Active" ? "Inactivate" : "Activate"}>
            <div>
              <Checkbox checked={record?.status !== "Active"} onClick={() => handleInactive(record)} disabled={disabledActionByStatus('activate', record?.status, record?.approvalStatus)} />
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
          <Tooltip title={'Approval History'}>
            <div onClick={() => handleApprovalHistory(record?.id)} className="cursor-pointer">
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
            </div>
          </Tooltip>
        )
      ),
    },
  ];

  const handleRetry = () => {
    handleRefresh();
  };

  const { renderModal } = useTryAgainHooks(handleRetry);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">LIBOR RATE LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }>
          <TableRBI
            showExport={true}
            handleDownload={handleDownload}
            dataSource={allData}
            pageSize={initialPageSize}
            columns={[...columns, ...useColumnActionPermission(["view", "history", "update", 'activate'], itemActions)]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{ x: "max-content", y: 525 }}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            enableRowClick={true}
            selectedRowKey={selectedSource?.id}
            onRowClick={(record) => {
              setSelectedSource(record);
            }}
            useInfiniteScroll={true}
            usePagination={false}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            showRefresh={true}
            onRefresh={handleRefresh}
            refreshLabel="Refresh"
          />
        </CardContainer>


        <ModalActiveInactive
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"liborRate"}
          alertMessage={`Are you sure you want to change status for ${nameModalActiveOrInactivate}?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={() => setOpenModalInactivate(false)}
          onFinish={handleSubmitModalInactivate}
        />
        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </Spin>
      {renderModal()}
    </>
  );
};

export default ViewLiborRate;
