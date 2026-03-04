import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

const getMultiDestinationColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  includeStatus = true,
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 40,
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
    key: "identificationType",
    title: "IDENTIFICATION TYPE",
    dataIndex: "identificationType",
    width: 200,
    sorter: true,
    align: "center",
    filteredValue: [search?.identificationType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "identificationType",
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
    width: 250,
    sorter: true,
    align: "center",
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
    align: "center",
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
    width: 180,
    sorter: true,
    align: "center",
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
    key: "relatedAccountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "relatedAccountNumber",
    width: 200,
    sorter: true,
    align: "center",
    filteredValue: [search?.relatedAccountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relatedAccountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "relatedAccountName",
    title: "ACCOUNT NAME",
    dataIndex: "relatedAccountName",
    width: 200,
    sorter: true,
    align: "center",
    filteredValue: [search?.relatedAccountName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relatedAccountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    width: 150,
    sorter: true,
    align: "center",
    filteredValue: [search?.category] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "category",
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
    width: 120,
    sorter: true,
    align: "center",
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
    width: 150,
    sorter: true,
    align: "center",
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
    key: "meterReadingCodes",
    title: "METER READING CODES",
    dataIndex: "meterReadingCodes",
    width: 200,
    sorter: true,
    align: "center",
    filteredValue: [search?.meterReadingCodes] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCodes",
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
    align: "center",
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
    align: "center",
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
    key: "segment",
    title: "SEGMENT",
    dataIndex: "segment",
    width: 150,
    sorter: true,
    align: "center",
    filteredValue: [search?.segment] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "segment",
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
    align: "center",
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
    width: 250,
    sorter: true,
    align: "center",
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
    width: 150,
    sorter: true,
    align: "center",
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
    width: 150,
    sorter: true,
    align: "center",
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
    width: 150,
    sorter: true,
    align: "center",
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
    key: "country",
    title: "COUNTRY",
    dataIndex: "country",
    width: 150,
    sorter: true,
    align: "center",
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
    width: 150,
    sorter: true,
    align: "center",
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
    width: 150,
    sorter: true,
    align: "center",
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
    key: "startDate",
    title: "START DATE",
    dataIndex: "startDate",
    width: 140,
    align: "center",
    filteredValue: [search?.startDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (startDate) => startDate ? moment(startDate, "DD-MM-YYYY").format(dateFormatting.date) : "",
  },
  {
    key: "endDate",
    title: "END DATE",
    dataIndex: "endDate",
    width: 140,
    align: "center",
    filteredValue: [search?.endDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (endDate) => endDate ? moment(endDate, "DD-MM-YYYY").format(dateFormatting.date) : "",
  },
  includeStatus && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 170,
    sorter: true,
    align: "center",
    filteredValue: [search?.statusApproval] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (status) => {
      const displayText = {
        "approved": "Approved",
        "waitingApproval": "Waiting Approval",
        "pending": "Pending",
        "rejected": "Rejected",
        "WAITING_APPROVAL": "Waiting Approval",
        "WAITING_FOR_APPROVAL": "Waiting Approval",
      };
      return (
        <div className="flex justify-center">
          <StatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    },
  },
  includeStatus && {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 120,
    sorter: true,
    filteredValue: [search?.status] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (status) => {
      const displayText = {
        "active": "Active",
        "inactive": "Inactive",
      };

      return (
        <div className={" flex justify-center"}>
          <StatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      )
    },
  },
].filter(Boolean);

export { getMultiDestinationColumns };
