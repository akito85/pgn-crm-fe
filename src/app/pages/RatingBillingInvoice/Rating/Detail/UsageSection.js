import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { getAllUsageServiceAgreementPaginate } from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsUsage } from "./Table/TableUsage";

const UsageSection = ({ ratingCodeId, calculationCode }) => {
  // Selector
  const { data_usageSA } = useSelector((state) => state.rating);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_usageSA?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect
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
      getAllUsageServiceAgreementPaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [ratingCodeId, search, page, pageSize, sort]);

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
  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <BaseContainer header={"Usage Information"}>
       <div className="flex flex-row align-middle gap-2">
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
        <TablePaginationNew
          dataSource={dataSource}
          columns={columnsUsage(
            search,
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          )?.filter((item) => item?.title !== "APPROVED BY")}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={data_usageSA?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 6000 }}
        />
      </div>
    </BaseContainer>
  );
};

export default UsageSection;
