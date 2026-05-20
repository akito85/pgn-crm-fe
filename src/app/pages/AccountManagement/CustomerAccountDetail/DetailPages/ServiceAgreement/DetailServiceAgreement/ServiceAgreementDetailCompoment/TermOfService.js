import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import NxTable from '../../../../../../../../components/Nx/NxTable';
import TablePagination from '../../../../../../../../components/TablePagination';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../utils/getColumnSearchProps';
import { hasValue, renderColumn } from '../../../../../../../../utils';

const expandedRowRender = (record) => {
  const innerColumns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'ATTRIBUTE',
      dataIndex: 'attribute',
    },
    {
      title: 'VALUE',
      align: 'right',
      dataIndex: 'value',
    },
  ];

  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">
        TOS DETAIL
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={record?.tosDetail}
        columns={innerColumns}
      />
    </div>
  )
};

const TermOfService = ({ data }) => {
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
    if (!data?.saTOS || data.saTOS.length === 0) return [];

    let result = data.saTOS.map((a, index) => ({
      ...a,
      key: index + 1,
      tosDetail: a.tosDetail?.map((b, idx) => ({
        ...b,
        key: idx + 1,
      })),
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
  }, [data?.saTOS, fieldSort, orderSort, search]);

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
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'TERM OF SERVICE',
      key: 'tosName',
      dataIndex: 'tosName',
      sorter: true,
      filteredValue: search?.["tosName"] ? [search?.["tosName"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "tosName", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("tosName", hasValue(search["tosName"]), searchText, text, false, "input", search),
    },
    {
      title: 'DESCRIPTION',
      key: 'description',
      dataIndex: 'description',
      sorter: true,
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "description", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("description", hasValue(search["description"]), searchText, text, false, "input", search),
    },
  ];

  return (
    <div className='w-full'>
      <NxTable
        idTable="sa-detail-tos-table"
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
        expandable={{ expandedRowRender }}
      />
    </div>
  )
}

export default TermOfService