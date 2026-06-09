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
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";

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

const pickFirstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const isWaitingApprovalStatus = (value) => String(value || "").trim().toLowerCase() === "waiting approval";

const extractApprovalRows = (payload) => {
  const approverSource = payload?.dataApprover;

  const sourceGroups = Array.isArray(approverSource)
    ? [approverSource]
    : approverSource && typeof approverSource === "object"
      ? Object.values(approverSource).filter((item) => Array.isArray(item))
      : [];

  const rows = [];

  sourceGroups.forEach((group) => {
    group.forEach((item) => {
      if (Array.isArray(item?.employeeDetail) && item.employeeDetail.length > 0) {
        item.employeeDetail.forEach((employee) => {
          rows.push({
            approver: pickFirstValue(
              employee?.approver,
              employee?.employeeName,
              employee?.employeeFullname,
              employee?.name,
              employee?.username,
              employee?.employeeNo,
            ),
            role: pickFirstValue(
              employee?.role,
              employee?.roleName,
              employee?.positionName,
              item?.approvalName,
              item?.role,
            ),
            status: pickFirstValue(employee?.status, employee?.approvalStatus, item?.status, "Waiting Approval"),
          });
        });
        return;
      }

      rows.push({
        approver: pickFirstValue(
          item?.approver,
          item?.employeeName,
          item?.employeeFullname,
          item?.name,
          item?.username,
          item?.employeeNo,
        ),
        role: pickFirstValue(item?.role, item?.roleName, item?.positionName, item?.approvalName),
        status: pickFirstValue(item?.status, item?.approvalStatus, "Waiting Approval"),
      });
    });
  });

  return rows
    .filter((item) => item.approver || item.role || item.status)
    .map((item, idx) => ({
      key: idx,
      no: idx + 1,
      approver: item.approver || "-",
      role: item.role || "-",
      status: item.status || "-",
    }));
};

const extractHierarchyApprovalRows = (payload) => {
  const hierarchyRows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const rows = [];

  hierarchyRows.forEach((item) => {
    if (Array.isArray(item?.employeeDetail) && item.employeeDetail.length > 0) {
      item.employeeDetail.forEach((employee) => {
        rows.push({
          approver: pickFirstValue(
            employee?.approver,
            employee?.employeeName,
            employee?.employeeFullname,
            employee?.name,
            employee?.username,
            employee?.employeeNo,
          ),
          role: pickFirstValue(
            employee?.role,
            employee?.roleName,
            employee?.positionName,
            item?.approvalName,
            item?.role,
          ),
          status: pickFirstValue(employee?.status, employee?.approvalStatus, item?.status, "Waiting Approval"),
        });
      });
      return;
    }

    rows.push({
      approver: pickFirstValue(
        item?.approver,
        item?.employeeName,
        item?.employeeFullname,
        item?.name,
        item?.username,
        item?.employeeNo,
      ),
      role: pickFirstValue(item?.role, item?.roleName, item?.positionName, item?.approvalName),
      status: pickFirstValue(item?.status, item?.approvalStatus, "Waiting Approval"),
    });
  });

  return rows
    .filter((item) => item.approver || item.role || item.status)
    .map((item, idx) => ({
      key: idx,
      no: idx + 1,
      approver: item.approver || "-",
      role: item.role || "-",
      status: item.status || "-",
    }));
};

