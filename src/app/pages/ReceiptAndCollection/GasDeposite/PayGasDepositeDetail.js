/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Tabs, Tooltip, message } from "antd";
import moment from "moment";
import CollapsibleCardContainer from "../../../../components/CollapsibleCardContainer";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";
import DetailText from "../../../../components/DetailText";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import SVGIcon from "../../../../assets/Icon";
import { configApp } from "../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { columnsPayMutationDetail } from "./Table/TablePayMutationDetail";
import PayGasDepositeMutationDetailModal from "./Modal/PayGasDepositeMutationDetailModal";
import PayGasDepositeViewMutationDetailModal from "./Modal/PayGasDepositeViewMutationDetailModal";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import {
  approvePayGasDepositEarnMutation,
  approvePayGasDepositSummary,
  createPayGasDepositEarnMutation,
  getPayGasDepositAttachmentList,
  getPayGasDepositApprovalHistory,
  getPayGasDepositPaginate,
  getPayGasDepositMutationDetailPaginate,
  getPayGasDepositSummaryMutations,
  rejectPayGasDepositEarnMutation,
  rejectPayGasDepositSummary,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";
import { showModalError, showModalSuccess } from "../../../../redux/slices/general_slice";

const mapApprovalRows = (approvalHistory) => {
  const approverSource = approvalHistory?.dataApprover || {};
  const rows = [];

  Object.values(approverSource).forEach((items) => {
    (items || []).forEach((item) => {
      if (Array.isArray(item?.employeeDetail) && item.employeeDetail.length > 0) {
        item.employeeDetail.forEach((employee) => {
          rows.push({
            key: `${rows.length + 1}`,
            no: rows.length + 1,
            approver:
              employee?.approver ||
              employee?.employeeName ||
              employee?.employeeFullname ||
              employee?.name ||
              employee?.username ||
              employee?.employeeNo ||
              "-",
            role:
              employee?.role ||
              employee?.roleName ||
              employee?.positionName ||
              item?.approvalName ||
              item?.position ||
              item?.role ||
              item?.userLevel ||
              "-",
            status:
              employee?.status ||
              employee?.approvalStatus ||
              item?.statusApproval ||
              item?.status ||
              item?.approvalStatus ||
              "Waiting Approval",
          });
        });
        return;
      }

      rows.push({
        key: `${rows.length + 1}`,
        no: rows.length + 1,
        approver:
          item?.employeeName ||
          item?.approverName ||
          item?.fullName ||
          item?.name ||
          item?.userName ||
          "-",
        role:
          item?.positionName ||
          item?.roleName ||
          item?.position ||
          item?.role ||
          item?.userLevel ||
          "-",
        status:
          item?.statusApproval ||
          item?.status ||
          item?.approvalStatus ||
          "Waiting Approval",
      });
    });
  });

  return rows;
};

const LOCAL_DRAFT_MUTATION_MESSAGE = "Mutation detail was added as a local draft only. It is not saved to the payment backend yet.";
const STANDALONE_MUTATION_SUCCESS_MESSAGE = "Mutation detail saved and waiting for separate approval.";
const isBlankValue = (value) => value === null || value === undefined || value === "";
const pickFirstFilled = (...values) => values.find((value) => !isBlankValue(value));
const normalizePaymentSourceValue = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "manual") return "Manual";
  if (normalized === "receipt") return "Receipt";
  return value;
};

const parseNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;

  const normalizedValue = String(value)
    .replaceAll(" ", "")
    .replaceAll(",", "");
  const parsedValue = Number(normalizedValue);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const extractRequestErrorMessage = (error, fallbackMessage) => (
  error?.message
  || error?.description
  || error?.data?.message
  || error?.response?.data?.message
  || fallbackMessage
);

const getCurrentUsername = () => {
  try {
    const rawToken = localStorage.getItem("token") || window.sessionStorage.getItem("token") || "{}";
    const parsedToken = JSON.parse(rawToken);
    return parsedToken?.username || parsedToken?.userId || parsedToken?.id || "";
  } catch {
    return "";
  }
};

const isWaitingApprovalStatus = (status) => {
  const normalized = String(status || "").trim().toLowerCase();
  return normalized === "waiting approval" || normalized === "waiting";
};

