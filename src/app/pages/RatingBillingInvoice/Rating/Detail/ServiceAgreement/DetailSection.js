import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import { getColumnSearchPropsPaging, getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { getAllDetailServiceAgreementPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { hasValue, renderColumn } from "../../../../../../utils";

export const columnsDetailServiceAgreement = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  search
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "NAME",
    dataIndex: "name",
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

const DetailSection = ({ SAId }) => {
  // Selector
  const { data_detailServiceAgreement } = useSelector((state) => state.rating);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_detailServiceAgreement?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllDetailServiceAgreementPaginate({
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
  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <BaseContainer header={"Service Agreement Detail Information"}>
      <div className="w-full">
        <TablePaginationNew
          dataSource={dataSource}
          columns={columnsDetailServiceAgreement(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            search
          )}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={data_detailServiceAgreement?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
        />
      </div>
    </BaseContainer>
  );
};

export default DetailSection;
