import { Fragment } from "react";
import React, { useRef } from "react";
import moment from "moment";
import DetailText from "../../../../../../../components/DetailText";
import { useState } from "react";
import { dateFormatting, hasValue } from "../../../../../../../utils";
import TablePaginationNew from "../../../../../../../components/TablePaginationNew";
import columnsMapping from "../../Table/TableMappingInformation";
import columnsDetail from "../../Table/TableDetailMappingInformation";
import { useSelector } from "react-redux";

const onFilter = (dataIndex, value, record) => {
  const search = moment(value, dateFormatting.dateFormal, true).isValid()
    ? moment(value).format(dateFormatting.date).toLowerCase()
    : value.toLowerCase();
  switch (dataIndex) {
    case "startDate":
    case "endDate":
      const date = record[dataIndex]
        ? moment(record[dataIndex]).format("DD MMM YYYY")
        : "";
      return date.toString().toLowerCase().includes(search);
    case "fileSize":
      return record.size.includes(search);
    default:
      return record[dataIndex]?.toLowerCase().includes(search);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : null;
      // return date.toLowerCase();
      default:
        return `${obj[fieldSort]}`.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (a === null && b === null) return 0; // Both are null, consider equal
        if (a === null) return 1; // `a` is null, place it as greater (bottom)
        if (b === null) return -1; // `b` is null, place it as greater (bottom)
        if (hasValue(a) && hasValue(b)) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      default:
        return a.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

const sorterDetail = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : null;
      // return date.toLowerCase();
      default:
        return `${obj[fieldSort]}`.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (a === null && b === null) return 0; // Both are null, consider equal
        if (a === null) return 1; // `a` is null, place it as greater (bottom)
        if (b === null) return -1; // `b` is null, place it as greater (bottom)
        if (hasValue(a) && hasValue(b)) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      default:
        return a.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

const BillingItemFormConfirmation = ({ dataConfirm = {} }) => {
  const { data_billingItemCategoryDdl, data_billType } = useSelector(
    (state) => state.billing_item,
  );

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [detailMapping, setDetailMapping] = useState(false);
  const [category, setCategory] = useState("");
  const [dataDetailTable, setDataDetailTable] = useState([]);
  const [subHeader, setSubHeader] = useState("");

  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetail, setPageSizeDetail] = useState(10);
  const [searchedColumnDetail, setSearchedColumnDetail] = useState("");
  const [searchTextDetail, setSearchTextDetail] = useState("");
  const searchInputDetail = useRef(null);
  const [searchDetail, setSearchDetail] = useState({});

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

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    setPageDetail(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSizeDetail(pageSizeChange);
  };

  const handleSearchDetail = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextDetail(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumnDetail !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumnDetail(dataIndex);
    setSearchDetail((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleDetail = (e) => {
    if (e.category === category) {
      setDetailMapping(false);
      setCategory("");
    } else {
      setCategory(e.category);
      setSubHeader(
        dataConfirm.mappingInfo.filter(
          (item) => item.category === e.category,
        )[0]?.categoryName,
      );
      setDataDetailTable(
        dataConfirm?.mappingInfo?.filter(
          (item) => item.category === e.category,
        )[0]?.detail,
      );
      setDetailMapping(true);
    }
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"BILLING ITEM INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Billing Item Category">
          {
            (data_billingItemCategoryDdl || [])?.find(
              (item) => item.id === dataConfirm?.billingItemCategory,
            )?.name
          }
        </DetailText>
        <DetailText label="Name">{dataConfirm?.name}</DetailText>
        <DetailText label="Bill Type">
          {
            (data_billType || [])?.find(
              (item) => item.id === dataConfirm?.billType,
            )?.name
          }
        </DetailText>
        <DetailText label="Start Date">{dataConfirm?.startDate}</DetailText>
        <DetailText label="End Date">
          {dataConfirm?.endDate ? dataConfirm?.endDate : ""}
        </DetailText>

        <div className="col-span-3">
          <DetailText label="GL Account">{dataConfirm?.glAccount}</DetailText>
          <DetailText label="Description">
            {dataConfirm?.description}
          </DetailText>
        </div>

        <DetailText label="Late Charge Object">
          {dataConfirm?.lateCharge ? "Yes" : "No"}
        </DetailText>
        <DetailText label="Payment Warranty Deduction Object">
          {dataConfirm?.paymentWarranty ? "Yes" : "No"}
        </DetailText>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"MAPPING INFORMATION"}
      </div>

      <div className="w-full">
        <TablePaginationNew
          type="FE"
          dataSource={dataConfirm?.mappingInfo || []}
          totalData={dataConfirm?.mappingInfo.length}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          tableScrolled={{ y: 525, x: 2000 }}
          columns={columnsMapping(
            search,
            false,
            "detail",
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handleDetail,
            onFilter,
            sorter,
          )}
        />
      </div>

      {detailMapping ? (
        <div>
          <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
            {"DETAIL MAPPING INFORMATION"}
          </div>
          <div className="text-primary text-xs font-bold mt-3">
            {`Category: ${subHeader || ""}`}
          </div>
          <TablePaginationNew
            type="FE"
            dataSource={dataDetailTable || []}
            totalData={dataDetailTable?.length || 0}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            tableScrolled={{ y: 525, x: 2000 }}
            columns={columnsDetail(
              searchDetail,
              false,
              "detail",
              pageDetail,
              pageSizeDetail,
              searchInputDetail,
              searchedColumnDetail,
              searchTextDetail,
              handleSearchDetail,
              onFilter,
              sorterDetail,
            )?.filter((item) => !(item.title === "ACTION"))}
          />
        </div>
      ) : null}
    </Fragment>
  );
};

export default BillingItemFormConfirmation;
