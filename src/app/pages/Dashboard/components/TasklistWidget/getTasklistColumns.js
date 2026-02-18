import moment from "moment";
import { Badge, Button, Modal } from "antd";
import { dateFormatting, toTitleCase } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";

export const getTasklistColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 40,
    render: (_, __, index) => index + 1,
  },
  {
    key: "taskSubject",
    title: "TASK SUBJECT",
    dataIndex: "TASK_SUBJECT",
    width: 250,
    sorter: true,
    filteredValue: [search?.taskSubject] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taskSubject",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => text || record.taskSubject || "-",
  },
  {
    key: "taskType",
    title: "TASK TYPE",
    dataIndex: "TASK_TYPE",
    width: 150,
    sorter: true,
    filteredValue: [search?.taskType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taskType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "select",
      [
        { value: "APPROVAL_REQUEST", label: "Approval Request" },
        { value: "REVIEW", label: "Review" },
        { value: "ACKNOWLEDGE", label: "Acknowledge" },
        { value: "ACTION_REQUIRED", label: "Action Required" },
      ]
    ),
    render: (text, record) => {
      const type = text || record.taskType || "-";
      const colorMap = {
        APPROVAL_REQUEST: "blue",
        REVIEW: "cyan",
        ACKNOWLEDGE: "green",
        ACTION_REQUIRED: "orange",
      };
      const labelMap = {
        APPROVAL_REQUEST: "Approval Request",
        REVIEW: "Review",
        ACKNOWLEDGE: "Acknowledge",
        ACTION_REQUIRED: "Action Required",
      };
      return <Badge color={colorMap[type] || "default"} text={labelMap[type] || type} />;
    },
  },
  {
    key: "taskStatus",
    title: "STATUS",
    dataIndex: "TASK_STATUS",
    width: 120,
    sorter: true,
    align: "center",
    filteredValue: [search?.taskStatus] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taskStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "select",
      [
        { value: "PENDING", label: "Pending" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
        { value: "REJECTED", label: "Rejected" },
        { value: "CANCELLED", label: "Cancelled" },
      ]
    ),
    render: (text, record) => {
      const status = text || record.taskStatus || "-";
      return (
        <div className="flex justify-center">
          <StatusComponent colour={status}>
            {toTitleCase(status)}
          </StatusComponent>
        </div>
      );
    },
  },
  {
    key: "priority",
    title: "PRIORITY",
    dataIndex: "PRIORITY",
    width: 100,
    sorter: true,
    align: "center",
    filteredValue: [search?.priority] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priority",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "select",
      [
        { value: "1", label: "Low" },
        { value: "2", label: "Normal" },
        { value: "3", label: "High" },
        { value: "4", label: "Urgent" },
        { value: "5", label: "Critical" },
      ]
    ),
    render: (text, record) => {
      const priority = text || record.priority;
      const colorMap = { 1: "green", 2: "blue", 3: "orange", 4: "red", 5: "red" };
      const labelMap = { 1: "Low", 2: "Normal", 3: "High", 4: "Urgent", 5: "Critical" };
      return <Badge color={colorMap[priority] || "default"} text={labelMap[priority] || "-"} />;
    },
  },
  {
    key: "dueDate",
    title: "DUE DATE",
    dataIndex: "DUE_DATE",
    width: 140,
    align: "center",
    sorter: true,
    filteredValue: [search?.dueDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "dueDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text, record) => {
      const date = text || record.dueDate;
      return date ? moment(date).format(dateFormatting.date) : "-";
    },
  },
  {
    key: "module",
    title: "MODULE",
    dataIndex: "MODULE",
    width: 180,
    sorter: true,
    filteredValue: [search?.module] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "module",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => toTitleCase(text || record.module || "-"),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "CATEGORY",
    width: 180,
    sorter: true,
    filteredValue: [search?.category] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => toTitleCase(text || record.category || "-"),
  },
  {
    key: "taskSender",
    title: "SENDER",
    dataIndex: "TASK_SENDER",
    width: 200,
    filteredValue: [search?.taskSender] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taskSender",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => text || record.taskSender || "-",
  },
  {
    key: "taskReceiver",
    title: "RECEIVER",
    dataIndex: "TASK_RECEIVER",
    width: 200,
    filteredValue: [search?.taskReceiver] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taskReceiver",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => text || record.taskReceiver || "-",
  },
  {
    key: "createdAt",
    title: "CREATED AT",
    dataIndex: "CREATED_AT",
    width: 160,
    sorter: true,
    align: "center",
    filteredValue: [search?.createdAt] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "createdAt",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime"
    ),
    render: (text, record) => {
      const date = text || record.createdAt;
      return date ? moment(date).format(dateFormatting.dateTime) : "-";
    },
  },
  {
    key: "updatedAt",
    title: "UPDATED AT",
    dataIndex: "UPDATED_AT",
    width: 160,
    sorter: true,
    align: "center",
    filteredValue: [search?.updatedAt] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "updatedAt",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime"
    ),
    render: (text, record) => {
      const date = text || record.updatedAt;
      return date ? moment(date).format(dateFormatting.dateTime) : "-";
    },
  },
  {
    key: "taskBody",
    title: "ADDITIONAL INFO",
    dataIndex: "TASK_BODY",
    width: 100,
    align: "center",
    render: (text, record) => {
      const body = text || record.taskBody;
      if (!body) return "-";

      const handleShowDetails = () => {
        try {
          const parsed = typeof body === "string" ? JSON.parse(body) : body;
          Modal.info({
            title: "Task Details",
            width: 600,
            content: <pre>{JSON.stringify(parsed, null, 2)}</pre>,
          });
        } catch (e) {
          Modal.error({
            title: "Error",
            content: "Unable to parse task details",
          });
        }
      };

      return (
        <Button size="small" onClick={handleShowDetails}>
          View
        </Button>
      );
    },
  },
];
