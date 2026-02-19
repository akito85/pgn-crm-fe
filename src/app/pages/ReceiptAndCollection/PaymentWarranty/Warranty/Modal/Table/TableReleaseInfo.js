import { InputNumber } from "antd";
import DateComponent from "../../../../../../../components/DateComponent";
import { columnsWarrantyInfo } from "./TableWarrantyInfo";

export const columnsReleaseInfo = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  releaseAmountData = {},
  handleReleaseAmountChange = () => {},
  releaseDateData = {},
  handleReleaseDateChange = () => {},
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
      key: "releaseAmount",
      title: "RELEASE AMOUNT",
      dataIndex: "releaseAmount",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={value => value.replace(/\$\s?|(\.*)/g, '')}
          value={releaseAmountData[record.key]}
          onChange={(val) => handleReleaseAmountChange(val, record.key)}
          controls={false}
          disabled={disabled}
        />
      )
    }
  ];
};