const extractMutationRows = (response) => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

const mapMutationRow = (item, idx) => ({
  ...item,
  key: item?.payLedgerId ?? idx,
  payLedgerId: item?.payLedgerId ?? item?.id,
  no: idx + 1,
  type: item?.transType ?? item?.type,
  eqvAmount: item?.eqvAmount,
  billingPeriod: item?.billPeriode ?? item?.billingPeriod,
  source: normalizePaymentSourceValue(item?.source),
});

const resolveSummaryReferenceId = (record) => (
  record?.referenceId
  ?? record?.payGasDepId
  ?? record?.masterGasDepositId
);

const resolvePayGasDepositId = (record) => (
  record?.payGasDepId
  ?? record?.masterGasDepositId
  ?? record?.gasDepositId
  ?? resolveSummaryReferenceId(record)
);

const extractHierarchyApprovalRows = (payload) => {
  let hierarchyRows = [];
  if (Array.isArray(payload?.data)) {
    hierarchyRows = payload.data;
  } else if (Array.isArray(payload)) {
    hierarchyRows = payload;
  }
  const rows = [];

  hierarchyRows.forEach((item) => {
    if (Array.isArray(item?.employeeDetail) && item.employeeDetail.length > 0) {
      item.employeeDetail.forEach((employee) => {
        rows.push({
          key: `${rows.length + 1}`,
          no: rows.length + 1,
          approver:
            employee?.approver ||
            employee?.employeeName ||
            employee?.employeeFullname ||
            employee?.name ||
            employee?.username ||
            employee?.employeeNo ||
            "-",
          role:
            employee?.role ||
            employee?.roleName ||
            employee?.positionName ||
            item?.approvalName ||
            item?.position ||
            item?.role ||
            "-",
          status:
            employee?.status ||
            employee?.approvalStatus ||
            item?.status ||
            "Waiting Approval",
        });
      });
      return;
    }

    rows.push({
      key: `${rows.length + 1}`,
      no: rows.length + 1,
      approver:
        item?.approver ||
        item?.employeeName ||
        item?.employeeFullname ||
        item?.name ||
        item?.username ||
        item?.employeeNo ||
        "-",
      role: item?.role || item?.roleName || item?.positionName || item?.approvalName || "-",
      status: item?.status || item?.approvalStatus || "Waiting Approval",
    });
  });

  return rows;
};

const isPendingWorkflowStatusApproval = (statusApproval) => {
  const normalized = String(statusApproval || "").trim().toLowerCase();
  return normalized === "draft"
    || normalized === "waiting approval"
    || normalized === "waiting"
    || normalized === "rejected";
};

