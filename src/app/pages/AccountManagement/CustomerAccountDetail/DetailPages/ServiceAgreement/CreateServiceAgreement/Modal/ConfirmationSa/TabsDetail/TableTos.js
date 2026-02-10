import React, { useState, useEffect, useMemo, useCallback } from 'react'
import NxTable from '../../../../../../../../../../components/Nx/NxTable'

const expandedRowRender = (record) => {
  const dataExpand = record?.tosDetail

  const columns = [
    {
      title: "NO",
      key: "no",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'ATTRIBUTE',
      key: 'attributeName',
      dataIndex: 'attributeName',
    },
    {
      title: 'VALUE',
      key: 'value',
      dataIndex: 'value',
      render: (text) => (<span>{text?.toString()}</span>)
    }
  ];
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">
        TOS DETAIL
      </p>
      <NxTable
        idTable="confirmation-tos-detail-expand"
        dataSource={dataExpand || []}
        columns={columns}
        totalData={dataExpand?.length || 0}
        usePagination={false}
        loading={false}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  )
};

const TableTos = ({
  dataTermOfService
}) => {
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [dataTermOfServices, setDataTermOfServices] = useState([]);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  useEffect(() => {
    if (dataTermOfService?.length > 0) {
      const dataModif = dataTermOfService.map((a, index) => ({
        ...a,
        key: index + 1,
        tosDetail: a.tosDetail?.map((b, idx) => ({
          ...b,
          key: idx + 1,
        })),
      }));
      setDataTermOfServices(dataModif);
    } else {
      setDataTermOfServices([]);
    }
  }, [dataTermOfService]);

  const processedData = useMemo(() => {
    let result = [...dataTermOfServices];
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
  }, [dataTermOfServices, fieldSort, orderSort]);

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
      title: 'TERMS OF SERVICE NAME',
      key: 'tosName',
      dataIndex: 'tosName',
      sorter: true,
    },
    {
      title: 'DESCRIPTION',
      key: 'description',
      dataIndex: 'description',
      sorter: true,
    },
  ];

  return (
    <div className="py-4">
      <NxTable
        idTable="confirmation-tos-table"
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
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.tosDetail && record.tosDetail.length > 0,
        }}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  )
}

export default TableTos
