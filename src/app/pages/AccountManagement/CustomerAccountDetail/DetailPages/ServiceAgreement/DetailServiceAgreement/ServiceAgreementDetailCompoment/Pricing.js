import React, { useState, useEffect, useRef } from "react";
import moment from "moment";

import GridLayout from "../../../../../../../../components/GridLayout";
import DetailText from "../../../../../../../../components/DetailText";
import TablePagination from "../../../../../../../../components/TablePagination";
// import { getColumnSearchProps } from "../../../../../../../../utils/getColumnSearchProps";
import { NumericFormat } from "react-number-format";
import Highlighter from "react-highlight-words";
import { Input, Tooltip } from "antd";
import { hasValue, renderColumn } from "../../../../../../../../utils";
import { FilterOutlined } from "@ant-design/icons";

const separatorNumber = (text) => {
  const thousandSeparator = ",";
  return text?.toString()?.length > 0
    ? text?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    : "";
};

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

const getColumnSearchProps = (
  search,
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  // onFilter = (value, record) =>
  // 	record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color:
            filtered && hasValue(search[dataIndex]) === true
              ? "#1890ff"
              : undefined,
        }}
      />
    ),
    // onFilter: onFilter,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

const Pricing = ({ data }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [minimum, setMinimum] = useState(0);

  useEffect(() => {
    if (data?.saPricing) {
      setTotalElement(data?.saPricing?.length);
      let modifyData = data?.saPricing.map((item) => {
        return {
          ...item,
          value: item.value !== null ? item.value.toString() : "",
          max: item.max !== null ? item.max.toString() : "",
          min: item.min !== null ? item.min.toString() : "",
        };
      });

      //merge tables
      let result = [...modifyData];
      result = filterData(result, search);
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
      if (sort) {
        const splitSort = sort.split("~");
        result.sort((a, b) => {
          let fa = handleDataSort(a, splitSort[0]);
          let fb = handleDataSort(b, splitSort[0]);
          if (fa < fb) {
            return splitSort[1] === "asc" ? -1 : 1;
          }
          if (fa > fb) {
            return splitSort[1] === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      let map = new Map();
      for (let item of result) {
        map.set(`${item["priceCode"]}~${item["min"]}~${item["max"]}`, item);
      }
      let iteratorValues = map.values();
      let uniquePriceCode = [...iteratorValues];
      setTotalElement(uniquePriceCode.length);
      const dataFilter = uniquePriceCode
        .slice((page - 1) * pageSize, page * pageSize)
        .map((item) => item.priceCodeName);
      const dataFix = result.filter((item) =>
        dataFilter.includes(item.priceCodeName),
      );

      /** Function Merge Table */
      const uniquePriceCode2 = new Set();
      let pageNo = 0;
      let pageNumber = 0;
      const mergedData = dataFix.map((rowData, index) => {
        const updatedRowsData = { ...rowData };
        if (index !== 0 && index % pageSize === 0) {
          uniquePriceCode2.clear();
          pageNo += 1;
        }
        if (
          uniquePriceCode2.has(
            `${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`,
          )
        ) {
          updatedRowsData.rowSpan = 0;
        } else {
          const occurCount = dataFix
            .slice(pageNo * pageSize, (pageNo + 1) * pageSize)
            .filter(
              (data) =>
                data.priceCode === rowData.priceCode &&
                data.min === rowData.min &&
                data.maximumName === rowData.maximumName,
            ).length;
          updatedRowsData.rowSpan = Math.min(pageSize, occurCount);
          updatedRowsData.number = pageNumber;
          uniquePriceCode2.add(
            `${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`,
          );
          pageNumber++;
        }
        return updatedRowsData;
      });
      setDataTable(mergedData);
    }
  }, [data?.saPricing, page, pageSize, sort, search]);

  // useEffect(() => {

  //     setDataTable(mergedData);
  // }, [data, page, pageSize, sort, search])

  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      const order = sort.order === "ascend" ? "asc" : "desc";
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
      setSort(`${sort.field}~${order}`);
    } else {
      setFieldSort("");
      setOrderSort("");
      setSort("");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      let tempData = {
        ...prevState,
      };

      if (selectedKeys[0]) {
        tempData[dataIndex] = selectedKeys[0];
      } else {
        delete tempData[dataIndex];
      }
      return tempData;
    });
  };

  const filterDataByPage = () => {
    let result = [...dataTable];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort];
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const columns = ({
    search,
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => {},
  }) => {
    const result = [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (value, row, index) => {
          let obj = {
            children: (page - 1) * pageSize + row.number + 1,
            props: {
              colSpan: 1,
              rowSpan: row.rowSpan,
            },
          };
          return obj;
        },
      },
      {
        title: "MINIMUM",
        dataIndex: "min",
        width: 150,
        filteredValue: search?.["min"] ? [search?.["min"]] : null,
        sorter: true,
        ...getColumnSearchProps(
          search,
          "min",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text, row, index) => {
          let obj = {
            children: renderColumn(
              "min",
              hasValue(search["min"]),
              search["min"],
              separatorNumber(text),
              false,
              "input",
              search,
            ),
            props: {
              colSpan: 1,
              rowSpan: row.rowSpan,
            },
          };
          return obj;
        },
      },
      {
        title: "MAXIMUM",
        dataIndex: "max",
        width: 150,
        sorter: true,
        align: "right",
        filteredValue: search?.["max"] ? [search?.["max"]] : null,
        ...getColumnSearchProps(
          search,
          "max",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text, row, index) => {
          let obj = {
            children: renderColumn(
              "max",
              hasValue(search["max"]),
              search["max"],
              separatorNumber(text),
              false,
              "input",
              search,
            ),
            props: {
              colSpan: 1,
              rowSpan: row.rowSpan,
            },
          };
          return obj;
        },
      },
      {
        title: "PRICE CODE",
        dataIndex: "priceCode",
        width: 150,
        filteredValue: search?.["priceCodeName"]
          ? [search?.["priceCodeName"]]
          : null,
        sorter: true,
        ...getColumnSearchProps(
          search,
          "priceCodeName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text, row, index) => {
          let obj = {
            children: renderColumn(
              "priceCodeName",
              hasValue(search["priceCodeName"]),
              search["priceCodeName"],
              text,
              false,
              "input",
              search,
            ),
            props: {
              colSpan: 1,
              rowSpan: row.rowSpan,
            },
          };
          return obj;
        },
      },
      {
        title: "PRICE DETAIL",
        children: [
          {
            title: "CURRENCY",
            dataIndex: "currency",
            width: 150,
            // sorter: true,
            // ...getColumnSearchProps(
            //   "currency",
            //   searchInput,
            //   searchedColumn,
            //   searchText,
            //   handleSearch
            // ),
          },
          {
            title: "VALUE",
            dataIndex: "value",
            width: 150,
            // sorter: true,
            // ...getColumnSearchProps(
            //   "value",
            //   searchInput,
            //   searchedColumn,
            //   searchText,
            //   handleSearch
            // ),
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
            dataIndex: "uom",
            width: 150,
            // sorter: true,
            // ...getColumnSearchProps(
            //   "uom",
            //   searchInput,
            //   searchedColumn,
            //   searchText,
            //   handleSearch
            // ),
          },
          {
            // sorter: true,
            title: "PRICE ADJUSTMENT",
            dataIndex: "adjustment",
            align: "center",
            // ...getColumnSearchProps(
            //   "adjustment",
            //   searchInput,
            //   searchedColumn,
            //   searchText,
            //   handleSearch
            // ),
            render: (adjustment) => (
              <span>{adjustment && adjustment.adjustmentText}</span>
            ),
          },
        ],
      },
      {
        sorter: true,
        title: "DESCRIPTION",
        dataIndex: "description",
        align: "left",
        filteredValue: search?.["description"]
          ? [search?.["description"]]
          : null,
        ...getColumnSearchProps(
          search,
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        ellipsis: {
          showTitle: false,
        },
        render: (text, row, index) => {
          let obj = {
            children: renderColumn(
              "description",
              hasValue(search["description"]),
              search["description"],
              text,
              false,
              "input",
              search,
            ),
            props: {
              colSpan: 1,
              rowSpan: row.rowSpan,
            },
          };
          return obj;
        },
      },
    ];
    return result;
  };

  const priceAdjustmentOne = data?.saInfo?.idrAdjustment?.adjustmentText ?? "";
  const priceAdjustmentTwo = data?.saInfo?.usdAdjustment?.adjustmentText ?? "";
  const mergeAdjustment = `${priceAdjustmentOne} ${priceAdjustmentTwo}`;

  return (
    <div className="py-6">
      <GridLayout cols={2}>
        <div>
          <div className="text-primary text-xs font-bold uppercase pb-6">
            PRICE CODE
          </div>
          <DetailText
            label={"Price Code"}
          >{`${data?.saInfo?.fullPriceCode}`}</DetailText>
        </div>
        <div>
          <div className="text-primary text-xs font-bold uppercase pb-6">
            PRICE ADJUSTMENT
          </div>
          <DetailText label={"Price Adjustment"}>{mergeAdjustment}</DetailText>
        </div>
        <div>
          <div className="text-primary text-xs font-bold uppercase py-6">
            PRICING RULE
          </div>
          <DetailText label={"Pricing Rule"}>
            {data?.saInfo?.isPricingRule == "Y" &&
            data?.saInfo?.pricingRuleId == null
              ? "Custom Tiering"
              : data?.saInfo?.pricingRuleName}
          </DetailText>
        </div>
      </GridLayout>

      <div className={"w-full py-6"}>
        <TablePagination
          pageSize={pageSize}
          current={page}
          dataSource={dataTable}
          tableScrolled={{ y: 525, x: 1500 }}
          totalData={totalElement}
          onChange={handleChangeSize}
          onSort={onSort}
          columns={columns({
            search,
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          })}
        />
      </div>
    </div>
  );
};

export default Pricing;
