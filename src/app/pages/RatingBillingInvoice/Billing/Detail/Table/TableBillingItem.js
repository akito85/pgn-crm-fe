import { hasValue, renderColumn, separatorNumber } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsBillingItem = (
  pageBI = 1,
  pageSizeBI = 10,
  searchInput,
  searchedColumnBI,
  searchTextBI,
  handleSearchBI = () => {},
  searchBI,
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (pageBI - 1) * pageSizeBI + index + 1,
  },
  {
    key: "item",
    title: "ITEM",
    dataIndex: "item",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "item",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "item",
        hasValue(searchBI["item"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "quantity",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(searchBI["quantity"]),
        searchTextBI,
        separatorNumber(text),
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "uom",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(searchBI["uom"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "currency",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(searchBI["currency"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "priceCode",
    title: "PRICE CODE",
    dataIndex: "priceCode",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "priceCode",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "priceCode",
        hasValue(searchBI["priceCode"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "price",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "price",
        hasValue(searchBI["price"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "amount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "amount",
        hasValue(searchBI["amount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "discountAmount",
    title: "DISCOUNT MOUNT",
    dataIndex: "discountAmount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "discountAmount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "discountAmount",
        hasValue(searchBI["discountAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "totalAmount",
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "totalAmount",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmount",
        hasValue(searchBI["totalAmount"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "totalAmountEqvIdr",
    title: "TOTAL AMOUNT EQV IDR",
    dataIndex: "totalAmountEqvIdr",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "totalAmountEqvIdr",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvIdr",
        hasValue(searchBI["totalAmountEqvIdr"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "totalAmountEqvUsd",
    title: "TOTAL AMOUNT EQV USD",
    dataIndex: "totalAmountEqvUsd",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "totalAmountEqvUsd",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvUsd",
        hasValue(searchBI["totalAmountEqvUsd"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "reference",
    title: "REFERENCE",
    dataIndex: "reference",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "reference",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "reference",
        hasValue(searchBI["reference"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "typeBasis",
    title: "TYPE BASIS",
    dataIndex: "typeBasis",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "typeBasis",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "typeBasis",
        hasValue(searchBI["typeBasis"]),
        searchTextBI,
        text,
        false,
        "input",
        searchBI
      ),
  },
  {
    key: "description",
    sorter: true,
    title: "DESCRIPTION",
    dataIndex: "description",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      searchBI,
      "description",
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      true
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(searchBI["description"]),
        searchTextBI,
        text,
        true,
        "input",
        searchBI
      ),
  },
];