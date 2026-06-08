import React, { useMemo, useRef, useState } from "react";
import { Form, Tabs } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import { FormFooter, FormStepper } from "../../../../components/FormStepNavigation";
import CardContainer from "../../../../components/CardContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import DateComponent from "../../../../components/DateComponent";
import SelectComponent from "../../../../components/SelectComponent";
import InputComponent from "../../../../components/InputComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import DetailText from "../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { columnsGasDeposit } from "./Table/TableViewGasDeposit";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../redux/slices/attachmentSlice";
import {
  showModalError,
  showModalSuccess,
} from "../../../../redux/slices/general_slice";
import {
  getAllApprovalList,
  getListApprovalById,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import {
  createExpiredMutationSummaryBatch,
  getCategoryListGasDeposit,
  getAllGasDepositPaginate,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";

const CURRENCY_OPTIONS = [
  { label: "IDR", value: "IDR" },
  { label: "USD", value: "USD" },
];

const SUMMARY_SOURCE_OPTIONS = new Set(["Billing", "Adjustment"]);

const parseAmount = (amount = "") => {
  if (!amount) return 0;
  const normalized = String(amount).replaceAll(".", "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatAmount = (amount = 0) => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
};

const normalizeWholeNumberString = (value) => {
  const digitsOnly = String(value ?? "").replace(/\D/g, "");
  const normalized = digitsOnly.replace(/^0+(?=\d)/, "");
  return normalized || "0";
};

const parseDate = (value) => {
  if (!value) return null;
  if (moment.isMoment(value)) return value.clone();

  const candidate = moment(value, [
    "YYYY-MM-DD",
    "DD MMM YYYY",
    "DD MMMM YYYY",
    moment.ISO_8601,
  ], true);

  if (candidate.isValid()) return candidate;

  const fallback = moment(value);
  return fallback.isValid() ? fallback : null;
};

const resolveExpiredEligibilityDate = (row) => {
  const redeemEndDate = parseDate(row?.redeemEndDate || row?.periodRedeemEnd);
  return redeemEndDate ? redeemEndDate.clone().add(1, "day") : null;
};

const resolveExpiredBillingPeriod = (row, expiredDate) => {
  const rawBillingPeriod = row?.billingPeriod || row?.latestApprovedBillingPeriod;
  if (rawBillingPeriod && String(rawBillingPeriod).length <= 10) {
    return rawBillingPeriod;
  }

  const candidateDate =
    parseDate(row?.earnEndDate) ||
    parseDate(row?.periodRedeemEnd);

  if (candidateDate) {
    return candidateDate.format("MMM YYYY");
  }

  return undefined;
};

const mapGasDepositRow = (item) => ({
  ...item,
  key: item.referenceId ?? item.masterGasDepositId ?? item.gasDepositId ?? item.id ?? item.accountId ?? item.accountNumber,
  gasDepositId:
    item.masterGasDepositId ??
    item.gasDepositId ??
    item.referenceId ??
    item.id ??
    item.accountId,
  referenceId: item.referenceId ?? item.masterGasDepositId ?? item.gasDepositId ?? item.id ?? null,
  status: item.statusMaster || item.status || null,
  statusApproval: item.statusApproval || null,
  mutationApprovalStatus: null,
  mutationStatus: null,
  sor: item.sor || null,
  costCenter: item.costCenter || null,
  accountSegment: item.accountSegment || null,
  meterReadingCode: item.meterReadingCode || null,
  termsEarn: item.termsEarn ?? null,
  termsRedeem: item.termsRedeem ?? null,
  periodEarn: item.earnStartDate || null,
  period: item.earnStartDate && item.earnEndDate
    ? `${item.earnStartDate} - ${item.earnEndDate}`
    : item.earnStartDate || item.period || null,
  periodRedeemStart: item.redeemStartDate || item.periodRedeemStart || null,
  periodRedeemEnd: item.redeemEndDate || item.periodRedeemEnd || null,
  timeUnit: item.timeUnit || null,
  currency: item.currency || null,
  uom: item.uom || null,
  quantity: item.quantity ?? item.balanceVolume ?? null,
  amount: item.balanceAmount ?? item.amount ?? null,
  cashBalance: item.balanceVolume ?? item.cashBalance ?? null,
  accountType: item.accountType || null,
  type: item.pendingActionType || item.type || null,
  description: item.description || null,
  sapCustId: item.sapCustId || null,
  classificationType: item.classificationType || null,
  source: item.source || null,
  createdDate: item.createdDate || null,
  createdBy: item.createdBy || null,
  updatedDate: item.updatedDate || null,
  updatedBy: item.updatedBy || null,
  headerType: null,
  billingPeriod:
    item.billingPeriod
    || (item.period && String(item.period).length <= 10 ? item.period : null)
    || item.latestApprovedBillingPeriod
    || null,
});

const GAS_DEPOSIT_COLUMN_WIDTHS = {
  no: 60,
  customerNumber: 180,
  customerName: 260,
  accountNumber: 170,
  accountName: 260,
  accountGroupType: 190,
  sor: 180,
  costCenter: 180,
  accountSegment: 170,
  meterReadingCode: 180,
  currency: 100,
  uom: 100,
  termsEarn: 120,
  termsRedeem: 130,
  periodEarn: 170,
  periodRedeemStart: 160,
  periodRedeemEnd: 160,
  period: 120,
  timeUnit: 130,
  quantity: 150,
  amount: 170,
  type: 140,
  accountType: 140,
  classificationType: 190,
  source: 140,
  description: 240,
  status: 140,
  statusApproval: 190,
  balanceQuantity: 190,
  balanceAmount: 190,
  expiredQuantity: 210,
  expiredAmount: 210,
};

const applyGasDepositColumnWidths = (columns = []) =>
  columns.map((column) => {
    if (column.children?.length) {
      return {
        ...column,
        children: applyGasDepositColumnWidths(column.children),
      };
    }

    const key = column.key || column.dataIndex;
    const width = GAS_DEPOSIT_COLUMN_WIDTHS[key];

    return width ? { ...column, width } : column;
  });

const ExpiredGasDepositSummary = ({ values, selectedRows, infoColumns }) => {
  const infoItems = [
    {
      label: "Expired Date",
      value: values.expiredDate?.format ? values.expiredDate.format("DD MMM YYYY") : values.expiredDate || "-",
    },
    { label: "Currency", value: values.currency || "-" },
    { label: "Total Amount", value: values.totalAmount || "-" },
    { label: "Expired Quantity", value: values.expiredQuantity || "-" },
    { label: "Expired Amount", value: values.expiredAmount || "-" },
    { label: "Description", value: values.description || "-", fullWidth: true },
  ];

  return (
    <div className="space-y-3">
      <CardContainer
        className="!mt-0"
        header={<p className="text-primary text-xs uppercase font-bold">EXPIRED GAS DEPOSIT INFORMATION</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-3">
          {infoItems.map((item) => (
            <div key={item.label} className={item.fullWidth ? "md:col-span-3 xl:col-span-5" : ""}>
              <DetailText
                label={item.label}
                classTextAdditional={item.fullWidth ? "whitespace-pre-wrap" : ""}
              >
                {item.value}
              </DetailText>
            </div>
          ))}
        </div>
      </CardContainer>

      <CardContainer
        className="!mt-0"
        header={<p className="text-primary text-xs uppercase font-bold">GAS DEPOSIT INFORMATION</p>}
      >
        <TableRBI
          idTable="expired-gd-confirm-info-table"
          dataSource={selectedRows}
          columns={infoColumns}
          totalData={selectedRows.length}
          tableScrolled={{ x: 5200, y: 260 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
        />
      </CardContainer>
    </div>
  );
};

ExpiredGasDepositSummary.propTypes = {
  values: PropTypes.shape({
    expiredDate: PropTypes.oneOfType([
      PropTypes.shape({ format: PropTypes.func }),
      PropTypes.string,
    ]),
    currency: PropTypes.string,
    totalAmount: PropTypes.string,
    expiredQuantity: PropTypes.string,
    expiredAmount: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  infoColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const GasDepositExpiredCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedDepositRows, setSelectedDepositRows] = useState([]);
  const [selectedSearchRowKeys, setSelectedSearchRowKeys] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [boolApproval, setBoolApproval] = useState(false);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [confirmationValues, setConfirmationValues] = useState({});
  const [expiredQuantityOverrides, setExpiredQuantityOverrides] = useState({});
  const [expiredAmountOverrides, setExpiredAmountOverrides] = useState({});
  const [fixedSearchColumns, setFixedSearchColumns] = useState(() => ({
    left: ["no"],
    right: ["balanceQuantity", "balanceAmount", "expiredQuantity", "expiredAmount"],
  }));
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchFilters, setSearchFilters] = useState({});

  const { data, loading } = useSelector((state) => state.gasDepositRbi);
  const { data_approval, data_approval_list } = useSelector((state) => state.billing);

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.GAS_DEPOSIT_VIEW, breadcrumbName: "Gas Deposit" },
    { path: "", breadcrumbName: "Create Expired Gas Deposit" },
  ];

  const steps = [
    { title: "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  React.useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getConfigFileRBIData());
    dispatch(getCategoryListGasDeposit());
  }, [dispatch]);

  React.useEffect(() => {
    if (data_approval && data_approval.length > 0) {
      setAppHierOptions(data_approval.map((item) => ({ name: item.approvalName, value: item.appHierId })));
    } else {
      setAppHierOptions([]);
    }
  }, [data_approval]);

  React.useEffect(() => {
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
    } else {
      setAppHierDataDetail([]);
    }
  }, [boolApproval, data_approval_list]);

  const selectedTotalAmount = useMemo(
    () => formatAmount(selectedDepositRows.reduce((sum, row) => sum + parseAmount(row.balanceAmount), 0)),
    [selectedDepositRows],
  );

  const selectedExpiredQuantity = useMemo(
    () => formatAmount(selectedDepositRows.reduce((sum, row) => sum + parseAmount(row.expiredQuantity), 0)),
    [selectedDepositRows],
  );

  const selectedExpiredAmount = useMemo(
    () => formatAmount(selectedDepositRows.reduce((sum, row) => sum + parseAmount(row.expiredAmount), 0)),
    [selectedDepositRows],
  );

  const gasDepositRows = useMemo(
    () => (data?.result ?? []).filter(Boolean).map(mapGasDepositRow),
    [data],
  );

  const filteredSearchRows = useMemo(() => {
    return gasDepositRows
      .map((row) => {
        const defaultExpiredQuantity = normalizeWholeNumberString(parseAmount(row.quantity ?? row.cashBalance));
        const defaultExpiredAmount = normalizeWholeNumberString(parseAmount(row.amount));
        const expiredQuantity = expiredQuantityOverrides[row.key] ?? defaultExpiredQuantity;
        const expiredAmount = expiredAmountOverrides[row.key] ?? defaultExpiredAmount;

        return {
          ...row,
          balanceQuantity: row.quantity ?? row.cashBalance ?? null,
          balanceAmount: row.amount ?? null,
          expiredQuantity,
          expiredAmount,
        };
      });
  }, [expiredAmountOverrides, expiredQuantityOverrides, form, gasDepositRows]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearchFilters((prevState) => ({ ...prevState, [dataIndex]: selectedKeys[0] }));
  };

  const handleExpiredQuantityChange = (recordKey, nextValue) => {
    setExpiredQuantityOverrides((prevState) => ({
      ...prevState,
      [recordKey]: normalizeWholeNumberString(nextValue),
    }));
  };

  const handleExpiredAmountChange = (recordKey, nextValue) => {
    setExpiredAmountOverrides((prevState) => ({
      ...prevState,
      [recordKey]: normalizeWholeNumberString(nextValue),
    }));
  };

  const searchColumns = useMemo(
    () => {
      const baseColumns = applyGasDepositColumnWidths(columnsGasDeposit(
        0,
        0,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        searchFilters,
      ))
        .filter((column) => !["cashBalance"].includes(column.key || column.dataIndex));

      return [
        ...baseColumns,
        {
          key: "balanceQuantity",
          title: "BALANCE QUANTITY",
          dataIndex: "balanceQuantity",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.balanceQuantity,
          align: "right",
          render: (text) => (
            <InputComponent
              value={text}
              type="numeric"
              decimalScale={0}
              suffix=",00"
              disabled
              placeholder="0"
            />
          ),
        },
        {
          key: "balanceAmount",
          title: "BALANCE AMOUNT",
          dataIndex: "balanceAmount",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.balanceAmount,
          align: "right",
          render: (text) => (
            <InputComponent
              value={text}
              type="numeric"
              decimalScale={0}
              suffix=",00"
              disabled
              placeholder="0"
            />
          ),
        },
        {
          key: "expiredQuantity",
          title: "EXPIRED QUANTITY",
          dataIndex: "expiredQuantity",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.expiredQuantity,
          align: "right",
          render: (_, record) => (
            <InputComponent
              value={record.expiredQuantity}
              type="numeric"
              decimalScale={0}
              suffix=",00"
              onClick={(event) => event.stopPropagation()}
              onChange={({ value }) => handleExpiredQuantityChange(record.key, value)}
              placeholder="0"
            />
          ),
        },
        {
          key: "expiredAmount",
          title: "EXPIRED AMOUNT",
          dataIndex: "expiredAmount",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.expiredAmount,
          align: "right",
          render: (_, record) => (
            <InputComponent
              value={record.expiredAmount}
              type="numeric"
              decimalScale={0}
              suffix=",00"
              onClick={(event) => event.stopPropagation()}
              onChange={({ value }) => handleExpiredAmountChange(record.key, value)}
              placeholder="0"
            />
          ),
        },
      ];
    },
    [searchedColumn, searchText, searchFilters],
  );

  const processedSearchColumns = useMemo(
    () => applyFixedColumns(searchColumns, fixedSearchColumns),
    [searchColumns, fixedSearchColumns],
  );

  const searchColumnDefinitions = useMemo(
    () =>
      searchColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [searchColumns],
  );

  const infoColumns = useMemo(
    () => {
      const baseColumns = applyGasDepositColumnWidths(columnsGasDeposit(
        0,
        0,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        searchFilters,
      ))
        .filter((column) => !["cashBalance"].includes(column.key || column.dataIndex));

      return [
        ...baseColumns,
        {
          key: "balanceQuantity",
          title: "BALANCE QUANTITY",
          dataIndex: "balanceQuantity",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.balanceQuantity,
          align: "right",
          render: (text) => text ?? "-",
        },
        {
          key: "balanceAmount",
          title: "BALANCE AMOUNT",
          dataIndex: "balanceAmount",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.balanceAmount,
          align: "right",
          render: (text) => text ?? "-",
        },
        {
          key: "expiredQuantity",
          title: "EXPIRED QUANTITY",
          dataIndex: "expiredQuantity",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.expiredQuantity,
          align: "right",
          render: (text) => text ?? "-",
        },
        {
          key: "expiredAmount",
          title: "EXPIRED AMOUNT",
          dataIndex: "expiredAmount",
          width: GAS_DEPOSIT_COLUMN_WIDTHS.expiredAmount,
          align: "right",
          render: (text) => text ?? "-",
        },
      ];
    },
    [handleSearch, searchFilters, searchedColumn, searchText],
  );

  const handleSelectHierarchy = (value) => {
    setSelectedHierarchy(value);
    form.setFieldsValue({ apphierId: value });
    dispatch(getListApprovalById(value));
    setBoolApproval(true);
  };

  const confirmationItems = [
    {
      key: "expiredGasDeposit",
      label: "Expired Gas Deposit",
      children: (
        <ExpiredGasDepositSummary
          values={confirmationValues}
          selectedRows={selectedDepositRows}
          infoColumns={infoColumns}
        />
      ),
    },
    {
      key: "approval",
      label: "Approval",
      children: (
        <CardContainer
          className="!mt-0"
          header={<p className="text-primary text-xs uppercase font-bold">APPROVAL INFORMATION</p>}
        >
          <ApprovalComponentGeneral
            type="confirmation"
            dataTable={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            updateSelectedHierarchy={handleSelectHierarchy}
            showSelect={false}
          />
        </CardContainer>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <CardContainer
          className="!mt-0"
          header={<p className="text-primary text-xs uppercase font-bold">ATTACHMENT</p>}
        >
          <AttachmentComponent
            type="confirmation"
            data={listDataAttachment}
            updateData={setListDataAttachment}
            dispatch={dispatch}
            getAPICategory={getCategoryListGasDeposit}
            typeSelector="gasDepositRbi"
            service={ratingBillingHttpService}
            configApplication={configApp.RATING_BILLING_SERVICE}
            getAPIGuard={getConfigFileRBIData}
            typeRBI="data"
            mandatory={true}
          />
        </CardContainer>
      ),
    },
  ];

  const handleOpenSearch = async () => {
    await form.validateFields(["expiredDate", "currency"]);
    setSelectedSearchRowKeys([]);
    setExpiredQuantityOverrides({});
    setExpiredAmountOverrides({});
    const expiredDate = form.getFieldValue("expiredDate");
    const currency = form.getFieldValue("currency");
    const formattedExpiredDate = expiredDate?.format ? expiredDate.format("YYYY-MM-DD") : expiredDate;
    dispatch(
      getAllGasDepositPaginate({
        search: encodeURIComponent(JSON.stringify({
          ...searchFilters,
          status: "Inactive",
          expiredDate: formattedExpiredDate,
          currency,
          positiveAmountOnly: true,
        })),
        page: 1,
        pageSize: 100,
        sort: "accountNumber~asc",
        isLoadMore: false,
      }),
    );
    setIsSearchModalOpen(true);
  };

  const handleConfirmSearch = () => {
    if (!selectedSearchRowKeys.length) return;

    const selectedRows = filteredSearchRows.filter((row) => selectedSearchRowKeys.includes(row.key));
    const invalidQuantityRow = selectedRows.find(
      (row) => parseAmount(row.expiredQuantity) <= 0 || parseAmount(row.expiredQuantity) > parseAmount(row.balanceQuantity),
    );
    if (invalidQuantityRow) {
      dispatch(showModalError({ title: "Failed", description: "Expired Quantity must be greater than 0 and cannot be greater than Balance Quantity" }));
      return;
    }

    const invalidAmountRow = selectedRows.find(
      (row) => parseAmount(row.expiredAmount) <= 0 || parseAmount(row.expiredAmount) > parseAmount(row.balanceAmount),
    );
    if (invalidAmountRow) {
      dispatch(showModalError({ title: "Failed", description: "Expired Amount must be greater than 0 and cannot be greater than Balance Amount" }));
      return;
    }

    const nextSelectedRows = filteredSearchRows
      .filter((row) => selectedSearchRowKeys.includes(row.key))
      .map((row, index) => ({
        ...row,
        no: index + 1,
        balanceQuantity: formatAmount(parseAmount(row.balanceQuantity)),
        balanceAmount: formatAmount(parseAmount(row.balanceAmount)),
        expiredQuantity: formatAmount(parseAmount(row.expiredQuantity)),
        expiredAmount: formatAmount(parseAmount(row.expiredAmount)),
      }));

    setSelectedDepositRows(nextSelectedRows);
    form.setFieldsValue({
      totalAmount: formatAmount(nextSelectedRows.reduce((sum, row) => sum + parseAmount(row.balanceAmount), 0)),
      expiredQuantity: formatAmount(nextSelectedRows.reduce((sum, row) => sum + parseAmount(row.expiredQuantity), 0)),
      expiredAmount: formatAmount(nextSelectedRows.reduce((sum, row) => sum + parseAmount(row.expiredAmount), 0)),
    });
    setIsSearchModalOpen(false);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      await form.validateFields(["expiredDate", "currency", "description"]);
      if (!selectedDepositRows.length) {
        dispatch(showModalError({ title: "Failed", description: "Please select gas deposit data first" }));
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleSubmit = async () => {
    await form.validateFields();
    setConfirmationValues(form.getFieldsValue(true));
    setIsConfirmationModalOpen(true);
  };

  const persistExpiredEntries = async () => {
    const values = form.getFieldsValue(true);

    if (!selectedDepositRows.length) return;

    const pendingAttachments = (listDataAttachment || []).filter(
      (item) => item?.dataType !== "exist" && item?.file,
    );

    const entries = [];
    for (const row of selectedDepositRows) {
      const expiredAmount = parseAmount(row.expiredAmount);
      const resolvedCurrency = row.currency || values.currency;
      const resolvedSource = SUMMARY_SOURCE_OPTIONS.has(row.source)
        ? row.source
        : SUMMARY_SOURCE_OPTIONS.has(row.type)
          ? row.type
          : "Adjustment";

      if (!resolvedCurrency) {
        dispatch(showModalError({ title: "Failed", description: "Currency is required" }));
        return;
      }

      if (!(row.masterGasDepositId ?? row.gasDepositId)) {
        dispatch(showModalError({ title: "Failed", description: "Gas deposit header is required for expired flow" }));
        return;
      }

      entries.push({
        accountId: row.accountId,
        balanceVolume: parseAmount(row.expiredQuantity),
        balanceAmount: expiredAmount,
        currency: resolvedCurrency,
        uom: row.uom,
        gasDepositId: row.masterGasDepositId ?? row.gasDepositId,
        schemeStartDate: row.periodEarn || row.earnStartDate || undefined,
        schemeEndDate: row.earnEndDate || undefined,
        redeemStartDate: row.periodRedeemStart || undefined,
        termsEarn: row.termsEarn ?? undefined,
        termsRedeem: row.termsRedeem ?? undefined,
        timeUnit: row.timeUnit || undefined,
        source: resolvedSource,
        sapCustId: row.sapCustId ?? undefined,
        billingPeriod: resolveExpiredBillingPeriod(row, values.expiredDate),
      });
    }

    const body = {
      apphierId: selectedHierarchy,
      expiredDate: values.expiredDate?.format
        ? values.expiredDate.format("YYYY-MM-DD")
        : values.expiredDate,
      description: values.description,
      entries,
    };

    const res = await dispatch(createExpiredMutationSummaryBatch(body)).unwrap();
    const responseData = res?.data || res || {};
    const referenceIds = Array.isArray(responseData?.referenceIds)
      ? responseData.referenceIds.filter(Boolean)
      : [];

    if (pendingAttachments.length > 0 && referenceIds.length > 0) {
      for (const referenceId of referenceIds) {
        for (const element of pendingAttachments) {
          await ratingBillingHttpService.uploadAttachment(
            `/v1/dbs/api/gas-deposit/upload-attachment`,
            {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referenceId,
              referensiId: referenceId,
              category: "GAS_DEPOSIT_SUMMARY",
            },
            () => {},
          );
        }
      }
    }

    setIsConfirmationModalOpen(false);
    dispatch(
      showModalSuccess({
        title: "Success",
        description: "Expired Gas Deposit created successfully",
        return: false,
      }),
    );
    navigate(RBI_ROUTES.GAS_DEPOSIT_VIEW, { state: { activeTab: "history" } });
  };

  const handleConfirmCreateExpired = async () => {
    try {
      await persistExpiredEntries();
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      dispatch(showModalError({ title: "Failed", description: message }));
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedDepositRows([]);
    setSelectedSearchRowKeys([]);
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setBoolApproval(false);
    setListDataAttachment([]);
    setExpiredQuantityOverrides({});
    setExpiredAmountOverrides({});
  };

  return (
    <>
      <BreadCrumb routes={routes} />

      <FormStepper
        steps={steps}
        current={currentStep}
        onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
        onNext={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
      />

      <Form form={form} layout="vertical" initialValues={{ currency: "IDR" }}>
        {currentStep === 0 && (
          <>
            <CardContainer
              header={<p className="mt-[15px] text-primary">EXPIRED GAS DEPOSIT INFORMATION</p>}
              className="mt-2"
            >
              <div className="mb-3 flex justify-end">
                <ButtonComponent type="submit" border={false} onClick={handleOpenSearch}>
                  Search Gas Deposit
                </ButtonComponent>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Form.Item
                  name="expiredDate"
                  label="Expired Date"
                  rules={[{ required: true, message: "Expired Date is required" }]}
                  style={{ marginBottom: 0 }}
                >
                  <DateComponent placeholder="Select Expired Date" dateDisable={() => false} />
                </Form.Item>

                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true, message: "Currency is required" }]}
                  style={{ marginBottom: 0 }}
                >
                  <SelectComponent placeholder="Select Currency" options={CURRENCY_OPTIONS} />
                </Form.Item>

                <Form.Item
                  name="totalAmount"
                  label="Total Amount"
                  rules={[{ required: true, message: "Total Amount is required" }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputComponent disabled placeholder={selectedTotalAmount || "0,00"} />
                </Form.Item>

                <Form.Item
                  name="expiredQuantity"
                  label="Expired Quantity"
                  rules={[{ required: true, message: "Expired Quantity is required" }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputComponent disabled placeholder={selectedExpiredQuantity || "0,00"} />
                </Form.Item>

                <Form.Item
                  name="expiredAmount"
                  label="Expired Amount"
                  rules={[{ required: true, message: "Expired Amount is required" }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputComponent disabled placeholder={selectedExpiredAmount || "0,00"} />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: "Description is required" }]}
                  style={{ marginBottom: 0 }}
                  className="md:col-span-3"
                >
                  <InputComponent type="textarea" rows={3} placeholder="Type..." />
                </Form.Item>
              </div>
            </CardContainer>

            <CardContainer
              header={<p className="mt-[15px] text-primary">GAS DEPOSIT INFORMATION</p>}
              className="mt-2"
            >
              <TableRBI
                idTable="expired-gd-info-table"
                dataSource={selectedDepositRows}
                columns={infoColumns}
                totalData={selectedDepositRows.length}
                tableScrolled={{ x: 5200, y: 420 }}
                showExport={false}
                usePagination={false}
                showRefresh={false}
              />
            </CardContainer>
          </>
        )}

        {currentStep === 1 && (
          <CardContainer
            header={<p className="mt-[15px] text-primary">APPROVAL INFORMATION</p>}
            className="mt-2"
          >
            <ApprovalComponentGeneral
              type="create"
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              updateSelectedHierarchy={handleSelectHierarchy}
            />
          </CardContainer>
        )}

        {currentStep === 2 && (
          <CardContainer
            header={<p className="mt-[15px] text-primary">ATTACHMENT</p>}
            className="mt-2"
          >
            <AttachmentComponent
              type="create"
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
              getAPICategory={getCategoryListGasDeposit}
              typeSelector="gasDepositRbi"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
              getAPIGuard={getConfigFileRBIData}
              typeRBI="data"
              mandatory={true}
            />
          </CardContainer>
        )}

        <FormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          onNext={handleNext}
          onCancel={() => navigate(RBI_ROUTES.GAS_DEPOSIT_VIEW)}
          onClear={handleReset}
          showSaveDraft={false}
          onSubmit={handleSubmit}
        />
      </Form>

      {/* Modal Search Gas Deposit */}
      <ModalCustom
        isOpen={isSearchModalOpen}
        handleCancel={() => setIsSearchModalOpen(false)}
        header="SEARCH GAS DEPOSIT"
        width={1400}
        footer={
          <div className="flex justify-end gap-2 px-2">
            <ButtonComponent key="cancel" className="!w-auto !px-6" onClick={() => setIsSearchModalOpen(false)}>
              cancel
            </ButtonComponent>
            <ButtonComponent key="confirm" type="primary" border={false} className="!w-auto !px-6" onClick={handleConfirmSearch}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <CardContainer className="!mt-0">
          <TableRBI
            idTable="expired-gd-search-table"
            dataSource={filteredSearchRows}
            columns={processedSearchColumns}
            rowSelection={{
              fixed: true,
              selectedRowKeys: selectedSearchRowKeys,
              onChange: (newSelectedRowKeys) => setSelectedSearchRowKeys(newSelectedRowKeys),
            }}
            totalData={filteredSearchRows.length}
            tableScrolled={{ x: 5200, y: 360 }}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={true}
            hasMore={false}
            fixedColumns={fixedSearchColumns}
            setFixedColumns={setFixedSearchColumns}
            columnDefinitions={searchColumnDefinitions}
            loading={loading}
          />
        </CardContainer>
      </ModalCustom>

      {/* Modal Confirmation */}
      <ModalCustom
        isOpen={isConfirmationModalOpen}
        handleCancel={() => setIsConfirmationModalOpen(false)}
        header="CONFIRMATION"
        type="confirmation"
        width={1180}
        hidePadding={{ top: true }}
        footer={(
          <div className="flex w-full items-center justify-between">
            <ButtonComponent key="cancel" className="!w-auto !px-6" onClick={() => setIsConfirmationModalOpen(false)}>
              cancel
            </ButtonComponent>
            <ButtonComponent key="confirm" type="primary" border={false} className="!w-auto !px-6" onClick={handleConfirmCreateExpired}>
              Confirm
            </ButtonComponent>
          </div>
        )}
      >
        <Tabs
          items={confirmationItems}
          className="[&_.ant-tabs-nav]:mb-2 [&_.ant-tabs-nav]:px-1 [&_.ant-tabs-tab]:pb-2 [&_.ant-tabs-content-holder]:pt-0"
        />
      </ModalCustom>
    </>
  );
};

export default GasDepositExpiredCreatePage;
