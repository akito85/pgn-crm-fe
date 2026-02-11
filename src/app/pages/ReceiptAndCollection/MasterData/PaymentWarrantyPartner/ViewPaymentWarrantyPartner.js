import { Spin, Checkbox, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../../../../../components/CardContainer";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
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
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER, breadcrumbName: "Payment Warranty Partner" },
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
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PAYMENT_WARRANTY_PARTNER || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_WARRANTY_PARTNER || [],
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
      title: "PARTNER NAME",
      dataIndex: "partnerName",
      key: "partnerName",
      sorter: true,
      ...getColumnSearchPropsPaging("partnerName", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn("partnerName", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "TYPE",
      dataIndex: "partnerType",
      key: "partnerType",
      sorter: true,
      ...getColumnSearchPropsPaging("partnerType", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("partnerType", searchedColumn, searchText, text, true, "input", search),
    },
    {
      title: "NPWP",
      dataIndex: "npwp",
      key: "npwp",
      sorter: true,
      ...getColumnSearchPropsPaging("npwp", searchInput, searchedColumn, searchText, handleSearch, false),
      render: (text) => renderColumn("npwp", searchedColumn, searchText, text, true, "input", search),
    },
    {
        title: "LICENSE NUMBER",
        dataIndex: "licenseNum",
        key: "licenseNum",
        sorter: true,
        ...getColumnSearchPropsPaging("licenseNum", searchInput, searchedColumn, searchText, handleSearch, false),
        render: (text) => renderColumn("licenseNum", searchedColumn, searchText, text, true, "input", search),
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

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(r?.partnerName);
    setStatus(r?.status);
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
          <Link to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_WARRANTY_PARTNER} state={{ id: record?.id }}>
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
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PAYMENT_WARRANTY_PARTNER}
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
                <Link to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PAYMENT_WARRANTY_PARTNER} state={{ id: record?.id }} className={!isEditable ? "pointer-events-none" : ""}>
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
    handleFetch();
  };

  const { renderModal } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">WARRANTY PARTNER LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }>
          <TableRBI
            showExport={true}
            handleDownload={handleDownload}
            dataSource={data?.result}
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
    </LayoutMenu>
  );
};

export default ViewPaymentWarrantyPartner;