const normalizeGasDepositDetailData = (item) => {
  if (!item) return item;

  const normalizedGasDepositId =
    item.gasDepositId ??
    item.masterGasDepositId ??
    item.referenceId ??
    item.id ??
    item.accountId;

  const normalizedReferenceId =
    item.referenceId ??
    item.masterGasDepositId ??
    item.gasDepositId ??
    item.id ??
    null;

  const normalizedRecordId =
    item.recordId ??
    normalizedReferenceId ??
    normalizedGasDepositId;

  return {
    ...item,
    key: item.key ?? normalizedReferenceId ?? normalizedGasDepositId ?? item.accountId,
    gasDepositId: normalizedGasDepositId,
    referenceId: normalizedReferenceId,
    recordId: normalizedRecordId,
    expiredFlow: Boolean(item.expiredFlow),
    status: getDisplayStatus(item, Boolean(item.expiredFlow)),
    statusApproval: item.statusApproval || null,
    billingPeriod: item.billingPeriod || item.period || null,
    period: item.billingPeriod || item.period || (item.earnStartDate && item.earnEndDate
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
    return currentSelectedData?.referenceId
      || currentSelectedData?.masterGasDepositId
      || currentSelectedData?.id
      || selectedGasDepositId;
  }, [currentSelectedData?.referenceId, currentSelectedData?.masterGasDepositId, currentSelectedData?.id, selectedGasDepositId]);

  const [modalCreateMD, setModalCreateMD] = useState(false);
  const [modalViewMD, setModalViewMD] = useState(false);
  const [modalApprovalHistoryMD, setModalApprovalHistoryMD] = useState(false);
  const [modalConfirmApprovalMD, setModalConfirmApprovalMD] = useState(false);
  const [approveOrRejectMD, setApproveOrRejectMD] = useState("");
  const [selectedMutationDetail, setSelectedMutationDetail] = useState(null);
  const [dataApprovalHistoryFixMD, setDataApprovalHistoryFixMD] = useState({});
  const [approvalHierarchyRows, setApprovalHierarchyRows] = useState([]);
  const [loadingApprovalHierarchy, setLoadingApprovalHierarchy] = useState(false);

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

  useEffect(() => {
    setCurrentSelectedData(normalizeGasDepositDetailData(selectedData));
  }, [selectedData]);

  useEffect(() => {
    const refreshedRows = data?.result;
    if (!Array.isArray(refreshedRows) || !refreshedRows.length) return;

    const currentIds = [
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
    }
  }, [
    currentSelectedData?.accountNumber,
    currentSelectedData?.gasDepositId,
    currentSelectedData?.id,
    currentSelectedData?.masterGasDepositId,
    currentSelectedData?.recordId,
    currentSelectedData?.referenceId,
    currentSelectedData?.status,
    currentSelectedData?.statusApproval,
    data,
  ]);

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
          referenceId: selectedSummaryReferenceId,
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

      const prevId = prev?.mutationId || prev?.id;
      return (
        dataSourceMutationDetail.find(
          (item) => (item?.mutationId || item?.id) === prevId,
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
        record?.mutationId || record?.id || selectedGasDepositId,
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

    const isSummaryApproval = approvalTarget.referenceType === "SUMMARY";

    const refreshMutationDetail = () => {
      if (!selectedGasDepositId) {
        return Promise.resolve();
      }

      return dispatch(
        getMutationDetailPaginate({
          gasDepositId: selectedGasDepositId,
          referenceId: selectedSummaryReferenceId,
          page: 1,
          pageSize: 100,
          search: "",
          sort: "",
        }),
      );
    };

    await dispatch(
      processGasDepositApproval({
        referenceId: approvalTarget.referenceId,
        referenceType: approvalTarget.referenceType,
        action: approveOrRejectMD.toUpperCase(),
        note: res?.remark || "",
      }),
    ).unwrap();

    if (isSummaryApproval) {
      setSelectedMutationDetail(null);
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
      await refreshMutationDetail();
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

      refreshMutationDetail();
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
        key: item.mutationId ?? item.id,
        id: item.mutationId ?? item.id,
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
        apphierId: item.apphierId || null,
      })),
    [dataSourceMutationDetail],
  );

  const waitingMutationDetail = useMemo(
    () =>
      dataSourceMD?.find((item) => isWaitingApprovalStatus(item?.statusApproval)) || null,
    [dataSourceMD],
  );

  const approvalHistoryDataSource = useMemo(
    () => extractApprovalRows(dataApprovalHistoryFixMD),
    [dataApprovalHistoryFixMD],
  );

  const hasWaitingApprovalRows = useMemo(
    () => [...approvalHierarchyRows, ...approvalHistoryDataSource]
      .some((item) => isWaitingApprovalStatus(item?.status)),
    [approvalHierarchyRows, approvalHistoryDataSource],
  );

  const approvalTarget = useMemo(() => {
    const hasPendingSummaryContext = isWaitingApprovalStatus(currentSelectedData?.statusApproval);

    if (hasPendingSummaryContext) {
      return {
        referenceType: "SUMMARY",
        referenceId:
          currentSelectedData?.referenceId
          || currentSelectedData?.masterGasDepositId
          || currentSelectedData?.gasDepositId
          || currentSelectedData?.id,
        name: currentSelectedData?.accountNumber || currentSelectedData?.customerNumber || "-",
      };
    }

    const mutationTarget =
      (isWaitingApprovalStatus(selectedMutationDetail?.statusApproval) && selectedMutationDetail) ||
      waitingMutationDetail;

    if (mutationTarget && !hasPendingSummaryContext) {
      return {
        referenceType: "MUTATION",
        referenceId: mutationTarget?.mutationId || mutationTarget?.id,
        name: mutationTarget?.documentNumber || mutationTarget?.mutationId || "-",
      };
    }

    if (selectedSummaryReferenceId && data_approval_history?.isApprover === true && hasWaitingApprovalRows) {
      return {
        referenceType: "SUMMARY",
        referenceId: selectedSummaryReferenceId,
        name: currentSelectedData?.accountNumber || currentSelectedData?.customerNumber || "-",
      };
    }

    return null;
  }, [
    currentSelectedData,
    data_approval_history?.isApprover,
    hasWaitingApprovalRows,
    selectedMutationDetail,
    selectedSummaryReferenceId,
    waitingMutationDetail,
  ]);

  const approvalHierarchyId = useMemo(() => {
    if (currentSelectedData?.apphierId) return currentSelectedData.apphierId;
    if (approvalTarget?.referenceType === "MUTATION") {
      return selectedMutationDetail?.apphierId || waitingMutationDetail?.apphierId || null;
    }
    return null;
  }, [
    approvalTarget?.referenceType,
    currentSelectedData?.apphierId,
    selectedMutationDetail?.apphierId,
    waitingMutationDetail?.apphierId,
  ]);

  useEffect(() => {
    if (approvalTarget?.referenceId) {
      dispatch(getApprovalHistory(approvalTarget.referenceId));
    }
  }, [
    approvalTarget?.referenceId,
    approvalTarget?.referenceType,
    currentSelectedData?.statusApproval,
    selectedMutationDetail?.statusApproval,
    waitingMutationDetail?.statusApproval,
    dispatch,
  ]);

  useEffect(() => {
    if (!approvalHierarchyId) {
      setApprovalHierarchyRows([]);
      return;
    }

    let cancelled = false;
    setLoadingApprovalHierarchy(true);

    ratingBillingHttpService
      .getDetail(`/v1/dbs/api/billing/approval-hierarchy-detail/${approvalHierarchyId}`)
      .then((res) => {
        if (!cancelled) {
          setApprovalHierarchyRows(extractHierarchyApprovalRows(res));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApprovalHierarchyRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingApprovalHierarchy(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [approvalHierarchyId]);

  const hasPendingApprovalContext = useMemo(
    () => isWaitingApprovalStatus(currentSelectedData?.statusApproval)
      || isWaitingApprovalStatus(selectedMutationDetail?.statusApproval)
      || isWaitingApprovalStatus(waitingMutationDetail?.statusApproval)
      || hasWaitingApprovalRows,
    [
      currentSelectedData?.statusApproval,
      hasWaitingApprovalRows,
      selectedMutationDetail?.statusApproval,
      waitingMutationDetail?.statusApproval,
    ],
  );

  const canProcessApproval = useMemo(() => {
    const isApprover = data_approval_history?.isApprover === true;

    return Boolean(
      isApprover
      && (hasPendingApprovalContext || hasWaitingApprovalRows)
      && approvalTarget,
    );
  }, [
    approvalTarget,
    data_approval_history?.isApprover,
    hasPendingApprovalContext,
    hasWaitingApprovalRows,
  ]);

  // ===================== Approval / Attachment Columns (Gas Deposit Detail tab) =====================
  const approvalColumnsGD = useMemo(() => [
    { key: "no", title: "NO", width: 50, align: "center", render: (_, __, idx) => idx + 1 },
    { key: "approver", title: "APPROVER", dataIndex: "approver", width: 260 },
    { key: "role", title: "ROLE / POSITION", dataIndex: "role", width: 280 },
    { key: "status", title: "STATUS", dataIndex: "status", width: 180 },
  ], []);

  const attachmentColumnsGD = useMemo(() => [
    { key: "no", title: "NO", width: 50, align: "center", render: (_, __, idx) => idx + 1 },
    { key: "fileName", title: "FILE NAME", dataIndex: "fileName", width: 200 },
    { key: "category", title: "CATEGORY", dataIndex: "category", width: 150 },
    { key: "type", title: "TYPE", dataIndex: "type", width: 120 },
    { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 200 },
    { key: "fileSize", title: "FILE SIZE", dataIndex: "fileSize", width: 100 },
  ], []);

  const approvalDataSource = useMemo(
    () => {
      if (hasPendingApprovalContext && approvalHierarchyRows.length > 0) {
        return approvalHierarchyRows;
      }

      return approvalHistoryDataSource.length > 0 ? approvalHistoryDataSource : approvalHierarchyRows;
    },
    [approvalHierarchyRows, approvalHistoryDataSource, hasPendingApprovalContext],
  );

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
          <DetailText label="Period">{formatShortPeriod(currentSelectedData?.billingPeriod || currentSelectedData?.period)}</DetailText>
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
          loading={loading_history || loadingApprovalHierarchy}
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
