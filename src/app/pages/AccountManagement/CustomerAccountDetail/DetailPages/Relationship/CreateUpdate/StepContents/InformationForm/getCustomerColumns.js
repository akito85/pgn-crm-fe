import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../../assets/Icon/index";

const getCustomerColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handleSelect = () => {},
  handleCancel = () => {},
) => [
  {
    key: "no",
    title: "NO",
    width: 50,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    width: 220,
    sorter: true,
    filteredValue: [search?.customerNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "partyType",
    title: "IDENTIFICATION TYPE",
    dataIndex: "partyType",
    width: 231,
    sorter: true,
    filteredValue: [search?.partyType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "partyType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerIdentificationNumber",
    title: "CUSTOMER IDENTIFICATION NUMBER",
    dataIndex: "customerIdentificationNumber",
    width: 343,
    sorter: true,
    filteredValue: [search?.customerIdentificationNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerIdentificationNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 200,
    sorter: true,
    filteredValue: [search?.customerName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerType",
    title: "CUSTOMER TYPE",
    dataIndex: "customerType",
    width: 194,
    sorter: true,
    filteredValue: [search?.customerType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "action",
    title: "ACTION",
    align: "center",
    width: 127,
    fixed: "right",
    render: (_, record) => (
      <div className="flex w-full justify-center gap-4">
        <Tooltip title="Select">
          <div className="pt-1 cursor-pointer">
            <SVGIcon
              name="IconActionCreate"
              color="#0075bf"
              width={20}
              onClick={() => {
                handleSelect(record);
                handleCancel();
              }}
            />
          </div>
        </Tooltip>
      </div>
    ),
  },
];

export { getCustomerColumns };
