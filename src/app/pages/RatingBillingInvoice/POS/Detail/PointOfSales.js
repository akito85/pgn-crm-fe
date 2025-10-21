import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import PosDetailTableView from "../Table/PosDetailTableView";
import { getDetailListPointOfSales } from "../../../../../redux/slices/rating_billing_invoice/PointOfSales";

const PointOfSales = ({ id = 0, dispatch = () => {} }) => {
  // Selector
  const { data_viewDetail } = useSelector((state) => state.pointOfSales);

  // Declaration
  const searchInput = useRef(null);

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect
  useEffect(() => {
    if (id) {
      // let tempSearch = "";
      // for (const dataIndex in search) {
      //   if (Object.hasOwnProperty.call(search, dataIndex)) {
      //     const tempSearchText = search[dataIndex];
      //     if (tempSearchText) {
      //       tempSearch += `${dataIndex}~${tempSearchText},`;
      //     }
      //   }
      // }
      // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";

      dispatch(
        getDetailListPointOfSales({
          id,
          page,
          pageSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
        }),
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    setPage(1);
    setPageSize(10);
    setSearch({});
    setSearchedColumn("");
    setSearchText("");
    setSort("");
  }, [id]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };
  // console.log(data_viewDetail)
  return (
    <div className="mt-5">
      <PosDetailTableView
        data={data_viewDetail || []}
        handleChange={handleChange}
        handleChangeSize={handleChange}
        totalElement={data_viewDetail?.length || 0}
        page={page}
        pageSize={pageSize}
        searchInput={searchInput}
        searchedColumn={searchedColumn}
        searchText={searchText}
        handleSearch={handleSearch}
        onSort={onSort}
        type={"detail"}
        search={search}
      />
    </div>
  );
};

export default PointOfSales;
