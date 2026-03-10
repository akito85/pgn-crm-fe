import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { 
  getPaginatePaymentWarrantyPartnerRating,
  inactivatePaymentWarrantyPartnerRating,
  getAllApprovalList,
  getListApprovalById,
  getHistoryPaymentWarrantyPartnerRating 
} from "../../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import { APPROVAL_STATUS, RECORD_STATUS } from "../../../../../../constants/warrantyPartner";
import SVGIcon from "../../../../../../assets/Icon/index";
import StatusComponent from "../../../../../../components/StatusComponent";
import { Space, Tooltip, Popover, Button } from "antd";
import TableRBI from "../../../../../../components/TableRBI";
import { renderDateConverter } from "../../../../../../utils";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import ModalRating from "./ModalRating";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import ModalActiveInactive from "../../../../../../components/Modal/ModalActiveInactive";

const RatingList = ({ partnerId, isApprover, partnerStatus }) => {
  const dispatch = useDispatch();
  const { data_rating, data_history_rating, loading_rating, loading_detail } = useSelector((state) => state.paymentWarrantyPartner);
  
  const currentPartnerId = partnerId;
  const isPartnerInactive = partnerStatus === RECORD_STATUS.INACTIVE;

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
    if (data_history_rating && data_history_rating?.dataApprover) {
      setDataHistoryFix({
        dataApprover: {
          create: data_history_rating?.dataApprover?.PAYMENT_WARRANTY_PARTNER_RATING || [],
          inactive: data_history_rating?.dataApprover?.INACTIVE_PAYMENT_WARRANTY_PARTNER_RATING || [],
        },
        dataHistory: {
          create: data_history_rating?.dataHistory?.PAYMENT_WARRANTY_PARTNER_RATING || [],
          inactive: data_history_rating?.dataHistory?.INACTIVE_PAYMENT_WARRANTY_PARTNER_RATING || [],
        },
      });
    } else {
      setDataHistoryFix({});
    }
  }, [data_history_rating]);

  const fetchRating = React.useCallback(() => {
    if (currentPartnerId) {
      dispatch(getPaginatePaymentWarrantyPartnerRating({
        partnerId: currentPartnerId,
        search: "", 
        page: page - 1,
        pageSize,
        sort
      }));
    }
  }, [dispatch, currentPartnerId, page, pageSize, sort]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

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
    dispatch(inactivatePaymentWarrantyPartnerRating({ body })).unwrap().then(() => {
      handleClear();
      setOpenModalInactivate(false);
      fetchRating();
    });
  };

  const handleOpenHistory = (record) => {
    setHistoryHeader(`HISTORY RATING`);
    dispatch(getHistoryPaymentWarrantyPartnerRating(record.id))
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
    { title: "RATING", dataIndex: "rating", key: "rating", render: (text) => DOMPurify.sanitize(text), sorter: true },
    { title: "CRITERIA", dataIndex: "criteria", key: "criteria", render: (text) => DOMPurify.sanitize(text), sorter: true },
    { title: "START DATE", dataIndex: "startDate", key: "startDate", render: (text) => renderDateConverter(text), sorter: true },
    { title: "END DATE", dataIndex: "endDate", key: "endDate", render: (text) => renderDateConverter(text), sorter: true },
    { title: "RATING DATE", dataIndex: "ratingDate", key: "ratingDate", render: (text) => renderDateConverter(text), sorter: true },
    { title: "RATING ISSUER", dataIndex: "ratingIssuer", key: "ratingIssuer", render: (text) => DOMPurify.sanitize(text), sorter: true },
    { 
      title: "RBC min 120%", 
      dataIndex: "rbc", 
      key: "rbc", 
      render: (text) => (text ? `${text.toLocaleString("id-ID")} %` : "-"),
      sorter: true,
      align: "right"
    },
    { 
      title: "EQUITY AT LEAST Rp200M", 
      dataIndex: "equity", 
      key: "equity", 
      render: (text) => (text ? `Rp ${text.toLocaleString("id-ID")}` : "-"),
      sorter: true,
      align: "right"
    },
    { 
      title: "10X COLLATERAL VALUE ASSET", 
      dataIndex: "collateralValueAsset", 
      key: "collateralValueAsset", 
      render: (text) => (text ? text.toLocaleString("id-ID") : "-"),
      sorter: true,
      align: "right"
    },
    { title: "DESCRIPTION", dataIndex: "description", key: "description", render: (text) => DOMPurify.sanitize(text), sorter: true },
    { 
      title: "STATUS", 
      dataIndex: "status", 
      key: "status", 
      sorter: true,
      width: 120,
      render: (text) => (
        <StatusComponent colour={text}>{DOMPurify.sanitize(text)}</StatusComponent>
      )
    },
    { 
      title: "STATUS APPROVAL", 
      dataIndex: "statusApproval", 
      key: "statusApproval", 
      sorter: true,
      width: 150,
      render: (text) => (
        <StatusComponent colour={text}>{DOMPurify.sanitize(text)}</StatusComponent>
      )
    }
  ];

  if (!loading_detail && !isApprover && !isPartnerInactive) {
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
        {!loading_detail && !isApprover && !isPartnerInactive && (
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
        idTable="rating-list-table"
        dataSource={data_rating?.content || []}
        columns={columns}
        loading={loading_rating}
        pageSize={pageSize}
        current={page}
        totalData={data_rating?.page?.totalElements || 0}
        onChange={(p) => setPage(p)}
        onSizeChanger={(size) => { setPageSize(size); setPage(1); }}
        onSort={(s) => setSort(s.order ? `${s.field}~${s.order === "ascend" ? "asc" : "desc"}` : "")}
        showSearchBar={true}
        showAdvanceSearch={true}
        tableScrolled={{ x: 2200, y: 525 }}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
      />

      <ModalRating 
        isOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        modalType={modalType}
        selectedRecord={selectedRecord}
        partnerId={partnerId}
        fetchRating={fetchRating}
      />

      <ModalActiveInactive
        dispatch={dispatch}
        getAPIOption={getAllApprovalList}
        getAPIDetail={getListApprovalById}
        selector={"paymentWarrantyPartner"}
        alertMessage={`Are you sure you want to inactivate rating ${inactiveRecord?.rating}?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={() => setOpenModalInactivate(false)}
        onFinish={handleSubmitModalInactivate}
      />

      <ModalHistory
        isOpen={isHistoryOpen && dataHistoryFix}
        handleClose={() => setIsHistoryOpen(false)}
        header={historyHeader}
        tabOptions={handleOptions()}
        dataApprover={dataHistoryFix?.dataApprover}
        dataHistory={dataHistoryFix?.dataHistory}
      />
    </div>
  );
};

export default RatingList;
