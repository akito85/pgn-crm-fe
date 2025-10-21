import React, { useState } from "react";
import DetailText from "../../../../components/DetailText";
import TablePagination from "../../../../components/TablePagination";
import { getBase64 } from "../../../../utils/getBase64";
import { Checkbox, Image, Input, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef } from "react";
import { intToNPWP } from "../../../../utils/npwp";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../utils";
import StatusComponent from "../../../../components/StatusComponent";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";

const EntityConfirmationLayout = (props) => {
  const { data, cols, type } = props;
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const column = [
    {
      title: "NO",
      dataIndex: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => {
        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      title: "TAX IDENTIFER",
      dataIndex: "taxNumber",
      editable: true,
      sorter: (a, b) => a.taxNumber - b.taxNumber,
      align: "left",
      ...getColumnSearchProps(
        "taxNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      width: 270,
      render: (text) => intToNPWP(text),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      editable: true,
      inputType: "date",
      align: "center",
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date",
      ),
      width: 160,
      render: (startDate) =>
        moment(startDate).format(dateFormatting.dateCapital),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      editable: true,
      inputType: "date",
      align: "center",
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date",
      ),
      width: 160,
      render: (endDate) => endDate || "",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      inputType: "description",
      editable: true,
      sorter: (a, b) => a.description?.localeCompare(b.description),
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
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
        ) : (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
    },
    {
      title: "PRIMARY",
      dataIndex: "isMain",
      editable: true,
      align: "center",
      inputType: "checkbox",
      width: 150,
      sorter: (a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1),
      ...getColumnSearchProps(
        "isMain",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "status",
      ),
      render: (isMain) => {
        // const statusRender = isMain === true ? "Primary" : "Non Primary";
        // const colorRender = isMain === true ? "primary" : "non-primary";
        return (
          <div className={" flex justify-center"}>
            <StatusComponent colour={isMain}>{isMain}</StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      editable: false,
      width: 120,
      sorter: (a, b) => a.status?.localeCompare(b.status),
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "status",
      ),
      render: (status, i, render) => {
        const statusRender = i?.isMain === true ? "ACTIVE" : "INACTIVE";
        return (
          <div className={" flex justify-center"}>
            <StatusComponent colour={status}>
              {toTitleCase(status)}
            </StatusComponent>
          </div>
        );
      },
    },
  ];

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // pagination table
  const paginationTable = (page, pageSize) => {
    return data?.taxIdentifier
      ?.slice((page - 1) * pageSize, page * pageSize)
      ?.map((item) => ({
        ...item,
        isMain: item?.isMain === true ? "Primary" : "Non Primary",
      }));
  };

  return (
    <div className={"w-full flex flex-col gap-5"}>
      <span className="text-primary uppercase">Entity Information</span>
      <div className={"w-full px-12"}>
        <div className={"w-full grid grid-cols-3 gap-5"}>
          <DetailText label={"Entity Name"}>{data?.name}</DetailText>
          <DetailText label={"Entity Code"}>{data?.code}</DetailText>
          <DetailText label={"Entity Email"}>{data?.email}</DetailText>
          <DetailText label={"Address"}>{data?.address}</DetailText>
          <DetailText label={"Phone Number"}>{data?.phone}</DetailText>
          <DetailText label={"Fax Number"}>{data?.fax}</DetailText>
          <div className={"col-span-3 flex flex-col"}>
            <DetailText label={"Description"}>{data?.description}</DetailText>
            <DetailText label={"Preview Logo"}>
              {data?.logo === undefined ? (
                <Image width={80} src={data?.urlImage} className="my-2" />
              ) : (
                <Image
                  width={80}
                  src={`data:image/png;base64,${data?.logo}`}
                  className="my-2"
                />
              )}
            </DetailText>
          </div>
        </div>
        <hr></hr>
        <div className="my-5">
          <TablePagination
            columns={column}
            pageSize={pageSize}
            current={page}
            dataSource={paginationTable(page, pageSize)}
            tableScrolled={{ x: 1400, y: 500 }}
            onChange={handleChangePage}
            onSizeChanger={handleChangePage}
            totalData={data?.taxIdentifier?.length}
          />
        </div>
      </div>
    </div>
  );
};

export default EntityConfirmationLayout;
