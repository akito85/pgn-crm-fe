import { memo, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import RelationshipTable from "./RelationshipTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getRelationshipListAdvanced,
  downloadRelationship,
  getApprovalHistory,
  inactivateRelationship,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import NxApproveOrRejectModal from "../../../../../../components/Nx/NxApproveOrRejectModal";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import RelationshipApprovalModal from "./RelationshipApprovalModal";

const Relationship = ({
  id = 0,
  idCustomer = 0,
  type = "standard",
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    list_relationship,
    pagination_relationship,
    data_approvalHistory,
    loading_listRelationship,
  } = useSelector((state) => state.relationship);

  // declare
  const searchInput = useRef(null);

  // state
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateId, setInactivateId] = useState(0);
  const [inactivateAppHierId, setInactivateAppHierId] = useState(0);
  const [inactivateName, setInactivateName] = useState("");

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [tempFilters, setTempFilters] = useState([]);

  const currentData = useMemo(() => list_relationship, [list_relationship]);

  const currentPagination = pagination_relationship;
  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
    }));
  }, [currentData]);

  const handleRefresh = () => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      inputFields: tempFilters,
    };

    dispatch(
      getRelationshipListAdvanced({
        idAccount: id,
        page: 0,
        pageSize: loadMoreSize,
        sort,
        body,
        isLoadMore: false,
      })
    );
    setPage(0);
  };

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} relationshipId
   * @param {number} appHierId
   * @param {string} name
   */
  const handleInactivateModal = (show, relationshipId = 0, appHierId = 0, name = "") => {
    if (show) {
      setInactivateId(relationshipId);
      setInactivateAppHierId(appHierId);
      setInactivateName(name);
      setShowInactiveModal(true);
    } else {
      setInactivateId(0);
      setInactivateAppHierId(0);
      setInactivateName("");
      setShowInactiveModal(false);
    }
  };

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivate = (remark, handleClear) => {
    const body = {
      id: inactivateId,
      appHierId: inactivateAppHierId,
      remark,
    };

    dispatch(
      inactivateRelationship({
        accountId: id,
        body,
      })
    )
      .unwrap()
      .then(() => {
        const body = {
          page,
          size: loadMoreSize,
          sort,
          searchs: search,
          inputFields: tempFilters,
        };

        dispatch(
          getRelationshipListAdvanced({
            idAccount: id,
            page: 0,
            pageSize: loadMoreSize,
            sort,
            body,
            isLoadMore: false,
          })
        );
        setShowInactiveModal(false);
        handleClear();
      })
      .catch(() => {});
  };

  /**
   * @param {string[]} selectedKeys
   * @param {() => {}} confirm
   * @param {string} dataIndex
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

  const handleApprovalHistoryOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      key: item,
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
      label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  /**
   * @param {boolean} show
   * @param {number} relationshipId
   */
  const handleApprovalHistoryModal = (show, relationshipId = 0) => {
    if (show) {
      dispatch(getApprovalHistory({ idAccount: id, relationshipId }));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

  const handleDownload = () => {
    const body = {
      page,
      size: loadMoreSize,
      sort,
      inputFields: tempFilters,
      searchs: search,
    };

    dispatch(downloadRelationship({ idAccount: id, body }));
  };

  /**
   * @param {*} _
   * @param {*} __
   * @param {import("antd/lib/table/interface").SorterResult} sort
   */
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_relationship?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: JSON.stringify(search),
        inputFields: tempFilters,
      };

      await dispatch(
        getRelationshipListAdvanced({
          idAccount: id,
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          body,
          isLoadMore: true,
        }).unwrap()
      );
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (location?.pathname.includes("account-standard")) {
      dispatch(
        getGrantedAccessAccount(`/account-management/account-standard/relationship`)
      );
    } else {
      dispatch(
        getGrantedAccessAccount(`/account-management/account-onetime/relationship`)
      );
    }
  }, []);

  useEffect(() => {
    const body = {
      page,
      size: loadMoreSize,
      sort,
      searchs: search,
      inputFields: tempFilters,
    };

    dispatch(
      getRelationshipListAdvanced({
        idAccount: id,
        page,
        pageSize: loadMoreSize,
        sort,
        body,
        isLoadMore: false,
      })
    );
  }, [sort, search, tempFilters]);

  useEffect(() => {
    if (data_approvalHistory && data_approvalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_approvalHistory?.dataApprover?.ACCOUNT_RELATIONSHIP || [],
          inactive: data_approvalHistory?.dataApprover?.INACTIVE_ACCOUNT_RELATIONSHIP || [],
        },
        dataHistory: {
          create: data_approvalHistory?.dataHistory?.ACCOUNT_RELATIONSHIP || [],
          inactive: data_approvalHistory?.dataHistory?.INACTIVE_ACCOUNT_RELATIONSHIP || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_approvalHistory]);

  return (
    <NxCardContainer header={"RELATIONSHIP LIST"}>
      <NxBaseContainer border>
        <RelationshipTable
          data={dataSourceWithKeys}
          idAccount={id}
          idCustomer={idCustomer}
          type={type}
          totalElement={pagination_relationship.totalElements}
          page={page}
          onSort={onSort}
          handleInactivateModal={handleInactivateModal}
          handleApprovalHistoryModal={handleApprovalHistoryModal}
          handleApproval={setShowApprovalModal}
          handleDownload={handleDownload}
          tempFilters={tempFilters}
          handleLoadMore={handleLoadMore}
          hasMore={hasMore}
          searchText={searchText}
          search={search}
          searchedColumn={searchedColumn}
          searchInput={searchInput}
          handleSearch={handleSearch}
          loading={loading_listRelationship}
        />

        <RelationshipApprovalModal
          idAccount={id}
          isOpen={showApprovalModal}
          handleCancel={() => setShowApprovalModal(false)}
          afterFinish={handleRefresh}
        />

        {/* Inactivate Modal */}
        <NxApproveOrRejectModal
          isOpen={showInactiveModal}
          header={"INACTIVATE"}
          handleCloseModal={() => handleInactivateModal(false)}
          customMessage={`Are you sure you want to inactivate relationship - ${inactivateName}?`}
          onFinish={({ remark }, handleClear) => handleInactivate(remark, handleClear)}
        />

        {/* Approval History Modal */}
        <NxHistoryModal
          isOpen={showApprovalHistoryModal}
          handleClose={() => handleApprovalHistoryModal(false)}
          header={"Approval History"}
          tabOptions={handleApprovalHistoryOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default memo(Relationship);
