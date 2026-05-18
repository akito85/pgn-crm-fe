import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { getSrContacts } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { getContactColumns } from "./getContactColumns";
import ContactDetailTable from "./ContactDetailTable";

// ── Component ─────────────────────────────────────────────────────────────────
const CustomerServiceRequestContact = ({ id, idAccount }) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);
  const searchInput = useRef(null);

  const { list_srContacts, loading_listSrContacts, pagination_listSrContacts } = useSelector(
    (state) => state.serviceRequest
  );

  const totalElement = pagination_listSrContacts?.totalElement || 0;
  const hasMore = list_srContacts.length < totalElement;

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
    if (nextPage <= (pagination_listSrContacts?.totalPage || 0)) {
      const body = { page: nextPage, size: loadMoreSize, sort, searchs: search, filters, filterRules };
      await dispatch(getSrContacts({ accountId: idAccount, srId: id, body, isLoadMore: true })).unwrap();
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (!id || !idAccount) return;
    const body = { page: 0, size: loadMoreSize, sort, searchs: search, filters, filterRules };
    setPage(0);
    dispatch(getSrContacts({ accountId: idAccount, srId: id, body, isLoadMore: false }));
  }, [sort, search, filters, filterRules, id, idAccount]);

  const columns = useMemo(
    () => getContactColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchInput, searchText, searchedColumn]
  );

  const expandedRowRender = (record, index) => (
    <ContactDetailTable details={record.details || []} contactKey={index} />
  );

  return (
    <NxBaseContainer header="CONTACT" border>
      <NxTable
        idTable="sr-contact-table"
        dataSource={list_srContacts}
        totalData={totalElement}
        current={page}
        columns={columns}
        onSort={onSort}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        loading={loading_listSrContacts}
        fontSize="small"
        tablePadding="small"
        tableScrolled={{ x: "max-content" }}
        expandable={ list_srContacts.length ? { expandedRowRender } : undefined}
      />
    </NxBaseContainer>
  );
};

export default CustomerServiceRequestContact;
