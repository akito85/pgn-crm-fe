import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Dropdown, Menu, Tooltip, Checkbox } from "antd";
import { DownOutlined, EyeOutlined, DownloadOutlined,EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { disabledActionByStatus } from "../../../../../utils";

import SVGIcon from "../../../../../assets/Icon/index";

// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";

// Utils
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import CardContainer from "../../../../../components/CardContainer";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

// Column Configuration
import { columnWarranty } from "./ColumnConfig/WarrantyColumns";
import ListDetailWarranty from "./ListDetailWarranty";
import { WARRANTY_STATUS, WARRANTY_APPROVAL_STATUS } from "../../../../../constants/warranty";

// Redux / Service
import {
  getAllWarrantyListPaginate,
  downloadWarrantyList,
  getDetailWarranty,
  getApprovalHistory,
  downloadWarrantyListDetail
} from "../../../../../redux/slices/receipt_collection/warranty";

// Modal
import ModalRefund from "./Modal/ModalRefund";
import ModalHold from "./Modal/ModalHold";
import ModalRelease from "./Modal/ModalRelease";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import { deleteWarranty } from "../../../../../redux/slices/receipt_collection/warranty";

const ViewWarranty = () => {
  const { data, loading, loadingList, dataApprovalHistory, data_detail } = useSelector(
    (state) => state.warranty
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;
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

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "approvalStatus", "action"],
  }));

  useEffect(() => {
    if (pageDetail && activeRowKey && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [activeRowKey, pageDetail]);

  useEffect(() => {
    dispatch(
      getAllWarrantyListPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
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
    if (dataApprovalHistory && (dataApprovalHistory?.approver || dataApprovalHistory?.history)) {
      setDataApprovalHistoryFix({
        dataApprover: {
          create: dataApprovalHistory?.approver?.PAYMENT_WARRANTY || [],
          hold: dataApprovalHistory?.approver?.WARRANTY_HOLD || [],
          release: dataApprovalHistory?.approver?.WARRANTY_RELEASE || [],
          refund: dataApprovalHistory?.approver?.WARRANTY_REFUND || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.history?.PAYMENT_WARRANTY || [],
          hold: dataApprovalHistory?.history?.WARRANTY_HOLD || [],
          release: dataApprovalHistory?.history?.WARRANTY_RELEASE || [],
          refund: dataApprovalHistory?.history?.WARRANTY_REFUND || [],
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

  const handleHistory = async (record) => {
    try {
      await dispatch(getApprovalHistory({ id: record.id })).unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      setOpenModalHistory(false);
    }
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
              icon={<EyeOutlined style={{ fontSize: "24px", color: "#0075bf" }} />}
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
              <EyeOutlined style={{ fontSize: "16px", color: "#0075bf" }} />
            </div>
          </Tooltip>
        )
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const disabled = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.WAITING_APPROVAL;
        
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
    // {
    //   action: "Refund",
    //   type: "table",
    //   render: (record, data_length) => {
    //     const isDisabled = record?.statusApproval !== "Approved" ||
    //       (parseFloat(record?.unAppliedAmountReal || record?.unAppliedAmount || 0) <= 0);

    //     return data_length > 3 ? (
    //       <ButtonComponent
    //         border={false}
    //         className="gap-2"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           if (!isDisabled) {
    //             setActiveRowKey(record.id);
    //             setSelectedRecord(record);
    //             setModalRefund(true);
    //           }
    //         }}
    //         type="action"
    //         disabled={isDisabled}
    //         icon={<SVGIcon name="IconRefund" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
    //       >
    //         <span className={isDisabled ? "text-gray-400" : "text-black"}>Refund</span>
    //       </ButtonComponent>
    //     ) : (
    //       <Tooltip title="Refund">
    //         <div
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             if (!isDisabled) {
    //               setActiveRowKey(record.id);
    //               setSelectedRecord(record);
    //               setModalRefund(true);
    //             }
    //           }}
    //           className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    //         >
    //           <SVGIcon name="IconRefund" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />
    //         </div>
    //       </Tooltip>
    //     );
    //   },
    // },
    // {
    //   action: "Hold",
    //   type: "table",
    //   render: (record, data_length) => {
    //     const isDisabled = !(record?.statusApproval === "Approved" && record?.status?.toUpperCase() === "UNAPPLIED");

    //     return data_length > 3 ? (
    //       <ButtonComponent
    //         border={false}
    //         className="gap-2"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           if (!isDisabled) {
    //             setActiveRowKey(record.id);
    //             setSelectedRecord(record);
    //             setModalHold(true);
    //           }
    //         }}
    //         type="action"
    //         disabled={isDisabled}
    //         icon={<SVGIcon name="IconHold" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
    //       >
    //         <span className={isDisabled ? "text-gray-400" : "text-black"}>Hold</span>
    //       </ButtonComponent>
    //     ) : (
    //       <Tooltip title="Hold">
    //         <div
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             if (!isDisabled) {
    //               setActiveRowKey(record.id);
    //               setSelectedRecord(record);
    //               setModalHold(true);
    //             }
    //           }}
    //           className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    //         >
    //           <SVGIcon name="IconHold" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />
    //         </div>
    //       </Tooltip>
    //     );
    //   },
    // },
    // {
    //   action: "Release",
    //   type: "table",
    //   render: (record, data_length) => {
    //     const isDisabled = !(record?.status === "Hold" && record?.statusApproval === "Approved");

    //     return data_length > 3 ? (
    //       <ButtonComponent
    //         border={false}
    //         className="gap-2"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           if (!isDisabled) {
    //             setActiveRowKey(record.id);
    //             setSelectedRecord(record);
    //             setModalRelease(true);
    //           }
    //         }}
    //         type="action"
    //         disabled={isDisabled}
    //         icon={<SVGIcon name="IconSend" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
    //       >
    //         <span className={isDisabled ? "text-gray-400" : "text-black"}>Release</span>
    //       </ButtonComponent>
    //     ) : (
    //       <Tooltip title="Release">
    //         <div
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             if (!isDisabled) {
    //               setActiveRowKey(record.id);
    //               setSelectedRecord(record);
    //               setModalRelease(true);
    //             }
    //           }}
    //           className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    //         >
    //           <SVGIcon name="IconSend" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />
    //         </div>
    //       </Tooltip>
    //     );
    //   },
    // },
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
        const disabled = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.WAITING_APPROVAL;

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
  ];

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
  ]);

  const actionColumns = useColumnActionPermission(
    ["view", "refund", "hold", "release", "history", "delete","Update"],
    itemActions,
    "View",
    "page",
    true
  );

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
    <LayoutMenu>
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
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
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

      {/* </Spin> */}
    </LayoutMenu>
  );

};

export default ViewWarranty;
