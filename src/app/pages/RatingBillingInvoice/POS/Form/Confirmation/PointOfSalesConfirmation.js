import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import { currencyFormatting } from "../../../../../../utils/formatCurrency";
import { useState } from "react";
import RadioTabs from "../../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../../utils";
import { columnsTablePOSDetailInfo } from "../../Table/TablePOSDetailInfo";
import TablePaginationNewTablePOS from "../../Table/TablePaginationNewTablePOS";
import { renderDate } from "../../Utils";

const listDetailPage = [
  { value: "Detail" },
  { value: "Promo", disabled: true },
];

const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value?.toLowerCase();
  switch (dataIndex) {
    case "price":
    case "quantity":
    case "amount":
    case "amountEqvIdr":
    case "amountEqvUsd":
    case "eqvIdrTaxPurpose":
    case "discount":
    case "total":
    case "totalEqvIdr":
    case "totalEqvUsd":
      const tempValue = record[dataIndex]
        ? (record[dataIndex] + "").split(".")
        : [];
      const thousandSeparator = ".";
      const decimalSeparator = ",";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const format =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : "";
      return format.toLowerCase().includes(fixSearchText);

    default:
      return record[dataIndex]?.toLowerCase().includes(fixSearchText);
  }
};

// Sorting Table
const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        // const tempValue = obj[fieldSort]
        //   ? (obj[fieldSort] + "").split(".")
        //   : [];
        // const thousandSeparator = ".";
        // const decimalSeparator = ",";
        // const descimal = tempValue[1]
        //   ? `${decimalSeparator}${tempValue[1]}`
        //   : `${decimalSeparator}00`;
        // const format =
        //   tempValue.length > 0
        //     ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        //       descimal
        //     : "";
        return obj[fieldSort] ? (obj[fieldSort] || 0)?.toString()?.toLowerCase() : "0" ;
      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };

  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "price":
      case "quantity":
      case "amount":
      case "amountEqvIdr":
      case "amountEqvUsd":
      case "eqvIdr":
      case "discount":
      case "total":
      case "totalEqvIdr":
      case "totalEqvUsd":
        return Math.sign(parseInt(a) - parseInt(b))
      default:
        return a.localeCompare(b);
    }
  }

  return handleCompare(fa, fb);
};

