import React, { useState, useEffect } from "react";
import { DatePicker, Form, Modal, Spin, Tooltip, Select, Segmented } from "antd";
import { WarningOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../components/CardContainer";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import { formMessageRequired } from "../../../../utils";
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
  exceptionMode = "ACCOUNT",
  onExceptionModeChange,
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
  const [modalSwitchMode, setModalSwitchMode] = useState(false);

  const activityValue = Form.useWatch("activity", form);
  const billingCycleValue = Form.useWatch("billingCycle", form);
  const billingPeriodValue = Form.useWatch("billingPeriod", form);
  const criteriaValue = Form.useWatch("criteria", form) ?? [];

  const canSearch =
    activityValue?.length > 0 && billingCycleValue && billingPeriodValue;

  useEffect(() => {
    if (!billingPeriodValue) {
      form.setFieldsValue({
        startDate: null,
        endDate: null,
      });
      return;
    }

    const selectedBillingPeriod = dataBillingPeriod.find(
        (item) => (item.id ?? item.periodId) === billingPeriodValue
    );

    if (selectedBillingPeriod) {
      form.setFieldsValue({
        startDate: selectedBillingPeriod.startDate
            ? dayjs(selectedBillingPeriod.startDate)
            : null,

        endDate: selectedBillingPeriod.endDate
            ? dayjs(selectedBillingPeriod.endDate)
            : null,
      });
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

  const handleModeChangeRequest = (newMode) => {
    if (newMode === exceptionMode) return;
    const hasAccountData = selectedAccounts.length > 0;
    const hasCriteriaData = criteriaData.length > 0;
    if ((exceptionMode === "ACCOUNT" && hasAccountData) || (exceptionMode === "CRITERIA" && hasCriteriaData)) {
      setPendingMode(newMode);
      setModalSwitchMode(true);
    } else {
      onExceptionModeChange(newMode);
    }
  };

  const handleModeConfirm = () => {
    if (pendingMode === "ACCOUNT") {
      setCriteriaData([]);
      form.setFieldsValue({ criteria: [] });
    } else if (pendingMode === "CRITERIA") {
      setSelectedAccounts([]);
    }
    onExceptionModeChange(pendingMode);
    setModalSwitchMode(false);
    setPendingMode(null);
  };

  const handleBillingCycleChange = (value) => {
    form.setFieldsValue({ billingPeriod: undefined });
    if (onBillingCycleChange) onBillingCycleChange(value);
  };

  const handleOpenSearchAccount = () => {
    setSelectedRowKeys(selectedAccounts.map((a) => a.accountNumber));
    setTempSelectedRows([...selectedAccounts]);
    onSearchAccount({
      activityId: activityValue,
      billingCycleId: billingCycleValue,
      billingPeriodId: billingPeriodValue,
    });
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
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      align: "left",
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      key: "accountName",
      align: "left",
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      key: "customerNumber",
      align: "left",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      align: "left",
    },
    {
      title: "SOR",
      dataIndex: "sor",
      key: "sor",
      align: "left",
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      key: "costCenter",
      align: "left",
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      key: "accountSegment",
      align: "left",
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      key: "accountGroupType",
      align: "left",
    },
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
    { title: "ACTIVITY", dataIndex: "activity", key: "activity", align: "left" },
    { title: "BILLING CYCLE", dataIndex: "billingCycle", key: "billingCycle", align: "left" },
    { title: "BILLING PERIOD", dataIndex: "billingPeriod", key: "billingPeriod", align: "left" },
    { title: "START DATE", dataIndex: "startDate", key: "startDate", align: "left" },
    { title: "END DATE", dataIndex: "endDate", key: "endDate", align: "left" },
    { title: "DESCRIPTION", dataIndex: "description", key: "description", align: "left" },
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
            onChange={(val) => handleCriteriaDateChange(record.key, "startDate", val)}
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
        return (
          <DatePicker
            value={tempRow?.endDate ?? record.endDate}
            onChange={(val) => handleCriteriaDateChange(record.key, "endDate", val)}
            style={{ width: "100%" }}
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
                setCriteriaData((prev) => prev.map((r) => (r.key === record.key ? { ...r, ...(tempRow || {}), criteriaValues: mapped } : r)));
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
              placeholder="Select Activity"
              allowClear
              optionFilterProp="children"
            >
              {dataActivity.map((item) => (
                <Select.Option key={item.glbTypeValId} value={item.glbTypeValId}>
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
              onChange={handleBillingCycleChange}
              allowClear
            >
              {dataBillingCycle.map((item) => (
                <Select.Option key={item.id ?? item.billingCycleId} value={item.id ?? item.billingCycleId}>
                  {item.description ?? item.name}
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
          >
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
          >
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>

          <div className="col-span-5">
            <Form.Item
              label="Description"
              name="description"
              rules={formMessageRequired("Description")}
            >
              <InputComponent rows={3} type="textarea" placeholder="Input Description" />
            </Form.Item>
          </div>

          <div className="col-span-5">
            <Form.Item label="Apply Exception To">
              <Segmented
                  block
                  options={[
                    { label: "Specific Accounts", value: "ACCOUNT" },
                    { label: "Criteria-Based Accounts", value: "CRITERIA" },
                  ]}
                  value={exceptionMode}
                  onChange={handleModeChangeRequest}
              />
            </Form.Item>
          </div>

        </div>
      </CardContainer>



      {/* ── Section 2: Account Information ── */}
      <div className={exceptionMode !== "ACCOUNT" ? "opacity-50" : ""}>
        <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] font-bold text-primary">ACCOUNT INFORMATION</p>
                <ButtonComponent
                    type="submit"
                    disabled={!canSearch || exceptionMode !== "ACCOUNT"}
                    onClick={handleOpenSearchAccount}
                    icon={<SVGIcon name="IconSearch" width={18} />}
                >
                  Search Account
                </ButtonComponent>
              </div>
            }>
          <div className="flex justify-end">

          </div>
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
      </div>

      {/*/!* ── Section 3: Criteria Information ── *!/*/}

      <div className={exceptionMode !== "CRITERIA" ? "opacity-50" : ""}>
        <CardContainer header={renderSectionHeader("Criteria Information")}>
          <div className="w-full grid grid-cols-5 gap-4">
            <div className="col-span-4">
              <Form.Item
                  label="Criteria"
                  name="criteria"
                  rules={
                    exceptionMode === "CRITERIA"
                        ? formMessageRequired("Criteria")
                        : undefined
                  }
              >
                <SelectComponent
                    mode="multiple"
                    placeholder="Select Criteria"
                    allowClear
                    optionFilterProp="children"
                    onSelect={handleSelectCriteria}
                    onDeselect={handleDeselectCriteria}
                    onClear={handleClearCriteria}
                    disabled={
                        exceptionMode !== "CRITERIA" ||
                        criteriaData.length > 0
                    }
                >
                  {dataCriteriaOptions.map((item) => (
                      <Select.Option
                          key={item.glbTypeValId}
                          value={item.glbTypeValId}
                      >
                        {item.name ?? item.glbValue}
                      </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>

            <div className="col-span-1 flex justify-end items-center">
              <ButtonComponent
                  className="min-w-[120px]"
                  type="submit"
                  disabled={
                      exceptionMode !== "CRITERIA" ||
                      !criteriaValue?.length ||
                      !!editingKey
                  }
                  onClick={handleAddCriteriaRow}
                  icon={<SVGIcon name="IconButtonCreate" width={20} />}
              >
                Create
              </ButtonComponent>
            </div>
          </div>

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
      </div>

      {/* ── Mode Switch Confirmation Modal ── */}
      <Modal
        open={modalSwitchMode}
        onCancel={() => { setModalSwitchMode(false); setPendingMode(null); }}
        title="Change Selection Mode"
        width={450}
        footer={
          <div className="flex justify-end gap-3 p-2">
            <ButtonComponent type="default" onClick={() => { setModalSwitchMode(false); setPendingMode(null); }}>
              Cancel
            </ButtonComponent>
            <ButtonComponent type="submit" onClick={handleModeConfirm}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div className="flex items-start gap-3 p-4">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036", marginTop: 2 }} />
          <div>
            <p className="font-bold text-base mb-1">Are you sure you want to switch mode?</p>
            <p className="text-sm text-gray-600">
              {pendingMode === "CRITERIA"
                ? "Switching to Criteria-Based mode will clear all selected accounts."
                : "Switching to Specific Accounts mode will clear all criteria rows."}
            </p>
          </div>
        </div>
      </Modal>

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
            dataSource={(dataAccountSearch?.result ?? []).map((a) => ({
              ...a,
              key: a.accountNumber ?? a.id,
            }))}
            columns={accountSearchColumns}
            pageSize={10}
            current={1}
            totalData={dataAccountSearch?.page?.totalElements ?? 0}
            tableScrolled={{ x: "max-content" }}
            showExport={false}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys,
              onChange: (keys, rows) => {
                setSelectedRowKeys(keys);
                setTempSelectedRows(rows);
              },
            }}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default ExceptionCreate;
