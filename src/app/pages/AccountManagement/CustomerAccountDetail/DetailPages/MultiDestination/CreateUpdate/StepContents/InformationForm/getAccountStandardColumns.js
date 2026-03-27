import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../../assets/Icon/index";

const getAccountStandardColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  setAccount = () => {},
  setIsOpen = () => {},
) => [
  {
    key: "no",
    title: "NO",
    width: 80,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    width: 200,
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
    key: "customerIdentificationType",
    title: "IDENTIFICATION TYPE",
    dataIndex: "customerIdentificationType",
    width: 200,
    sorter: true,
    filteredValue: [search?.customerIdentificationType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerIdentificationType",
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
    width: 220,
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
    width: 160,
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
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 250,
    sorter: true,
    filteredValue: [search?.accountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 250,
    sorter: true,
    filteredValue: [search?.accountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountCategory",
    title: "CATEGORY",
    dataIndex: "accountCategory",
    width: 200,
    sorter: true,
    filteredValue: [search?.accountCategory] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    width: 200,
    sorter: true,
    filteredValue: [search?.sor] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    width: 200,
    sorter: true,
    filteredValue: [search?.costCenter] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODES",
    dataIndex: "meterReadingCode",
    width: 200,
    sorter: true,
    filteredValue: [search?.meterReadingCode] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerManagement",
    title: "CUSTOMER MANAGEMENT",
    dataIndex: "customerManagement",
    width: 200,
    sorter: true,
    filteredValue: [search?.customerManagement] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerManagement",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "classificationType",
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    width: 200,
    sorter: true,
    filteredValue: [search?.classificationType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "classificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountSegment",
    title: "SEGMENT",
    dataIndex: "accountSegment",
    width: 200,
    sorter: true,
    filteredValue: [search?.accountSegment] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    width: 200,
    sorter: true,
    filteredValue: [search?.accountGroupType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "premiseAddress",
    title: "PREMISE ADDRESS",
    dataIndex: "premiseAddress",
    width: 200,
    sorter: true,
    filteredValue: [search?.premiseAddress] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "premiseAddress",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "subDistrict",
    title: "SUBDISTRICT",
    dataIndex: "subDistrict",
    width: 200,
    sorter: true,
    filteredValue: [search?.subDistrict] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "district",
    title: "DISTRICT",
    dataIndex: "district",
    width: 200,
    sorter: true,
    filteredValue: [search?.district] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "city",
    title: "CITY",
    dataIndex: "city",
    width: 200,
    sorter: true,
    filteredValue: [search?.city] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "province",
    title: "PROVINCE",
    dataIndex: "province",
    width: 200,
    sorter: true,
    filteredValue: [search?.province] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "province",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "country",
    title: "COUNTRY",
    dataIndex: "country",
    width: 200,
    sorter: true,
    filteredValue: [search?.country] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "country",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "longitude",
    title: "LONGITUDE",
    dataIndex: "longitude",
    width: 200,
    sorter: true,
    filteredValue: [search?.longitude] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "longitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "latitude",
    title: "LATITUDE",
    dataIndex: "latitude",
    width: 200,
    sorter: true,
    filteredValue: [search?.latitude] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "latitude",
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
    width: 120,
    fixed: "right",
    render: (v, r, i) => {
      return (
        <div className="flex w-full justify-center gap-4">
          <Tooltip title="Select">
            <div className="pt-1 cursor-pointer">
              <SVGIcon
                name="IconActionCreate"
                color={"#0075bf"}
                width={20}
                onClick={() => {
                  setAccount({
                    accountId: r.accountId,
                    accountNumber: r.accountNumber,
                    accountName: r.accountName,
                    accountSor: r.sor,
                    accountCostCenter: r.costCenter,
                    meterReadingCode: r.meterReadingCode,
                    accountSegment: r.accountSegment,
                    accountGroupType: r.accountGroupType,
                    accountType: r.accountType,
                    premiseAddress: r.premiseAddress,
                    subDistrict: r.subDistrict,
                    district: r.district,
                    city: r.city,
                    province: r.province,
                    country: r.country,
                    longitude: r.longitude,
                    latitude: r.latitude,
                  })
                  setIsOpen(false);
                }}
              />
            </div>
          </Tooltip>
        </div>
      );
    },
  },
];

export { getAccountStandardColumns };