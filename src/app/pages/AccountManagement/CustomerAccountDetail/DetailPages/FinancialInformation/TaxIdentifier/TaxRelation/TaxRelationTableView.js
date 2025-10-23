import React, { useEffect, useRef } from "react";
import { Checkbox, Tooltip } from "antd";
import { useState } from "react";
import TablePagination from "../../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import StatusComponent from "../../../../../../../../components/StatusComponent";
import ModalCustom from "../../../../../../../../components/Modal/ModalCustom";
import TaxRelationDetail from "./TaxRelationDetail";
import Highlighter from "react-highlight-words";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import { useColumnActionPermissionAccount } from "../../../../../ComponentAccount/ColumnActionPermissionAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../../../utils";

const TaxRelationTableView = ({
  data = [],
  handleModalInactive = () => { },
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  searchText,
  searchedColumn,
  search,
  searchInput,
  handleSearch = () => { },
  setTaxRelationName,
  access
}) => {
  //useState
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
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      // width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input',
      ),
      render: (text) => renderColumn('accountNumber', hasValue(search['accountNumber']), searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input',
      ),
      render: (text) => renderColumn('accountName', hasValue(search['accountName']), searchText, text, false, 'input', search)
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
        'input',
      ),
      render: (text) => renderColumn('taxIdentifierNumber', hasValue(search['taxIdentifierNumber']), searchText, text, false, 'input', search)
    },
    {
      title: "TAX IDENTIFIER ADDRESS",
      dataIndex: "taxIdentifierAddressValue",
      // width: 200,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxIdentifierAddressValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input',
      ),
      ellipsis: {
        showTitle: true,
      },
      render: (text) => renderColumn('taxIdentifierAddressValue', hasValue(search['taxIdentifierAddressValue']), searchText, text, true, 'input', search)
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
      render: (text) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, text, 'date', search)
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
      render: (text) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, text, 'date', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      // width: 200,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input',
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      width: 100,
      dataIndex: "status",
      fixed: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input',
      ),
      render: (text) => renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
    },
    // {
    //   title: "ACTION",
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

    //                 // setModalConfirm(true);
    //               }}
    //             />
    //           </div>
    //         </Tooltip>
    //         <Tooltip title={`${r.status === "ACTIVE" ? "Activate" : "Inactivate"}`}>
    //           <div className="pt-1">
    //             <Checkbox
    //               onClick={() => {
    //                 handleModalInactive(true, r);
    //                 setTaxRelationName(r.accountName)
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
        )
      }
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title={`${record.status === "ACTIVE" ? "Activate" : "Inactivate"}`}>
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleModalInactive(true, record);
                  setTaxRelationName(record.accountName)
                }}
                disabled={record.status === "INACTIVE" ? true : false}
                checked={record.status === "INACTIVE" ? true : false}
              ></Checkbox>
            </div>
          </Tooltip>
        )
      }
    }
  ]

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 2500 }}
        onSort={onSort}
        columns={[
          ...columns,
          ...useColumnActionPermissionAccount(
            ["Activate", "View", "Update"],
            itemActions,
            access
          ),
        ]}
      />

      {/* modal detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Tax Relation"
        width={700}
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
        <TaxRelationDetail data_detail={dataDetail} />
      </ModalCustom>
    </Fragment>
  );
};

export default TaxRelationTableView;
