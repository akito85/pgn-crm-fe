import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import { getAllCalculationDetailPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsCalculationDetail } from "./columns/ColumnsCalculationDetail";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const CalculationDetail = ({ ratingCodeId }) => {
  const { data_calculationDetail, loading } = useSelector((state) => state.rating);
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_calculationDetail?.result;

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
    dispatch(
      getAllCalculationDetailPaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [ratingCodeId, search, page, pageSize, sort, dispatch]);

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
        dataSource={dataSource}
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
        loading={loading}
      />
    </div>
  );
};

export default CalculationDetail;