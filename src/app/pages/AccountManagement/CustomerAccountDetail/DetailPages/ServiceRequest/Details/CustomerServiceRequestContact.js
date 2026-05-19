import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { getSrContacts } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import ServiceRequestContactTable from "../ServiceRequestContactTable";

// ── Component ─────────────────────────────────────────────────────────────────
const CustomerServiceRequestContact = ({ id, idAccount }) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filters] = useState([]);
  const [filterRules] = useState([]);

  const { list_srContacts, loading_listSrContacts, pagination_listSrContacts } = useSelector(
    (state) => state.serviceRequest
  );

  const totalElement = pagination_listSrContacts?.totalElement || 0;
  const hasMore = list_srContacts.length < totalElement;

  const handleSearch = (searchObj) => {
    setPage(0);
    setSearch(searchObj);
  };

  const handleSort = (sortStr) => {
    setSort(sortStr);
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
  }, [sort, search, filters, filterRules, id, idAccount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NxBaseContainer header="CONTACT" border>
      <ServiceRequestContactTable
        idTable="sr-contact-table"
        dataSource={list_srContacts}
        totalData={totalElement}
        current={page}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loading={loading_listSrContacts}
        onSearch={handleSearch}
        onSort={handleSort}
        fontSize="small"
        tablePadding="small"
      />
    </NxBaseContainer>
  );
};

export default CustomerServiceRequestContact;
