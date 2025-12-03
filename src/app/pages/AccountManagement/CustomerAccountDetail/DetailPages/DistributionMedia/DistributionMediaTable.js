import React from "react";
import { Checkbox, Tooltip } from "antd";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import DistributionMediaDetail from "./DistributionMediaDetail";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";

const DistributionMediaTable = ({
  search,
  searchInput,
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  searchText,
  searchedColumn,
  handleInactive = () => {},
  getColumnSearchProps = () => {},
  setDistributionName,
  accessAccount,
  handleSearch = () => {},
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
    const data = {
      ...record,
      detail: record?.detail?.map((item) => {
        return {
          ...item,
          unitName: item.unit,
          description: item.detailDescription,
        };
      }),
    };
    setDataDetail(data);
  };

  const columns = [
    {
      title: "NO",
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "MEDIA",
      dataIndex: "productName",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productName",
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
          "productName",
          hasValue(search["productName"]),
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
      title: "REMARK",
      dataIndex: "remark",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
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
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "STATUS",
      width: 150,
      dataIndex: "status",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
    // {
    //   title: "ACTIONS",
    //   align: "center",
    //   width: 75,
    //   fixed: "right",
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex w-full justify-center gap-6">
    //         <Tooltip title="Detail">
    //           <div className="pt-1">
    //             <SVGIcon
    //               name="IconDetail"
    //               color={"#0075bf"}
    //               width={24}
    //               onClick={() => {
    //                 handleDetail(r);
    //                 setModalDetail(true);
    //               }}
    //             />
    //           </div>
    //         </Tooltip>
    //         <Tooltip title={`${r.status === "ACTIVE" ? "Inactive" : "Active"}`}>
    //           <div className="pt-1">
    //             <Checkbox
    //               onClick={() => {
    //                 handleInactive(r);
    //                 setDistributionName(r.productName)
    //               }}
    //               disabled={r.status === "INACTIVE" ? true : false}
    //               checked={r.status === "INACTIVE" ? true : false}
    //             ></Checkbox>
    //           </div>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
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

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip
            title={`${record.status === "ACTIVE" ? "Inactive" : "Active"}`}
          >
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleInactive(record);
                  setDistributionName(record.productName);
                }}
                disabled={record.status === "INACTIVE" ? true : false}
                checked={record.status === "INACTIVE" ? true : false}
              ></Checkbox>
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
            accessAccount,
          ),
        ]}
      />

      {/* modal detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Distribution Media"
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
        <DistributionMediaDetail data_detail={dataDetail} />
      </ModalCustom>
    </Fragment>
  );
};

export default DistributionMediaTable;
