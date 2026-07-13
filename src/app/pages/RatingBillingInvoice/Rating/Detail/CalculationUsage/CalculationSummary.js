import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import { 
  getAllCalculationSummaryPaginate,
  getAllCalculationSummaryExpandPaginate,
  downloadSummaryRatingExcel
} from "../../../../../../redux/slices/rating_billing_invoice/rating";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { 
  columnsCalculationSummary, 
  renderExpandedRow 
} from "./columns/ColumnsCalculationSummary";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const CalculationSummary = ({ ratingCode, calculationCode, saType }) => {
  const { 
    data_calculationSummary, 
    data_calculationSummaryExpand,
    loadingExpand,
    loadingCalculation 
  } = useSelector((state) => state.rating);
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const initialPageSize = 100;
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const dataSource = useMemo(() => {
    return (data_calculationSummary?.result || []).map((item) => ({
      ...item,
      key: item.ratingLineId,
    }));
  }, [data_calculationSummary]);
  const currentPagination = data_calculationSummary?.page || {};
  const hasMore = dataSource.length < (currentPagination?.totalElements || 0);

  useEffect(() => {
    if (ratingCode && calculationCode) {
      dispatch(
        getAllCalculationSummaryPaginate({
          ratingCode,
          calculationCode,
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [ratingCode, calculationCode, search, sort, dispatch]);

  const handleExpand = (expanded, record) => {
    const rowKey = record.key;
    
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, rowKey]);
      
      dispatch(
        getAllCalculationSummaryExpandPaginate({
          id: rowKey,
          ratingCode,
          calculationCode,
          saType,
          page: 1,
          pageSize: 100,
          search: "",
          sort: "",
        })
      );
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== rowKey));
    }
  };

  // Handle search
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

  const handleLoadMore = async () => {
    const totalElements = currentPagination?.totalElements || 0;
    const currentDataLength = dataSource.length;

    if (currentDataLength >= totalElements) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    await dispatch(
      getAllCalculationSummaryPaginate({
        ratingCode,
        calculationCode,
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      })
    );
    
    setPage(nextPage);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (ratingCode && calculationCode) {
      dispatch(
        getAllCalculationSummaryPaginate({
          ratingCode,
          calculationCode,
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  };

  // Handle sort
  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () =>
      columnsCalculationSummary(
        search,
        page,
        null,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    [searchedColumn, searchText, search, page]
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

  const handleDownloadExcel = () => {
    dispatch(
      downloadSummaryRatingExcel({
        ratingCode,
        calculationCode,
        search: encodeURIComponent(JSON.stringify(search)),
        sort: sort,
      })
    );
  };

  return (
    <div className="w-full pt-4">
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
          onClick={handleDownloadExcel}
        >
          Download List
        </ButtonComponent>
      </div>
      <TableRBI
        idTable="calculation-summary-table"
        dataSource={dataSource}
        columns={processedColumns}
        totalData={currentPagination?.totalElements || 0}
        tableScrolled={{ x: 1000, }}
        onSort={onSortApi}
        showExport={true}
        columnDefinitions={columnDefinitions}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={loadingCalculation}
        usePagination={false}
        useInfiniteScroll={true}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        showRefresh={true}
        onRefresh={handleRefresh}
        loadMoreThreshold={20}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender: (record) => renderExpandedRow(
            record, 
            data_calculationSummaryExpand,
            loadingExpand,
            search,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
          rowExpandable: () => true,
          columnWidth: 48,
        }}
      />
    </div>
  );
};

export default CalculationSummary;