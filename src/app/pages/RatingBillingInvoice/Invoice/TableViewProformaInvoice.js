import {
  hasValue,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";

export const columnsProformaInvoice = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => {
  return [
    {
      key: "invoiceNumber",
      title: "PROFORMA INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "invoiceNumber",
          hasValue(search["invoiceNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      key: "billingCode",
      title: "BILLING CODE",
      dataIndex: "billingCode",
      width: 180,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "billingCode",
          hasValue(search["billingCode"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      key: "invoiceTemplateId",
      title: "INVOICE TEMPLATE ID",
      dataIndex: "invoiceTemplateId",
      width: 190,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceTemplateId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "invoiceTemplateId",
          hasValue(search["invoiceTemplateId"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      key: "prefix",
      title: "PREFIX",
      dataIndex: "prefix",
      width: 130,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "prefix",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "prefix",
          hasValue(search["prefix"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      key: "billingType",
      title: "BILLING TYPE",
      dataIndex: "billingType",
      width: 140,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "billingType",
          hasValue(search["billingType"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      key: "status",
      title: "STATUS PINVOICE",
      dataIndex: "status",
      width: 160,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) => (
        <StatusComponent colour={text?.toLowerCase()}>
          {toTitleCase(text?.toLowerCase())}
        </StatusComponent>
      ),
    },
    {
      key: "latestLogStatus",
      title: "STATUS GENERATE INVOICE",
      dataIndex: "latestLogStatus",
      width: 210,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "latestLogStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) => (
        <StatusComponent colour={text?.toLowerCase()}>
          {toTitleCase(text?.toLowerCase())}
        </StatusComponent>
      ),
    },
    {
      key: "remark",
      title: "REMARK",
      dataIndex: "remark",
      width: 250,
      sorter: true,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      key: "createdDate",
      title: "CREATED DATE",
      dataIndex: "createdDate",
      width: 180,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "createdDate",
          hasValue(search["createdDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      key: "createdBy",
      title: "CREATED BY",
      dataIndex: "createdBy",
      width: 180,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "createdBy",
          hasValue(search["createdBy"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
  ];
};
