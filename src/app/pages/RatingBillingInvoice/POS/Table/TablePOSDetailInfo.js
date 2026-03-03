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
  const column = [
    {
      title: "NO",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
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
          hasValue(search["type"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ITEM",
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
          hasValue(search["item"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CURRENCY",
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
          hasValue(search["currency"]),
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
          hasValue(search["quantity"]),
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
          hasValue(search["price"]),
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
          hasValue(search["amount"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "REFERENCE",
      dataIndex: "referenceName",
      align: searchedColumn !== "" ? "left" : "center",
      ellipsis: {
        showTitle: false,
      },
      render: (v, r, i) => {
        const check =
          data.findIndex(
            (item) => parseInt(item.itemId) === parseInt(r.reference)
          ) !== -1
            ? data.findIndex(
                (item) => parseInt(item.itemId) === parseInt(r.reference)
              ) +
                1 >=
                (page - 1) * pageSize + 1 &&
              data.findIndex(
                (item) => parseInt(item.itemId) === parseInt(r.reference)
              ) +
                1 <=
                page * pageSize
            : false;
        const text =
          data.findIndex(
            (item) => parseInt(item.itemId) === parseInt(r.reference)
          ) + 1;
        if (text) {
          return text;
        }
        return "";
      },
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
          hasValue(search["uom"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    // ✅ UPDATED: Ganti AMOUNT EQV IDR → TOTAL AMOUNT EQV
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
          hasValue(search["totalAmountEqv"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    // ✅ UPDATED: Ganti AMOUNT EQV USD → CONVERTED CURRENCY
    {
      title: "CONVERTED CURRENCY",
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
          hasValue(search["convertedCurrency"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    // ✅ REMOVED: AMOUNT IDR (TAX PURPOSE) / eqvIdr - tidak ada di response baru
    // ✅ REMOVED: TOTAL EQUIVALENT IDR / totalEqvIdr - tidak ada di response baru
    // ✅ REMOVED: TOTAL EQUIVALENT USD / totalEqvUsd - tidak ada di response baru
    {
      title: "DISCOUNT",
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
          hasValue(search["discount"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      filteredValue: search?.["total"] ? [search?.["total"]] : null,
      sorter: (a, b) => sorter("total", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "total",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
      ),
      render: (text) =>
        renderColumn(
          "total",
          hasValue(search["total"]),
          searchText,
          separatorCurrency(text),
          false,
          "input",
          search
        ),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 240,
      filteredValue: search?.["remark"] ? [search?.["remark"]] : null,
      sorter: (a, b) => sorter("remark", a, b),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
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
                  r.item === "PPN" || r.item === "PPH"
                    ? " cursor-not-allowed"
                    : ""
                }`}
              >
                <SVGIcon
                  name="IconEdit"
                  color={
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
                      ? "#ACC424"
                      : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH" || r.item === "Meterai"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
                      ? handleUpdate(r, i)
                      : undefined
                  }
                />
              </div>
            </Tooltip>

            <Tooltip title="Delete">
              <div
                className={`pt-1 ${
                  r.item === "PPN" || r.item === "PPH"
                    ? " cursor-not-allowed"
                    : ""
                }`}
              >
                <SVGIcon
                  name="IconDelete"
                  color={
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
                      ? "#D90000"
                      : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH" || r.item === "Meterai"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH" && r.item !== "Meterai"
                      ? handleDelete(r)
                      : undefined
                  }
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