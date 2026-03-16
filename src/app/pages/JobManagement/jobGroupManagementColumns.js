import { getJobManagementColumns } from "./jobManagementColumns";

/**
 * Parent row columns for JobGroup List
 * Displays: NO, Name, Code, Access Group, Description
 */
export const getJobGroupManagementColumns = () => [
  {
    title: "NO",
    key: "no",
    width: 60,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    title: "JOB GROUP NAME",
    dataIndex: "name",
    key: "name",
    align: "left",
  },
  {
    title: "JOB GROUP CODE",
    dataIndex: "code",
    key: "code",
    align: "left",
    width: 120,
  },
  {
    title: "ACCESS GROUP",
    dataIndex: "accessGroup",
    key: "accessGroup",
    align: "left",
    width: 140,
  },
  {
    title: "DESCRIPTION",
    dataIndex: "desc",
    key: "desc",
    align: "left",
    ellipsis: true,
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
export const getJobGroupChildTableColumns = (page = 1, pageSize = 10) => {
  const allJobColumns = getJobManagementColumns(page, pageSize);

  // Exclude MODULE and PARENT columns
  const excludeKeys = ["module", "parent"];

  return allJobColumns.filter(
    (col) => !excludeKeys.includes(col.key || col.dataIndex)
  );
};
