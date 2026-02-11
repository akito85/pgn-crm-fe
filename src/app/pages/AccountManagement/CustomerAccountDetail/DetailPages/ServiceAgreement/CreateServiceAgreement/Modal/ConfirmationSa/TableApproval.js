import React, { useState, useEffect, useMemo, useCallback } from 'react'
import NxTable from '../../../../../../../../../components/Nx/NxTable'

const expandedRowRender = (record) => {
  const dataExpand = record?.employeeDetail

  const columns = [
    {
      title: "NO",
      key: "no",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'EMPLOYEE',
      key: 'employeeName',
      dataIndex: 'employeeName',
    }
  ];
  return (
    <div>
      <NxTable
        idTable="confirmation-approval-expand"
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

const TableApproval = ({data}) => {
  const [dataTable, setDataTable] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  useEffect(() => {
    if (data && data?.length > 0) {
      const dataModif = data?.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail?.map((b, idx) => ({
          ...b,
          key: idx + 1,
        })),
      }));
      setDataTable(dataModif);
    }
  }, [data]);

  useEffect(() => {
    const sliced = dataTable.slice(0, loadedCount);
    setDisplayData(sliced);
    setHasMore(loadedCount < dataTable.length);
  }, [dataTable, loadedCount]);

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
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'HIERARCHY',
      key: 'approvalLevel',
      dataIndex: 'approvalLevel',
    },
    {
      title: 'POSITION',
      key: 'position',
      dataIndex: 'position',
    }
  ];

  return (
    <div className="py-4">
      <NxTable
        idTable="confirmation-approval-table"
        dataSource={displayData}
        columns={columns}
        totalData={dataTable.length}
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
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.employeeDetail && record.employeeDetail.length > 0,
        }}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  )
}

export default TableApproval
