import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

export const columnsInstallment = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => {
  return [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "INSTALLMENT NUMBER",
      dataIndex: "installmentNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "installmentNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "installmentNumber",
          hasValue(search["installmentNumber"]),
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "accountNumber",
          hasValue(search["accountNumber"]),
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
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "customerName",
          hasValue(search["customerName"]),
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "accountName",
          hasValue(search["accountName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (type) => {
        let text = type;
        if (type === 101) text = "Automatic";
        else if (type === 102) text = "Custom";
        return renderColumn(
          "type",
          hasValue(search["type"]),
          searchText,
          text,
          false,
          "input",
          search
        );
      },
    },
    {
      title: "TENOR",
      dataIndex: "tenor",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "tenor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (tenor) =>
        renderColumn(
          "tenor",
          hasValue(search["tenor"]),
          searchText,
          tenor ? `${tenor} Bulan` : "-",
          false,
          "input",
          search
        ),
    },
    {
      title: "START PERIOD",
      dataIndex: "startPeriod",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "startPeriod",
          hasValue(search["startPeriod"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "source",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "source",
          hasValue(search["source"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (amount, record) => {
        const formatted = new Intl.NumberFormat("id-ID").format(amount || 0);
        const text = `${record.currency || ""} ${formatted}`;
        return renderColumn(
          "totalAmount",
          hasValue(search["totalAmount"]),
          searchText,
          text,
          false,
          "input",
          search
        );
      },
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "currency",
          hasValue(search["currency"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (status) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          status,
          false,
          "status",
          search
        ),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (statusApproval) =>
        renderColumn(
          "statusApproval",
          hasValue(search["statusApproval"]),
          searchText,
          statusApproval,
          false,
          "status",
          search
        ),
    },
    {
      title: "REQUEST DATE",
      dataIndex: "requestDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "requestDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "dateCapital"
      ),
      render: (date) =>
        renderDateColumn(
          "requestDate",
          hasValue(search["requestDate"]),
          searchText,
          date,
          "date",
          search
        ),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "sor",
          hasValue(search["sor"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "costCenter",
          hasValue(search["costCenter"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "accountSegment",
          hasValue(search["accountSegment"]),
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountGroupType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "accountGroupType",
          hasValue(search["accountGroupType"]),
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
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "accountType",
          hasValue(search["accountType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACCOUNT STATUS",
      dataIndex: "accountStatus",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (accountStatus) =>
        renderColumn(
          "accountStatus",
          hasValue(search["accountStatus"]),
          searchText,
          accountStatus,
          false,
          "status",
          search
        ),
    },
    {
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "classificationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "classificationType",
          hasValue(search["classificationType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
  ];
};
