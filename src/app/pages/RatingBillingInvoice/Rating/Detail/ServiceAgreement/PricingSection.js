import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailText from "../../../../../../components/DetailText";
import TableRBI from "../../../../../../components/TableRBI";
import {
  getAllPricingRuleSAPaginate,
  getDetailPricing,
} from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsPricingRule } from "../Table/TablePricingRule";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const PricingSection = ({ SAId }) => {
  // Selector
  const { data_pricing, data_pricingRule, loading } = useSelector(
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
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Use Effect
  useEffect(() => {
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

  // Simplified useEffect - No merge logic, just simple mapping
  useEffect(() => {
    const mappedData = dataSource.map((item, index) => ({
      ...item,
      number: index,
      key: item.ratingSaPricingRuleId || index,
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
  const onSortApi = (_, __, sorter) => {
    if (sorter?.field === "min" || sorter?.field === "max") {
      const dataSort =
        sorter.order !== undefined
          ? `lineNumber~${sorter.order === "ascend" ? "asc" : "desc"}`
          : "";
      setSort(dataSort);
    } else {
      const dataSort =
        sorter.order !== undefined
          ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
          : "";
      setSort(dataSort);
    }
  };

  const baseColumns = useMemo(
    () =>
      columnsPricingRule(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <>
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary uppercase mb-3">
          PRICING INFORMATION
        </p>
        <div className="w-full grid grid-cols-3 gap-3">
          <div>
            <p className="font-bold text-xs text-gray-600 uppercase mb-1">
              Price Code
            </p>
            <DetailText label="Price Code">{data_pricing?.pricing}</DetailText>
          </div>

          <div>
            <p className="font-bold text-xs text-gray-600 uppercase mb-1">
              Price Adjustment
            </p>
            <DetailText label="Price Adjustment">
              {data_pricing?.pricingAdjustment}
            </DetailText>
          </div>

          <div>
            <p className="font-bold text-xs text-gray-600 uppercase mb-1">
              Pricing Rule
            </p>
            <DetailText label="Pricing Rule">
              {pricingRuleName ? pricingRuleName : ""}
            </DetailText>
          </div>
        </div>
      </div>

      <div className="w-full">
        <TableRBI
          dataSource={dataTable}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={data_pricingRule?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading}
        />
      </div>
    </>
  );
};

export default PricingSection;