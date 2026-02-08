import React, { useRef, useState } from "react";
import { columnsReverse } from "./columnForce";
import TableRBI from "../../../../../../components/TableRBI";
import { columnsReverseTab } from "./ColumnReverseTab";

const TableReverseFE = ({
  data = [],
  type = 1,
  totalData = 0,
  rowSelection = {},
  columns,
  paging,
  handleChangeBE,
  handleSearchBE,
  onSortBE,
  page,
  setPage,
  pageSize,
  setPageSize,
  searchedColumn,
  setSearchedColumn,
  searchText,
  setSearchText,
}) => {
  const searchInput = useRef(null);
  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  // const [searchedColumn, setSearchedColumn] = useState("");
  // const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const paginationTable = (typeData = "data") => {
    let result = [...data];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    if (fieldSort) {
      const handleDataSort = (obj) => {
        return obj[fieldSort]?.toLowerCase();
      };
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  return (
    <TableRBI
      type={paging}
      // dataSource={paginationTable("data")}
      dataSource={data}
      // totalData={paginationTable("length")}
      totalData={totalData}
      current={page}
      pageSize={pageSize}
      tableScrolled={{
        x: 3000,
        y: 525,
      }}
      onChange={paging !== "BE" ? handleChangeSize : handleChangeBE}
      onSizeChanger={paging !== "BE" ? handleChangeSize : handleChangeBE}
      columns={
        columns === "colReverseTab"
          ? columnsReverseTab(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            paging === "BE" ? handleSearchBE : handleSearch
          )
          : columnsReverse(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            paging === "BE" ? handleSearchBE : handleSearch
          )
      }
      onSort={paging !== "BE" ? onSort : onSortBE}
      rowSelection={type === 1 ? rowSelection : undefined}
    />
  );
};

export default TableReverseFE;
