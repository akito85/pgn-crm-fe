import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import { getDetailCalculationLog } from "../../../../../redux/slices/rating_billing_invoice/calculation";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import TableCalculateLog from "./Table/TableCalculateLog";
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
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // useEffect
  useEffect(() => {
    if (tabHeader === "Calculation Log") {
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
    setSearchedColumn(dataIndex);
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
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // base columns
  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "action",
        title: "ACTION",
        dataIndex: "action",
        sorter: true,
        filteredValue: [search?.action] || null,
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
        key: "calType",
        title: "TYPE",
        dataIndex: "calType",
        sorter: true,
        filteredValue: [search?.calType] || null,
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
        key: "calDate",
        title: "CALCULATE AT",
        dataIndex: "calDate",
        align: "center",
        sorter: true,
        filteredValue: [search?.calDate] || null,
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
      },
      {
        key: "createdBy",
        title: "CALCULATE BY",
        dataIndex: "createdBy",
        sorter: true,
        filteredValue: [search?.createdBy] || null,
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
        key: "remark",
        title: "REMARK",
        dataIndex: "remark",
        sorter: true,
        filteredValue: [search?.remark] || null,
        ellipsis: { showTitle: false },
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
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  // processed columns with fixed
  const processedColumns = useMemo(() => {
    return applyFixedColumns(baseColumns, fixedColumns);
  }, [baseColumns, fixedColumns]);

  // column definitions for table settings
  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  // change table pagination
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  return (
    <CardContainer subHeader={"calculation log"}>
      <TableRBI
        columns={processedColumns}
        dataSource={list_calculation_result?.result}
        totalData={list_calculation_result?.page?.totalElements || 0}
        current={page}
        pageSize={pageSize}
        onChange={handleChangePage}
        onSizeChanger={handleChangePage}
        tableScrolled={{ x: 2000, y: 600 }}
        onSort={onSort}
        showExport={false}
        columnDefinitions={columnDefinitions}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={loading}
      />
      <TableCalculateLog calculationCode={calculationCode} />
    </CardContainer>
  );
};

export default DetailLog;
