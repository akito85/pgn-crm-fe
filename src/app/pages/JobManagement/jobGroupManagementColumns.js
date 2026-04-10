import React from "react";
import StatusComponent from "../../../components/StatusComponent";
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
    width: 120,
    fixed: "right",
    render: (val) => {
      const colour = val === "Y" ? "active" : "inactive";
      const text = val === "Y" ? "Active" : "Inactive";
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "22px", overflow: "hidden" }}>
          <StatusComponent colour={colour} size="small">{text}</StatusComponent>
        </div>
      );
    },
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

  const filtered = allJobColumns.filter(
    (col) => !excludeKeys.includes(col.key || col.dataIndex)
  );

  // Prioritize and configure NO, NAME, CODE columns (fixed to left)
  const prioritized = [];
  const noCol = filtered.find(c => c.key === "no");
  const nameCol = filtered.find(c => c.key === "name");
  const codeCol = filtered.find(c => c.key === "code");

  if (noCol) prioritized.push({...noCol, width: 60, align: "center"});
  if (nameCol) prioritized.push({...nameCol, width: 150, align: "left"});
  if (codeCol) prioritized.push({...codeCol, width: 120, align: "left"});

  // Add remaining columns (excluding ones we already added)
  filtered
    .filter(c => !["no", "name", "code"].includes(c.key || c.dataIndex))
    .forEach(col => prioritized.push(col));

  return prioritized;
};
