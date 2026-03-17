import React, { useState, useEffect, useMemo, useCallback } from 'react'
import NxTable from '../../../../../../../../../../components/Nx/NxTable'
import { hasValue } from '../../../../../../../../../../utils'
import { CurrencyFormatting } from "../../../../../../../../../../utils/formatCurrency"

const separatorNumber = (text) => {
  const thousandSeparator = ",";
  return text?.toString()?.length > 0
    ? text?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    : "";
};

const TablePricing = ({
  data = []
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
    let result = [...(data || [])].filter(Boolean);

    // Merge rows by priceCode + min + max
    const uniqueSet = new Set();
    let rowNumber = 0;
    const merged = result.map((rowData, index) => {
      const updated = { ...rowData };
      const compositeKey = `${rowData.priceCode}~${rowData.min}~${rowData.max}`;
      if (uniqueSet.has(compositeKey)) {
        updated.rowSpan = 0;
      } else {
        const occurCount = result.filter(
          (d) => `${d.priceCode}~${d.min}~${d.max}` === compositeKey
        ).length;
        updated.rowSpan = occurCount;
        updated.number = rowNumber;
        uniqueSet.add(compositeKey);
        rowNumber++;
      }
      return updated;
    });

    if (fieldSort) {
      merged.sort((a, b) => {
        let fa = a[fieldSort]?.toString()?.toLowerCase() || "";
        let fb = b[fieldSort]?.toString()?.toLowerCase() || "";
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }
    return merged;
  }, [data, fieldSort, orderSort]);

  useEffect(() => {
    setLoadedCount(20);
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
      dataIndex: "no",
      width: 60,
      align: "center",
      render: (value, row) => ({
        children: row.number + 1,
        props: { colSpan: 1, rowSpan: row.rowSpan },
      }),
    },
    {
      title: "MINIMUM",
      key: "min",
      dataIndex: "min",
      align: "right",
      width: 150,
      sorter: true,
      render: (text, row) => ({
        children: separatorNumber(text),
        props: { colSpan: 1, rowSpan: row.rowSpan },
      }),
    },
    {
      title: "MAXIMUM",
      key: "max",
      dataIndex: "max",
      align: "right",
      width: 150,
      sorter: true,
      render: (text, row) => ({
        children: hasValue(text) ? separatorNumber(text) : "Unlimited",
        props: { colSpan: 1, rowSpan: row.rowSpan },
      }),
    },
    {
      title: "PRICE CODE",
      key: "priceCodeName",
      dataIndex: "priceCodeName",
      align: "left",
      width: 200,
      sorter: true,
      render: (text, row) => ({
        children: text,
        props: { colSpan: 1, rowSpan: row.rowSpan },
      }),
    },
    {
      title: "PRICE DETAIL",
      children: [
        {
          title: "VALUE",
          key: "value",
          dataIndex: "value",
          align: "right",
          width: 120,
          render: (value, record) => (
            <CurrencyFormatting
              value={value}
              currency={record.currency?.toLowerCase()}
            />
          ),
        },
        {
          title: "CURRENCY",
          key: "currency",
          dataIndex: "currency",
          align: "center",
          width: 100,
        },
        {
          title: "UOM",
          key: "uomName",
          dataIndex: "uomName",
          align: "center",
          width: 100,
        },
        {
          title: "PRICE ADJUSTMENT",
          key: "adjustment",
          dataIndex: "adjustment",
          align: "center",
          width: 150,
          render: (data) => <span>{data}</span>,
        },
      ],
    },
    {
      title: "DESCRIPTION",
      key: "description",
      dataIndex: "description",
      align: "left",
      width: 200,
      sorter: true,
      ellipsis: { showTitle: false },
      render: (text, row) => ({
        children: text,
        props: { colSpan: 1, rowSpan: row.rowSpan },
      }),
    },
  ];

  return (
    <div className="py-4">
      <NxTable
        idTable="confirmation-pricing-table"
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

export default TablePricing
