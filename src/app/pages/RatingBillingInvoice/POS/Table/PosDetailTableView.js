import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import TablePaginationNewTablePOS from "./TablePaginationNewTablePOS";
import { hasValue, renderColumn } from "../../../../../utils";
import { separatorCurrency } from "../Utils";

const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value?.toLowerCase();
  switch (dataIndex) {
    case "price":
    case "quantity":
    case "amount":
    case "amountEqvIdr":
    case "amountEqvUsd":
    case "eqvIdrTaxPurpose":
    case "discount":
    case "total":
    case "totalEqvIdr":
    case "totalEqvUsd":
      const tempValue = record[dataIndex]
        ? (record[dataIndex] + "").split(".")
        : [];
      const thousandSeparator = ".";
      const decimalSeparator = ",";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const format =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : "";
      return format.toLowerCase().includes(fixSearchText);

    default:
      return record[dataIndex]?.toLowerCase().includes(fixSearchText);
  }
};

// Sorting Table
const sorter = (fieldSort, a, b) => {
  // console.log(fieldSort, a, b, "sprter");
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdrTaxPurpose":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        // const tempValue = obj[fieldSort]
        //   ? (obj[fieldSort] + "").split(".")
        //   : [];
        // const thousandSeparator = ".";
        // const decimalSeparator = ",";
        // const descimal = tempValue[1]
        //   ? `${decimalSeparator}${tempValue[1]}`
        //   : `${decimalSeparator}00`;
        // const format =
        //   tempValue.length > 0
        //     ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        //       descimal
        //     : "";
        return obj[fieldSort]
          ? (obj[fieldSort] || 0)?.toString()?.toLowerCase()
          : "0";

      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        return Math.sign(
          parseInt(a.replace(/,/g, "")) - parseInt(b.replace(/,/g, "")),
        );
      default:
        return a.localeCompare(b);
    }
  };

  return handleCompare(fa, fb);
};

