import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { getServiceRequestActionLogs } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { getActionLogColumns } from "./getActionLogColumns";

const ActionLogTable = ({ serviceRequestId }) => {
  const dispatch = useDispatch();
  const { list_srActionLogs, pagination_listSrActionLogs, loading_listSrActionLogs } =
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

  const totalElement = pagination_listSrActionLogs?.totalElement || 0;
  const hasMore = list_srActionLogs.length < totalElement;

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
    if (nextPage <= (pagination_listSrActionLogs?.totalPage || 0)) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      };
      await dispatch(
        getServiceRequestActionLogs({ serviceRequestId, body, isLoadMore: true })
      ).unwrap();
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (!serviceRequestId) return;
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules,
    };
    setPage(0);
    dispatch(getServiceRequestActionLogs({ serviceRequestId, body, isLoadMore: false }));
  }, [sort, search, filters, filterRules, serviceRequestId]);

  const columns = useMemo(
    () => getActionLogColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchInput, searchText, searchedColumn]
  );

  return (
    <NxCardContainer header="ACTION LOG">
      <NxBaseContainer border>
        <NxTable
          idTable="action-log-table"
          dataSource={list_srActionLogs}
          totalData={totalElement}
          current={page}
          columns={columns}
          onSort={onSort}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          loading={loading_listSrActionLogs}
          fontSize="small"
          tablePadding="small"
          tableScrolled={{ x: "max-content", y: 300 }}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default ActionLogTable;
