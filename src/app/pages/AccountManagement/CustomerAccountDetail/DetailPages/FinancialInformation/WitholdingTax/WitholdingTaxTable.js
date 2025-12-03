import React from "react";
import { Tooltip } from "antd";
import { useState } from "react";
import TablePagination from "../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import WitholdingTaxDetail from "./WitholdingTaxDetail";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { useColumnActionPermissionAccount } from "../../../../ComponentAccount/ColumnActionPermissionAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../../utils";

const WitholdingTaxTable = ({
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  searchText,
  searchedColumn,
  onSort = {},
  getColumnSearchProps = () => {},
  searchInput,
  search,
  handleSearch = () => {},
  access,
}) => {
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState("");

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  const handleDetail = (record) => {
    setDataDetail(record);
  };

  const columns = [
    {
      title: "NO",
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
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
      render: (index) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          index,
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
      render: (index) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          index,
          "date",
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
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
        tableScrolled={{ y: 525, x: 1300 }}
        onSort={onSort}
        columns={[
          ...columns,
          ...useColumnActionPermissionAccount(
            ["Activate", "View", "Update"],
            itemActions,
            access,
          ),
        ]}
      />

      {/* modal detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail WAPU"
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
        <WitholdingTaxDetail data_detail={dataDetail} />
      </ModalCustom>
    </Fragment>
  );
};

export default WitholdingTaxTable;
