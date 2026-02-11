import React, { useState, useEffect, useMemo, useCallback } from 'react'
import NxTable from '../../../../../../../../../components/Nx/NxTable'

const TableAttachment = ({data}) => {
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  const processedData = useMemo(() => {
    return [...(data || [])];
  }, [data]);

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
      width: 150,
      sorter: true,
    },
    {
      title: "FILE NAME",
      key: "fileName",
      dataIndex: "fileName",
      width: 150,
      sorter: true,
    },
    {
      title: "FILE SIZE",
      key: "fileSize",
      dataIndex: "fileSize",
      width: 150,
      sorter: true,
    },
  ];

  return (
    <div className={"w-full py-4"}>
      <NxTable
        idTable="confirmation-attachment-table"
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
  )
}
export default TableAttachment
