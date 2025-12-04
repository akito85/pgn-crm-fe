import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../../components/CardContainer";
import TableRBI from "../../../../../components/TableRBI";
import { getAllUsageServiceAgreementPaginate } from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsUsage } from "./Table/TableUsage";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const UsageSection = ({ ratingCodeId, calculationCode }) => {
  const { data_usageSA } = useSelector((state) => state.rating);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_usageSA?.result;

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
      getAllUsageServiceAgreementPaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, ratingCodeId, search, page, pageSize, sort]);

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

  const baseColumns = useMemo(() => {
    return columnsUsage(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ).filter((item) => item?.title !== "APPROVED BY");
  }, [search, page, pageSize, searchedColumn, searchText]);

  const allColumns = useMemo(() => {
    return baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
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
    <CardContainer 
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="mt-[15px] font-bold">USAGE INFORMATION</p>
        </div>
      }
    >
      <div className="flex flex-row align-middle gap-2 mb-5">
        <p className="text-[15px] font-semibold text-text-color-semibold">
          Calculation Code:
        </p>
        <p className="text-[15px] font-semibold text-primary">
          {calculationCode}
        </p>
        <p className="text-[15px] font-semibold text-text-color-semibold">
          Rating Code:
        </p>
        <p className="text-[15px] font-semibold text-primary">
          {ratingCodeId}
        </p>
      </div>
      <div className="w-full">
        <TableRBI
          dataSource={dataSource}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChangePage}
          onSizeChanger={handleChangePage}
          totalData={data_usageSA?.page?.totalElements || 0}
          tableScrolled={{ x: 6000, y: 525 }}
          onSort={onSort}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          showExport={false}
          setFixedColumns={setFixedColumns}
          loading={false}
        />
      </div>
    </CardContainer>
  );
};

export default UsageSection;