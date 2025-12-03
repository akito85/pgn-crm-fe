import React from "react";
import { Checkbox, Tooltip } from "antd";
import { Link } from "react-router-dom";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import StatusComponent from "../../../../../../components/StatusComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import Highlighter from "react-highlight-words";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";

const PremiseTable = ({
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
  handleInactive = () => {},
  handleUpdate = () => {},
  idAccount = 0,
  idCustomer = 0,
  type = "",
  accessAccount,
  accessServicePoint,
}) => {
  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  const itemActionExpand = [
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_SERVICE_POINT}
                state={{
                  id: record?.servicePointId,
                  idAccount: idAccount,
                  idCustomer: idCustomer,
                  type: type,
                  status: record?.status,
                }}
              >
                <SVGIcon name="IconDetail" color={"#0075bf"} width={24} />
              </Link>
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Edit">
            <div
              className={`flex justify-center pt-1${
                record.status === "INACTIVE" ? " cursor-not-allowed" : ""
              }`}
            >
              <SVGIcon
                name="IconEdit"
                width={24}
                className={
                  record.status === "INACTIVE" ? "disabled" : undefined
                }
                onClick={
                  record.status !== "INACTIVE"
                    ? () => handleUpdate(record)
                    : undefined
                }
                color={record?.status === "INACTIVE" ? "#8D91A0" : "#ACC424"}
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
            title={`${record?.status === "ACTIVE" ? "Inactive" : "Activate"}`}
          >
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleInactive(record);
                }}
                checked={record.status === "INACTIVE" ? true : false}
                disabled={record?.status === "INACTIVE" ? true : false}
              ></Checkbox>
            </div>
          </Tooltip>
        );
      },
    },
  ];
  const columnAdjust = useColumnActionPermissionAccount(
    ["Activate", "View", "Update"],
    itemActionExpand,
    accessServicePoint,
  );
  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => {},
    ) => {
      return [
        {
          title: "NO",
          align: "center",
          width: 60,
          render: (text, object, index) => index + 1,
        },
        {
          title: "SERVICE POINT NAME",
          dataIndex: "servicePointName",
          width: 250,
          ...getColumnSearchProps(
            "servicePointName",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
        },
        {
          title: "DESCRIPTION",
          dataIndex: "description",
          width: 250,
          ...getColumnSearchProps(
            "description",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
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
        // {
        //   title: "ASSET SERIAL NUMBER",
        //   dataIndex: "assetSerialNumber",
        //   width: 250,
        //   ...getColumnSearchProps(
        //     "assetSerialNumber",
        //     searchInput,
        //     searchedColumn,
        //     searchText,
        //     handleSearch
        //   ),
        // },
        // {
        //   title: "ASSET NAME",
        //   dataIndex: "assetName",
        //   align: "center",
        //   width: 150,
        //   ...getColumnSearchProps(
        //     "assetName",
        //     searchInput,
        //     searchedColumn,
        //     searchText,
        //     handleSearch
        //   ),
        // },
        // {
        //   title: "INSTALLED DATE",
        //   dataIndex: "installedDate",
        //   align: "center",
        //   width: 200,
        //   ...getColumnSearchProps(
        //     "installedDate",
        //     "date",
        //     searchInput,
        //     searchedColumn,
        //     searchText,
        //     handleSearch
        //   ),
        //   render: (installedDate) => renderDate(installedDate),
        // },
        {
          title: "STATUS",
          dataIndex: "status",
          width: 100,
          ...getColumnSearchProps(
            "status",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
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
        // {
        //   title: "ACTION",
        //   dataIndex: "operation",
        //   width: 100,
        //   align: "center",
        //   render: (_, record) => {
        //     return (
        //       <div className="flex w-full justify-center gap-6">
        //         <Tooltip title="Detail">
        //           <div className="pt-1">
        //             <Link
        //               to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_SERVICE_POINT}
        //               state={{
        //                 id: record?.servicePointId,
        //                 idAccount: idAccount,
        //                 idCustomer: idCustomer,
        //                 type: type,
        //                 status: record?.status,
        //               }}
        //             >
        //               <SVGIcon name="IconDetail" color={"#0075bf"} width={24} />
        //             </Link>
        //           </div>
        //         </Tooltip>
        //         <Tooltip title="Edit">
        //           <div
        //             className={`flex justify-center pt-1${
        //               record.status === "INACTIVE" ? " cursor-not-allowed" : ""
        //             }`}
        //           >
        //             <SVGIcon
        //               name="IconEdit"
        //               width={24}
        //               className={
        //                 record.status === "INACTIVE" ? "disabled" : undefined
        //               }
        //               onClick={
        //                 record.status !== "INACTIVE"
        //                   ? () => handleUpdate(record)
        //                   : undefined
        //               }
        //               color={
        //                 record?.status === "INACTIVE" ? "#8D91A0" : "#ACC424"
        //               }
        //             />
        //           </div>
        //         </Tooltip>
        //         <Tooltip
        //           title={`${
        //             record?.status === "ACTIVE" ? "Inactive" : "Activate"
        //           }`}
        //         >
        //           <div className="pt-1">
        //             <Checkbox
        //               onClick={() => {
        //                 handleInactive(record);
        //               }}
        //               checked={record.status === "INACTIVE" ? true : false}
        //               disabled={record?.status === "INACTIVE" ? true : false}
        //             ></Checkbox>
        //           </div>
        //         </Tooltip>
        //       </div>
        //     );
        //   },
        // },
      ];
    };

    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase">
          SERVICE POINT
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record?.servicePoint}
          columns={[...columns(), ...columnAdjust]}
          tableScrolled={{
            x: 1000,
          }}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ADDRESS",
      dataIndex: "fullAddress",
      width: "75%",
      sorter: true,
      ...getColumnSearchProps("fullAddress"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "fullAddress" ? (
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
      title: "STATUS",
      width: "25%",
      dataIndex: "status",
      sorter: true,
      ...getColumnSearchProps("status"),
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
    // {
    //   title: "ACTION",
    //   align: "center",
    //   width: 100,
    //   fixed: "right",
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex w-full justify-center gap-6">
    //         <Link
    //           to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_PREMISE}
    //           state={{
    //             id: idAccount,
    //             premiseId: r.id,
    //             idCustomer: idCustomer,
    //             type: type,
    //           }}
    //         >
    //           <Tooltip title="detail">
    //             <div className="pt-1">
    //               <SVGIcon name="IconDetail" color={"#0075bf"} width={24} />
    //             </div>
    //           </Tooltip>
    //         </Link>
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
          <Link
            to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_PREMISE}
            state={{
              id: idAccount,
              premiseId: record.id,
              idCustomer: idCustomer,
              type: type,
            }}
          >
            <Tooltip title="detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" color={"#0075bf"} width={24} />
              </div>
            </Tooltip>
          </Link>
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
        tableScrolled={{
          x: 1500,
          y: 300,
        }}
        expandable={{ expandedRowRender }}
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
    </Fragment>
  );
};

export default PremiseTable;
