import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { getPrabillSaDetail } from "../../../../../../redux/slices/rating_billing_invoice/praBilling";
import { hasValue, renderColumn } from "../../../../../../utils";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

export const columnsSaDetail = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "NAME",
    dataIndex: "attributeName",
    key: "attributeName",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "attributeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "attributeName",
        hasValue(search["attributeName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
    {
    title: "VALUE",
    dataIndex: "value",
    key: "value",
    sorter: true,
    width: 150,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "value",
        hasValue(search["value"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "UNIT",
    dataIndex: "unit",
    key: "unit",
    sorter: true,
    width: 150,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "unit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "unit",
        hasValue(search["unit"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
];

const SaDetailSection = ({ prabillSaId }) => {
  const { prabill_sa_detail, loading_prabill_sa } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = prabill_sa_detail?.saDetail?.result;

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
    if (prabillSaId) {
      dispatch(
        getPrabillSaDetail({
          prabillSaId,
          search: JSON.stringify(search),
          page: page - 1,
          size: pageSize,
          sort,
        })
      );
    }
  }, [prabillSaId, search, page, pageSize, sort, dispatch]);

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
      columnsSaDetail(
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
    <>
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary uppercase">
          SERVICE AGREEMENT DETAIL INFORMATION
        </p>
      </div>
      <div className="w-full">
        <TableRBI
          dataSource={dataSource}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={prabill_sa_detail?.saDetail?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading_prabill_sa.saDetail}
        />
      </div>
    </>
  );
};

export default SaDetailSection;