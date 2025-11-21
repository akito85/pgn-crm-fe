import React, { useEffect, useRef } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { Collapse, Space, Switch, Form, DatePicker, Input, Spin } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import PaymentRelationTable from "./PaymentRelationTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getTaxImplication,
  getDetailTaxImplication,
} from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import DetailPaymentRelation from "./DetailPaymentRelation";

// getDetailTaxImplication
// detail_taxImplication

const TaxImplication = ({ id = 0 }) => {
  const dispatch = useDispatch();
  const { data_paymentRelation, detail_paymentRelation, loading } = useSelector(
    (state) => state.financialInformation,
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
  const [modalDetail, setModalDetail] = useState(false);

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
        getTaxImplication({ id, page, pageSize, sort, search: reqSearch }),
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    if (
      data_paymentRelation &&
      data_paymentRelation.result &&
      data_paymentRelation.result.length > 0
    ) {
      setTotalElement(data_paymentRelation?.page?.totalElements);
    }
  }, [data_paymentRelation]);

  const handleDetail = (record) => {
    const id = record.id;
    setModalDetail(true);
    dispatch(getDetailTaxImplication(id))
      .unwrap()
      .then((data) => {})
      .catch((err) => {});
  };

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
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"TAX IMPLICATION LIST"}
      </div>

      <div>
        <PaymentRelationTable
          data={data_paymentRelation?.result}
          handleChange={handleChange}
          handleChangeSize={handleChangeSize}
          totalElement={totalElement}
          page={page}
          pageSize={pageSize}
          searchText={searchText}
          searchedColumn={searchedColumn}
          onSort={onSort}
          getColumnSearchProps={getColumnSearchProps}
          handleDetail={handleDetail}
          setModalDetail={setModalDetail}
        />
      </div>

      {/* Modal detail tax implication */}
      {modalDetail ? (
        <PaymentRelationTable
          setModalDetail={setModalDetail}
          modalDetail={modalDetail}
        />
      ) : null}
    </Fragment>
  );
};

export default TaxImplication;
