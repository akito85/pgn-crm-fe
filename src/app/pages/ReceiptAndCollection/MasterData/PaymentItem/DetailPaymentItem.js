import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Grid, Input } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import TablePagination from "../../../../../components/TablePagination";
import { dateFormatting } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const DetailPaymentItem = ({ data_detail, data_GL, totalData, data_req }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  //SEARCH
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.date)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const filterDataByPage = () => {
    let result = [...(data_GL || [])];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const onSortDetail = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BANK ACCOUNT",
      dataIndex: "bankAccount",
      align: "",
      sorter: (a, b) => a.bankAccount?.localeCompare(b.bankAccount),
      ...getColumnSearchProps("bankAccount"),
    },
    {
      title: "GL ACCOUNTT",
      dataIndex: "glAccount",
      align: "",
      sorter: (a, b) => a.glAccount?.localeCompare(b.glAccount),
      ...getColumnSearchProps("glAccount"),
    },
    {
      title: "START DATE",
      sorter: true,
      align: "center",
      dataIndex: "startDate",
      ...getColumnSearchPropsPaging(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        searchedColumn === "startDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.date) : ""
            }
          />
        ) : text === null ? (
          ""
        ) : (
          moment(text).format(dateFormatting.date)
        ),
    },
    {
      title: "END DATE",
      sorter: true,
      align: "center",
      dataIndex: "endDate",
      ...getColumnSearchPropsPaging(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        searchedColumn === "endDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.date) : ""
            }
          />
        ) : text === null ? (
          ""
        ) : (
          moment(text).format(dateFormatting.date)
        ),
    },
  ];
  return (
    <div>
      {data_req?.isApprover &&
      data_req?.approvalType &&
      data_req?.approvalType === "INACTIVE_PAYMENT_METHOD" ? (
        <BaseContainer header={"INACTIVE REQUEST INFORMATION"}>
          <div className="grid grid-cols-4 w-full">
            <DetailText label={"Requested Date"}>
              {data_req?.requestedDate
                ? moment(data_req?.requestedDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Requested By"}>
              {data_req?.requestedBy}
            </DetailText>
            <DetailText label={"Remark"}>{data_req?.remarks}</DetailText>
          </div>
        </BaseContainer>
      ) : null}
      <BaseContainer header={"PAYMENT METHOD INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Payment Method Code">
            {data_detail?.paymentItemCode}
          </DetailText>
          <DetailText label="Payment Method Name">
            {data_detail?.name}
          </DetailText>
          <DetailText label="is Bank Method">
            {data_detail?.isBankMethod === true ? "True" : "False"}
          </DetailText>
          <DetailText label="Start Date">
            {moment(data_detail?.startDate).format(dateFormatting.date)}
          </DetailText>
          <DetailText label="End Date">
            {data_detail?.endDate
              ? moment(data_detail?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <DetailText label="Status Approval">
            {data_detail?.statusApproval}
          </DetailText>
          <div className="col-span-3">
            <DetailText label="Description">
              {data_detail?.description}
            </DetailText>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer header={"GL INFORMATION"}>
        <TablePagination
          dataSource={data_GL}
          pageSize={pageSize}
          columns={columns}
          current={page}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={totalData}
          onSort={onSort}
          tableScrolled={{
            x: 1500,
            y: 525,
          }}
        />
      </BaseContainer>

      <BaseContainer header={"LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5">
          <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate !== null
              ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : ""}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </div>
  );
};

export default DetailPaymentItem;
