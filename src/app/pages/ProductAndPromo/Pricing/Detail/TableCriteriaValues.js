import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "../../../../../components/TablePagination";
import { columnsTableCriteriaDetail } from "../columnTableCriteria";

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  dataCriteria = [],
) => {
  const temp = [
    {
      title: "NO",
      width: 60,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    ...columnsTableCriteriaDetail(
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  ];
  return temp.filter((col) =>
    col.title !== "NO" ? dataCriteria.includes(col.indexValue) : true,
  );
};
const TableCriteriaValues = ({
  id = 0,
  getAPI = () => {},
  selector = "pricing",
  dataCriteria = [],
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const { dataListCriteriaValue } = useSelector((state) => state[selector]);
  useEffect(() => {
    if (id !== 0) {
      dispatch(getAPI({ id, page, pageSize, search, sort }));
    }
  }, [id, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataListCriteriaValue && dataListCriteriaValue.result) {
      const data = (dataListCriteriaValue.result || []).map((item) => {
        let obj = { typeData: "exist" };
        for (const attr in item) {
          if (typeof item[attr] === "object" && item[attr] !== null) {
            obj[attr] = {
              label: item[attr]?.label || item[attr]?.name,
              value: item[attr].value,
            };
          } else {
            obj[attr] = item[attr];
          }
        }
        return obj;
      });
      const totalData = dataListCriteriaValue.page.totalElements;
      setDataTable(data);
      setTotalElement(totalData);
    }
  }, [dataListCriteriaValue]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    const adjustOrder = dataIndex;
    setSearchText(selectedKeys[0]);
    setSearchedColumn(adjustOrder);
    setSearch(selectedKeys[0] ? `${adjustOrder}~${selectedKeys[0]}` : "");
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const onSort = (_, __, sort) => {
    const adjustOrder = sort.field.slice(0, sort.field.length - 2);
    const dataSort = sort.order
      ? `${adjustOrder}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <TablePagination
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onChange={handleChangeSize}
        onSort={onSort}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          dataCriteria,
        )}
      />
    </div>
  );
};

export default TableCriteriaValues;
