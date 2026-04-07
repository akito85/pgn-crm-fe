import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Dropdown, Menu, Tooltip, Checkbox, Tabs, Popover } from "antd";
import { debounce } from "lodash";
import { DownOutlined, EyeOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import { disabledActionByStatus } from "../../../../../utils";

import SVGIcon from "../../../../../assets/Icon/index";

// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import SearchBar from "../../../../../components/SearchBar";

// Utils
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import CardContainer from "../../../../../components/CardContainer";
import Toolbar from "../../../../../components/Toolbar";
import useGrantAccessHooks from "../../../../../components/useGrantAccessHooks";

// Column Configuration
import { columnWarranty } from "./ColumnConfig/WarrantyColumns";
import ListDetailWarranty from "./ListDetailWarranty";
import SummaryWarrantyTable from "./SummaryWarrantyTable";
import { WARRANTY_STATUS, WARRANTY_APPROVAL_STATUS } from "../../../../../constants/warranty";

// Redux / Service
import {
  getAllWarrantyListPaginate,
  downloadWarrantyList,
  getDetailWarranty,
  getApprovalHistory,
  downloadWarrantyListDetail,
  selectAllWarranties,
  getWarrantySummary,
} from "../../../../../redux/slices/receipt_collection/warranty";

// Modal
import ModalRefund from "./Modal/ModalRefund";
import ModalHold from "./Modal/ModalHold";
import ModalRelease from "./Modal/ModalRelease";
import ModalApprovalWarranty from "./Modal/ModalApprovalWarranty";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import { deleteWarranty } from "../../../../../redux/slices/receipt_collection/warranty";

const ViewWarranty = () => {
  const { data, loading, loadingList, dataApprovalHistory, data_detail, dataSummary, loadingSummary, loadingApproval } = useSelector(
    (state) => state.warranty
  );
  const warranties = useSelector(selectAllWarranties);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = warranties;
  const isSubmitter = data?.isSubmitter || false;
  const isApprover = data?.isApprover || false;
  const detailRef = useRef(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [pageDetail, setPageDetail] = useState(false);
  const [modalHold, setModalHold] = useState(false);
  const [modalRelease, setModalRelease] = useState(false);
  const [modalRefund, setModalRefund] = useState(false);
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedRecordDelete, setSelectedRecordDelete] = useState(null);
  const [modalApproval, setModalApproval] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "approvalStatus", "action"],
  }));

  useEffect(() => {
    let timeoutId;
    if (pageDetail && activeRowKey && detailRef.current) {
      timeoutId = setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeRowKey, pageDetail]);

  useEffect(() => {
    if (activeTab === "summary") {
      dispatch(getWarrantySummary());
    } else {
      dispatch(
        getAllWarrantyListPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [search, page, pageSize, sort, dispatch, activeTab]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment Guarantee",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY,
      breadcrumbName: "Guarantee List",
    }
  ];

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      const nextState = { ...prevState };
      if (selectedKeys[0]) {
        nextState[dataIndex] = selectedKeys[0];
      } else {
        delete nextState[dataIndex];
      }
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return nextState;
    });
  }, []);

  const handleGlobalSearch = useMemo(() => 
    debounce((value) => {
      setSearchText(value);
      setSearchedColumn(value ? "all" : "");
      setSearch((prevState) => {
        const nextState = { ...prevState };
        if (value) {
          nextState.all = value;
        } else {
          delete nextState.all;
        }
        setPage(1);
        return nextState;
      });
    }, 500),
    []
  );

  const handleAdvanceSearch = (searchData) => {
    setSearch((prevState) => ({
        ...prevState,
        advanceSearch: searchData,
    }));
    setPage(1);
  };
  

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const field = sorter.field || sorter.columnKey;
    const dataSort =
      sorter.order !== undefined
        ? `${field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    dispatch(
      downloadWarrantyList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const handleDownloadDetail = () => {
    dispatch(
      downloadWarrantyListDetail({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const handleDetail = (record) => {
    if (isApprover) {
      navigate(RECEIPT_AND_COLLECTION_ROUTES.DETAIL_WARRANTY, { state: { id: record?.id } });
      return;
    }

    const recordKey = record.billingCode || record.invoiceNumber || record.id;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setSelectedRecord(null);
    } else {
      setActiveRowKey(recordKey);
      setSelectedRecord(record);
      setPageDetail(true);
      dispatch(getDetailWarranty({ id: record.id }));
    }
  };

  const handleRefresh = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getAllWarrantyListPaginate({ search: reqSearch, page, pageSize, sort })
    );
  };

  /* Effect for Approval History */
  useEffect(() => {
    if (dataApprovalHistory && (dataApprovalHistory?.dataApprover || dataApprovalHistory?.dataHistory)) {
      setDataApprovalHistoryFix({
        dataApprover: {
          guarantee: dataApprovalHistory?.dataApprover?.WARRANTY_CREATION || [],
          hold: dataApprovalHistory?.dataApprover?.WARRANTY_HOLD || [],
          release: dataApprovalHistory?.dataApprover?.WARRANTY_RELEASE || [],
          refund: dataApprovalHistory?.dataApprover?.WARRANTY_REFUND || [],
        },
        dataHistory: {
          guarantee: dataApprovalHistory?.dataHistory?.WARRANTY_CREATION || [],
          hold: dataApprovalHistory?.dataHistory?.WARRANTY_HOLD || [],
          release: dataApprovalHistory?.dataHistory?.WARRANTY_RELEASE || [],
          refund: dataApprovalHistory?.dataHistory?.WARRANTY_REFUND || [],
        },
      });
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase().replace(/_/g, " "),
    }));
  };

  const handleHistory = (record) => {
    setOpenModalHistory(true);
    dispatch(getApprovalHistory({ id: record.id }));
  };

  const handleDelete = (record) => {
    setSelectedRecordDelete(record);
    setModalDelete(true);
  };

  const handleConfirmDelete = () => {
    // console.log("Deleting record:", selectedRecordDelete);
    dispatch(deleteWarranty(selectedRecordDelete.id)).unwrap().then(() => {
      setModalDelete(false);
      handleRefresh();
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
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Download Detail",
      render: (
        <ButtonComponent
          onClick={handleDownloadDetail}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download Detail List
        </ButtonComponent>
      ),
    },
    {
      action: "Hold",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconHold" color={"#fff"} width={18} />}
          onClick={() => {
            setSelectedRecord(null);
            setModalHold(true);
          }}
        >
          Hold
        </ButtonComponent>
      ),
    },
    {
      action: "Release",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconSend" color={"#fff"} width={18} />}
          onClick={() => {
            setSelectedRecord(null);
            setModalRelease(true);
          }}
        >
          Release
        </ButtonComponent>
      ),
    },
    {
      action: "Refund",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconRefund" color={"#fff"} width={18} />}
          onClick={() => {
            setSelectedRecord(null);
            setModalRefund(true);
          }}
        >
          Refund
        </ButtonComponent>
      ),
    },
    isApprover && {
      action: "Approval",
      render: (
        <ButtonComponent
          onClick={() => setModalApproval(true)}
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconRequestApproval" width={24} />}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <Link to={RECEIPT_AND_COLLECTION_ROUTES.UPLOAD_WARRANTY}>
          <ButtonComponent
            type={"submit"}
            border={false}
            icon={<SVGIcon name="IconUpload" width={17} color={"#FFFFFF"} />}
          >
            Upload
          </ButtonComponent>
        </Link>
      ),
    },
    {
      action: "Create",
      render: (
        <Link to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_WARRANTY}>
          <ButtonComponent
            type={"submit"}
            border={false}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
          >
            Create
          </ButtonComponent>
        </Link>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <Tooltip title={"Detail"}>
            <ButtonComponent
              className="gap-5"
              icon={<SVGIcon name="IconDetail" width={24} color={"#0075bf"} />}
              border={false}
              type="action"
              onClick={(e) => {
                e.stopPropagation();
                handleDetail(record);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={"Detail"}>
            <div className="cursor-pointer" onClick={(e) => {
              e.stopPropagation();
              handleDetail(record);
            }}>
              <SVGIcon name="IconDetail" width={24} color={"#0075bf"} />
            </div>
          </Tooltip>
        )
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isDraft = record?.status === WARRANTY_STATUS.DRAFT;
        const isApprDraft = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.DRAFT;
        const isApprRejected = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.REJECTED;
        const isActive = record?.status === WARRANTY_STATUS.ACTIVE;
        const isApprApproved = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.APPROVED;

        const isDraftFullyEditable = isDraft && (isApprDraft || isApprRejected);
        const isPartialEditable = isActive && isApprApproved;
        
        const disabled = !(isDraftFullyEditable || isPartialEditable);
        
        return data_length > 3 ? (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                navigate(RECEIPT_AND_COLLECTION_ROUTES.UPDATE_WARRANTY, { state: { id: record?.id } });
              }
            }}
            type="action"
            disabled={disabled}
            icon={<EditOutlined style={{ fontSize: "16px", color: disabled ? "#D3D3D3" : "#000" }} />}
          >
            <span className={disabled ? "text-gray-400" : "text-black"}>Update</span>
          </ButtonComponent>
        ) : (
          <Tooltip title={"Update"}>
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_WARRANTY}
              state={{ id: record?.id }}
              className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <EditOutlined style={{ fontSize: "16px", color: disabled ? "#d9d9d9" : "#0075bf" }} />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Refund",
      type: "table",
      render: (record, data_length) => {
        const isDisabled = record?.statusApproval !== "Approved" ||
          (parseFloat(record?.unAppliedAmountReal || record?.unAppliedAmount || 0) <= 0);

        return data_length > 3 ? (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) {
                setActiveRowKey(record.id);
                setSelectedRecord(record);
                setModalRefund(true);
              }
            }}
            type="action"
            disabled={isDisabled}
            icon={<SVGIcon name="IconRefund" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
          >
            <span className={isDisabled ? "text-gray-400" : "text-black"}>Refund</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Refund">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  setActiveRowKey(record.id);
                  setSelectedRecord(record);
                  setModalRefund(true);
                }
              }}
              className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <SVGIcon name="IconRefund" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Hold",
      type: "table",
      render: (record, data_length) => {
        const isDisabled = !(record?.statusApproval === "Approved" && record?.status?.toUpperCase() === "UNAPPLIED");

        return data_length > 3 ? (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) {
                setActiveRowKey(record.id);
                setSelectedRecord(record);
                setModalHold(true);
              }
            }}
            type="action"
            disabled={isDisabled}
            icon={<SVGIcon name="IconHold" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
          >
            <span className={isDisabled ? "text-gray-400" : "text-black"}>Hold</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Hold">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  setActiveRowKey(record.id);
                  setSelectedRecord(record);
                  setModalHold(true);
                }
              }}
              className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <SVGIcon name="IconHold" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Release",
      type: "table",
      render: (record, data_length) => {
        const isDisabled = !(record?.status === "Hold" && record?.statusApproval === "Approved");

        return data_length > 3 ? (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) {
                setActiveRowKey(record.id);
                setSelectedRecord(record);
                setModalRelease(true);
              }
            }}
            type="action"
            disabled={isDisabled}
            icon={<SVGIcon name="IconSend" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
          >
            <span className={isDisabled ? "text-gray-400" : "text-black"}>Release</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Release">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  setActiveRowKey(record.id);
                  setSelectedRecord(record);
                  setModalRelease(true);
                }
              }}
              className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <SVGIcon name="IconSend" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "history",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleHistory(record);
            }}
            type="action"
            icon={<SVGIcon name="IconLogHistory" color={"#000"} width={16} />}
          >
            <span className="text-black">Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title={'Approval History'}>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleHistory(record);
              }} 
              className="cursor-pointer"
            >
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
            </div>
          </Tooltip>
        )
      ),
    },
    {
      action: "Delete",
      type: "table",
      render: (record, data_length) => {
        const isDraft = record?.status === WARRANTY_STATUS.DRAFT;
        const isApprDraft = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.DRAFT;
        
        const disabled = !(isDraft && isApprDraft);

        return data_length > 3 ? (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                handleDelete(record);
              }
            }}
            type="action"
            disabled={disabled}
            icon={<SVGIcon name="IconDelete" color={disabled ? "#D3D3D3" : "#BE3036"} width={16} />}
          >
            <span className={disabled ? "text-gray-400" : "text-[#BE3036]"}>Delete</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Delete">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  handleDelete(record);
                }
              }}
              className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
              <SVGIcon name="IconDelete" color={disabled ? "#D3D3D3" : "#BE3036"} width={16} />
            </div>
          </Tooltip>
        );
      }
    },
  ].filter(Boolean);

  const baseColumns = useMemo(() => {
    return columnWarranty(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
    );
  }, [
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    search,
    handleSearch
  ]);

  const { actions: accessList } = useGrantAccessHooks("page");

  const actionColumns = useMemo(() => {
    const permissions = accessList?.map(a => a.toLowerCase()) || [];
    const tableActions = itemActions.filter(item => item.type === "table" && permissions.includes(item.action.toLowerCase()));
    
    if (tableActions.length === 0) return [];

    return [
      {
        key: "action",
        title: "ACTION",
        fixed: "right",
        width: 150,
        render: (_, record) => {
          const detailAction = tableActions.find(a => a.action.toLowerCase() === "view");
          const otherActions = tableActions.filter(a => a.action.toLowerCase() !== "view");
          
          return (
            <div className="flex justify-center items-center gap-4">
              {otherActions.length > 0 && (
                <Popover
                  trigger="click"
                  placement="bottomRight"
                  showArrow={false}
                  content={
                    <div className="flex flex-col">
                      {otherActions.map(action => (
                        <div key={action.action} onClick={(e) => e.stopPropagation()}>
                           {action.render(record, tableActions.length)}
                        </div>
                      ))}
                    </div>
                  }
                >
                  <div className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <SVGIcon name="IconActionDropdown" width={20} color={"#0075bf"} />
                  </div>
                </Popover>
              )}
              {detailAction && (
                <div onClick={(e) => e.stopPropagation()}>
                   {detailAction.render(record, tableActions.length)}
                </div>
              )}
            </div>
          );
        }
      }
    ];
  }, [accessList, itemActions]);

  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionColumns];
  }, [baseColumns, actionColumns]);

  const processedColumns = useMemo(() => {
    // TableRBI handles fixed columns internally using the fixedColumns state.
    // We just need to make sure the base columns have their fixed properties if needed.
    return allColumns;
  }, [allColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      key: item.billingCode || item.invoiceNumber || item.id,
    }));
  }, [dataSource]);

  return (
    <>
      {/* <Spin spinning={loading}> */}
      <BreadCrumb routes={routes} />
      <CardContainer header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold uppercase text-[#0075BF]">
            Guarantee list
          </p>
          <div className="flex gap-2">
            <Toolbar items={itemActions} />
          </div>
        </div>
      }>
        <div className="my-5">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                key: "all",
                label: "All",
                children: (
                  <TableRBI
                    dataSource={dataSourceWithKeys}
                    columns={processedColumns}
                    current={page}
                    pageSize={pageSize}
                    showExport={true}
                    onChange={handleChangePage}
                    onSizeChanger={handleChangePage}
                    totalData={data?.page?.totalElements || 0}
                    tableScrolled={{ x: "max-content", y: 525 }}
                    onSort={onSort}
                    handleDownload={handleDownload}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loadingList}
                    showSearchBar={true}
                    onAdvanceSearch={handleAdvanceSearch}
                    onSearch={(e) => handleGlobalSearch(e.target.value)}
                    onRow={(record) => {
                      const recordKey = record.billingCode || record.invoiceNumber || record.id;
                      const isActive = activeRowKey === recordKey;
                      return {
                        onClick: () => handleDetail(record),
                        className: isActive ? "row-selected" : "",
                        style: {
                          cursor: "pointer",
                          backgroundColor: isActive ? "#fffbea" : "transparent",
                          transition: "background-color 0.2s ease",
                        },
                      };
                    }}
                  />
                ),
              },
              {
                key: "summary",
                label: "Summary",
                children: (
                  <SummaryWarrantyTable
                    data={dataSummary || []}
                    loading={loadingSummary}
                  />
                ),
              },
            ]}
          />
        </div>
      </CardContainer>

      <ModalRefund
        isOpen={modalRefund}
        handleBack={() => setModalRefund(false)}
        handleRefresh={handleRefresh}
        handleOpenModal={() => setModalRefund(true)}
        selectedRow={selectedRecord}
      />

      <ModalHold
        isOpen={modalHold}
        handleBack={() => setModalHold(false)}
        handleRefresh={handleRefresh}
        handleOpenModal={() => setModalHold(true)}
        selectedRow={selectedRecord}
      />

      <ModalRelease
        isOpen={modalRelease}
        handleBack={() => setModalRelease(false)}
        handleRefresh={handleRefresh}
        handleOpenModal={() => setModalRelease(true)}
        selectedRow={selectedRecord}
      />

      <ModalHistory
        isOpen={openModalHistory}
        handleClose={() => setOpenModalHistory(false)}
        header={
          <div className="flex items-center gap-2">
            <span>Approval History</span>
            {loadingApproval && <Spin size="small" />}
          </div>
        }
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleConfirmDelete}
        width={500}
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <span className="text-lg font-bold">Confirmation</span>
          <span className="text-center">
            Are you sure want to delete this data ? <br />
            <b>{selectedRecordDelete?.billingCode || selectedRecordDelete?.invoiceNumber || selectedRecordDelete?.id}</b>
          </span>
        </div>
      </ModalConfirm>

      {pageDetail && activeRowKey && selectedRecord && (
        <div ref={detailRef} className="mt-5">
           <ListDetailWarranty id={selectedRecord.id} isEmbedded={true} />
        </div>
      )}

      <ModalApprovalWarranty
        isOpen={modalApproval}
        handleCancel={() => setModalApproval(false)}
        handleListRefresh={handleRefresh}
      />
    </>
  );
};

export default ViewWarranty;
