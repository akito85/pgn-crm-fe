/* eslint-disable react/prop-types */
import React, { useRef, useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Dropdown, Tooltip } from "antd";
import moment from "moment";
import CollapsibleCardContainer from "../../../../components/CollapsibleCardContainer";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";
import DetailText from "../../../../components/DetailText";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsMutationDetail } from "./Table/TableMutationDetail";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import {
  getMutationDetailPaginate,
  getAllGasDepositPaginate,
  getApprovalHistory,
  getAttachmentList,
  processGasDepositApproval,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";
import ModalCreateMutationDetail from "./Modal/ModalCreateMutationDetail";
import ModalViewMutationDetail from "./Modal/ModalViewMutationDetail";

const formatApprovalHistoryLabel = (key) => {
  const normalizedKey = key.toUpperCase();

  if (normalizedKey === "GAS_DEPOSIT_MUTATION") return "Mutation";
  if (normalizedKey === "GAS_DEPOSIT") return "Gas Deposit";
  if (normalizedKey === "INACTIVE_GAS_DEPOSIT") return "Inactive";

  return key
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll(/\b\w/g, (char) => char.toUpperCase());
};

const mapApprovalHistoryData = (approvalHistory, preferredKeys = []) => {
  const approverSource = approvalHistory?.dataApprover || {};
  const historySource = approvalHistory?.dataHistory || {};
  const allKeys = [...new Set([...Object.keys(approverSource), ...Object.keys(historySource)])];
  const orderedKeys = [
    ...preferredKeys.filter((key) => allKeys.includes(key)),
    ...allKeys.filter((key) => !preferredKeys.includes(key)),
  ].filter((key) => (approverSource[key] || historySource[key] || []).length > 0);

  if (!orderedKeys.length) return {};

  if (orderedKeys.length === 1) {
    const selectedKey = orderedKeys[0];
    return {
      dataApprover: approverSource[selectedKey] || [],
      dataHistory: historySource[selectedKey] || [],
      tabOptions: [],
    };
  }

  const dataApprover = {};
  const dataHistory = {};

  orderedKeys.forEach((key) => {
    const normalizedKey = key.toLowerCase();
    dataApprover[normalizedKey] = approverSource[key] || [];
    dataHistory[normalizedKey] = historySource[key] || [];
  });

  return {
    dataApprover,
    dataHistory,
    tabOptions: orderedKeys.map((key) => ({
      key,
      value: formatApprovalHistoryLabel(key),
      label: formatApprovalHistoryLabel(key),
    })),
  };
};

const GasDepositDetail = (props) => {
  const { selectedData, onClose } = props;
  const detailRef = useRef(null);
  const dispatch = useDispatch();
  const selectedGasDepositId = selectedData?.gasDepositId || selectedData?.id;

  const [modalCreateMD, setModalCreateMD] = useState(false);
  const [modalViewMD, setModalViewMD] = useState(false);
  const [modalApprovalHistoryMD, setModalApprovalHistoryMD] = useState(false);
  const [modalConfirmApprovalMD, setModalConfirmApprovalMD] = useState(false);
  const [approveOrRejectMD, setApproveOrRejectMD] = useState("");
  const [selectedMutationDetail, setSelectedMutationDetail] = useState(null);
  const [dataApprovalHistoryFixMD, setDataApprovalHistoryFixMD] = useState({});

  const {
    data_mutation_detail,
    loading_mutation_detail,
    data_approval_history,
    loading_history,
    data_attachment,
    loading_attachment,
  } = useSelector((state) => state.gasDepositRbi);

  const dataSourceMutationDetail = data_mutation_detail?.result;

  // ===================== Mutation Detail State =====================
  const searchInputMD = useRef(null);
  const [searchedColumnMD, setSearchedColumnMD] = useState("");
  const [searchTextMD, setSearchTextMD] = useState("");
  const [searchMD, setSearchMD] = useState({});
  const [fixedColumnsMD, setFixedColumnsMD] = useState(() => ({
    left: [],
    right: ["action", "status", "statusApproval"],
  }));

  // ===================== Fetch mutation detail on mount (triggered when user clicks detail icon) =====================
  useEffect(() => {
    if (selectedGasDepositId) {
      dispatch(
        getMutationDetailPaginate({
          gasDepositId: selectedGasDepositId,
          page: 1,
          pageSize: 100,
          search: "",
          sort: "",
        }),
      );
      dispatch(
        getAttachmentList({
          referenceId: selectedGasDepositId,
          category: "GAS_DEPOSIT_SUMMARY",
        }),
      );
    }
  }, [dispatch, selectedGasDepositId]);

  useEffect(() => {
    if (selectedGasDepositId && detailRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }
  }, [selectedGasDepositId]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      setDataApprovalHistoryFixMD(
        mapApprovalHistoryData(data_approval_history, [
          "GAS_DEPOSIT_MUTATION",
          "GAS_DEPOSIT",
          "INACTIVE_GAS_DEPOSIT",
        ]),
      );
    } else {
      setDataApprovalHistoryFixMD({});
    }
  }, [data_approval_history]);

  useEffect(() => {
    if (!dataSourceMutationDetail?.length) {
      setSelectedMutationDetail(null);
      return;
    }

    setSelectedMutationDetail((prev) => {
      const waitingMutation =
        dataSourceMutationDetail.find((item) => item?.statusApproval === "Waiting Approval") ||
        null;

      if (!prev) {
        return waitingMutation || dataSourceMutationDetail[0];
      }

      const prevId = prev?.mutationId || prev?.stgMutId || prev?.id;
      return (
        dataSourceMutationDetail.find(
          (item) => (item?.mutationId || item?.stgMutId || item?.id) === prevId,
        ) || waitingMutation || dataSourceMutationDetail[0]
      );
    });
  }, [dataSourceMutationDetail]);

  // ===================== Mutation Detail Handlers =====================
  const handleSearchMD = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextMD(selectedKeys[0]);
    setSearchedColumnMD(selectedKeys[0] ? dataIndex : "");
    setSearchMD((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const onSortMD = () => {};

  const handleApprovalHistoryMD = (record) => {
    dispatch(
      getApprovalHistory(
        record?.mutationId || record?.stgMutId || record?.id || selectedGasDepositId,
      ),
    );
    setModalApprovalHistoryMD(true);
  };

  const handleOpenApprovalMutation = (action) => {
    setApproveOrRejectMD(action);
    setModalConfirmApprovalMD(true);
  };

  const handleConfirmApprovalMutation = async (res, handleClear) => {
    if (!approvalTarget?.referenceId || !approvalTarget?.referenceType) return;

    await dispatch(
      processGasDepositApproval({
        referenceId: approvalTarget.referenceId,
        referenceType: approvalTarget.referenceType,
        action: approveOrRejectMD.toUpperCase(),
        note: res?.remark || "",
      }),
    ).unwrap();

    handleClear();
    setModalConfirmApprovalMD(false);
    setApproveOrRejectMD("");

    dispatch(
      getMutationDetailPaginate({
        gasDepositId: selectedGasDepositId,
        page: 1,
        pageSize: 100,
        search: "",
        sort: "",
      }),
    );
  };

  const itemGrantAccessMD = [
    {
      action: "View",
      type: "table",
      render: (record) => {
        const menuItems = [
          {
            key: "update",
            label: (
              <span className="flex items-center gap-2">
                <SVGIcon name="IconUpdateAction" width={16} />
                <span>Update</span>
              </span>
            ),
            onClick: () => {},
          },
          {
            key: "approvalHistory",
            label: (
              <span className="flex items-center gap-2">
                <SVGIcon name="IconLogHistory" width={16} />
                <span>Approval History</span>
              </span>
            ),
            onClick: () => handleApprovalHistoryMD(record),
          },
          {
            type: "divider",
          },
          {
            key: "cancel",
            label: (
              <span className="flex items-center gap-2">
                <SVGIcon name="IconSquareX" color="#ef4444" width={16} />
                <span className="text-red-500">Cancel</span>
              </span>
            ),
            onClick: () => {},
          },
        ];
        return (
          <div className="flex items-center justify-center gap-1">
            <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
              <button
                type="button"
                data-stop-row-click="true"
                className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <SVGIcon name="IconTripleDot" color="#0075bf" width={20} />
              </button>
            </Dropdown>
            <Tooltip title="View Detail">
              <button
                type="button"
                data-stop-row-click="true"
                className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMutationDetail(record);
                  setModalViewMD(true);
                }}
              >
                <SVGIcon name="IconDetail" color="#0075bf" width={20} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const actionColsMD = useColumnActionPermission(["view"], itemGrantAccessMD).map((col) => ({
    ...col,
    width: 60,
    align: "center",
    fixed: "right",
  }));

  const baseColumnsMD = useMemo(() => {
    return columnsMutationDetail(0, 0, searchInputMD, searchedColumnMD, searchTextMD, handleSearchMD, searchMD);
  }, [searchedColumnMD, searchTextMD, searchMD]);

  const allColumnsMD = useMemo(() => {
    return [...baseColumnsMD, ...actionColsMD].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsMD, actionColsMD]);

  const processedColumnsMD = useMemo(
    () => applyFixedColumns(allColumnsMD, fixedColumnsMD),
    [allColumnsMD, fixedColumnsMD],
  );

  const columnDefinitionsMD = useMemo(
    () => allColumnsMD.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumnsMD],
  );

  const dataSourceMD = useMemo(
    () =>
      dataSourceMutationDetail?.map((item) => ({
        ...item,
        key: item.mutationId ?? item.stgMutId ?? item.id,
        id: item.mutationId ?? item.stgMutId ?? item.id,
        documentNumber: item.documentNumber || null,
        source: item.source || null,
        billingPeriod: item.billingPeriod || null,
        mutationDate: item.mutationDate || null,
        mutationType: item.mutationType || null,
        category: item.category || null,
        uom: item.uom || null,
        quantity: item.quantity ?? null,
        price: item.price ?? null,
        amount: item.amount ?? null,
        type: item.type || null,
        description: item.description || null,
        status: item.status || null,
        statusApproval: item.statusApproval || null,
      })),
    [dataSourceMutationDetail],
  );

  const waitingMutationDetail = useMemo(
    () =>
      dataSourceMD?.find((item) => item?.statusApproval === "Waiting Approval") || null,
    [dataSourceMD],
  );

  const approvalTarget = useMemo(() => {
    if (selectedData?.statusApproval === "Waiting Approval") {
      return {
        referenceType: "SUMMARY",
        referenceId: selectedData?.pendingStgSumId || selectedData?.stgSumId || selectedData?.id,
        name: selectedData?.accountNumber || selectedData?.customerNumber || "-",
      };
    }

    const mutationTarget =
      (selectedMutationDetail?.statusApproval === "Waiting Approval" && selectedMutationDetail) ||
      waitingMutationDetail;

    if (mutationTarget) {
      return {
        referenceType: "MUTATION",
        referenceId:
          mutationTarget?.mutationId || mutationTarget?.stgMutId || mutationTarget?.id,
        name: mutationTarget?.documentNumber || mutationTarget?.mutationId || "-",
      };
    }

    return null;
  }, [selectedData, selectedMutationDetail, waitingMutationDetail]);

  useEffect(() => {
    if (approvalTarget?.referenceId) {
      dispatch(getApprovalHistory(approvalTarget.referenceId));
    }
  }, [approvalTarget?.referenceId, dispatch]);

  const canProcessApproval = data_approval_history?.isApprover === true;

  // ===================== Approval / Attachment Columns (Gas Deposit Detail tab) =====================
  const approvalColumnsGD = useMemo(() => [
    { key: "no", title: "NO", width: 50, align: "center", render: (_, __, idx) => idx + 1 },
    { key: "approver", title: "APPROVER", dataIndex: "approver", width: 150 },
    { key: "role", title: "ROLE", dataIndex: "role", width: 120 },
    { key: "status", title: "STATUS", dataIndex: "status", width: 150 },
  ], []);

  const attachmentColumnsGD = useMemo(() => [
    { key: "no", title: "NO", width: 50, align: "center", render: (_, __, idx) => idx + 1 },
    { key: "fileName", title: "FILE NAME", dataIndex: "fileName", width: 200 },
    { key: "category", title: "CATEGORY", dataIndex: "category", width: 150 },
    { key: "type", title: "TYPE", dataIndex: "type", width: 120 },
    { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 200 },
    { key: "fileSize", title: "FILE SIZE", dataIndex: "fileSize", width: 100 },
  ], []);

  const approvalDataSource = useMemo(() => {
    const approverData = dataApprovalHistoryFixMD?.dataApprover;

    if (Array.isArray(approverData)) {
      return approverData
        .filter(Boolean)
        .map((item, idx) => ({ ...item, key: item.id ?? idx }));
    }

    if (approverData && typeof approverData === "object") {
      const firstRows = Object.values(approverData).find(
        (item) => Array.isArray(item) && item.length > 0,
      );
      return (firstRows || []).filter(Boolean).map((item, idx) => ({
        ...item,
        key: item.id ?? idx,
      }));
    }

    return [];
  }, [dataApprovalHistoryFixMD]);

  const attachmentDataSource = useMemo(() =>
    (Array.isArray(data_attachment) ? data_attachment : []).filter(Boolean).map((item, idx) => ({ ...item, key: item.id ?? idx })),
    [data_attachment]
  );

  // ===================== Tabs content =====================
  const gasDepositTab = (
    <div className="flex flex-col gap-1 mt-2">
      {/* ACCOUNT INFORMATION */}
      <CollapsibleContainer header="Account Information" border className="mt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
          <DetailText label="Customer Number">{selectedData?.customerNumber || "-"}</DetailText>
          <DetailText label="Customer Name">{selectedData?.customerName || "-"}</DetailText>
          <DetailText label="Account Number">{selectedData?.accountNumber || "-"}</DetailText>
          <DetailText label="Account Name">{selectedData?.accountName || "-"}</DetailText>
          <DetailText label="Account Group Type">{selectedData?.accountGroupType || "-"}</DetailText>
          <DetailText label="SOR">{selectedData?.sor || "-"}</DetailText>
          <DetailText label="Cost Center">{selectedData?.costCenter || "-"}</DetailText>
          <DetailText label="Account Segment">{selectedData?.accountSegment || "-"}</DetailText>
          <DetailText label="Meter Reading Code">{selectedData?.meterReadingCode || "-"}</DetailText>
          <DetailText label="Account Type">{selectedData?.accountType || "-"}</DetailText>
          <DetailText label="Classification Type">{selectedData?.classificationType || "-"}</DetailText>
          <DetailText label="SAP CUST ID">{selectedData?.sapCustId || "-"}</DetailText>
        </div>
      </CollapsibleContainer>

      {/* GAS DEPOSIT INFORMATION */}
      <CollapsibleContainer header="Gas Deposit Information" border className="mt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
          <DetailText label="Terms Earn">{selectedData?.termsEarn ?? "-"}</DetailText>
          <DetailText label="Terms Redeem">{selectedData?.termsRedeem ?? "-"}</DetailText>
          <DetailText label="Period Earn">{selectedData?.periodEarn || selectedData?.earnPeriod || "-"}</DetailText>
          <DetailText label="Period Start Redeem">{selectedData?.periodRedeemStart || "-"}</DetailText>
          <DetailText label="Period End Redeem">{selectedData?.periodRedeemEnd || "-"}</DetailText>
          <DetailText label="Period">{selectedData?.period || "-"}</DetailText>
          <DetailText label="Time Unit">{selectedData?.timeUnit || "-"}</DetailText>
          <DetailText label="UOM">{selectedData?.uom || "-"}</DetailText>
          <DetailText label="Amount">{selectedData?.amount ?? "-"}</DetailText>
          <DetailText label="Receipt Balance">{selectedData?.cashBalance ?? selectedData?.receiptBalance ?? "-"}</DetailText>
          <DetailText label="Type">{selectedData?.type || "-"}</DetailText>
          <DetailText label="Source">{selectedData?.source || "-"}</DetailText>
          <DetailText label="Description" className="sm:col-span-2 lg:col-span-5">{selectedData?.description || "-"}</DetailText>
        </div>
      </CollapsibleContainer>
    </div>
  );

  const approvalTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Approval Information" border>
        <TableRBI
          idTable="gas-deposit-approval-table"
          dataSource={approvalDataSource}
          columns={approvalColumnsGD}
          totalData={approvalDataSource.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={false}
          showRefresh={false}
          loading={loading_history}
        />
      </CollapsibleContainer>
    </div>
  );

  const attachmentTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Attachment" border>
        <TableRBI
          idTable="gas-deposit-attachment-table"
          dataSource={attachmentDataSource}
          columns={attachmentColumnsGD}
          totalData={attachmentDataSource.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={false}
          showRefresh={false}
          loading={loading_attachment}
        />
      </CollapsibleContainer>
    </div>
  );

  const tabItems = [
    { key: "gasDeposit", label: "Gas Deposit", children: gasDepositTab },
    { key: "approval", label: "Approval", children: approvalTab },
    { key: "attachment", label: "Attachment", children: attachmentTab },
  ];

  // ===================== Render =====================
  return (
    <div ref={detailRef} className="scroll-mt-4">
      {/* ========== GAS DEPOSIT DETAIL ========== */}
      <CollapsibleCardContainer header="GAS DEPOSIT DETAIL" defaultOpen={false}>
        <Tabs
          items={tabItems}
          defaultActiveKey="gasDeposit"
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0"
        />
      </CollapsibleCardContainer>

      {/* ========== MUTATION DETAIL ========== */}
      <CollapsibleCardContainer header="MUTATION DETAIL" defaultOpen={true}>
        <div className="flex justify-end mb-3">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            onClick={() => setModalCreateMD(true)}
          >
            Create
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="mutation-detail-table"
          dataSource={dataSourceMD}
          columns={processedColumnsMD}
          totalData={data_mutation_detail?.page?.totalElements || 0}
          tableScrolled={{ x: 2000, y: 400 }}
          onSort={onSortMD}
          columnDefinitions={columnDefinitionsMD}
          fixedColumns={fixedColumnsMD}
          setFixedColumns={setFixedColumnsMD}
          loading={loading_mutation_detail}
          showExport={false}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={false}
          enableRowClick={true}
          selectedRowKey={
            selectedMutationDetail?.mutationId ||
            selectedMutationDetail?.stgMutId ||
            selectedMutationDetail?.id ||
            null
          }
          onRowClick={(record) => setSelectedMutationDetail(record)}
        />
      </CollapsibleCardContainer>

      {/* ========== HISTORY LOG INFORMATION ========== */}
      <CollapsibleCardContainer header="HISTORY LOG INFORMATION" defaultOpen={true}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-3">
          <DetailText label="Record ID">{selectedData?.id || selectedData?.gasDepositId || "-"}</DetailText>
          <DetailText label="Created Date">
            {selectedData?.createdDate
              ? moment(selectedData.createdDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label="Created By">{selectedData?.createdBy || "-"}</DetailText>
          <DetailText label="Updated Date">
            {selectedData?.updatedDate
              ? moment(selectedData.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label="Updated By">{selectedData?.updatedBy || "-"}</DetailText>
        </div>
      </CollapsibleCardContainer>

      <div className="flex my-3">
        <ButtonComponent type={"submit"} onClick={onClose}>
          Cancel
        </ButtonComponent>

        {approvalTarget && canProcessApproval ? (
          <div className={"w-full flex justify-end gap-3"}>
            <ButtonComponent
              type="reject"
              onClick={() => handleOpenApprovalMutation("Reject")}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent
              type="approve"
              onClick={() => handleOpenApprovalMutation("Approve")}
            >
              Approve
            </ButtonComponent>
          </div>
        ) : null}
      </div>

      {/* ========== MODAL ========== */}
      <ModalCreateMutationDetail
        isOpen={modalCreateMD}
        withApprovalAndAttachment={true}
        handleCancel={() => setModalCreateMD(false)}
        handleRefresh={() => {
          dispatch(getAllGasDepositPaginate({ page: 1, pageSize: 100, search: "", sort: "" }));
          onClose();
        }}
        selectedData={selectedData}
      />

      <ModalViewMutationDetail
        isOpen={modalViewMD}
        handleCancel={() => {
          setModalViewMD(false);
          setSelectedMutationDetail(null);
        }}
        selectedData={selectedData}
        selectedMutationDetail={selectedMutationDetail}
      />

      <ModalHistory
        isOpen={modalApprovalHistoryMD && !!dataApprovalHistoryFixMD}
        handleClose={() => setModalApprovalHistoryMD(false)}
        header={"Approval History"}
        width={1000}
        tabOptions={dataApprovalHistoryFixMD?.tabOptions}
        dataApprover={dataApprovalHistoryFixMD?.dataApprover}
        dataHistory={dataApprovalHistoryFixMD?.dataHistory}
        loading={loading_history}
      />

      <ModalApproveOrReject
        isOpen={modalConfirmApprovalMD}
        handleCloseModal={() => {
          setModalConfirmApprovalMD(false);
          setApproveOrRejectMD("");
        }}
        onFinish={handleConfirmApprovalMutation}
        header={approveOrRejectMD}
        approveOrReject={approveOrRejectMD}
        menu={approvalTarget?.referenceType === "SUMMARY" ? "Gas Deposit Summary" : "Gas Deposit Mutation"}
        named={approvalTarget?.name || "-"}
      />
    </div>
  );
};

GasDepositDetail.propTypes = {
  onClose: PropTypes.func,
  selectedData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gasDepositId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customerNumber: PropTypes.string,
    customerName: PropTypes.string,
    accountNumber: PropTypes.string,
    accountName: PropTypes.string,
    accountGroupType: PropTypes.string,
    sor: PropTypes.string,
    costCenter: PropTypes.string,
    accountSegment: PropTypes.string,
    meterReadingCode: PropTypes.string,
    accountType: PropTypes.string,
    classificationType: PropTypes.string,
    sapCustId: PropTypes.string,
    termsEarn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    termsRedeem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    periodEarn: PropTypes.string,
    earnPeriod: PropTypes.string,
    periodRedeemStart: PropTypes.string,
    periodRedeemEnd: PropTypes.string,
    period: PropTypes.string,
    timeUnit: PropTypes.string,
    uom: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cashBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    receiptBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    source: PropTypes.string,
    description: PropTypes.string,
    createdDate: PropTypes.string,
    createdBy: PropTypes.string,
    updatedBy: PropTypes.string,
  }),
};

GasDepositDetail.defaultProps = {
  onClose: () => {},
  selectedData: null,
};

export default GasDepositDetail;
