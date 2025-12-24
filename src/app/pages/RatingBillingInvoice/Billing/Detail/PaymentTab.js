import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import DetailText from "../../../../../components/DetailText";
import { getPaymentBilling } from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsPayment } from "./Table/TablePayment";
import { currencyFormatting } from "../../../../../utils/formatCurrency";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const PaymentTab = ({ billingCodeId, calculationCodeId }) => {
  // Selector
  const { data_Payment } = useSelector((state) => state.billing);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_Payment?.receiptDetails || [];

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
    dispatch(getPaymentBilling(billingCodeId));
  }, [dispatch, billingCodeId]);

  // Function Search Column
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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(() => {
    return columnsPayment(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
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

  return (
    <div className="space-y-6">
      {/* Payment Information Section */}
      <div>
        <h3 className="text-sm text-primary uppercase mb-4">
          Payment Information
        </h3>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Calculation Code</p>
              <p className="text-[15px] text-primary">
                {calculationCodeId || "-"}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-gray-600 mb-1">
                Total Payment IDR
              </p>
              <p className="text-[15px] font-normal text-gray-900">
                {currencyFormatting(data_Payment?.totalIdr, "idr") ||
                  "0.00 IDR"}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-gray-600 mb-1">
                Total Payment EQV IDR
              </p>
              <p className="text-[15px] font-normal text-gray-900">
                {currencyFormatting(data_Payment?.totalEqvIdr, "idr") ||
                  "0.00 IDR"}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-gray-600 mb-1">Equivalent USD</p>
              <p className="text-[15px] font-normal text-gray-900">
                1000 (hardcode)
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Billing Code</p>
              <p className="text-[15px] text-primary">{billingCodeId || "-"}</p>
            </div>

            <div>
              <p className="text-[13px] text-gray-600 mb-1">
                Total Payment USD
              </p>
              <p className="text-[15px] font-normal text-gray-900">
                {currencyFormatting(data_Payment?.totalUsd, "usd") ||
                  "0.00 USD"}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-gray-600 mb-1">
                Total Payment EQV USD
              </p>
              <p className="text-[15px] font-normal text-gray-900">
                {currencyFormatting(data_Payment?.totalEqvUsd, "usd") ||
                  "0.00 USD"}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-gray-600 mb-1">Equivalent USD</p>
              <p className="text-[15px] font-normal text-gray-900">
                15000 (hardcode)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Detail Information Section */}
      <div>
        <h3 className="text-sm text-primary uppercase mb-3">
          Payment Detail Information
        </h3>

        <TableRBI
          size="small"
          dataSource={dataSource}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChangePage}
          onSizeChanger={handleChangePage}
          totalData={dataSource?.length || 0}
          tableScrolled={{ x: 5000, y: 525 }}
          onSort={onSort}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          showExport={false}
          setFixedColumns={setFixedColumns}
          loading={false}
        />
      </div>
    </div>
  );
};

export default PaymentTab;
