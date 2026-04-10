import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRelatedObjectData } from "../../../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import NxModal from "../../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import { getCustomerColumns } from "./getCustomerColumns";
import { getAccountColumns } from "./getAccountColumns";
import { Button } from "antd";

const ModalChooseRelated = ({
  isOpen = false,
  handleCancel = () => {},
  handleSelect = () => {},
  accountId = null,
  relationshipType,
  relationshipCategory,
  relationshipTypeName,
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const { list_relatedObject, pagination_relatedObject, loading_listRelatedObject } =
    useSelector((state) => state.relationship);

  // Normalize relationshipTypeName for comparison (convert "Child Of" to "CHILD_OF")
  const normalizedRelationType = relationshipTypeName
    ? relationshipTypeName.trim().toUpperCase().replace(/\s+/g, "_")
    : null;

  // CHILD_OF, PARENT_OF = Account columns
  // BRANCH_OF, HEAD_QUARTER_OF, COMPANY_GROUP = Customer columns
  const isAccountType =
    normalizedRelationType &&
    ["CHILD_OF", "PARENT_OF"].includes(normalizedRelationType);

  const onSort = (_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(0);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_relatedObject?.totalPages || 0;

    const body = {
      page: nextPage,
      size: loadMoreSize,
      sort,
      searchs: search
    };
    
    if (nextPage <= totalPages) {
      await dispatch(
        getRelatedObjectData({
          accountId,
          relationshipType,
          relationshipCategory,
          body,
          isLoadMore: true,
        })
      );
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (accountId && relationshipType && relationshipCategory) {
      const body = {
        page: 0,
        size: loadMoreSize,
        sort,
        searchs: search,
      }
      
      setPage(0);
      dispatch(
        getRelatedObjectData({
          accountId,
          relationshipType,
          relationshipCategory,
          body,
          isLoadMore: false,
        })
      );
    }
  }, [dispatch, accountId, relationshipType, relationshipCategory, sort, search]);

  const baseColumns = useMemo(() => {
    const columnFn = isAccountType ? getAccountColumns : getCustomerColumns;
    return columnFn(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      handleSelect,
      handleCancel,
    );
  }, [search, searchText, searchedColumn, isAccountType]);

  const allColumns = useMemo(() => {
    return [...baseColumns].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const currentData = useMemo(() => list_relatedObject, [list_relatedObject]);

  const hasMore =
    currentData.length < (pagination_relatedObject?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id || item.relatedObjectId}-${index}`,
    }));
  }, [currentData]);

  // Determine modal header based on type
  const modalHeader = isAccountType ? "CHOOSE ACCOUNT" : "CHOOSE CUSTOMER";
  const tableScrolledX = isAccountType ? 3500 : 1400;

  return (
    <NxModal
      isOpen={isOpen}
      title={modalHeader}
      handleCancel={() => handleCancel()}
      width={1100}
      footer={
        <div className="flex justify-end">
          <Button type="menu" onClick={handleCancel}>
            Back
          </Button>
        </div>
      }
    >
      <div className="p-4">
        <NxBaseContainer border>
          <NxTable
            idTable="modal-choose-related"
            loading={loading_listRelatedObject}
            dataSource={dataSourceWithKeys}
            totalData={pagination_relatedObject?.totalElements || 0}
            current={page}
            tableScrolled={{ x: tableScrolledX }}
            onSort={onSort}
            columns={allColumns}
            usePagination={false}
            useInfiniteScroll
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadMoreThreshold={20}
            columnDefinitions={columnDefinitions}
          />
        </NxBaseContainer>
      </div>
    </NxModal>
  );
};

export default ModalChooseRelated;
