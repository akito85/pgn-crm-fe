import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Spin, Tooltip, Alert, Menu, Dropdown } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import {
  getApprovalHistory,
  getDownloadReceipt,
  getPaginateReceipt,
  deleteReceipt,
  holdReleaseReceiptBulk,
  submitRefundReceipt,
} from "../../../../redux/slices/receipt_collection/receipt";
import { columnsReceipt } from "./ColumnReceiptView";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import ModalHoldReceipt from "./Table/ModalHoldReceipt";
import ModalRefundReceipt from "./Table/ModalRefundReceipt";
import ModalReleaseReceipt from "./Table/ModalReleaseReceipt";
import ModalReverseReceipt from "./Table/ModalReverseReceipt";
import { DownloadOutlined, WarningOutlined } from "@ant-design/icons";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { hasValue } from "../../../../utils";
import { clearBodyMessage } from "../../../../redux/slices/general_slice";

const ViewReceipt = () => {
  // Selector
  const { loading, data, data_detail } = useSelector((state) => state.receipt);
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const dataSource = data?.result?.map((item) => ({
    ...item,
    key: item.id,
  }));

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [openModalApproval, setOpenModalApproval] = useState("");
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [recordSelected, setRecordSelected] = useState({});
  const [body, setBody] = useState();
  const [openModalHold, setOpenModalHold] = useState(false);
  const [openModalRefund, setOpenModalRefund] = useState(false);
  const [openModalRelease, setOpenModalRelease] = useState(false);
  const [openModalReverse, setOpenModalReverse] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const handleHold = (record) => {
    if (record) {
      setSelectedData([record]);
    }
    setOpenModalHold(true);
  };

  const handleSubmitHold = (data) => {
    const body = {
      receipts: data.receipts?.map((item) => ({
        id: item.id,
        amount: typeof item.holdAmount === 'string' ? parseFloat(item.holdAmount.replace(/,/g, '')) : item.holdAmount,
      })),
      action: "HOLD",
      appHierId: data.appHierId,
      reason: data.reason,
      attachmentIds: data.attachments?.map((a) => a.id),
    };

    dispatch(holdReleaseReceiptBulk(body)).then((res) => {
      if (!res.error) {
        setOpenModalHold(false);
        setSelectedRowKeys([]);
        setSelectedData([]);
        handleFetch(); // Refresh list
      }
    });
  };

  const handleRefund = () => {
    setOpenModalRefund(true);
  };

  const handleSubmitRefund = (data) => {
    const body = {
      customerId: data.customerId,
      appHierId: data.appHierId,
      refundDate: data.refundDate,
      remark: data.remark,
      attachmentIds: data.attachmentIds || [],
      receipts: data.receipts?.map((item) => ({
        receiptId: item.receiptId || item.id,
        refundAmount: item.refundAmount,
        remark: item.remark,
      })),
    };

    dispatch(submitRefundReceipt({ body })).then((res) => {
      if (!res.error) {
        setOpenModalRefund(false);
        handleFetch();
      }
    });
  };

  const handleRelease = () => {
    setOpenModalRelease(true);
  };

  const handleSubmitRelease = (data) => {
    const body = {
      receipts: data.receipts?.map((item) => ({
        id: item.id,
        amount: typeof item.releaseAmount === 'string' ? parseFloat(item.releaseAmount.replace(/,/g, '')) : item.releaseAmount,
      })),
      action: "RELEASE",
      appHierId: data.appHierId,
      reason: data.reason,
      attachmentIds: data.attachments?.map((a) => a.id),
    };

    dispatch(holdReleaseReceiptBulk(body)).then((res) => {
      if (!res.error) {
        setOpenModalRelease(false);
        setSelectedRowKeys([]);
        setSelectedData([]);
        handleFetch(); // Refresh list
      }
    });
  };

  const handleReverse = (record) => {
    if (record) {
      setSelectedData([record]);
    }
    setOpenModalReverse(true);
  };

  const handleSubmitReverse = (data) => {
    const body = {
      receipts: data.receipts?.map((item) => {
        const amountValue = item.receiptAmount || item.amount;
        return {
          id: item.id,
          amount: typeof amountValue === 'string' ? parseFloat(amountValue.replace(/,/g, '')) : amountValue,
        };
      }),
      action: "REVERSE",
      appHierId: data.appHierId,
      reason: data.reason,
      attachmentIds: data.attachments?.map((a) => a.id),
    };

    dispatch(holdReleaseReceiptBulk(body)).then((res) => {
      if (!res.error) {
        setOpenModalReverse(false);
        setSelectedRowKeys([]);
        setSelectedData([]);
        handleFetch(); // Refresh list
      }
    });
  };

  const handleCreateAccounting = (record) => {
    // Navigate to Create Accounting page with receipt data
    navigate(RECEIPT_AND_COLLECTION_ROUTES.CREATE_ACCOUNTING, {
      state: record || recordSelected,
    });
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedData(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    fixed: "left",
    columnWidth: 50,
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
      breadcrumbName: "Receipt",
    },
  ];

  // Use Effect
  const handleFetch = useCallback(() => {
    dispatch(
      getPaginateReceipt({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    // Clear any stale error messages from other pages on mount
    dispatch(clearBodyMessage());
    handleFetch();
  }, [handleFetch]);

  useEffect(() => {
    if (data_detail && (data_detail?.dataApprover || data_detail?.dataHistory)) {
      setDataApprovalHistoryFix({
        dataApprover: {
          receipt: data_detail?.dataApprover?.MANUAL_RECEIPT || [],
          hold: data_detail?.dataApprover?.RECEIPT_HOLD || [],
          release: data_detail?.dataApprover?.RECEIPT_RELEASE || [],
          reverse: data_detail?.dataApprover?.RECEIPT_REVERSE || [],
        },
        dataHistory: {
          receipt: data_detail?.dataHistory?.MANUAL_RECEIPT || [],
          hold: data_detail?.dataHistory?.RECEIPT_HOLD || [],
          release: data_detail?.dataHistory?.RECEIPT_RELEASE || [],
          reverse: data_detail?.dataHistory?.RECEIPT_REVERSE || [],
        },
      });
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_detail]);

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase().replace(/_/g, " "),
    }));
  };

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      let changeSelectedKeys;
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }

      if (hasValue(selectedKeys[0]) && (dataIndex === 'isMisc' || dataIndex === 'isReconciled')) {
        if (selectedKeys[0]?.toLowerCase() === 'true') {
          changeSelectedKeys = [true];
        } else if (selectedKeys[0]?.toLowerCase() === 'false') {
          changeSelectedKeys = [false]
        } else {
          changeSelectedKeys = selectedKeys[0]
        }
      } else {
        changeSelectedKeys = selectedKeys
      }
      return {
        ...prevState,
        [dataIndex]: changeSelectedKeys[0],
      };
    });
  };

  // handle change page
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleGlobalSearch = useCallback(
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
        return nextState;
      });
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      handleGlobalSearch.cancel();
    };
  }, [handleGlobalSearch]);

  const handleAdvanceSearch = (searchData) => {
    setSearch((prevState) => ({
      ...prevState,
      advanceSearch: searchData,
    }));
    setPage(1);
  };

  // handle sort
  const onSort = (_, __, sort) => {
    let column = "";
    switch (sort?.field) {
      case "unAppliedAmount":
        column = "unAppliedAmountReal";
        break;
      case "appliedAmount":
        column = "appliedAmountReal";
        break;
      case "equivalentUnAppliedAmount":
        column = "equivalentUnAppliedAmountReal";
        break;
      case "equivalentAmount":
        column = "equivalentAmountReal";
        break;
      case "rateAmount":
        column = "rateAmountReal";
        break;
      case "equivalentAppliedAmount":
        column = "equivalentAppliedAmountReal";
        break;
      case "refundAmount":
        column = "refundAmountReal";
        break;
      case "transferAmount":
        column = "transferAmountReal";
        break;
      default:
        column = sort?.field;
        break;
    }
    const dataSort =
      sort.order !== undefined
        ? `${column}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle open modal approval
  const handleModalApprovalHistory = async (id) => {
    try {
      setBody(id);
      await dispatch(getApprovalHistory(id))?.unwrap();
      setOpenModalApproval(true);
    } catch (error) {
      setOpenModalApproval(false);

    }
  };

  // handle delete receipt
  const handleDeleteReceipt = (record) => {
    setOpenModalDelete(true);
    setRecordSelected(record);
  };

  const handleConfirmModalDelete = () => {
    const { id, appHierId, ...keys } = recordSelected;
    dispatch(deleteReceipt({ id: id, appHierId: appHierId }));
    const searchRequest = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getPaginateReceipt({ search: searchRequest, sort, page, pageSize })
    );
    setOpenModalDelete(false);
    setRecordSelected({});
  };

  // handle close modal
  const handleCloseModalError = () => {
    setOpenModalDelete(false);
  };

  const handleDownload = () => {
    dispatch(
      getDownloadReceipt({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const moreActionsMenu = (record) => (
    <Menu>
      <Menu.Item
        key="Update"
        disabled={!(
          (record?.status === "Draft" && record?.statusApproval === "Rejected") ||
          (record?.status === "Draft" && record?.statusApproval === "Waiting Approval") ||
          (record?.status === "Draft" && record?.statusApproval === "Draft") ||
          (record?.status === "Unidentified" && record?.statusApproval === "Rejected") ||
          (record?.status === "Unidentified" && record?.statusApproval === "Waiting Approval") ||
          (record?.status === "Unidentified" && record?.statusApproval === "Draft")
        )}
      >
        <Link
          to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_RECEIPT}
          state={{ id: record?.id }}
          className={`flex items-center gap-2 ${!(
            (record?.status === "Draft" && record?.statusApproval === "Rejected") ||
            (record?.status === "Draft" && record?.statusApproval === "Waiting Approval") ||
            (record?.status === "Draft" && record?.statusApproval === "Draft") ||
            (record?.status === "Unidentified" && record?.statusApproval === "Rejected") ||
            (record?.status === "Unidentified" && record?.statusApproval === "Waiting Approval") ||
            (record?.status === "Unidentified" && record?.statusApproval === "Draft")
          ) ? 'pointer-events-none opacity-50' : ''}`}
        >
          <SVGIcon name="IconEdit" color={"#000000"} width={16} />
          <span>Update</span>
        </Link>
      </Menu.Item>
      <Menu.Item
        key="Hold"
        onClick={() => handleHold(record)}
        disabled={!(record?.statusApproval === "Approved" && record?.status?.toUpperCase() === "UNAPPLIED")}
      >
        <div className={`flex items-center gap-2 ${!(record?.statusApproval === "Approved" && record?.status?.toUpperCase() === "UNAPPLIED") ? 'opacity-50' : ''}`}>
          <SVGIcon name="IconHold" color={"#000000"} width={16} />
          <span>Hold</span>
        </div>
      </Menu.Item>
      <Menu.Item
        key="Release"
        disabled={!(record?.status === "Hold" && record?.statusApproval === "Approved")}
        onClick={() => {
          setSelectedData([record]);
          handleRelease();
        }}
      >
        <div className={`flex items-center gap-2 ${!(record?.status === "Hold" && record?.statusApproval === "Approved") ? 'opacity-50' : ''}`}>
          <SVGIcon name="IconSend" color={"#000000"} width={16} />
          <span>Release</span>
        </div>
      </Menu.Item>
      <Menu.Item
        key="Reverse"
        onClick={() => handleReverse(record)}
        disabled={record?.statusApproval === "Waiting Approval" || record?.status?.toUpperCase() === "REVERSE"}
      >
        <div className={`flex items-center gap-2 ${(record?.statusApproval === "Waiting Approval" || record?.status?.toUpperCase() === "REVERSE") ? 'opacity-50' : ''}`}>
          <SVGIcon name="IconRevers" color={"#000000"} width={16} />
          <span>Reverse</span>
        </div>
      </Menu.Item>
      <Menu.Item
        key="Refund"
        onClick={() => {
          setSelectedData([record]);
          handleRefund();
        }}
        disabled={
          record?.statusApproval !== "Approved" ||
          (parseFloat(record?.unAppliedAmountReal || record?.unAppliedAmount || 0) <= 0)
        }
      >
        <div className={`flex items-center gap-2 ${(record?.statusApproval !== "Approved" || (parseFloat(record?.unAppliedAmountReal || record?.unAppliedAmount || 0) <= 0)) ? 'opacity-50' : ''}`}>
          <SVGIcon name="IconRefund" color={"#000000"} width={16} />
          <span>Refund</span>
        </div>
      </Menu.Item>
      <Menu.Item
        key="Create Accounting"
        onClick={() => handleCreateAccounting(record)}
      >
        <div className="flex items-center gap-2">
          <SVGIcon name="IconActionCreate" color={"#000000"} width={16} />
          <span>Create Accounting</span>
        </div>
      </Menu.Item>
      <Menu.Item key="View Accounting">
        <Link
          to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_ACCOUNTING}
          state={{ id: record?.id }}
          className="flex items-center gap-2"
        >
          <SVGIcon name="IconReport" color={"#000000"} width={16} />
          <span>View Accounting</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="History" onClick={() => handleModalApprovalHistory(record?.id)}>
        <div className="flex items-center gap-2">
          <SVGIcon name="IconLogHistory" color={"#000000"} width={16} />
          <span>Approval History</span>
        </div>
      </Menu.Item>
      {((record?.status === "Draft" && record?.statusApproval === "Rejected") ||
        (record?.status === "Unidentified" && record?.statusApproval === "Rejected")) && (
        <Menu.Item key="Delete" onClick={() => handleDeleteReceipt(record)}>
          <div className="flex items-center gap-2">
            <SVGIcon name="IconDelete" color={"#BE3036"} width={16} />
            <span className="text-[#BE3036]">Delete</span>
          </div>
        </Menu.Item>
      )}
    </Menu>
  );

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "APPROVAL_HISTORY_RECEIPT") {
        dispatch(getApprovalHistory(body));
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">RECEIPT LIST</p>
              <div className="flex gap-2">
                <ButtonComponent
                  isPrimary={true}
                  icon={<DownloadOutlined style={{ fontSize: 18, color: '#FFFFFF' }} />}
                  onClick={handleDownload}
                >
                  Download List
                </ButtonComponent>
                <ButtonComponent
                  isPrimary={true}
                  icon={<SVGIcon name="IconHold" width={18} color={"#FFFFFF"} />}
                  onClick={() => handleHold(null)}
                >
                  Hold
                </ButtonComponent>
                <ButtonComponent
                  isPrimary={true}
                  icon={<SVGIcon name="IconSend" width={18} color={"#FFFFFF"} />}
                  onClick={handleRelease}
                >
                  Release
                </ButtonComponent>
                <ButtonComponent
                  isPrimary={true}
                  icon={<SVGIcon name="IconRefund" width={18} color={"#FFFFFF"} />}
                  onClick={handleRefund}
                  disabled={
                    selectedData.length === 0 ||
                    selectedData.some(item =>
                      item?.statusApproval !== "Approved" ||
                      (parseFloat(item?.unAppliedAmountReal || item?.unAppliedAmount || 0) <= 0)
                    )
                  }
                >
                  Refund
                </ButtonComponent>
                <ButtonComponent
                  isPrimary={true}
                  icon={<SVGIcon name="IconRevers" width={18} color={"#FFFFFF"} />}
                  onClick={() => handleReverse(null)}
                  disabled={
                    selectedData.length === 0 ||
                    selectedData.some(item =>
                      item?.statusApproval === "Waiting Approval" ||
                      item?.status?.toUpperCase() === "REVERSE"
                    )
                  }
                >
                  Reverse
                </ButtonComponent>
                <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_RECEIPT}>
                  <ButtonComponent
                    isPrimary={true}
                    icon={<SVGIcon name="IconButtonCreate" width={18} color={"#FFFFFF"} />}
                    type="submit"
                  >
                    Create
                  </ButtonComponent>
                </NavLink>
              </div>
            </div>
          }
        >
          <div className="w-full">
            <TableRBI
              dataSource={dataSource}
              columns={[
                ...columnsReceipt(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  handleModalApprovalHistory,
                  handleDeleteReceipt
                ),
                {
                  title: "ACTION",
                  fixed: "right",
                  width: 100,
                  align: "center",
                  render: (record) => (
                    <div className="flex justify-center items-center gap-2">
                      <Dropdown overlay={moreActionsMenu(record)} trigger={['click']}>
                        <div className="cursor-pointer">
                          <SVGIcon name="IconActionDropdown" width={20} color={"#0075bf"} />
                        </div>
                      </Dropdown>
                      <Tooltip title="Detail">
                        <Link
                          to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
                          state={{ id: record?.id }}
                        >
                          <div className="cursor-pointer mt-1">
                            <SVGIcon name="IconDetail" width={24} color={"#0075bf"} />
                          </div>
                        </Link>
                      </Tooltip>
                    </div>
                  )
                }
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={data?.page?.totalElements}
              onSort={onSort}
              tableScrolled={{
                x: "max-content",
                y: 500,
              }}
              handleDownload={handleDownload} // For Export button in TableRBI
              showExport={true}
              showSearchBar={true}
              onAdvanceSearch={handleAdvanceSearch}
              onSearch={(e) => handleGlobalSearch(e.target.value)}
            />
          </div>
        </CardContainer>

        {/* Hold Receipt Modal */}
        <ModalHoldReceipt
          isOpen={openModalHold}
          handleCancel={() => setOpenModalHold(false)}
          selectedData={selectedData}
          dataSource={dataSource}
          onSubmit={handleSubmitHold}
        />

        {/* Refund Receipt Modal */}
        <ModalRefundReceipt
          isOpen={openModalRefund}
          handleCancel={() => setOpenModalRefund(false)}
          selectedData={selectedData}
          onSubmit={handleSubmitRefund}
        />
        <ModalReleaseReceipt
          isOpen={openModalRelease}
          handleCancel={() => setOpenModalRelease(false)}
          selectedData={selectedData}
          dataSource={dataSource}
          onSubmit={handleSubmitRelease}
        />
        <ModalReverseReceipt
          isOpen={openModalReverse}
          handleCancel={() => setOpenModalReverse(false)}
          selectedData={selectedData}
          dataSource={dataSource}
          onSubmit={handleSubmitReverse}
        />

        {/* approval modal */}
        <ModalHistory
          isOpen={openModalApproval}
          handleClose={() => setOpenModalApproval(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </Spin>

      {/* modal delete */}
      <ModalConfirm
        isOpen={openModalDelete}
        handleCancel={handleCloseModalError}
        handleOk={handleConfirmModalDelete}
        width={600}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            Are you sure want to delete draft ?
          </p>
        </div>
        <Alert
          message="Warning! your data will deleted permanently"
          type={"error"}
        />
      </ModalConfirm>
      {renderModal()}
    </>
  );
};

export default ViewReceipt;