import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

function formatNPWP(npwpNumber) {
  const npwpString = npwpNumber.toString();
  const formattedNPWP = npwpString.replace(
    /(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/,
    "$1.$2.$3.$4-$5.$6"
  );
  return formattedNPWP;
}

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "customerNumber",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerNumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CUSTOMER IDENTIFICATION TYPE",
    dataIndex: "identificationType",
    align: "center",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "identificationType",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "identificationType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CUSTOMER IDENTIFICATION NUMBER",
    dataIndex: "customerIdentificationNumber",
    sorter: true,
    align: "left",
    width: 400,
    ...getColumnSearchPropsPaging(
      "customerIdentificationNumber",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerIdentificationNumber",
        searchedColumn,
        searchText,
        formatNPWP(text),
        false,
        "input",
        search
      ),
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    sorter: true,
    width: 340,
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "CUSTOMER TYPE",
    dataIndex: "customerType",
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "customerType",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "FOUNDED BIRTH DATE",
    dataIndex: "foundedBirthDate",
    align: "center",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "foundedBirthDate",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "date",
      search
    ),
    render: (text) =>
      renderDateColumn(
        "foundedBirthDate",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "FOUNDED BIRTH PLACE",
    dataIndex: "foundedBirthPlace",
    sorter: true,
    align: "left",
    ellipsis: {
      showTitle: false,
    },
    width: 300,
    ...getColumnSearchPropsPaging(
      "foundedBirthPlace",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "foundedBirthPlace",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "SEX",
    dataIndex: "sex",
    sorter: true,
    align: "center",
    width: 160,
    ...getColumnSearchPropsPaging(
      "sex",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "sex",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "MARITAL STATUS",
    dataIndex: "maritalStatus",
    sorter: true,
    align: "left",
    ellipsis: {
      showTitle: false,
    },
    width: 300,
    ...getColumnSearchPropsPaging(
      "maritalStatus",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "maritalStatus",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "SEARCH KEY",
    dataIndex: "searchKey",
    sorter: true,
    align: "left",
    width: 300,
    ...getColumnSearchPropsPaging(
      "searchKey",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "searchKey",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CUSTOMER STATUS",
    dataIndex: "customerStatus",
    sorter: true,
    width: 200,
    // fixed:"right",
    ...getColumnSearchPropsPaging(
      "customerStatus",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "status"
    ),
    render: (text) =>
      renderColumn(
        "customerStatus",
        searchedColumn,
        searchText,
        text,
        false,
        "status",
        search
      ),
  },
  {
    title: "CUSTOMER DESCRIPTION",
    dataIndex: "customerDescription",
    sorter: true,
    align: "left",
    ellipsis: {
      showTitle: false,
    },
    width: 300,
    ...getColumnSearchPropsPaging(
      "customerDescription",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerDescription",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    align: "left",
    sorter: true,
    width: 320,
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountNumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT REGISTRATION NUMBER",
    dataIndex: "registrationNumber",
    align: "left",
    sorter: true,
    width: 350,
    ...getColumnSearchPropsPaging(
      "registrationNumber",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "registrationNumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    align: "left",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "accountName",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    align: "left",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "category",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "category",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT GROUP",
    dataIndex: "accountGroup",
    align: "center",
    sorter: true,
    width: 220,
    ...getColumnSearchPropsPaging(
      "accountGroup",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountGroup",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT REFERENCE ID",
    dataIndex: "accountReferenceId",
    align: "center",
    sorter: true,
    width: 320,
    ...getColumnSearchPropsPaging(
      "accountReferenceId",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountReferenceId",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CUSTOMER MANAGEMENT",
    dataIndex: "customerManagement",
    align: "left",
    sorter: true,
    ellipsis: {
      showTitle: true,
    },
    width: 370,
    ...getColumnSearchPropsPaging(
      "customerManagement",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "customerManagement",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT STATUS",
    dataIndex: "accountStatus",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "accountStatus",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "status"
    ),
    render: (text) =>
      renderColumn(
        "accountStatus",
        searchedColumn,
        searchText,
        text,
        false,
        "status",
        search
      ),
  },
  {
    title: "ACCOUNT DESCRIPTION",
    dataIndex: "accountDescription",
    ellipsis: {
      showTitle: false,
    },
    sorter: true,
    width: 370,
    ...getColumnSearchPropsPaging(
      "accountDescription",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "accountDescription",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "SOR",
    dataIndex: "sor",
    align: "",
    sorter: true,
    width: 350,
    ...getColumnSearchPropsPaging(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "sor",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "COST CENTER",
    dataIndex: "costCenter",
    align: "center",
    width: 250,
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    align: "center",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 260,
    ...getColumnSearchPropsPaging(
      "meterReadingCode",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "meterReadingCode",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "accountSegment",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountSegment",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "accountGroupType",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountGroupType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT TYPE",
    dataIndex: "accountType",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "accountType",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "classificationType",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "classificationType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRIORITY",
    dataIndex: "priority",
    sorter: true,
    align: "center",
    width: 150,
    ...getColumnSearchPropsPaging(
      "priority",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "priority",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CORPORATE",
    dataIndex: "isCorporate",
    align: "center",
    sorter: true,
    width: 170,
    ...getColumnSearchPropsPaging(
      "isCorporate",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "yes_or_no"
    ),
    render: (text) =>
      renderColumn(
        "isCorporate",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RATING & BILLING EXCEPTION",
    dataIndex: "isException",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "isException",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "yes_or_no"
    ),
    render: (text) =>
      renderColumn(
        "isException",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "INDUSTRIAL SECTOR",
    dataIndex: "industrialSector",
    align: "center",
    sorter: true,
    width: 260,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsPaging(
      "industrialSector",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "industrialSector",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "BUDGET",
    dataIndex: "budget",
    align: "center",
    sorter: true,
    width: 180,
    ...getColumnSearchPropsPaging(
      "budget",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "budget",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BUDGET YEAR",
    dataIndex: "budgetYear",
    align: "center",
    sorter: true,
    width: 170,
    ...getColumnSearchPropsPaging(
      "budgetYear",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "input",
      search
    ),
    render: (text) =>
      renderColumn(
        "budgetYear",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TERITORY",
    dataIndex: "teritory",
    align: "center",
    sorter: true,
    width: 260,
    ...getColumnSearchPropsPaging(
      "teritory",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "teritory",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ADDRESS",
    dataIndex: "address",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 400,
    ...getColumnSearchPropsPaging(
      "address",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "address",
        searchedColumn,
        searchText,
        text?.toUpperCase(),
        true,
        "input",
        search
      ),
  },

  {
    title: "ADDRESS TYPE",
    dataIndex: "addressType",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "addressType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "addressType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BUILDING",
    dataIndex: "building",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "building",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "building",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "FLOOR",
    dataIndex: "floor",
    sorter: true,
    width: 120,
    align: "center",
    ...getColumnSearchPropsPaging(
      "floor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "floor",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "HOUSE NAME",
    dataIndex: "houseName",
    sorter: true,
    width: 240,
    ...getColumnSearchPropsPaging(
      "houseName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "houseName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "STREET NAME",
    dataIndex: "streetName",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 300,
    ...getColumnSearchPropsPaging(
      "streetName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "streetName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BLOCK",
    dataIndex: "block",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging(
      "block",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "block",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "HOUSE NUMBER",
    dataIndex: "houseNumber",
    sorter: true,
    width: 180,
    align: "center",
    ...getColumnSearchPropsPaging(
      "houseNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "houseNumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RT",
    dataIndex: "rt",
    sorter: true,
    width: 120,
    align: "center",
    ...getColumnSearchPropsPaging(
      "rt",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "rt",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "RW",
    dataIndex: "rw",
    sorter: true,
    width: 120,
    align: "center",
    ...getColumnSearchPropsPaging(
      "rw",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "rw",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "POSTAL CODE",
    dataIndex: "postalCode",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "postalCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "postalCode",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },

  {
    title: "SUB DISTRICT",
    dataIndex: "subDistrict",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "subDistrict",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "DISTRICT",
    dataIndex: "district",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "district",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CITY",
    dataIndex: "city",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "city",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PROVINCE",
    dataIndex: "province",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "province",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "province",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "COUNTRY",
    dataIndex: "country",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "country",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "country",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BUSINESS PURPOSE",
    dataIndex: "businessPurpose",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "businessPurpose",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "businessPurpose",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PREMISE",
    dataIndex: "premise",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "premise",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "yes_or_no",
      search
    ),
    render: (text) =>
      renderColumn(
        "premise",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CONTACT NAME",
    dataIndex: "contactName",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "contactName",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "contactName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "JOB NAME",
    dataIndex: "jobName",
    sorter: true,
    align: "center",
    width: 230,
    ...getColumnSearchPropsPaging(
      "jobName",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderColumn(
        "jobName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "POSITION NAME",
    dataIndex: "positionName",
    sorter: true,
    align: "center",
    width: 230,
    ...getColumnSearchPropsPaging(
      "positionName",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderColumn(
        "positionName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "FIRST NAME",
    dataIndex: "firstName",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "firstName",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "firstName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "MIDDLE NAME",
    dataIndex: "middleName",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "middleName",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "middleName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "LAST NAME",
    dataIndex: "lastName",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "lastName",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "lastName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "EMAIL",
    dataIndex: "email",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "email",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "email",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "PGN MOBILE PHONE",
    dataIndex: "pgnMobile",
    width: 280,
    ...getColumnSearchPropsPaging(
      "pgnMobile",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "pgnMobile",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "PHONE",
    dataIndex: "phone",
    width: 280,
    ...getColumnSearchPropsPaging(
      "phone",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "phone",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "FAX",
    dataIndex: "faxnumber",
    width: 280,
    ...getColumnSearchPropsPaging(
      "faxnumber",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "faxnumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "WEBSITE",
    dataIndex: "website",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "website",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "website",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "MOBILE PHONE",
    dataIndex: "mobilePhone",
    width: 280,
    ...getColumnSearchPropsPaging(
      "mobilePhone",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "mobilePhone",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "WHATSAPP",
    dataIndex: "whatsapp",
    width: 280,
    ...getColumnSearchPropsPaging(
      "whatsapp",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "whatsapp",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "MEDIA",
    dataIndex: "media",
    align: "center",
    width: 280,
    ...getColumnSearchPropsPaging(
      "media",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "media",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    align: "center",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "startDate",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "date",
      search
    ),
    render: (text) =>
      renderDateColumn(
        "startDate",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    align: "center",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "endDate",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "date",
      search
    ),
    render: (text) =>
      renderDateColumn(
        "endDate",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "PAYMENT CHANNEL",
    dataIndex: "paymentChannel",
    sorter: true,
    align: "center",
    width: 250,
    ...getColumnSearchPropsPaging(
      "paymentChannel",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "paymentChannel",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TAX IDENTIFIER TYPE",
    dataIndex: "taxIdentifierType",
    width: 210,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "taxIdentifierType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxIdentifierType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TAX IDENTIFIER NAME",
    dataIndex: "taxIdentifierName",
    width: 330,
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "taxIdentifierName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxIdentifierName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TAX IDENTIFIER NUMBER",
    dataIndex: "taxIdentifierNumber",
    width: 280,
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    align: "right",
    ...getColumnSearchPropsPaging(
      "taxIdentifierNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxIdentifierNumber",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "TAX IDENTIFIER ADDRESS",
    dataIndex: "taxIdentifierAddress",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 400,
    ...getColumnSearchPropsPaging(
      "taxIdentifierAddress",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxIdentifierAddress",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "RECEIVABLE ACCOUNT",
    dataIndex: "receivableAccount",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "receivableAccount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "receivableAccount",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "REVENUE ACCOUNT",
    dataIndex: "revenueAccount",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "revenueAccount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "revenueAccount",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  // {
  //   title: "BILLING BUCKET CODE",
  //   dataIndex: "billingBucketCode",
  //   sorter: true,
  //   width: 250,
  //   ...getColumnSearchPropsPaging(
  //     search,
  //     "billingBucketCode",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "billingBucketCode",
  //       hasValue(search["billingBucketCode"]),
  //       searchText,
  //       text,
  //       false,
  //       "input",
  //       search
  //     ),
  // },
  {
    title: "BILLING BUCKET NAME",
    dataIndex: "billingBucketName",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      search,
      "billingBucketName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "billingBucketName",
        hasValue(search["billingBucketName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    align: "left",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "category",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "category",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PPN",
    dataIndex: "ppn",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "ppn",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "ppn",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PPH",
    dataIndex: "pph",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "pph",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "pph",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PREMISE ADDRESS",
    dataIndex: "premiseAddress",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 400,
    ...getColumnSearchPropsPaging(
      "premiseAddress",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "premiseAddress",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "SA NUMBER",
    dataIndex: "saNumber",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "saNumber",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SA REFERENCE NUMBER",
    dataIndex: "saReferenceNumber",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      search,
      "saReferenceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "saReferenceNumber",
        hasValue(search["saReferenceNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "serviceType",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "serviceType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SA TYPE",
    dataIndex: "saType",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "saType",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "saType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PJBG TYPE",
    dataIndex: "pjbgType",
    align: "center",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging(
      "pjbgType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "pjbgType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SA DATE",
    dataIndex: "saDate",
    align: "center",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging(
      "saDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "saDate",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDateSa",
    align: "center",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging(
      "startDateSa",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "startDateSa",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "END DATE",
    dataIndex: "endDateSa",
    align: "center",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging(
      "endDateSa",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "endDateSa",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "COMMITMENT DATE",
    dataIndex: "commitmentDate",
    align: "center",
    sorter: true,
    width: 220,
    ...getColumnSearchPropsPaging(
      "commitmentDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "commitmentDate",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingCycle",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TERM OF PAYMENT",
    dataIndex: "termsOfPaymentName",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      search,
      "termsOfPaymentName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "termsOfPaymentName",
        hasValue(search["termsOfPaymentName"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "INVOICE TEMPLATE",
    dataIndex: "invoiceTemplate",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      search,
      "invoiceTemplate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "invoiceTemplate",
        hasValue(search["invoiceTemplate"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "GAS IN PLAN DATE",
    dataIndex: "gasInPlanDate",
    align: "center",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "gasInPlanDate",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "date",
      search
    ),
    render: (text) =>
      renderDateColumn(
        "gasInPlanDate",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "ALREADY GAS IN",
    dataIndex: "alreadyGasIn",
    align: "center",
    sorter: true,
    width: 220,
    ...getColumnSearchPropsPaging(
      "alreadyGasIn",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "yes_or_no"
    ),
    render: (text) =>
      renderColumn(
        "alreadyGasIn",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRODUCT",
    width: 240,
    sorter: true,
    dataIndex: "product",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsPaging(
      "product",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "product",
        hasValue(search["product"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "PRODUCT TYPE",
    width: 240,
    sorter: true,
    dataIndex: "productType",
    algin: "center",
    ...getColumnSearchPropsPaging(
      "productType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "productType",
        hasValue(search["productType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRODUCT CLASS",
    width: 240,
    sorter: true,
    dataIndex: "productClass",
    ...getColumnSearchPropsPaging(
      "productClass",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "productClass",
        hasValue(search["productClass"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRODUCT VERSION",
    width: 240,
    sorter: true,
    dataIndex: "productVersionId",
    ...getColumnSearchPropsPaging(
      "productVersionId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "productVersionId",
        hasValue(search["productVersionId"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CREATE FORM",
    width: 200,
    sorter: true,
    dataIndex: "createForm",
    ...getColumnSearchPropsPaging(
      "createForm",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      'yes_or_no',
    ),
    render: (text) =>
      renderColumn(
        "createForm",
        hasValue(search["createForm"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PAYMENT TYPE",
    dataIndex: "paymentType",
    key: "paymentType",
    sorter: true,
    width: 180,
    align: "center",
    ...getColumnSearchPropsPaging(
      "paymentType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "paymentType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CHARGING METHOD",
    dataIndex: "chargingMethod",
    key: "chargingMethod",
    sorter: true,
    width: 200,
    align: "center",
    ...getColumnSearchPropsPaging(
      "chargingMethod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "chargingMethod",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "UOM",
    dataIndex: "uom",
    align: "center",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "uom",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  // ref dari create account table
  {
    title: "MINIMUM",
    dataIndex: "min",
    align: "left",
    sorter: true,
    width: 190,
    ...getColumnSearchPropsPaging(
      "min",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "min",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "MAXIMUM",
    dataIndex: "max",
    align: "left",
    sorter: true,
    width: 190,
    ...getColumnSearchPropsPaging(
      "max",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "max",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRESSURE",
    dataIndex: "pressure",
    align: "",
    sorter: true,
    width: 190,
    ...getColumnSearchPropsPaging(
      "pressure",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "pressure",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CONTRACT PRESSURE",
    dataIndex: "contractPressure",
    align: "",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 280,
    ...getColumnSearchPropsPaging(
      "contractPressure",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "contractPressure",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "PRICE CODE",
    sorter: true,
    dataIndex: "priceCode",
    width: 280,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsPaging(
      "priceCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "priceCode",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "PRICE ADJUSTMENT IDR",
    sorter: true,
    dataIndex: "priceadjustmentIdr",
    width: 250,
    ...getColumnSearchPropsPaging(
      "priceadjustmentIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "priceadjustmentIdr",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRICE ADJUSTMENT USD",
    sorter: true,
    dataIndex: "priceAdjustmentUsd",
    width: 250,
    ...getColumnSearchPropsPaging(
      "priceAdjustmentUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "priceAdjustmentUsd",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRICING RULE",
    sorter: true,
    dataIndex: "pricingRule",
    width: 280,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsPaging(
      "pricingRule",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "pricingRule",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "CALORIE TYPE",
    dataIndex: "calorieType",
    sorter: true,
    width: 300,
    align: "center",
    ...getColumnSearchPropsPaging(
      "calorieType",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "calorieType",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "CALORIE CODE",
    dataIndex: "calorieCode",
    sorter: true,
    width: 220,
    ...getColumnSearchPropsPaging(
      "calorieCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "calorieCode",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "GAS SOURCE",
    dataIndex: "gasSourceName",
    sorter: true,
    align: "center",
    width: 250,
    ...getColumnSearchPropsPaging(
      "gasSourceName",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "gasSourceName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "GAS SOURCE DESCRIPTION",
    dataIndex: "gasSourceDesc",
    ellipsis: {
      showTitle: false,
    },
    width: 330,
    ...getColumnSearchPropsPaging(
      "gasSourceDesc",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "gasSourceDesc",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
];

export default columns;
