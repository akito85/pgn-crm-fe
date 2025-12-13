import { useEffect, useRef } from "react";
import {
  FilterOutlined,
} from "@ant-design/icons";
import { DatePicker, Form, Input, Spin } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import PaymentRelationTable from "./PaymentRelationTable";
import { useDispatch, useSelector } from "react-redux";
import { approveOrRejectAllPaymentRelation, downloadPaymentRelation, getPaymentRelation, getPrApprovalHistory, inactivatePaymentRelation } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import ModalConfirmationApprovalPaymentRelation from "./ModalConfirmationApprovalPaymentRelation";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
import ModalHistory from "../../../../../../../components/Modal/ModalHistory";
import NxFilter from "../../../../../../../components/Nx/NxFilter";

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

  const { data_paymentRelation, loading, data_prApprovalHistory } = financialInformationState;

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivatePrId, setInactivatePrId] = useState(0);
  const [inactivatePrAppHierId, setInactivatePrAppHierId] = useState(0);

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [advancedQueryForm] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Filter values:", values.query);
    // Process the filter query
  };

  const handleCancel = () => {
    advancedQueryForm.resetFields();
  };

  const handleCancelApprovalModal = () => {
    setShowApprovalModal(false);
    setSubmitApprovalCondition("");
  }

  const handleConfirmApprovalModal = (description, submitApprovalCondition, handleClear) => {
    const action = submitApprovalCondition.toUpperCase();

    const body = selectedRows.filter(row => !row.approvalType).map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action,
      description,
    }));

    const inactiveBody = selectedRows.filter(row => row.approvalType).map((row) => ({
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
        size: pageSize,
        sort,
        searches: search,
      }

      dispatch(getPaymentRelation({ id, body }))
    })
    .catch(() => {});
  }

  const handleInactivePrModal = (show, prId = 0, prAppHierId = 0) => {
    if (show) {
      setInactivatePrId(prId);
      setInactivatePrAppHierId(prAppHierId);
      setShowInactiveModal(true);
    } else {
      setInactivatePrId(0);
      setInactivatePrAppHierId(0);
      setShowInactiveModal(false);
    }
  }

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
        size: pageSize,
        sort,
        searches: search,
      }

      dispatch(getPaymentRelation({ id, body }));
      setShowInactiveModal(false);
      handleClear();
    })
    .catch(() => {})
  }

  useEffect(() => {
    const body = {
      page,
      size: pageSize,
      sort,
      searches: search,
    }

    dispatch(getPaymentRelation({ id, body }));
  }, [page, pageSize, sort, search]);

  useEffect(() => {
    if (
      data_paymentRelation && 
      data_paymentRelation.result &&
      data_paymentRelation.result.length > 0
    ) {
      setTotalElement(data_paymentRelation?.page?.totalElements);
    }
  }, [data_paymentRelation]);

  //handle on-changes listener
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

  // Search Column Table
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

  const handleChange = (page) => {
    setPage(page);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

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

  const handleApprovalHistoryOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistoryModal = (show, prId = 0) => {
    if (show) {
      dispatch(getPrApprovalHistory(prId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  }

  const handleIsApproval = (newIsApproval) => {
    if (newIsApproval) {
      setSearchText("WAITING APPROVAL");
      setSearchedColumn("approvalStatus");
      setPage(1);
      setSearch((prevState) => ({
        ...prevState,
        approvalStatus: "WAITING_APPROVAL",
      }));
      setIsApproval(true);
    } else {
      setSearchText("");
      setSearchedColumn("");
      setPage(1)
      setSearch((prevState) => ({
        ...prevState,
        approvalStatus: undefined,
      }));
      setIsApproval(false);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setSubmitApprovalCondition("");
      setShowApprovalButton(false);
      setShowApprovalModal(false);
    }
  }

  const handleDownload = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(downloadPaymentRelation({ page, pageSize, sort, search: tempSearch }));
  };

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
    if (!isActive || !isApproval)
      handleIsApproval(false);
  }, [isActive, isApproval]);

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
    <Spin spinning={loading}>
      <Fragment>
        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {"PAYMENT RELATION LIST"}
        </div>

        <PaymentRelationTable
          data={data_paymentRelation?.result?.map((paymentRelation) => ({
            ...paymentRelation,
            key: `payment-relation-${paymentRelation.id}`
          }))}
          idAccount={id}
          idCustomer={idCustomer}
          handleChange={handleChange}
          handleChangeSize={handleChangeSize}
          totalElement={totalElement}
          page={page}
          pageSize={pageSize}
          onSort={onSort}
          getColumnSearchProps={getColumnSearchProps}
          rowSelection={isApproval ? rowSelection : undefined}
          isApproval={isApproval}
          handleInactivePrModal={handleInactivePrModal}
          handleApprovalHistoryModal={handleApprovalHistoryModal}
          handleIsApproval={handleIsApproval}
          handleDownload={handleDownload}
        />

        <Form form={advancedQueryForm} layout="vertical" onFinish={handleFinish}>
          <NxFilter
            form={advancedQueryForm}
            onCancel={handleCancel}
            dispatch={dispatch}
            getColumnApi={() => {}}
            getOperatorApi={() => {}}
            getConditionApi={() => {}}
            reduxState={financialInformationState}
            maxFilters={5}
            loading={loading}
          />
        </Form>

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
          handleCloseModal={() => handleInactivePrModal(false)}
          customMessage={`Are you sure you want to inactivate payment relation - ${inactivatePrId}?`}
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
    </Spin>
  );
};

export default PaymentRelation;