const PayGasDepositeDetail = (props) => {
  const { selectedData } = props;
  const detailRef = useRef(null);
  const dispatch = useDispatch();
  const selectedPayGasDepositId = resolvePayGasDepositId(selectedData);
  const selectedSummaryReferenceId = resolveSummaryReferenceId(selectedData);

  // Draft / Waiting Approval / Rejected stay in the pending workflow; Approved uses ledger.
  const isPendingWorkflow = isPendingWorkflowStatusApproval(selectedData?.statusApproval);

  const {
    data_approval_history,
    data_attachment_list,
    data_mutation_detail,
    data_summary_mutations,
    filters,
    loading_earn_action,
    loading_history,
    loading_mutation_detail,
    loading_summary_mutations,
  } = useSelector((state) => state.gasDepositPayment);

  const searchInputMD = useRef(null);
  const [searchedColumnMD, setSearchedColumnMD] = useState("");
  const [searchTextMD, setSearchTextMD] = useState("");
  const [searchMD, setSearchMD] = useState({});
  const [fixedColumnsMD, setFixedColumnsMD] = useState(() => ({
    left: [],
    right: ["status", "statusApproval", "action"],
  }));
  const [isModalCreateMutationOpen, setIsModalCreateMutationOpen] = useState(false);
  const [editingMutation, setEditingMutation] = useState(null);
  const [draftMutationRows, setDraftMutationRows] = useState([]);
  const [standaloneMutationRows, setStandaloneMutationRows] = useState([]);
  const [loadingStandaloneMutations, setLoadingStandaloneMutations] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [mutationApprovalAction, setMutationApprovalAction] = useState("");
  const [selectedMutationRow, setSelectedMutationRow] = useState(null);
  const [isMutationApprovalModalOpen, setIsMutationApprovalModalOpen] = useState(false);
  const [isModalViewMutationOpen, setIsModalViewMutationOpen] = useState(false);
  const [viewMutationRecord, setViewMutationRecord] = useState(null);
  const [approvalHierarchyRows, setApprovalHierarchyRows] = useState([]);
  const [loadingApprovalHierarchy, setLoadingApprovalHierarchy] = useState(false);
  const currentUsername = useMemo(() => getCurrentUsername(), []);

  const refreshStandaloneMutationRows = useCallback(async () => {
    if (!selectedPayGasDepositId || isPendingWorkflow) {
      setStandaloneMutationRows([]);
      return;
    }

    setLoadingStandaloneMutations(true);
    try {
      const response = await receiptCollectionHttpService.getAll(
        `/v1/dbs/api/pay-gas-deposit/mutation/master/${selectedPayGasDepositId}`,
      );
      const rows = extractMutationRows(response)
        .filter((item) => String(item?.statusApproval || "").trim().toLowerCase() !== "approved")
        .map((item, idx) => ({
          ...mapMutationRow(item, idx),
          isStandaloneMutation: true,
        }));
      setStandaloneMutationRows(rows);
    } catch {
      setStandaloneMutationRows([]);
    } finally {
      setLoadingStandaloneMutations(false);
    }
  }, [isPendingWorkflow, selectedPayGasDepositId]);

  useEffect(() => {
    if (selectedPayGasDepositId && detailRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }
  }, [selectedPayGasDepositId]);

  useEffect(() => {
    if (isPendingWorkflow && selectedSummaryReferenceId) {
      dispatch(getPayGasDepositSummaryMutations({ payGasDepId: selectedSummaryReferenceId }));
    } else if (!isPendingWorkflow && selectedPayGasDepositId) {
      dispatch(
        getPayGasDepositMutationDetailPaginate({
          payGasDepId: selectedPayGasDepositId,
          page: 1,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(searchMD)),
          sort: "mutationDate~desc",
        }),
      );
    }
  }, [dispatch, isPendingWorkflow, searchMD, selectedPayGasDepositId, selectedSummaryReferenceId]);

  useEffect(() => {
    if (isPendingWorkflow || !selectedPayGasDepositId) {
      setStandaloneMutationRows([]);
      return;
    }

    refreshStandaloneMutationRows();
  }, [isPendingWorkflow, refreshStandaloneMutationRows, selectedPayGasDepositId]);

  useEffect(() => {
    if (selectedData?.accountId) {
      dispatch(
        getPayGasDepositApprovalHistory({
          accountId: selectedData.accountId,
          payGasDepId: selectedSummaryReferenceId,
          billingPeriod: selectedData.billingPeriod,
        }),
      );
    }
  }, [dispatch, selectedData?.accountId, selectedData?.billingPeriod, selectedSummaryReferenceId]);

  useEffect(() => {
    if (!selectedSummaryReferenceId) {
      return;
    }

    dispatch(
      getPayGasDepositAttachmentList({
        referenceId: selectedSummaryReferenceId,
      }),
    );
  }, [dispatch, selectedSummaryReferenceId]);

  const handleSearchMD = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextMD(selectedKeys[0]);
    setSearchedColumnMD(selectedKeys[0] ? dataIndex : "");
    setSearchMD((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const openMutationApprovalModal = useCallback((action, row) => {
    setMutationApprovalAction(action);
    setSelectedMutationRow(row);
    setIsMutationApprovalModalOpen(true);
  }, []);

  const renderMutationAction = useCallback((record) => {
    const normalizedStatus = String(record?.status || "").trim().toUpperCase();
    const normalizedStatusApproval = String(record?.statusApproval || "").trim().toLowerCase();
    const isStandalonePending = !isPendingWorkflow
      && record?.isStandaloneMutation
      && record?.payLedgerId
      && (normalizedStatus === "PENDING" || normalizedStatusApproval === "waiting approval");

    const menuItems = [
      {
        key: "approvalHistory",
        label: (
          <div className="flex items-center gap-2">
            <SVGIcon name="IconLogHistory" width={16} />
            <span>Approval History</span>
          </div>
        ),
        onClick: () => {},
      },
    ];

    return (
      <div className="flex items-center justify-center gap-2">
        {isStandalonePending && (
          <>
            <button
              type="button"
              className="text-[#0075bf] text-xs underline"
              onClick={() => openMutationApprovalModal("Approve", record)}
            >
              Approve
            </button>
            <button
              type="button"
              className="text-[#ef4444] text-xs underline"
              onClick={() => openMutationApprovalModal("Reject", record)}
            >
              Reject
            </button>
          </>
        )}
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
          >
            <SVGIcon name="IconTripleDot" color="#0075bf" width={20} />
          </button>
        </Dropdown>
        <Tooltip title="View Detail">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
            onClick={() => {
              setViewMutationRecord(record);
              setIsModalViewMutationOpen(true);
            }}
          >
            <SVGIcon name="IconDetail" color="#0075bf" width={20} />
          </button>
        </Tooltip>
      </div>
    );
  }, [isPendingWorkflow, openMutationApprovalModal, setIsModalViewMutationOpen, setViewMutationRecord]);

  const onSortMD = () => {};

  const baseColumnsMD = useMemo(() => (
    columnsPayMutationDetail({
      searchInputMD,
      searchedColumn: searchedColumnMD,
      searchText: searchTextMD,
      handleSearch: handleSearchMD,
      search: searchMD,
      actionRenderer: renderMutationAction,
    })
  ), [renderMutationAction, searchedColumnMD, searchMD, searchTextMD]);

  const processedColumnsMD = useMemo(
    () => applyFixedColumns(baseColumnsMD, fixedColumnsMD),
    [baseColumnsMD, fixedColumnsMD],
  );

  const columnDefinitionsMD = useMemo(
    () => baseColumnsMD.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    })),
    [baseColumnsMD],
  );

  const dataSourceMD = useMemo(() => {
    if (isPendingWorkflow) {
      return (data_summary_mutations || []).map(mapMutationRow);
    }
    return data_mutation_detail?.result || [];
  }, [data_mutation_detail?.result, data_summary_mutations, isPendingWorkflow]);
  const mutationDataSource = useMemo(
    () => (isPendingWorkflow
      ? [...draftMutationRows, ...dataSourceMD]
      : [...standaloneMutationRows, ...dataSourceMD]),
    [dataSourceMD, draftMutationRows, isPendingWorkflow, standaloneMutationRows],
  );
  const primaryMutationRow = useMemo(
    () => dataSourceMD.find((item) => item && Object.keys(item).length > 0) || null,
    [dataSourceMD],
  );
  const detailInfo = useMemo(() => ({
    source: normalizePaymentSourceValue(
      pickFirstFilled(selectedData?.source, primaryMutationRow?.source, primaryMutationRow?.mutationSource, "-"),
    ),
    paymentDate: pickFirstFilled(selectedData?.paymentDate, primaryMutationRow?.mutationDate, null),
    currency: pickFirstFilled(selectedData?.currency, "-"),
    balance: pickFirstFilled(selectedData?.balance, selectedData?.billingAmountBalance, primaryMutationRow?.amount, "-"),
    rateType: pickFirstFilled(selectedData?.rateType, primaryMutationRow?.rateType, "-"),
    rateDate: pickFirstFilled(selectedData?.rateDate, primaryMutationRow?.rateDate, null),
    rate: pickFirstFilled(selectedData?.rate, primaryMutationRow?.rate, "-"),
    eqvBalance: pickFirstFilled(selectedData?.eqvBalance, selectedData?.eqvAmount, primaryMutationRow?.eqvAmount, "-"),
    billingPeriod: pickFirstFilled(selectedData?.billingPeriod, primaryMutationRow?.billingPeriod, primaryMutationRow?.billPeriode, "-"),
    billingCurrency: pickFirstFilled(selectedData?.billingCurrency, "-"),
    description: pickFirstFilled(selectedData?.description, primaryMutationRow?.description, "-"),
  }), [primaryMutationRow, selectedData]);

  const sourceOptions = useMemo(() => {
    const values = new Set();
    const options = [];

    [selectedData?.source, ...dataSourceMD.map((item) => item?.source)].forEach((value) => {
      if (!value || values.has(value)) return;
      values.add(value);
      options.push({
        label: String(value)
          .toLowerCase()
          .replaceAll("_", " ")
          .replaceAll(/\b\w/g, (char) => char.toUpperCase()),
        value,
      });
    });

    return options;
  }, [dataSourceMD, selectedData?.source]);

  const billingPeriodOptions = useMemo(() => {
    const values = new Set();
    const options = [];

    [selectedData?.billingPeriod, ...dataSourceMD.map((item) => item?.billingPeriod)].forEach((value) => {
      if (!value || values.has(value)) return;
      values.add(value);
      options.push({
        label: value,
        value,
      });
    });

    return options;
  }, [dataSourceMD, selectedData?.billingPeriod]);

  const approvalColumnsGD = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 50, align: "center" },
    { key: "approver", title: "APPROVER", dataIndex: "approver", width: 200 },
    { key: "role", title: "ROLE / POSITION", dataIndex: "role", width: 200 },
    { key: "status", title: "STATUS", dataIndex: "status", width: 150 },
  ], []);

  const approvalRows = useMemo(() => mapApprovalRows(data_approval_history), [data_approval_history]);
  const approvalDataSource = useMemo(
    () => {
      const baseRows = approvalRows.length > 0 ? approvalRows : approvalHierarchyRows;
      return baseRows.map((row) => {
        if (
          (row?.approver === "-" || !row?.approver)
          && data_approval_history?.isApprover === true
          && currentUsername
          && isWaitingApprovalStatus(row?.status)
        ) {
          return {
            ...row,
            approver: currentUsername,
          };
        }

        return row;
      });
    },
    [approvalHierarchyRows, approvalRows, currentUsername, data_approval_history?.isApprover],
  );
  const canProcessApproval = useMemo(
    () =>
      selectedData?.statusApproval === "Waiting Approval"
      && data_approval_history?.isApprover === true
      && Boolean(selectedSummaryReferenceId),
    [data_approval_history?.isApprover, selectedData?.statusApproval, selectedSummaryReferenceId],
  );

  useEffect(() => {
    if (!selectedData?.apphierId) {
      setApprovalHierarchyRows([]);
      return;
    }

    let cancelled = false;
    setLoadingApprovalHierarchy(true);

    ratingBillingHttpService
      .getDetail(`/v1/dbs/api/billing/approval-hierarchy-detail/${selectedData.apphierId}`)
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
  }, [selectedData?.apphierId]);

  const handleOpenApproval = (action) => {
    setApprovalAction(action);
    setIsApprovalModalOpen(true);
  };

  const refreshListAndApprovalHistory = async () => {
    await dispatch(
      getPayGasDepositPaginate({
        page: filters?.page || 1,
        pageSize: 100,
        search: encodeURIComponent(JSON.stringify(filters?.search || {})),
        sort: filters?.sort || "accountNumber~asc",
      }),
    ).unwrap();

    await dispatch(
      getPayGasDepositApprovalHistory({
        accountId: selectedData?.accountId,
        payGasDepId: selectedSummaryReferenceId,
        billingPeriod: selectedData?.billingPeriod,
      }),
    ).unwrap();
  };

  const handleConfirmApproval = async (values, handleClear) => {
    if (!selectedSummaryReferenceId || !approvalAction) {
      return;
    }

    const remarks = values?.remark || "";
    const actionThunk = approvalAction === "Approve"
      ? approvePayGasDepositSummary
      : rejectPayGasDepositSummary;

    try {
      await dispatch(actionThunk({
        payGasDepId: selectedSummaryReferenceId,
        remarks,
      })).unwrap();

      dispatch(showModalSuccess({
        title: "Success",
        description: approvalAction === "Approve"
          ? "Gas Deposit approved successfully"
          : "Gas Deposit rejected successfully",
        return: false,
      }));

      handleClear?.();
      setIsApprovalModalOpen(false);
      setApprovalAction("");

      await refreshListAndApprovalHistory();

      if (isPendingWorkflow) {
        await dispatch(getPayGasDepositSummaryMutations({ payGasDepId: selectedSummaryReferenceId })).unwrap();
      } else {
        await refreshStandaloneMutationRows();
        if (selectedPayGasDepositId) {
          await dispatch(
            getPayGasDepositMutationDetailPaginate({
              payGasDepId: selectedPayGasDepositId,
              page: 1,
              pageSize: 100,
              search: encodeURIComponent(JSON.stringify(searchMD)),
              sort: "mutationDate~desc",
            }),
          ).unwrap();
        }
      }
    } catch (error) {
      dispatch(showModalError({
        title: "Failed",
        description: extractRequestErrorMessage(error, `${approvalAction} failed.`),
      }));
      return false;
    }
  };

  const handleConfirmMutationApproval = async (values, handleClear) => {
    if (!selectedMutationRow?.payLedgerId || !mutationApprovalAction) {
      return;
    }

    const remarks = values?.remark || "";
    const actionThunk = mutationApprovalAction === "Approve"
      ? approvePayGasDepositEarnMutation
      : rejectPayGasDepositEarnMutation;

    try {
      await dispatch(actionThunk({
        payLedgerId: selectedMutationRow.payLedgerId,
        remarks,
      })).unwrap();

      dispatch(showModalSuccess({
        title: "Success",
        description: mutationApprovalAction === "Approve"
          ? "Mutation approved successfully"
          : "Mutation rejected successfully",
        return: false,
      }));

      handleClear?.();
      setSelectedMutationRow(null);
      setMutationApprovalAction("");
      setIsMutationApprovalModalOpen(false);

      await refreshStandaloneMutationRows();
      await refreshListAndApprovalHistory();

      if (selectedPayGasDepositId) {
        await dispatch(
          getPayGasDepositMutationDetailPaginate({
            payGasDepId: selectedPayGasDepositId,
            page: 1,
            pageSize: 100,
            search: encodeURIComponent(JSON.stringify(searchMD)),
            sort: "mutationDate~desc",
          }),
        ).unwrap();
      }
    } catch (error) {
      dispatch(showModalError({
        title: "Failed",
        description: extractRequestErrorMessage(error, `${mutationApprovalAction} mutation failed.`),
      }));
      return false;
    }
  };

  const gasDepositTab = (
    <div className="flex flex-col gap-1 mt-2">
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

      <CollapsibleContainer header="Gas Deposit Information" border className="mt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
          <DetailText label="Source">{detailInfo.source}</DetailText>
          <DetailText label="Payment Date">
            {detailInfo.paymentDate
              ? moment(detailInfo.paymentDate).format("D-MMM-YY")
              : "-"}
          </DetailText>
          <DetailText label="Currency">{detailInfo.currency}</DetailText>
          <DetailText label="Balance">
            {detailInfo.balance}
          </DetailText>
          <DetailText label="Rate Type">{detailInfo.rateType}</DetailText>
          <DetailText label="Rate Date">
            {detailInfo.rateDate
              ? moment(detailInfo.rateDate).format("D-MMM-YY")
              : "-"}
          </DetailText>
          <DetailText label="Rate">{detailInfo.rate}</DetailText>
          <DetailText label="EQV Balance">
            {detailInfo.eqvBalance}
          </DetailText>
          <DetailText label="Billing Period">{detailInfo.billingPeriod}</DetailText>
          <DetailText label="Billing Currency">{detailInfo.billingCurrency}</DetailText>
          <DetailText label="Description" className="sm:col-span-2 lg:col-span-5">
            {detailInfo.description}
          </DetailText>
        </div>
      </CollapsibleContainer>
    </div>
  );

  const approvalTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Approval Information" border>
        <TableRBI
          idTable="rc-gas-deposite-approval-table"
          dataSource={approvalDataSource}
          columns={approvalColumnsGD}
          totalData={approvalDataSource.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
          loading={loading_history || loadingApprovalHierarchy}
        />
      </CollapsibleContainer>
    </div>
  );

  const attachmentTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Attachment" border>
        <AttachmentComponent
          data={data_attachment_list}
          type="detail"
          typeSelector="gasDepositPayment"
          service={receiptCollectionHttpService}
          configApplication={configApp.PAYMENT_SERVICE}
        />
      </CollapsibleContainer>
    </div>
  );

  const tabItems = [
    { key: "gasDeposit", label: "Gas Deposit", children: gasDepositTab },
    { key: "approval", label: "Approval", children: approvalTab },
    { key: "attachment", label: "Attachment", children: attachmentTab },
  ];

  return (
    <div ref={detailRef} className="scroll-mt-4">
      <CollapsibleCardContainer header="GAS DEPOSIT DETAIL" defaultOpen={false}>
        <Tabs
          items={tabItems}
          defaultActiveKey="gasDeposit"
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0"
        />
      </CollapsibleCardContainer>

      <CollapsibleCardContainer header="MUTATION DETAIL" defaultOpen={true}>
        <div className="flex justify-end mb-3">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            onClick={() => {
              setEditingMutation(null);
              setIsModalCreateMutationOpen(true);
            }}
          >
            Create
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="rc-mutation-detail-table"
          dataSource={mutationDataSource}
          columns={processedColumnsMD}
          totalData={mutationDataSource.length}
          tableScrolled={{ x: 1200, y: 400 }}
          onSort={onSortMD}
          columnDefinitions={columnDefinitionsMD}
          fixedColumns={fixedColumnsMD}
          setFixedColumns={setFixedColumnsMD}
          loading={isPendingWorkflow
            ? loading_summary_mutations
            : loading_mutation_detail || loadingStandaloneMutations || loading_earn_action}
          showExport={false}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={false}
        />
      </CollapsibleCardContainer>

      <CollapsibleCardContainer header="HISTORY LOG INFORMATION" defaultOpen={true}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-3">
          <DetailText label="Record ID">
            {selectedSummaryReferenceId || selectedPayGasDepositId || selectedData?.accountId || "-"}
          </DetailText>
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

      {canProcessApproval ? (
        <div className="flex justify-end gap-3 mt-3">
          <ButtonComponent type="reject" onClick={() => handleOpenApproval("Reject")}>
            Reject
          </ButtonComponent>
          <ButtonComponent type="approve" onClick={() => handleOpenApproval("Approve")}>
            Approve
          </ButtonComponent>
        </div>
      ) : null}

      <PayGasDepositeMutationDetailModal
        isOpen={isModalCreateMutationOpen}
        handleCancel={() => {
          setEditingMutation(null);
          setIsModalCreateMutationOpen(false);
        }}
        editingRow={editingMutation}
        handleRefresh={async (values) => {
          if (!values) return;

          if (!isPendingWorkflow) {
            if (!selectedPayGasDepositId) {
              message.error("Payment gas deposit id is not available for standalone mutation.");
              return false;
            }

            const billingPeriodLabel = billingPeriodOptions.find((item) => item.value === values.period)?.label
              || values.period
              || "-";

            await dispatch(createPayGasDepositEarnMutation({
              pay_gasdep_id: selectedPayGasDepositId,
              apphier_id: selectedData?.apphierId || null,
              bill_periode: billingPeriodLabel,
              trans_type: values.type || undefined,
              currency: selectedData?.billingCurrency || selectedData?.currency || undefined,
              category: values.category || undefined,
              mutation_date: values.mutationDate?.toDate ? values.mutationDate.toDate() : values.mutationDate,
              amount: parseNumericValue(values.amount),
              eqv_amount: parseNumericValue(values.eqvBalance),
              rate_type: values.rateType || undefined,
              rate_date: values.rateDate?.toDate ? values.rateDate.toDate() : values.rateDate,
              rate: parseNumericValue(values.rate),
              description: values.description || undefined,
              source: values.source || undefined,
              document_number: values.documentNumber || undefined,
            })).unwrap();

            await refreshStandaloneMutationRows();
            await refreshListAndApprovalHistory();
            message.success(STANDALONE_MUTATION_SUCCESS_MESSAGE);
            return true;
          }

          const mutationDateValue = values.mutationDate?.format
            ? values.mutationDate.format("D-MMM-YY")
            : values.mutationDate || "-";
          const sourceLabel = sourceOptions.find((item) => item.value === values.source)?.label
            || values.source
            || "-";
          const billingPeriodLabel = billingPeriodOptions.find((item) => item.value === values.period)?.label
            || values.period
            || "-";

          setDraftMutationRows((prev) => ([
            {
              key: `draft-${Date.now()}-${prev.length + 1}`,
              documentNumber: values.documentNumber || "-",
              source: sourceLabel,
              billingPeriod: billingPeriodLabel,
              mutationDate: mutationDateValue,
              mutationType: values.type || "-",
              category: values.category || "-",
              amount: values.amount || "-",
              type: values.type || "-",
              description: values.description || "-",
              statusApproval: "Draft",
              status: "Draft",
            },
            ...prev,
          ]));
          message.info(LOCAL_DRAFT_MUTATION_MESSAGE);
          return true;
        }}
        sourceOptions={sourceOptions}
        billingPeriodOptions={billingPeriodOptions}
        mutationContext={{
          rateType: selectedData?.rateType || "",
          rateDate: selectedData?.rateDate || null,
          rate: selectedData?.rate || "",
          source: selectedData?.source || sourceOptions[0]?.value,
          billingPeriod: selectedData?.billingPeriod || billingPeriodOptions[0]?.value,
        }}
      />

      <ModalApproveOrReject
        isOpen={isApprovalModalOpen}
        handleCloseModal={() => {
          setIsApprovalModalOpen(false);
          setApprovalAction("");
        }}
        onFinish={handleConfirmApproval}
        header={approvalAction}
        approveOrReject={approvalAction}
        menu="Gas Deposit Summary"
        named={selectedData?.accountNumber || selectedData?.customerNumber || "-"}
      />

      <ModalApproveOrReject
        isOpen={isMutationApprovalModalOpen}
        handleCloseModal={() => {
          setIsMutationApprovalModalOpen(false);
          setMutationApprovalAction("");
          setSelectedMutationRow(null);
        }}
        onFinish={handleConfirmMutationApproval}
        header={mutationApprovalAction}
        approveOrReject={mutationApprovalAction}
        menu="Gas Deposit Mutation"
        named={selectedMutationRow?.documentNumber || selectedMutationRow?.description || "-"}
      />

      <PayGasDepositeViewMutationDetailModal
        isOpen={isModalViewMutationOpen}
        handleCancel={() => {
          setViewMutationRecord(null);
          setIsModalViewMutationOpen(false);
        }}
        record={viewMutationRecord || {}}
      />
    </div>
  );
};

