import moment from "moment";
import { Badge } from "antd";
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
    key: "remarks",
    title: "REMARKS",
    dataIndex: "REMARKS",
    width: 200,
    render: (text, record) => text || record.remarks || "-",
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
    width: 220,
    render: (text, record) => {
      const body = text || record.taskBody;
      if (!body) return "-";
      try {
        const parsed = typeof body === "string" ? JSON.parse(body) : body;
        if (typeof parsed !== "object" || parsed === null) return String(body);
        return (
          <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12 }}>
            {Object.entries(parsed).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {String(v ?? "-")}
              </li>
            ))}
          </ul>
        );
      } catch {
        return body;
      }
    },
  },
];
