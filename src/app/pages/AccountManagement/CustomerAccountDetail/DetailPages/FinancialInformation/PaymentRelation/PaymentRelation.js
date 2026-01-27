import { useEffect, useMemo, useRef } from "react";
import {
  FilterOutlined,
} from "@ant-design/icons";
import { DatePicker, Form, Input, Spin } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import PaymentRelationTable from "./PaymentRelationTable";
import { useDispatch, useSelector } from "react-redux";
import { approveOrRejectAllPaymentRelation, downloadPaymentRelation, getPaymentRelation, getPrApprovalHistory, inactivatePaymentRelation, getPrColumnApi, getPrConditionApi, getPrOperatorApi } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import ModalConfirmationApprovalPaymentRelation from "./ModalConfirmationApprovalPaymentRelation";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
import ModalHistory from "../../../../../../../components/Modal/ModalHistory";

const PaymentRelation = ({
  id = 0,
  idCustomer = 0,
  isActive = false,
  isApproval = false,
  setIsApproval = () => {},
  setShowApprovalButton = () => {},
  submitApprovalCondition = "",
  setSubmitApprovalCondition = () => {},
}) => {
  const dispatch = useDispatch();

  const financialInformationState = useSelector(
    (state) => state.financialInformation
  );

  const {
    list_paymentRelation,
    pagination_paymentRelation,
    data_prApprovalHistory,
    loading,
  } = financialInformationState;

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [listType, setListType] = useState("all");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivatePrId, setInactivatePrId] = useState(0);
  const [inactivatePrAppHierId, setInactivatePrAppHierId] = useState(0);
  const [inactivatePrAccountNumber, setInactivatePrAccountNumber] = useState(0);

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [filterForm] = Form.useForm();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilters, setTempFilters] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, newSelectedRows) => {
      setSelectedRowKeys([...newSelectedRowKeys]);
      setSelectedRows(newSelectedRows.map(newSelectedRow => ({...newSelectedRow})));
      if (!newSelectedRowKeys.length)
        setShowApprovalButton(false);
      else
        setShowApprovalButton(true);
    },
    type: "checkbox",
    preserveSelectedRowKeys: true,
  }

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

  const handleCancelApprovalModal = () => {
    setShowApprovalModal(false);
    setSubmitApprovalCondition("");
  }

  /**
   * @param {string} description 
   * @param {"approve"|"reject"} submitApprovalCondition 
   * @param {() => {}} handleClear 
   */
  const handleConfirmApprovalModal = (description, submitApprovalCondition, handleClear) => {
    const action = submitApprovalCondition.toUpperCase();

    const body = selectedRows.filter(row => row.approvalType === "PAYMENT_RELATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action,
      description,
    }));

    const inactiveBody = selectedRows.filter(row => row.approvalType === "INACTIVE_PAYMENT_RELATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action,
      description,
    }))

    dispatch(approveOrRejectAllPaymentRelation({ body, inactiveBody, action }))
    .unwrap()
    .then(() => {
      handleClear();
      handleIsApproval(false)

      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
        inputFields: tempFilters,
      }

      dispatch(getPaymentRelation({ id, body }))
    })
    .catch(() => {});
  }

  /**
   * Open or close inactivate modal
   * @param {boolean} show 
   * @param {number} prId 
   * @param {number} prAppHierId 
   */
  const handleInactivateModal = (show, newPrId = 0, newPrAppHierId = 0, newPrAccountNumber = "") => {
    if (show) {
      setInactivatePrId(newPrId);
      setInactivatePrAppHierId(newPrAppHierId);
      setInactivatePrAccountNumber(newPrAccountNumber)
      setShowInactiveModal(true);
    } else {
      setInactivatePrId(0);
      setInactivatePrAppHierId(0);
      setInactivatePrAccountNumber("");
      setShowInactiveModal(false);
    }
  }

  /**
   * @param {string} remark 
   * @param {() => {}} handleClear 
   */
  const handleInactivatePr = (remark, handleClear) => {
    const body = {
      id: inactivatePrId,
      appHierId: inactivatePrAppHierId,
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

      dispatch(getPaymentRelation({ id, body }));
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

  /**
   * @param {string} dataIndex 
   * @param {string} type 
   * @returns
   */
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  });

  const handleApprovalHistoryOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
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

  /**
   * @param {boolean} newIsApproval 
   */
  const handleIsApproval = (newIsApproval) => {
    setPage(1);
    if (newIsApproval) {
      setListType("approval");
      setIsApproval(true);
    } else {
      setSearchText("");
      setSearchedColumn("");
      setListType("all");
      setIsApproval(false);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setSubmitApprovalCondition("");
      setShowApprovalButton(false);
      setShowApprovalModal(false);
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
      await dispatch(
        getPaymentRelation({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
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
      listType,
    }

    dispatch(getPaymentRelation({ id, body }));
  }, [page, loadMoreSize, sort, search, tempFilters, listType]);

  // Listen to approve or reject button on the parent component
  useEffect(() => {
    if (isActive) {
      if (submitApprovalCondition === "approve") {
        setShowApprovalModal(true);
      } else if (submitApprovalCondition === "reject") {
        setShowApprovalModal(true);
      }
    }
  }, [submitApprovalCondition]);

  // Reset accordian when it's not the current one that's opened
  useEffect(() => {
    if (!isActive)
      handleIsApproval(false);
  }, [isActive]);

  useEffect(() => {
    if (!isApproval) {
      handleIsApproval(false);
    }
  }, [isApproval]);

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
        rowSelection={isApproval ? rowSelection : undefined}
        isApproval={isApproval}
        handleInactivateModal={handleInactivateModal}
        handleApprovalHistoryModal={handleApprovalHistoryModal}
        handleIsApproval={handleIsApproval}
        handleDownload={handleDownload}
        tempFilters={tempFilters}
        setShowFilterModal={setShowFilterModal}
        setIsApproval={setIsApproval}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
        searchText={searchText}
        search={search}
        searchedColumn={searchedColumn}
        searchInput={searchInput}
        handleSearch={handleSearch}
        loading={loading}
      />

      <ModalConfirmationApprovalPaymentRelation
        dataSource={selectedRows}
        isOpen={showApprovalModal}
        setIsOpen={setShowApprovalModal}
        getColumnSearchProps={getColumnSearchProps}
        handleCloseModal={handleCancelApprovalModal}
        onFinish={({ remark }, handleClear) => handleConfirmApprovalModal(remark, submitApprovalCondition, handleClear)}
      />

      {/* Inactivate Modal */}
      <ModalApproveOrReject
        isOpen={showInactiveModal}
        header={"INACTIVATE"}
        handleCloseModal={() => handleInactivateModal(false)}
        customMessage={`Are you sure you want to inactivate payment relation - ${inactivatePrAccountNumber}?`}
        onFinish={({ remark }, handleClear) => handleInactivatePr(remark, handleClear)}
      />

      {/* Approval History Modal */}
      <ModalHistory
        isOpen={showApprovalHistoryModal}
        handleClose={() => handleApprovalHistoryModal(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleApprovalHistoryOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
    </Fragment>
  );
};

export default PaymentRelation;
