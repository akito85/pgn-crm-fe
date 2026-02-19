import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import moment from 'moment';
import NxTable from '../../../../../../../../components/Nx/NxTable';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../utils/getColumnSearchProps';
import { hasValue, renderColumn } from '../../../../../../../../utils';

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

const TaxImplication = ({ data }) => {
  const searchInput = useRef(null);
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      let tempData = { ...prevState };
      if (selectedKeys[0]) {
        tempData[dataIndex] = selectedKeys[0];
      } else {
        delete tempData[dataIndex];
      }
      return tempData;
    });
    setLoadedCount(20);
  };

  const processedData = useMemo(() => {
    if (!data?.saTaxImplication) return [];
    const dataArray = Object.keys(data.saTaxImplication).map(key => data.saTaxImplication[key]);
    let result = dataArray.filter(item => item !== null);

    // Apply FE search filters
    if (Object.keys(search).length > 0) {
      result = result.filter(item =>
        Object.entries(search).every(([key, val]) =>
          !val || item[key]?.toString()?.toLowerCase()?.includes(val.toLowerCase())
        )
      );
    }

    if (!fieldSort) return result;
    return [...result].sort((a, b) => sorter(fieldSort, a, b));
  }, [data?.saTaxImplication, fieldSort, orderSort, search]);

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

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
    setLoadedCount(20);
  };

  const columns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      key: "category",
      dataIndex: "category",
      sorter: true,
      width: 150,
      filteredValue: search?.["category"] ? [search?.["category"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "category", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("category", hasValue(search["category"]), searchText, text, false, "input", search),
    },
    {
      title: "TAX IMPLICATION NAME",
      key: "taxImplicationName",
      dataIndex: "taxImplicationName",
      sorter: true,
      width: 200,
      filteredValue: search?.["taxImplicationName"] ? [search?.["taxImplicationName"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "taxImplicationName", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("taxImplicationName", hasValue(search["taxImplicationName"]), searchText, text, false, "input", search),
    },
    {
      title: "SERVICE TYPE",
      key: "serviceType",
      dataIndex: "serviceType",
      sorter: true,
      width: 150,
      filteredValue: search?.["serviceType"] ? [search?.["serviceType"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "serviceType", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("serviceType", hasValue(search["serviceType"]), searchText, text, false, "input", search),
    },
    {
      title: "IMPLICATION TYPE",
      key: "implicationType",
      dataIndex: "implicationType",
      sorter: true,
      width: 150,
      filteredValue: search?.["implicationType"] ? [search?.["implicationType"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "implicationType", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("implicationType", hasValue(search["implicationType"]), searchText, text, false, "input", search),
    },
    {
      title: "GUNGGUNG",
      key: "gunggung",
      dataIndex: "gunggung",
      sorter: true,
      width: 150,
      filteredValue: search?.["gunggung"] ? [search?.["gunggung"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "gunggung", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("gunggung", hasValue(search["gunggung"]), searchText, text, false, "input", search),
    },
  ];

  return (
    <div>
      <NxTable
        idTable="sa-detail-taximplication-table"
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
        onChange={onSort}
        loading={false}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  )
}

export default TaxImplication