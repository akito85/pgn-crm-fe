import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { DatePicker, Input, Spin } from "antd";
import moment from "moment";
import BillingBucketTable from "./BillingBucketTable";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../../utils";
import { getBillingBucket } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { FilterOutlined } from "@ant-design/icons";

const BillingBucket = ({ id = 0 }) => {
  const dispatch = useDispatch();
  const { data_billingBucket, loading } = useSelector(
    (state) => state.financialInformation,
  );

  //declare
  const searchInput = useRef(null);

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [dataTable, setDataTable] = useState([]);

  //useEffect
  useEffect(() => {
    if (id) {
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
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getBillingBucket({ id, page, pageSize, sort, search: reqSearch }),
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  //useEffect
  useEffect(() => {
    if (
      id &&
      data_billingBucket &&
      data_billingBucket.result
      // && data_billingBucket.result.length > 0
    ) {
      setTotalElement(data_billingBucket?.page?.totalElements);
      const data = data_billingBucket?.result?.map((billingBucket, index) => ({
        ...billingBucket,
        key: index + 1,
        details: (billingBucket?.details || []).map((details, index) => ({
          ...details,
          key: index + 1,
        })),
      }));
      setDataTable(data);
    } else {
      setDataTable([]);
    }
  }, [data_billingBucket]);

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    if (dataIndex !== "priority") {
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
    } else {
      const tempSearchedText = "YES".includes(selectedKeys[0] || "")
        ? "Y"
        : "N";
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      // setSearch(
      //   selectedKeys.length === 0 ? "" : `${dataIndex}~${tempSearchedText}`
      // );
      setSearch((prevState) => {
        if (prevState[dataIndex] !== selectedKeys[0]) {
          setPage(1);
        }
        return {
          ...prevState,
          [dataIndex]: tempSearchedText,
        };
      });
    }
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <Spin spinning={loading} className={"w-full top-20"}>
      <Fragment>
        <div className="text-primary text-xs font-bold uppercase mb-5">
          {"BILLING BUCKET LIST"}
        </div>

        <BillingBucketTable
          data={dataTable}
          handleChange={handleChange}
          handleChangeSize={handleChangeSize}
          totalElement={totalElement}
          page={page}
          pageSize={pageSize}
          onSort={onSort}
          searchText={searchText}
          searchedColumn={searchedColumn}
          getColumnSearchProps={getColumnSearchProps}
        />
      </Fragment>
    </Spin>
  );
};

export default BillingBucket;
