import { InputNumber } from "antd";
import DateComponent from "../../../../../../../components/DateComponent";
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
        <DateComponent
          style={{ width: '100%' }}
          value={refundDateData[record.key]}
          onChange={(val) => handleRefundDateChange(val, record.key)}
          disabled={disabled}
        />
      )
    },
    {
      key: "refundAmount",
      title: "REFUND AMOUNT",
      dataIndex: "refundAmount",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={value => value.replace(/\$\s?|(\.*)/g, '')}
          value={refundAmountData[record.key]}
          onChange={(val) => handleRefundAmountChange(val, record.key)}
          controls={false}
          disabled={disabled}
        />
      )
    }
  ];
};