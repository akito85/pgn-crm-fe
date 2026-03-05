import { memo, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { Fragment } from "react";
import PaymentRelationTable from "./PaymentRelationTable";
import { useDispatch, useSelector } from "react-redux";
import { downloadPaymentRelation, getPaymentRelation, getPrApprovalHistory, inactivatePaymentRelation } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import PaymentRelationApprovalModal from "./PaymentRelationApprovalModal";
import NxInactivateModal from "../../../../../../../components/Nx/NxInactivateModal";
import { getPrApprovalHierarchy, getDetailPrApprovalHierarchy } from "../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import NxHistoryModal from "../../../../../../../components/Nx/NxHistoryModal";

const PaymentRelation = ({
  id = 0,
  idCustomer = 0,
}) => {
  const dispatch = useDispatch();

  const {
    list_paymentRelation,
    pagination_paymentRelation,
    data_prApprovalHistory,
    loading_listPr,
  } = useSelector(
    (state) => state.financialInformation
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
  const [inactivatePrId, setInactivatePrId] = useState(0);
  const [inactivatePrAccountNumber, setInactivatePrAccountNumber] = useState(0);

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [tempFilters, setTempFilters] = useState([]);

  const currentData = useMemo(() => list_paymentRelation, [list_paymentRelation]);

  const currentPagination = pagination_paymentRelation;
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
      getPaymentRelation({
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
   * @param {number} prId 
   * @param {number} prAppHierId 
   */
  const handleInactivateModal = (show, newPrId = 0, newPrAccountNumber = "") => {
    if (show) {
      setInactivatePrId(newPrId);
      setInactivatePrAccountNumber(newPrAccountNumber);
      setShowInactiveModal(true);
    } else {
      setInactivatePrId(0);
      setInactivatePrAccountNumber("");
      setShowInactiveModal(false);
    }
  }

  /**
   * @param {string} remark 
   * @param {() => {}} handleClear 
   */
  const handleInactivatePr = ({ remark, appHierId }, handleClear) => {
    const body = {
      id: inactivatePrId,
      appHierId,
      remark,
    }

    dispatch(inactivatePaymentRelation({
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

      dispatch(getPaymentRelation({ id, body, isLoadMore: false }));
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
   * @param {number} prId 
   */
  const handleApprovalHistoryModal = (show, prId = 0) => {
    if (show) {
      dispatch(getPrApprovalHistory(prId));
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

    dispatch(downloadPaymentRelation({ body, id, }));
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
    const totalPages = pagination_paymentRelation?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: JSON.stringify(search),
        inputFields: tempFilters,
      }

      await dispatch(
        getPaymentRelation({
          id,
          body,
          isLoadMore: true,
        })
      );
    }
    setPage(nextPage);
  };

  useEffect(() => {
    const body = {
      page,
      size: loadMoreSize,
      sort,
      searchs: search,
      inputFields: tempFilters,
    }

    dispatch(getPaymentRelation({ id, body, isLoadMore: false }));
  }, [sort, search, tempFilters]);

  useEffect(() => {
    if (data_prApprovalHistory && data_prApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_prApprovalHistory?.dataApprover?.PAYMENT_RELATION || [],
          inactive: data_prApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_RELATION || [],
        },
        dataHistory: {
          create: data_prApprovalHistory?.dataHistory?.PAYMENT_RELATION || [],
          inactive: data_prApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_RELATION || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_prApprovalHistory]);

  return (
    <Fragment>
      <PaymentRelationTable
        data={dataSourceWithKeys}
        idAccount={id}
        idCustomer={idCustomer}
        totalElement={pagination_paymentRelation.totalElements}
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
        loading={loading_listPr}
      />

      <PaymentRelationApprovalModal
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
        customMessage={`Are you sure you want to inactivate payment relation - ${inactivatePrAccountNumber}?`}
        onFinish={({ remark, appHierId }, handleClear) =>
          handleInactivatePr({ remark, appHierId }, handleClear)
        }
        named={inactivatePrAccountNumber}
        menu="payment relation"
        sliceName="paymentRelation"
        approvalOptionsStateName="list_prApprovalOptions"
        approvalHierarchtDetailsStateName="list_prApprovalHierarchyDetail"
        getApprovalOptions={getPrApprovalHierarchy}
        getApprovalHierarchyDetails={getDetailPrApprovalHierarchy}
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
    </Fragment>
  );
};

export default memo(PaymentRelation);
