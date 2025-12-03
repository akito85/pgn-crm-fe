import React, { useRef, useState } from "react";
import { columnForce } from "./columnForce";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";

const TableForceFE = ({
  data = [],
  type = 1,
  totalData = 0,
  rowSelection = {},
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
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
    <TablePaginationNew
      type="FE"
      // dataSource={paginationTable("data")}
      dataSource={data}
      totalData={totalData}
      // totalData={paginationTable("length")}
      current={page}
      pageSize={pageSize}
      onChange={handleChangeSize}
      onSizeChanger={handleChangeSize}
      columns={columnForce(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      )}
      onSort={onSort}
      rowSelection={type === 1 ? rowSelection : undefined}
      tableScrolled={{
        x: 3500,
        y: 525,
      }}
    />
  );
};

export default TableForceFE;
