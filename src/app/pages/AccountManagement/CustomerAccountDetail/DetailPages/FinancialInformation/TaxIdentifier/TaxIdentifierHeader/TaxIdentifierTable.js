import React, { useEffect, useRef } from "react";
import { Tooltip } from "antd";
import { useState } from "react";
import TablePagination from "../../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import StatusComponent from "../../../../../../../../components/StatusComponent";
import TaxIdentifierDetail from "./TaxIdentifierDetail";
import ModalCustom from "../../../../../../../../components/Modal/ModalCustom";
import moment from "moment";
import Highlighter from "react-highlight-words";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import { useColumnActionPermissionAccount } from "../../../../../ComponentAccount/ColumnActionPermissionAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../utils/getColumnSearchProps";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../../../utils";

const TaxIdentifierTable = ({
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  searchText,
  searchedColumn,
  getColumnSearchProps = () => {},
  access,
  search,
  searchInput,
  handleSearch = () => {},
}) => {
  // state
  const [modalDetail, setModalDetail] = useState();
  const [dataDetail, setDataDetail] = useState("");

  const handleDetail = (record) => {
    setDataDetail(record);
  };

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };
  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TAX IDENTIFIER TYPE",
      dataIndex: "taxIdentifierTypeValue",
      // width: 200,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxIdentifierTypeValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "taxIdentifierTypeValue",
          hasValue(search["taxIdentifierTypeValue"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "TAX IDENTIFIER NUMBER",
      dataIndex: "taxIdentifierNumber",
      // width: 200,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxIdentifierNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "taxIdentifierNumber",
          hasValue(search["taxIdentifierNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "TAX IDENTIFIER NAME",
      dataIndex: "taxIdentifierName",
      // width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxIdentifierName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "taxIdentifierName",
          hasValue(search["taxIdentifierName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "TAX IDENTIFIER ADDRESS",
      dataIndex: "taxIdentifierAddressValue",
      width: 250,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxIdentifierAddressValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "taxIdentifierAddressValue",
          hasValue(search["taxIdentifierAddressValue"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "STATUS",
      width: 100,
      dataIndex: "status",
      fixed: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "status",
          search,
        ),
    },
  ];

  const itemActions = [
    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  handleDetail(record);
                  setModalDetail(true);
                }}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 1700 }}
        onSort={onSort}
        columns={[
          ...columns,
          ...useColumnActionPermissionAccount(["View"], itemActions, access),
        ]}
      />

      {/* modal detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Tax Identifier"
        width={900}
        handleCancel={() => {
          setModalDetail(false);
        }}
        footer={
          <div className="w-full flex justify-end">
            <ButtonComponent
              type="default"
              onClick={() => {
                setModalDetail(false);
              }}
            >
              Back
            </ButtonComponent>
          </div>
        }
      >
        <TaxIdentifierDetail data_detail={dataDetail} />
      </ModalCustom>
    </Fragment>
  );
};

export default TaxIdentifierTable;
