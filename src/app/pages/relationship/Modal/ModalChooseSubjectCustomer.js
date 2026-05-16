import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import NxModal from "../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import { getSubjectCustomers } from "../../../../redux/slices/relationship/standaloneRelationshipSlice";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

const ModalChooseSubjectCustomer = ({
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

  const { list_subjectCustomers, pagination_listSubjectCustomers, loading_listSubjectCustomers } =
    useSelector((state) => state.standaloneRelationship);

  const fetchData = (nextPage, isLoadMore, overrideSearch, overrideSort) => {
    const body = {
      page: nextPage,
      size: 20,
      sort: overrideSort !== undefined ? overrideSort : sort,
      searchs: overrideSearch !== undefined ? overrideSearch : search,
    };
    dispatch(getSubjectCustomers({ body, isLoadMore }));
    setPage(nextPage);
  };

  useEffect(() => {
    if (isOpen) fetchData(0, false, {}, "");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) fetchData(0, false);
  }, [search, sort]);

  const handleLoadMore = () => {
    const totalPages = pagination_listSubjectCustomers?.totalPages || 0;
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
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      key: "customerNumber",
      width: 160,
      ...getColumnSearchPropsUseFilteredValue("customerNumber", searchInput, searchedColumn, searchText, handleSearch, handleReset),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      ...getColumnSearchPropsUseFilteredValue("customerName", searchInput, searchedColumn, searchText, handleSearch, handleReset),
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
    () => list_subjectCustomers.map((item, idx) => ({ ...item, key: `${item.id || item.customerId}-${idx}` })),
    [list_subjectCustomers]
  );

  const hasMore = dataSource.length < (pagination_listSubjectCustomers?.totalElements || 0);

  return (
    <NxModal
      isOpen={isOpen}
      title="CHOOSE CUSTOMER"
      handleCancel={handleCancel}
      width={700}
      footer={
        <div className="flex justify-end">
          <Button type="default" onClick={handleCancel}>Back</Button>
        </div>
      }
    >
      <div className="p-4">
        <NxBaseContainer border>
          <NxTable
            idTable="modal-choose-subject-customer"
            loading={loading_listSubjectCustomers}
            dataSource={dataSource}
            columns={columns}
            totalData={pagination_listSubjectCustomers?.totalElements || 0}
            current={page}
            usePagination={false}
            useInfiniteScroll
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onSort={onSort}
            tableScrolled={{ x: 500 }}
          />
        </NxBaseContainer>
      </div>
    </NxModal>
  );
};

export default ModalChooseSubjectCustomer;