const columnDetail = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  type,
  handleDelete = () => {},
  handleUpdate = () => {},
  onFilter,
  sorter,
  data = [],
) => {
  const column = [
    {
      title: "NO",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "LINE NUMBER",
      dataIndex: "lineNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lineNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "lineNumber",
          hasValue(search["lineNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
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
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "source",
          hasValue(search["source"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      // onFilter: (value, record) => onFilter("type", value, record),
      // sorter: (a, b) => sorter("type", a, b),
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "type",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "type",
          hasValue(search["type"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ITEM CODE",
      dataIndex: "itemId",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "itemId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "itemId",
          hasValue(search["itemId"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ITEM",
      dataIndex: "item",
      // onFilter: (value, record) => onFilter("item", value, record),
      // sorter: (a, b) => sorter("item", a, b),
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "item",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "item",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "item",
          hasValue(search["item"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "quantity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "quantity",
          hasValue(search["quantity"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "UOM",
      dataIndex: "uom",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "uom",
          hasValue(search["uom"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      // onFilter: (value, record) => onFilter("currency", value, record),
      // sorter: (a, b) => sorter("currency", a, b),
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "currency",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "currency",
          hasValue(search["currency"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "PRICE CODE",
      dataIndex: "priceCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "priceCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "priceCode",
          hasValue(search["priceCode"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "price",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "price",
          hasValue(search["price"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("price", value, record),
      // sorter: (a, b) => sorter("price", a, b),
      // ...getColumnSearchPropsPaging(
      //   "price",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = ".";
      //     const decimalSeparator = ",";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "amount",
          hasValue(search["amount"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
      // onFilter: (value, record) => onFilter("amount", value, record),
      // sorter: (a, b) => sorter("amount", a, b),
      // ...getColumnSearchPropsPaging(
      //   "amount",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text, record) => {
      //   if (typeof text === "string") {
      //     return text;
      //   } else {
      //     const tempValue = text ? (text + "").split(".") : [];
      //     const thousandSeparator = recor== "IDR" ? "." : ",";
      //     const decimalSeparator = recor== "IDR" ? "," : ".";
      //     const descimal = tempValue[1]
      //       ? `${decimalSeparator}${tempValue[1]}`
      //       : `${decimalSeparator}00`;
      //     const value =
      //       tempValue.length > 0
      //         ? tempValue[0].replace(
      //             /\B(?=(\d{3})+(?!\d))/g,
      //             thousandSeparator
      //           ) + descimal
      //         : "";
      //     if (searchedColumn === "value") {
      //       const highlight = (
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={value || ""}
      //         />
      //       );
      //       if (value) {
      //         return highlight;
      //       }
      //       return highlight;
      //     } else {
      //       if (value) {
      //         return value;
      //       }
      //       return "" || 0;
      //     }
      //   }
      // },
    },
    {
      title: "DISCOUNT",
      dataIndex: "discount",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "discount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "discount",
          hasValue(search["discount"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "totalAmount",
          hasValue(search["totalAmount"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT BASIS",
      dataIndex: "vatBasis",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatBasis",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatBasis",
          hasValue(search["vatBasis"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT BASIS EQV",
      dataIndex: "vatBasisEqv",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatBasisEqv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatBasisEqv",
          hasValue(search["vatBasisEqv"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT RATE",
      dataIndex: "vatRate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatRate",
          hasValue(search["vatRate"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT CODE",
      dataIndex: "vatCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatCode",
          hasValue(search["vatCode"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT",
      dataIndex: "vat",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vat",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vat",
          hasValue(search["vat"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT EQV",
      dataIndex: "vatEqv",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatEqv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatEqv",
          hasValue(search["vatEqv"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "WITHHOLDING VAT CODE",
      dataIndex: "withholdingVatCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "withholdingVatCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "withholdingVatCode",
          hasValue(search["withholdingVatCode"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "WITHHOLDING VAT RATE",
      dataIndex: "withholdingVatRate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "withholdingVatRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "withholdingVatRate",
          hasValue(search["withholdingVatRate"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "WITHHOLDING TAX",
      dataIndex: "withholdingTax",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "withholdingTax",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "withholdingTax",
          hasValue(search["withholdingTax"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT EXCHANGE RATE TYPE",
      dataIndex: "vatExchangeRateType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatExchangeRateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatExchangeRateType",
          hasValue(search["vatExchangeRateType"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT EXCHANGE RATE DATE",
      dataIndex: "vatExchangeRateDate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatExchangeRateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatExchangeRateDate",
          hasValue(search["vatExchangeRateDate"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "VAT EXCHANGE RATE",
      dataIndex: "vatExchangeRate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatExchangeRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "vatExchangeRate",
          hasValue(search["vatExchangeRate"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "CONVERTED CURRENCY",
      dataIndex: "convertedCurrency",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "convertedCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "convertedCurrency",
          hasValue(search["convertedCurrency"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "TOTAL AMOUNT EQV",
      dataIndex: "totalAmountEqv",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalAmountEqv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "totalAmountEqv",
          hasValue(search["totalAmountEqv"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "RATE TYPE",
      dataIndex: "rateType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "rateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "rateType",
          hasValue(search["rateType"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "rateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "rateDate",
          hasValue(search["rateDate"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
        ),
    },
    {
      title: "RATE",
      dataIndex: "rate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "rate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "rate",
          hasValue(search["rate"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search,
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
                    r.item !== "PPN" && r.item !== "PPH" ? "#ACC424" : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH"
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
                    r.item !== "PPN" && r.item !== "PPH" ? "#D90000" : "#8D91A0"
                  }
                  width={24}
                  className={
                    r.item === "PPN" || r.item === "PPH"
                      ? "disabled"
                      : undefined
                  }
                  onClick={() =>
                    r.item !== "PPN" && r.item !== "PPH"
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

  if (type === "detail") {
    return column.filter(
      (column) =>
        column.title !== "ACTION" &&
        column.title !== "AMOUNT EQV IDR" &&
        column.title !== "AMOUNT EQV USD" &&
        column.title !== "EQV IDR ( TAX PURPOSE )" &&
        column.title !== "POS NUMBER",
    );
  } else if (type === "confirm") {
    //confirm
    return column.filter(
      (column) => column.title !== "ACTION" && column.title !== "POS NUMBER",
    );
  } else if (type === "calculate") {
    return column.filter((column) => column.title !== "POS NUMBER");
  } else {
    return column;
  }
};

const PosDetailTableView = ({
  data = [],
  handleChange = {},
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  onSort = {},
  type,
  handleDelete = () => {},
  handleUpdate = () => {},
  totalElement,
  search,
}) => {
  const [dataTemp, setDataTemp] = useState([]);

  useEffect(() => {
    setDataTemp(data);
  }, [data]);
  return (
    <Fragment>
      <TablePaginationNewTablePOS
        // type="FE"
        setData={setDataTemp}
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        tableScrolled={{
          x: 4500,
          y: 300,
        }}
        onSort={onSort}
        columns={columnDetail(
          search,
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          type,
          handleDelete,
          handleUpdate,
          onFilter,
          sorter,
          dataTemp,
        )}
      />
    </Fragment>
  );
};

export default PosDetailTableView;
