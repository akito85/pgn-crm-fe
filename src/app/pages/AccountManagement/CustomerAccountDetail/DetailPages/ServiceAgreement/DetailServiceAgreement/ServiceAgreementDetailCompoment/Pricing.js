import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { NumericFormat } from 'react-number-format';
import NxDetailText from '../../../../../../../../components/Nx/NxDetailText'
import NxTable from '../../../../../../../../components/Nx/NxTable';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../utils/getColumnSearchProps';
import { hasValue, renderColumn } from '../../../../../../../../utils';

function filterData(array, filters) {
  return array.filter((item) => {
    let res = true;
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const fixSearchText =
          key === "min" || key === "maximumName"
            ? filters[key]?.replace(/,/g, "")?.toLowerCase()
            : filters[key]?.toLowerCase();
        if (key === "value") {
          let temp;
          if (typeof item[key] === "number") {
            const dataTemp = new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(item[key]);
            temp = dataTemp.slice(0, dataTemp.length - 2);
          } else {
            temp = item[key];
          }
          res = res ? temp?.toLowerCase()?.includes(fixSearchText) : res;
        } else {
          res = res
            ? item[key]?.toString()?.toLowerCase().includes(fixSearchText)
            : res;
        }
      }
    }
    return res;
  });
}

const separatorNumber = (text) => {
  const thousandSeparator = ",";
  return text?.toString()?.length > 0
    ? text?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    : "";
}

const Pricing = ({ data }) => {
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
    if (!data?.saPricing) return [];

    let result = data.saPricing.map(item => ({
      ...item,
      value: item.value !== null ? item.value.toString() : '',
      max: item.max !== null ? item.max.toString() : '',
      min: item.min !== null ? item.min.toString() : '',
    }));

    // Apply FE search
    if (Object.keys(search).length > 0) {
      result = filterData(result, search);
    }

    if (fieldSort) {
      const handleDataSort = (obj, field) => {
        if (field === "value") {
          let temp;
          if (typeof obj[field] === "number") {
            const dataTemp = new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(obj[field]);
            temp = dataTemp.slice(0, dataTemp.length - 2);
          } else {
            temp = obj[field];
          }
          return temp?.toLowerCase();
        } else {
          return obj[field]?.toString()?.toLowerCase();
        }
      };
      result.sort((a, b) => {
        let fa = handleDataSort(a, fieldSort);
        let fb = handleDataSort(b, fieldSort);
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Merge table (rowSpan logic)
    const map = new Map();
    for (let item of result) {
      map.set(`${item["priceCode"]}~${item["min"]}~${item["max"]}`, item);
    }
    const uniquePriceCode = [...map.values()];
    const dataFilter = uniquePriceCode.map((item) => item.priceCodeName);
    const dataFix = result.filter((item) => dataFilter.includes(item.priceCodeName));

    const uniquePriceCode2 = new Set();
    let pageNumber = 0;
    const mergedData = dataFix.map((rowData, index) => {
      const updatedRowsData = { ...rowData };
      if (
        uniquePriceCode2.has(
          `${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`
        )
      ) {
        updatedRowsData.rowSpan = 0;
      } else {
        const occurCount = dataFix.filter(
          (d) =>
            d.priceCode === rowData.priceCode &&
            d.min === rowData.min &&
            d.maximumName === rowData.maximumName
        ).length;
        updatedRowsData.rowSpan = occurCount;
        updatedRowsData.number = pageNumber;
        uniquePriceCode2.add(
          `${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`
        );
        pageNumber++;
      }
      return updatedRowsData;
    });

    return mergedData;
  }, [data?.saPricing, fieldSort, orderSort, search]);

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
      render: (value, row) => ({
        children: row.number + 1,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "MINIMUM",
      key: "min",
      dataIndex: "min",
      width: 150,
      sorter: true,
      filteredValue: search?.["min"] ? [search?.["min"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "min", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text, row) => ({
        children: renderColumn("min", hasValue(search["min"]), searchText, separatorNumber(text), false, "input", search),
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "MAXIMUM",
      key: "max",
      dataIndex: "max",
      width: 150,
      sorter: true,
      align: "right",
      filteredValue: search?.["max"] ? [search?.["max"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "max", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text, row) => ({
        children: renderColumn("max", hasValue(search["max"]), searchText, separatorNumber(text), false, "input", search),
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "PRICE CODE",
      key: "priceCode",
      dataIndex: "priceCode",
      width: 150,
      sorter: true,
      filteredValue: search?.["priceCode"] ? [search?.["priceCode"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "priceCode", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text, row) => ({
        children: renderColumn("priceCode", hasValue(search["priceCode"]), searchText, text, false, "input", search),
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "PRICE DETAIL",
      children: [
        {
          title: "CURRENCY",
          key: "currency",
          dataIndex: "currency",
          width: 150,
        },
        {
          title: "VALUE",
          key: "value",
          dataIndex: "value",
          width: 150,
          render: (value, record) => (
            <NumericFormat
              displayType="text"
              value={value}
              className="text-right"
              thousandSeparator={record.currency === "USD" ? "," : "."}
              decimalSeparator={record.currency === "USD" ? "." : ","}
              decimalScale={2}
              fixedDecimalScale
            />
          ),
        },
        {
          title: "UOM",
          key: "uom",
          dataIndex: "uom",
          width: 150,
        },
        {
          title: "PRICE ADJUSTMENT",
          key: "adjustment",
          dataIndex: "adjustment",
          align: "center",
          render: (adjustment) => (
            <span>{adjustment && adjustment.adjustmentText}</span>
          ),
        },
      ],
    },
    {
      title: "DESCRIPTION",
      key: "description",
      dataIndex: "description",
      sorter: true,
      align: "left",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "description", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text, row) => ({
        children: renderColumn("description", hasValue(search["description"]), searchText, text, false, "input", search),
        props: { rowSpan: row.rowSpan },
      }),
    },
  ];

  const priceAdjustmentOne = data?.saInfo?.idrAdjustment?.adjustmentText ?? '';
  const priceAdjustmentTwo = data?.saInfo?.usdAdjustment?.adjustmentText ?? '';
  const mergeAdjustment = `${priceAdjustmentOne} ${priceAdjustmentTwo}`;

  return (
    <>
      <div className='w-full grid grid-cols-3 gap-4'>
        <NxDetailText label={"Price Code"}>{`${data?.saInfo?.fullPriceCode}`}</NxDetailText>
        <NxDetailText label={"Price Adjustment"}>
          {mergeAdjustment}
        </NxDetailText>
        <NxDetailText label={"Pricing Rule"}>
          {data?.saInfo?.isPricingRule == "Y" && data?.saInfo?.pricingRuleId == null
            ? 'Custom Tiering'
            : data?.saInfo?.pricingRuleName}
        </NxDetailText>
      </div>

      <div className={"w-full py-4"}>
        <NxTable
          idTable="sa-detail-pricing-table"
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
          columnDefinitions={[
            { key: "no", title: "NO" },
            { key: "min", title: "MINIMUM" },
            { key: "max", title: "MAXIMUM" },
            { key: "priceCode", title: "PRICE CODE" },
            { key: "currency", title: "CURRENCY" },
            { key: "value", title: "VALUE" },
            { key: "uom", title: "UOM" },
            { key: "adjustment", title: "PRICE ADJUSTMENT" },
            { key: "description", title: "DESCRIPTION" },
          ]}
          onChange={onSort}
          loading={false}
          showAdvanceSearch={false}
          showSearchBar={false}
        />
      </div>
    </>
  )
}

export default Pricing