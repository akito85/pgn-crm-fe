import React, { useEffect, useRef, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { getPaymentBilling } from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsPayment } from "./Table/TablePayment";
import { currencyFormatting } from "../../../../../utils/formatCurrency";
import TablePaginationNew from "../../../../../components/TablePaginationNew";

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
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect
  useEffect(() => {
    if (dataSource.length > 0) {
      setTotalElement(dataSource.length);
    }
  }, [dataSource]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const filterDataByPage = () => {
    let result = [...dataSource];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
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

  return (
    <Fragment>
      <BaseContainer header={"payment information"}>
        <div className="flex flex-row align-middle gap-2">
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Calculation Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {calculationCodeId}
          </p>
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Billing Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {billingCodeId}
          </p>
        </div>
        <div className={"w-full grid grid-cols-4 gap-4"}>
          <DetailText label={"Total Payment IDR"}>
            {currencyFormatting(data_Payment?.totalIdr, "idr")}
          </DetailText>
          <DetailText label={"Total Payment USD"}>
            {currencyFormatting(data_Payment?.totalUsd, "usd")}
          </DetailText>
          <DetailText label={"Total Payment Eqv IDR"}>
            {currencyFormatting(data_Payment?.totalEqvIdr, "idr")}
          </DetailText>
          <DetailText label={"Total Payment Eqv USD"}>
            {currencyFormatting(data_Payment?.totalEqvUsd, "usd")}
          </DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"payment detail information"}>
        <div className="w-full">
          <TablePaginationNew
            dataSource={filterDataByPage()}
            totalData={totalElements || 0}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columnsPayment(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              search,
            )}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 5000 }}
          />
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default PaymentTab;
