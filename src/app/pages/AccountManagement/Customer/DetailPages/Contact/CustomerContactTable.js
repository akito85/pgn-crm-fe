import React from "react";
import { Tooltip } from "antd";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import CustomerContactDetail from "./CustomerContactDetail";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import StatusComponent from "../../../../../../components/StatusComponent";
import Highlighter from "react-highlight-words";
import { toTitleCase } from "../../../../../../utils";

const CustomerContactTable = ({
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
}) => {
  //state
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});

  //handle

  const handleDetail = (value) => {
    setDataDetail(value);
  };

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => {}
    ) => {
      return [
        {
          title: "NO",
          align: "center",
          width: 60,
          render: (text, object, index) => index + 1,
        },
        {
          title: "TYPE",
          dataIndex: "typeName",
          key: "typeName",
          ...getColumnSearchProps(
            "typeName",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
        {
          title: "VALUE",
          dataIndex: "fullValue",
          key: "fullValue",
          ...getColumnSearchProps(
            "fullValue",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          ),
        },
      ];
    };
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase">
          CONTACT DETAIL
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record?.contactDetails || []}
          columns={columns()}
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
      title: "PRIMARY",
      dataIndex: "primaryFlag",
      width: 150,
      sorter: true,
      // sorter: (a, b) => sorterFunction('primaryFlag', a, b),
      align: "center",
      ...getColumnSearchProps("primaryFlag"),
      // ...getColumnSearchProps(
      //   "primaryFlag",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true,
      //   'status'
      // ),
      render: (index) => {
        let text;
        switch (index) {
          case true:
            text = "Primary";
            break;
          case false:
            text = "Non Primary";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className={"flex justify-center"}>
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("contactName"),
    },
    {
      title: "JOB",
      dataIndex: "jobName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("jobName"),
    },
    {
      title: "POSITION",
      dataIndex: "positionName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("positionname"),
    },
    {
      title: "CONTACT ADDRESS",
      dataIndex: "contactAddress",
      width: 350,
      sorter: true,
      ...getColumnSearchProps("contactAddress"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "contactAddress") {
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
      title: "Contact Address Additional Note"?.toUpperCase(),
      dataIndex: "additionalNote",
      width: 340,
      sorter: true,
      ...getColumnSearchProps("additionalNote"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "additionalNote") {
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
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("description"),
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
      title: "STATUS",
      width: 150,
      dataIndex: "status",
      fixed: "right",
      sorter: true,
      ...getColumnSearchProps("status"),
      render: (index) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{toTitleCase(index)}</StatusComponent>
        </div>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleDetail(r);
                    setModalDetail(true);
                  }}
                />
              </div>
            </Tooltip>
          </div>
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
        expandable={{ expandedRowRender }}
        columns={columns}
      />

      {/* detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Contact"
        width={1000}
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
        <CustomerContactDetail data_detail={dataDetail} />
      </ModalCustom>
    </Fragment>
  );
};

export default CustomerContactTable;
