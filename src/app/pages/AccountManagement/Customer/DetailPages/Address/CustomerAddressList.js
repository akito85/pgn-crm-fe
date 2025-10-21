import React, { useEffect, useRef } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Input } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { dateFormatting } from "../../../../../../utils";
import Highlighter from "react-highlight-words";
import moment from "moment";
import BaseContainer from "../../../../../../components/BaseContainer";
import CustomerAddressTable from "./CustomerAddressTable";
import { getListCustomerAddress } from "../../../../../../redux/slices/account_management/Customer/customerAccount";

const CustomerAddressList = ({ id = 0, dispatch = () => {} }) => {
  const { data_customerDetailAddress } = useSelector(
    (state) => state.customerAccount,
  );

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, updateSearch] = useState("");

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
      dispatch(
        getListCustomerAddress({
          id,
          page,
          pageSize,
          sort,
          search: tempSearch,
        }),
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    if (
      id &&
      data_customerDetailAddress &&
      data_customerDetailAddress.result
      // data_customerDetailAddress.result.length > 0
    ) {
      setTotalElement(data_customerDetailAddress?.page?.totalElements);
    }
  }, [data_customerDetailAddress]);

  //handle on-changes listener
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    if (dataIndex !== "premiseFlag" && dataIndex !== "primaryFlag") {
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      updateSearch((prevState) => {
        if (prevState[dataIndex] !== selectedKeys[0]) {
          setPage(1);
        }
        return {
          ...prevState,
          [dataIndex]: selectedKeys[0],
        };
      });
    } else {
      const tempSearchedText =
        selectedKeys[0] === "primary"
          ? "Y"
          : selectedKeys[0] === "non primary"
            ? "N"
            : "";
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      updateSearch((prevState) => {
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
        text || ""
      ),
  });

  const handleChange = (page) => {
    setPage(page);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  return (
    <Fragment>
      <BaseContainer header={"CUSTOMER ADDRESS LIST"}>
        <CustomerAddressTable
          data={data_customerDetailAddress?.result}
          handleChange={handleChange}
          handleChangeSize={handleChangeSize}
          totalElement={totalElement}
          page={page}
          pageSize={pageSize}
          searchText={searchText}
          searchedColumn={searchedColumn}
          onSort={onSort}
          getColumnSearchProps={getColumnSearchProps}
          searchInput={searchInput}
          handleSearch={handleSearch}
        />
      </BaseContainer>
    </Fragment>
  );
};

export default CustomerAddressList;
