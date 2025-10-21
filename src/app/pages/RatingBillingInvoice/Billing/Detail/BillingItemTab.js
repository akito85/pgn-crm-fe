import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import TablePagination from "../../../../../components/TablePagination";
import {
  getAllBillingItemPaginate,
  getAllRatingResultPaginate,
} from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsBillingItem } from "./Table/TableBillingItem";
import { columnsRatingResult } from "./Table/TableRatingResult";
import TablePaginationNew from "../../../../../components/TablePaginationNew";

const BillingItemTab = ({ billingCodeId, ratingCodeId, calculationCodeId }) => {
  // Selector
  const { data_billingItem, data_ratingResult } = useSelector(
    (state) => state.billing,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSourceBI = data_billingItem?.result;
  const dataSourceRR = data_ratingResult?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [pageBI, setPageBI] = useState(1);
  const [pageSizeBI, setPageSizeBI] = useState(10);
  const [searchedColumnBI, setSearchedColumnBI] = useState("");
  const [searchTextBI, setSearchTextBI] = useState("");
  const [sortBI, setSortBI] = useState("");
  const [searchBI, setSearchBI] = useState({});

  const [tabHeader, setTabHeader] = useState("Rating Result");

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
      getAllRatingResultPaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page: page,
        pageSize: pageSize,
        sort: sort,
      }),
    );
  }, [dispatch, ratingCodeId, search, page, pageSize, sort]);

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllBillingItemPaginate({
        billingCodeId,
        searchBI: encodeURIComponent(JSON.stringify(searchBI)),
        pageBI,
        pageSizeBI,
        sortBI,
      }),
    );
  }, [dispatch, billingCodeId, searchBI, pageBI, pageSizeBI, sortBI]);

  // Function Search API
  const handleSearchBI = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextBI(selectedKeys[0]);
    setSearchedColumnBI(dataIndex);
    setSearchBI((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

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

  const handleChangeBI = (pageChange, pageSizeChange) => {
    setPageBI(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSizeBI(pageSizeChange);
  };

  // Sort Table
  const onSortApiBI = (_, __, sortBI) => {
    const dataSort =
      sortBI.order !== undefined
        ? `${sortBI.field}~${sortBI.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortBI(dataSort);
  };

  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // data tabs
  const dataTabs = [
    {
      label: "Rating Result",
      value: "Rating Result",
    },
    {
      label: "Promo",
      value: "Promo",
      disabled: true,
    },
  ];

  // change tabs
  const changeTabHeader = ({ target: { value } }) => {
    setTabHeader(value);
  };

  // render tabs item
  const renderLayout = (valueTab) => {
    switch (valueTab) {
      case "Rating Result":
        return (
          <BaseContainer header={"RATING RESULT INFORMATION"}>
            <div className="w-full">
              <TablePagination
                dataSource={dataSourceRR}
                columns={columnsRatingResult(
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
                totalData={data_ratingResult?.page?.totalElements}
                onSort={onSortApi}
                tableScrolled={{ y: 525, x: 1200 }}
              />
            </div>
          </BaseContainer>
        );
      case "Promo":
        return <BaseContainer header={"Promo Information"}></BaseContainer>;
      default:
        return (
          <BaseContainer header={"RATING RESULT INFORMATION"}>
            <div className="w-full">
              <TablePagination
                dataSource={dataSourceRR}
                columns={columnsRatingResult(
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
                totalData={data_ratingResult?.page?.totalElements}
                onSort={onSortApi}
                tableScrolled={{ y: 525, x: 1200 }}
              />
            </div>
          </BaseContainer>
        );
    }
  };

  return (
    <div>
      <BaseContainer header={"billing item information"}>
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
        <div className="w-full">
          <TablePaginationNew
            dataSource={dataSourceBI}
            columns={columnsBillingItem(
              pageBI,
              pageSizeBI,
              searchInput,
              searchedColumnBI,
              searchTextBI,
              handleSearchBI,
              searchBI,
            )}
            current={pageBI}
            pageSize={pageSizeBI}
            onChange={handleChangeBI}
            onSizeChanger={handleChangeBI}
            totalData={data_billingItem?.page?.totalElements || 0}
            onSort={onSortApiBI}
            tableScrolled={{ y: 525, x: 4500 }}
          />
        </div>
      </BaseContainer>

      <div className="pt-[30px]">
        <Radio.Group
          options={dataTabs}
          onChange={changeTabHeader}
          value={tabHeader}
          optionType="button"
          buttonStyle="solid"
          style={{ gap: 12, display: "flex" }}
        />
        {renderLayout(tabHeader)}
      </div>
    </div>
  );
};

export default BillingItemTab;
