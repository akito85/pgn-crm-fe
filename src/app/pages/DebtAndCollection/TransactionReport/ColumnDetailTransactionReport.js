export const columnsDetail = () => [
  { title: "Account Num", dataIndex: "accountNum", key: "accountNum" },
  { title: "Account Name", dataIndex: "accountName", key: "accountName" },
  { title: "Segment", dataIndex: "segment", key: "segment" },
  { title: "Area (SOR)", dataIndex: "sor", key: "sor" },
  { title: "Invoice Num", dataIndex: "invoiceNum", key: "invoiceNum" },
  { title: "Bill Period", dataIndex: "billPeriod", key: "billPeriod" },
  {
    title: "Total Bill",
    dataIndex: "totalBill",
    key: "totalBill",
    render: (value) => value?.toLocaleString("id-ID"),
  },
  { title: "AR Age (v46M)", dataIndex: "v46M", key: "v46M" },
  { title: "Total Activity", dataIndex: "totlactivity", key: "totlactivity" },
];