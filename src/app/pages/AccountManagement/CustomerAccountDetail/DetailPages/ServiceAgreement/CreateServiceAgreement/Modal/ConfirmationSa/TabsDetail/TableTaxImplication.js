import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import NxTable from '../../../../../../../../../../components/Nx/NxTable'
import { hasValue, renderColumn } from '../../../../../../../../../../utils';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../../../utils/getColumnSearchProps';
import moment from 'moment';

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "transactionCode":
        return obj[fieldSort];
      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : "";
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
        return 0;
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
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  const processedData = useMemo(() => {
    let result = [...(dataTaxImplication || [])];
    return result;
  }, [dataTaxImplication]);

  useEffect(() => {
    const sliced = processedData.slice(0, loadedCount);
    setDisplayData(sliced);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setLoadedCount(20);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const columns = useMemo(() => {
    const result = [
      {
        title: "NO",
        key: "no",
        align: "center",
        width: "5%",
        render: (text, object, index) => index + 1,
      },
      {
        title: "CATEGORY",
        key: "category",
        dataIndex: "category",
        filteredValue: search?.["category"] ? [search?.["category"]] : null,
        sorter: (a, b) => sorter("category", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "category", searchInput, searchedColumn, searchText, handleSearch, true, "input"
        ),
        render: (text) => renderColumn("category", hasValue(search["category"]), searchText, text, false, "input", search),
      },
      {
        title: "TAX IMPLICATION NAME",
        key: "taxImplicationName",
        dataIndex: "taxImplicationName",
        filteredValue: search?.["taxImplicationName"] ? [search?.["taxImplicationName"]] : null,
        sorter: (a, b) => sorter("taxImplicationName", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "taxImplicationName", searchInput, searchedColumn, searchText, handleSearch, true, "input"
        ),
        render: (text) => renderColumn("taxImplicationName", hasValue(search["taxImplicationName"]), searchText, text, false, "input", search),
      },
      {
        title: "SERVICE TYPE",
        key: "serviceType",
        dataIndex: "serviceType",
        filteredValue: search?.["serviceType"] ? [search?.["serviceType"]] : null,
        sorter: (a, b) => sorter("serviceType", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "serviceType", searchInput, searchedColumn, searchText, handleSearch, true, "input"
        ),
        render: (text) => renderColumn("serviceType", hasValue(search["serviceType"]), searchText, text, false, "input", search),
      },
      {
        title: "IMPLICATION TYPE",
        key: "implicationType",
        dataIndex: "implicationType",
        filteredValue: search?.["implicationType"] ? [search?.["implicationType"]] : null,
        sorter: (a, b) => sorter("implicationType", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "implicationType", searchInput, searchedColumn, searchText, handleSearch, true, "input"
        ),
        render: (text) => renderColumn("implicationType", hasValue(search["implicationType"]), searchText, text, false, "input", search),
      },
      {
        title: "GUNGGUNG",
        key: "gunggung",
        dataIndex: "gunggung",
        filteredValue: search?.["gunggung"] ? [search?.["gunggung"]] : null,
        sorter: (a, b) => sorter("gunggung", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "gunggung", searchInput, searchedColumn, searchText, handleSearch, true, "yes_or_no"
        ),
        render: (text) => renderColumn("gunggung", hasValue(search["gunggung"]), searchText, text, false, "input", search),
      },
      {
        title: "VAT INVOICE",
        key: "vatInvoiceIssuance",
        dataIndex: "vatInvoiceIssuance",
        filteredValue: search?.["vatInvoiceIssuance"] ? [search?.["vatInvoiceIssuance"]] : null,
        sorter: (a, b) => sorter("vatInvoiceIssuance", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "vatInvoiceIssuance", searchInput, searchedColumn, searchText, handleSearch, true, "yes_or_no"
        ),
        render: (text) => renderColumn("vatInvoiceIssuance", hasValue(search["vatInvoiceIssuance"]), searchText, text, false, "input", search),
      },
      {
        title: "TRANSACTION CODE",
        key: "transactionCode",
        dataIndex: "transactionCode",
        align: "right",
        filteredValue: search?.["transactionCode"] ? [search?.["transactionCode"]] : null,
        sorter: (a, b) => sorter("transactionCode", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "transactionCode", searchInput, searchedColumn, searchText, handleSearch, true, "input"
        ),
        render: (text) => renderColumn("transactionCode", hasValue(search["transactionCode"]), searchText, text, false, "input", search),
      },
      {
        title: "DESCRIPTION",
        key: "description",
        dataIndex: "description",
        filteredValue: search?.["description"] ? [search?.["description"]] : null,
        sorter: (a, b) => sorter("description", a, b),
        ...getColumnSearchPropsUseFilteredValueFE(
          search, "description", searchInput, searchedColumn, searchText, handleSearch, true, "input"
        ),
        render: (text) => renderColumn("description", hasValue(search["description"]), searchText, text, false, "input", search),
      },
    ];
    return result;
  }, [search, searchedColumn, searchText]);

  return (
    <div className="py-4">
      <NxTable
        idTable="confirmation-tax-implication-table"
        dataSource={displayData}
        columns={columns}
        totalData={processedData.length}
        tableScrolled={{ x: "max-content", y: 400 }}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={2}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columns.map((col) => ({
          key: col.key || col.dataIndex || col.title,
          title: col.title,
        }))}
        loading={false}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  );
};

export default TableTaxImplication;
