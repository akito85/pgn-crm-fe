import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { getCalculateLogPaginate } from "../../../../../../redux/slices/rating_billing_invoice/calculation";
import { hasValue, renderColumn } from "../../../../../../utils";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const TableCalculateLog = ({ calculationCode }) => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const { list_calculation_log, loading } = useSelector(
    (state) => state.rbi_calculation
  );

  useEffect(() => {
    dispatch(
      getCalculateLogPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
        page,
        pageSize,
        calCode: calculationCode,
      })
    );
  }, [dispatch, calculationCode, sort, page, pageSize, search]);

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

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

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
        key: "idCalJob",
        title: "ID CALCULATION JOB",
        dataIndex: "idCalJob",
        isClassification: true,
        sorter: true,
        filteredValue: [search?.idCalJob] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "idCalJob",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "idCalJob",
            hasValue(search["idCalJob"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "calCode",
        title: "CALCULATION CODE",
        dataIndex: "calCode",
        isClassification: true,
        sorter: true,
        filteredValue: [search?.calCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "calCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "calCode",
            hasValue(search["calCode"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "logMsg",
        title: "LOG MESSAGE",
        dataIndex: "logMsg",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.logMsg] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "logMsg",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "logMsg",
            hasValue(search["logMsg"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "procName",
        title: "PROCESS NAME",
        dataIndex: "procName",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.procName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "procName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "procName",
            hasValue(search["procName"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "billCycle",
        title: "BILL CYCLE",
        dataIndex: "billCycle",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.billCycle] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billCycle",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "billCycle",
            hasValue(search["billCycle"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "billPeriod",
        title: "BILL PERIOD",
        dataIndex: "billPeriod",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.billPeriod] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billPeriod",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "billPeriod",
            hasValue(search["billPeriod"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "countNo",
        title: "COUNTER NO",
        dataIndex: "countNo",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.countNo] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "countNo",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "countNo",
            hasValue(search["countNo"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "logDate",
        title: "LOG DATE",
        dataIndex: "logDate",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.logDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "logDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "logDate",
            hasValue(search["logDate"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        isClassification:true,
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
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  const processedColumns = useMemo(() => {
    return applyFixedColumns(baseColumns, fixedColumns);
  }, [baseColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  return (
    <TableRBI
      columns={processedColumns}
      dataSource={list_calculation_log?.result}
      totalData={list_calculation_log?.page?.totalElements || 0}
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
  );
};

export default TableCalculateLog;