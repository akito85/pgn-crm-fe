import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import NxTable from '../../../../../../../../components/Nx/NxTable';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../utils/getColumnSearchProps';
import { hasValue, renderColumn } from '../../../../../../../../utils';

const LateCharge = ({ data }) => {
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
    if (!data?.saLateCharge) return [];
    const dataArray = Object.keys(data.saLateCharge).map(key => data.saLateCharge[key]);
    let result = dataArray.filter(item => item !== null).map(item => ({
      ...item,
      maxAmount: item.maxAmount !== null ? item.maxAmount : '',
    }));

    // Apply FE search filters
    if (Object.keys(search).length > 0) {
      result = result.filter(item =>
        Object.entries(search).every(([key, val]) =>
          !val || item[key]?.toString()?.toLowerCase()?.includes(val.toLowerCase())
        )
      );
    }

    if (!fieldSort) return result;
    return [...result].sort((a, b) => {
      const fa = a[fieldSort]?.toString()?.toLowerCase() || "";
      const fb = b[fieldSort]?.toString()?.toLowerCase() || "";
      if (fa < fb) return orderSort === "asc" ? -1 : 1;
      if (fa > fb) return orderSort === "asc" ? 1 : -1;
      return 0;
    });
  }, [data?.saLateCharge, fieldSort, orderSort, search]);

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
      title: "LATE CHARGE NAME",
      key: "lateChargeName",
      dataIndex: "lateChargeName",
      sorter: true,
      width: 200,
      filteredValue: search?.["lateChargeName"] ? [search?.["lateChargeName"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "lateChargeName", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("lateChargeName", hasValue(search["lateChargeName"]), searchText, text, false, "input", search),
    },
    {
      title: "CURRENCY",
      key: "currency",
      dataIndex: "currency",
      sorter: true,
      width: 150,
      filteredValue: search?.["currency"] ? [search?.["currency"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "currency", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("currency", hasValue(search["currency"]), searchText, text, false, "input", search),
    },
    {
      title: "LATE CHARGE MAXIMUM AMOUNT",
      key: "maxAmount",
      dataIndex: "maxAmount",
      sorter: true,
      align: "right",
      width: 200,
      filteredValue: search?.["maxAmount"] ? [search?.["maxAmount"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "maxAmount", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("maxAmount", hasValue(search["maxAmount"]), searchText, text, false, "input", search),
    },
    {
      title: "LATE CHARGE RULE FORMULA",
      key: "formula",
      dataIndex: "formula",
      sorter: true,
      width: 200,
      filteredValue: search?.["formula"] ? [search?.["formula"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "formula", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("formula", hasValue(search["formula"]), searchText, text, false, "input", search),
    },
  ];

  return (
    <div>
      <NxTable
        idTable="sa-detail-latecharge-table"
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

export default LateCharge