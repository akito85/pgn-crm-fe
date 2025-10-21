import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
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
import TablePaginationNew from "../../../../../components/TablePaginationNew";

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
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <Fragment>
      <BaseContainer header={"billing information"}>
        <div className={"w-full grid grid-cols-4 gap-4"}>
          <DetailText label={"Billing Code"}>
            {data_prevBilling?.billingCode}
          </DetailText>
          <DetailText label={"Transaction Date"}>
            {data_prevBilling?.transactionDate
              ? moment(data_prevBilling?.transactionDate).format(
                  dateFormatting.date,
                )
              : "-"}
          </DetailText>
          <DetailText label={"Total Amount IDR"}>
            {currencyFormatting(data_prevBilling?.totalAmountIdr, "idr")}
          </DetailText>
          <DetailText label={"Total Amount USD"}>
            {currencyFormatting(data_prevBilling?.totalAmountUsd, "usd")}
          </DetailText>
          <DetailText label={"UOM"}>{data_prevBilling?.uom}</DetailText>
          <DetailText label={"Min Contract"}>
            {numberFormatting(data_prevBilling?.minContract)}
          </DetailText>
          <DetailText label={"Max Contract"}>
            {numberFormatting(data_prevBilling?.maxContract)}
          </DetailText>
          <DetailText label={"Total Usage"}>
            {numberFormatting(data_prevBilling?.totalUsage)}
          </DetailText>
          <DetailText label={"Basic Bill IDR"}>
            {currencyFormatting(data_prevBilling?.basicBillingIdr, "idr")}
          </DetailText>
          <DetailText label={"Basic Bill USD"}>
            {currencyFormatting(data_prevBilling?.basicBillingUsd, "usd")}
          </DetailText>
          <DetailText label={"Other Bill IDR"}>
            {currencyFormatting(data_prevBilling?.otherBillIdr, "idr")}
          </DetailText>
          <DetailText label={"Other Bill USD"}>
            {currencyFormatting(data_prevBilling?.otherBillUsd, "usd")}
          </DetailText>
          <DetailText label={"Withholding Tax"}>
            {currencyFormatting(
              data_prevBilling?.withHoldingTax?.toString(),
              "idr",
            )}
          </DetailText>
          <DetailText label={"Prev Withholding Tax"}>
            {currencyFormatting(data_prevBilling?.prevWithHoldingTax, "idr")}
          </DetailText>
          <DetailText label={"Discount IDR"}>
            {currencyFormatting(data_prevBilling?.discountAmountIdr, "idr")}
          </DetailText>
          <DetailText label={"Discount USD"}>
            {currencyFormatting(data_prevBilling?.discountAmountUsd, "usd")}
          </DetailText>
          <DetailText label={"Tax Basis IDR"}>
            {currencyFormatting(data_prevBilling?.taxBasicIdr, "idr")}
          </DetailText>
          <DetailText label={"Tax Basis USD"}>
            {currencyFormatting(data_prevBilling?.taxBasicUsd, "usd")}
          </DetailText>
          <DetailText label={"Tax Basis Eqv IDR"}>
            {currencyFormatting(data_prevBilling?.taxBasicEqvIdr, "idr")}
          </DetailText>
          <DetailText label={"VAT IDR"}>
            {currencyFormatting(data_prevBilling?.vatIdr, "idr")}
          </DetailText>
          <DetailText label={"VAT USD"}>
            {currencyFormatting(data_prevBilling?.vatUsd, "usd")}
          </DetailText>
          <DetailText label={"VAT Eqv IDR"}>
            {currencyFormatting(data_prevBilling?.vatEqvIdr, "idr")}
          </DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"Billing Item Information"}>
        <div className="w-full">
          <TablePaginationNew
            dataSource={dataSource}
            columns={columnsBillingItem(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              search,
            )}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data_billingItem?.page?.totalElements || 0}
            onSort={onSortApi}
            tableScrolled={{ y: 525, x: 4500 }}
          />
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default PrevBillingTab;
