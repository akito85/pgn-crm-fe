import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getPaginatePaymentWarrantyPartnerBranch,
  inactivatePaymentWarrantyPartnerBranch,
  getAllApprovalList,
  getListApprovalById,
  getHistoryPaymentWarrantyPartnerBranch 
} from "../../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import { APPROVAL_STATUS, RECORD_STATUS } from "../../../../../../constants/warrantyPartner";
import SVGIcon from "../../../../../../assets/Icon/index";
import StatusComponent from "../../../../../../components/StatusComponent";
import { Space, Tooltip, Popover, Button } from "antd";
import TableRBI from "../../../../../../components/TableRBI";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import ModalBranch from "./ModalBranch";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import ModalActiveInactive from "../../../../../../components/Modal/ModalActiveInactive";

const BranchList = ({ partnerId, isApprover }) => {
  const dispatch = useDispatch();
  const { data_branch, data_history_branch } = useSelector((state) => state.paymentWarrantyPartner);
  
  const currentPartnerId = partnerId;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Inactive Modal States
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [inactiveRecord, setInactiveRecord] = useState(null);

  // History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyHeader, setHistoryHeader] = useState("");
  const [dataHistoryFix, setDataHistoryFix] = useState({});

  useEffect(() => {
    if (data_history_branch && data_history_branch?.dataApprover) {
      setDataHistoryFix({
        dataApprover: {
          create: data_history_branch?.dataApprover?.PAYMENT_WARRANTY_PARTNER_BRANCH || [],
          inactive: data_history_branch?.dataApprover?.INACTIVE_PAYMENT_WARRANTY_PARTNER_BRANCH || [],
        },
        dataHistory: {
          create: data_history_branch?.dataHistory?.PAYMENT_WARRANTY_PARTNER_BRANCH || [],
          inactive: data_history_branch?.dataHistory?.INACTIVE_PAYMENT_WARRANTY_PARTNER_BRANCH || [],
        },
      });
    } else {
      setDataHistoryFix({});
    }
  }, [data_history_branch]);

  const fetchBranch = React.useCallback(() => {
    if (currentPartnerId) {
      dispatch(getPaginatePaymentWarrantyPartnerBranch({
        partnerId: currentPartnerId,
        search: "", 
        page: page - 1,
        pageSize,
        sort
      }));
    }
  }, [dispatch, currentPartnerId, page, pageSize, sort]);

  useEffect(() => {
    fetchBranch();
  }, [fetchBranch]);

  const handleOpenModal = (type, record = null) => {
    setModalType(type);
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setInactiveRecord(record);
    setOpenModalInactivate(true);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = { 
      id: inactiveRecord?.id, 
      appHierId: res.approvalHierarchy, 
      status: "Inactive", 
      remark: res.remark 
    };
    dispatch(inactivatePaymentWarrantyPartnerBranch({ body })).unwrap().then(() => {
      handleClear();
      setOpenModalInactivate(false);
      fetchBranch();
    });
  };

  const handleOpenHistory = (record) => {
    setHistoryHeader(`HISTORY BRANCH`);
    dispatch(getHistoryPaymentWarrantyPartnerBranch(record.id))
      .unwrap()
      .then(() => setIsHistoryOpen(true));
  };

  const handleOptions = () => {
    const data = dataHistoryFix?.dataApprover || {};
    return Object.keys(data).map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const columns = [
    { 
      title: "NO", 
      dataIndex: "no", 
      key: "no",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
      width: 60
    },
    { title: "BRANCH CODE", dataIndex: "branchCode", key: "branchCode", sorter: true },
    { title: "BRANCH NAME", dataIndex: "branchName", key: "branchName", sorter: true },
    { 
      title: "STATUS", 
      dataIndex: "status", 
      key: "status", 
      sorter: true,
      width: 120,
      render: (text) => (
        <StatusComponent colour={text}>{text}</StatusComponent>
      )
    },
    { 
      title: "STATUS APPROVAL", 
      dataIndex: "statusApproval", 
      key: "statusApproval", 
      sorter: true,
      width: 150,
      render: (text) => (
        <StatusComponent colour={text}>{text}</StatusComponent>
      )
    }
  ];

  if (!isApprover) {
    columns.push({
      title: "ACTION",
      key: "action",
      align: "center",
      width: 120,
      render: (record) => {
        const isPending = record.statusApproval === APPROVAL_STATUS.WAITING_APPROVAL;
        const isInactive = record.status === RECORD_STATUS.INACTIVE;
        const isDisabled = isPending || isInactive;
        const tooltipEdit = isPending ? APPROVAL_STATUS.WAITING_APPROVAL : isInactive ? RECORD_STATUS.INACTIVE : "Update";
        const tooltipDelete = isPending ? APPROVAL_STATUS.WAITING_APPROVAL : isInactive ? RECORD_STATUS.INACTIVE : "Delete";
        return (
          <div className="w-full flex justify-center items-center py-1 gap-2">
            <Tooltip title={isDisabled ? tooltipEdit : "Update"}>
              <div 
                className={isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                onClick={() => !isDisabled && handleOpenModal("update", record)}
              >
                <SVGIcon name="IconEdit" width={18} color={"#ACC424"} />
              </div>
            </Tooltip>
            <Tooltip title={isDisabled ? tooltipDelete : "Delete"}>
              <div 
                className={isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                onClick={() => !isDisabled && handleDelete(record)}
              >
                <SVGIcon name="IconDelete" width={18} color={"#D90000"} />
              </div>
            </Tooltip>
            <Popover
              trigger="click"
              placement="bottomRight"
              content={
                <Space direction="vertical">
                  <div 
                    className="cursor-pointer flex items-center gap-2 p-1"
                    onClick={() => handleOpenHistory(record)}
                  >
                    <SVGIcon name="IconLogHistory" width={20} color="#000000" />
                    <span className="text-sm">Approval History</span>
                  </div>
                </Space>
              }
            >
              <div>
                <MoreOutlined
                  style={{
                    fontSize: "20px",
                    color: "#0075bf",
                    cursor: "pointer",
                  }}
                />
              </div>
            </Popover>
          </div>
        );
      }
    });
  }
  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-4">
        {!isApprover && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="!bg-[#0075bf] !border-[#0075bf] !rounded-md h-[32px] flex items-center"
            onClick={() => handleOpenModal("create")}
          >
            Create
          </Button>
        )}
      </div>
      <TableRBI
        idTable="branch-list-table"
        dataSource={data_branch?.content || []}
        columns={columns}
        pageSize={pageSize}
        current={page}
        totalData={data_branch?.page?.totalElements || 0}
        onChange={(p) => setPage(p)}
        onSizeChanger={(size) => { setPageSize(size); setPage(1); }}
        onSort={(s) => setSort(s.order ? `${s.field}~${s.order === "ascend" ? "asc" : "desc"}` : "")}
        showSearchBar={true}
        showAdvanceSearch={true}
        tableScrolled={{ x: 1000, y: 525 }}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
      />

      <ModalBranch 
        isOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        modalType={modalType}
        selectedRecord={selectedRecord}
        partnerId={partnerId}
        fetchBranch={fetchBranch}
      />

      <ModalActiveInactive
        dispatch={dispatch}
        getAPIOption={getAllApprovalList}
        getAPIDetail={getListApprovalById}
        selector={"paymentWarrantyPartner"}
        alertMessage={`Are you sure you want to inactivate branch ${inactiveRecord?.branchName}?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={() => setOpenModalInactivate(false)}
        onFinish={handleSubmitModalInactivate}
      />

      <ModalHistory
        isOpen={isHistoryOpen && dataHistoryFix}
        handleClose={() => setIsHistoryOpen(false)}
        header={historyHeader}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataHistoryFix?.dataApprover}
        dataHistory={dataHistoryFix?.dataHistory}
      />
    </div>
  );
};

export default BranchList;
