import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { getServiceRequestPreRequisites } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { getPreRequisiteColumns } from "./getPreRequisiteColumns";

const CustomerServiceRequestPreRequisite = ({ id, idAccount }) => {
  const dispatch = useDispatch();
  const { list_srPrerequisites, pagination_listSrPrerequisites, loading_listSrPrerequisites } =
    useSelector((state) => state.serviceRequest);

  const searchInput = useRef(null);
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const totalElement = pagination_listSrPrerequisites?.totalElement || 0;
  const hasMore = list_srPrerequisites.length < totalElement;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => {
      if (prev[dataIndex] !== selectedKeys[0]) setPage(0);
      return { ...prev, [dataIndex]: selectedKeys[0] };
    });
  };

  const onSort = (_, __, sorter) => {
    const dataSort = sorter.order
      ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    if (nextPage <= (pagination_listSrPrerequisites?.totalPage || 0)) {
      const body = { page: nextPage, size: loadMoreSize, sort, searchs: search, filters, filterRules };
      await dispatch(getServiceRequestPreRequisites({ accountId: idAccount, serviceRequestId: id, body, isLoadMore: true })).unwrap();
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (!id) return;
    const body = { page: 0, size: loadMoreSize, sort, searchs: search, filters, filterRules };
    setPage(0);
    dispatch(getServiceRequestPreRequisites({ accountId: idAccount, serviceRequestId: id, body, isLoadMore: false }));
  }, [sort, search, filters, filterRules, id]);

  const columns = useMemo(
    () => getPreRequisiteColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchInput, searchText, searchedColumn]
  );

  return (
    <NxBaseContainer border>
      <NxTable
        idTable="sr-prerequisite-table"
        dataSource={list_srPrerequisites}
        totalData={totalElement}
        current={page}
        columns={columns}
        onSort={onSort}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        loading={loading_listSrPrerequisites}
        fontSize="small"
        tablePadding="small"
        tableScrolled={{ x: "max-content", y: 300 }}
      />
    </NxBaseContainer>
  );
};

export default CustomerServiceRequestPreRequisite;
