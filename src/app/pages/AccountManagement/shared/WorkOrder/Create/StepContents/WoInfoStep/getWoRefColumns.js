import StatusComponent from "../../../../../../../../components/StatusComponent";

export const getWoRefColumns = () => [
  { title: "NO",        width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "WO NUMBER", dataIndex: "woNumber",       width: 180, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "TYPE",      dataIndex: "woTypeName",     width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "CATEGORY",  dataIndex: "woCategoryName", width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  {
    title: "STATUS", dataIndex: "status", width: 120, sorter: true, filter: true,
    render: (v) => v ? (
      <StatusComponent colour={(v || "").toLowerCase()} margin={false}>
        {(v || "").replace(/_/g, " ")}
      </StatusComponent>
    ) : "-",
  },
];
