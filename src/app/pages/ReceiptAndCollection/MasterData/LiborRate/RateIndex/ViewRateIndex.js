import { Spin, Checkbox, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

import CardContainer from "../../../../../../components/CardContainer";
import TableRBI from "../../../../../../components/TableRBI";
import Toolbar from "../../../../../../components/Toolbar";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import ModalActiveInactive from "../../../../../../components/Modal/ModalActiveInactive";

import {
  getPaginateRateIndex,
  getDownloadRateIndex,
  getApprovalHistory,
  activeInactiveRateIndex,
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../../redux/slices/receipt_collection/rateIndex";

import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../../routes/Receipt&Collection/rc_routes";
import { renderColumn, disabledActionByStatus } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../../../utils/useTryAgainHooks";

const ViewRateIndex = ({ selectedSource }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, data, dataApprovalHistory } = useSelector((state) => state.rateIndex);

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [nameModalActiveOrInactivate, setNameModalActiveOrInactivate] = useState("");
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "approvalStatus", "action"],
  }));

  const handleFetch = useCallback(() => {
    if (!selectedSource?.id) return;
    
    // Filter by sourceId
    const currentSearch = { ...search, sourceId: selectedSource.id };
    
    dispatch(
      getPaginateRateIndex({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(currentSearch)),
      })
    );
  }, [dispatch, page, pageSize, search, sort, selectedSource]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({ ...prevState, [dataIndex]: selectedKeys[0] }));
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleApprovalHistory = async (id) => {
    try {
      await dispatch(getApprovalHistory(id)).unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      setOpenModalHistory(false);
    }
  };

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(r?.indexName);
    setStatus(r?.status);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = { id, appHierId: res.approvalHierarchy, status: status === "Inactive" ? "Active" : "Inactive", remark: res.remark };
    dispatch(activeInactiveRateIndex({ body })).unwrap().then(() => {
      handleClear();
      setOpenModalInactivate(false);
      handleFetch();
    });
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

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    return Object.keys(data).map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      key: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "INDEX CODE",
      dataIndex: "indexCode",
      key: "indexCode",
      sorter: true,
      ...getColumnSearchPropsPaging("indexCode", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn("indexCode", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "INDEX NAME",
      dataIndex: "indexName",
      key: "indexName",
      sorter: true,
      ...getColumnSearchPropsPaging("indexName", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("indexName", searchedColumn, searchText, text, true, "input", search),
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
      title: "TENOR",
      key: "tenor",
      sorter: true,
      dataIndex: "tenorValue",
      render: (text, record) => `${record.tenorValue} ${record.tenorUnit}`,
    },
    {
      title: "RATE (%)",
      dataIndex: "ratePercentage",
      key: "ratePercentage",
      sorter: true,
      align: "right",
      render: (text) => `${text}%`,
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
    const currentSearch = { ...search, sourceId: selectedSource.id };
    dispatch(getDownloadRateIndex({ search: encodeURIComponent(JSON.stringify(currentSearch)), page, pageSize, sort }));
  };

  const isSourceActiveOrDraft = selectedSource?.status === "Active" || selectedSource?.status === "Draft";

  const handleRetry = () => {
    handleFetch();
  };

  const { renderModal } = useTryAgainHooks(handleRetry);

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
        <Tooltip title={!isSourceActiveOrDraft ? "Selected Libor Rate is Inactive" : ""}>
            <ButtonComponent 
                icon={<SVGIcon name="IconButtonCreate" width={24} />} 
                type="submit" 
                disabled={!isSourceActiveOrDraft}
                onClick={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.CREATE_RATE_INDEX, { state: { sourceId: selectedSource?.id, sourceName: selectedSource?.sourceName } })}
            >
                Create
            </ButtonComponent>
        </Tooltip>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title={"Detail"}>
          <Link to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RATE_INDEX} state={{ id: record?.id }}>
            <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
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
            <Link to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_RATE_INDEX} state={{ id: record?.id }}>
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
               <Link to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_RATE_INDEX} state={{ id: record?.id }} className={!isEditable ? "pointer-events-none opacity-50" : ""}>
                  <SVGIcon name="IconEdit" width={24} color={isEditable ? "#ACC424" : "#8D91A0"} />
               </Link>
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
          <ButtonComponent
            border={false}
            className={'gap-5'}
            onClick={() => handleInactive(record)}
            disabled={disabledActionByStatus('activate', record?.status, record?.approvalStatus)}
            type="action"
          >
            <Checkbox
              checked={record?.status !== "Active"}
              disabled={disabledActionByStatus('activate', record?.status, record?.approvalStatus)}
            />
            <span className={"text-black ml-6 gap-2 text-center"}>
              {record?.status === "Active" ? "Inactivate" : "Activate"}
            </span>
          </ButtonComponent>
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

  const actionColumns = useColumnActionPermission(["view", "history", "update", 'activate'], itemActions);

  if (!selectedSource) return null;

  return (
    <div className="mt-5">
      <Spin spinning={loading}>
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">RATE INDEX LIST - {selectedSource.sourceName} ({selectedSource.sourceCode})</p>
            <Toolbar items={itemActions} />
          </div>
        }>
          <TableRBI
            showExport={true}
            handleDownload={handleDownload}
            dataSource={data?.result}
            pageSize={pageSize}
            columns={[...columns, ...actionColumns]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements}
            onSort={(s) => setSort(s.order ? `${s.field}~${s.order === "ascend" ? "asc" : "desc"}` : "")}
            tableScrolled={{ x: "max-content", y: 400 }}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
          />
        </CardContainer>
        <ModalActiveInactive
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"rateIndex"}
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
    </div>
  );
};

export default ViewRateIndex;
