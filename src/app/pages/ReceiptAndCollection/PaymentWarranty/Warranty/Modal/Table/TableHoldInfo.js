import DateComponent from "../../../../../../../components/DateComponent";
import { columnsWarrantyInfo } from "./TableWarrantyInfo";

export const columnsHoldInfo = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
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
      dataIndex: "currencyBalance",
      width: 150,
      fixed: "right",
      render: (value) => (
        <div style={{ textAlign: 'right' }}>
          {(value || 0).toLocaleString()}
        </div>
      )
    }
  ];
};