import { useMemo, useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionReport } from "../redux/slices/debt_and_collection/transactionReport";
import { columns } from "../app/pages/DebtAndCollection/TransactionReport/ColumnTransactionReportView";

const AGING_ORDER = [
  "In Period Collection",
  "Post Period Collection",
  "Visiting and Inviting Collection",
  "Non Litigasi",
  "Litigasi",
  "Customer",
];

const buildRows = (segments = []) => {
  const rows = [];

  segments.forEach((seg) => {
    const invoiceRow = { segmentName: seg.segmentName, type: "Invoice" };
    const revenueRow = { segmentName: seg.segmentName, type: "Revenue" };

    AGING_ORDER.forEach((cat) => {
      const bucket = seg.buckets.find((b) => b.category === cat);

      invoiceRow[cat] = bucket ? bucket.invoiceCount : 0;
      revenueRow[cat] = bucket ? bucket.formattedRevenue : "Rp0,00";
    });

    rows.push(invoiceRow, revenueRow);
  });

  return rows;
};

const buildGrandTotalRow = (grand) => {
  if (!grand) return [];

  const invoiceRow = {
    segmentName: "Grand Total",
    type: "Total Invoice",
    isGrand: true,
  };

  const revenueRow = {
    segmentName: "Grand Total",
    type: "Total Revenue",
    isGrand: true,
  };

  const keys = {
    "In Period Collection": grand.inPeriodCollection,
    "Post Period Collection": grand.postPeriodCollection,
    "Visiting and Inviting Collection": grand.visitingCollection,
    "Non Litigasi": grand.nonLitigasi,
    "Litigasi": grand.litigasi,
    "Customer": grand.customer,
  };

  Object.entries(keys).forEach(([cat, g]) => {
    invoiceRow[cat] = g ? g.invoiceCount : 0;
    revenueRow[cat] = g ? g.formattedRevenue : "Rp0,00";
  });

  return [invoiceRow, revenueRow];
};

const TableTransactionReport = ({
  current = 1,
  pageSize = 10,
  onChange = () => {},
  onClickDetail = () => {},
}) => {
  const dispatch = useDispatch();
  const { dataTransactionReport, loading } = useSelector(
    (state) => state.transactionReport
  );

  useEffect(() => {
    dispatch(getTransactionReport({ page: current, size: pageSize }));
  }, [dispatch, current, pageSize]);

  // Gunakan onClickDetail untuk columns
  const tableColumns = useMemo(() => columns(onClickDetail), [onClickDetail]);

  const content = dataTransactionReport?.data?.content;
  if (!content) return null;

  const segments = content?.segments || [];
  const grand = content?.grandTotal || {};
  const totalElements = dataTransactionReport?.data?.totalElements || 0;

  const rows = [...buildRows(segments), ...buildGrandTotalRow(grand)];

  return (
    <div className="relative flex flex-col w-full">
      <Table
        columns={tableColumns}
        dataSource={rows}
        loading={loading}
        bordered
        rowKey={(row, idx) => idx}
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        pagination={{
          position: ["topRight"],
          current: current,
          pageSize: pageSize,
          total: totalElements,
          onChange: onChange,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`,
        }}
      />
    </div>
  );
};

export default TableTransactionReport;
