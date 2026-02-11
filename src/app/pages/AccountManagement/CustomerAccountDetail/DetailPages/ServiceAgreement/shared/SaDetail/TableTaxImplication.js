import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import NxTable from '../../../../../../../../components/Nx/NxTable';
import { getTaxImplicationColumns } from './columns/getTaxImplicationColumns';

const TableTaxImplication = ({ dataTaxImplication = [], setDataTaxImplication }) => {
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

  // Process data with search filters (no sorting here, NxTable handles it)
  const processedData = useMemo(() => {
    let result = [...dataTaxImplication];

    // Apply search filter if any
    if (searchedColumn && searchText) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }

    return result;
  }, [dataTaxImplication, searchedColumn, searchText]);

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
    // Reset to first page when searching
    setLoadedCount(20);
  };

  const columns = useMemo(() => {
    return getTaxImplicationColumns({
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    });
  }, [search, searchedColumn, searchText]);

  const columnDefinitions = useMemo(() => {
    return columns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [columns]);

  return (
    <div>
      <NxTable
        idTable="tax-implication-table"
        dataSource={displayData}
        columns={columns}
        totalData={processedData.length}
        tableScrolled={{ y: 400, x: "max-content" }}
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

export default TableTaxImplication;

