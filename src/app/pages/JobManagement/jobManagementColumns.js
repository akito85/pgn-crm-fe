const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const date = `${String(d.getDate()).padStart(2, "0")}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
  const hh   = String(d.getHours()).padStart(2, "0");
  const mm   = String(d.getMinutes()).padStart(2, "0");
  const ss   = String(d.getSeconds()).padStart(2, "0");
  const cs   = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, "0");
  return `${date} ${hh}:${mm}:${ss}.${cs}`;
};

// accessGroupsMap: { [groupId]: groupName } — passed in from the page component
export const getJobManagementColumns = (accessGroupsMap = {}) => [
  {
    title: "NO",
    key: "no",
    width: 60,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    align: "left",
  },
  {
    title: "CODE",
    dataIndex: "code",
    key: "code",
    align: "left",
    width: 120,
  },
  {
    title: "TYPE",
    dataIndex: "type",
    key: "type",
    align: "left",
    width: 120,
  },
  {
    title: "DESC",
    dataIndex: "desc",
    key: "desc",
    align: "left",
    ellipsis: true,
  },
  {
    title: "PARAMETER",
    dataIndex: "parameters",
    key: "parameter",
    align: "left",
    width: 800,
    ellipsis: true,
    render: (params) => {
      if (!Array.isArray(params) || params.length === 0) return "—";
      return params
        .map((p) => {
          const type   = p.length ? `${p.type}(${p.length})` : p.type;
          const req    = p.required ? "Required" : "Optional";
          return `${p.name} ${type} ${req}`;
        })
        .join("; ");
    },
  },
  {
    title: "EXEC TYPE",
    dataIndex: "execType",
    key: "execType",
    align: "left",
    width: 220,
  },
  {
    title: "HANDLER CLASS",
    dataIndex: "handlerClass",
    key: "handlerClass",
    align: "left",
    width: 220,
    ellipsis: true,
  },
  {
    title: "TIMEOUT",
    dataIndex: "timeout",
    key: "timeout",
    align: "center",
    width: 100,
  },
  {
    title: "MAX RETRY",
    dataIndex: "maxRetry",
    key: "maxRetry",
    align: "center",
    width: 100,
  },
  {
    title: "CREATED BY",
    dataIndex: "createdBy",
    key: "createdBy",
    align: "left",
    width: 140,
  },
  {
    title: "CREATED DATE",
    dataIndex: "createdDate",
    key: "createdDate",
    align: "left",
    width: 175,
    render: (val) => formatDate(val),
  },
  {
    title: "UPDATED BY",
    dataIndex: "updatedBy",
    key: "updatedBy",
    align: "left",
    width: 140,
  },
  {
    title: "UPDATED DATE",
    dataIndex: "updatedDate",
    key: "updatedDate",
    align: "left",
    width: 175,
    render: (val) => formatDate(val),
  },
  {
    title: "MODULE",
    dataIndex: "module",
    key: "module",
    align: "left",
    width: 120,
  },
  {
    title: "ACCESS GROUP",
    dataIndex: "accessGroup",
    key: "accessGroup",
    align: "left",
    width: 140,
    render: (val) => {
      if (!val) return "—";
      // val may already be a name (from backend enrichment) or a numeric id string
      const numId = Number(val);
      if (!isNaN(numId) && accessGroupsMap[numId]) return accessGroupsMap[numId];
      return val;
    },
  },
  {
    title: "PARENT",
    dataIndex: "parent",
    key: "parent",
    align: "left",
    width: 120,
  },
];
