import React from "react";
import { Checkbox, Tooltip } from "antd";
import StatusComponent from "../../../../../../components/StatusComponent";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import ServicePointAssetDetail from "./ServicePointAssetDetail";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import Highlighter from "react-highlight-words";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";

const ServicePointAssetTable = ({
  handleInactive = () => { },
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  searchText,
  searchedColumn,
  status = false,
  getColumnSearchProps = () => { },
  access,
  search,
  searchInput,
  handleSearch = () => { }
}) => {
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const handleDetail = (value) => {
    setDataDetail(value);
    setModalDetail(true);
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
      title: "ASSET NAME",
      dataIndex: "assetName",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "assetName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
      render: (text) => renderColumn('assetName', hasValue(search['assetName']), searchText, text, false, 'input', search)
    },
    {
      title: "SERIAL NUMBER",
      dataIndex: "serialNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serialNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
      render: (text) => renderColumn('serialNumber', hasValue(search['serialNumber']), searchText, text, false, 'input', search)
    },
    {
      title: "ASSET TYPE",
      dataIndex: "type",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
      render: (text) => renderColumn('type', hasValue(search['type']), searchText, text, false, 'input', search)
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
      render: (text) => renderColumn('productName', hasValue(search['productName']), searchText, text, false, 'input', search)
    },
    {
      title: "BRAND",
      dataIndex: "brand",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "brand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
      render: (text) => renderColumn('brand', hasValue(search['brand']), searchText, text, false, 'input', search)
    },
    {
      title: "INSTALL DATE",
      width: 200,
      dataIndex: "installDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "installDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'date'
      ),
      render: (index) => renderDateColumn('installDate', hasValue(search['installDate']), searchText, index, 'date', search)
    },
    {
      title: "UNINSTALL DATE",
      width: 200,
      dataIndex: "unInstallDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "unInstallDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'date'
      ),
      render: (index) => renderDateColumn('unInstallDate', hasValue(search['unInstallDate']), searchText, index, 'date', search)
    },
    {
      title: "YEAR",
      dataIndex: "year",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "year",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'year_only'
      ),
      render: (index) => renderDateColumn('year', hasValue(search['year']), searchText, index?.toString(), 'year', search)
    },
    {
      title: "CUSTODY TRANSFER",
      dataIndex: "custodyTransfer",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "custodyTransfer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'yes_or_no'
      ),
      render: (text) => renderColumn('custodyTransfer', hasValue(search['custodyTransfer']), searchText, text, false, 'input', search)
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
        'input'
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
          <Tooltip placement="topLeft" title={text}>
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          </Tooltip>
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "INLET DIAMETER",
      dataIndex: "inletDiameter",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "inletDiameter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "OUTLET DIAMETER",
      dataIndex: "outletDiameter",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "outletDiameter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "MAXIMUM INLET PRESSURE",
      dataIndex: "maximumInletPressure",
      width: 300,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maximumInletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "MAXIMUM OUTLET PRESURE",
      dataIndex: "maximumOutletPressure",
      width: 300,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maximumOutletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "MINIMUM INLET PRESSURE",
      dataIndex: "minimumInletPressure",
      width: 300,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "minimumInletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "MINIMUM OUTLET PRESURE",
      dataIndex: "minimumOutletPressure",
      width: 300,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "minimumOutletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "MAX FLOW CAPACITY",
      dataIndex: "maxFlowCapacityPerStream",
      width: 300,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maxFlowCapacityPerStream",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "STREAM AMOUNT",
      dataIndex: "streamAmount",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "streamAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "G SIZE",
      dataIndex: "gsize",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gsize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "SETTING PRESSURE",
      dataIndex: "settingPressure",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "settingPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "LENGTH",
      dataIndex: "length",
      width: 150,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "length",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "BOLT HOLE AMOUNT",
      dataIndex: "boltHoleAmount",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "boltHoleAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "MINIMUM CAPACITY",
      dataIndex: "minimumCapacity",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "minimumCapacity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "MAXIMUM CAPACITY",
      dataIndex: "maximumCapacity",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maximumCapacity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    {
      title: "CLASS/ANSI",
      dataIndex: "ansi",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "ansi",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
    },
    // {
    //   title: "SOURCE",
    //   dataIndex: "source",
    //   width: 150,
    //   sorter: true,
    //   ...getColumnSearchPropsUseFilteredValue(
    //   search,
    //   "source",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   ''
    // ),
    // },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "remark") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'input'
      ),
      render: (index) => {
        const text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={index}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
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
          <Tooltip title={`${record.status === "ACTIVE" ? "Inactive" : "Active"}`}>
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleInactive(record);
                }}
                disabled={record.status === "INACTIVE" ? true : false || status}
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
        tableScrolled={{ y: 525, x: 1300 }}
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
        header="Detail Asset"
        width={900}
        handleCancel={() => {
          setModalDetail(false);
          setDataDetail({});
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
        <ServicePointAssetDetail data={dataDetail} />
      </ModalCustom>
    </Fragment>
  );
};

export default ServicePointAssetTable;
