import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import { getAllRatingResultPaginate } from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsRatingResult } from "./Table/TableRatingResult";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const RatingSummaryTab = ({ sourceNumber }) => {
  const { data_ratingResult } = useSelector((state) => state.billing);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSourceRR = data_ratingResult?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumnsRR, setFixedColumnsRR] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    dispatch(
      getAllRatingResultPaginate({
        id: sourceNumber,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, sourceNumber, search, page, pageSize, sort]);

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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumnsRR = useMemo(() => {
    return columnsRatingResult(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
    );
  }, [page, pageSize, searchedColumn, searchText, search]);

  const allColumnsRR = useMemo(() => {
    return baseColumnsRR.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsRR]);

  const processedColumnsRR = useMemo(() => {
    return applyFixedColumns(allColumnsRR, fixedColumnsRR);
  }, [allColumnsRR, fixedColumnsRR]);

  const columnDefinitionsRR = useMemo(() => {
    return allColumnsRR.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsRR]);

  return (
    <div className="space-y-4">
      <TableRBI
        size="small"
        dataSource={dataSourceRR}
        columns={processedColumnsRR}
        current={page}
        pageSize={pageSize}
        onChange={handleChangePage}
        onSizeChanger={handleChangePage}
        totalData={data_ratingResult?.page?.totalElements || 0}
        tableScrolled={{ x: 1200, y: 525 }}
        onSort={onSort}
        columnDefinitions={columnDefinitionsRR}
        fixedColumns={fixedColumnsRR}
        showExport={false}
        setFixedColumns={setFixedColumnsRR}
        loading={false}
      />
    </div>
  );
};

export default RatingSummaryTab;