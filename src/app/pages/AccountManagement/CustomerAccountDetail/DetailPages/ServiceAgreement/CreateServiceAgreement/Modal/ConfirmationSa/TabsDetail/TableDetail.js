import React, { useState, useEffect, useMemo, useCallback } from 'react'
import NxTable from '../../../../../../../../../../components/Nx/NxTable'
import DetailText from '../../../../../../../../../../components/DetailText'

const TableDetail = ({
  dataTableProduct,
  saDetailObj
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
    let result = [...(dataTableProduct || [])];
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
  }, [dataTableProduct, fieldSort, orderSort]);

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
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: true,
      render: (name) => <span>{name?.label}</span>
    },
    {
      title: 'VALUE',
      key: 'value',
      dataIndex: 'value',
      sorter: true,
    },
    {
      title: 'UNIT',
      key: 'unit',
      dataIndex: 'unit',
      sorter: true,
      render: (unit) => <span>{unit !== undefined ? unit.label : ""}</span>
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-5 py-[10px]">
        <DetailText label="Payment Type">{saDetailObj?.objPaymentType?.unitName}</DetailText>
        <DetailText label="Charging Method">{saDetailObj?.objChargingMethod?.unitName}</DetailText>
      </div>

      <div className="py-4">
        <NxTable
          idTable="confirmation-detail-table"
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
    </div>
  )
}

export default TableDetail
