import { memo, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import GasDepositTable from "./GasDepositTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getGasDeposit,
  downloadGasDeposit,
  getGdApprovalHistory,
  inactivateGasDeposit,
  getGdApprovalHierarchy,
  getDetailGdApprovalHierarchy
} from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import GasDepositApprovalModal from "./GasDepositApprovalModal";
import NxInactivateModal from "../../../../components/Nx/NxInactivateModal";
import NxHistoryModal from "../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../redux/slices/account_management/accountManagement";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

/**
 * Gas deposit list table page/module
 * @param {{ moduleType: "sa" | "ua"; id?: number; idCustomer?: number }} props 
 * @returns 
 */
const GasDeposit = ({ moduleType, id = 0, idCustomer = 0 }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isStandAlone = moduleType = "sa";
  const isUnderAccount = moduleType = "ua";

  const isStandard = isUnderAccount && location.pathname.includes("account-standard");
  const isOneTime = isUnderAccount && location.pathname.includes("account-onetime");

  const {
    list_gasDeposit,
    pagination_gasDeposit,
    data_gdApprovalHistory,
    loading_listGd
  } = useSelector((state) => state.gasDeposit);

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateGdId, setInactivateGdId] = useState(0);
  const [inactivateGdAccountNumber, setInactivateGdAccountNumber] = useState(0);

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] =
    useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const currentData = useMemo(
    () => list_gasDeposit,
    [list_gasDeposit]
  );

  const currentPagination = pagination_gasDeposit;
  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`
    }));
  }, [currentData]);

  const handleRefresh = () => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules,
    };

    dispatch(
      getGasDeposit({
        id: isUnderAccount ? id : undefined,
        body,
        isLoadMore: false
      })
    );
    setPage(0);
  };

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} gdId
   * @param {number} gdAppHierId
   */
  const handleInactivateModal = (
    show,
    newGdId = 0,
    newGdAccountNumber = ""
  ) => {
    if (show) {
      setInactivateGdId(newGdId);
      setInactivateGdAccountNumber(newGdAccountNumber);
      setShowInactiveModal(true);
    } else {
      setInactivateGdId(0);
      setInactivateGdAccountNumber("");
      setShowInactiveModal(false);
    }
  };

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivateGd = ({ remark, appHierId }, handleClear) => {
    const body = {
      id: inactivateGdId,
      appHierId,
      remark
    };

    dispatch(
      inactivateGasDeposit({
        body
      })
    )
      .unwrap()
      .then(() => {
        const body = {
          page,
          size: loadMoreSize,
          sort,
          searchs: search,
          filters,
          filterRules,
        };

        dispatch(getGasDeposit({ id: isUnderAccount ? id : undefined, body, isLoadMore: false }));
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
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0]
      };
    });
  };

  const handleApprovalHistoryOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      key: item,
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
      label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
    }));
  };

  /**
   * @param {boolean} show
   * @param {number} gdId
   */
  const handleApprovalHistoryModal = (show, gdId = 0) => {
    if (show) {
      dispatch(getGdApprovalHistory(gdId));
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
      filters,
      filterRules,
      searchs: search
    };

    dispatch(downloadGasDeposit({ body, id }));
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
    const totalPages = pagination_gasDeposit?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      };

      await dispatch(
        getGasDeposit({
          id: isUnderAccount ? id : undefined,
          body,
          isLoadMore: true
        })
      ).unwrap();
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (isStandAlone)
      getGrantedAccessAccount(`/account-management/gas-deposit`);
    else if (isStandard || isOneTime) {
      const accountType = isStandard ? "/account-standard" : isOneTime ? "/account-onetime" : ""
      getGrantedAccessAccount(`/account-management${accountType}/gas-deposit`);
    }
  }, [])

  useEffect(() => {
    if (isStandard) {
      dispatch(
        getGrantedAccessAccount(
          `/account-management/account-standard/gas-deposit`
        )
      );
    } else if (isOneTime) {
      dispatch(
        getGrantedAccessAccount(
          `/account-management/account-onetime/gas-deposit`
        )
      );
    }
  }, []);

  useEffect(() => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules,
    };

    setPage(0);

    dispatch(getGasDeposit({ id: isUnderAccount ? id : undefined, body, isLoadMore: false }));
  }, [sort, search, filters, filterRules]);

  useEffect(() => {
    if (data_gdApprovalHistory && data_gdApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_gdApprovalHistory?.dataApprover?.GAS_DEPOSIT || [],
          inactive:
            data_gdApprovalHistory?.dataApprover?.INACTIVE_GAS_DEPOSIT ||
            []
        },
        dataHistory: {
          create: data_gdApprovalHistory?.dataHistory?.GAS_DEPOSIT || [],
          inactive:
            data_gdApprovalHistory?.dataHistory?.INACTIVE_GAS_DEPOSIT ||
            []
        }
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_gdApprovalHistory]);

  return (
    <NxCardContainer header={"GAS DEPOSIT"}>
      <NxBaseContainer border>
        <GasDepositTable
          data={dataSourceWithKeys}
          idAccount={id}
          idCustomer={idCustomer}
          totalElement={pagination_gasDeposit.totalElements}
          page={page}
          onSort={onSort}
          handleInactivateModal={handleInactivateModal}
          handleApprovalHistoryModal={handleApprovalHistoryModal}
          handleApproval={setShowApprovalModal}
          handleDownload={handleDownload}
          filters={filters}
          handleLoadMore={handleLoadMore}
          hasMore={hasMore}
          searchText={searchText}
          search={search}
          searchedColumn={searchedColumn}
          searchInput={searchInput}
          handleSearch={handleSearch}
          loading={loading_listGd}
        />

        <GasDepositApprovalModal
          id={id}
          isOpen={showApprovalModal}
          handleCancel={() => setShowApprovalModal(false)}
          afterFinish={handleRefresh}
        />

        {/* Inactivate Modal */}
        <NxInactivateModal
          isOpen={showInactiveModal}
          header={"INACTIVATE"}
          handleCloseModal={() => handleInactivateModal(false)}
          customMessage={`Are you sure you want to inactivate gas deposit - ${inactivateGdAccountNumber}?`}
          onFinish={({ remark, appHierId }, handleClear) =>
            handleInactivateGd({ remark, appHierId }, handleClear)
          }
          named={inactivateGdAccountNumber}
          menu="gas deposit"
          sliceName="gasDeposit"
          approvalOptionsStateName="data_gdApprovalHierarchy"
          approvalHierarchtDetailsStateName="detail_gdApprovalHierarchy"
          getApprovalOptions={getGdApprovalHierarchy}
          getApprovalHierarchyDetails={getDetailGdApprovalHierarchy}
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

export default memo(GasDeposit);
