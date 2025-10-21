import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { getAllCalculationRuleServiceAgreementPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";

export const columnsCalculationRuleServiceAgreement = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
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
    ...getColumnSearchPropsPaging(
      "name",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "VALUE",
    dataIndex: "value",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsPaging(
      "value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "UNIT",
    dataIndex: "unit",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "unit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
];

const CalculationRuleSection = ({ SAId }) => {
  // Selector
  const { data_calculationRuleServiceAgreement } = useSelector(
    (state) => state.rating,
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
      getAllCalculationRuleServiceAgreementPaginate({
        id: SAId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [SAId, search, page, pageSize, sort]);

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
    <BaseContainer header={"Calculation Rule Information"}>
      <div className="w-full">
        <TablePaginationNew
          dataSource={dataSource}
          columns={columnsCalculationRuleServiceAgreement(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          )}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={
            data_calculationRuleServiceAgreement?.page?.totalElements || 0
          }
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
        />
      </div>
    </BaseContainer>
  );
};

export default CalculationRuleSection;
