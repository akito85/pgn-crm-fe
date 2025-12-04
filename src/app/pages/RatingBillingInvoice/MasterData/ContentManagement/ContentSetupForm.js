import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../utils";

const { TextArea } = Input;
const { Option } = Select;

const ContentSetupForm = ({ form, type, status, statusApproval }) => {
  // State untuk criteria tags
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [startDate, setStartDate] = useState();

  // TODO: Replace with actual Redux selector
  // const { data_format, data_category, data_media, data_criteria, loading } = useSelector((state) => state.content_setup);

  // Mock data - TODO: Replace dengan data dari API
  const formatOptions = [
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
    { label: "WhatsApp", value: "whatsapp" },
  ];

  const categoryOptions = [
    { label: "Invoice", value: "invoice" },
    { label: "Payment", value: "payment" },
    { label: "Reminder", value: "reminder" },
  ];

  const mediaOptions = [
    { label: "Email", value: "email" },
    { label: "Mobile", value: "mobile" },
    { label: "Push Notification", value: "push" },
  ];

  const criteriaOptions = [
    { label: "Customer Segment", value: "customer_segment" },
    { label: "Account Group Type", value: "account_group_type" },
    { label: "Service Type", value: "service_type" },
    { label: "Budget Type", value: "budget_type" },
  ];

  // TODO: Implement useEffect untuk fetch data dari API
  // useEffect(() => {
  //   dispatch(getFormatOptions());
  //   dispatch(getCategoryOptions());
  //   dispatch(getMediaOptions());
  //   dispatch(getCriteriaOptions());
  // }, [dispatch]);

  // Handle criteria selection
  const handleCriteriaChange = (values) => {
    setCriteriaValues(values);
  };

  // Handle remove criteria tag
  const handleRemoveCriteria = (removedValue) => {
    const newValues = criteriaValues.filter((value) => value !== removedValue);
    setCriteriaValues(newValues);
    form.setFieldsValue({ criteria: newValues });
  };

  // Handle start date change
  const handleStartDate = (value) => {
    setStartDate(value);
    return value;
  };

  // Disable dates before start date for end date picker
  const disabledEndDate = (current) => {
    if (!startDate) return false;
    return current && current < moment(startDate).startOf("day");
  };

  return (
    <BaseContainer header={"Content Setup"}>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        {/* Name Field */}
        <Form.Item
          label={
            <span>
              Name
            </span>
          }
          name="name"
          rules={[
            {
              required: true,
              message: "Please input name!",
            },
          ]}
        >
          <Input 
            placeholder="Email krtm Inv RTPK" 
            disabled={status === "view" || statusApproval === "view"}
          />
        </Form.Item>

        {/* Format Field */}
        <Form.Item
          label={
            <span>
              Format
            </span>
          }
          name="format"
          rules={[
            {
              required: true,
              message: "Please select format!",
            },
          ]}
        >
          <Select
            placeholder="Email"
            disabled={status === "view" || statusApproval === "view"}
            showSearch
            optionFilterProp="children"
          >
            {formatOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Category Field */}
        <Form.Item
          label={
            <span>
              Category <span className="text-red-500">*</span>
            </span>
          }
          name="category"
          rules={[
            {
              required: true,
              message: "Please select category!",
            },
          ]}
        >
          <Select
            placeholder="Invoice"
            disabled={status === "view" || statusApproval === "view"}
            showSearch
            optionFilterProp="children"
          >
            {categoryOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Media Field */}
        <Form.Item
          label={
            <span>
              Media <span className="text-red-500">*</span>
            </span>
          }
          name="media"
          rules={[
            {
              required: true,
              message: "Please select media!",
            },
          ]}
        >
          <Select
            placeholder="Email"
            disabled={status === "view" || statusApproval === "view"}
            showSearch
            optionFilterProp="children"
          >
            {mediaOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Start Date Field */}
        <Form.Item
          label={
            <span>
              Start Date <span className="text-red-500">*</span>
            </span>
          }
          name="startDate"
          rules={[
            {
              required: true,
              message: "Please select start date!",
            },
          ]}
        >
          <DatePicker
            format={dateFormatting.dateFormal}
            placeholder="21 Jan 2022"
            className="w-full"
            disabled={status === "view" || statusApproval === "view"}
            onChange={handleStartDate}
          />
        </Form.Item>

        {/* End Date Field */}
        <Form.Item
          label="End Date"
          name="endDate"
        >
          <DatePicker
            format={dateFormatting.dateFormal}
            placeholder="21 Jan 2028"
            className="w-full"
            disabled={status === "view" || statusApproval === "view"}
            disabledDate={disabledEndDate}
          />
        </Form.Item>
      </div>

      {/* Criteria Field - Full Width */}
      <Form.Item
        label={
          <span>
            Criteria <span className="text-red-500">*</span>
          </span>
        }
        name="criteria"
        rules={[
          {
            required: true,
            message: "Please select at least one criteria!",
          },
        ]}
        className="mt-4"
      >
        <Select
          mode="multiple"
          placeholder="Select criteria"
          disabled={status === "view" || statusApproval === "view"}
          onChange={handleCriteriaChange}
          value={criteriaValues}
          showSearch
          optionFilterProp="children"
          tagRender={() => null} // Hide default tags, we'll render custom ones below
        >
          {criteriaOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Custom Criteria Tags Display */}
      {criteriaValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {criteriaValues.map((value) => {
            const criteria = criteriaOptions.find((opt) => opt.value === value);
            return (
              <Tag
                key={value}
                closable={!(status === "view" || statusApproval === "view")}
                onClose={() => handleRemoveCriteria(value)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 border-blue-300 rounded"
                closeIcon={<CloseOutlined className="text-blue-700" />}
              >
                {criteria?.label}
              </Tag>
            );
          })}
        </div>
      )}

      {/* Description Field - Full Width */}
      <Form.Item
        label="Description"
        name="description"
        className="mt-4"
      >
        <TextArea
          rows={4}
          placeholder="Billing Cycle dari 1 Januari hingga 31 Januari"
          maxLength={255}
          showCount
          disabled={status === "view" || statusApproval === "view"}
        />
      </Form.Item>

      {/* Character count info */}
      <div className="text-xs text-gray-500 -mt-2">
        You have 0 of 255 characters remaining
      </div>
    </BaseContainer>
  );
};

export default ContentSetupForm;