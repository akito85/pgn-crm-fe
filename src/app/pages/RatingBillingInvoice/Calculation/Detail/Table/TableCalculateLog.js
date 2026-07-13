import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { getCalculateLogPaginate, downloadCalculateLogExcel } from "../../../../../../redux/slices/rating_billing_invoice/calculation";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const TableCalculateLog = ({ calculationCode }) => {
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [loadMoreSize] = useState(20); // Load 20 data per load more
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const { list_calculation_logp, loading } = useSelector(
    (state) => state.rbi_calculation
  );

  // Initial fetch - load 100 data pertama
  useEffect(() => {
    if (calculationCode) {
      dispatch(
        getCalculateLogPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
          page: 0,
          pageSize: 100, // Initial load 100
          calCode: calculationCode,
          isLoadMore: false,
        })
      );
      setPage(0);
    }
  }, [dispatch, calculationCode, sort, search]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(0);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const pageInfo = list_calculation_logp?.page || {};
    const totalPages = pageInfo?.totalPages || 0;

    if (nextPage < totalPages) {
      await dispatch(
        getCalculateLogPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
          page: nextPage,
          pageSize: loadMoreSize, // Load 20 more
          calCode: calculationCode,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
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
        isClassification: true,
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
        isClassification: true,
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
        isClassification: true,
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
        isClassification: true,
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
        isClassification: true,
        sorter: true,
        filteredValue: [search?.logDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "logDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          renderDateColumn(
            "logDate",
            hasValue(search["logDate"]),
            searchText,
            text,
            "datetime",
            search
          ),
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        isClassification: true,
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
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const resultData = list_calculation_logp?.result || [];
  const pageInfo = list_calculation_logp?.page || {};
  
  // Calculate if there's more data
  const hasMore = resultData.length < (pageInfo?.totalElements || 0);

  const handleDownloadLogExcel = () => {
    dispatch(
      downloadCalculateLogExcel({
        calCode: calculationCode,
        search: encodeURIComponent(JSON.stringify(search)),
        sort: sort,
      })
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={
            <SVGIcon
              name={"IconButtonDownload"}
              style={{ fontSize: "20px" }}
            />
          }
          onClick={handleDownloadLogExcel}
        >
          Download List
        </ButtonComponent>
      </div>
      <TableRBI
        idTable="calculate-log-paginate-table"
        columns={processedColumns}
        dataSource={resultData}
        totalData={pageInfo?.totalElements || 0}
        tableScrolled={{ x: 2000, y: 600 }}
        onSort={onSort}
        showExport={false}
        columnDefinitions={columnDefinitions}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={loading}
        usePagination={false}
        useInfiniteScroll={true}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loadMoreThreshold={20}
      />
    </div>
  );
};

export default TableCalculateLog;