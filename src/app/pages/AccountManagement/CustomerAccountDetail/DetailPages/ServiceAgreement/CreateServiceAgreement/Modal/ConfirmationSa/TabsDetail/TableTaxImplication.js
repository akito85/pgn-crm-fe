import React, { useState, useEffect, useRef } from "react";
import TablePaginationNew from "../../../../../../../../../../components/TablePaginationNew";
import { hasValue, renderColumn } from "../../../../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../../../../../utils/getColumnSearchProps";
import moment from "moment";

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "transactionCode":
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
        return obj[fieldSort];
      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : "";
      // return date.toLowerCase();
      case "status":
        const endDate = obj?.endDate;
        const value = endDate
          ? moment(endDate).diff(moment()) >= 0
            ? "Active"
            : "Inactive"
          : "Active";
        return value.toLowerCase();
      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (a && b) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      case "transactionCode":
        return Math.sign(parseFloat(a) - parseFloat(b));
      default:
        return a.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

const TableTaxImplication = ({ dataTaxImplication, setDataTaxImplication }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  useEffect(() => {
    setTotalElement(dataTaxImplication?.length);
  }, [dataTaxImplication]);

  // console.log("dataTaxImplication", dataTaxImplication);

  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const filterDataByPage = () => {
    let result = [...dataTaxImplication];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort];
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const columns = ({
    search,
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => {},
  }) => {
    const result = [
      {
        title: "NO",
        align: "center",
        width: "5%",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        // sorter: true,
        title: "CATEGORY",
        dataIndex: "category",
        filteredValue: search?.["category"] ? [search?.["category"]] : null,
        sorter: (a, b) => sorter("category", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "category",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "category",
            hasValue(search["category"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        // sorter: true,
        title: "TAX IMPLICATION NAME",
        dataIndex: "taxImplicationName",
        filteredValue: search?.["taxImplicationName"]
          ? [search?.["taxImplicationName"]]
          : null,
        sorter: (a, b) => sorter("taxImplicationName", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "taxImplicationName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "taxImplicationName",
            hasValue(search["taxImplicationName"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        // sorter: true,
        title: "SERVICE TYPE",
        dataIndex: "serviceType",
        filteredValue: search?.["serviceType"]
          ? [search?.["serviceType"]]
          : null,
        sorter: (a, b) => sorter("serviceType", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "serviceType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "serviceType",
            hasValue(search["serviceType"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        // sorter: true,
        title: "IMPLICATION TYPE",
        dataIndex: "implicationType",
        filteredValue: search?.["implicationType"]
          ? [search?.["implicationType"]]
          : null,
        sorter: (a, b) => sorter("implicationType", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "implicationType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "implicationType",
            hasValue(search["implicationType"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        // sorter: true,
        title: "GUNGGUNG",
        dataIndex: "gunggung",
        filteredValue: search?.["gunggung"] ? [search?.["gunggung"]] : null,
        sorter: (a, b) => sorter("gunggung", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "gunggung",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "yes_or_no",
        ),
        render: (text) =>
          renderColumn(
            "gunggung",
            hasValue(search["gunggung"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
        // render: (gunggung) => {
        //   return(
        //     <span>{gunggung === "N" ? "No" : "Yes"}</span>
        //   )
        // }
      },
      {
        // sorter: true,
        title: "VAT INVOICE",
        dataIndex: "vatInvoiceIssuance",
        filteredValue: search?.["vatInvoiceIssuance"]
          ? [search?.["vatInvoiceIssuance"]]
          : null,
        sorter: (a, b) => sorter("vatInvoiceIssuance", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "vatInvoiceIssuance",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "yes_or_no",
        ),
        render: (text) =>
          renderColumn(
            "vatInvoiceIssuance",
            hasValue(search["vatInvoiceIssuance"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
        // render: (vatValue) => {
        //   return(
        //     <span>{vatValue === "N" ? "No" : "Yes"}</span>
        //   )
        // }
      },
      {
        // sorter: true,
        title: "TRANSACTION CODE",
        dataIndex: "transactionCode",
        align: "right",
        filteredValue: search?.["transactionCode"]
          ? [search?.["transactionCode"]]
          : null,
        sorter: (a, b) => sorter("transactionCode", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "transactionCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "transactionCode",
            hasValue(search["transactionCode"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        // sorter: true,
        title: "DESCRIPTION",
        dataIndex: "description",
        filteredValue: search?.["description"]
          ? [search?.["description"]]
          : null,
        sorter: (a, b) => sorter("description", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "description",
            hasValue(search["description"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
        // ...getColumnSearchProps("segment"),
      },
    ];
    return result;
  };

  return (
    <div>
      <TablePaginationNew
        type="FE"
        pageSize={pageSize}
        current={page}
        dataSource={dataTaxImplication}
        tableScrolled={{ y: 525, x: 1500 }}
        totalData={totalElement}
        onChange={handleChangeSize}
        // onSort={onSort}
        columns={columns({
          search,
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        })}
      />
    </div>
  );
};

export default TableTaxImplication;
