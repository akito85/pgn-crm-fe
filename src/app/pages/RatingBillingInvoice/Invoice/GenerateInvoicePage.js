// GenerateInvoicePage.js
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Form, Select, Input, DatePicker, Button, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TableRBI from "../../../../components/TableRBI";
import { columnsGenerateInvoice } from "./TableGenerateInvoice";
import CardContainer from "../../../../components/CardContainer";
import {
  getBillingApproval,
  createGenerate,
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
  const { data_billing } = useSelector((s) => s.invoice);
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  // form state
  const [exportFormat, setExportFormat] = useState("PDF");
  const [scheduleType, setScheduleType] = useState("Immediate");
  const [schedule, setSchedule] = useState(null);
  const [remark, setRemark] = useState("");

  // table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
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
        JSON.stringify(fixedColumns)
      );
    } catch (e) {
      // ignore
    }
  }, [fixedColumns]);

  // fetch billing data
  useEffect(() => {
    fetchBillingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data_billing && Array.isArray(data_billing)) {
      setDataTable(
        data_billing?.map((item, index) => ({
          // prefer stable id if server provides it
          key: item.id ?? item.invoiceNumber ?? index + 1,
          ...item,
        }))
      );
    } else {
      setDataTable([]);
    }
  }, [data_billing]);

  useEffect(() => {
    if (selectedRowKeys?.length !== 0) {
      setFilterRowSelected(
        dataTable?.filter((item) => selectedRowKeys.includes(item.key))
      );
    } else {
      setFilterRowSelected([]);
    }
  }, [dataTable, selectedRowKeys]);

  const fetchBillingData = () => {
    setLoading(true);
    dispatch(getBillingApproval())
      .unwrap()
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        message.error("Failed to fetch billing data");
        console.error(err);
      });
  };

  // search handler used by columnsGenerateInvoice
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

  // ====================================================
  // Build columns once and ensure stable unique key (like GenerateProformaInvoicePage)
  // ====================================================
  const computedColumns = useMemo(() => {
    const cols =
      columnsGenerateInvoice(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
    [computedColumns]
  );

  // Apply visibility/fixed logic same as proforma — TableRBI might handle visibility internally,
  // but we must pass computedColumns & fixedColumns so it can apply fixed props.
  // If TableRBI expects columns already filtered by visibility, you can adapt here.

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        if (selectedRowKeys.length === 0) {
          message.warning("Please select at least one billing");
          return;
        }

        const body = {
          invoiceNumbers: filterRowSelected.map((a) => a.invoiceNumber),
          remark,
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

            // Navigate to view page
            navigate(INVOICE_ROUTES.GENERATE_INVOICE_VIEW);
          })
          .catch((error) => {
            setLoading(false);
            message.error(
              error?.response?.data?.message || "Failed to generate invoice"
            );
            console.error(error);
          });
      })
      .catch((err) => {
        console.error("Validation failed:", err);
      });
  };

  return (
    <LayoutMenu>
      <Form layout="vertical" form={form}>
        <CardContainer header="GENERATE INFORMATION">
          <Form.Item label="Export Format">
            <Select value={exportFormat} onChange={setExportFormat} disabled>
              <Option value="PDF">PDF</Option>
              <Option value="Excel">Excel</Option>
            </Select>
          </Form.Item>
        </CardContainer>

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

        {/* ===================== TABLE ===================== */}
        <CardContainer header="Select billing">
          <div className="w-full">
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

        <div className="my-6 pb-5 flex justify-between gap-4">
          <Button type="default" onClick={() => window.history.back()}>
            Back
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={selectedRowKeys.length === 0}
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </LayoutMenu>
  );
};

export default GenerateInvoicePage;
