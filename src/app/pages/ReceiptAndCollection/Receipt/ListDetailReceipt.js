/* eslint-disable default-case */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Tabs, Spin, Alert } from "antd";
import moment from "moment";
import { toTitleCase } from "../../../../utils";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import CardContainerNoBorder from "../../../../components/CardContainerNoBorder";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import { SyncOutlined } from "@ant-design/icons";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { hasValue } from "../../../../utils";
import { configApp } from "../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { clearBodyMessage } from "../../../../redux/slices/general_slice";
import SVGIcon from "../../../../assets/Icon/index.js";
import DetailAttachment from "./DetailAttachment.js";
import CreateAllocation from "./Table/CreateAllocation";
import LogHistoryInfo from "../../../../components/LogHistoryInfo";
import FooterDetail from "../../../../components/FooterDetail";
import DetailReceipt from "./DetailReceipt";
import BaseContainer from "../../../../components/BaseContainer";
import ApprovalSectionForm from "../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import {
  approveOrRejectHoldReceipt,
  approveOrRejectReceipt,
  approveOrRejectReleaseReceipt,
  createAllocation,
  getReceiptDetail,
  getAllocation,
  getListApprovalByIdReceipt,
} from "../../../../redux/slices/receipt_collection/receipt";
import { columnsAllocation } from "./Table/ColumnAllocation";
import TableRBI from "../../../../components/TableRBI";
import { dateFormatting } from "../../../../utils";

