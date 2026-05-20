import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailText from "../../../../../../components/DetailText";
import TableRBI from "../../../../../../components/TableRBI";
import {
  getPrabillSummarySaPriceRule,
  getPrabillSummarySaPriceDet,
} from "../../../../../../redux/slices/rating_billing_invoice/praBilling";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../../utils";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

export const columnsSaPriceRule = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "LINE NUMBER",
    dataIndex: "lineNumber",
    key: "lineNumber",
    sorter: true,
    width: 120,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "lineNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "lineNumber",
        hasValue(search["lineNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRICE CODE",
    dataIndex: "priceCodeRule",
    key: "priceCodeRule",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priceCodeRule",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "priceCodeRule",
        hasValue(search["priceCodeRule"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "MIN",
    dataIndex: "min",
    key: "min",
    sorter: true,
    width: 120,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "min",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => {
      const displayText = text
        ? Number(text).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "";
      return renderColumn(
        "min",
        hasValue(search["min"]),
        searchText,
        displayText,
        false,
        "input",
        search
      );
    },
  },
  {
    title: "MAX",
    dataIndex: "max",
    key: "max",
    sorter: true,
    width: 120,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "max",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => {
      let displayText = "";
      if (text === 0 || text === "0" || text === null || text === undefined) {
        displayText = "Unlimited";
      } else {
        displayText = Number(text).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      
      return renderColumn(
        "max",
        hasValue(search["max"]),
        searchText,
        displayText,
        false,
        "input",
        search
      );
    },
  },
  {
    title: "VALUE",
    dataIndex: "value",
    key: "value",
    sorter: true,
    width: 120,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => {
      const displayText = text
        ? Number(text).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "";
      return renderColumn(
        "value",
        hasValue(search["value"]),
        searchText,
        displayText,
        false,
        "input",
        search
      );
    },
  },
  {
    title: "UOM",
    dataIndex: "uom",
    key: "uom",
    sorter: true,
    width: 100,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(search["uom"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CURRENCY",
    dataIndex: "currency",
    key: "currency",
    sorter: true,
    width: 100,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(search["currency"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
];

const SaPricingSection = ({ prabillSaId, saNumber }) => {
  const { prabill_sa_detail, loading_prabill_sa } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = prabill_sa_detail?.saPriceRule?.result;
  const priceDetails = prabill_sa_detail?.saPriceDet?.result || [];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    if (prabillSaId) {
      dispatch(
        getPrabillSummarySaPriceRule({
          prabillSaId,
          search: JSON.stringify(search),
          page: page - 1,
          size: pageSize,
          sort,
        })
      );
      dispatch(getPrabillSummarySaPriceDet(prabillSaId));
    }
  }, [prabillSaId, search, page, pageSize, sort, dispatch]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

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
      columnsSaPriceRule(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [page, pageSize, searchedColumn, searchText, search]
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

  const firstPriceDetail = priceDetails[0] || {};

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
            <DetailText label="Price Code">
              {firstPriceDetail?.priceCode || ""}
            </DetailText>
          </div>

          <div>
            <p className="font-bold text-xs text-gray-600 uppercase mb-1">
              Price Adjustment
            </p>
            <DetailText label="Price Adjustment">
              {firstPriceDetail?.priceCodeAdjustment || ""}
            </DetailText>
          </div>

          <div>
            <p className="font-bold text-xs text-gray-600 uppercase mb-1">
              Full Price Code
            </p>
            <DetailText label="Full Price Code">
              {firstPriceDetail?.fullPriceCode || ""}
            </DetailText>
          </div>
        </div>
      </div>

      <div className="w-full">
        <TableRBI
          dataSource={dataSource}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={prabill_sa_detail?.saPriceRule?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 1000 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading_prabill_sa.saPriceRule}
        />
      </div>
    </>
  );
};

export default SaPricingSection;