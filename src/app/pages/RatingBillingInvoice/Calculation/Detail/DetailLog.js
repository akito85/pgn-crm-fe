import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetailCalculationLog } from "../../../../../redux/slices/rating_billing_invoice/calculation";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import CardContainer from "../../../../../components/CardContainer";

const DetailLog = ({ data, tabHeader }) => {
  const { list_calculation_result, loading } = useSelector(
    (state) => state.rbi_calculation
  );
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const calculationCode = data?.calCode;
  // state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // useEffect
  useEffect(() => {
    if (tabHeader === "Calculation Log") {
      let tempSearch = "";
      for (const dataIndex in search) {
        if (Object.hasOwnProperty.call(search, dataIndex)) {
          const tempSearchText = search[dataIndex];
          if (tempSearchText) {
            tempSearch += `${dataIndex}~${tempSearchText},`;
          }
        }
      }
      tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
      dispatch(
        getDetailCalculationLog({
          calCode: calculationCode,
          sort,
          page,
          pageSize,
          search: encodeURIComponent(JSON.stringify(search)),
        })
      );
    }
  }, [
    tabHeader,
    data,
    dispatch,
    calculationCode,
    sort,
    page,
    pageSize,
    search,
  ]);

  // handle search column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // onSort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // columns
  const column = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "ACTION",
      dataIndex: "action",
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "action",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "action",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "action",
          hasValue(search["action"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "TYPE",
      dataIndex: "calType",
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "calType",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "calType",
          hasValue(search["calType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CALCULATE AT",
      dataIndex: "calDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datetime"
      ),
      render: (text) =>
        renderDateColumn(
          "calDate",
          hasValue(search["calDate"]),
          searchText,
          text,
          "datetime",
          search
        ),
      // ...getColumnSearchPropsPaging(
      //   "createdDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   false,
      //   "date"
      // ),
      // render: (data) => {
      //   const text = data ? moment(data).format(dateFormatting.dateTime) : "";
      //   if (searchedColumn === "createdDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "CALCULATE BY",
      dataIndex: "createdBy",
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "createdBy",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "createdBy",
          hasValue(search["createdBy"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "remark",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
      // render: (text) => {
      //   if (searchedColumn === "remark") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
  ];

  // change table pagination
  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSize);
  };

  return (
    <CardContainer subHeader={"calculation log"}>
      <TablePaginationNew
        columns={column}
        dataSource={list_calculation_result?.result}
        totalData={list_calculation_result?.page?.totalElements || 0}
        current={page}
        pageSize={pageSize}
        onChange={handleChangePage}
        tableScrolled={{ x: 2000, y: 600 }}
        onSort={onSort}
      />
    </CardContainer>
  );
};

export default DetailLog;
