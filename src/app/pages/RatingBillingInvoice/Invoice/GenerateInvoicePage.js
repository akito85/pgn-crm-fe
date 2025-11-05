// GenerateInvoicePage.js
import React, { useState, useRef, useEffect } from "react";
import { Form, Select, Input, DatePicker, Button, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { columnsGenerateInvoice } from "./TableGenerateInvoice";
import CardContainer from "../../../../components/CardContainer";
import {
  getBillingApproval,
  createGenerate,
} from "../../../../redux/slices/rating_billing_invoice/invoice";

const { TextArea } = Input;

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
  const { data_billing } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  // State untuk form
  const [exportFormat, setExportFormat] = useState("PDF");
  const [scheduleType, setScheduleType] = useState("Immediate");
  const [schedule, setSchedule] = useState(null);
  const [remark, setRemark] = useState("");

  // State untuk table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterRowSelected, setFilterRowSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data billing saat component mount
  useEffect(() => {
    fetchBillingData();
  }, []);

  // Update dataTable saat data_billing berubah
  useEffect(() => {
    if (data_billing?.data) {
      setDataTable(
        data_billing.data.map((item, index) => {
          return {
            key: index + 1,
            ...item,
          };
        })
      );
    }
  }, [data_billing]);

  // Update filterRowSelected saat selectedRowKeys berubah
  useEffect(() => {
    if (selectedRowKeys?.length !== 0) {
      setFilterRowSelected(
        dataTable?.filter((item) => selectedRowKeys?.includes(item?.key))
      );
    } else {
      setFilterRowSelected([]);
    }
  }, [dataTable, selectedRowKeys]);

  // Fetch Billing Data
  const fetchBillingData = () => {
    setLoading(true);
    dispatch(getBillingApproval())
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error("Failed to fetch billing data");
        console.error(error);
      });
  };

  // Handle Search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Row Selection
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Handle Download
  const handleDownload = () => {
    // Implement download logic if needed
  };

  // Handle Submit
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (selectedRowKeys.length === 0) {
          message.warning("Please select at least one billing");
          return;
        }

        const body = {
          invoiceNumbers: filterRowSelected.map((a) => a.invoiceNumber),
          remark: remark,
        };

        setLoading(true);
        dispatch(createGenerate(body))
          .unwrap()
          .then(() => {
            message.success("Invoice generated successfully");
            setLoading(false);
            // Reset form
            form.resetFields();
            setSelectedRowKeys([]);
            setFilterRowSelected([]);
            setRemark("");
            // Refresh data
            fetchBillingData();
          })
          .catch((error) => {
            setLoading(false);
            if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                error?.toString();
              message.error(errorMessage);
            } else {
              message.error("Failed to generate invoice");
            }
            console.error(error);
          });
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  return (
    <LayoutMenu>
      <Form layout="vertical" form={form}>
        <CardContainer header="GENERATE INFORMATION">
          <Form.Item label="Export Format" required>
            <Select disabled value={exportFormat} onChange={setExportFormat}>
              <Select.Option value="PDF">PDF</Select.Option>
              <Select.Option value="Excel">Excel</Select.Option>
            </Select>
          </Form.Item>
        </CardContainer>

        <CardContainer header="SCHEDULE INFORMATION">
          <Form.Item label="Type" required>
            <Select disabled value={scheduleType} onChange={setScheduleType}>
              <Select.Option value="Immediate">Immediate</Select.Option>
              <Select.Option value="Schedule">Schedule</Select.Option>
            </Select>
          </Form.Item>

          {scheduleType === "Immediate" && (
            <ScheduleImmediate remark={remark} setRemark={setRemark} />
          )}
          {scheduleType === "Schedule" && (
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
            <TablePaginationNew
              type="FE"
              dataSource={dataTable}
              totalData={data_billing?.page?.totalElements || dataTable.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              columns={columnsGenerateInvoice(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 11000 }}
              rowSelection={rowSelection}
              loading={loading}
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
