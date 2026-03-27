import { InputNumber } from "antd";
import moment from "moment";
import DateComponent from "../../../../../../../components/DateComponent";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { columnsWarrantyInfo } from "./TableWarrantyInfo";

export const columnsRefundInfo = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  refundAmountData = {},
  handleRefundAmountChange = () => {},
  refundDateData = {},
  handleRefundDateChange = () => {},
  disabled = false
) => {
  const warrantyCols = columnsWarrantyInfo(
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
  ).map(col => ({
    ...col,
    fixed: false
  }));

  return [
    ...warrantyCols,
    {
      key: "date",
      title: "DATE",
      dataIndex: "date",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        disabled ? (
          <div>
            {(refundDateData[record.key] || record.refundDate || record.transactionDate) ? moment(refundDateData[record.key] || record.refundDate || record.transactionDate).format("DD MMM YYYY") : "-"}
          </div>
        ) : (
          <DateComponent
            style={{ width: '100%' }}
            value={refundDateData[record.key]}
            onChange={(val) => handleRefundDateChange(val, record.key)}
          />
        )
      )
    },
    {
      key: "refundAmount",
      title: "REFUND AMOUNT",
      dataIndex: "refundAmount",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        disabled ? (
          <div style={{ textAlign: 'right' }}>
            {((refundAmountData[record.key] || record.refundAmount || record.amount) || 0).toLocaleString()}
          </div>
        ) : (
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={value => value.replace(/\$\s?|(\.*)/g, '')}
            value={refundAmountData[record.key]}
            onChange={(val) => handleRefundAmountChange(val, record.key, record.currencyBalance)}
            controls={false}
          />
        )
      )
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (text) => (
        <div className="flex justify-center">
          <StatusComponent colour={text}>{text}</StatusComponent>
        </div>
      ),
    },
    {
      key: "approvalStatus",
      title: "STATUS APPROVAL",
      dataIndex: "approvalStatus",
      width: 150,
      align: "center",
      render: (text) => (
        <div className="flex justify-center">
          <StatusComponent colour={text}>{text}</StatusComponent>
        </div>
      ),
    },
  ];
};