import React, { useState, useEffect, useRef, useCallback } from "react";
import { DatePicker, Form, Modal, Spin, Tooltip, Select, Checkbox, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../components/CardContainer";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import { formMessageRequired } from "../../../../utils";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../assets/Icon/index";
import {
  getBudget,
  getProvince,
  getCity,
  getDistrict,
  getSubDistrict,
  getIndustrialSector,
  getAccountCategory,
  getAccountGroup,
  getServiceType,
  getSor,
  getCostCenter,
  getGsizes,
  getCustomerSegment,
  getCustomer,
} from "../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import { searchAccountForException } from "../../../../redux/slices/receipt_collection/exceptionSlice";
import dayjs from "dayjs";

const ExceptionCreate = ({
  form,
  selectedAccounts = [],
  setSelectedAccounts,
  criteriaData = [],
  setCriteriaData,
  dataBillingCycle = [],
  dataBillingPeriod = [],
  dataActivity = [],
  dataCriteriaOptions = [],
  dataAccountSearch = null,
  onBillingCycleChange,
  onSearchAccount,
  loadingAccount = false,
}) => {
  const dispatch = useDispatch();
  const {
    data_budget,
    data_province,
    data_account_Category,
    data_service_type,
    data_sor,
    data_cost_center,
    data_Gsizes,
    data_customer_segment,
    data_customer,
    data_industrial_sector,
  } = useSelector((state) => state.billing_bucket);

  const [modalSearchAccount, setModalSearchAccount] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tempSelectedRows, setTempSelectedRows] = useState([]);
  const [rowDependentOptions, setRowDependentOptions] = useState({});
  const [editingKey, setEditingKey] = useState("");
  const [tempRow, setTempRow] = useState(null);
  const [pendingMode, setPendingMode] = useState(null);
  const [periodStartDate, setPeriodStartDate] = useState(null);

  const [allAccounts, setAllAccounts] = useState([]);
  const [hasMoreAccounts, setHasMoreAccounts] = useState(false);
  const accountPageRef = useRef(0);
  const isFetchingAccountsRef = useRef(false);
  const hasMoreAccountsRef = useRef(false);
  const isLoadMoreRef = useRef(false);
  const lastAccountSearchParamsRef = useRef(null);

  const accountSearchInput = useRef(null);
  const [accountSearchedColumn, setAccountSearchedColumn] = useState("");
  const [accountSearchText, setAccountSearchText] = useState("");
  const [accountModalGlobalFilter, setAccountModalGlobalFilter] = useState("");
  const [accountColumnFilters, setAccountColumnFilters] = useState({});

  useEffect(() => {
    if (!dataAccountSearch) return;
    const rows = (dataAccountSearch.result ?? []).map((a) => ({ ...a, key: a.accountNumber ?? a.id }));
    const totalPages = dataAccountSearch.page?.totalPages ?? 0;
    const nextHasMore = accountPageRef.current < totalPages - 1;
    setAllAccounts((prev) => (isLoadMoreRef.current ? [...prev, ...rows] : rows));
    setHasMoreAccounts(nextHasMore);
    hasMoreAccountsRef.current = nextHasMore;
    isFetchingAccountsRef.current = false;
  }, [dataAccountSearch]);

  // Auto-load next page if table body content doesn't produce a scrollbar
  useEffect(() => {
    if (!hasMoreAccounts || allAccounts.length === 0) return;
    const timer = setTimeout(() => {
      const tableBody = document.querySelector("#exception-account-search .ant-table-body");
      if (tableBody && tableBody.scrollHeight <= tableBody.clientHeight + 5) {
        handleLoadMoreAccounts();
      }
    }, 150);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAccounts, hasMoreAccounts]);

  const handleLoadMoreAccounts = useCallback(() => {
    if (!hasMoreAccountsRef.current || isFetchingAccountsRef.current) return Promise.resolve();
    if (!lastAccountSearchParamsRef.current) return Promise.resolve();
    isFetchingAccountsRef.current = true;
    isLoadMoreRef.current = true;
    const nextPage = accountPageRef.current + 1;
    accountPageRef.current = nextPage;
    const { activityId, billingCycleId, billingPeriodId, columnFilters = {} } = lastAccountSearchParamsRef.current;
    return dispatch(searchAccountForException({
      activityId: Array.isArray(activityId) ? activityId.join(",") : activityId,
      billingCycleId,
      billingPeriodId,
      page: nextPage,
      pageSize: 10,
      filters: columnFilters,
    }));
  }, [dispatch]);

  const handleAccountColumnSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setAccountSearchText(selectedKeys[0]);
    setAccountSearchedColumn(selectedKeys[0] ? dataIndex : "");
    // Build updated filters
    const next = { ...accountColumnFilters };
    if (selectedKeys[0]) { next[dataIndex] = selectedKeys[0]; } else { delete next[dataIndex]; }
    setAccountColumnFilters(next);
    // Reset pagination state
    accountPageRef.current = 0;
    isLoadMoreRef.current = false;
    isFetchingAccountsRef.current = false;
    hasMoreAccountsRef.current = false;
    setAllAccounts([]);
    setHasMoreAccounts(false);
    // Store updated filters in ref for load-more continuity
    const params = lastAccountSearchParamsRef.current;
    if (!params) return;
    lastAccountSearchParamsRef.current = { ...params, columnFilters: next };
    dispatch(searchAccountForException({
      activityId: Array.isArray(params.activityId) ? params.activityId.join(",") : params.activityId,
      billingCycleId: params.billingCycleId,
      billingPeriodId: params.billingPeriodId,
      page: 0,
      pageSize: 10,
      filters: next,
    }));
  };

  const activityValue = Form.useWatch("activity", form);
  const billingCycleValue = Form.useWatch("billingCycle", form);
  const billingPeriodValue = Form.useWatch("billingPeriod", form);
  const criteriaValue = Form.useWatch("criteria", form) ?? [];

  const canSearch =
    activityValue?.length > 0 && billingCycleValue && billingPeriodValue && criteriaData.length === 0;

  const filteredAccounts = accountModalGlobalFilter
    ? allAccounts.filter((row) =>
        Object.values(row).some(
          (v) => typeof v === "string" && v.toLowerCase().includes(accountModalGlobalFilter.toLowerCase())
        )
      )
    : allAccounts;

  useEffect(() => {
    if (!billingPeriodValue) {
      form.setFieldsValue({ startDate: null, endDate: null });
      setPeriodStartDate(null);
      return;
    }

    const selectedBillingPeriod = dataBillingPeriod.find(
      (item) => (item.id ?? item.periodId) === billingPeriodValue
    );

    if (selectedBillingPeriod) {
      const start = selectedBillingPeriod.startDate ? dayjs(selectedBillingPeriod.startDate) : null;
      setPeriodStartDate(start);
      form.setFieldsValue({ startDate: start, endDate: null });
    }
  }, [billingPeriodValue, dataBillingPeriod, form]);

  // ── Fetch LOV data (same thunks as FunctionalCriteriaBillingBucket) ──
  useEffect(() => {
    dispatch(getBudget());
    dispatch(getProvince());
    dispatch(getIndustrialSector());
    dispatch(getAccountCategory());
    dispatch(getServiceType());
    dispatch(getSor());
    dispatch(getCostCenter());
    dispatch(getGsizes());
    dispatch(getCustomerSegment());
    dispatch(getCustomer());
  }, [dispatch]);

  // ── Build option arrays (same mapping as FunctionalCriteriaBillingBucket) ──
  const budget = (Array.isArray(data_budget) ? data_budget : []).map((item) => ({ value: item.id, label: item.text }));
  const province = (Array.isArray(data_province) ? data_province : []).map((item) => ({ value: item.value, label: item.name }));
  const industrialSector = (Array.isArray(data_industrial_sector) ? data_industrial_sector : []).map((item) => ({ value: item.id, label: item.text }));
  const accountCategory = (Array.isArray(data_account_Category) ? data_account_Category : []).map((item) => ({ value: item.id, label: item.text }));
  const serviceType = (Array.isArray(data_service_type) ? data_service_type : []).map((item) => ({ value: item.id, label: item.text }));
  const sor = (Array.isArray(data_sor) ? data_sor : []).map((item) => ({ value: item.id, label: item.name }));
  const costCenter = (Array.isArray(data_cost_center) ? data_cost_center : []).map((item) => ({ value: item.id, label: item.name }));
  const gsizes = (Array.isArray(data_Gsizes) ? data_Gsizes : []).map((item) => ({ value: item.id, label: item.text }));
  const customerSegment = (Array.isArray(data_customer_segment) ? data_customer_segment : []).map((item) => ({ value: item.id, label: item.text }));
  const customer = (Array.isArray(data_customer) ? data_customer : []).map((item) => ({ value: item.id, label: item.name }));

  // ── Criteria field config: maps glbTypeValId (= indexValue) → field + options ──
  // Independent LOVs use options from Redux; dependent LOVs use per-row rowDependentOptions.
  // indexValue mapping from TableCriteriaBillingBucket:
  //   11=SOR, 12=Account, 13=Sub-District(dep:district), 14=District(dep:city),
  //   15=Province, 16=CostCenter, 17=Budget, 18=IndustrialSector,
  //   19=CustomerSegment, 20=AccountGroup(dep:customerSegment),
  //   21=ServiceType, 22=AccountCategory, 23=GSizes, 39=City(dep:province)
  const criteriaFieldConfig = {
    11: { field: "sor",              options: sor },
    12: { field: "customer",         options: customer },
    13: { field: "subDistrict",      dependent: "district" },
    14: { field: "district",         dependent: "city" },
    15: { field: "province",         options: province },
    16: { field: "costCenter",       options: costCenter },
    17: { field: "budget",           options: budget },
    18: { field: "industrialSector", options: industrialSector },
    19: { field: "customerSegment",  options: customerSegment },
    20: { field: "accountGroup",     dependent: "customerSegment" },
    21: { field: "serviceType",      options: serviceType },
    22: { field: "accountCategory",  options: accountCategory },
    23: { field: "gsizes",           options: gsizes },
    39: { field: "city",             dependent: "province" },
  };

  const getCriteriaField = (criteriaId) =>
    criteriaFieldConfig[criteriaId]?.field ?? `criteria_${criteriaId}`;

  const getCriteriaOptions = (criteriaId, rowKey) => {
    const config = criteriaFieldConfig[criteriaId];
    if (!config) return [];
    if (config.dependent) return rowDependentOptions[rowKey]?.[config.field] ?? [];
    return config.options ?? [];
  };

  const primaryTagStyle = {
    backgroundColor: "var(--primary)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    maxWidth: 130,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: 4,
  };

  const activityTagRender = ({ value, closable, onClose }) => {
    const found = dataActivity.find((a) => a.glbTypeValId === value);
    const label = found ? (found.glbValue ?? found.name) : String(value);
    return (
      <Tag closable={closable} onMouseDown={(e) => e.preventDefault()} onClose={onClose} style={primaryTagStyle}>
        {label}
      </Tag>
    );
  };

  const criteriaTagRender = ({ value, closable, onClose }) => {
    const found = dataCriteriaOptions.find((a) => a.glbTypeValId === value);
    const label = found ? (found.name ?? found.glbValue) : String(value);
    return (
      <Tag closable={closable} onMouseDown={(e) => e.preventDefault()} onClose={onClose} style={primaryTagStyle}>
        {label}
      </Tag>
    );
  };

  const billingCycleFirstRenderRef = useRef(true);
  useEffect(() => {
    if (billingCycleFirstRenderRef.current) {
      billingCycleFirstRenderRef.current = false;
      return;
    }
    form.setFieldsValue({ billingPeriod: undefined });
    if (onBillingCycleChange) onBillingCycleChange(billingCycleValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingCycleValue]);


  const handleOpenSearchAccount = () => {
    setSelectedRowKeys(selectedAccounts.map((a) => a.accountNumber));
    setTempSelectedRows([...selectedAccounts]);
    const params = {
      activityId: activityValue,
      billingCycleId: billingCycleValue,
      billingPeriodId: billingPeriodValue,
    };
    lastAccountSearchParamsRef.current = { activityId: activityValue, billingCycleId: billingCycleValue, billingPeriodId: billingPeriodValue, columnFilters: {} };
    isLoadMoreRef.current = false;
    accountPageRef.current = 0;
    isFetchingAccountsRef.current = false;
    setAllAccounts([]);
    setHasMoreAccounts(false);
    hasMoreAccountsRef.current = false;
    setAccountColumnFilters({});
    setAccountSearchText("");
    setAccountSearchedColumn("");
    onSearchAccount({ activityId: activityValue, billingCycleId: billingCycleValue, billingPeriodId: billingPeriodValue });
    setModalSearchAccount(true);
  };

  const handleConfirmSearchAccount = () => {
    setSelectedAccounts(tempSelectedRows);
    setModalSearchAccount(false);
  };

  const handleCancelSearchAccount = () => {
    setModalSearchAccount(false);
    setSelectedRowKeys([]);
    setTempSelectedRows([]);
  };

  const accountSearchColumns = [
    { title: "NO", key: "no", width: 60, align: "left", render: (_, __, index) => index + 1 },
    { title: "CUSTOMER NUMBER", dataIndex: "customerNumber", key: "customerNumber", align: "left", ...getColumnSearchProps("customerNumber", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "CUSTOMER NAME", dataIndex: "customerName", key: "customerName", align: "left", ...getColumnSearchProps("customerName", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "ACCOUNT NUMBER", dataIndex: "accountNumber", key: "accountNumber", align: "left", ...getColumnSearchProps("accountNumber", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "ACCOUNT NAME", dataIndex: "accountName", key: "accountName", align: "left", ...getColumnSearchProps("accountName", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "SOR", dataIndex: "sor", key: "sor", align: "left", ...getColumnSearchProps("sor", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "COST CENTER", dataIndex: "costCenter", key: "costCenter", align: "left", ...getColumnSearchProps("costCenter", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", key: "accountSegment", align: "left", ...getColumnSearchProps("accountSegment", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", key: "accountGroupType", align: "left", ...getColumnSearchProps("accountGroupType", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "METER READING CODE", dataIndex: "meterReadingCode", key: "meterReadingCode", align: "left", ...getColumnSearchProps("meterReadingCode", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "ACCOUNT TYPE", dataIndex: "accountType", key: "accountType", align: "left", ...getColumnSearchProps("accountType", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "ACCOUNT STATUS", dataIndex: "accountStatus", key: "accountStatus", align: "left", ...getColumnSearchProps("accountStatus", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "CUSTOMER SEGMENT", dataIndex: "customerSegment", key: "customerSegment", align: "left", ...getColumnSearchProps("customerSegment", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "CORPORATE CUSTOMER", dataIndex: "corporateCustomer", key: "corporateCustomer", align: "left", ...getColumnSearchProps("corporateCustomer", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
    { title: "CLASSIFICATION TYPE", dataIndex: "classificationType", key: "classificationType", align: "left", ...getColumnSearchProps("classificationType", accountSearchInput, accountSearchedColumn, accountSearchText, handleAccountColumnSearch), onFilter: () => true },
  ];

  const accountInfoColumns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "left",
      render: (_, __, index) => index + 1,
    },
    { title: "CUSTOMER NUMBER", dataIndex: "customerNumber", key: "customerNumber", align: "left" },
    { title: "CUSTOMER NAME", dataIndex: "customerName", key: "customerName", align: "left" },
    { title: "ACCOUNT NUMBER", dataIndex: "accountNumber", key: "accountNumber", align: "left" },
    { title: "ACCOUNT NAME", dataIndex: "accountName", key: "accountName", align: "left" },
    { title: "SOR", dataIndex: "sor", key: "sor", align: "left" },
    { title: "COST CENTER", dataIndex: "costCenter", key: "costCenter", align: "left" },
    { title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", key: "accountSegment", align: "left" },
    { title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", key: "accountGroupType", align: "left" },
    { title: "METER READING CODE", dataIndex: "meterReadingCode", key: "meterReadingCode", align: "left" },
    { title: "ACCOUNT TYPE", dataIndex: "accountType", key: "accountType", align: "left" },
    { title: "ACCOUNT STATUS", dataIndex: "accountStatus", key: "accountStatus", align: "left" },
    { title: "CUSTOMER SEGMENT", dataIndex: "customerSegment", key: "customerSegment", align: "left" },
    { title: "CORPORATE CUSTOMER", dataIndex: "corporateCustomer", key: "corporateCustomer", align: "left" },
    { title: "CLASSIFICATION TYPE", dataIndex: "classificationType", key: "classificationType", align: "left" },
    {
      title: "ACTION",
      key: "action",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Tooltip title="Remove">
          <DeleteOutlined
            style={{ color: "#BE3036", fontSize: "16px", cursor: "pointer" }}
            onClick={() =>
              setSelectedAccounts((prev) =>
                prev.filter((a) => a.accountNumber !== record.accountNumber)
              )
            }
          />
        </Tooltip>
      ),
    },
  ];

  // ── Criteria select handlers (dependency logic matching BillingBucketSectionForm) ──
  const handleSelectCriteria = (value) => {
    let res = [...criteriaValue, value];
    if (res.includes(13)) res.push(14);
    if (res.includes(14)) res.push(39);
    if (res.includes(39)) res.push(15);
    if (res.includes(20)) res.push(19);
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    form.setFieldsValue({ criteria: outputArray });
  };

  const handleDeselectCriteria = (value) => {
    let res = criteriaValue.filter((item) => item !== value);
    if (!res.includes(15)) res = res.filter((item) => item !== 39);
    if (!res.includes(39)) res = res.filter((item) => item !== 14);
    if (!res.includes(14)) res = res.filter((item) => item !== 13);
    if (!res.includes(19)) res = res.filter((item) => item !== 20);
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    form.setFieldsValue({ criteria: outputArray });
  };

  const handleClearCriteria = () => {
    form.setFieldsValue({ criteria: [] });
  };

  const handleCriteriaFieldChange = (rowKey, field, value) => {
    setCriteriaData((prev) =>
      prev.map((r) => (r.key === rowKey ? { ...r, [field]: value } : r))
    );
  };

  // ── Dependent LOV cascade handler ──
  // When a parent LOV field changes, clears child values and fetches child options per-row.
  const cascadeConfig = {
    province: {
      childFields: ["city", "district", "subDistrict"],
      fetchChildren: (value) => dispatch(getCity(value)).unwrap(),
      childKey: "city",
      mapResult: (c) => ({ value: c.value, label: c.name }),
    },
    city: {
      childFields: ["district", "subDistrict"],
      fetchChildren: (value) => dispatch(getDistrict(value)).unwrap(),
      childKey: "district",
      mapResult: (d) => ({ value: d.value, label: d.name }),
    },
    district: {
      childFields: ["subDistrict"],
      fetchChildren: (value) => dispatch(getSubDistrict(value)).unwrap(),
      childKey: "subDistrict",
      mapResult: (s) => ({ value: s.value, label: s.name }),
    },
    customerSegment: {
      childFields: ["accountGroup"],
      fetchChildren: (value) => dispatch(getAccountGroup(value)).unwrap(),
      childKey: "accountGroup",
      mapResult: (g) => ({ value: g.id, label: g.name }),
    },
  };

  const handleCriteriaSelectChange = async (rowKey, field, value) => {
    // when not editing, persist immediately; when editing, only update tempRow
    if (editingKey === rowKey) {
      setTempRow((prev) => ({ ...(prev || {}), [field]: value }));
    } else {
      handleCriteriaFieldChange(rowKey, field, value);
    }
    const cascade = cascadeConfig[field];
    if (!cascade) return;

    // Clear all child fields and their options for this row
    cascade.childFields.forEach((f) => handleCriteriaFieldChange(rowKey, f, null));
    const clearedOptions = cascade.childFields.reduce((acc, f) => ({ ...acc, [f]: [] }), {});
    setRowDependentOptions((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], ...clearedOptions } }));

    if (value) {
      try {
        const result = await cascade.fetchChildren(value);
        const options = (Array.isArray(result) ? result : []).map((item) => cascade.mapResult(item));
        setRowDependentOptions((prev) => ({
          ...prev,
          [rowKey]: { ...prev[rowKey], [cascade.childKey]: options },
        }));
      } catch (e) {
        console.error(`Failed to fetch ${cascade.childKey} options:`, e);
      }
    }
  };

  const handleAddCriteriaRow = () => {
    const newRow = {
      key: Date.now(),
      startDate: null,
      endDate: null,
      description: null,
    };
    setCriteriaData((prev) => [...prev, newRow]);
    setEditingKey(newRow.key);
    setTempRow({ ...newRow, criteriaValues: [] });
  };

  const handleDeleteCriteriaRow = (key) => {
    setCriteriaData((prev) => prev.filter((r) => r.key !== key));
    setRowDependentOptions((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleCriteriaDateChange = (key, field, value) => {
    if (editingKey === key) {
      setTempRow((prev) => ({ ...(prev || {}), [field]: value }));
    } else {
      setCriteriaData((prev) =>
        prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
      );
    }
  };

  const sortCriteriaByDependency = (items, config) => {
    const visited = new Set();
    const result = [];

    const visit = (item) => {
      const id = item.glbTypeValId;
      if (visited.has(id)) return;

      const conf = config[id];

      if (conf?.dependent) {
        // find the dependency item
        const depItem = items.find(
          (i) => config[i.glbTypeValId]?.field === conf.dependent
        );
        if (depItem) {
          visit(depItem);
        }
      }

      visited.add(id);
      result.push(item);
    };

    items.forEach(visit);

    return result;
  };

  const filtered = dataCriteriaOptions.filter((item) =>
    criteriaValue.includes(item.glbTypeValId)
  );

  const ordered = sortCriteriaByDependency(filtered, criteriaFieldConfig); 

  const dynamicCriteriaColumns = ordered.map((item) => {
      const criteriaId = item.glbTypeValId;
      const config = criteriaFieldConfig[criteriaId];
      const field = getCriteriaField(criteriaId);
      const title = (item.name ?? item.glbValue ?? "").toUpperCase();

      return {
        title,
        key: field,
        align: "left",
        render: (_, record) => {
          if (config) {
            const options = getCriteriaOptions(criteriaId, record.key);
            const currentValue = editingKey === record.key ? tempRow?.[field] : record[field];
            const parentVal = config.dependent ? (editingKey === record.key ? tempRow?.[config.dependent] : record[config.dependent]) : null;
            const isDisabled = !!config.dependent && !parentVal;

            // When not editing, render as plain label text
            if (editingKey !== record.key) {
              const label = options.find((o) => String(o.value) === String(currentValue))?.label ?? (currentValue ?? "");
              return <div className="py-1">{label}</div>;
            }

            // Editing mode: show Select
            return (
              <SelectComponent
                allowClear
                showSearch
                optionFilterProp="children"
                value={currentValue}
                disabled={isDisabled}
                onChange={async (val) => {
                  const cascade = cascadeConfig[field];
                  // prepare new temp row, clearing child fields if any
                  const newTemp = { ...(tempRow || {}), [field]: val };
                  if (cascade) {
                    cascade.childFields.forEach((f) => { newTemp[f] = null; });
                    const cleared = cascade.childFields.reduce((acc, f) => ({ ...acc, [f]: [] }), {});
                    setRowDependentOptions((prev) => ({ ...(prev || {}), [record.key]: { ...((prev || {})[record.key] || {}), ...cleared } }));
                    try {
                      const result = await cascade.fetchChildren(val);
                      const opts = (Array.isArray(result) ? result : []).map((it) => cascade.mapResult(it));
                      setRowDependentOptions((prev) => ({ ...(prev || {}), [record.key]: { ...((prev || {})[record.key] || {}), [cascade.childKey]: opts } }));
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  setTempRow(newTemp);
                }}
                style={{ width: "100%", minWidth: 160 }}
              >
                {options.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </SelectComponent>
            );
          }
          // Fallback: free-text input for unrecognised criteria
          const currentVal = editingKey === record.key ? tempRow?.[field] : record[field];
          if (editingKey !== record.key) return <div className="py-1">{currentVal ?? ""}</div>;
          return (
            <InputComponent
              value={currentVal ?? ""}
              onChange={(e) => {
                setTempRow((prev) => ({ ...(prev || {}), [field]: e.target.value }));
              }}
            />
          );
        },
      };
    });

  const criteriaColumns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "left",
      render: (_, __, index) => index + 1,
    },
    ...dynamicCriteriaColumns,
    {
      title: "START DATE",
      key: "startDate",
      align: "left",
      render: (_, record) => {
        if (editingKey !== record.key) {
          const v = record.startDate;
          const label = v && v.format ? v.format("YYYY-MM-DD") : v || "";
          return <div className="py-1">{label}</div>;
        }
        return (
          <DatePicker
            value={tempRow?.startDate ?? record.startDate}
            onChange={(val) => {
              handleCriteriaDateChange(record.key, "startDate", val);
              // clear criteria endDate if it's no longer valid
              const currentEnd = tempRow?.endDate ?? record.endDate;
              if (currentEnd && val && currentEnd.valueOf() <= val.valueOf()) {
                handleCriteriaDateChange(record.key, "endDate", null);
              }
            }}
            disabledDate={(d) => {
              const exStart = form.getFieldValue("startDate");
              return exStart && d && d.valueOf() < exStart.valueOf();
            }}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "END DATE",
      key: "endDate",
      align: "left",
      render: (_, record) => {
        if (editingKey !== record.key) {
          const v = record.endDate;
          const label = v && v.format ? v.format("YYYY-MM-DD") : v || "";
          return <div className="py-1">{label}</div>;
        }
        const critRowStart = tempRow?.startDate ?? record.startDate;
        return (
          <DatePicker
            value={tempRow?.endDate ?? record.endDate}
            onChange={(val) => handleCriteriaDateChange(record.key, "endDate", val)}
            disabledDate={(d) => {
              if (critRowStart && d && d.valueOf() <= critRowStart.valueOf()) return true;
              return false;
            }}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "DESCRIPTION",
      key: "description",
      align: "left",
      render: (_, record) => {
        if (editingKey !== record.key) {
          return <div className="py-1">{record.description ?? ""}</div>;
        }
        return (
          <InputComponent
            value={tempRow?.description ?? ""}
            onChange={(e) => setTempRow((prev) => ({ ...(prev || {}), description: e.target.value }))}
            placeholder="Input Description"
          />
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, record) => {
        if (record.key === editingKey) {
          return (
            <div className="flex my-3 gap-2">
              <ButtonComponent onClick={() => { setEditingKey(""); setTempRow(null); }} type="default">Cancel</ButtonComponent>
              <ButtonComponent onClick={() => {
                // build criteriaValues array from selected criteria order
                const mapped = (ordered || []).map((crit) => {
                  const id = crit.glbTypeValId;
                  const fld = getCriteriaField(id);
                  return { glbTypeValId: id, value: (tempRow || {})[fld] ?? null };
                });
                // save tempRow into criteriaData and include criteriaValues for backend
                setCriteriaData((prev) => prev.map((r) => (r.key === record.key ? { ...r, ...(tempRow || {}), criteriaValues: mapped, description: (tempRow || {}).description ?? null } : r)));
                setEditingKey("");
                setTempRow(null);
              }} type="submit">Save</ButtonComponent>
            </div>
          );
        }

        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Edit">
              <div>
                <SVGIcon
                  name="IconEdit"
                  color={editingKey ? "#8D91A0" : "#ACC424"}
                  className={`${editingKey ? "cursor-not-allowed" : ""}`}
                  width={24}
                  onClick={() => {
                    if (!editingKey) {
                      setEditingKey(record.key);
                      setTempRow({ ...record });
                    }
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="Delete">
              <div>
                <SVGIcon
                  name="IconDelete"
                  color={"#D90000"}
                  width={24}
                  onClick={() => handleDeleteCriteriaRow(record.key)}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const renderSectionHeader = (title) => (
    <div className="flex -my-4 justify-between items-center">
      <p className="w-full mt-[15px] text-primary font-bold">{title.toUpperCase()}</p>
    </div>
  );

  return (
    <div className="w-full mb-5 flex flex-col gap-x-4">
      {/* ── Section 1: Exception Information ── */}
      <CardContainer header={renderSectionHeader("Exception Information")}>
        <div className="w-full grid grid-cols-5 gap-x-4">
          <Form.Item
            label="Activity"
            name="activity"
            rules={formMessageRequired("Activity")}
          >
            <SelectComponent
              mode="multiple"
              placeholder="Choose Multiple Activity"
              allowClear
              optionFilterProp="children"
              maxTagCount={null}
              tagRender={activityTagRender}
            >
              {dataActivity.map((item) => (
                <Select.Option key={item.glbTypeValId} value={item.glbTypeValId}>
                  <Checkbox
                    checked={Array.isArray(activityValue) && activityValue.includes(item.glbTypeValId)}
                    style={{ marginRight: 8 }}
                  />
                  {item.glbValue ?? item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Billing Cycle"
            name="billingCycle"
            rules={formMessageRequired("Billing Cycle")}
          >
            <SelectComponent
              placeholder="Select Billing Cycle"
              allowClear
            >
              {dataBillingCycle.map((item) => (
                <Select.Option key={item.id ?? item.billingCycleId} value={item.id ?? item.billingCycleId}>
                  {`${item.beginCycle} - ${item.endCycle} ${item.timeUnit}`}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Billing Period"
            name="billingPeriod"
            rules={formMessageRequired("Billing Period")}
          >
            <SelectComponent
              placeholder="Select Billing Period"
              disabled={!billingCycleValue}
              allowClear
            >
              {dataBillingPeriod.map((item) => (
                <Select.Option key={item.id ?? item.periodId} value={item.id ?? item.periodId}>
                  {item.description ?? item.period ?? item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={formMessageRequired("Start Date")}
          >
            <DatePicker
              style={{ width: "100%", borderRadius: "6px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
              disabled={!billingPeriodValue}
              disabledDate={(d) => periodStartDate && d && d.valueOf() < periodStartDate.valueOf()}
              onChange={(val) => {
                const endDate = form.getFieldValue("endDate");
                if (endDate && val && val.valueOf() > endDate.valueOf()) {
                  form.setFieldsValue({ endDate: null });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
          >
            <DatePicker
              style={{ width: "100%", borderRadius: "6px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
              disabled={!billingPeriodValue}
              disabledDate={(d) => {
                const startDate = form.getFieldValue("startDate");
                return startDate && d && d.valueOf() <= startDate.valueOf();
              }}
              placeholder="Select Date (empty = no expiry)"
            />
          </Form.Item>

          <div className="col-span-5">
            <Form.Item
              label="Criteria"
              name="criteria"
            >
              <SelectComponent
                mode="multiple"
                placeholder="Select Criteria"
                allowClear
                optionFilterProp="children"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
                disabled={selectedAccounts.length > 0 || criteriaData.length > 0}
                tagRender={criteriaTagRender}
              >
                {dataCriteriaOptions
                  .filter((item) => [11, 12, 16, 17, 18, 22].includes(item.glbTypeValId))
                  .map((item) => (
                    <Select.Option key={item.glbTypeValId} value={item.glbTypeValId}>
                      {item.name ?? item.glbValue}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          </div>

          <div className="col-span-5">
            <Form.Item
              label="Description"
              name="description"
              rules={formMessageRequired("Description")}
            >
              <InputComponent rows={3} type="textarea" placeholder="Input Description" />
            </Form.Item>
          </div>

        </div>
      </CardContainer>

      {/* ── Section 2: Account Information ── */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold text-primary">ACCOUNT INFORMATION</p>
            <ButtonComponent
              type="submit"
              disabled={!canSearch}
              onClick={handleOpenSearchAccount}
              icon={<SVGIcon name="IconSearch" width={18} />}
            >
              Search Account
            </ButtonComponent>
          </div>
        }
      >
        <TableRBI
          dataSource={selectedAccounts.map((a, i) => ({ ...a, key: a.accountNumber ?? i }))}
          columns={accountInfoColumns}
          pageSize={selectedAccounts.length || 10}
          current={1}
          totalData={selectedAccounts.length}
          tableScrolled={{ x: "max-content" }}
          showExport={false}
          usePagination={false}
        />
      </CardContainer>

      {/* ── Section 3: Criteria Information ── */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold text-primary">CRITERIA INFORMATION</p>
            <ButtonComponent
              className="min-w-[120px]"
              type="submit"
              disabled={selectedAccounts.length > 0 || !criteriaValue?.length || !!editingKey}
              onClick={handleAddCriteriaRow}
              icon={<SVGIcon name="IconButtonCreate" width={20} />}
            >
              Create
            </ButtonComponent>
          </div>
        }
      >
        <TableRBI
          key={criteriaValue.join(",")}
          dataSource={criteriaData}
          columns={criteriaColumns}
          pageSize={criteriaData.length || 10}
          current={1}
          totalData={criteriaData.length}
          tableScrolled={{ x: "max-content" }}
          showExport={false}
          usePagination={false}
        />
      </CardContainer>

      {/* ── Search Account Modal ── */}
      <Modal
        open={modalSearchAccount}
        onCancel={handleCancelSearchAccount}
        title="Search Account"
        width={1000}
        footer={
          <div className="flex justify-end gap-3 p-2">
            <ButtonComponent type="default" onClick={handleCancelSearchAccount}>
              Cancel
            </ButtonComponent>
            <ButtonComponent type="submit" onClick={handleConfirmSearchAccount}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Spin spinning={loadingAccount}>
          <TableRBI
            idTable="exception-account-search"
            dataSource={filteredAccounts}
            columns={accountSearchColumns}
            tableScrolled={{ x: "max-content", y: 400 }}
            showExport={false}
            useInfiniteScroll={true}
            hasMore={hasMoreAccounts}
            onLoadMore={handleLoadMoreAccounts}
            onSearch={(e) => setAccountModalGlobalFilter(e.target.value)}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys,
              onChange: (keys, rows) => {
                // Preserve selections from rows NOT in the current filtered dataset
                // (e.g. selections made under a different column filter)
                const currentKeys = new Set(
                  filteredAccounts.map((a) => a.key ?? a.accountNumber)
                );
                const preserved = tempSelectedRows.filter(
                  (r) => !currentKeys.has(r.key ?? r.accountNumber)
                );
                const preservedKeys = preserved.map((r) => r.key ?? r.accountNumber);
                setSelectedRowKeys([...preservedKeys, ...keys]);
                setTempSelectedRows([...preserved, ...rows]);
              },
            }}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default ExceptionCreate;
