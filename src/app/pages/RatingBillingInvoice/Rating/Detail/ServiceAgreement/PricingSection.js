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
    (state) => state.rating,
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
      }),
    );
  }, [dispatch, SAId, search, page, pageSize, sort]);

  useEffect(() => {
    dispatch(getDetailPricing(SAId));
  }, [dispatch, SAId]);

  // Simplified useEffect - No merge logic, just simple mapping
  useEffect(() => {
    const mappedData = dataSource.map((item, index) => ({
      ...item,
      number: index,
      key: item.ratingSaPricingRuleId || index, // Add unique key
    }));

    setDataTable(mappedData);
  }, [dataSource]);

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
    if (sort?.field === "min" || sort?.field === "max") {
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
          <DetailText label={"Price Adjustment"}>
            {data_pricing?.pricingAdjustment}
          </DetailText>
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
            handleSearch,
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
