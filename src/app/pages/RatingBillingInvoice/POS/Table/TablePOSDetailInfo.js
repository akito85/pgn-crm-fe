import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";
import { separatorCurrency } from "../Utils";
import { hasValue, renderColumn } from "../../../../../utils";

export const columnsTablePOSDetailInfo = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleUpdate = () => {},
  handleDelete = () => {},
  onFilter = () => {},
  sorter = () => {},
  data = [],
  type
) => {
  const isLockedItem = (record) => {
    const itemCode = record?.item;
    const itemName = record?.itemName;

    return ["PPN", "PPH", "Meterai"].includes(itemCode) ||
      ["PPN", "PPH", "Meterai"].includes(itemName);
  };

  const column = [
    {
      title: "No",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      filteredValue: search?.["source"] ? [search?.["source"]] : null,
      sorter: (a, b) => sorter("source", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "source",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "source",
          hasValue(search?.["source"]),
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
      filteredValue: search?.["type"] ? [search?.["type"]] : null,
      sorter: (a, b) => sorter("type", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "type",
          hasValue(search?.["type"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ITEM CODE",
      dataIndex: "item",
      filteredValue: search?.["item"] ? [search?.["item"]] : null,
      sorter: (a, b) => sorter("item", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "item",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "item",
          hasValue(search?.["item"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ITEM",
      dataIndex: "itemName",
      filteredValue: search?.["itemName"] ? [search?.["itemName"]] : null,
      sorter: (a, b) => sorter("itemName", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "itemName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "itemName",
          hasValue(search?.["itemName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      filteredValue: search?.["quantity"] ? [search?.["quantity"]] : null,
      sorter: (a, b) => sorter("quantity", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "quantity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "quantity",
          hasValue(search?.["quantity"]),
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
      filteredValue: search?.["uom"] ? [search?.["uom"]] : null,
      sorter: (a, b) => sorter("uom", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "uom",
          hasValue(search?.["uom"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CURENCY",
      dataIndex: "currency",
      filteredValue: search?.["currency"] ? [search?.["currency"]] : null,
      sorter: (a, b) => sorter("currency", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "currency",
          hasValue(search?.["currency"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "PRICE CODE",
      dataIndex: "priceCode",
      filteredValue: search?.["priceCode"] ? [search?.["priceCode"]] : null,
      sorter: (a, b) => sorter("priceCode", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "priceCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "priceCode",
          hasValue(search?.["priceCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      filteredValue: search?.["price"] ? [search?.["price"]] : null,
      sorter: (a, b) => sorter("price", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "price",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "price",
          hasValue(search?.["price"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      filteredValue: search?.["amount"] ? [search?.["amount"]] : null,
      sorter: (a, b) => sorter("amount", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "amount",
          hasValue(search?.["amount"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "DISCOUNT AMOUNT",
      dataIndex: "discount",
      filteredValue: search?.["discount"] ? [search?.["discount"]] : null,
      sorter: (a, b) => sorter("discount", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "discount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "discount",
          hasValue(search?.["discount"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      filteredValue: search?.["totalAmount"] ? [search?.["totalAmount"]] : null,
      sorter: (a, b) => sorter("totalAmount", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "totalAmount",
          hasValue(search?.["totalAmount"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT BASIS",
      dataIndex: "vatBasis",
      filteredValue: search?.["vatBasis"] ? [search?.["vatBasis"]] : null,
      sorter: (a, b) => sorter("vatBasis", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatBasis",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "vatBasis",
          hasValue(search?.["vatBasis"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT BASIS EQV",
      dataIndex: "vatBasisEqv",
      filteredValue: search?.["vatBasisEqv"] ? [search?.["vatBasisEqv"]] : null,
      sorter: (a, b) => sorter("vatBasisEqv", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatBasisEqv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "vatBasisEqv",
          hasValue(search?.["vatBasisEqv"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT RATE",
      dataIndex: "vatRate",
      filteredValue: search?.["vatRate"] ? [search?.["vatRate"]] : null,
      sorter: (a, b) => sorter("vatRate", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "vatRate",
          hasValue(search?.["vatRate"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT CODE",
      dataIndex: "vatCode",
      filteredValue: search?.["vatCode"] ? [search?.["vatCode"]] : null,
      sorter: (a, b) => sorter("vatCode", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "vatCode",
          hasValue(search?.["vatCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT",
      dataIndex: "vat",
      filteredValue: search?.["vat"] ? [search?.["vat"]] : null,
      sorter: (a, b) => sorter("vat", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vat",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "vat",
          hasValue(search?.["vat"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT EQV",
      dataIndex: "vatEqv",
      filteredValue: search?.["vatEqv"] ? [search?.["vatEqv"]] : null,
      sorter: (a, b) => sorter("vatEqv", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatEqv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "vatEqv",
          hasValue(search?.["vatEqv"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "WITHHOLDING TAX",
      dataIndex: "witholdingTax",
      filteredValue: search?.["witholdingTax"] ? [search?.["witholdingTax"]] : null,
      sorter: (a, b) => sorter("witholdingTax", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "witholdingTax",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "witholdingTax",
          hasValue(search?.["witholdingTax"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT EXCH EXCH RATE TYPE",
      dataIndex: "vatExchangeRateType",
      filteredValue: search?.["vatExchangeRateType"] ? [search?.["vatExchangeRateType"]] : null,
      sorter: (a, b) => sorter("vatExchangeRateType", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatExchangeRateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "vatExchangeRateType",
          hasValue(search?.["vatExchangeRateType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT EXCH RATE DATE",
      dataIndex: "vatExchangeRateDate",
      filteredValue: search?.["vatExchangeRateDate"] ? [search?.["vatExchangeRateDate"]] : null,
      sorter: (a, b) => sorter("vatExchangeRateDate", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatExchangeRateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "vatExchangeRateDate",
          hasValue(search?.["vatExchangeRateDate"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "VAT EXCH RATE",
      dataIndex: "vatExchangeRate",
      filteredValue: search?.["vatExchangeRate"] ? [search?.["vatExchangeRate"]] : null,
      sorter: (a, b) => sorter("vatExchangeRate", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "vatExchangeRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "vatExchangeRate",
          hasValue(search?.["vatExchangeRate"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "CONVERTED CURENCY",
      dataIndex: "convertedCurrency",
      filteredValue: search?.["convertedCurrency"] ? [search?.["convertedCurrency"]] : null,
      sorter: (a, b) => sorter("convertedCurrency", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "convertedCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "convertedCurrency",
          hasValue(search?.["convertedCurrency"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "TOTAL AMOUNT EQV",
      dataIndex: "totalAmountEqv",
      filteredValue: search?.["totalAmountEqv"] ? [search?.["totalAmountEqv"]] : null,
      sorter: (a, b) => sorter("totalAmountEqv", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "totalAmountEqv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "totalAmountEqv",
          hasValue(search?.["totalAmountEqv"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "RATE TYPE",
      dataIndex: "rateType",
      filteredValue: search?.["rateType"] ? [search?.["rateType"]] : null,
      sorter: (a, b) => sorter("rateType", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "rateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "rateType",
          hasValue(search?.["rateType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      filteredValue: search?.["rateDate"] ? [search?.["rateDate"]] : null,
      sorter: (a, b) => sorter("rateDate", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "rateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "rateDate",
          hasValue(search?.["rateDate"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "RATE",
      dataIndex: "rate",
      filteredValue: search?.["rate"] ? [search?.["rate"]] : null,
      sorter: (a, b) => sorter("rate", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "rate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "rate",
          hasValue(search?.["rate"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      fixed: "right",
      width: 100,
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Update">
              <div
                className={`pt-1 ${
                  isLockedItem(r)
                    ? " cursor-not-allowed"
                    : ""
                }`}
              >
                <SVGIcon
                  name="IconEdit"
                  color={!isLockedItem(r) ? "#ACC424" : "#8D91A0"}
                  width={24}
                  className={isLockedItem(r) ? "disabled" : undefined}
                  onClick={() =>
                    !isLockedItem(r) ? handleUpdate(r, i) : undefined
                  }
                />
              </div>
            </Tooltip>

            <Tooltip title="Delete">
              <div
                className={`pt-1 ${
                  isLockedItem(r)
                    ? " cursor-not-allowed"
                    : ""
                }`}
              >
                <SVGIcon
                  name="IconDelete"
                  color={!isLockedItem(r) ? "#D90000" : "#8D91A0"}
                  width={24}
                  className={isLockedItem(r) ? "disabled" : undefined}
                  onClick={() => (!isLockedItem(r) ? handleDelete(r) : undefined)}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (type !== "editable") {
    return column.filter((item) => item.dataIndex !== "action");
  } else {
    return column;
  }
};