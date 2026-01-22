import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import TableRBI from "../../../../../../components/TableRBI";
import { getAllCalculationSummaryPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { 
  columnsCalculationSummary, 
  renderExpandedRow 
} from "./columns/ColumnsCalculationSummary";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const CalculationSummary = ({ ratingCodeId, calculationCode, accountNumber }) => {
  const { data_calculationSummary, loading } = useSelector((state) => state.rating);
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

  // Tambahkan unique key untuk setiap row
  const dataSource = useMemo(() => {
    return (data_calculationSummary?.result || []).map((item, index) => ({
      ...item,
      key: item.id || `row-${index}`,
    }));
  }, [data_calculationSummary]);

  useEffect(() => {
    // Pastikan calculationCode dan accountNumber tersedia
    if (calculationCode && accountNumber) {
      dispatch(
        getAllCalculationSummaryPaginate({
          calculationCode,
          accountNumber,
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [calculationCode, accountNumber, search, page, pageSize, sort, dispatch]);

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
          onExpandedRowsChange: setExpandedRowKeys,
          expandedRowRender: renderExpandedRow,
          rowExpandable: (record) => record.partitions && record.partitions.length > 0,
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