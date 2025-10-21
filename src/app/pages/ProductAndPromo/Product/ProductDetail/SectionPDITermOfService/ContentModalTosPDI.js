import React, { useEffect, useRef, useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import {
  getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValueFE,
} from "../../../../../../utils/getColumnSearchProps";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import Highlighter from "react-highlight-words";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import moment from "moment";
import {
  dateFormatting,
  hasValue,
  renderColumn,
} from "../../../../../../utils";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  return record[dataIndex]?.toLowerCase().includes(search);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return obj[fieldSort]?.toString().toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search,
) => {
  const result = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ATTRIBUTE",
      width: 240,
      dataIndex: "attributeName",
      filteredValue: search?.["attributeName"]
        ? [search?.["attributeName"]]
        : null,
      // onFilter: (value, record) => onFilter("attributeName", value, record),
      sorter: (a, b) => sorter("attributeName", a, b),
      // ...getColumnSearchPropsPaging(
      //   "attributeName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "attributeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "attributeName",
          hasValue(search["attributeName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "VALUE",
      width: 240,
      dataIndex: "value",
      filteredValue: search?.["value"] ? [search?.["value"]] : null,
      // onFilter: (value, record) => onFilter("value", value, record),
      sorter: (a, b) => sorter("value", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "value",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "value",
          hasValue(search["value"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "value",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text) =>
      //   searchedColumn === "value" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text === 0 ? text.toString() : text || ""}
      //     />
      //   ) : (
      //     text
      //   ),
    },
    {
      title: "UNIT",
      width: 240,
      dataIndex: "unit",
      filteredValue: search?.["unit"] ? [search?.["unit"]] : null,
      // onFilter: (unit, record) => onFilter("unit", unit, record),
      sorter: (a, b) => sorter("unit", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "unit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "unit",
          hasValue(search["unit"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "unit",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "FROM ITEM",
      width: 240,
      dataIndex: "fromItem",
      filteredValue: search?.["fromItem"] ? [search?.["fromItem"]] : null,
      // onFilter: (value, record) => onFilter("fromItem", value, record),
      sorter: (a, b) => sorter("fromItem", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fromItem",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "fromItem",
          hasValue(search["fromItem"]),
          searchText,
          text?.label,
          false,
          "input",
          search,
        ),
      // ...getColumnSearchPropsPaging(
      //   "fromItem",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
  ];

  return result;
};
const ContentModalTosPDI = ({ data = [], dataObj = {} }) => {
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  useEffect(() => {
    let result = data.map((item) => ({
      ...item,
      value: (item.value || "") + "",
    }));
    setDataTable(result);
    setTotalElement(result.length);
  }, [data]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      // if (prevState[dataIndex] !== selectedKeys[0]) {
      //   setPage(1);
      // }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  return (
    <div className="flex flex-col w-full gap-4">
      <CardComponent header={"TERM OF SERVICE INFORMATION"} cols={4}>
        <DetailText label={"Name"}>{dataObj.tosName}</DetailText>
        <DetailText label={"Description"}>{dataObj.description}</DetailText>
      </CardComponent>
      <div className="text-primary font-semibold uppercase">
        {"TERM OF SERVICE ATTRIBUTE"}
      </div>
      <TablePaginationNew
        type="FE"
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onChange={handleChangeSize}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          search,
        )}
      />
      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">{dataObj?.id}</DetailText>
        <DetailText label="Created Date">
          {dataObj?.createdDate
            ? moment(dataObj.createdDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Created By">{dataObj?.createdBy}</DetailText>
        <DetailText label="Updated Date">
          {dataObj?.updatedDate
            ? moment(dataObj.updatedDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Updated By">{dataObj?.updatedBy}</DetailText>
      </CardComponent>
    </div>
  );
};

export default ContentModalTosPDI;
