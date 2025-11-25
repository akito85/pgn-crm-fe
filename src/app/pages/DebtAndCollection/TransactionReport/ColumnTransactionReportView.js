import { Tooltip } from "antd";

export const columns = (onClickDetail) => [
  {
    title: "Segment",
    dataIndex: "segmentName",
    width: 150,
    onCell: (row) => {
      if (row.segmentName === "Grand Total" && row.type === "Total Invoice") {
        return { rowSpan: 2 };
      }
      if (row.segmentName === "Grand Total" && row.type === "Total Revenue") {
        return { rowSpan: 0 };
      }
      return { rowSpan: 1 };
    },
  },
  {
    title: "Type",
    dataIndex: "type",
    width: 150,
  },
  {
    title: "In Period Collection",
    children: [
      {
        title: "<= 1 bulan",
        dataIndex: "In Period Collection",
        render: (value, record) => {
          if (
            record.segmentName !== "Grand Total" &&
            record.segmentName !== "Customer"
          ) {
            return (
              <Tooltip title="Lihat Detail">
                <span
                  className="cursor-pointer text-blue-600"
                  onClick={() => onClickDetail(record, "V_1_M")}
                >
                  {value}
                </span>
              </Tooltip>
            );
          }
          return value;
        },
      },
    ],
  },
  {
    title: "Post Period Collection",
    children: [
      {
        title: "2–3 bulan",
        dataIndex: "Post Period Collection",
        render: (value, record) => {
          if (
            record.segmentName !== "Grand Total" &&
            record.segmentName !== "Customer"
          ) {
            return (
              <Tooltip title="Lihat Detail">
                <span
                  className="cursor-pointer text-blue-600"
                  onClick={() => onClickDetail(record, "V_2_3_M")}
                >
                  {value}
                </span>
              </Tooltip>
            );
          }
          return value;
        },
      },
    ],
  },
  {
    title: "Visiting and Inviting Collection",
    children: [
      {
        title: "4–6 bulan",
        dataIndex: "Visiting and Inviting Collection",
        render: (value, record) => {
          if (
            record.segmentName !== "Grand Total" &&
            record.segmentName !== "Customer"
          ) {
            return (
              <Tooltip title="Lihat Detail">
                <span
                  className="cursor-pointer text-blue-600"
                  onClick={() =>
                    onClickDetail(record, "V_4_6_M")
                  }
                >
                  {value}
                </span>
              </Tooltip>
            );
          }
          return value;
        },
      },
    ],
  },
  {
    title: "Non Litigasi",
    children: [
      {
        title: "7–12 bulan",
        dataIndex: "Non Litigasi",
        render: (value, record) => {
          if (
            record.segmentName !== "Grand Total" &&
            record.segmentName !== "Customer"
          ) {
            return (
              <Tooltip title="Lihat Detail">
                <span
                  className="cursor-pointer text-blue-600"
                  onClick={() => onClickDetail(record, "V_7_12_M")}
                >
                  {value}
                </span>
              </Tooltip>
            );
          }
          return value;
        },
      },
    ],
  },
  {
    title: "Litigasi",
    children: [
      {
        title: ">12 bulan",
        dataIndex: "Litigasi",
        render: (value, record) => {
          if (
            record.segmentName !== "Grand Total" &&
            record.segmentName !== "Customer"
          ) {
            return (
              <Tooltip title="Lihat Detail">
                <span
                  className="cursor-pointer text-blue-600"
                  onClick={() => onClickDetail(record, "V_12M")}
                >
                  {value}
                </span>
              </Tooltip>
            );
          }
          return value;
        },
      },
    ],
  },
  {
    title: "Customer",
    dataIndex: "Customer",
  },
];
