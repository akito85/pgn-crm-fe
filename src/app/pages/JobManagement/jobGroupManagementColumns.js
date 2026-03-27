import React from "react";
import { getJobManagementColumns } from "./jobManagementColumns";

/**
 * Parent row columns for JobGroup List
 * Displays: NO, Name, Code, Access Group, Description
 */
export const getJobGroupManagementColumns = (accessGroupsMap = {}) => [
  {
    title: "NO",
    key: "no",
    width: 60,
    align: "center",
    render: (_, __, index) => index + 1,
    // fixed: "left"
  },
  {
    title: "JOB GROUP NAME",
    dataIndex: "name",
    key: "name",
    align: "left",
    // fixed: "left"
  },
  {
    title: "JOB GROUP CODE",
    dataIndex: "code",
    key: "code",
    align: "left",
  },
  {
    title: "ACCESS GROUP",
    dataIndex: "accessGroup",
    key: "accessGroup",
    align: "left",
    render: (val) => {
      if (!val) return "—";
      const numId = Number(val);
      if (!isNaN(numId) && accessGroupsMap[numId]) return accessGroupsMap[numId];
      return val;
    },
  },
  {
    title: "DESCRIPTION",
    dataIndex: "desc",
    key: "desc",
    align: "left",
    fill: true,
    ellipsis: true,
  },
  {
    title: "STATUS",
    dataIndex: "isActive",
    key: "isActive",
    align: "center",
    width: 100,
    fixed: "right",
    render: (val) => (
      <span
        style={{
          display: "inline-block",
          padding: "2px 10px",
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
          background: val === "Y" ? "#e8f5e9" : "#f5f5f5",
          color: val === "Y" ? "#2e7d32" : "#757575",
          border: `1px solid ${val === "Y" ? "#c8e6c9" : "#e0e0e0"}`,
        }}
      >
        {val === "Y" ? "Active" : "Inactive"}
      </span>
    ),
  },
];

/**
 * Child table columns for Jobs within a JobGroup
 * Reuses getJobManagementColumns() but excludes:
 * - MODULE (not relevant for child context)
 * - PARENT (parent is the group itself)
 *
 * Keeps all other columns: NO, NAME, CODE, TYPE, DESC, PARAMETER, EXEC TYPE,
 * HANDLER CLASS, TIMEOUT, MAX RETRY, CREATED BY, CREATED DATE, UPDATED BY, UPDATED DATE
 */
export const getJobGroupChildTableColumns = (accessGroupsMap = {}) => {
  const allJobColumns = getJobManagementColumns(accessGroupsMap);

  // Exclude MODULE and PARENT columns
  const excludeKeys = ["module", "parent"];

  return allJobColumns.filter(
    (col) => !excludeKeys.includes(col.key || col.dataIndex)
  );
};
