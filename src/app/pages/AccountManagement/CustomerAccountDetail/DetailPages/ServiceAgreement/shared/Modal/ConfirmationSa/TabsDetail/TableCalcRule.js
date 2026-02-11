import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSelector } from "react-redux";
import NxTable from '../../../../../../../../../../components/Nx/NxTable'
import DetailText from '../../../../../../../../../../components/DetailText'
import { Tooltip } from 'antd';

const TableCalcRule = ({
  dataTableCalcRule,
  saDetailObj
}) => {
  const { dataListCalculationType } = useSelector((state) => state.product);

  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  const getCalculationTypeName = (val) => {
    const CalculationTypeName = dataListCalculationType && dataListCalculationType?.filter((item) => item?.value === val)
    if(CalculationTypeName === undefined) return ''
    if(CalculationTypeName.length !== 0) return CalculationTypeName[0].label 
  }

  const processedData = useMemo(() => {
    let result = [...(dataTableCalcRule || [])];
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
  }, [dataTableCalcRule, fieldSort, orderSort]);

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
      title: 'NAME',
      key: 'name',
      dataIndex: 'name',
      sorter: true,
      render: (name) => <span>{name !== undefined ? name.label : ""}</span>
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
    <div>
      <DetailText label="Calculation Type">{getCalculationTypeName(saDetailObj?.calculationType)}</DetailText>
      <div className="py-4">
        <NxTable
          idTable="confirmation-calc-rule-table"
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

export default TableCalcRule
