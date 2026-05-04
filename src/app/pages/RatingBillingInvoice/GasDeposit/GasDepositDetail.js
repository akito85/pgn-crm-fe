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
import { numberFormatting } from "../../../../utils/formatCurrency";

const formatApprovalHistoryLabel = (key) => {
  const normalizedKey = key.toUpperCase();

  if (normalizedKey === "GAS_DEPOSIT_MUTATION") return "Mutation";
  if (normalizedKey === "GAS_DEPOSIT") return "Gas Deposit";
  if (normalizedKey === "EXPIRED_GAS_DEPOSIT") return "Expired";
  if (normalizedKey === "INACTIVE_GAS_DEPOSIT") return "Inactive";

  return key
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll(/\b\w/g, (char) => char.toUpperCase());
};

const getDisplayStatus = (item, isExpiredFlow = false) => {
  const statusApproval = String(item?.statusApproval || "");
  const rawStatus = item?.status ?? item?.statusMaster ?? null;

  if (!isExpiredFlow) return rawStatus;
  if (statusApproval === "Waiting Approval" || statusApproval === "Draft") return "Draft";
  if (statusApproval === "Approved" || statusApproval === "Rejected") return "Expired";
  return rawStatus;
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

const normalizeGasDepositDetailData = (item) => {
  if (!item) return item;

  const normalizedGasDepositId =
    item.gasDepositId ??
    item.masterGasDepositId ??
    ((item.stgSumId ?? item.pendingStgSumId)
      ? -Math.abs(item.stgSumId ?? item.pendingStgSumId)
      : item.accountId);

  const normalizedRecordId =
    item.recordId ??
    item.referenceId ??
    item.stgSumId ??
    item.pendingStgSumId ??
    item.masterGasDepositId ??
    item.id ??
    (Number(normalizedGasDepositId) > 0 ? normalizedGasDepositId : null);

  return {
    ...item,
    key: item.key ?? item.stgSumId ?? item.pendingStgSumId ?? item.masterGasDepositId ?? item.accountId,
    gasDepositId: normalizedGasDepositId,
    recordId: normalizedRecordId,
    stgSumId: item.stgSumId ?? item.pendingStgSumId ?? null,
    pendingStgSumId: item.pendingStgSumId ?? item.stgSumId ?? null,
    expiredFlow: Boolean(item.expiredFlow),
    status: getDisplayStatus(item, Boolean(item.expiredFlow)),
    statusApproval: item.statusApproval || null,
    period: item.period || (item.earnStartDate && item.earnEndDate
      ? `${item.earnStartDate} - ${item.earnEndDate}`
      : item.earnStartDate || null),
    periodEarn: item.periodEarn || item.earnStartDate || null,
    periodEarnEnd: item.periodEarnEnd || item.earnEndDate || null,
    periodRedeemStart: item.periodRedeemStart || item.redeemStartDate || null,
    periodRedeemEnd: item.periodRedeemEnd || item.redeemEndDate || null,
    quantity: item.quantity ?? item.balanceVolume ?? null,
    amount: item.amount ?? item.balanceAmount ?? null,
    cashBalance: item.cashBalance ?? item.balanceVolume ?? item.receiptBalance ?? null,
    type: item.type ?? item.pendingActionType ?? null,
  };
};

const renderFormattedNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return numberFormatting(value);
};

const toMomentValue = (value) => {
  if (!value) return null;
  const parsed = moment(value);
  return parsed.isValid() ? parsed : null;
};

const formatShortDate = (value) => {
  const parsed = toMomentValue(value);
  return parsed ? parsed.format("D-MMM-YY") : "-";
};

const formatShortPeriod = (value) => {
  if (typeof value === "string" && value.includes(" - ")) {
    const [startValue] = value.split(" - ");
    const parsedStart = toMomentValue(startValue);
    return parsedStart ? parsedStart.format("MMM YY") : value;
  }
  const parsed = toMomentValue(value);
  return parsed ? parsed.format("MMM YY") : (value || "-");
};

const formatPeriodEarnRange = (startValue, endValue) => {
  const start = toMomentValue(startValue);
  const end = toMomentValue(endValue);

  if (start && end) {
    if (start.year() === end.year()) {
      return `${start.format("MMM")}-${end.format("MMM YYYY")}`;
    }
    return `${start.format("MMM YYYY")} - ${end.format("MMM YYYY")}`;
  }

  if (start) return start.format("MMM YYYY");
  if (end) return end.format("MMM YYYY");
  return "-";
};