const ListDetailReceipt = ({ type: propType }) => {
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Support both navigation state and URL param
  const id = params.id || location?.state?.id;

  // use state
  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [isInsert, setIsInsert] = useState(false);
  const [balance, setBalance] = useState(0);
  const [dataAllocation, setDataAllocation] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  // Tabs state
  const [activeTabReceipt, setActiveTabReceipt] = useState("Receipt");
  const [activeTabAllocation, setActiveTabAllocation] = useState("Allocation");

  const { loading, data_detail, data_allocation, dataListAppHierDetail } = useSelector(
    (state) => state.receipt
  );
  const [modalError, setModalError] = useState(false);

  // Allocation local states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [storedData, setStoredData] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [totalAllocationAmount, setTotalAllocationAmount] = useState(0);

  // Allocation table search
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  // Determine approval type from data_detail or prop
  const approvalType = data_detail?.approvalDto?.approvalType || "";
  const isHold = approvalType.toUpperCase().includes("HOLD") || propType === "hold";
  const isRelease = approvalType.toUpperCase().includes("RELEASE") || propType === "release";
  const isRefund = approvalType.toUpperCase().includes("REFUND") || propType === "refund";
  const isReverse = approvalType.toUpperCase().includes("REVERSE") || propType === "reverse";
  const hasApprovalFlow = isHold || isRelease || isRefund || isReverse;

  const actualTypeLabel = isHold
    ? "Hold"
    : isRelease
    ? "Release"
    : isRefund
    ? "Refund"
    : isReverse
    ? "Reverse"
    : "";

  useEffect(() => {
    if (id) {
      dispatch(getReceiptDetail(id));
      dispatch(
        getAllocation({
          id,
          page,
          pageSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
        })
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  // Load approval hierarchy
  useEffect(() => {
    if (data_detail?.appHierId) {
      dispatch(getListApprovalByIdReceipt({ id: data_detail.appHierId }));
    }
  }, [data_detail, dispatch]);

  useEffect(() => {
    if (dataListAppHierDetail?.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: (a.employeeDetail || []).map((b, idx) => ({
          ...b,
          key: idx + 1,
        })),
      }));
      setAppHierDataDetail(data);
    }
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (data_allocation?.result?.length > 0) {
      setDataTable(data_allocation?.result);
    }
  }, [data_allocation]);

  const changeValuesAllocation = useCallback(() => {
    setDataAllocation(dataTable);
    setIsInsert(storedData);
    setBalance(data_detail?.unAppliedAmountReal - totalAllocationAmount);
  }, [dataTable, data_detail?.unAppliedAmountReal, storedData, totalAllocationAmount]);

  useEffect(() => {
    changeValuesAllocation();
  }, [changeValuesAllocation]);

  // Load attachments
  useEffect(() => {
    if (id && data_detail?.id) {
      const dataAttachment = (data_detail?.attachmentDtoList || []).map((item) => ({
        id: item.id,
        size: item.size,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.type,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        urlFile2: item.urlFile2,
        createdBy: item.createdBy,
        createdDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "",
        dataType: "exist",
      }));
      setListDataAttachment(dataAttachment);
    }
  }, [data_detail, dispatch, id]);

  // trigger modal error
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyError]);

  const handleCancel = () => {
    setModalConfirm(false);
  };

  // Handle Approve / Reject
  const handleConfirm = (res, handleClear) => {
    const data = {
      id: id,
      remark: res.remark,
      approvalId: data_detail?.approvalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    const category = data_detail?.approvalDto?.approvalType || "";
    if (category.toUpperCase().includes("HOLD")) {
      dispatch(approveOrRejectHoldReceipt({ body: data }));
    } else if (category.toUpperCase().includes("RELEASE")) {
      dispatch(approveOrRejectReleaseReceipt({ body: data }));
    } else {
      dispatch(approveOrRejectReceipt({ body: data }));
    }

    setModalConfirm(false);
    handleClear();
  };

  const handleConfirmRetry = () => {
    if (bodyError?.action === "GET_RECEIPT_DETAIL") {
      dispatch(getReceiptDetail(id));
    }
  };

  const handleRetry = () => {
    handleConfirmRetry();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  const handleApprove = () => {
    setModalConfirm(true);
    setApproveOrReject("approved");
  };

  const handleReject = () => {
    setModalConfirm(true);
    setApproveOrReject("reject");
  };

  const createAllocationDetail = () => {
    const body = {
      receiptId: id,
      allocationDtoList: dataAllocation
        ?.filter((item) => hasValue(item?.allocationNumber) === false)
        ?.map((item) => ({
          id: item?.id,
          allocationAmount: item?.allocationAmount,
        })),
    };
    dispatch(createAllocation(body));
  };

  const handleSearchAllocation = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChangePage = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const showButtonApproval = data_detail?.approvalDto?.isApprover === true;
  const isSubmitter = data_detail?.approvalDto?.isApprover === false;

  // Breadcrumbs
  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT, breadcrumbName: "Receipt" },
    { path: "", breadcrumbName: "Detail Receipt" },
  ];

  // ─── Hold/Release/Refund/Reverse summary table ────────────────────────────
  const holdReleaseData = data_detail?.id
    ? [
        {
          key: 1,
          receiptCode: data_detail?.receiptCode,
          account: data_detail?.account,
          balance: data_detail?.balance || data_detail?.unAppliedAmountReal,
          amount: data_detail?.amount || 0,
          holdAmount: data_detail?.holdAmount || data_detail?.unAppliedAmountReal,
        },
      ]
    : [];

  const holdReleaseColumns = [
    { title: "NO", width: 60, align: "center", render: (_t, _r, i) => i + 1 },
    { title: "RECEIPT CODE", dataIndex: "receiptCode" },
    { title: "ACCOUNT", dataIndex: "account" },
    {
      title: "BALANCE",
      dataIndex: "balance",
      align: "right",
      render: (text) => (text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0"),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      align: "right",
      render: (text) => (text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0"),
    },
    {
      title: `${actualTypeLabel.toUpperCase()} AMOUNT`,
      dataIndex: "holdAmount",
      align: "right",
      render: (text) => (text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0"),
    },
  ];

  // ─── Common tabs helper (Approval + Attachment) ────────────────────────────
  const getCommonTabs = () => [
    {
      key: "Approval",
      label: "Approval",
      children: (
        <div className="p-5">
          <BaseContainer header="APPROVAL INFORMATION">
            <ApprovalSectionForm
              showSelect={false}
              disableSelect={true}
              approvalName={data_detail?.approvalDto?.approvalName}
              dataTable={appHierDataDetail}
              selectedHierarchy={data_detail?.appHierId}
            />
          </BaseContainer>
        </div>
      ),
    },
    {
      key: "Attachment",
      label: "Attachment",
      children: (
        <div className="p-5">
          <DetailAttachment
            type="detail"
            data={listDataAttachment}
            updateData={setListDataAttachment}
            typeSelector="receipt"
            service={receiptCollectionHttpService}
            configApplication={configApp.PAYMENT_SERVICE}
          />
        </div>
      ),
    },
  ];

  // ─── RECEIPT DETAIL tabs ────────────────────────────────────────────────────
  const itemsReceipt = [
    {
      key: "Receipt",
      label: "Receipt",
      children: <DetailReceipt data_detail={data_detail} />,
    },
    ...getCommonTabs(),
  ];

  // ─── ALLOCATION DETAIL tabs ─────────────────────────────────────────────────
  const itemsAllocation = [
    {
      key: "Allocation",
      label: "Allocation",
      children: (
        <div className="w-full p-5">
          <CreateAllocation
            setIsInsert={setStoredData}
            isInsert={storedData}
            dataTable={dataTable}
            setDataTable={setDataTable}
            unApliedAmount={data_detail?.unAppliedAmountReal}
            dataDetail={data_detail}
            totalUnapliedAmount={totalAllocationAmount}
            setTotalUnapliedAmount={setTotalAllocationAmount}
          />
        </div>
      ),
    },
    {
      key: "Approval",
      label: "Approval",
      children: (
        <div className="p-5">
          <BaseContainer header="ALLOCATION APPROVAL">
            <div className="w-full text-center py-10 text-gray-500">
              Allocation approval data is unavailable.
            </div>
          </BaseContainer>
        </div>
      ),
    },
  ];

  // ─── HOLD/RELEASE/REFUND/REVERSE tabs (only if approval flow) ────────────────
  const approvalTabLabel = actualTypeLabel || "Approval";
  const approvalTabKey = actualTypeLabel.toLowerCase() || "approval";

  const approvalDetailTabItems = [
    {
      key: approvalTabKey,
      label: approvalTabLabel,
      children: (
        <div className="w-full p-5">
          <Spin spinning={loading}>
            <TableRBI
              dataSource={holdReleaseData}
              columns={holdReleaseColumns}
              pagination={false}
              usePagination={false}
              tableScrolled={{ x: 1500 }}
            />
          </Spin>
          {hasApprovalFlow && (
            <Alert
              style={{ marginTop: "24px", marginBottom: "16px" }}
              className="font-semibold w-full"
              message={`This Approval for ${actualTypeLabel.toUpperCase()}`}
              type="warning"
              showIcon
            />
          )}
        </div>
      ),
    },
    ...getCommonTabs(),
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <Spin spinning={loading}>
        {/* RECEIPT DETAIL */}
        <CardContainerNoBorder
          key={hasApprovalFlow ? "collapsed" : "expanded"}
          header="RECEIPT DETAIL"
          className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
          noPadding
          collapsible={true}
          defaultExpanded={!hasApprovalFlow}
        >
          <div className="full-width-tabs">
            <Tabs
              activeKey={activeTabReceipt}
              items={itemsReceipt}
              onChange={setActiveTabReceipt}
              className="custom-tabs-layout"
            />
          </div>
        </CardContainerNoBorder>

        {/* ALLOCATION DETAIL — only when NOT in approval flow */}
        {!hasApprovalFlow && (
          <CardContainerNoBorder
            header="ALLOCATION DETAIL"
            className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
            noPadding
            collapsible={true}
            defaultExpanded={true}
          >
            <div className="full-width-tabs">
              <Tabs
                activeKey={activeTabAllocation}
                items={itemsAllocation}
                onChange={setActiveTabAllocation}
                className="custom-tabs-layout"
              />
            </div>
          </CardContainerNoBorder>
        )}

        {/* HOLD / RELEASE / REFUND / REVERSE DETAIL */}
        {hasApprovalFlow && (
          <CardContainerNoBorder
            header={`${actualTypeLabel.toUpperCase()} DETAIL`}
            className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
            noPadding
            collapsible={true}
            defaultExpanded={true}
          >
            <div className="full-width-tabs">
              <Tabs
                activeKey={approvalTabKey}
                items={approvalDetailTabItems}
                onChange={() => {}}
                className="custom-tabs-layout"
              />
            </div>
          </CardContainerNoBorder>
        )}
      </Spin>

      <LogHistoryInfo
        data={{
          recordId: data_detail?.id || "-",
          createdDate: data_detail?.createdDate
            ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")
            : "-",
          createdBy: data_detail?.createdBy || "-",
          updatedDate: data_detail?.updatedDate
            ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
            : "-",
          updatedBy: data_detail?.updatedBy || "-",
        }}
      />

      <FooterDetail
        onCancel={() => navigate(-1)}
        showApproval={showButtonApproval === true}
        onApprove={handleApprove}
        onReject={handleReject}
        extraButtons={
          !showButtonApproval && !hasApprovalFlow ? (
            <>
              <ButtonComponent
                type="submit"
                onClick={() => ""}
                icon={
                  <SyncOutlined
                    style={{ color: "#fff", fontSize: 22, justifyItems: "center" }}
                  />
                }
                disabled={isInsert || balance < 0}
              >
                Reverse
              </ButtonComponent>
              {dataAllocation?.filter((item) => hasValue(item?.allocationNumber) === false)
                ?.length > 0 && (
                <ButtonComponent
                  type="submit"
                  onClick={createAllocationDetail}
                  disabled={isInsert || balance < 0}
                >
                  Submit
                </ButtonComponent>
              )}
            </>
          ) : null
        }
      />

      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={actualTypeLabel ? `${actualTypeLabel} Receipt` : "Receipt"}
        named={data_detail?.receiptNumber}
      />

      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText="Try Again"
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{bodyError?.response?.data?.message?.toString()}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </LayoutMenu>
  );
};

export default ListDetailReceipt;
