import React, { useEffect, useRef, useState } from "react";
import CardComponent from "../../../../components/Card/CardComponent";
import DetailText from "../../../../components/DetailText";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
  renderDateConverter,
} from "../../../../utils";
import { sorterFunction } from "../../../../utils/sorterFunction";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import userHttpService from "../../../../redux/services/userHttpService";
import { configApp } from "../../../../constants/configApp";

const ForwardTasksDetail = ({ data }) => {
  const [datas, setDatas] = useState({});
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // state attachment
  const searchInputAttacthment = useRef(null);
  const [searchedColumnAttacthment, setSearchedColumnAttacthment] =
    useState("");
  const [searchTextAttacthment, setSearchTextAttacthment] = useState("");
  const [searchAttacthment, setSearchAttacthment] = useState({});
  const [pageAttacthment, setPageAttacthment] = useState(1);
  const [pageSizeAttacthment, setPageSizeAttacthment] = useState(10);

  useEffect(() => {
    if (Array.isArray(data)) {
      const dataObject = data.reduce((acc, item) => {
        acc["data"] = item;
        return item;
      }, {});
      setDatas(dataObject);
    } else {
      setDatas(data);
    }
  }, [data]);

  // detail
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
    setSearchedColumn(dataIndex);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
  };
  const columnDetail = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TRANSACTION ID",
      dataIndex: "transactionId",
      sorter: (a, b) => sorterFunction("transactionId", a, b),
      ...getColumnSearchProps(
        "transactionId",
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
          "transactionId",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "APPROVAL TYPE",
      dataIndex: "approvalType",
      sorter: (a, b) => sorterFunction("approvalType", a, b),
      ...getColumnSearchProps(
        "approvalType",
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
          "approvalType",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "DATE",
      dataIndex: "approvalDate",
      align: "center",
      sorter: (a, b) => sorterFunction("approvalDate", a, b, "datetime"),
      ...getColumnSearchProps(
        "approvalDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datetime",
      ),
      render: (text) =>
        renderDateColumn(
          "approvalDate",
          hasValue(search["approvalDate"]),
          searchText,
          text,
          "datetime",
          search,
        ),
    },
  ];

  //  attachment
  const handleChangeAttachment = (pageChange, pageSizeChange) => {
    setPageAttacthment(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSizeAttacthment(pageSizeChange);
  };
  const handleSearchAttachment = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextAttacthment(selectedKeys[0]);
    setSearchAttacthment((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageAttacthment(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
    setSearchedColumnAttacthment(dataIndex);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPageAttacthment(1);
    }
  };

  return (
    <div>
      <CardComponent header={"Employee Information"} cols={4}>
        <DetailText label={"Employee Number"}>{datas?.employeeName}</DetailText>
        <DetailText label={"Employee Name"}>{datas?.employeeNumber}</DetailText>
      </CardComponent>
      <CardComponent header={"Forward Task Information"} cols={4}>
        <DetailText label={"Position"}>{datas?.position}</DetailText>
        <DetailText label={"Forward To"}>{datas?.forwardTo}</DetailText>
        <DetailText label={"Forward By"}>{datas?.forwardBy}</DetailText>
        <DetailText label={"Forward Date"}>
          {hasValue(datas) &&
            renderDateConverter(datas?.forwardDate, "datetime")}
        </DetailText>
      </CardComponent>
      <CardComponent header={"Pending Task"}>
        <TablePaginationNew
          type="FE"
          dataSource={datas?.pendingTasks}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          columns={columnDetail}
        />
      </CardComponent>
      <CardComponent header={"Attachment Information"} cols={1}>
        <div className={"w-full flex flex-col"}>
          <AttachmentComponent
            type={"detail"}
            data={datas?.attachmentTasks?.map((item) => ({
              ...item,
              urlFile1: item?.url1,
              urlFile2: item?.url2,
              dataType: "exist",
            }))}
            typeSelector="delegation"
            service={userHttpService}
            configApplication={configApp.USER_MANAGEMENT_SERVICE}
          />
        </div>
      </CardComponent>
    </div>
  );
};

export default ForwardTasksDetail;
