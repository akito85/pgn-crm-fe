import React, { useEffect, useRef } from "react";
import {
  FilterOutlined,
} from "@ant-design/icons";
import { Collapse, DatePicker, Input, Space, Spin, Switch } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import TaxRelationTable from "./TaxRelationTable";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import { getChooseTaxRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";

const TaxRelationChooseAccount = ({
  handleChooseAccount = () => {},
  dispatch = () => {},
  id = 0,
}) => {
  const { data_choose_taxRelation, loading } = useSelector(
    (state) => state.financialInformation
  );

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, updateSearch] = useState({});

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

    dispatch(getChooseTaxRelation({ id, page, pageSize, sort, search: tempSearch }));
  }, [id, page, pageSize, sort, search]);

  useEffect(() => {
    if (
      data_choose_taxRelation &&
      data_choose_taxRelation.result &&
      data_choose_taxRelation.result.length > 0
    ) {
      setTotalElement(data_choose_taxRelation?.page?.totalElements);
    }
  }, [data_choose_taxRelation]);

  //handle on-changes listener
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
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
      <Spin spinning={loading}>
        <div className="text-primary text-xs font-bold uppercase mb-5">
          {"Account List"}
        </div>
        <div>
          <TaxRelationTable
            data={data_choose_taxRelation?.result}
            handleChooseAccount={handleChooseAccount}
            handleChange={handleChange}
            handleChangeSize={handleChangeSize}
            totalElement={totalElement}
            page={page}
            pageSize={pageSize}
            onSort={onSort}
            getColumnSearchProps={getColumnSearchProps}
          />
        </div>
      </Spin>
    </Fragment>
  );
};

export default TaxRelationChooseAccount;