const PointOfSalesConfirmation = ({
  dataConfirm = {},
  data_dynamic = {},
  posDetail = [],
}) => {
  const [detailPage, setDetailPage] = useState(listDetailPage[0].value);

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    // console.log("posDetail", posDetail);
    setData(posDetail);
  }, [posDetail]);
  // console.log("posDetail", posDetail);
  //filter data by page
  // const filterDataByPage = (typeData = "data") => {
  //   let result = [...posDetail];
  //   if (searchedColumn) {
  //     const fixSearchText = searchText.toLowerCase();
  //     result = result.filter((item) => {
  //       return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
  //     });
  //   }
  //   const handleDataSort = (obj) => {
  //     return obj[fieldSort]?.toLowerCase();
  //   };
  //   if (fieldSort) {
  //     result.sort((a, b) => {
  //       let fa = handleDataSort(a);
  //       let fb = handleDataSort(b);
  //       if (fa < fb) {
  //         return sort === "asc" ? -1 : 1;
  //       }
  //       if (fa > fb) {
  //         return sort === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   const fix = result.slice((page - 1) * pageSize, page * pageSize);
  //   return typeData === "data" ? fix : result.length;
  // };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
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
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleDetailPage = (e) => {
    setDetailPage(e.target.value);
  };

  const renderSection = () => {
    switch (detailPage) {
      case listDetailPage[0].value:
        return (
          <div className={"w-full mt-5"}>
            <TablePaginationNewTablePOS
              type="FE"
              dataSource={posDetail}
              totalData={posDetail.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              tableScrolled={{
                x: 5000,
                y: 300,
              }}
              setData={setData}
              columns={columnsTablePOSDetailInfo(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                () => {}, // handleUpdate,
                () => {}, // handleDelete,
                onFilter,
                sorter,
                data
              )}
            />
          </div>
        );
      case listDetailPage[1].value:
        return <></>;
      default:
        return <></>;
    }
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"CUSTOMER INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-4 gap-3">
        <DetailText label="Customer Number">
          {dataConfirm?.customerNumber}
        </DetailText>
        <DetailText label="Customer Name">
          {dataConfirm?.customerName}
        </DetailText>
        <DetailText label="Account Number">
          {dataConfirm?.accountNumber}
        </DetailText>
        <DetailText label="Account Name">{dataConfirm?.accountName}</DetailText>
      </div>
      <div className="w-full grid grid-cols-4 gap-3">
        <DetailText label="Account Segment">
          {dataConfirm?.accountSegment}
        </DetailText>
        <DetailText label="Account Group Type">
          {dataConfirm?.accountGroupType}
        </DetailText>
        <DetailText label="SOR">{dataConfirm?.sor}</DetailText>
      </div>
      <div className="w-full grid grid-cols-4 gap-3">
        <DetailText label="Cost Center Code">
          {dataConfirm?.costCenterCode}
        </DetailText>
        <DetailText label="Cost Center Name">
          {dataConfirm?.costCenterName}
        </DetailText>
        <DetailText label="Meter Reading Code">
          {dataConfirm?.meterReadingCode}
        </DetailText>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"BILLING DATE INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Billing Cycle">
          {dataConfirm?.billingCycle}
        </DetailText>
        <DetailText label="Billing Period">
          {dataConfirm?.billingPeriod}
        </DetailText>
        <DetailText label="Currency">{dataConfirm?.currency}</DetailText>
        <DetailText label="Transaction Date">
          {moment(dataConfirm?.transactionDate).format(dateFormatting.date)}
        </DetailText>
        <DetailText label="Invoice Date">
          {moment(dataConfirm?.invoiceDate).format(dateFormatting.date)}
        </DetailText>
        <DetailText label="Terms Of Payment">
          {moment.isMoment(dataConfirm?.termsOfPayment)
            ? moment(dataConfirm?.termsOfPayment).format(dateFormatting.date)
            : dataConfirm?.termsOfPayment}
        </DetailText>
        <div className="col-span-3">
          <DetailText label="Remark">{dataConfirm?.remark}</DetailText>
        </div>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"POINT OF SALES INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-4 gap-3">
        <DetailText label="Total Amount IDR">
          {currencyFormatting(data_dynamic?.totalAmountIdr || 0, "idr")}
        </DetailText>
        <DetailText label="Total Amount USD">
          {currencyFormatting(data_dynamic?.totalAmountUsd || 0, "usd")}
        </DetailText>
        <DetailText label="Amount IDR">
          {currencyFormatting(data_dynamic?.amountIdr || 0, "idr")}
        </DetailText>
        <DetailText label="Amount USD">
          {currencyFormatting(data_dynamic?.amountUsd || 0, "usd")}
        </DetailText>
        <DetailText label="Discount IDR">
          {currencyFormatting(data_dynamic?.discountAmountIdr || 0, "idr")}
        </DetailText>
        <DetailText label="Discount USD">
          {currencyFormatting(data_dynamic?.discountAmountUsd || 0, "usd")}
        </DetailText>

        {/* new */}
        <DetailText label="Tax Basis IDR">
          {currencyFormatting(data_dynamic?.taxBasisIdr || 0, "idr")}
        </DetailText>
        <DetailText label="Tax Basis USD">
          {currencyFormatting(data_dynamic?.taxBasisUsd || 0, "idr")}
        </DetailText>

        {/* <DetailText label="Tax Basis">
            {currencyFormatting(data_dynamic?.taxBasis || 0, "idr")}
          </DetailText> */}

        <DetailText label="Tax Basis Eqv IDR">
          {currencyFormatting(data_dynamic?.taxBasisEqvIdr || 0, "idr")}
        </DetailText>
        <DetailText label="VAT IDR">
          {currencyFormatting(data_dynamic?.vatIdr || 0, "idr")}
        </DetailText>
        <DetailText label="VAT USD">
          {currencyFormatting(data_dynamic?.vatUsd || 0, "idr")}
        </DetailText>
        <DetailText label="VAT Eqv IDR">
          {currencyFormatting(data_dynamic?.vatEqvIdr || 0, "idr")}
        </DetailText>
        <DetailText label="Witholding Tax">
          {currencyFormatting(data_dynamic?.withholdingTax || 0, "idr")}
        </DetailText>
        <DetailText label="Rate Type">{data_dynamic?.rateType}</DetailText>
        <DetailText label="Rate Date">
          {renderDate(data_dynamic?.rateDate)}
        </DetailText>
        <DetailText label="Rate">{data_dynamic?.rate}</DetailText>
        <DetailText label="Tax Rate Type">
          {data_dynamic?.taxRateType}
        </DetailText>
        <DetailText label="Tax Rate Date">
          {renderDate(data_dynamic?.taxRateDate)}
        </DetailText>
        <DetailText label="Tax Rate">{data_dynamic?.taxRate}</DetailText>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"POINT OF SALES DETAIL INFORMATION"}
      </div>
      <div className="mt-5">
        <RadioTabs data={listDetailPage} onChange={handleDetailPage} />
      </div>
      <div className={"w-full"}>{renderSection()}</div>
    </Fragment>
  );
};

export default PointOfSalesConfirmation;
