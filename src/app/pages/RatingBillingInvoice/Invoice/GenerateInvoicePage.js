// GenerateInvoicePage.js
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Input, DatePicker, Button } from "antd";
import moment from "moment";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TableRBI from "../../../../components/TableRBI";
import { columnsGenerateInvoice } from "./TableGenerateInvoice";
import CardContainer from "../../../../components/CardContainer";
import { getBillingListApprovedStatus } from "../../../../redux/slices/rating_billing_invoice/billing";

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
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const { data_list_billing_approved, loading } = useSelector(
    (state) => state.billing
  );

  // State untuk form
  const [exportFormat, setExportFormat] = useState("PDF");
  const [scheduleType, setScheduleType] = useState("Immediate");
  const [schedule, setSchedule] = useState(null);
  const [remark, setRemark] = useState("");

  // State untuk table (sama seperti ModalGenerateInvoice)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Setup data table saat component mount
  useEffect(() => {
    dispatch(getBillingListApprovedStatus({ page: 1, size: 10 }));

    // Add custom CSS for Tag close button
    const style = document.createElement("style");
    style.innerHTML = `
      .tag-custom-close .ant-tag-close-icon {
        color: white !important;
      }
      .tag-custom-close .ant-tag-close-icon:hover {
        color: rgba(255, 255, 255, 0.85) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [dispatch]);

  // Update data table when API data changes
  useEffect(() => {
    if (data_list_billing_approved && data_list_billing_approved.content) {
      console.log("Billing data from API:", data_list_billing_approved.content);
      setDataTable(
        data_list_billing_approved.content.map((item, index) => ({
          key: index + 1,
          ...item,
        }))
      );
    }
  }, [data_list_billing_approved]);

  // Handle Search - sama seperti ModalGenerateInvoice
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

  // Handle Change Page - sama seperti ModalGenerateInvoice
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table - sama seperti ModalGenerateInvoice
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Row Selection - sama seperti ModalGenerateInvoice
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

  return (
    <LayoutMenu>
      <Form layout="vertical" form={form}>
        <CardContainer header="GENERATE INFORMATION">
          <Form.Item label="Export Format" required>
            <Select value={exportFormat} onChange={setExportFormat}>
              <Select.Option value="PDF">PDF</Select.Option>
              <Select.Option value="Excel">Excel</Select.Option>
            </Select>
          </Form.Item>
        </CardContainer>

        <CardContainer header="SCHEDULE INFORMATION">
          <Form.Item label="Type" required>
            <Select value={scheduleType} onChange={setScheduleType}>
              <Select.Option value="Immediate">Immediate</Select.Option>
              <Select.Option value="Schedule">Schedule</Select.Option>
              <Select.Option value="Recurring">Recurring</Select.Option>
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
            <TableRBI
              dataSource={dataTable}
              totalData={data_list_billing_approved?.totalElements || 0}
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
              handleDownload={handleDownload}
              loading={loading}
            />
          </div>
        </CardContainer>

        <div className="my-6 pb-5 flex justify-between gap-4">
          <Button type="default" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </LayoutMenu>
  );
};

export default GenerateInvoicePage;
