import React, { useState } from "react";
import { Checkbox, Table } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const CONDITIONAL_COLUMNS = [
  { title: "CRITERIA STATUS", dataIndex: "criteriaStatus", align: "center" },
  { title: "CUSTOMER SEGMENT", dataIndex: "customerSegmentName", align: "left" },
  { title: "ACCOUNT GROUP", dataIndex: "accountGroupName", align: "left" },
  { title: "CITY", dataIndex: "cityName", align: "left" },
  { title: "PRODUCT", dataIndex: "productName", align: "left" },
];

const FIXED_COLUMNS = [
  {
    title: "START DATE",
    dataIndex: "startDate",
    align: "center",
    render: (value) => (value ? moment(value).format(dateFormatting.dateCapital) : ""),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    align: "center",
    render: (value) => (value ? moment(value).format(dateFormatting.dateCapital) : ""),
  },
];

const hasValue = (data, dataIndex) =>
  data.some((row) => row[dataIndex] !== null && row[dataIndex] !== undefined && row[dataIndex] !== "");

const CriteriaViewTable = ({ data = [], loading = false }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleConditionalColumns = CONDITIONAL_COLUMNS.filter(
    (col) => showAll || hasValue(data, col.dataIndex)
  );

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...visibleConditionalColumns,
    ...FIXED_COLUMNS,
  ];

  return (
    <div>
      <div className="mb-3">
        <Checkbox
          checked={showAll}
          onChange={(e) => setShowAll(e.target.checked)}
        >
          Show All Column
        </Checkbox>
      </div>
      <Table
        loading={loading}
        dataSource={(data || []).map((item, index) => ({ ...item, key: index }))}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`,
        }}
        scroll={{ x: "max-content" }}
        size="small"
      />
    </div>
  );
};

export default CriteriaViewTable;
