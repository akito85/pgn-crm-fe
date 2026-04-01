import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import NxDetailText from '../../../../../../../../components/Nx/NxDetailText';
import NxTable from '../../../../../../../../components/Nx/NxTable';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../utils/getColumnSearchProps';
import { hasValue, renderColumn } from '../../../../../../../../utils';

const CalculationRule = ({ data }) => {
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

  // Hardcoded id for Calculation Type DDL row
  const calculationTypeId = 687;

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

  const allData = useMemo(() => {
    if (!data?.saCalcRule) return [];
    return data.saCalcRule.map(item => ({
      ...item,
      value: item.value !== null ? item.value.toString() : '',
    }));
  }, [data?.saCalcRule]);

  const calculationType = allData.find(item => item?.nameId === calculationTypeId)?.unit;

  const processedData = useMemo(() => {
    let result = allData.filter(item => item?.nameId !== calculationTypeId);

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
  }, [allData, fieldSort, orderSort, search]);

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
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "NAME",
      key: "name",
      dataIndex: "name",
      sorter: true,
      width: 200,
      filteredValue: search?.["name"] ? [search?.["name"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "name", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("name", hasValue(search["name"]), searchText, text, false, "input", search),
    },
    {
      title: "VALUE",
      key: "value",
      dataIndex: "value",
      sorter: true,
      align: "right",
      width: 150,
      filteredValue: search?.["value"] ? [search?.["value"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "value", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("value", hasValue(search["value"]), searchText, text, false, "input", search),
    },
    {
      title: "UNIT",
      key: "unit",
      dataIndex: "unit",
      sorter: true,
      width: 150,
      filteredValue: search?.["unit"] ? [search?.["unit"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "unit", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("unit", hasValue(search["unit"]), searchText, text, false, "input", search),
    },
    {
      title: "DESCRIPTION",
      key: "description",
      dataIndex: "description",
      sorter: true,
      width: 200,
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "description", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("description", hasValue(search["description"]), searchText, text, false, "input", search),
    },
  ];

  return (
    <div>
      <div className='w-full grid grid-cols-3 gap-4'>
        <NxDetailText label={"Calculation Type"}>{calculationType}</NxDetailText>
      </div>
      <div className="pt-4">
        <NxTable
          idTable="sa-detail-calcrule-table"
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

export default CalculationRule