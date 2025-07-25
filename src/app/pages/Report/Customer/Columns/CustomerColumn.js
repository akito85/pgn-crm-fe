import { renderColumn, renderDateColumn } from "../../../../../utils";
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
    title: "CUSTOMER IDENTIFICATION TYPE",
    dataIndex: "customerIdentificationType",
    align: "center",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "customerIdentificationType",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "customerIdentificationType",
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
    title: "SEX",
    dataIndex: "sex",
    sorter: true,
    align: "center",
    ellipsis: {
      showTitle: false,
    },
    width: 300,
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
    title: "AREA CODE",
    dataIndex: "areaCode",
    sorter: true,
    align: "left",
    width: 180,
    ...getColumnSearchPropsPaging(
      "areaCode",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "areaCode",
        searchedColumn,
        searchText,
        text,
        false,
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
    title: "REGISTRATION NUMBER",
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
  // {
  //     title: "SECTOR",
  //     dataIndex: "industrialSector",
  //     align: "center",
  //     sorter: true,
  //     ellipsis: {
  //         showTitle: false,
  //     },
  //     width: 260,
  //     ...getColumnSearchPropsPaging(
  //         'industrialSector',
  //         searchInput,
  //         searchInput,
  //         searchText,
  //         handleSearch
  //     ),
  //     render: (text) => renderColumn(
  //         'industrialSector',
  //         searchedColumn,
  //         searchText,
  //         text,
  //         true,
  //         'input',
  //         search
  //     )
  // },

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
    title: "ACCOUNT CATEGORY",
    dataIndex: "accountCategory",
    align: "center",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "accountCategory",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accountCategory",
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
  // {
  //     title: "REKENING",
  //     dataIndex: "jenisRekening",
  //     align: "center",
  //     sorter: true,
  //     width: 180,
  //     ...getColumnSearchPropsPaging(
  //         'jenisRekening',
  //         searchInput,
  //         searchInput,
  //         searchText,
  //         handleSearch
  //     ),
  //     render: (text) => renderColumn(
  //         'jenisRekening',
  //         searchedColumn,
  //         searchText,
  //         text,
  //         false,
  //         'input',
  //         search
  //     )
  // },
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
    title: "GAS SOURCE",
    dataIndex: "gasSource",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "gasSource",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "gasSource",
        searchedColumn,
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
      "year_only",
      search
    ),
    render: (text) =>
      renderDateColumn(
        "budgetYear",
        searchedColumn,
        searchText,
        text,
        "year",
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
    title: "VA STATUS",
    dataIndex: "vaStatus",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsPaging(
      "vaStatus",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "status"
    ),
    render: (text) =>
      renderColumn(
        "vaStatus",
        searchedColumn,
        searchText,
        text,
        false,
        "status",
        search
      ),
  },
  {
    title: "PREPAID",
    dataIndex: "prepaid",
    sorter: true,
    width: 280,
    ...getColumnSearchPropsPaging(
      "prepaid",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "prepaid",
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
    title: "IS CORPORATE",
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
    title: "IS EXCEPTION",
    dataIndex: "isException",
    align: "center",
    sorter: true,
    width: 170,
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
    title: "DATE AGREEMENT",
    dataIndex: "dateAgreement",
    align: "center",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsPaging(
      "dateAgreement",
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
        "dateAgreement",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "DATE GAS IN",
    dataIndex: "dateGasIn",
    align: "center",
    sorter: true,
    width: 170,
    ...getColumnSearchPropsPaging(
      "dateGasIn",
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
        "dateGasIn",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "DATE UNSUBSCRIPTION",
    dataIndex: "dateUnsubcription",
    align: "center",
    sorter: true,
    width: 240,
    ...getColumnSearchPropsPaging(
      "dateUnsubcription",
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
        "dateUnsubcription",
        searchedColumn,
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "CUSTOMER MANAGEMENT NAME",
    dataIndex: "customerManagementName",
    align: "left",
    sorter: true,
    ellipsis: {
      showTitle: true,
    },
    width: 370,
    ...getColumnSearchPropsPaging(
      "customerManagementName",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "customerManagementName",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
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
    title: "CEO",
    dataIndex: "ceo",
    align: "left",
    sorter: true,
    width: 220,
    ...getColumnSearchPropsPaging(
      "ceo",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "ceo",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "COMPANY GROUP",
    dataIndex: "companyGroup",
    align: "left",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "companyGroup",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "companyGroup",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "NON ORGANIC WORKERS",
    dataIndex: "nonorganicWorkers",
    ellipsis: {
      showTitle: false,
    },
    sorter: true,
    width: 370,
    ...getColumnSearchPropsPaging(
      "nonorganicWorkers",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "nonorganicWorkers",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "OWNERSHIP",
    dataIndex: "ownership",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "ownership",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "ownership",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "MONTHLY TURN OVER",
    dataIndex: "monthlyTurnover",
    align: "rigth",
    sorter: true,
    width: 220,
    ...getColumnSearchPropsPaging(
      "monthlyTurnover",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "monthlyTurnover",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "MAIN PH NUM",
    dataIndex: "mainPhNum",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "mainPhNum",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "mainPhNum",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "WORKING PER WEEKS",
    dataIndex: "workingdayPerWeeks",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "workingdayPerWeeks",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "workingdayPerWeeks",
        searchedColumn,
        searchText,
        text,
        false,
        "status",
        search
      ),
  },
  {
    title: "WORKING PER DAY",
    dataIndex: "workinghourPerDay",
    sorter: true,
    width: 300,
    ...getColumnSearchPropsPaging(
      "workinghourPerDay",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "workinghourPerDay",
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
    sorter: true,
    title: "CONTACT PERSON",
    dataIndex: "contactPerson",
    width: 280,
    ...getColumnSearchPropsPaging(
      "contactPerson",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "contactPerson",
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
    title: "CONTACT ADDRESS",
    dataIndex: "contactAddress",
    ellipsis: {
      showTitle: false,
    },
    width: 370,
    ...getColumnSearchPropsPaging(
      "contactAddress",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "contactAddress",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    sorter: true,
    title: "CELLPHONE",
    dataIndex: "cellphone",
    width: 280,
    ...getColumnSearchPropsPaging(
      "cellphone",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "cellphone",
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
    title: "HOME PHONE",
    dataIndex: "homephone",
    width: 280,
    ...getColumnSearchPropsPaging(
      "homephone",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "homephone",
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
    title: "PHONE NUMBER",
    dataIndex: "phonenumber",
    width: 280,
    ...getColumnSearchPropsPaging(
      "phonenumber",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "phonenumber",
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
    title: "FAX NUMBER",
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
    title: "DESCRIPTION",
    dataIndex: "description",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 400,
    ...getColumnSearchPropsPaging(
      "description",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "description",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "PRIMARY FLAG",
    dataIndex: "primaryFlag",
    width: 160,
    sorter: true,
    // fixed: "right",
    ...getColumnSearchPropsPaging(
      "primaryFlag",
      searchInput,
      searchInput,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "primaryFlag",
        searchedColumn,
        searchText,
        text?.toLowerCase() === "y" ? "primary" : "non-primary",
        false,
        "status",
        search
      ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    // fixed: "right",
    width: 160,
    ...getColumnSearchPropsPaging(
      "status",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "status",
        searchedColumn,
        searchText,
        text,
        false,
        "status",
        search
      ),
  },
  {
    title: "FULL ADDRESS",
    dataIndex: "fullAddress",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 400,
    ...getColumnSearchPropsPaging(
      "fullAddress",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "fullAddress",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "ADDRESS",
    dataIndex: "fullAddress",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 400,
    ...getColumnSearchPropsPaging(
      "fullAddress",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "fullAddress",
        searchedColumn,
        searchText,
        text?.toUpperCase(),
        true,
        "input",
        search
      ),
  },

  {
    title: "TYPE",
    dataIndex: "type",
    sorter: true,
    align: "center",
    width: 180,
    ...getColumnSearchPropsPaging(
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "type",
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
  //   {
  //     title: "FLOOR",
  //     dataIndex: "floor",
  //     sorter: true,
  //     width: 180,
  //     align: "center",
  //     ...getColumnSearchPropsPaging(
  //       "floor",
  //       searchInput,
  //       searchedColumn,
  //       searchText,
  //       handleSearch
  //     ),
  //     render: (text) =>
  //       renderColumn(
  //         "floor",
  //         searchedColumn,
  //         searchText,
  //         text,
  //         false,
  //         "input",
  //         search
  //       ),
  //   },
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
    dataIndex: "neighborhood1",
    sorter: true,
    width: 120,
    align: "center",
    ...getColumnSearchPropsPaging(
      "neighborhood1",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "neighborhood1",
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
    dataIndex: "neighborhood2",
    sorter: true,
    width: 120,
    align: "center",
    ...getColumnSearchPropsPaging(
      "neighborhood2",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "neighborhood2",
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
    title: "LONGITUDE",
    dataIndex: "longitude",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    ...getColumnSearchPropsPaging(
      "longitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "longitude",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "LATITUDE",
    dataIndex: "latitude",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    ...getColumnSearchPropsPaging(
      "latitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "latitude",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "ALTITUDE",
    dataIndex: "altitude",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    ...getColumnSearchPropsPaging(
      "altitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "altitude",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "PREMISE FLAG",
    dataIndex: "premiseFlag",
    width: 160,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "premiseFlag",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false
    ),
    render: (text) =>
      renderColumn(
        "premiseFlag",
        searchedColumn,
        searchText,
        text?.toLowerCase() === "n" ? "No" : "Yes",
        false,
        "input",
        search
      ),
  },
  {
    title: "ADDITIONAL NOTE",
    dataIndex: "additionalNote",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 370,
    ...getColumnSearchPropsPaging(
      "additionalNote",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "additionalNote",
        searchedColumn,
        searchText,
        text,
        true,
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
      "taxIdentifierTypeValue",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxIdentifierTypeValue",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "TAX IDENTIFIER NAME",
    dataIndex: "taxIdentifierName",
    width: 330,
    sorter: true,
    align: "right",
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
    title: "TAX IDENTIFIER ADDRESS",
    dataIndex: "taxIdentifierAddressValue",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 400,
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
        true,
        "input",
        search
      ),
  },

  // {
  //     title: "PRIMARY FLAG",
  //     dataIndex: "primaryFlag",
  //     width: 160,
  //     sorter: true,
  //     ...getColumnSearchPropsPaging(
  //         'primaryFlag',
  //         searchInput,
  //         searchInput,
  //         searchText,
  //         handleSearch,
  //         false,
  //         'status'
  //     ),
  //     render: (text) => renderColumn(
  //         'primaryFlag',
  //         searchedColumn,
  //         searchText,
  //         text,
  //         false,
  //         'status',
  //         search
  //     )
  // },
  //   {
  //     title: "TAX IDENTIFIER TYPE",
  //     dataIndex: "taxIdentifierTypeValue",
  //     width: 210,
  //     sorter: true,
  //     align: "center",
  //     ...getColumnSearchPropsPaging(
  //       "taxIdentifierTypeValue",
  //       searchInput,
  //       searchedColumn,
  //       searchText,
  //       handleSearch
  //     ),
  //     render: (text) =>
  //       renderColumn(
  //         "taxIdentifierTypeValue",
  //         searchedColumn,
  //         searchText,
  //         text,
  //         false,
  //         "input",
  //         search
  //       ),
  //   },

  {
    title: "TAX RELATION IDENTIFIER TYPE",
    dataIndex: "taxRelationIdentifierType",
    width: 280,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "taxRelationIdentifierType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxRelationIdentifierType",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TAX RELATION IDENTIFIER NAME",
    dataIndex: "taxRelationIdentifierName",
    width: 420,
    sorter: true,
    ...getColumnSearchPropsPaging(
      "taxRelationIdentifierName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "taxRelationIdentifierName",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TAX RELATION IDENTIFIER ADDRESS",
    dataIndex: "taxRelationIdentifierAddress",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    width: 480,
    ...getColumnSearchPropsPaging(
      "taxRelationIdentifierAddress",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderColumn(
        "taxRelationIdentifierAddress",
        searchedColumn,
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "IS BAD DEBT",
    dataIndex: "isBadDebt",
    align: "center",
    sorter: true,
    width: 180,
    ...getColumnSearchPropsPaging(
      "isBadDebt",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "yes_or_no"
    ),
    render: (text) =>
      renderColumn(
        "isBadDebt",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "IS SYNC",
    dataIndex: "isSync",
    align: "center",
    sorter: true,
    width: 160,
    ...getColumnSearchPropsPaging(
      "isSync",
      searchInput,
      searchInput,
      searchText,
      handleSearch,
      false,
      "yes_or_no"
    ),
    render: (text) =>
      renderColumn(
        "isSync",
        searchedColumn,
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  //   {
  //     title: "ACCOUNT DESCRIPTION",
  //     dataIndex: "accountDescription",
  //     ellipsis: {
  //       showTitle: false,
  //     },
  //     sorter: true,
  //     width: 400,
  //     ...getColumnSearchPropsPaging(
  //       "accountDescription",
  //       searchInput,
  //       searchInput,
  //       searchText,
  //       handleSearch,
  //       false,
  //       "date"
  //     ),
  //     render: (text) =>
  //       renderColumn(
  //         "accountDescription",
  //         searchedColumn,
  //         searchText,
  //         text,
  //         true,
  //         "input",
  //         search
  //       ),
  //   },
  //   {
  //     title: "PRIMARY FLAG",
  //     dataIndex: "primaryFlag",
  //     width: 160,
  //     sorter: true,
  //     fixed: "right",
  //     ...getColumnSearchPropsPaging(
  //       "primaryFlag",
  //       searchInput,
  //       searchInput,
  //       searchText,
  //       handleSearch
  //     ),
  //     render: (text) =>
  //       renderColumn(
  //         "primaryFlag",
  //         searchedColumn,
  //         searchText,
  //         text?.toLowerCase() === "y" ? "primary" : "non-primary",
  //         false,
  //         "status",
  //         search
  //       ),
  //   },
  //   {
  //     title: "STATUS",
  //     dataIndex: "status",
  //     sorter: true,
  //     fixed: "right",
  //     width: 160,
  //     ...getColumnSearchPropsPaging(
  //       "status",
  //       searchInput,
  //       searchInput,
  //       searchText,
  //       handleSearch,
  //       false
  //     ),
  //     render: (text) =>
  //       renderColumn(
  //         "status",
  //         searchedColumn,
  //         searchText,
  //         text,
  //         false,
  //         "status",
  //         search
  //       ),
  //   },
  // {
  //   title: "ACCOUNT STATUS",
  //   dataIndex: "status",
  //   sorter: true,
  //   // align: "center",
  //   width: 180,
  //   fixed: "right",
  //   ...getColumnSearchPropsPaging(
  //     "status",
  //     searchInput,
  //     searchInput,
  //     searchText,
  //     handleSearch,
  //     false,
  //     "status"
  //   ),
  //   render: (text) =>
  //     renderColumn(
  //       "status",
  //       searchedColumn,
  //       searchText,
  //       text,
  //       false,
  //       "status",
  //       search
  //     ),
  // },
];

export default columns;
