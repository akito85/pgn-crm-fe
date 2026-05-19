import { useMemo, useRef, useState } from "react";
import NxTable from "../../../../../../components/Nx/NxTable";
import { getContactColumns } from "./getContactColumns";
import ServiceRequestContactDetailTable from "./ServiceRequestContactDetailTable";

const ServiceRequestContactTable = ({
  idTable = "sr-contact-table",
  dataSource = [],
  loading = false,
  totalData = 0,
  useInfiniteScroll = false,
  hasMore = false,
  onLoadMore = () => {},
  loadMoreThreshold = 20,
  usePagination = true,
  current,
  useSelect = false,
  onSearch,
  onSort,
  fontSize,
  tablePadding,
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => {
      const next = { ...prev, [dataIndex]: selectedKeys[0] };
      onSearch?.(next);
      return next;
    });
  };

  const handleSort = (_, __, sorter) => {
    const sortStr = sorter.order
      ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
      : "";
    onSort?.(sortStr);
  };

  const columns = useMemo(
    () => getContactColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchText, searchedColumn] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const expandedRowRender = (record, index) => (
    <ServiceRequestContactDetailTable
      details={record.contactDetails || record.details || []}
      idTable={`contact-detail-table-${index}`}
    />
  );

  const expandable = dataSource.length
    ? { expandedRowRender }
    : undefined;

  return (
    <NxTable
      idTable={idTable}
      dataSource={dataSource}
      totalData={totalData}
      current={current}
      columns={columns}
      onSort={handleSort}
      usePagination={usePagination}
      useInfiniteScroll={useInfiniteScroll}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      loadMoreThreshold={loadMoreThreshold}
      loading={loading}
      useSelect={useSelect}
      expandable={expandable}
      fontSize={fontSize}
      tablePadding={tablePadding}
      tableScrolled={{ x: "max-content" }}
    />
  );
};

export default ServiceRequestContactTable;
