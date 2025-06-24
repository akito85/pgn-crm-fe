import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import {
  columnsDetailTermOfService,
  columnsTermOfService,
} from "../Table/TableTermsOfService";
import { getAllTOSServiceAgreementPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";

const TosSection = ({ SAId }) => {
  // Selector
  const { data_termOfServiceSA } = useSelector((state) => state.rating);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [dataTable, setDataTable] = useState([]);

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
      getAllTOSServiceAgreementPaginate({
        id: SAId,
        search: tempSearch,
        page,
        pageSize,
        sort,
      })
    );
  }, [SAId, search, page, pageSize, sort]);

  useEffect(() => {
    if (data_termOfServiceSA && data_termOfServiceSA?.result?.length > 0) {
      const data = data_termOfServiceSA?.result?.map((a, index) => ({
        ...a,
        key: index + 1,
        tosDetail: a.tosDetail?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(data);
    }
  }, [data_termOfServiceSA]);

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
    <BaseContainer header={"Term Of Service Information"}>
      <div className="w-full">
        <TablePaginationNew
          dataSource={
            data_termOfServiceSA && data_termOfServiceSA.length === 0
              ? null
              : dataTable
          }
          columns={columnsTermOfService(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          )}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={data_termOfServiceSA?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p className="text-primary text-xs font-bold uppercase pt-4">
                  DETAIL TERM OF SERVICE INFORMATION
                </p>
                <TablePaginationNew
                  useSelect={false}
                  usePagination={false}
                  dataSource={record?.tosDetail}
                  columns={columnsDetailTermOfService(
                    page,
                    pageSize,
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                  )}
                  className={"mb-4"}
                />
              </div>
            ),
          }}
        />
      </div>
    </BaseContainer>
  );
};

export default TosSection;
