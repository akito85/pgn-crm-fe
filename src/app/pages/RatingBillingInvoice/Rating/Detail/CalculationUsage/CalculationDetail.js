import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import {
  getAllCalculationDetailPaginate,
  downloadCalculationDetail,
} from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsCalculationDetail } from "./columns/ColumnsCalculationDetail";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const CalculationDetail = ({ calculationCode, ratingCode }) => {
  const { data_calculationDetail, loadingCalculation } = useSelector((state) => state.rating);
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const initialPageSize = 100;
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    if (calculationCode) {
      dispatch(
        getAllCalculationDetailPaginate({
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
  }, [calculationCode, ratingCode, search, sort, dispatch]);

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
    const currentPagination = data_calculationDetail?.page || {};
    const totalElements = currentPagination?.totalElements || 0;
    const currentDataLength = (data_calculationDetail?.result || []).length;

    if (currentDataLength >= totalElements) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    await dispatch(
      getAllCalculationDetailPaginate({
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

  const handleRefresh = () => {
    if (calculationCode) {
      dispatch(
        getAllCalculationDetailPaginate({
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

  const handleDownloadDetail = () => {
    if (calculationCode) {
      dispatch(
        downloadCalculationDetail({
          ratingCode,
          calculationCode,
          search: encodeURIComponent(JSON.stringify(search)),
          sort,
        })
      );
    }
  };

  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () =>
      columnsCalculationDetail(
        1,
        initialPageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [searchedColumn, searchText, search]
  );

  const processedDataSource = useMemo(() => {
    const dataSource = data_calculationDetail?.result || [];
    if (!dataSource || dataSource.length === 0) return [];

    const processed = dataSource.map(item => ({
      ...item,
      key: item.ratingDetailId,
    }));
    let currentTimeUnit = null;
    let timeUnitStartIndex = 0;

    processed.forEach((item, index) => {
      if (item.timeUnit !== currentTimeUnit) {
        if (currentTimeUnit !== null) {
          const rowSpan = index - timeUnitStartIndex;
          processed[timeUnitStartIndex].timeUnitRowSpan = rowSpan;
          for (let i = timeUnitStartIndex + 1; i < index; i++) {
            processed[i].timeUnitRowSpan = 0;
          }
        }
        currentTimeUnit = item.timeUnit;
        timeUnitStartIndex = index;
      }
    });

    if (currentTimeUnit !== null) {
      const rowSpan = processed.length - timeUnitStartIndex;
      processed[timeUnitStartIndex].timeUnitRowSpan = rowSpan;
      for (let i = timeUnitStartIndex + 1; i < processed.length; i++) {
        processed[i].timeUnitRowSpan = 0;
      }
    }

    return processed;
  }, [data_calculationDetail?.result]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => {
      if (col.key === 'timeUnit' || col.dataIndex === 'timeUnit') {
        const originalRender = col.render;
        
        return {
          ...col,
          key: col.key || col.dataIndex || col.title,
          render: (text, record, index) => {
            const rowSpan = record.timeUnitRowSpan;
            
            if (rowSpan === 0) {
              return {
                children: null,
                props: {
                  rowSpan: 0,
                },
              };
            }
            
            let content;
            if (originalRender) {
              content = originalRender(text, record, index);
            } else {
              content = text || "";
            }
            
            return {
              children: content,
              props: {
                rowSpan: rowSpan || 1,
              },
            };
          },
        };
      }
      
      return {
        ...col,
        key: col.key || col.dataIndex || col.title,
      };
    });
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

  const currentPagination = data_calculationDetail?.page || {};
  const hasMore = (data_calculationDetail?.result || []).length < (currentPagination?.totalElements || 0);

  return (
    <div className="w-full pt-4">
      <div className="flex justify-end mb-2">
        <ButtonComponent
          type="submit"
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          onClick={handleDownloadDetail}
        >
          Download
        </ButtonComponent>
      </div>
      <TableRBI
        idTable="calculation-detail-table"
        dataSource={processedDataSource}
        columns={processedColumns}
        totalData={currentPagination?.totalElements || 0}
        tableScrolled={{ y: 400, x: 2000 }}
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
      />
    </div>
  );
};

export default CalculationDetail;