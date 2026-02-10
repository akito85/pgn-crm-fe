import { memo, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import MultiDestinationTable from "./MultiDestinationTable";
import { useDispatch, useSelector } from "react-redux";
import { getMultiDestination, downloadMultiDestination, getMdApprovalHistory, inactivateMultiDestination } from "../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import MultiDestinationApprovalModal from "./MultiDestinationApprovalModal";
import NxApproveOrRejectModal from "../../../../../../components/Nx/NxApproveOrRejectModal";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";

const MultiDestination = ({
  id = 0,
  idCustomer = 0,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    list_multiDestination,
    pagination_multiDestination,
    data_mdApprovalHistory,
    loading,
  } = useSelector(
    (state) => state.multiDestination
  );

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateMdId, setInactivateMdId] = useState(0);
  const [inactivateMdAppHierId, setInactivateMdAppHierId] = useState(0);
  const [inactivateMdAccountNumber, setInactivateMdAccountNumber] = useState(0);

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [tempFilters, setTempFilters] = useState([]);

  const currentData = useMemo(() => list_multiDestination, [list_multiDestination]);

  const currentPagination = pagination_multiDestination;
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
      page: 1,
      size: loadMoreSize,
      sort,
      searchs: search,
      inputFields: tempFilters,
    }

    dispatch(
      getMultiDestination({
        id,
        body,
        isLoadMore: false,
      })
    );
    setPage(1);
  };

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} mdId
   * @param {number} mdAppHierId
   */
  const handleInactivateModal = (show, newMdId = 0, newMdAppHierId = 0, newMdAccountNumber = "") => {
    if (show) {
      setInactivateMdId(newMdId);
      setInactivateMdAppHierId(newMdAppHierId);
      setInactivateMdAccountNumber(newMdAccountNumber)
      setShowInactiveModal(true);
    } else {
      setInactivateMdId(0);
      setInactivateMdAppHierId(0);
      setInactivateMdAccountNumber("");
      setShowInactiveModal(false);
    }
  }

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivateMd = (remark, handleClear) => {
    const body = {
      id: inactivateMdId,
      appHierId: inactivateMdAppHierId,
      remark,
    }

    dispatch(inactivateMultiDestination({
      body,
    }))
    .unwrap()
    .then(() => {
      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
        inputFields: tempFilters,
      }

      dispatch(getMultiDestination({ id, body, isLoadMore: false }));
      setShowInactiveModal(false);
      handleClear();
    })
    .catch(() => {})
  }

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
        setPage(1);
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
   * @param {number} mdId
   */
  const handleApprovalHistoryModal = (show, mdId = 0) => {
    if (show) {
      dispatch(getMdApprovalHistory(mdId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  }

  const handleDownload = () => {
    const body = {
      page,
      size: loadMoreSize,
      sort,
      inputFields: tempFilters,
      searchs: search
    }

    dispatch(downloadMultiDestination({ body, id, }));
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
    const totalPages = pagination_multiDestination?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: JSON.stringify(search),
        inputFields: tempFilters,
      }

      await dispatch(
        getMultiDestination({
          id,
          body,
          isLoadMore: true,
        })
      );
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount(`/account-management/account-standard/multi-destination`))
    }else{
      dispatch(getGrantedAccessAccount(`/account-management/account-onetime/multi-destination`))
    }
  }, []);

  useEffect(() => {
    const body = {
      page,
      size: loadMoreSize,
      sort,
      searchs: search,
      inputFields: tempFilters,
    }

    dispatch(getMultiDestination({ id, body, isLoadMore: false }));
  }, [sort, search, tempFilters]);

  useEffect(() => {
    if (data_mdApprovalHistory && data_mdApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_mdApprovalHistory?.dataApprover?.MULTI_DESTINATION || [],
          inactive: data_mdApprovalHistory?.dataApprover?.INACTIVE_MULTI_DESTINATION || [],
        },
        dataHistory: {
          create: data_mdApprovalHistory?.dataHistory?.MULTI_DESTINATION || [],
          inactive: data_mdApprovalHistory?.dataHistory?.INACTIVE_MULTI_DESTINATION || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_mdApprovalHistory]);

  return (
    <NxCardContainer header={"MULTI DESTINATION"}>
      <NxBaseContainer border>
        <MultiDestinationTable
          data={dataSourceWithKeys}
          idAccount={id}
          idCustomer={idCustomer}
          totalElement={pagination_multiDestination.totalElements}
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
          loading={loading}
        />

        <MultiDestinationApprovalModal
          id={id}
          isOpen={showApprovalModal}
          handleCancel={() => setShowApprovalModal(false)}
          afterFinish={handleRefresh}
        />

        {/* Inactivate Modal */}
        <NxApproveOrRejectModal
          isOpen={showInactiveModal}
          header={"INACTIVATE"}
          handleCloseModal={() => handleInactivateModal(false)}
          customMessage={`Are you sure you want to inactivate multi destination - ${inactivateMdAccountNumber}?`}
          onFinish={({ remark }, handleClear) => handleInactivateMd(remark, handleClear)}
        />

        {/* Approval History Modal */}
        <NxHistoryModal
          isOpen={showApprovalHistoryModal}
          handleClose={() => handleApprovalHistoryModal(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleApprovalHistoryOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default memo(MultiDestination);
