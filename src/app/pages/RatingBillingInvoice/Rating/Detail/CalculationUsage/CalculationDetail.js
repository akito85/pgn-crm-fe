import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import { getAllCalculationDetailPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsCalculationDetail } from "./columns/ColumnsCalculationDetail";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const CalculationDetail = ({ calculationCode, ratingCode }) => {
  const { data_calculationDetail, loadingCalculation } = useSelector((state) => state.rating);
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [calculationCode, search, page, pageSize, sort, dispatch]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
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
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [page, pageSize, searchedColumn, searchText, search]
  );

  // Process dataSource untuk menambahkan rowSpan pada Time Unit
  const processedDataSource = useMemo(() => {
    const dataSource = data_calculationDetail?.result || [];
    if (!dataSource || dataSource.length === 0) return [];

    // Deep copy untuk menghindari error "object is not extensible"
    const processed = dataSource.map(item => ({ ...item }));
    let currentTimeUnit = null;
    let timeUnitStartIndex = 0;

    // First pass: identify time unit groups
    processed.forEach((item, index) => {
      if (item.timeUnit !== currentTimeUnit) {
        // New time unit group starts
        if (currentTimeUnit !== null) {
          // Set rowSpan for previous group
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

    // Handle last group
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
      // Tambahkan render khusus untuk Time Unit dengan rowSpan
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
            
            // Apply original render if exists
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

  return (
    <div className="w-full pt-4">
      <TableRBI
        dataSource={processedDataSource}
        columns={processedColumns}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChange}
        totalData={data_calculationDetail?.page?.totalElements || 0}
        tableScrolled={{ y: 400, x: 2000 }}
        onSort={onSortApi}
        showExport={true}
        columnDefinitions={columnDefinitions}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={loadingCalculation}
      />
    </div>
  );
};

export default CalculationDetail;