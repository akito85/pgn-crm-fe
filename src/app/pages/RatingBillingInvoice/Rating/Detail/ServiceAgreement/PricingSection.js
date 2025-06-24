import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import {
  getAllPricingRuleSAPaginate,
  getDetailPricing,
} from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsPricingRule } from "../Table/TablePricingRule";

const PricingSection = ({ SAId }) => {
  // Selector
  const { data_pricing, data_pricingRule } = useSelector(
    (state) => state.rating
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_pricingRule?.result?.pricingRules || [];
  const pricingRuleName = data_pricingRule?.result?.priceCode;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [dataTable, setDataTable] = useState([]);

  // Use Effect
  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllPricingRuleSAPaginate({
        id: SAId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, SAId, search, page, pageSize, sort]);

  useEffect(() => {
    dispatch(getDetailPricing(SAId));
  }, [dispatch, SAId]);

  useEffect(() => {
    let result = [...dataSource];

    let map = new Map();
    for (let item of result) {
      map.set(item["priceCode"], item);
    }
    let iteratorValues = map.values();
    let uniquePriceCode = [...iteratorValues];
    // setTotalElement(uniquePriceCode.length);
    const dataFilter = uniquePriceCode
      .slice((page - 1) * pageSize, page * pageSize)
      .map((item) => item.priceCode);
    const dataFix = result.filter((item) =>
      dataFilter.includes(item.priceCode)
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
      if (uniquePriceCode2.has(rowData.idPricing)) {
        updatedRowsData.rowSpan = 0;
      } else {
        const occurCount = dataFix
          .slice(pageNo * pageSize, (pageNo + 1) * pageSize)
          .filter((data) => data.idPricing === rowData.idPricing).length;
        updatedRowsData.rowSpan = Math.min(pageSize, occurCount);
        updatedRowsData.number = pageNumber;
        uniquePriceCode2.add(rowData.idPricing);
        pageNumber++;
      }
      return updatedRowsData;
    });
    setDataTable(mergedData);
  }, [dataSource, page, pageSize]);

  // Function Search API
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSortApi = (_, __, sort) => {
    if (sort?.field === "min" || sort?.field ==="max") {
      const dataSort =
        sort.order !== undefined
          ? `lineNumber~${sort.order === "ascend" ? "asc" : "desc"}`
          : "";
      setSort(dataSort);
    } else {
      const dataSort =
        sort.order !== undefined
          ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
          : "";
      setSort(dataSort); 
    }
  };
  // console.log("data_pricing", data_pricing);
  
  return (
    <BaseContainer header={"Pricing Information"}>
      <div className={"w-full grid grid-cols-2 gap-3"}>
        <div>
          <p className={"font-bold text text-primary uppercase"}>Price Code</p>
          <DetailText label={"Price Code"}>{data_pricing?.pricing}</DetailText>
        </div>

        <div>
          <p className={"font-bold text text-primary uppercase"}>
            Price Adjustment
          </p>
          <DetailText label={"Price Adjustment"}>{data_pricing?.pricingAdjustment}</DetailText>
        </div>

        <div>
          <p className={"font-bold text text-primary uppercase"}>
            Pricing Rule
          </p>
          <DetailText label={"Pricing Rule"}>
            {pricingRuleName ? pricingRuleName : ""}
          </DetailText>
        </div>

      </div>
      <div className="w-full mt-[30px]">
        <TablePaginationNew
          dataSource={dataTable}
          columns={columnsPricingRule(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          )}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={data_pricingRule?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
        />
      </div>
    </BaseContainer>
  );
};

export default PricingSection;
