import { InputNumber } from "antd";
import DateComponent from "../../../../../../../components/DateComponent";
import { columnsWarrantyInfo } from "./TableWarrantyInfo";

export const columnsHoldInfo = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  holdAmountData = {},
  handleHoldAmountChange = () => {},
  holdDateData = {},
  handleHoldDateChange = () => {},
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
      key: "holdAmount",
      title: "HOLD AMOUNT",
      dataIndex: "holdAmount",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={value => value.replace(/\$\s?|(\.*)/g, '')}
          value={holdAmountData[record.key]}
          onChange={(val) => handleHoldAmountChange(val, record.key)}
          controls={false}
          disabled={disabled}
        />
      )
    }
  ];
};