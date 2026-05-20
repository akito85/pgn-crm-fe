import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "../../../../../components/TablePagination";
import { getAccountVApagging } from "../../../../../redux/slices/receipt_collection/bankSlice";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";

export const columnVA = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { }
) => [
    {
      key: "no",
      title: "NO",
      width: 60,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "customer",
      title: "CUSTOMER",
      dataIndex: "customer",
      sorter: true,
      align: "left",
      ...getColumnSearchProps(
        "customer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "account",
      title: "ACCOUNT",
      dataIndex: "account",
      sorter: true,
      align: "left",
      ...getColumnSearchProps(
        "account",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "vaNumber",
      title: "VA NUMBER",
      dataIndex: "vaNumber",
      sorter: true,
      align: "left",
      ...getColumnSearchProps(
        "vaNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
  ];

const TableVA = ({
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  id,
}) => {
  const { dataVA } = useSelector((state) => state.bank);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  // const [searchedColumn, setSearchedColumn] = useState("");
  // const [searchText, setSearchText] = useState("");

  //pagingVA
  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAccountVApagging({
        id,
        page,
        pageSize,
        sort,
        search: tempSearch,
      })
    );
  }, [id, page, pageSize, sort, search]);

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div className="my-5 gap-5">
      <TablePagination
        dataSource={dataVA?.result}
        pageSize={pageSize}
        columns={columnVA(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        )}
        current={page}
        onChange={handleChange}
        onSizeChanger={handleChange}
        totalData={dataVA?.page?.totalElements}
        onSort={onSort}
      // tableScrolled={{
      //   x: 1300,
      //   y: 525,
      // }}
      />
    </div>
  );
};

export default TableVA;
