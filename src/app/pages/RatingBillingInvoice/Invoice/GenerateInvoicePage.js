import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  message,
  Table,
  Space,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../components/TableRBI";
import { columnsGenerateInvoice } from "./TableGenerateInvoice";
import CardContainer from "../../../../components/CardContainer";
import {
  getBillingApproval,
  createGenerate,
  getInvoiceTemplates,
  getCostCenterInvoice,
  getAccountSegmentInvoice,
  getMeterReadingCodeInvoice,
  getAccountGroupTypeInvoice,
} from "../../../../redux/slices/rating_billing_invoice/invoice";
import { useNavigate } from "react-router-dom";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";

const { TextArea } = Input;
const { Option } = Select;

const ScheduleImmediate = ({ remark, setRemark }) => (
  <>
    <Form.Item label="Remark" name="remark" rules={[{ required: true }]}>
      <TextArea
        rows={4}
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        maxLength={255}
        showCount
      />
    </Form.Item>
  </>
);

const ScheduleSchedule = ({ schedule, setSchedule, remark, setRemark }) => (
  <>
    <Form.Item
      label="Schedule"
      name="schedule"
      rules={[
        { required: true, message: "Please select schedule date and time" },
      ]}
    >
      <DatePicker
        showTime
        format="DD MMM YYYY HH:mm:ss"
        value={schedule ? moment(schedule) : null}
        onChange={(value) => setSchedule(value)}
        style={{ width: "100%" }}
      />
    </Form.Item>

    <Form.Item label="Remark" name="remark" rules={[{ required: true }]}>
      <TextArea
        rows={4}
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        maxLength={255}
        showCount
      />
    </Form.Item>
  </>
);

const GenerateInvoicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data_billing,
    data_invoice_templates,
    data_cost_center_invoice,
    data_account_segment_invoice,
    data_meter_reading_code_invoice,
    data_account_group_type_invoice,
  } = useSelector((s) => s.invoice);
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  // form state
  const [exportFormat, setExportFormat] = useState("PDF");
  const [specificCriteria, setSpecificCriteria] = useState([]);
  const [invoiceTemplate, setInvoiceTemplate] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [scheduleType, setScheduleType] = useState("Immediate");
  const [schedule, setSchedule] = useState(null);
  const [remark, setRemark] = useState("");
  const templateSearchRef = useRef(null);

  // criteria table state
  const [criteriaRows, setCriteriaRows] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [draftRow, setDraftRow] = useState({});
  const [accountGroupTypeLoading, setAccountGroupTypeLoading] = useState(false);
  const [meterReadingLoading, setMeterReadingLoading] = useState(false);

  // table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [sort, setSort] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterRowSelected, setFilterRowSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // persisted fixedColumns (localStorage) — mirror proforma behavior
  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("generateInvoiceFixedColumns");
      return saved ? JSON.parse(saved) : { left: [], right: [] };
    } catch {
      return { left: [], right: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "generateInvoiceFixedColumns",
        JSON.stringify(fixedColumns),
      );
    } catch (e) {
      // ignore
    }
  }, [fixedColumns]);

  // fetch billing data
  useEffect(() => {
    fetchBillingData();
    fetchInvoiceTemplates("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data_billing && Array.isArray(data_billing)) {
      setDataTable(
        data_billing?.map((item, index) => ({
          key: item.billHeaderId ?? item.billingCode ?? index + 1,
          ...item,
        })),
      );
    } else {
      setDataTable([]);
    }
  }, [data_billing]);

  useEffect(() => {
    if (selectedRowKeys?.length !== 0) {
      setFilterRowSelected(
        dataTable?.filter((item) => selectedRowKeys.includes(item.key)),
      );
    } else {
      setFilterRowSelected([]);
    }
  }, [dataTable, selectedRowKeys]);

  const fetchInvoiceTemplates = (search) => {
    setTemplateLoading(true);
    dispatch(getInvoiceTemplates(search))
      .unwrap()
      .then(() => setTemplateLoading(false))
      .catch(() => setTemplateLoading(false));
  };

  const handleTemplateSearch = (value) => {
    if (templateSearchRef.current) {
      clearTimeout(templateSearchRef.current);
    }
    templateSearchRef.current = setTimeout(() => {
      fetchInvoiceTemplates(value);
    }, 300);
  };

  const templateOptions = useMemo(() => {
    const list = Array.isArray(data_invoice_templates)
      ? data_invoice_templates
      : (data_invoice_templates?.result ?? data_invoice_templates?.data ?? []);
    return list.map((item) => ({
      value: item.id ?? item.code ?? item.value,
      label: item.name ?? item.label ?? item.templateName,
    }));
  }, [data_invoice_templates]);

  const accountSegmentOptions = useMemo(
    () =>
      (Array.isArray(data_account_segment_invoice)
        ? data_account_segment_invoice
        : (data_account_segment_invoice?.Data ??
          data_account_segment_invoice?.result ??
          [])
      ).map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [data_account_segment_invoice],
  );

  const costCenterOptions = useMemo(
    () =>
      (Array.isArray(data_cost_center_invoice)
        ? data_cost_center_invoice
        : (data_cost_center_invoice?.data ??
          data_cost_center_invoice?.result ??
          [])
      ).map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [data_cost_center_invoice],
  );

  const accountGroupTypeOptions = useMemo(
    () =>
      (Array.isArray(data_account_group_type_invoice)
        ? data_account_group_type_invoice
        : (data_account_group_type_invoice?.data ??
          data_account_group_type_invoice?.result ??
          [])
      ).map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [data_account_group_type_invoice],
  );

  // FIX: API response structure is { data: [{ ccId: 748, dtoList: [{id, name}, ...] }] }
  // Previously used .dtoList directly on the root object, which was incorrect.
  // Now we extract the data array, then flatten all dtoList entries across all ccId groups.
  const meterReadingOptions = useMemo(() => {
    const rawData = Array.isArray(data_meter_reading_code_invoice)
      ? data_meter_reading_code_invoice
      : (data_meter_reading_code_invoice?.data ??
        data_meter_reading_code_invoice?.result ??
        []);

    // Flatten all dtoList arrays from each ccId entry into one list
    const flatList = rawData.flatMap((entry) =>
      Array.isArray(entry?.dtoList) ? entry.dtoList : [],
    );

    // Deduplicate by id in case multiple cost centers share meter reading codes
    const seen = new Set();
    return flatList
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => ({
        value: item.id,
        label: item.name,
      }));
  }, [data_meter_reading_code_invoice]);

  // fetch base dropdown data when criteria selection changes
  useEffect(() => {
    if (specificCriteria.includes("account_segment")) {
      dispatch(getAccountSegmentInvoice());
    }
    if (specificCriteria.includes("cost_center")) {
      dispatch(getCostCenterInvoice());
    }
    // clear rows that belong to deselected criteria
    setCriteriaRows((prev) =>
      prev.map((row) => ({
        ...row,
        ...(!specificCriteria.includes("account_segment")
          ? { accountSegment: null, accountGroupType: null }
          : {}),
        ...(!specificCriteria.includes("cost_center")
          ? { costCenter: null, meterReadingCode: null }
          : {}),
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specificCriteria]);

  const handleSpecificCriteriaChange = (values) => {
    setSpecificCriteria(values);
    if (values.length === 0) {
      setCriteriaRows([]);
      setEditingKey("");
      setDraftRow({});
      fetchBillingData();
    } else if (criteriaRows.length === 0) {
      const newKey = `row_${Date.now()}`;
      setCriteriaRows([{ key: newKey }]);
      setEditingKey(newKey);
      setDraftRow({ key: newKey });
    }
  };

  const handleDraftChange = (field, value) => {
    const updated = {
      ...draftRow,
      [field]: value,
      ...(field === "accountSegment" ? { accountGroupType: null } : {}),
      ...(field === "costCenter" ? { meterReadingCode: null } : {}),
    };
    setDraftRow(updated);

    if (field === "accountSegment") {
      const allIds = [
        ...criteriaRows
          .filter((r) => r.key !== editingKey)
          .map((r) => r.accountSegment),
        value,
      ].filter(Boolean);
      if (allIds.length > 0) {
        setAccountGroupTypeLoading(true);
        dispatch(getAccountGroupTypeInvoice(allIds))
          .unwrap()
          .finally(() => setAccountGroupTypeLoading(false));
      }
    }
    if (field === "costCenter") {
      const allIds = [
        ...criteriaRows
          .filter((r) => r.key !== editingKey)
          .map((r) => r.costCenter),
        value,
      ].filter(Boolean);
      if (allIds.length > 0) {
        setMeterReadingLoading(true);
        dispatch(getMeterReadingCodeInvoice(allIds))
          .unwrap()
          .finally(() => setMeterReadingLoading(false));
      }
    }
  };

  const addCriteriaRow = () => {
    if (editingKey) return;
    const newKey = `row_${Date.now()}`;
    setCriteriaRows((prev) => [...prev, { key: newKey }]);
    setEditingKey(newKey);
    setDraftRow({ key: newKey });
  };

  const saveCriteriaRow = () => {
    const newRows = criteriaRows.map((r) =>
      r.key === editingKey ? { ...r, ...draftRow } : r,
    );
    setCriteriaRows(newRows);
    setEditingKey("");
    setDraftRow({});
    fetchBillingData(buildCriteriaParams(newRows));
  };

  const cancelCriteriaRow = () => {
    const isNew = !criteriaRows.find(
      (r) => r.key === editingKey && r.accountSegment !== undefined,
    );
    if (isNew) {
      setCriteriaRows((prev) => prev.filter((r) => r.key !== editingKey));
    }
    setEditingKey("");
    setDraftRow({});
  };

  const editCriteriaRow = (record) => {
    if (editingKey) return;
    setEditingKey(record.key);
    setDraftRow({ ...record });
  };

  const deleteCriteriaRow = (key) => {
    const updated = criteriaRows.filter((r) => r.key !== key);
    setCriteriaRows(updated);
    if (editingKey === key) {
      setEditingKey("");
      setDraftRow({});
    }
    const segmentIds = updated.map((r) => r.accountSegment).filter(Boolean);
    const ccIds = updated.map((r) => r.costCenter).filter(Boolean);
    if (segmentIds.length > 0) dispatch(getAccountGroupTypeInvoice(segmentIds));
    if (ccIds.length > 0) dispatch(getMeterReadingCodeInvoice(ccIds));
    fetchBillingData(buildCriteriaParams(updated));
  };

  const getLabelById = (options, id) =>
    options.find((o) => o.value === id)?.label ?? id ?? "-";

  const buildCriteriaColumns = () => {
    const cols = [
      {
        title: "No",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
      },
    ];

    if (specificCriteria.includes("account_segment")) {
      cols.push(
        {
          title: "Account Segment",
          dataIndex: "accountSegment",
          render: (val, record) =>
            record.key === editingKey ? (
              <Select
                showSearch
                allowClear
                optionFilterProp="label"
                placeholder="Select account segment"
                value={draftRow.accountSegment ?? null}
                style={{ width: "100%", minWidth: 200 }}
                options={accountSegmentOptions}
                onChange={(v) => handleDraftChange("accountSegment", v)}
              />
            ) : (
              getLabelById(accountSegmentOptions, val)
            ),
        },
        {
          title: "Account Group Type",
          dataIndex: "accountGroupType",
          render: (val, record) =>
            record.key === editingKey ? (
              <Select
                showSearch
                allowClear
                optionFilterProp="label"
                placeholder="Select account group type"
                value={draftRow.accountGroupType ?? null}
                style={{ width: "100%", minWidth: 200 }}
                options={accountGroupTypeOptions}
                loading={accountGroupTypeLoading}
                disabled={!draftRow.accountSegment}
                onChange={(v) => handleDraftChange("accountGroupType", v)}
              />
            ) : (
              getLabelById(accountGroupTypeOptions, val)
            ),
        },
      );
    }

    if (specificCriteria.includes("cost_center")) {
      cols.push(
        {
          title: "Cost Center",
          dataIndex: "costCenter",
          render: (val, record) =>
            record.key === editingKey ? (
              <Select
                showSearch
                allowClear
                optionFilterProp="label"
                placeholder="Select cost center"
                value={draftRow.costCenter ?? null}
                style={{ width: "100%", minWidth: 200 }}
                options={costCenterOptions}
                onChange={(v) => handleDraftChange("costCenter", v)}
              />
            ) : (
              getLabelById(costCenterOptions, val)
            ),
        },
        {
          title: "Meter Reading Code",
          dataIndex: "meterReadingCode",
          render: (val, record) =>
            record.key === editingKey ? (
              <Select
                showSearch
                allowClear
                optionFilterProp="label"
                placeholder="Select meter reading code"
                value={draftRow.meterReadingCode ?? null}
                style={{ width: "100%", minWidth: 200 }}
                options={meterReadingOptions}
                loading={meterReadingLoading}
                disabled={!draftRow.costCenter}
                onChange={(v) => handleDraftChange("meterReadingCode", v)}
              />
            ) : (
              getLabelById(meterReadingOptions, val)
            ),
        },
      );
    }

    cols.push({
      title: "Action",
      width: 160,
      align: "center",
      render: (_, record) => {
        const isEditing = record.key === editingKey;
        return isEditing ? (
          <Space size={8}>
            <Button type="default" size="small" onClick={cancelCriteriaRow}>
              Cancel
            </Button>
            <Button type="primary" size="small" onClick={saveCriteriaRow}>
              Save
            </Button>
          </Space>
        ) : (
          <Space size={16}>
            <Tooltip title="Edit">
              <span
                className={editingKey ? "cursor-not-allowed" : "cursor-pointer"}
                onClick={
                  !editingKey ? () => editCriteriaRow(record) : undefined
                }
              >
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={editingKey ? "#8D91A0" : "#ACC424"}
                />
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span
                className={editingKey ? "cursor-not-allowed" : "cursor-pointer"}
                onClick={
                  !editingKey ? () => deleteCriteriaRow(record.key) : undefined
                }
              >
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  color={editingKey ? "#8D91A0" : "#D90000"}
                />
              </span>
            </Tooltip>
          </Space>
        );
      },
    });

    return cols;
  };

  const buildCriteriaParams = (rows) => {
    const accountSegments = rows.map((r) => r.accountSegment).filter(Boolean);
    const accountGroupTypes = rows
      .map((r) => r.accountGroupType)
      .filter(Boolean);
    const costCenters = rows.map((r) => r.costCenter).filter(Boolean);
    const meterReadingCodes = rows
      .map((r) => r.meterReadingCode)
      .filter(Boolean);
    return {
      ...(accountSegments.length && {
        accountSegment: accountSegments.join(","),
      }),
      ...(accountGroupTypes.length && {
        accountGroupType: accountGroupTypes.join(","),
      }),
      ...(costCenters.length && { costCenter: costCenters.join(",") }),
      ...(meterReadingCodes.length && {
        meterReadingCode: meterReadingCodes.join(","),
      }),
    };
  };

  const fetchBillingData = (params = {}) => {
    setLoading(true);
    dispatch(getBillingApproval(params))
      .unwrap()
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        message.error("Failed to fetch billing data");
        console.error(err);
      });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);

    setSearch((prev) => {
      if (prev[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prev,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (newPage, newPageSize) => {
    setPage(newPageSize !== pageSize ? 1 : newPage);
    setPageSize(newPageSize);
  };

  const onSort = (_, __, sortObj) => {
    const dataSort =
      sortObj && sortObj.order
        ? `${sortObj.field}~${sortObj.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const computedColumns = useMemo(() => {
    const cols =
      columnsGenerateInvoice(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ) || [];

    return cols.map((c, idx) => ({
      ...c,
      key: c.key ?? c.dataIndex ?? `col_${idx}`,
    }));
  }, [search, page, pageSize, searchedColumn, searchText]);

  const columnDefinitions = useMemo(
    () =>
      computedColumns.map((c) => ({
        key: c.key,
        title: c.title,
        width: c.width,
      })),
    [computedColumns],
  );

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        const savedRows = criteriaRows.filter((r) => r.key !== editingKey);

        const body = {
          remark,
          templateId: invoiceTemplate ?? null,
          type: scheduleType === "Immediate" ? "immediate" : "scheduled",
          scheduleTime:
            scheduleType !== "Immediate" && schedule
              ? schedule.format
                ? schedule.format("YYYY-MM-DD HH:mm")
                : schedule
              : null,
          billCodes: filterRowSelected.map((a) => a.billingCode),
          accountSegment: savedRows
            .map((r) => r.accountSegment)
            .filter(Boolean)
            .map(String),
          meterReadingCodes: savedRows
            .map((r) => r.meterReadingCode)
            .filter(Boolean)
            .map(String),
          costCenterIds: savedRows
            .map((r) => r.costCenter)
            .filter(Boolean)
            .map(String),
          accountGroupTypeIds: savedRows
            .map((r) => r.accountGroupType)
            .filter(Boolean)
            .map(String),
        };

        setLoading(true);
        dispatch(createGenerate(body))
          .unwrap()
          .then((response) => {
            message.success("Invoice generated successfully");
            setLoading(false);
            form.resetFields();
            setSelectedRowKeys([]);
            setFilterRowSelected([]);
            setRemark("");
            navigate(INVOICE_ROUTES.GENERATE_INVOICE_VIEW, {
              state: { refresh: Date.now() },
            });
          })
          .catch((error) => {
            setLoading(false);
            message.error(
              error?.response?.data?.message || "Failed to generate invoice",
            );
            console.error(error);
          });
      })
      .catch((err) => {
        console.error("Validation failed:", err);
      });
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        <CardContainer header="GENERATE INFORMATION">
          <div className="grid grid-cols-3 gap-3">
            <Form.Item label="Download Format">
              <Select value={exportFormat} onChange={setExportFormat} disabled>
                <Option value="PDF">PDF</Option>
                <Option value="Excel">Excel</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Specific Criteria" name="specificCriteria">
              <Select
                mode="multiple"
                allowClear
                showArrow
                placeholder="Select specific criteria"
                value={specificCriteria}
                onChange={handleSpecificCriteriaChange}
                options={[
                  { value: "account_segment", label: "Account Segment" },
                  { value: "cost_center", label: "Cost Center" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Template Invoice" name="invoiceTemplate">
              <Select
                showSearch
                allowClear
                placeholder="Search template invoice"
                filterOption={false}
                value={invoiceTemplate}
                onChange={setInvoiceTemplate}
                onSearch={handleTemplateSearch}
                loading={templateLoading}
                options={templateOptions}
              />
            </Form.Item>
          </div>
        </CardContainer>

        {specificCriteria.length > 0 && (
          <CardContainer header="CRITERIA INFORMATION">
            <div className="mb-3 flex justify-end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addCriteriaRow}
              >
                Create
              </Button>
            </div>
            <Table
              dataSource={criteriaRows}
              columns={buildCriteriaColumns()}
              pagination={false}
              size="small"
              scroll={{ x: "max-content" }}
              rowKey="key"
              locale={{
                emptyText: "No criteria rows. Click Create to begin.",
              }}
            />
          </CardContainer>
        )}

        <CardContainer header="SCHEDULE INFORMATION">
          <Form.Item label="Type">
            <Select value={scheduleType} onChange={setScheduleType} disabled>
              <Option value="Immediate">Immediate</Option>
              <Option value="Schedule">Schedule</Option>
            </Select>
          </Form.Item>

          {scheduleType === "Immediate" ? (
            <ScheduleImmediate remark={remark} setRemark={setRemark} />
          ) : (
            <ScheduleSchedule
              schedule={schedule}
              setSchedule={setSchedule}
              remark={remark}
              setRemark={setRemark}
            />
          )}
        </CardContainer>

        <CardContainer header="Select billing">
          <div className="w-full">
            {selectedRowKeys.length > 0 && (
              <p className="text-sm font-semibold text-blue-600">
                {selectedRowKeys.length}{" "}
                {selectedRowKeys.length === 1 ? "row" : "rows"} selected
              </p>
            )}
            <TableRBI
              idTable="generate-invoice"
              dataSource={dataTable}
              totalData={data_billing?.length || 0}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              columns={computedColumns}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 7500 }}
              rowSelection={rowSelection}
              loading={loading}
              handleDownload={() => {}}
            />
          </div>
        </CardContainer>

        <div className="bg-white rounded-md my-0 p-3 flex justify-between gap-4">
          <Button type="default" onClick={() => window.history.back()}>
            Back
          </Button>

          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </>
  );
};

export default GenerateInvoicePage;
