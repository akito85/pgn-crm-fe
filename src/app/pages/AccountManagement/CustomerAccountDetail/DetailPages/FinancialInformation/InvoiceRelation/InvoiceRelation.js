import { memo, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { Fragment } from "react";
import InvoiceRelationTable from "./InvoiceRelationTable";
import { useDispatch, useSelector } from "react-redux";
import { downloadInvoiceRelation, getInvoiceRelation, getIrApprovalHistory, inactivateInvoiceRelation } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import InvoiceRelationApprovalModal from "./InvoiceRelationApprovalModal";
import NxApproveOrRejectModal from "../../../../../../../components/Nx/NxApproveOrRejectModal";
import NxHistoryModal from "../../../../../../../components/Nx/NxHistoryModal";

const InvoiceRelation = ({
  id = 0,
  idCustomer = 0,
}) => {
  const dispatch = useDispatch();

  const {
    list_invoiceRelation,
    pagination_invoiceRelation,
    data_irApprovalHistory,
    loading,
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
  const [inactivateIrId, setInactivateIrId] = useState(0);
  const [inactivateIrAppHierId, setInactivateIrAppHierId] = useState(0);
  const [inactivateIrAccountNumber, setInactivateIrAccountNumber] = useState(0);

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [tempFilters, setTempFilters] = useState([]);

  const currentData = useMemo(() => list_invoiceRelation, [list_invoiceRelation]);

  const currentPagination = pagination_invoiceRelation;
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
      inputFields: tempFilters,
    }

    dispatch(
      getInvoiceRelation({
        id,
        body,
        page: 1,
        size: loadMoreSize,
        sort,
        searchs: JSON.stringify(search),
        isLoadMore: false,
      })
    );
    setPage(1);
  };

  /**
   * Open or close inactivate modal
   * @param {boolean} show
   * @param {number} irId
   * @param {number} irAppHierId
   */
  const handleInactivateModal = (show, newIrId = 0, newIrAppHierId = 0, newIrAccountNumber = "") => {
    if (show) {
      setInactivateIrId(newIrId);
      setInactivateIrAppHierId(newIrAppHierId);
      setInactivateIrAccountNumber(newIrAccountNumber)
      setShowInactiveModal(true);
    } else {
      setInactivateIrId(0);
      setInactivateIrAppHierId(0);
      setInactivateIrAccountNumber("");
      setShowInactiveModal(false);
    }
  }

  /**
   * @param {string} remark
   * @param {() => {}} handleClear
   */
  const handleInactivateIr = (remark, handleClear) => {
    const body = {
      id: inactivateIrId,
      appHierId: inactivateIrAppHierId,
      remark,
    }

    dispatch(inactivateInvoiceRelation({
      body,
    }))
    .unwrap()
    .then(() => {
      const body = {
        inputFields: tempFilters,
      }

      dispatch(getInvoiceRelation({ id, page, size: loadMoreSize, sort, searchs: JSON.stringify(search), body, isLoadMore: false }));
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
   * @param {number} irId
   */
  const handleApprovalHistoryModal = (show, irId = 0) => {
    if (show) {
      dispatch(getIrApprovalHistory(irId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  }

  const handleDownload = () => {
    const body = {
      inputFields: tempFilters,
    }

    dispatch(downloadInvoiceRelation({ page, size: loadMoreSize, sort, searchs: search, body, id }));
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
    const totalPages = pagination_invoiceRelation?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        inputFields: tempFilters,
      }

      await dispatch(
        getInvoiceRelation({
          id,
          page: nextPage,
          size: loadMoreSize,
          sort,
          searchs: JSON.stringify(search),
          body,
          isLoadMore: true,
        })
      );
    }
    setPage(nextPage);
  };

  useEffect(() => {
    const body = {
      inputFields: tempFilters,
    }

    dispatch(getInvoiceRelation({ id, page, size: loadMoreSize, sort, searchs: JSON.stringify(search), body, isLoadMore: false }));
  }, [sort, search, tempFilters]);

  useEffect(() => {
    if (data_irApprovalHistory && data_irApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_irApprovalHistory?.dataApprover?.INVOICE_RELATION || [],
          inactive: data_irApprovalHistory?.dataApprover?.INACTIVE_INVOICE_RELATION || [],
        },
        dataHistory: {
          create: data_irApprovalHistory?.dataHistory?.INVOICE_RELATION || [],
          inactive: data_irApprovalHistory?.dataHistory?.INACTIVE_INVOICE_RELATION || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_irApprovalHistory]);

  return (
    <Fragment>
      <InvoiceRelationTable
        data={dataSourceWithKeys}
        idAccount={id}
        idCustomer={idCustomer}
        totalElement={pagination_invoiceRelation.totalElements}
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

      <InvoiceRelationApprovalModal
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
        customMessage={`Are you sure you want to inactivate invoice relation - ${inactivateIrAccountNumber}?`}
        onFinish={({ remark }, handleClear) => handleInactivateIr(remark, handleClear)}
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

export default memo(InvoiceRelation);
