import React, { useState, useEffect, useMemo, useCallback } from 'react'
import NxTable from '../../../../../../../../../../components/Nx/NxTable'
import { Tooltip } from 'antd';

const TableLateCharge = ({
  dataTableLateCharge
}) => {
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  const processedData = useMemo(() => {
    let result = [...(dataTableLateCharge || [])];
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = a[fieldSort]?.toString()?.toLowerCase() || "";
        let fb = b[fieldSort]?.toString()?.toLowerCase() || "";
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [dataTableLateCharge, fieldSort, orderSort]);

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
      title: 'LATE CHARGE NAME',
      key: 'lateChargeName',
      dataIndex: 'lateChargeName',
      sorter: true,
    },
    {
      title: 'CURRENCY',
      key: 'currency',
      dataIndex: 'currency',
      sorter: true,
    },
    {
      title: 'LATE CHARGE MAXIMUM AMOUNT',
      key: 'maxAmount',
      dataIndex: 'maxAmount',
      align: "right",
      sorter: true,
    },
    {
      title: 'LATE CHARGE RULE FORMULA',
      key: 'formula',
      dataIndex: 'formula',
      sorter: true,
    },
    {
      title: 'DESCRIPTION',
      key: 'description',
      dataIndex: 'description',
      sorter: true,
      ellipsis: { showTitle: false },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="py-4">
      <NxTable
        idTable="confirmation-late-charge-table"
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

export default TableLateCharge
