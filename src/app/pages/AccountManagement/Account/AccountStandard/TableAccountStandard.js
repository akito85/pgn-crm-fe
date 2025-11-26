import Highlighter from "react-highlight-words";
import { Input, DatePicker, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import StatusComponent from "../../../../../components/StatusComponent";

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  type,
  excludeRender = false
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

export const columnsAccountStandard = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail = () => {}
) => [
  {
    title: "NO",
    align: "center",
    width: 80,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    sorter: true,
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    align: "left",
    ...getColumnSearchProps(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    align: "left",
    ...getColumnSearchProps(
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "ACCOUNT REGISTRATION NUMBER",
    dataIndex: "registrationNumber",
    align: "left",
    ...getColumnSearchProps(
      "registrationNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    align: "left",
    ...getColumnSearchProps(
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CUSTOMER IDENTIFICATION NUMBER",
    dataIndex: "customerIdentificationNumber",
    align: "left",
    ...getColumnSearchProps(
      "customerIdentificationNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    align: "left",
    ...getColumnSearchProps(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CUSTOMER TYPE",
    dataIndex: "customerType",
    align: "center",
    ...getColumnSearchProps(
      "customerType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "SOR",
    dataIndex: "sor",
    align: "left",
    ...getColumnSearchProps(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "COST CENTER",
    dataIndex: "costCenter",
    align: "left",
    ...getColumnSearchProps(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    align: "center",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchProps(
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      searchedColumn === "meterReadingCode" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    sorter: true,
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    align: "center",
    ...getColumnSearchProps(
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    align: "center",
    ...getColumnSearchProps(
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CATEGORY",
    dataIndex: "accountCategory",
    align: "center",
    ...getColumnSearchProps(
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    align: "center",
    ...getColumnSearchProps(
      "classificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "ACCOUNT TYPE",
    dataIndex: "accountType",
    align: "center",
    ...getColumnSearchProps(
      "accountType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "INDUSTRIAL SECTOR",
    dataIndex: "industrialSector",
    align: "center",
    ...getColumnSearchProps(
      "industrialSector",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "BUDGET YEAR",
    dataIndex: "budgetYear",
    align: "center",
    ...getColumnSearchProps(
      "budgetYear",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "BUDGET",
    dataIndex: "budget",
    align: "center",
    ...getColumnSearchProps(
      "budget",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "TERITORY",
    dataIndex: "teritory",
    align: "center",
    ...getColumnSearchProps(
      "teritory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "ACCOUNT GROUP",
    dataIndex: "accountGroup",
    align: "center",
    ...getColumnSearchProps(
      "accountGroup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "PRIORITY",
    dataIndex: "priority",
    align: "center",
    ...getColumnSearchProps(
      "priority",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CORPORATE",
    dataIndex: "isCorporate",
    align: "center",
    ...getColumnSearchProps(
      "corporate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "RATING & BILLING EXCEPTION",
    dataIndex: "isException",
    align: "center",
    ...getColumnSearchProps(
      "isException",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    sorter: true,
    title: "CUSTOMER MANAGEMENT",
    dataIndex: "customerManagement",
    align: "left",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchProps(
      "customerManagement",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      searchedColumn === "customerManagement" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    sorter: true,
    title: "CUSTOMER MANAGEMENT NAME",
    dataIndex: "customerManagementName",
    align: "left",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchProps(
      "customerManagementName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      searchedColumn === "customerManagementName" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    sorter: true,
    title: "DESCRIPTION",
    dataIndex: "accountDescription",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchProps(
      "accountDescription",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      searchedColumn === "accountDescription" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "STATUS",
    fixed: "right",
    width: 140,
    dataIndex: "accountStatus",
    sorter: true,
    ...getColumnSearchProps(
      "accountStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text ? (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{text}</StatusComponent>
        </div>
      ) : (
        text
      );
    },
  },
  // {
  //   title: "ACTION",
  //   fixed: "right",
  //   width: 80,
  //   align: "center",
  //   render: (id, record) => {
  //     return (
  //       <div className="pt-1">
  //         <Tooltip title="Detail">
  //           <Link
  //             to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD}
  //             state={{ idAccount: record?.accountId, idCustomer: record?.customerId }}
  //           >
  //             <SVGIcon name="IconDetail" width={24} />
  //           </Link>
  //         </Tooltip>
  //       </div>
  //     );
  //   },
  // },
];
