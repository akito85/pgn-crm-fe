import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import TableRBI from "../../../../../../components/TableRBI";
import { 
  getAllCalculationSummaryPaginate,
  getAllCalculationSummaryExpandPaginate 
} from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { 
  columnsCalculationSummary, 
  renderExpandedRow 
} from "./columns/ColumnsCalculationSummary";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const CalculationSummary = ({ ratingCode, saType }) => {
  const { 
    data_calculationSummary, 
    data_calculationSummaryExpand,
    loadingExpand,
    loading 
  } = useSelector((state) => state.rating);
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Data source untuk tabel utama
  const dataSource = useMemo(() => {
    return (data_calculationSummary?.result || []).map((item, index) => ({
      ...item,
      key: `${item.transactionDate}-${item.saType}`,
    }));
  }, [data_calculationSummary]);

  // Fetch data tabel utama
  useEffect(() => {
    if (ratingCode) {
      dispatch(
        getAllCalculationSummaryPaginate({
          ratingCode,
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [ratingCode, search, page, pageSize, sort, dispatch]);

  // Handle expand row - fetch data untuk row yang di-expand
  const handleExpand = (expanded, record) => {
    const rowKey = `${record.transactionDate}-${record.saType}`;
    
    if (expanded) {
      // Add to expanded keys
      setExpandedRowKeys([...expandedRowKeys, rowKey]);
      
      // Fetch data untuk expanded row
      dispatch(
        getAllCalculationSummaryExpandPaginate({
          ratingCode,
          transactionDate: record.transactionDate,
          saType: record.saType,
          page: 1,
          pageSize: 100, // Ambil semua data expand sekaligus
          search: "",
          sort: "",
        })
      );
    } else {
      // Remove from expanded keys
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== rowKey));
    }
  };

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
      columnsCalculationSummary(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
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

  return (
    <div className="w-full pt-4">
      <TableRBI
        idTable="calculation-summary-table"
        dataSource={dataSource}
        columns={processedColumns}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChange}
        totalData={data_calculationSummary?.page?.totalElements || 0}
        tableScrolled={{ y: 400, x: 1000 }}
        onSort={onSortApi}
        showExport={true}
        columnDefinitions={columnDefinitions}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={loading}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender: (record) => renderExpandedRow(
            record, 
            data_calculationSummaryExpand,
            loadingExpand
          ),
          rowExpandable: () => true, // Semua row bisa di-expand
          columnWidth: 32,
          expandIcon: ({ expanded, onExpand, record }) => (
            <Button
              type="link"
              icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onExpand(record, e);
              }}
              style={{
                color: '#0075bf',
                padding: 0,
                height: 'auto',
                minWidth: '20px',
              }}
            />
          ),
        }}
      />
    </div>
  );
};

export default CalculationSummary;