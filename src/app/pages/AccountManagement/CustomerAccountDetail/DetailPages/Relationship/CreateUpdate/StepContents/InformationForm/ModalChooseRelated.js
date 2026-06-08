import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRelatedObjects } from "../../../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { getStandaloneRelatedObjects } from "../../../../../../../../../redux/slices/relationship/standaloneRelationshipSlice";
import NxModal from "../../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import { getCustomerColumns } from "./getCustomerColumns";
import { getAccountColumns } from "./getAccountColumns";
import { Button } from "antd";

/**
 * Modal for selecting a related account or customer record.
 * Table type (account vs. customer) is derived from `relationshipTypeName`.
 *
 * @param {object}   props
 * @param {boolean}  [props.isOpen=false]             - Controls modal visibility.
 * @param {Function} [props.handleCancel=()=>{}]      - Closes the modal.
 * @param {Function} [props.handleSelect=()=>{}]      - Called with the chosen record.
 * @param {*}        [props.accountId=null]            - Current account identifier.
 * @param {*}        props.relationshipType            - Relationship type ID.
 * @param {*}        props.relationshipCategory        - Relationship category ID.
 * @param {string}   props.relationshipTypeName        - Human-readable relationship type name.
 */
const ModalChooseRelated = ({
  isOpen = false,
  handleCancel = () => {},
  handleSelect = () => {},
  accountId = null,
  relationshipType,
  relationshipCategory,
  relationshipTypeName,
  isStandalone = false,
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // --- State ---
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  // --- Redux ---
  const { list_relatedObject, pagination_listRelatedObject, loading_listRelatedObject } =
    useSelector((state) => isStandalone ? state.standaloneRelationship : state.relationship);

  // --- Derived values ---
  // Normalize relationshipTypeName for comparison (convert "Child Of" to "CHILD_OF")
  const normalizedRelationType = relationshipTypeName
    ? relationshipTypeName.trim().toUpperCase().replace(/\s+/g, "_")
    : null;

  // CHILD_OF, PARENT_OF = Account columns
  // BRANCH_OF, HEAD_QUARTER_OF, COMPANY_GROUP = Customer columns
  const isAccountType =
    normalizedRelationType &&
    ["CHILD_OF", "PARENT_OF"].includes(normalizedRelationType);

  // --- Handlers ---
  /**
   * Updates sort state from Ant Design table onChange.
   * @param {*}      _        - Ignored pagination arg
   * @param {*}      __       - Ignored filters arg
   * @param {object} sortInfo - Sort descriptor from NxTable
   */
  const onSort = (_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  /**
   * Applies column search filter and resets page to 0 on new queries.
   * @param {string[]} selectedKeys - Active filter values
   * @param {Function} confirm      - Antd confirm callback
   * @param {string}   dataIndex    - Column key being searched
   */
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

  /**
   * Fetches the next page of related objects and appends to the list.
   */
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_listRelatedObject?.totalPages || 0;

    const body = {
      page: nextPage,
      size: loadMoreSize,
      sort,
      searchs: search
    };
    
    if (nextPage <= totalPages) {
      const dispatchArgs = isStandalone
        ? { subjectAccountId: accountId, relationshipType, relationshipCategory, body, isLoadMore: true }
        : { accountId, relationshipType, relationshipCategory, body, isLoadMore: true };
      await dispatch(isStandalone ? getStandaloneRelatedObjects(dispatchArgs) : getRelatedObjects(dispatchArgs));
    }
    setPage(nextPage);
  };

  // --- Effects ---
  useEffect(() => {
    if (accountId && relationshipType && relationshipCategory) {
      const body = {
        page: 0,
        size: loadMoreSize,
        sort,
        searchs: search,
      }

      setPage(0);
      const dispatchArgs = isStandalone
        ? { subjectAccountId: accountId, relationshipType, relationshipCategory, body, isLoadMore: false }
        : { accountId, relationshipType, relationshipCategory, body, isLoadMore: false };
      dispatch(isStandalone ? getStandaloneRelatedObjects(dispatchArgs) : getRelatedObjects(dispatchArgs));
    }
  }, [dispatch, accountId, relationshipType, relationshipCategory, sort, search]);

  // --- Columns ---
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
    currentData.length < (pagination_listRelatedObject?.totalElements || 0);

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
            totalData={pagination_listRelatedObject?.totalElements || 0}
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
