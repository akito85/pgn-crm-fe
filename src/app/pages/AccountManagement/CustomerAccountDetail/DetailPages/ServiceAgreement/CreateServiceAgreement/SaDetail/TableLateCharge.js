import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import NxTable from '../../../../../../../../components/Nx/NxTable';
import { getLateChargeColumns } from './columns/getLateChargeColumns';

const TableLateCharge = ({
  dataTableLateCharge = [],
  setDataTableLateCharge
}) => {
  const searchInput = useRef(null);
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  // Process and filter data
  const processedData = useMemo(() => {
    let result = [...dataTableLateCharge];

    // Apply search filter
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }

    // Apply sorting
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = a[fieldSort];
        let fb = b[fieldSort];
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [dataTableLateCharge, searchedColumn, searchText, fieldSort, orderSort]);

  // Initialize display data
  useEffect(() => {
    const initialData = processedData.slice(0, loadedCount);
    setDisplayData(initialData);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  // Handle infinite scroll load more
  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      const nextCount = loadedCount + 20;
      const nextData = processedData.slice(0, nextCount);
      setDisplayData(nextData);
      setLoadedCount(nextCount);
      setHasMore(nextCount < processedData.length);
      resolve();
    });
  }, [processedData, loadedCount]);

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
    // Reset to first page when sorting
    setLoadedCount(20);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    // Reset to first page when searching
    setLoadedCount(10);
  };

  const columns = useMemo(() => {
    return getLateChargeColumns({
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    });
  }, [searchedColumn, searchText]);

  const columnDefinitions = useMemo(() => {
    return columns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [columns]);

  return (
    <div>
      <NxTable
        idTable="late-charge-table"
        dataSource={displayData}
        columns={columns}
        totalData={processedData.length}
        tableScrolled={{ y: 400, x: "max-content" }}
        onSort={onSort}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={2}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={false}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  );
};

export default TableLateCharge;