const GasDepositDetail = (props) => {
  const { selectedData, onClose } = props;
  const detailRef = useRef(null);
  const dispatch = useDispatch();
  const [currentSelectedData, setCurrentSelectedData] = useState(() =>
    normalizeGasDepositDetailData(selectedData),
  );
  const selectedGasDepositId = currentSelectedData?.gasDepositId || currentSelectedData?.id;
  const selectedSummaryReferenceId = useMemo(() => {
    const explicitSummaryId = currentSelectedData?.pendingStgSumId || currentSelectedData?.stgSumId;
    if (explicitSummaryId !== undefined && explicitSummaryId !== null) {
      return explicitSummaryId;
    }

    const parsedId = Number(selectedGasDepositId);
    if (!Number.isNaN(parsedId) && parsedId < 0) {
      return Math.abs(parsedId);
    }

    return selectedGasDepositId;
  }, [currentSelectedData?.pendingStgSumId, currentSelectedData?.stgSumId, selectedGasDepositId]);

  const [modalCreateMD, setModalCreateMD] = useState(false);
  const [modalViewMD, setModalViewMD] = useState(false);
  const [modalApprovalHistoryMD, setModalApprovalHistoryMD] = useState(false);
  const [modalConfirmApprovalMD, setModalConfirmApprovalMD] = useState(false);
  const [approveOrRejectMD, setApproveOrRejectMD] = useState("");
  const [selectedMutationDetail, setSelectedMutationDetail] = useState(null);
  const [dataApprovalHistoryFixMD, setDataApprovalHistoryFixMD] = useState({});

  const {
    data,
    data_mutation_detail,
    loading_mutation_detail,
    data_approval_history,
    loading_history,
    data_attachment,
    loading_attachment,
    filters,
  } = useSelector((state) => state.gasDepositRbi);
  const { currentPosition, token } = useSelector((state) => state.auth || {});

  useEffect(() => {
    setCurrentSelectedData(normalizeGasDepositDetailData(selectedData));
  }, [selectedData]);

  useEffect(() => {
    const refreshedRows = data?.result;
    if (!Array.isArray(refreshedRows) || !refreshedRows.length) return;

    const sameAccountRows = refreshedRows.filter((item) => (
      item?.accountNumber && currentSelectedData?.accountNumber && item.accountNumber === currentSelectedData.accountNumber
    ));

    const approvedActiveRow = sameAccountRows.find((item) => (
      String(item?.statusApproval || "").toLowerCase() === "approved"
      && String(item?.status || item?.statusMaster || "").toLowerCase() === "active"
    ));

    if (approvedActiveRow && (
      currentSelectedData?.statusApproval === "Approved"
      || currentSelectedData?.status === "Active"
    )) {
      setCurrentSelectedData(normalizeGasDepositDetailData(approvedActiveRow));
      return;
    }

    const currentIds = [
      currentSelectedData?.stgSumId,
      currentSelectedData?.pendingStgSumId,
      currentSelectedData?.referenceId,
      currentSelectedData?.recordId,
      currentSelectedData?.masterGasDepositId,
      currentSelectedData?.gasDepositId,
      currentSelectedData?.id,
    ]
      .filter((value) => value !== undefined && value !== null)
      .map((value) => String(value));

    const matchedRow = refreshedRows.find((item) => {
      const candidateIds = [
        item?.stgSumId,
        item?.pendingStgSumId,
        item?.referenceId,
        item?.recordId,
        item?.masterGasDepositId,
        item?.gasDepositId,
        item?.id,
      ]
        .filter((value) => value !== undefined && value !== null)
        .map((value) => String(value));

      return candidateIds.some((value) => currentIds.includes(value));
    });

    if (matchedRow) {
      setCurrentSelectedData(normalizeGasDepositDetailData(matchedRow));
      return;
    }

    if (
      sameAccountRows[0]
      && (
        currentSelectedData?.statusApproval === "Approved"
        || currentSelectedData?.status === "Active"
      )
    ) {
      setCurrentSelectedData(normalizeGasDepositDetailData(sameAccountRows[0]));
    }
  }, [currentSelectedData?.accountNumber, currentSelectedData?.gasDepositId, currentSelectedData?.id, currentSelectedData?.masterGasDepositId, currentSelectedData?.pendingStgSumId, currentSelectedData?.stgSumId, data]);

  const dataSourceMutationDetail = useMemo(() => {
    return data_mutation_detail?.result || [];
  }, [data_mutation_detail?.result]);

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
    }

    if (selectedSummaryReferenceId) {
      dispatch(
        getAttachmentList({
          referenceId: selectedSummaryReferenceId,
          category: "GAS_DEPOSIT_SUMMARY",
        }),
      );
    }
  }, [dispatch, selectedGasDepositId, selectedSummaryReferenceId]);

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
          "EXPIRED_GAS_DEPOSIT",
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

    const actionUpper = approveOrRejectMD.toUpperCase();
    const isSummaryApproval = approvalTarget.referenceType === "SUMMARY";

    await dispatch(
      processGasDepositApproval({
        referenceId: approvalTarget.referenceId,
        referenceType: approvalTarget.referenceType,
        action: actionUpper,
        note: res?.remark || "",
      }),
    ).unwrap();

    if (isSummaryApproval) {
      setCurrentSelectedData((prev) => ({
        ...prev,
        statusApproval: actionUpper === "APPROVE" ? "Approved" : "Rejected",
        status: actionUpper === "APPROVE" ? "Active" : prev?.status,
      }));
      setSelectedMutationDetail(null);
    }

    if (approvalTarget.referenceType === "MUTATION") {
      setSelectedMutationDetail((prev) => prev ? ({
        ...prev,
        statusApproval: actionUpper === "APPROVE" ? "Approved" : "Rejected",
        status: actionUpper === "APPROVE" ? "Active" : prev?.status,
      }) : prev);
    }

    handleClear();
    setModalConfirmApprovalMD(false);
    setApproveOrRejectMD("");

    await dispatch(
      getAllGasDepositPaginate({
        search: encodeURIComponent(JSON.stringify(filters?.search || {})),
        page: filters?.page || 1,
        pageSize: 100,
        sort: filters?.sort || "",
        isLoadMore: false,
      }),
    );

    if (!isSummaryApproval) {
      await dispatch(
        getMutationDetailPaginate({
          gasDepositId: selectedGasDepositId,
          page: 1,
          pageSize: 100,
          search: "",
          sort: "",
        }),
      );
      return;
    }

    setTimeout(() => {
      dispatch(
        getAllGasDepositPaginate({
          search: encodeURIComponent(JSON.stringify(filters?.search || {})),
          page: filters?.page || 1,
          pageSize: 100,
          sort: filters?.sort || "",
          isLoadMore: false,
        }),
      );
    }, 1000);
  };

  const itemGrantAccessMD = [
    {
      action: "View",
      type: "table",
      render: (record) => {
        const isEditable = record?.statusApproval === "Draft" || record?.statusApproval === "Rejected";
        const menuItems = [
          {
            key: "update",
            disabled: !isEditable,
            label: (
              <span className="flex items-center gap-2">
                <SVGIcon name="IconUpdateAction" width={16} color={isEditable ? undefined : "#9ca3af"} />
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

  const authToken = useMemo(() => {
    try {
      return token ? JSON.parse(token) : null;
    } catch {
      return null;
    }
  }, [token]);

  const positionRoleHints = useMemo(
    () =>
      [
        currentPosition?.approvalRole,
        currentPosition?.roleName,
        currentPosition?.positionName,
        authToken?.approvalRole,
        authToken?.roleName,
        authToken?.positionName,
        authToken?.position,
      ]
        .filter(Boolean)
        .map((item) => String(item).toLowerCase()),
    [authToken, currentPosition],
  );

  const approvalTarget = useMemo(() => {
    const hasPendingSummaryContext = Boolean(
      currentSelectedData?.pendingStgSumId
      || currentSelectedData?.stgSumId
      || Number(currentSelectedData?.gasDepositId) < 0,
    );

    if (currentSelectedData?.statusApproval === "Waiting Approval") {
      return {
        referenceType: "SUMMARY",
        referenceId: currentSelectedData?.pendingStgSumId || currentSelectedData?.stgSumId || currentSelectedData?.id,
        name: currentSelectedData?.accountNumber || currentSelectedData?.customerNumber || "-",
      };
    }

    const mutationTarget =
      (selectedMutationDetail?.statusApproval === "Waiting Approval" && selectedMutationDetail) ||
      waitingMutationDetail;

    if (mutationTarget && !hasPendingSummaryContext) {
      return {
        referenceType: "MUTATION",
        referenceId:
          mutationTarget?.mutationId || mutationTarget?.stgMutId || mutationTarget?.id,
        name: mutationTarget?.documentNumber || mutationTarget?.mutationId || "-",
      };
    }

    return null;
  }, [currentSelectedData, selectedMutationDetail, waitingMutationDetail]);

  useEffect(() => {
    if (approvalTarget?.referenceId) {
      dispatch(getApprovalHistory(approvalTarget.referenceId));
    }
  }, [approvalTarget?.referenceId, dispatch]);

  const canProcessApproval = useMemo(() => {
    const isSubmitterPosition = positionRoleHints.some((item) => item.includes("submitter"));
    const headerWaitingApproval = currentSelectedData?.statusApproval === "Waiting Approval";
    const mutationWaitingApproval = Boolean(
      selectedMutationDetail?.statusApproval === "Waiting Approval" || waitingMutationDetail,
    );

    return Boolean(
      !isSubmitterPosition
      && (headerWaitingApproval || mutationWaitingApproval)
      && approvalTarget,
    );
  }, [
    approvalTarget,
    currentSelectedData?.statusApproval,
    positionRoleHints,
    selectedMutationDetail?.statusApproval,
    waitingMutationDetail,
  ]);

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
          <DetailText label="Customer Name">{currentSelectedData?.customerName || "-"}</DetailText>
          <DetailText label="Account Number">{currentSelectedData?.accountNumber || "-"}</DetailText>
          <DetailText label="Account Name">{currentSelectedData?.accountName || "-"}</DetailText>
          <DetailText label="Account Group Type">{currentSelectedData?.accountGroupType || "-"}</DetailText>
          <DetailText label="SOR">{currentSelectedData?.sor || "-"}</DetailText>
          <DetailText label="Cost Center">{currentSelectedData?.costCenter || "-"}</DetailText>
          <DetailText label="Account Segment">{currentSelectedData?.accountSegment || "-"}</DetailText>
          <DetailText label="Meter Reading Code">{currentSelectedData?.meterReadingCode || "-"}</DetailText>
          <DetailText label="Account Type">{currentSelectedData?.accountType || "-"}</DetailText>
          <DetailText label="Classification Type">{currentSelectedData?.classificationType || "-"}</DetailText>
          <DetailText label="SAP CUST ID">{currentSelectedData?.sapCustId || "-"}</DetailText>
        </div>
      </CollapsibleContainer>

      {/* GAS DEPOSIT INFORMATION */}
      <CollapsibleContainer header="Gas Deposit Information" border className="mt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
          <DetailText label="Terms Earn">{currentSelectedData?.termsEarn ?? "-"}</DetailText>
          <DetailText label="Terms Redeem">{currentSelectedData?.termsRedeem ?? "-"}</DetailText>
          <DetailText label="Period Earn">
            {formatPeriodEarnRange(
              currentSelectedData?.periodEarn || currentSelectedData?.earnStartDate,
              currentSelectedData?.periodEarnEnd || currentSelectedData?.earnEndDate,
            )}
          </DetailText>
          <DetailText label="Period Start Redeem">{formatShortDate(currentSelectedData?.periodRedeemStart)}</DetailText>
          <DetailText label="Period End Redeem">{formatShortDate(currentSelectedData?.periodRedeemEnd)}</DetailText>
          <DetailText label="Period">{formatShortPeriod(currentSelectedData?.period)}</DetailText>
          <DetailText label="Time Unit">{currentSelectedData?.timeUnit || "-"}</DetailText>
          <DetailText label="UOM">{currentSelectedData?.uom || "-"}</DetailText>
          <DetailText label="Quantity">{renderFormattedNumber(currentSelectedData?.quantity)}</DetailText>
          <DetailText label="Amount">{renderFormattedNumber(currentSelectedData?.amount)}</DetailText>
          <DetailText label="Cash Balance">{renderFormattedNumber(currentSelectedData?.cashBalance ?? currentSelectedData?.receiptBalance)}</DetailText>
          <DetailText label="Type">{currentSelectedData?.type || "-"}</DetailText>
          <DetailText label="Source">{currentSelectedData?.source || "-"}</DetailText>
          <DetailText label="Description" className="sm:col-span-2 lg:col-span-5">{currentSelectedData?.description || "-"}</DetailText>
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
        {!waitingMutationDetail && (
          <div className="flex justify-end mb-3">
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={20} />}
              type="submit"
              onClick={() => setModalCreateMD(true)}
            >
              Create
            </ButtonComponent>
          </div>
        )}
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
          <DetailText label="Record ID">{currentSelectedData?.recordId || "-"}</DetailText>
          <DetailText label="Created Date">
            {currentSelectedData?.createdDate
              ? moment(currentSelectedData.createdDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label="Created By">{currentSelectedData?.createdBy || "-"}</DetailText>
          <DetailText label="Updated Date">
            {currentSelectedData?.updatedDate
              ? moment(currentSelectedData.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label="Updated By">{currentSelectedData?.updatedBy || "-"}</DetailText>
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
        selectedData={currentSelectedData}
      />

      <ModalViewMutationDetail
        isOpen={modalViewMD}
        handleCancel={() => {
          setModalViewMD(false);
          setSelectedMutationDetail(null);
        }}
        selectedData={currentSelectedData}
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
