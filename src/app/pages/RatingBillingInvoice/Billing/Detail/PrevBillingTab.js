import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import TableRBI from "../../../../../components/TableRBI";
import { columnsBillingItem } from "./Table/TableBillingItem";
import {
  getAllBillingItemPaginate,
  getPrevBilling,
} from "../../../../../redux/slices/rating_billing_invoice/billing";
import { dateFormatting } from "../../../../../utils";
import {
  currencyFormatting,
  numberFormatting,
} from "../../../../../utils/formatCurrency";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const PrevBillingTab = ({ billingCodeId, accountNumberId, saNumberId }) => {
  // Selector
  const { data_prevBilling, data_billingItem } = useSelector(
    (state) => state.billing,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_billingItem?.result;

  // State
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

  // Use Effect
  useEffect(() => {
    dispatch(
      getPrevBilling({
        idBillingCode: billingCodeId,
        idAccountNumber: accountNumberId,
        idSaNumber: saNumberId,
      }),
    );
  }, [accountNumberId, billingCodeId, dispatch, saNumberId]);

  useEffect(() => {
    dispatch(
      getAllBillingItemPaginate({
        billingCodeId,
        searchBI: encodeURIComponent(JSON.stringify(search)),
        pageBI: page,
        pageSizeBI: pageSize,
        sortBI: sort,
      }),
    );
  }, [dispatch, billingCodeId, search, page, pageSize, sort]);

  // Function Search API
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(() => {
    return columnsBillingItem(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    );
  }, [page, pageSize, searchedColumn, searchText, search]);

  const allColumns = useMemo(() => {
    return baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
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

  const InfoField = ({ label, value }) => (
    <div>
      <p className="text-[13px] text-gray-600 mb-1">{label}</p>
      <p className="text-[15px] font-normal text-gray-900">{value || "-"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Billing Information Section */}
      <div>
        <h3 className="text-sm font-bold text-primary uppercase mb-4">
          Billing Information
        </h3>

        <div className="grid grid-cols-4 gap-x-8 gap-y-4">
          <InfoField
            label="Billing Code"
            value={data_prevBilling?.billingCode}
          />
          <InfoField
            label="Transaction Date"
            value={
              data_prevBilling?.transactionDate
                ? moment(data_prevBilling?.transactionDate).format(
                    dateFormatting.date,
                  )
                : "-"
            }
          />
          <InfoField
            label="Total Amount IDR"
            value={currencyFormatting(data_prevBilling?.totalAmountIdr, "idr")}
          />
          <InfoField
            label="Total Amount USD"
            value={currencyFormatting(data_prevBilling?.totalAmountUsd, "usd")}
          />
          <InfoField label="UOM" value={data_prevBilling?.uom} />
          <InfoField
            label="Min Contract"
            value={numberFormatting(data_prevBilling?.minContract)}
          />
          <InfoField
            label="Max Contract"
            value={numberFormatting(data_prevBilling?.maxContract)}
          />
          <InfoField
            label="Total Usage"
            value={numberFormatting(data_prevBilling?.totalUsage)}
          />
          <InfoField
            label="Basic Bill IDR"
            value={currencyFormatting(data_prevBilling?.basicBillingIdr, "idr")}
          />
          <InfoField
            label="Basic Bill USD"
            value={currencyFormatting(data_prevBilling?.basicBillingUsd, "usd")}
          />
          <InfoField
            label="Other Bill IDR"
            value={currencyFormatting(data_prevBilling?.otherBillIdr, "idr")}
          />
          <InfoField
            label="Other Bill USD"
            value={currencyFormatting(data_prevBilling?.otherBillUsd, "usd")}
          />
          <InfoField
            label="Withholding Tax"
            value={currencyFormatting(
              data_prevBilling?.withHoldingTax?.toString(),
              "idr",
            )}
          />
          <InfoField
            label="Prev Withholding Tax"
            value={currencyFormatting(
              data_prevBilling?.prevWithHoldingTax,
              "idr",
            )}
          />
          <InfoField
            label="Discount IDR"
            value={currencyFormatting(
              data_prevBilling?.discountAmountIdr,
              "idr",
            )}
          />
          <InfoField
            label="Discount USD"
            value={currencyFormatting(
              data_prevBilling?.discountAmountUsd,
              "usd",
            )}
          />
          <InfoField
            label="Tax Basis IDR"
            value={currencyFormatting(data_prevBilling?.taxBasicIdr, "idr")}
          />
          <InfoField
            label="Tax Basis USD"
            value={currencyFormatting(data_prevBilling?.taxBasicUsd, "usd")}
          />
          <InfoField
            label="Tax Basis Eqv IDR"
            value={currencyFormatting(data_prevBilling?.taxBasicEqvIdr, "idr")}
          />
          <InfoField
            label="VAT IDR"
            value={currencyFormatting(data_prevBilling?.vatIdr, "idr")}
          />
          <InfoField
            label="VAT USD"
            value={currencyFormatting(data_prevBilling?.vatUsd, "usd")}
          />
          <InfoField
            label="VAT Eqv IDR"
            value={currencyFormatting(data_prevBilling?.vatEqvIdr, "idr")}
          />
        </div>
      </div>

      {/* Billing Item Information Section */}
      <div>
        <h3 className="text-sm font-bold text-primary uppercase mb-3">
          Billing Item Information
        </h3>

        <TableRBI
          size="small"
          dataSource={dataSource}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChangePage}
          onSizeChanger={handleChangePage}
          totalData={data_billingItem?.page?.totalElements || 0}
          tableScrolled={{ x: 4500, y: 525 }}
          onSort={onSort}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={false}
        />
      </div>
    </div>
  );
};

export default PrevBillingTab;
