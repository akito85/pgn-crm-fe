import React, { useMemo, useState, useEffect } from "react";
import { Form, Spin, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import { FormStepper, FormFooter } from "../../../../components/FormStepNavigation";
import CardContainer from "../../../../components/CardContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import { configApp } from "../../../../constants/configApp";
import SelectComponent from "../../../../components/SelectComponent";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import PayGasDepositeMutationDetailModal from "./Modal/PayGasDepositeMutationDetailModal";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import {
  getAllApprovalList,
  getListApprovalById,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import {
  getConvertedCurrency,
  getAccountNumberDDL,
  getCurrencyDDL,
  getRateTypeDDL,
  resetConvertedAmount,
  resetDataAccountNumber,
} from "../../../../redux/slices/receipt_collection/receipt";
import {
  getListCategory,
  getPayGasDepositAttachmentList,
  getPayGasDepositBillingPeriodOptions,
  getPayGasDepositMutationDetailPaginate,
  getPayGasDepositPaginate,
  getPayGasDepositDailyRate,
  getPayGasDepositSourceDDL,
  getPayGasDepositBankDDL,
  getPayGasDepositSummaryMutations,
  createPayGasDeposit,
  getPayAccountOptions,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";
import { showModalSuccess, showModalError } from "../../../../redux/slices/general_slice";

const selectRule = (label) => ([{ required: true, message: `Please select ${label}.` }]);
const inputRule = (label) => ([{ required: true, message: `Please enter ${label}.` }]);
const autoFillRule = (label, dependency) => ([{ required: true, message: `${label} will be filled automatically after ${dependency}.` }]);
const LOCAL_DRAFT_MUTATION_MESSAGE = "Mutation detail was added to the form. It will be saved when the gas deposit is saved or submitted.";
const PAYMENT_GAS_DEPOSIT_SUMMARY_CATEGORY = "PAYMENT_GAS_DEPOSIT_SUMMARY";
const PAYMENT_GAS_DEPOSIT_MUTATION_CATEGORY = "PAYMENT_GAS_DEPOSIT_MUTATION";
const PAYMENT_SOURCE_OPTIONS = [
  { label: "Receipt", value: "Receipt" },
  { label: "Manual", value: "Manual" },
];

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const formatLabel = (item) => {
  const name = item?.name || "";
  const description = item?.description ? ` - ${item.description}` : "";
  return `${name}${description}`;
};

const findCurrencyValue = (currencies = [], value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const matched = currencies.find(
    (item) => item.id === value || normalizeText(item.name) === normalizeText(value),
  );
  return matched?.id ?? value;
};

const findRateTypeValue = (rateTypes = [], value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const matched = rateTypes.find(
    (item) => item.id === value
      || normalizeText(item.name) === normalizeText(value)
      || normalizeText(item.description) === normalizeText(value),
  );
  return matched?.id ?? value;
};

const findBillingPeriodValue = (billingPeriods = [], value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const matched = billingPeriods.find(
    (item) => item.id === value
      || normalizeText(item.periodName) === normalizeText(value)
      || normalizeText(item.name) === normalizeText(value)
      || normalizeText(item.period) === normalizeText(value),
  );
  return matched?.id ?? value;
};

const normalizePaymentSourceValue = (value) => {
  const normalized = normalizeText(value);
  if (normalized === "manual") return "Manual";
  if (normalized === "receipt") return "Receipt";
  return value;
};

const isWaitingOrDraftStatus = (statusApproval) => {
  const normalized = normalizeText(statusApproval);
  return normalized === "draft"
    || normalized === "waiting approval"
    || normalized === "waiting"
    || normalized === "rejected";
};

const toMomentValue = (value) => {
  if (!value) return undefined;
  if (moment.isMoment(value)) return value;

  const parsed = moment(value);
  return parsed.isValid() ? parsed : undefined;
};

const mapMutationRowFromLedger = (item, index) => ({
  key: item.payLedgerId || item.id || `${item.documentNumber || "mutation"}-${index}`,
  no: index + 1,
  documentNumber: item.documentNumber || "-",
  type: item.type || item.transType || "-",
  category: item.category || "-",
  mutationDate: item.mutationDate || "-",
  rateType: item.rateType || "-",
  rateDate: item.rateDate || "-",
  rate: item.rate || "-",
  amount: item.amount ?? 0,
  eqvBalance: item.eqvAmount ?? item.eqvBalance ?? "-",
  source: normalizePaymentSourceValue(item.source || item.mutationSource) || "-",
  billingPeriod: item.billingPeriod || item.billPeriode || "-",
  description: item.description || "-",
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

const uploadSummaryAttachments = async (attachments = [], referenceId) => {
  const pendingAttachments = attachments.filter(
    (item) => item?.dataType !== "exist" && item?.file,
  );

  if (!pendingAttachments.length || !referenceId) {
    return;
  }

  await Promise.all(
    pendingAttachments.map((item) => {
      const formData = new FormData();
      formData.append("files", item.file);
      formData.append("fileCategoryId", item.fileCategoryId);
      formData.append("referensiId", referenceId);

      return receiptCollectionHttpService.uploadAttachment(
        "/v1/dbs/api/pay-gas-deposit/upload-attachment",
        formData,
        () => {},
      );
    }),
  );
};

const PayGasDepositeCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const {
    data_converted_currency,
    currencyDDL,
    rateTypeDDL,
    dataAccountNumber,
  } = useSelector((state) => state.receipt);
  const {
    data_daily_rate,
    data_billing_period_options: billingPeriodMasterOptions,
    data_bank_ddl: bankDDL,
  } = useSelector((state) => state.gasDepositPayment);
  const { data_approval, data_approval_list } = useSelector((state) => state.billing);
  const {
    data_account_options: accountOptionsData,
    loading_account_options: loadingAccountOptions,
  } = useSelector((state) => state.gasDepositPayment);

  const ACCOUNT_PAGE_SIZE = 100;
  const [accountSearch, setAccountSearch] = useState("");
  const accountPageInfo = accountOptionsData?.page || {};
  const accountList = useMemo(() => accountOptionsData?.result || [], [accountOptionsData]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isModalCreateMutationOpen, setIsModalCreateMutationOpen] = useState(false);
  const [editingMutation, setEditingMutation] = useState(null);
  const [mutationRows, setMutationRows] = useState([]);
  const [requestBodyConvertedRate, setRequestBodyConvertedRate] = useState({});
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [boolApproval, setBoolApproval] = useState(false);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const isUpdateMode =
    location.pathname === RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_UPDATE ||
    location.state?.mode === "update";
  const selectedData = useMemo(() => location.state?.selectedData ?? null, [location.state]);

  const accountNumberOptions = useMemo(() => {
    const seen = new Set();
    return accountList
      .filter((item) => item?.accountNumber && !seen.has(item.accountNumber) && seen.add(item.accountNumber))
      .map((item) => ({ label: item.accountNumber, value: item.accountNumber }));
  }, [accountList]);

  const currencyOptions = useMemo(
    () => (currencyDDL?.data || []).map((item) => ({ label: item.name, value: item.id })),
    [currencyDDL],
  );

  const billingPeriodOptions = useMemo(
    () => (billingPeriodMasterOptions || []).map((item) => ({
      label: item.name || item.periodName || item.period,
      value: item.id,
    })),
    [billingPeriodMasterOptions],
  );

  const rateTypeOptions = useMemo(
    () => (rateTypeDDL?.data || []).map((item) => ({
      label: formatLabel(item),
      value: item.id,
    })),
    [rateTypeDDL],
  );

  const sourceOptions = useMemo(() => PAYMENT_SOURCE_OPTIONS, []);

  const bankOptions = useMemo(
    () => (bankDDL || []).map((item) => ({ label: item.name, value: item.name })),
    [bankDDL],
  );

  const formatDecimal = (value) => {
    if (value === null || value === undefined || value === "") return undefined;
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return undefined;

    // Use more decimal places for small numbers (e.g. IDR→USD rate ~5.8E-5)
    if (numericValue !== 0 && Math.abs(numericValue) < 0.01) {
      return numericValue.toLocaleString("en-US", {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      });
    }

    return numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

  const routes = [
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW, breadcrumbName: "Gas Deposite" },
    { path: "", breadcrumbName: isUpdateMode ? "Update Gas Deposite" : "Create Gas Deposite" },
  ];

  const steps = [
    { title: isUpdateMode ? "UPDATE" : "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  useEffect(() => {
    dispatch(resetDataAccountNumber());
    dispatch(resetConvertedAmount());
    dispatch(getCurrencyDDL());
    dispatch(getRateTypeDDL());
    dispatch(getPayGasDepositBillingPeriodOptions());
    dispatch(getPayGasDepositSourceDDL());
    dispatch(getPayGasDepositBankDDL());
    dispatch(getPayGasDepositPaginate({ page: 1, pageSize: 100, search: "", sort: "accountNumber~asc" }));
    dispatch(getAllApprovalList());
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(getPayAccountOptions({
        page: 1,
        pageSize: ACCOUNT_PAGE_SIZE,
        search: accountSearch,
        isLoadMore: false,
      }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [dispatch, accountSearch]);

  useEffect(() => {
    if (isUpdateMode) return undefined;

    form.resetFields();
    form.setFieldsValue({ source: "Manual" });
    setCurrentStep(0);
    setMutationRows([]);
    setRequestBodyConvertedRate({});
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setBoolApproval(false);
    setListDataAttachment([]);
    dispatch(resetDataAccountNumber());
    dispatch(resetConvertedAmount());

    return () => {
      dispatch(resetDataAccountNumber());
      dispatch(resetConvertedAmount());
    };
  }, [dispatch, form, isUpdateMode, location.key]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isUpdateMode || !selectedData) return;

    form.setFieldsValue({
      accountNumber: selectedData.accountId ?? selectedData.accountNumber,
      accountName: selectedData.accountName,
      customerNumber: selectedData.customerNumber,
      customerName: selectedData.customerName,
      accountGroupType: selectedData.accountGroupType,
      sor: selectedData.sor,
      costCenter: selectedData.costCenter,
      accountSegment: selectedData.accountSegment,
      meterReadingCode: selectedData.meterReadingCode,
      accountType: selectedData.accountType,
      classificationType: selectedData.classificationType,
      sapCustId: selectedData.sapCustId,
      paymentDate: toMomentValue(selectedData.paymentDate),
      currency: findCurrencyValue(currencyDDL?.data || [], selectedData.currency),
      balance: selectedData.balance ?? selectedData.balanceAmount,
      rateType: findRateTypeValue(rateTypeDDL?.data || [], selectedData.rateType),
      rateDate: toMomentValue(selectedData.rateDate),
      rate: selectedData.rate,
      eqvBalance: selectedData.eqvBalance,
      billingPeriod: findBillingPeriodValue(billingPeriodMasterOptions || [], selectedData.billingPeriod),
      billingCurrency: findCurrencyValue(currencyDDL?.data || [], selectedData.billingCurrency),
      source: normalizePaymentSourceValue(selectedData.source),
      description: selectedData.description,
    });
  }, [
    currencyDDL,
    billingPeriodMasterOptions,
    form,
    isUpdateMode,
    rateTypeDDL,
    selectedData,
  ]);

  useEffect(() => {
    const selectedAccountNumber = form.getFieldValue("accountNumber");
    if (isUpdateMode || !dataAccountNumber?.data || !selectedAccountNumber) return;

    const resolvedSapCustId =
      dataAccountNumber?.data?.sapCustId
      || dataAccountNumber?.data?.accountReferenceId
      || form.getFieldValue("sapCustId")
      || "";

    form.setFieldsValue({
      customerNumber: dataAccountNumber?.data?.customerNumber || "",
      customerName: dataAccountNumber?.data?.customerName || "",
      accountName: dataAccountNumber?.data?.accountName || "",
      accountGroupType: dataAccountNumber?.data?.accountGroupType || "",
      accountType: dataAccountNumber?.data?.accountType || "",
      classificationType: dataAccountNumber?.data?.classificationType || "",
      sapCustId: resolvedSapCustId ? String(resolvedSapCustId) : "",
      sor: dataAccountNumber?.data?.sor || "",
      costCenter: dataAccountNumber?.data?.area || "",
      accountSegment: dataAccountNumber?.data?.segment || "",
      meterReadingCode: dataAccountNumber?.data?.meterReadingCode || "",
    });
  }, [dataAccountNumber, form, isUpdateMode]);

  useEffect(() => {
    if (data_approval && data_approval.length > 0) {
      setAppHierOptions(data_approval.map((item) => ({ name: item.approvalName, value: item.appHierId })));
    } else {
      setAppHierOptions([]);
    }
  }, [data_approval]);

  useEffect(() => {
    if (boolApproval && data_approval_list && data_approval_list.length > 0) {
      setAppHierDataDetail(
        data_approval_list.map((item, index) => ({
          ...item,
          key: index + 1,
          employeeDetail: (item.employeeDetail || []).map((employee, employeeIndex) => ({
            ...employee,
            key: employeeIndex + 1,
          })),
        })),
      );
      return;
    }

    setAppHierDataDetail([]);
  }, [boolApproval, data_approval_list]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isUpdateMode || !selectedData) {
      setMutationRows([]);
      return;
    }

    const summaryReferenceId = resolveSummaryReferenceId(selectedData);
    const payGasDepId = resolvePayGasDepositId(selectedData);

    if (isWaitingOrDraftStatus(selectedData.statusApproval) && summaryReferenceId) {
      dispatch(getPayGasDepositSummaryMutations({ payGasDepId: summaryReferenceId })).then((action) => {
        const mutationData = action.payload || [];
        setMutationRows(mutationData.map(mapMutationRowFromLedger));
        const firstMutation = mutationData[0];
        if (firstMutation) {
          form.setFieldsValue({
            source: normalizePaymentSourceValue(selectedData?.source || firstMutation.source),
            paymentDate: toMomentValue(selectedData?.paymentDate || firstMutation.mutationDate),
            rateType: findRateTypeValue(rateTypeDDL?.data || [], selectedData?.rateType || firstMutation.rateType),
            rateDate: toMomentValue(selectedData?.rateDate || firstMutation.rateDate),
            rate: selectedData?.rate || firstMutation.rate,
            billingPeriod: findBillingPeriodValue(
              billingPeriodMasterOptions || [],
              selectedData?.billingPeriod || firstMutation.billPeriode,
            ),
          });
        }
      });
      return;
    }

    if (!payGasDepId) {
      setMutationRows([]);
      return;
    }

    dispatch(
      getPayGasDepositMutationDetailPaginate({
        payGasDepId,
        page: 1,
        pageSize: 100,
        search: "",
        sort: "mutationDate~desc",
      }),
    ).then((action) => {
      const mutationData = action.payload?.result || [];
      setMutationRows(mutationData.map(mapMutationRowFromLedger));
    });
  }, [billingPeriodMasterOptions, dispatch, form, isUpdateMode, rateTypeDDL, selectedData]);

  useEffect(() => {
    if (!isUpdateMode || !selectedData) {
      setListDataAttachment([]);
      return;
    }

    const summaryReferenceId = resolveSummaryReferenceId(selectedData);
    if (!summaryReferenceId) {
      setListDataAttachment([]);
      return;
    }

    dispatch(
      getPayGasDepositAttachmentList({
        referenceId: summaryReferenceId,
      }),
    ).then((action) => {
      setListDataAttachment(action.payload || []);
    });
  }, [dispatch, isUpdateMode, selectedData]);

  // Sync rate field when data_daily_rate changes (e.g. triggered externally or on re-mount)
  useEffect(() => {
    applyDailyRate(data_daily_rate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_daily_rate]);

  useEffect(() => {
    const { fromCurrency, toCurrency, rateType, rateDate } = requestBodyConvertedRate;

    if (!fromCurrency || !toCurrency || !rateType || !rateDate) {
      return;
    }

    if (fromCurrency === toCurrency) {
      return;
    }

    dispatch(getConvertedCurrency(requestBodyConvertedRate));
  }, [dispatch, requestBodyConvertedRate]);

  // Auto-calculate Balance from sum of mutation amounts, then recalculate EQV Balance
  useEffect(() => {
    const total = mutationRows.reduce((sum, row) => sum + parseNumericValue(row.amount), 0);
    const formattedBalance = formatDecimal(total);
    form.setFieldsValue({ balance: formattedBalance });

    const allValues = form.getFieldsValue();
    if (allValues.currency && allValues.currency === allValues.billingCurrency) {
      form.setFieldsValue({
        rate: formatDecimal(1),
        eqvBalance: formatDecimal(total),
      });
    } else {
      const currentRate = parseNumericValue(allValues.rate);
      if (currentRate > 0) {
        form.setFieldsValue({ eqvBalance: formatDecimal(total * currentRate) });
      }
    }
  }, [form, mutationRows]);

  useEffect(() => {
    const formValues = form.getFieldsValue(["currency", "billingCurrency", "balance"]);
    const balanceValue = parseNumericValue(formValues.balance);
    const isSameCurrency = formValues.currency && formValues.currency === formValues.billingCurrency;

    if (isSameCurrency) {
      form.setFieldsValue({
        rate: formatDecimal(1),
        eqvBalance: formatDecimal(balanceValue),
      });
      return;
    }

    if (!data_converted_currency || !Object.keys(data_converted_currency).length) {
      return;
    }

    const convertedRate = Number(data_converted_currency?.convertedRate);
    if (Number.isNaN(convertedRate) || convertedRate <= 0) {
      return;
    }

    form.setFieldsValue({
      rate: formatDecimal(convertedRate),
      eqvBalance: formatDecimal(balanceValue * convertedRate),
    });
  }, [data_converted_currency, form]);

  const mutationColumns = useMemo(
    () => [
      { key: "no", title: "NO", dataIndex: "no", width: 40, align: "center" },
      { key: "documentNumber", title: "DOCUMENT NUMBER", dataIndex: "documentNumber", width: 120 },
      { key: "type", title: "TYPE", dataIndex: "type", width: 80 },
      { key: "category", title: "CATEGORY", dataIndex: "category", width: 120 },
      { key: "mutationDate", title: "MUTATION DATE", dataIndex: "mutationDate", width: 100, align: "center" },
      { key: "rateType", title: "RATE TYPE", dataIndex: "rateType", width: 90 },
      { key: "rateDate", title: "RATE DATE", dataIndex: "rateDate", width: 100, align: "center" },
      { key: "rate", title: "RATE", dataIndex: "rate", width: 90, align: "right" },
      { key: "amount", title: "AMOUNT", dataIndex: "amount", width: 100, align: "right" },
      { key: "eqvBalance", title: "EQV BALANCE", dataIndex: "eqvBalance", width: 110, align: "right" },
      { key: "source", title: "SOURCE", dataIndex: "source", width: 90 },
      { key: "bank", title: "BANK", dataIndex: "bank", width: 100 },
      { key: "billingPeriod", title: "PERIOD", dataIndex: "billingPeriod", width: 90, align: "center" },
      { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 140 },
      {
        key: "action",
        title: "ACTION",
        width: 70,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                setEditingMutation(record);
                setIsModalCreateMutationOpen(true);
              }}
            >
              <SVGIcon name="IconUpdateAction" width={18} color="#0075bf" />
            </span>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setMutationRows((prev) => prev.filter((r) => r.key !== record.key))}
            >
              <SVGIcon name="IconDelete" width={18} color="#ef4444" />
            </span>
          </div>
        ),
      },
    ],
    [],
  );

  const handleAccountPopupScroll = (event) => {
    const target = event?.target;
    if (!target || loadingAccountOptions) return;
    const isAtBottom = target.scrollTop + target.offsetHeight >= target.scrollHeight - 8;
    const currentPage = Number(accountPageInfo?.currentPage || 1);
    const totalPages = Number(accountPageInfo?.totalPages || 1);
    if (isAtBottom && currentPage < totalPages) {
      dispatch(getPayAccountOptions({
        page: currentPage + 1,
        pageSize: ACCOUNT_PAGE_SIZE,
        search: accountSearch,
        isLoadMore: true,
      }));
    }
  };

  const handleAccountNumberChange = (value) => {
    const selected = accountList.filter(Boolean).find((item) => item.accountNumber === value);
    const selectedSapCustId = selected?.sapCustId || selected?.accountReferenceId;

    dispatch(getAccountNumberDDL(selected?.accountId ?? value));

    form.setFieldsValue({
      accountNumber: value,
      accountName: selected?.accountName || "",
      customerNumber: selected?.customerNumber || "",
      customerName: selected?.customerName || "",
      sapCustId: selectedSapCustId ? String(selectedSapCustId) : "",
      // reset gas deposit information fields to avoid stale cache
      source: "Manual",
      paymentDate: undefined,
      currency: undefined,
      balance: undefined,
      rateType: undefined,
      rateDate: undefined,
      rate: undefined,
      eqvBalance: undefined,
      billingPeriod: undefined,
      billingCurrency: undefined,
      description: undefined,
    });
    setRequestBodyConvertedRate({});
    dispatch(resetConvertedAmount());
  };

  const handleSelectHierarchy = (value) => {
    setSelectedHierarchy(value);
    form.setFieldsValue({ apphierId: value });
    dispatch(getListApprovalById(value));
    setBoolApproval(true);
  };

  const handleResetCreateForm = () => {
    form.resetFields();
    form.setFieldsValue({ source: "Manual" });
    setCurrentStep(0);
    setMutationRows([]);
    setRequestBodyConvertedRate({});
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setBoolApproval(false);
    setListDataAttachment([]);
    dispatch(resetDataAccountNumber());
    dispatch(resetConvertedAmount());
  };

  const handlePersist = async (isDraft) => {
    setLoadingSubmit(true);
    try {
      let values;
      if (isDraft) {
        await form.validateFields(["accountNumber", "source", "paymentDate", "currency"]);
        values = form.getFieldsValue(true);
      } else {
        if (mutationRows.length === 0) {
          message.error("Please add at least one mutation detail before submitting.");
          return;
        }
        values = await form.validateFields();
      }

      const accountNumberValue = values.accountNumber;
      const selectedAccount = accountList.filter(Boolean).find((item) => item.accountNumber === accountNumberValue);
      const accountId = selectedAccount?.accountId ?? accountNumberValue;
      if (!accountId) {
        dispatch(showModalError({ title: "Failed", description: "Account ID tidak ditemukan. Silakan pilih ulang Account Number." }));
        return;
      }

      const rateDateVal = values.rateDate?.format
        ? values.rateDate.format("YYYY-MM-DD")
        : values.rateDate;
      const paymentDateVal = values.paymentDate?.format
        ? values.paymentDate.format("YYYY-MM-DD")
        : values.paymentDate;

      const body = {
        payGasDepId: isUpdateMode ? resolvePayGasDepositId(selectedData) : undefined,
        account_id: accountId,
        apphier_id: values.apphierId ?? selectedHierarchy,
        source: values.source,
        payment_date: paymentDateVal,
        currency: currencyOptions.find((i) => i.value === values.currency)?.label ?? values.currency,
        billing_currency: currencyOptions.find((i) => i.value === values.billingCurrency)?.label ?? values.billingCurrency,
        balance: parseNumericValue(values.balance),
        rate_type: (rateTypeDDL?.data || []).find((i) => i.id === values.rateType)?.name ?? values.rateType,
        rate_date: rateDateVal,
        rate: parseNumericValue(values.rate),
        eqv_balance: parseNumericValue(values.eqvBalance),
        billing_period: (billingPeriodMasterOptions || []).find((i) => i.id === values.billingPeriod)?.name
          ?? (billingPeriodMasterOptions || []).find((i) => i.id === values.billingPeriod)?.periodName
          ?? values.billingPeriod,
        description: values.description,
        is_draft: isDraft,
        action_type: isUpdateMode ? "UPDATE" : "CREATE",
        sap_cust_id: values.sapCustId ? String(values.sapCustId) : undefined,
        mutations: mutationRows.map((row) => ({
          document_number: row.documentNumber,
          type: row.type,
          category: row.category,
          bank: values.bank,
          mutation_date: row.mutationDate,
          rate_type: row.rateType,
          rate_date: row.rateDate,
          rate: parseNumericValue(row.rate),
          amount: parseNumericValue(row.amount),
          eqv_amount: parseNumericValue(row.eqvBalance),
          source: row.source,
          bill_periode: row.billingPeriod,
          description: row.description,
        })),
      };

      const response = await dispatch(createPayGasDeposit(body)).unwrap();
      const responseData = response?.data || response || {};
      const summaryReferenceId =
        responseData?.payGasDepId ||
        responseData?.id ||
        resolveSummaryReferenceId(selectedData);

      await uploadSummaryAttachments(listDataAttachment, summaryReferenceId);

      dispatch(showModalSuccess({
        title: "Success",
        description: isDraft
          ? "Gas Deposit draft saved successfully"
          : isUpdateMode ? "Gas Deposit updated successfully" : "Gas Deposit created successfully",
        return: false,
      }));
      navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW);
    } catch (error) {
      if (Array.isArray(error?.errorFields)) {
        return;
      }

      dispatch(showModalError({
        title: "Failed",
        description: extractRequestErrorMessage(
          error,
          isDraft ? "Failed to save gas deposit draft." : "Failed to create gas deposit.",
        ),
        return: false,
      }));
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields([
          "accountNumber",
          "source",
          "paymentDate",
          "currency",
          "balance",
          "rateType",
          "rateDate",
          "rate",
          "eqvBalance",
          "billingPeriod",
          "billingCurrency",
          "description",
        ]);
      } catch {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const applyDailyRate = (matched) => {
    if (!matched) return;
    const rawReal = Number(matched.convertedRateReal);
    const rawStr = Number(matched.convertedRate);
    const convertedRate = (!Number.isNaN(rawReal) && rawReal > 0) ? rawReal : rawStr;
    const balance = parseNumericValue(form.getFieldValue("balance"));
    form.setFieldsValue({
      rate: formatDecimal(convertedRate),
      eqvBalance: balance > 0 ? formatDecimal(balance * convertedRate) : undefined,
    });
  };

  const resolveDailyRate = (allValues, formattedRateDate) => {
    if (!allValues.currency || !allValues.billingCurrency || !allValues.rateType || !formattedRateDate) {
      form.setFieldsValue({ rate: undefined, eqvBalance: undefined });
      return;
    }
    const currencyName = (currencyDDL?.data || []).find((item) => item.id === allValues.currency)?.name;
    const billingCurrencyName = (currencyDDL?.data || []).find((item) => item.id === allValues.billingCurrency)?.name;
    const rateTypeCode = (rateTypeDDL?.data || []).find((item) => item.id === allValues.rateType)?.name;
    if (currencyName && billingCurrencyName && rateTypeCode) {
      dispatch(getPayGasDepositDailyRate({
        fromCurrencyName: currencyName,
        toCurrencyName: billingCurrencyName,
        rateType: rateTypeCode,
        rateDate: formattedRateDate,
      }))
        .unwrap()
        .then((matched) => applyDailyRate(matched))
        .catch(() => {});
    }
  };

  const resolveConvertedCurrency = (allValues, formattedRateDate) => {
    if (!allValues.currency || !allValues.billingCurrency) {
      setRequestBodyConvertedRate({});
      return;
    }
    if (allValues.currency === allValues.billingCurrency) {
      form.setFieldsValue({
        rate: formatDecimal(1),
        eqvBalance: formatDecimal(parseNumericValue(allValues.balance)),
      });
      setRequestBodyConvertedRate({});
      return;
    }
    if (allValues.rateType && formattedRateDate) {
      setRequestBodyConvertedRate({
        fromCurrency: allValues.currency,
        toCurrency: allValues.billingCurrency,
        rateType: allValues.rateType,
        rateDate: formattedRateDate,
      });
    }
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    const rateRelatedChange = changedValues.currency !== undefined
      || changedValues.rateType !== undefined
      || changedValues.rateDate !== undefined
      || changedValues.billingCurrency !== undefined;

    if (!rateRelatedChange) return;

    const formattedRateDate = allValues.rateDate?.format
      ? allValues.rateDate.format("YYYY-MM-DD")
      : allValues.rateDate;

    resolveDailyRate(allValues, formattedRateDate);
    resolveConvertedCurrency(allValues, formattedRateDate);
  };

  return (
    <>
      <BreadCrumb routes={routes} />

      <FormStepper
        steps={steps}
        current={currentStep}
        onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
        onNext={handleNext}
      />

      <Form form={form} layout="vertical" onValuesChange={handleFormValuesChange}>
        <div className={currentStep === 0 ? "" : "hidden"}>
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">ACCOUNT INFORMATION</p>
            </div>
          }
          className="mt-2"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={selectRule("an account number")}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                placeholder="Select Account Number"
                onChange={handleAccountNumberChange}
                disabled={isUpdateMode}
                options={accountNumberOptions}
                onPopupScroll={handleAccountPopupScroll}
                onSearch={setAccountSearch}
                onClear={() => setAccountSearch("")}
                filterOption={false}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    {loadingAccountOptions && (
                      <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                        <Spin size="small" />
                        <span>Loading more account...</span>
                      </div>
                    )}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item name="accountName" label="Account Name" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Input Account Name" />
            </Form.Item>
            <Form.Item name="customerNumber" label="Customer Number" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Input Customer Number" />
            </Form.Item>
            <Form.Item name="customerName" label="Customer Name" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Input Customer Name" />
            </Form.Item>
            <Form.Item name="accountGroupType" label="Account Group Type" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Account Group Type" />
            </Form.Item>
            <Form.Item name="sor" label="SOR" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select SOR" />
            </Form.Item>
            <Form.Item name="costCenter" label="Cost Center" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Cost Center" />
            </Form.Item>
            <Form.Item name="accountSegment" label="Account Segment" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Account Segment" />
            </Form.Item>
            <Form.Item name="meterReadingCode" label="Meter Reading Code" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Meter Reading Code" />
            </Form.Item>
            <Form.Item name="accountType" label="Account Type" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Account Type" />
            </Form.Item>
            <Form.Item name="classificationType" label="Classification Type" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Classification Type" />
            </Form.Item>
            <Form.Item name="sapCustId" label="SAP CUST ID" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="SAP CUST ID" />
            </Form.Item>
          </div>
        </CardContainer>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">GAS DEPOSIT INFORMATION</p>
            </div>
          }
          className="mt-2"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <Form.Item name="source" label="Source" rules={selectRule("a source")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Input Source" options={sourceOptions} />
            </Form.Item>
            <Form.Item name="paymentDate" label="Payment Date" rules={selectRule("a payment date")} style={{ marginBottom: 0 }}>
              <DateComponent placeholder="Select Payment Date" dateDisable={() => false} />
            </Form.Item>
            <Form.Item name="bank" label="Bank" rules={selectRule("a bank")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Bank" options={bankOptions} />
            </Form.Item>
            <Form.Item name="currency" label="Currency" rules={selectRule("a currency")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Currency" options={currencyOptions} />
            </Form.Item>
            <Form.Item name="balance" label="Balance" rules={inputRule("a balance")} style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Auto-filled from mutation total" />
            </Form.Item>
            <Form.Item name="rateType" label="Rate Type" rules={selectRule("a rate type")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Rate Type" options={rateTypeOptions} />
            </Form.Item>
            <Form.Item name="rateDate" label="Rate Date" rules={selectRule("a rate date")} style={{ marginBottom: 0 }}>
              <DateComponent placeholder="Select Rate Date" dateDisable={() => false} />
            </Form.Item>
            <Form.Item
              name="rate"
              label="Rate"
              rules={autoFillRule("Rate", "currency, billing currency, rate type, and rate date are completed")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled placeholder="Auto fill rate" />
            </Form.Item>
            <Form.Item
              name="eqvBalance"
              label="EQV Balance"
              rules={autoFillRule("EQV Balance", "balance and rate are available")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled placeholder="EQV Balance" />
            </Form.Item>
            <Form.Item name="billingPeriod" label="Billing Period" rules={selectRule("a billing period")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Billing Period" options={billingPeriodOptions} />
            </Form.Item>
            <Form.Item name="billingCurrency" label="Billing Currency" rules={selectRule("a billing currency")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Billing Currency" options={currencyOptions} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={inputRule("a description")}
              style={{ marginBottom: 0 }}
              className="lg:col-span-5"
            >
              <InputComponent type="textarea" rows={2} placeholder="Type..." />
            </Form.Item>
          </div>
        </CardContainer>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">MUTATION INFORMATION</p>
            </div>
          }
          className="mt-2"
        >
          <div className="w-full">
            <div className="flex justify-end mb-3">
              <ButtonComponent
                icon={<SVGIcon name="IconButtonCreate" width={16} />}
                type="submit"
                border={false}
                onClick={() => setIsModalCreateMutationOpen(true)}
              >
                Create
              </ButtonComponent>
            </div>
            <TableRBI
              idTable="rc-create-gd-mutation-table"
              dataSource={mutationRows}
              columns={mutationColumns}
              totalData={mutationRows.length}
              tableScrolled={{ x: 1200, y: 300 }}
              showExport={false}
              usePagination={false}
            />
          </div>
        </CardContainer>
        </div>

        <div className={currentStep === 1 ? "" : "hidden"}>
          <CardContainer subHeader="Approval Information" className="mt-2">
            <ApprovalComponentGeneral
              type="create"
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              updateSelectedHierarchy={handleSelectHierarchy}
            />
          </CardContainer>
        </div>

        <div className={currentStep === 2 ? "" : "hidden"}>
          <CardContainer subHeader="Attachment Information" className="mt-2">
            <AttachmentComponent
              type="create"
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
              getAPICategory={getListCategory}
              typeSelector="gasDepositPayment"
              uploadCategory={PAYMENT_GAS_DEPOSIT_SUMMARY_CATEGORY}
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
              typeRBI="data"
              mandatory={true}
            />
          </CardContainer>
        </div>

        <FormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          onNext={handleNext}
          onCancel={() => {
            handleResetCreateForm();
            navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW);
          }}
          onClear={handleResetCreateForm}
          onSaveDraft={() => handlePersist(true)}
          onSubmit={() => handlePersist(false)}
          loading={loadingSubmit}
        />
      </Form>

      <PayGasDepositeMutationDetailModal
        isOpen={isModalCreateMutationOpen}
        handleCancel={() => {
          setIsModalCreateMutationOpen(false);
          setEditingMutation(null);
        }}
        handleRefresh={(values) => {
          if (!values) return;
          const mutationDateValue = values.mutationDate?.format
            ? values.mutationDate.format("YYYY-MM-DD")
            : values.mutationDate || "-";
          const rateDateValue = values.rateDate?.format
            ? values.rateDate.format("YYYY-MM-DD")
            : values.rateDate || "-";
          const billingPeriodLabel = billingPeriodOptions.find((item) => item.value === values.period)?.label
            || values.period
            || "-";
          const newRow = {
            key: editingMutation?.key ?? Date.now(),
            no: editingMutation?.no ?? (mutationRows.length + 1),
            attachmentCategory: PAYMENT_GAS_DEPOSIT_MUTATION_CATEGORY,
            documentNumber: values.documentNumber || "-",
            type: values.type || "-",
            category: values.category || "-",
            bank: form.getFieldValue("bank") || "-",
            mutationDate: mutationDateValue,
            rateType: values.rateType || form.getFieldValue("rateType") || "-",
            rateDate: rateDateValue,
            rate: values.rate || form.getFieldValue("rate") || "-",
            amount: parseNumericValue(values.amount),
            eqvBalance: values.eqvBalance || "-",
            source: values.source || "-",
            billingPeriod: billingPeriodLabel,
            description: values.description || "-",
          };
          if (editingMutation) {
            setMutationRows((prev) => prev.map((r) => (r.key === editingMutation.key ? newRow : r)));
          } else {
            setMutationRows((prev) => [...prev, newRow]);
            message.info(LOCAL_DRAFT_MUTATION_MESSAGE);
          }
          setEditingMutation(null);
        }}
        sourceOptions={sourceOptions}
        billingPeriodOptions={billingPeriodOptions}
        editingRow={editingMutation}
        mutationContext={{
          rateType: rateTypeOptions.find((item) => item.value === form.getFieldValue("rateType"))?.label
            || form.getFieldValue("rateType"),
          rateDate: form.getFieldValue("rateDate"),
          rate: form.getFieldValue("rate"),
          source: form.getFieldValue("source"),
          billingPeriod: form.getFieldValue("billingPeriod"),
        }}
      />
    </>
  );
};

export default PayGasDepositeCreatePage;