PayGasDepositeDetail.propTypes = {
  selectedData: PropTypes.shape({
    accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gasDepositId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    payGasDepId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    referenceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rbiGasDepositId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customerNumber: PropTypes.string,
    customerName: PropTypes.string,
    accountNumber: PropTypes.string,
    accountName: PropTypes.string,
    accountGroupType: PropTypes.string,
    sor: PropTypes.string,
    costCenter: PropTypes.string,
    accountSegment: PropTypes.string,
    meterReadingCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    accountType: PropTypes.string,
    classificationType: PropTypes.string,
    sapCustId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    termsEarn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    termsRedeem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    periodEarn: PropTypes.string,
    redeemStartDate: PropTypes.string,
    redeemEndDate: PropTypes.string,
    earnStartDate: PropTypes.string,
    earnEndDate: PropTypes.string,
    timeUnit: PropTypes.string,
    uom: PropTypes.string,
    currency: PropTypes.string,
    cashBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    balanceAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    source: PropTypes.string,
    status: PropTypes.string,
    statusApproval: PropTypes.string,
    description: PropTypes.string,
    createdDate: PropTypes.string,
    createdBy: PropTypes.string,
    updatedDate: PropTypes.string,
    updatedBy: PropTypes.string,
    apphierId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

PayGasDepositeDetail.defaultProps = {
  selectedData: null,
};

export default PayGasDepositeDetail;
