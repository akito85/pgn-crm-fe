import { Spin, Checkbox, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { EyeOutlined, DownloadOutlined, CheckSquareOutlined, CloseSquareOutlined, EditOutlined } from "@ant-design/icons";
import { renderColumn } from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import {
  getPaginatePaymentWarrantyPartner,
  getApprovalHistory,
  getDownloadPaymentWarrantyPartner,
  inactivePaymentWarrantyPartner,
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { disabledActionByStatus } from "../../../../../utils";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import { APPROVAL_STATUS, RECORD_STATUS } from "../../../../../constants/warrantyPartner";

const ViewPaymentWarrantyPartner = () => {
  const { loading, data, dataApprovalHistory } = useSelector((state) => state.paymentWarrantyPartner);
  const { bodyError } = useSelector((state) => state?.general);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const [modalHeader, setModalHeader] = useState("Inactive Information");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "approvalStatus", "action"],
  }));

  const handleFetch = useCallback(() => {
    dispatch(
      getPaginatePaymentWarrantyPartner({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER,
      breadcrumbName: "Payment Guarantee Partner",
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
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({ ...prevState, [dataIndex]: selectedKeys[0] }));
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      setDataApprovalHistoryFix({
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.PAYMENT_WARRANTY_PARTNER || [],
          inactive: dataApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_WARRANTY_PARTNER || [],
          active: dataApprovalHistory?.dataApprover?.ACTIVE_PAYMENT_WARRANTY_PARTNER || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PAYMENT_WARRANTY_PARTNER || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_WARRANTY_PARTNER || [],
          active: dataApprovalHistory?.dataHistory?.ACTIVE_PAYMENT_WARRANTY_PARTNER || [],
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
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PARTNER CODE",
      dataIndex: "partnerCode",
      key: "partnerCode",
      sorter: true,
      ...getColumnSearchPropsPaging("partnerCode", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn("partnerCode", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "PARTNER GUARANTEE ISSUER",
      dataIndex: "partnerGuaranteeIssuer",
      key: "partnerGuaranteeIssuer",
      sorter: true,
      ...getColumnSearchPropsPaging("partnerGuaranteeIssuer", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("partnerGuaranteeIssuer", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "PARTNER TYPE",
      dataIndex: "partnerType",
      key: "partnerType",
      sorter: true,
      ...getColumnSearchPropsPaging("partnerType", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("partnerType", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, record) => renderColumn("startDate", searchedColumn, searchText, record?.startDate || "-", false, "input", search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, record) => renderColumn("endDate", searchedColumn, searchText, record?.endDate || "-", false, "input", search),
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
    dispatch(getDownloadPaymentWarrantyPartner({ search: encodeURIComponent(JSON.stringify(search)), page, pageSize, sort }));
  };

  const handleInactive = (r, actionType = "inactive") => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(r?.partnerGuaranteeIssuer || r?.partnerCode || "");
    setStatus(r?.status);
    setModalHeader(actionType === "active" ? "Active Information" : "Inactive Information");
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = { id, appHierId: res.approvalHierarchy, status: status === "Inactive" ? "Active" : "Inactive", remark: res.remark };
    setBody({ body });
    dispatch(inactivePaymentWarrantyPartner({ body })).unwrap().then(() => {
      handleClear();
      setOpenModalInactivate(false);
      handleFetch();
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
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PAYMENT_WARRANTY_PARTNER}>
          <ButtonComponent icon={<SVGIcon name="IconButtonCreate" width={24} />} type="submit">
            Create Payment Guarantee Partner
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title={"Detail"}>
          <Link to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_WARRANTY_PARTNER} state={{ id: record?.id }}>
            <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
          </Link>
        </Tooltip>
      ),
    },
    {
      action: "update",
      type: "table",
      render: (record, data_length) => {
        const disabled = disabledActionByStatus("update", record?.status, record?.approvalStatus);
        return data_length > 3 ? (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PAYMENT_WARRANTY_PARTNER}
            state={{ id: record?.id }}
            className={`flex items-center gap-3 py-2 px-3 w-[200px] ${
              disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-gray-50"
            }`}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <EditOutlined style={{ fontSize: "18px", color: "#000" }} />
            <span className="text-black text-sm text-center">Update</span>
          </Link>
        ) : (
          <Tooltip title={"Update"}>
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PAYMENT_WARRANTY_PARTNER}
              state={{ id: record?.id }}
              className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <EditOutlined style={{ fontSize: "18px", color: disabled ? "#d9d9d9" : "#0075bf" }} />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        // 'Activated' button: enabled only when status is Inactive and not waiting approval
        const isInactive = record?.status === RECORD_STATUS.INACTIVE;
        const isWaiting = record?.approvalStatus === APPROVAL_STATUS.WAITING_APPROVAL;
        const disabled = !isInactive || isWaiting;
        return data_length > 3 ? (
          <div
            className={`flex items-center gap-3 py-2 px-3 w-[200px] ${
              disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-gray-50'
            }`}
            onClick={(e) => {
              if (disabled) { e.preventDefault(); e.stopPropagation(); return; }
              handleInactive(record, "active");
            }}
          >
            <CheckSquareOutlined style={{ fontSize: '18px', color: '#000' }} />
            <span className="text-black text-sm text-center">Activated</span>
          </div>
        ) : (
          <Tooltip title="Activated">
            <div
            onClick={() => { if (!disabled) handleInactive(record, "active"); }}
              className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
              <CheckSquareOutlined style={{ fontSize: '18px', color: disabled ? '#d9d9d9' : 'inherit' }} />
            </div>
          </Tooltip>
        );
      }
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        // 'Inactivated' button: enabled only when status is Active and not waiting approval
        const isActive = record?.status === RECORD_STATUS.ACTIVE;
        const isWaiting = record?.approvalStatus === APPROVAL_STATUS.WAITING_APPROVAL;
        const disabled = !isActive || isWaiting;
        return data_length > 3 ? (
          <div
            className={`flex items-center gap-3 py-2 px-3 w-[200px] ${
              disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-gray-50'
            }`}
            onClick={(e) => {
              if (disabled) { e.preventDefault(); e.stopPropagation(); return; }
              handleInactive(record, "inactive");
            }}
          >
            <CloseSquareOutlined style={{ fontSize: '18px', color: '#000' }} />
            <span className="text-black text-sm text-center">Inactivated</span>
          </div>
        ) : (
          <Tooltip title="Inactivated">
            <div
            onClick={() => { if (!disabled) handleInactive(record, "inactive"); }}
              className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
              <CloseSquareOutlined style={{ fontSize: '18px', color: disabled ? '#d9d9d9' : 'inherit' }} />
            </div>
          </Tooltip>
        );
      }
    },
    {
      action: "history",
      type: "table",
      render: (record, data_length) => (
        data_length > 3 ? (
          <div
            className="flex items-center gap-3 py-2 px-3 w-[200px] cursor-pointer hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              handleApprovalHistory(record?.id);
            }}
          >
            <SVGIcon name="IconLogHistory" color={"#000"} width={18} />
            <span className="text-black text-sm text-center">Approval History</span>
          </div>
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
    handleFetch();
  };

  const { renderModal } = useTryAgainHooks(handleRetry);

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">PAYMENT GUARANTEE PARTNER LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }>
          <TableRBI
            showExport={true}
            handleDownload={handleDownload}
            dataSource={data?.content}
            pageSize={pageSize}
            columns={[...columns, ...useColumnActionPermission(["view", "history", "update", 'activate'], itemActions)]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements}
            onSort={(s) => setSort(s.order ? `${s.field}~${s.order === "ascend" ? "asc" : "desc"}` : "")}
            tableScrolled={{ x: "max-content", y: 525 }}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
          />
        </CardContainer>
        <ModalActiveInactive
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"paymentWarrantyPartner"}
          header={modalHeader}
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

export default ViewPaymentWarrantyPartner;
