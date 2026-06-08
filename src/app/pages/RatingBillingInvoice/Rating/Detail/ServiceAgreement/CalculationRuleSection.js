import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { getAllCalculationRuleServiceAgreementPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import { hasValue, renderColumn } from "../../../../../../utils";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

export const columnsCalculationRuleServiceAgreement = (
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
    dataIndex: "name",
    key: "name",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "name",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('name', hasValue(search['name']), searchText, text, false, 'input', search)
  },
  {
    title: "VALUE",
    dataIndex: "value",
    key: "value",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('value', hasValue(search['value']), searchText, text, false, 'input', search)
  },
  {
    title: "UNIT",
    dataIndex: "unit",
    key: "unit",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "unit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('unit', hasValue(search['unit']), searchText, text, false, 'input', search)
  },
];

const CalculationRuleSection = ({ SAId }) => {
  // Selector
  const { data_calculationRuleServiceAgreement, loadingSA } = useSelector(
    (state) => state.rating
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_calculationRuleServiceAgreement?.result;

  // State
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

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllCalculationRuleServiceAgreementPaginate({
        id: SAId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [SAId, search, page, pageSize, sort, dispatch]);

  // Function Search API
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () =>
      columnsCalculationRuleServiceAgreement(
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
          CALCULATION RULE INFORMATION
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
          totalData={data_calculationRuleServiceAgreement?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loadingSA}
        />
      </div>
    </>
  );
};

export default CalculationRuleSection;