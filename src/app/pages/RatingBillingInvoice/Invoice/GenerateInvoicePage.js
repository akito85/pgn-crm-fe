// GenerateInvoicePage.js

import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  Radio,
  InputNumber,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import SelectComponent from "../../../../components/SelectComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BaseContainer from "../../../../components/BaseContainer";
import TablePagination from "../../../../components/TablePagination";
import { columnsGenerateInvoice } from "./TableGenerateInvoice";

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

const ScheduleRecurring = ({ remark, setRemark }) => {
  const [recurringUnit, setRecurringUnit] = useState("Seconds");
  const [recurringPattern, setRecurringPattern] = useState("every");
  const [everyValue, setEveryValue] = useState(1);
  const [startAt, setStartAt] = useState(0);
  const [betweenStart, setBetweenStart] = useState(0);
  const [betweenEnd, setBetweenEnd] = useState(0);
  const [specificValues, setSpecificValues] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const unitLabels = {
    Seconds: { singular: "second", plural: "seconds" },
    Minutes: { singular: "minute", plural: "minutes" },
    Hours: { singular: "hour", plural: "hours" },
    Day: { singular: "day", plural: "days" },
    Month: { singular: "month", plural: "months" },
    Year: { singular: "year", plural: "years" },
  };

  const daysOfWeek = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" },
  ];

  const monthsOfYear = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleAddSpecificValue = () => {
    if (inputValue && !specificValues.includes(parseInt(inputValue))) {
      setSpecificValues([...specificValues, parseInt(inputValue)]);
      setInputValue("");
    }
  };

  const handleRemoveSpecificValue = (value) => {
    setSpecificValues(specificValues.filter((v) => v !== value));
  };

  const handleDayToggle = (dayValue) => {
    if (selectedDays.includes(dayValue)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayValue));
    } else {
      setSelectedDays([...selectedDays, dayValue]);
    }
  };

  const handleMonthToggle = (monthValue) => {
    if (selectedMonths.includes(monthValue)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== monthValue));
    } else {
      setSelectedMonths([...selectedMonths, monthValue]);
    }
  };

  const getCronPreview = () => {
    const unitMap = {
      Seconds: 0,
      Minutes: 1,
      Day: 2,
      Hours: 3,
      Month: 4,
      Year: 5,
    };

    let cronParts = ["***", "***", "***", "***", "***", "***"];
    const index = unitMap[recurringUnit];

    if (recurringUnit === "Year") {
      // For Year, only show "Every year"
      cronParts[5] = "*";
    } else if (recurringUnit === "Day") {
      // For Day, handle days of week
      if (recurringPattern === "every") {
        cronParts[index] = "*";
      } else if (recurringPattern === "specific") {
        cronParts[index] =
          selectedDays.sort((a, b) => a - b).join(",") || "***";
      } else if (recurringPattern === "between") {
        cronParts[index] = `${betweenStart}-${betweenEnd}`;
      }
    } else if (recurringUnit === "Month") {
      // For Month, handle months
      if (recurringPattern === "every") {
        cronParts[index] = "*";
      } else if (recurringPattern === "specific") {
        cronParts[index] =
          selectedMonths.sort((a, b) => a - b).join(",") || "***";
      } else if (recurringPattern === "between") {
        cronParts[index] = `${betweenStart}-${betweenEnd}`;
      }
    } else {
      // For Seconds, Minutes, Hours
      if (recurringPattern === "every") {
        cronParts[index] = "*";
      } else if (recurringPattern === "everyStarting") {
        cronParts[index] = `*/${everyValue}`;
      } else if (recurringPattern === "between") {
        cronParts[index] = `${betweenStart}-${betweenEnd}`;
      } else if (recurringPattern === "specific") {
        cronParts[index] =
          specificValues.sort((a, b) => a - b).join(",") || "***";
      }
    }

    return cronParts;
  };

  const cronPreview = getCronPreview();
  const cronLabels = ["SECONDS", "MINUTES", "HOURS", "DAY", "MONTH", "YEAR"];

  return (
    <>
      {/* Unit Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-6 gap-3">
          {["Seconds", "Minutes", "Hours", "Day", "Month", "Year"].map(
            (unit) => (
              <Button
                key={unit}
                type={recurringUnit === unit ? "primary" : "default"}
                onClick={() => setRecurringUnit(unit)}
                className="w-full"
                size="large"
              >
                {unit}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Pattern Selection */}
      <div className="mb-6">
        <Radio.Group
          value={recurringPattern}
          onChange={(e) => setRecurringPattern(e.target.value)}
          className="w-full"
        >
          <div className="space-y-4">
            {/* Year - Only Every Year */}
            {recurringUnit === "Year" && (
              <div className="flex items-center gap-2">
                <Radio value="every" checked>
                  Every year
                </Radio>
              </div>
            )}

            {/* Day - Special Options */}
            {recurringUnit === "Day" && (
              <>
                {/* Every Day */}
                <div className="flex items-center gap-2">
                  <Radio value="every">Every day (Monday - Sunday)</Radio>
                </div>

                {/* Specific Days */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Radio value="specific">Specific days</Radio>
                  </div>
                  {recurringPattern === "specific" && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {daysOfWeek.map((day) => (
                          <Button
                            key={day.value}
                            type={
                              selectedDays.includes(day.value)
                                ? "primary"
                                : "default"
                            }
                            onClick={() => handleDayToggle(day.value)}
                            className="w-full"
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Between Days */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Radio value="between">Between</Radio>
                  <Select
                    value={betweenStart}
                    onChange={setBetweenStart}
                    disabled={recurringPattern !== "between"}
                    className="w-32"
                  >
                    {daysOfWeek.map((day) => (
                      <Select.Option key={day.value} value={day.value}>
                        {day.label}
                      </Select.Option>
                    ))}
                  </Select>
                  <span>and</span>
                  <Select
                    value={betweenEnd}
                    onChange={setBetweenEnd}
                    disabled={recurringPattern !== "between"}
                    className="w-32"
                  >
                    {daysOfWeek.map((day) => (
                      <Select.Option key={day.value} value={day.value}>
                        {day.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </>
            )}

            {/* Month - Special Options */}
            {recurringUnit === "Month" && (
              <>
                {/* Every Month */}
                <div className="flex items-center gap-2">
                  <Radio value="every">Every month (January - December)</Radio>
                </div>

                {/* Specific Months */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Radio value="specific">Specific months</Radio>
                  </div>
                  {recurringPattern === "specific" && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {monthsOfYear.map((month) => (
                          <Button
                            key={month.value}
                            type={
                              selectedMonths.includes(month.value)
                                ? "primary"
                                : "default"
                            }
                            onClick={() => handleMonthToggle(month.value)}
                            className="w-full"
                          >
                            {month.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Between Months */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Radio value="between">Between</Radio>
                  <Select
                    value={betweenStart}
                    onChange={setBetweenStart}
                    disabled={recurringPattern !== "between"}
                    className="w-32"
                  >
                    {monthsOfYear.map((month) => (
                      <Select.Option key={month.value} value={month.value}>
                        {month.label}
                      </Select.Option>
                    ))}
                  </Select>
                  <span>and</span>
                  <Select
                    value={betweenEnd}
                    onChange={setBetweenEnd}
                    disabled={recurringPattern !== "between"}
                    className="w-32"
                  >
                    {monthsOfYear.map((month) => (
                      <Select.Option key={month.value} value={month.value}>
                        {month.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </>
            )}

            {/* Seconds, Minutes, Hours - Standard Options */}
            {!["Day", "Month", "Year"].includes(recurringUnit) && (
              <>
                {/* Every */}
                <div className="flex items-center gap-2">
                  <Radio value="every">
                    Every {unitLabels[recurringUnit].singular}
                  </Radio>
                </div>

                {/* Every X starting at */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Radio value="everyStarting">Every</Radio>
                  <InputNumber
                    min={1}
                    max={59}
                    value={everyValue}
                    onChange={setEveryValue}
                    disabled={recurringPattern !== "everyStarting"}
                    className="w-20"
                  />
                  <span>
                    {everyValue === 1
                      ? unitLabels[recurringUnit].singular
                      : unitLabels[recurringUnit].plural}{" "}
                    starting at {unitLabels[recurringUnit].singular}
                  </span>
                  <InputNumber
                    min={0}
                    max={59}
                    value={startAt}
                    onChange={setStartAt}
                    disabled={recurringPattern !== "everyStarting"}
                    className="w-20"
                  />
                </div>

                {/* Between */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Radio value="between">Between</Radio>
                  <InputNumber
                    min={0}
                    max={59}
                    value={betweenStart}
                    onChange={setBetweenStart}
                    disabled={recurringPattern !== "between"}
                    className="w-20"
                  />
                  <span>{unitLabels[recurringUnit].plural} and</span>
                  <InputNumber
                    min={0}
                    max={59}
                    value={betweenEnd}
                    onChange={setBetweenEnd}
                    disabled={recurringPattern !== "between"}
                    className="w-20"
                  />
                  <span>{unitLabels[recurringUnit].plural}</span>
                </div>

                {/* Specific */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Radio value="specific">
                      Specific {unitLabels[recurringUnit].plural}
                    </Radio>
                  </div>
                  {recurringPattern === "specific" && (
                    <div className="ml-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <InputNumber
                          min={0}
                          max={59}
                          type="number"
                          value={inputValue}
                          onChange={setInputValue}
                          onPressEnter={handleAddSpecificValue}
                          placeholder={`Enter ${unitLabels[recurringUnit].singular}`}
                          className="w-full"
                          style={{ paddingRight: "20px" }}
                        />
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={handleAddSpecificValue}
                        >
                          Add
                        </Button>
                      </div>
                      {specificValues.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                          {specificValues.map((value) => (
                            <Tag
                              key={value}
                              closable
                              onClose={() => handleRemoveSpecificValue(value)}
                              className="px-3 py-1 text-base tag-custom-close"
                              style={{
                                backgroundColor: "#0175BF",
                                color: "white",
                                borderColor: "#0175BF",
                              }}
                            >
                              {value}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Radio.Group>
      </div>

      {/* Cron Preview */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-3 font-medium">
          This schedule will run at:
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full border-collapse min-w-full">
            <thead>
              <tr className="bg-primary text-white">
                {cronLabels.map((label) => (
                  <th
                    key={label}
                    className="border border-blue-700 px-6 py-3 text-left font-semibold text-sm whitespace-nowrap"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {cronPreview.map((value, index) => (
                  <td
                    key={index}
                    className="border border-gray-200 px-6 py-4 bg-white text-base font-mono whitespace-nowrap"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Remark */}
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
};

const GenerateInvoicePage = () => {
  const [form] = Form.useForm();
  const searchInput = useRef(null);

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

  // Dummy data - ganti dengan data real dari API atau props
  const dummyData = [
    {
      invoiceNumber: "INV001",
      billingCode: "BIL07912",
      accountNumber: "ACN001",
      customerNumber: "CST001",
      customerName: "John",
      type: "Gas",
    },
    {
      invoiceNumber: "INV002",
      billingCode: "BIL07913",
      accountNumber: "ACN002",
      customerNumber: "CST002",
      customerName: "Mana",
      type: "Non-Gas",
    },
    {
      invoiceNumber: "INV003",
      billingCode: "BIL07914",
      accountNumber: "ACN003",
      customerNumber: "CST003",
      customerName: "Lina",
      type: "Gas",
    },
  ];

  // Setup data table saat component mount
  useEffect(() => {
    setDataTable(
      dummyData.map((item, index) => ({
        key: index + 1,
        ...item,
      }))
    );

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
  }, []);

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
        <BaseContainer header="GENERATE INFORMATION">
          <Form.Item label="Export Format" required>
            <Select value={exportFormat} onChange={setExportFormat}>
              <Select.Option value="PDF">PDF</Select.Option>
              <Select.Option value="Excel">Excel</Select.Option>
            </Select>
          </Form.Item>
        </BaseContainer>

        <BaseContainer header="SCHEDULE INFORMATION">
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
          {scheduleType === "Recurring" && (
            <ScheduleRecurring remark={remark} setRemark={setRemark} />
          )}
        </BaseContainer>

        <BaseContainer header="Select billing">
          <div className="w-full">
            <TablePagination
              dataSource={dataTable}
              totalData={dataTable.length}
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
            />
          </div>
        </BaseContainer>

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
