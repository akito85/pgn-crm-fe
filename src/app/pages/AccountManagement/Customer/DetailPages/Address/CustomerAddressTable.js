import React from "react";
import { Tooltip } from "antd";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";
import StatusComponent from "../../../../../../components/StatusComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CustomerAddressDetail from "./CustomerAddressDetail";
import Highlighter from "react-highlight-words";
import { toTitleCase } from "../../../../../../utils";
// import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";

const CustomerAddressTable = ({
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
  handleSearch,
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
      title: "ADDRESS",
      dataIndex: "fullAddress",
      width: 300,
      sorter: true,
      ...getColumnSearchProps("fullAddress"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "fullAddress") {
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
      title: "TYPE",
      dataIndex: "type",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("type"),
    },
    {
      title: "BUILDING",
      dataIndex: "building",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("building"),
    },
    {
      title: "FLOOR",
      dataIndex: "floor",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("floor"),
    },
    {
      title: "HOUSE NAME",
      dataIndex: "houseName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("houseName"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "houseName") {
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
      title: "STREET NAME",
      dataIndex: "streetName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("streetName"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "streetName") {
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
      title: "BLOCK",
      dataIndex: "block",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("block"),
    },
    {
      title: "STREET NUMBER",
      dataIndex: "streetNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("streetNumber"),
    },
    {
      title: "HOUSE NUMBER",
      dataIndex: "houseNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("houseNumber"),
    },
    {
      title: "RT",
      dataIndex: "neighborhood1",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("neighborhood1"),
    },
    {
      title: "RW",
      dataIndex: "neighborhood2",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("neighborhood2"),
    },
    {
      title: "ADDITIONAL NOTE",
      dataIndex: "additionalInfo",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("additionalInfo"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "additionalInfo") {
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
      title: "POSTAL CODE",
      dataIndex: "postalCode",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchProps("postalCode"),
    },
    {
      title: "SUB DISTRICT",
      dataIndex: "subDistrict",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("subDistrict"),
    },
    {
      title: "DISTRICT",
      dataIndex: "district",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("district"),
    },
    {
      title: "CITY",
      dataIndex: "city",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("city"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "city") {
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
      title: "PROVINCE",
      dataIndex: "province",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("province"),
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("country"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 300,
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
      title: "PREMISE",
      dataIndex: "premiseFlag",
      width: 150,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("premiseFlag"),
      render: (text) => {
        const tempText = text === "Y" ? "YES" : "NO";
        if (searchedColumn === "premiseFlag") {
          return (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={tempText ? tempText.toString() : ""}
            />
          );
        } else {
          return tempText;
        }
      },
    },
    {
      title: "BUSINESS PURPOSE",
      dataIndex: "businessPurpose",
      width: 350,
      sorter: true,
      ...getColumnSearchProps("businessPurpose"),
      render: (businessPurpose) => (
        <div className={" flex justify-center"}>
          <div className="mx-1">
            <StatusComponent colour={"main"}>{businessPurpose}</StatusComponent>
          </div>
        </div>
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
        dataSource={data?.map((item, index) => ({
          ...item,
          primaryFlag: item?.primaryFlag === true ? "Primary" : "Non Primary",
        }))}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 3000 }}
        onSort={onSort}
        columns={columns}
      />

      {/* detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Address"
        width={800}
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
        <CustomerAddressDetail data_detail={dataDetail} />
      </ModalCustom>
    </Fragment>
  );
};

export default CustomerAddressTable;
