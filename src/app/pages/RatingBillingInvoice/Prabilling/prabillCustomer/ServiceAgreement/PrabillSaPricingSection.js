// File: PrabillSaPricingSection.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailText from "../../../../../../components/DetailText";
import TableRBI from "../../../../../../components/TableRBI";
import {
  getPrabillSaPriceRule,
  getPrabillSaPriceDet,
} from "../../../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

export const columnsPrabillPricingRule = (page = 1, pageSize = 10) => [
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
    align: "center",
    width: 120,
  },
  {
    title: "MIN",
    dataIndex: "min",
    key: "min",
    sorter: true,
    align: "right",
    width: 150,
    render: (val) => (val ? parseFloat(val).toLocaleString() : ""),
  },
  {
    title: "MAX",
    dataIndex: "max",
    key: "max",
    sorter: true,
    align: "right",
    width: 150,
    render: (val) => {
      if (!val) return "";
      if (isNaN(val)) return val;
      if (val === "0" || parseFloat(val) === 0) return "Unlimited";
      return parseFloat(val).toLocaleString();
    },
  },
  {
    title: "PRICE CODE",
    dataIndex: "priceCode",
    key: "priceCode",
    sorter: true,
    align: "center",
    width: 150,
  },
  {
    title: "PRICE CODE RULE",
    dataIndex: "priceCodeRule",
    key: "priceCodeRule",
    sorter: true,
    align: "center",
    width: 200,
  },
  {
    title: "VALUE",
    dataIndex: "value",
    key: "value",
    sorter: true,
    align: "right",
    width: 150,
    render: (val) =>
      val
        ? parseFloat(val).toLocaleString("en-US", {
            maximumFractionDigits: 4,
          })
        : "",
  },
  {
    title: "UOM",
    dataIndex: "uom",
    key: "uom",
    sorter: true,
    align: "center",
    width: 100,
  },
  {
    title: "CURRENCY",
    dataIndex: "priceCurrency",
    key: "priceCurrency",
    sorter: true,
    align: "center",
    width: 100,
  },
];

const PrabillSaPricingSection = ({ prabillSaId }) => {
  // Selector
  const { prabill_sa_detail, loading_prabill_sa } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = prabill_sa_detail?.saPriceRule?.result || [];
  const priceDet = prabill_sa_detail?.saPriceDet?.result?.[0] || null;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Use Effect
  useEffect(() => {
    if (prabillSaId) {
      dispatch(
        getPrabillSaPriceRule({
          prabillSaId,
          search: JSON.stringify(search),
          page: page - 1,
          size: pageSize,
          sort,
        })
      );
      dispatch(getPrabillSaPriceDet(prabillSaId));
    }
  }, [dispatch, prabillSaId, search, page, pageSize, sort]);

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
    () => columnsPrabillPricingRule(page, pageSize),
    [page, pageSize]
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
            <DetailText label="Price Code">
              {priceDet?.fullPriceCode || ""}
            </DetailText>
          </div>

          <div>
            <p className="font-bold text-xs text-gray-600 uppercase mb-1">
              Price Adjustment
            </p>
            <DetailText label="Price Adjustment">
              {priceDet?.pricingAdjustment || ""}
            </DetailText>
          </div>

          <div>
            <p className="font-bold text-xs text-gray-600 uppercase mb-1">
              Pricing Rule
            </p>
            <DetailText label="Pricing Rule">
              {priceDet?.priceCode || ""}
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
          tableScrolled={{ y: 525, x: 800 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading_prabill_sa?.saPriceRule}
        />
      </div>
    </>
  );
};

export default PrabillSaPricingSection;
