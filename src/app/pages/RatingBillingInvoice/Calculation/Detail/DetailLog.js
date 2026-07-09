import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../../components/CardContainer";
import { getDetailCalculationLog } from "../../../../../redux/slices/rating_billing_invoice/calculation";
// import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
// import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
// import TableRBI from "../../../../../components/TableRBI";
import TableCalculateLog from "./Table/TableCalculateLog";
// import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const DetailLog = ({ data, tabHeader, showCard = true }) => {
  // const { list_calculation_log, loadingLog } = useSelector(
  //   (state) => state.rbi_calculation,
  // );
  const dispatch = useDispatch();
  // const searchInput = useRef(null);
  const calculationCode = data?.calCode;

  // state
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20); // Load 20 data per load more
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // const [fixedColumns, setFixedColumns] = useState(() => ({
  //   left: ["no"],
  //   right: [],
  // }));

  // Initial fetch - load 100 data pertama
  useEffect(() => {
    if (tabHeader === "Calculation Log" && calculationCode) {
      dispatch(
        getDetailCalculationLog({
          calCode: calculationCode,
          sort,
          page: 0,
          pageSize: 100, // Initial load 100
          search: encodeURIComponent(JSON.stringify(search)),
          isLoadMore: false,
        }),
      );
      setPage(0);
    }
  }, [tabHeader, dispatch, calculationCode, sort, search]);

  // handle search column
  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  //   setSearch((prevState) => {
  //     if (prevState[dataIndex] !== selectedKeys[0]) {
  //       setPage(0);
  //     }
  //     return {
  //       ...prevState,
  //       [dataIndex]: selectedKeys[0],
  //     };
  //   });
  // };

  // Load more handler
  // const handleLoadMore = async () => {
  //   const nextPage = page + 1;
  //   const pageInfo = list_calculation_log?.page || {};
  //   const totalPages = pageInfo?.totalPages || 0;

  //   if (nextPage < totalPages) {
  //     await dispatch(
  //       getDetailCalculationLog({
  //         calCode: calculationCode,
  //         sort,
  //         page: nextPage,
  //         pageSize: loadMoreSize, // Load 20 more
  //         search: encodeURIComponent(JSON.stringify(search)),
  //         isLoadMore: true,
  //       }),
  //     );
  //     setPage(nextPage);
  //   }
  // };

  // onSort
  // const onSort = (_, __, sorter) => {
  //   const dataSort =
  //     sorter.order !== undefined
  //       ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
  //       : "";
  //   setSort(dataSort);
  // };

  // columns
  // const baseColumns = useMemo(
  //   () => [
  //     {
  //       key: "no",
  //       title: "NO",
  //       width: 60,
  //       align: "center",
  //       render: (text, object, index) => index + 1,
  //     },
  //     {
  //       key: "action",
  //       title: "ACTION",
  //       dataIndex: "action",
  //       isClassification: true,
  //       sorter: true,
  //       filteredValue: [search?.action] || null,
  //       ...getColumnSearchPropsUseFilteredValue(
  //         search,
  //         "action",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true,
  //       ),
  //       render: (text) =>
  //         renderColumn(
  //           "action",
  //           hasValue(search["action"]),
  //           searchText,
  //           text,
  //           false,
  //           "input",
  //           search,
  //         ),
  //     },
  //     {
  //       key: "calType",
  //       title: "TYPE",
  //       dataIndex: "calType",
  //       isClassification: true,
  //       sorter: true,
  //       filteredValue: [search?.calType] || null,
  //       ...getColumnSearchPropsUseFilteredValue(
  //         search,
  //         "calType",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true,
  //       ),
  //       render: (text) =>
  //         renderColumn(
  //           "calType",
  //           hasValue(search["calType"]),
  //           searchText,
  //           text,
  //           false,
  //           "input",
  //           search,
  //         ),
  //     },
  //     {
  //       key: "calDate",
  //       title: "CALCULATE AT",
  //       dataIndex: "calDate",
  //       isClassification: true,
  //       align: "center",
  //       sorter: true,
  //       filteredValue: [search?.calDate] || null,
  //       ...getColumnSearchPropsUseFilteredValue(
  //         search,
  //         "calDate",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true,
  //         "datetime",
  //       ),
  //       render: (text) =>
  //         renderDateColumn(
  //           "calDate",
  //           hasValue(search["calDate"]),
  //           searchText,
  //           text,
  //           "datetime",
  //           search,
  //         ),
  //     },
  //     {
  //       key: "createdBy",
  //       title: "CALCULATE BY",
  //       dataIndex: "createdBy",
  //       isClassification: true,
  //       sorter: true,
  //       filteredValue: [search?.createdBy] || null,
  //       ...getColumnSearchPropsUseFilteredValue(
  //         search,
  //         "createdBy",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true,
  //       ),
  //       render: (text) =>
  //         renderColumn(
  //           "createdBy",
  //           hasValue(search["createdBy"]),
  //           searchText,
  //           text,
  //           false,
  //           "input",
  //           search,
  //         ),
  //     },
  //     {
  //       key: "remark",
  //       title: "REMARK",
  //       dataIndex: "remark",
  //       isClassification: true,
  //       sorter: true,
  //       filteredValue: [search?.remark] || null,
  //       ellipsis: {
  //         showTitle: false,
  //       },
  //       ...getColumnSearchPropsUseFilteredValue(
  //         search,
  //         "remark",
  //         searchInput,
  //         searchedColumn,
  //         searchText,
  //         handleSearch,
  //         true,
  //       ),
  //       render: (text) =>
  //         renderColumn(
  //           "remark",
  //           hasValue(search["remark"]),
  //           searchText,
  //           text,
  //           true,
  //           "input",
  //           search,
  //         ),
  //     },
  //   ],
  //   [search, searchText, searchedColumn],
  // );

  // const allColumns = useMemo(() => {
  //   const columnsWithKeys = baseColumns.map((col) => ({
  //     ...col,
  //     key: col.key || col.dataIndex || col.title,
  //   }));
  //   return columnsWithKeys;
  // }, [baseColumns]);

  // const processedColumns = useMemo(() => {
  //   return applyFixedColumns(allColumns, fixedColumns);
  // }, [allColumns, fixedColumns]);

  // const columnDefinitions = useMemo(() => {
  //   return allColumns.map((col) => ({
  //     key: col.key || col.dataIndex || col.title,
  //     title: col.title,
  //   }));
  // }, [allColumns]);

  // const resultData = list_calculation_log?.result || [];
  // const pageInfo = list_calculation_log?.page || {};

  // Calculate if there's more data
  // const hasMore = resultData.length < (pageInfo?.totalElements || 0);

  const tableContent = (
    <>
      {/* <div className="w-full pb-3">
        <TableRBI
          idTable="calculation-log-table"
          columns={processedColumns}
          dataSource={resultData}
          totalData={pageInfo?.totalElements || 0}
          tableScrolled={{ x: 2000, y: 600 }}
          onSort={onSort}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loadingLog}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadMoreThreshold={20}
        />
      </div> */}

      <TableCalculateLog calculationCode={calculationCode} />
    </>
  );

  if (!showCard) {
    return tableContent;
  }

  return (
    <>
      <div className="-mt-6">
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">CALCULATION LOG</p>
            </div>
          }
        >
          {tableContent}
        </CardContainer>
      </div>
    </>
  );
};

export default DetailLog;
