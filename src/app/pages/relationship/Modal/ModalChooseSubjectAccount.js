import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import NxModal from "../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import { getSubjectAccounts } from "../../../../redux/slices/relationship/standaloneRelationshipSlice";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

const ModalChooseSubjectAccount = ({
  isOpen = false,
  handleCancel = () => {},
  handleSelect = () => {},
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const { list_subjectAccounts, pagination_listSubjectAccounts, loading_listSubjectAccounts } =
    useSelector((state) => state.standaloneRelationship);

  const fetchData = (nextPage, isLoadMore, overrideSearch, overrideSort) => {
    const body = {
      page: nextPage,
      size: 20,
      sort: overrideSort !== undefined ? overrideSort : sort,
      searchs: overrideSearch !== undefined ? overrideSearch : search,
    };
    dispatch(getSubjectAccounts({ body, isLoadMore }));
    setPage(nextPage);
  };

  useEffect(() => {
    if (isOpen) fetchData(0, false, {}, "");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) fetchData(0, false);
  }, [search, sort]);

  const handleLoadMore = () => {
    const totalPages = pagination_listSubjectAccounts?.totalPages || 0;
    if (page + 1 < totalPages) fetchData(page + 1, true);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
    setPage(0);
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearch((prev) => {
      const s = { ...prev };
      delete s[dataIndex];
      return s;
    });
  };

  const onSort = (_, __, sortInfo) => {
    setSort(sortInfo.order ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}` : "");
  };

  const columns = useMemo(() => [
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 160,
      ...getColumnSearchPropsUseFilteredValue("accountNumber", searchInput, searchedColumn, searchText, handleSearch, handleReset),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      key: "accountName",
      width: 200,
      ...getColumnSearchPropsUseFilteredValue("accountName", searchInput, searchedColumn, searchText, handleSearch, handleReset),
    },
    {
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      key: "accountType",
      width: 140,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (val) => val?.toUpperCase?.() || val,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 180,
    },
    {
      title: "ACTION",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => { handleSelect(record); handleCancel(); }}
        >
          Select
        </Button>
      ),
    },
  ], [searchedColumn, searchText]);

  const dataSource = useMemo(
    () => list_subjectAccounts.map((item, idx) => ({ ...item, key: `${item.id || item.accountId}-${idx}` })),
    [list_subjectAccounts]
  );

  const hasMore = dataSource.length < (pagination_listSubjectAccounts?.totalElements || 0);

  return (
    <NxModal
      isOpen={isOpen}
      title="CHOOSE ACCOUNT"
      handleCancel={handleCancel}
      width={900}
      footer={
        <div className="flex justify-end">
          <Button type="default" onClick={handleCancel}>Back</Button>
        </div>
      }
    >
      <div className="p-4">
        <NxBaseContainer border>
          <NxTable
            idTable="modal-choose-subject-account"
            loading={loading_listSubjectAccounts}
            dataSource={dataSource}
            columns={columns}
            totalData={pagination_listSubjectAccounts?.totalElements || 0}
            current={page}
            usePagination={false}
            useInfiniteScroll
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onSort={onSort}
            tableScrolled={{ x: 900 }}
          />
        </NxBaseContainer>
      </div>
    </NxModal>
  );
};

export default ModalChooseSubjectAccount;
