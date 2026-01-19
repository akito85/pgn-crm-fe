import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import BaseContainer from "../../../../../../components/BaseContainer";
import { DatePicker, Form, Input, Spin } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import MultiDestinationTable from "./MultiDestinationTable";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import NxFilter from "../../../../../../components/Nx/NxFilter";
import ModalConfirmationApprovalMultiDestination from "./ModalConfirmationApprovalMultiDestination";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import { getMultiDestination, approveOrRejectAllMultiDestination, downloadMultiDestination, getMdApprovalHistory, getMdColumnApi, getMdConditionApi, getMdOperatorApi, inactivateMultiDestination, } from "../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { useLocation } from "react-router-dom";

const MultiDestination = ({
  id = 0,
  idCustomer = 0,
  isApproval = false,
  setIsApproval = () => {},
  setShowApprovalButton = () => {},
  submitApprovalCondition = "",
  setSubmitApprovalCondition = () => {},
}) => {
  const dispatch = useDispatch();

  const multiDestinationState = useSelector(
    (state) => state.multiDestination
  );

  const { data_multiDestination, loading, data_mdApprovalHistory } = multiDestinationState;

  const location = useLocation();

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listType, setListType] = useState("all");
  const [totalElement, setTotalElement] = useState(0);
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

  const handleSaveFilter = (values) => {
    setTempFilters(values.query);
    setPage(1);
    setSort("");
    setSearch({});
    setSearchText("")
    setShowFilterModal(false);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    filterForm.setFieldValue({ query: tempFilters });
  };

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

    const body = selectedRows.filter(row => row.approvalType === "MULTI_DESTINATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action,
      description,
    }));

    const inactiveBody = selectedRows.filter(row => row.approvalType === "INACTIVE_MULTI_DESTINATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action,
      description,
    }))

    dispatch(approveOrRejectAllMultiDestination({ body, inactiveBody, action }))
    .unwrap()
    .then(() => {
      handleClear();
      handleIsApproval(false)

      const body = {
        page,
        size: pageSize,
        sort,
        searchs: search,
        inputFields: tempFilters,
      }

      dispatch(getMultiDestination({ id, body }))
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
      setInactivateMdId(newPrId);
      setInactivateMdAppHierId(newPrAppHierId);
      setInactivateMdAccountNumber(newPrAccountNumber)
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
  const handleInactivatePr = (remark, handleClear) => {
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
        size: pageSize,
        sort,
        searchs: search,
        inputFields: tempFilters,
      }

      dispatch(getMultiDestination({ id, body }));
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
      dispatch(getMdApprovalHistory(prId));
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
      size: pageSize,
      sort,
      inputFields: tempFilters,
      searchs: search
    }

    dispatch(downloadMultiDestination({ body, id, }));
  };

  /**
   * @param {number} newPage
   */
  const handleChange = (newPage) => {
    setPage(newPage);
  };

  /**
   * @param {number} pageChange 
   * @param {number} pageSizeChange 
   */
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
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

  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/multi-destination'))
    } else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/multi-destination'))
    }
  }, []);

  useEffect(() => {
    const body = {
      page,
      size: pageSize,
      sort,
      searchs: search,
      inputFields: tempFilters,
      listType,
    }

    dispatch(getMultiDestination({ id, body }));
  }, [page, pageSize, sort, search, tempFilters, listType]);

  useEffect(() => {
    if (
      data_multiDestination && 
      data_multiDestination.result &&
      data_multiDestination.result.length > 0
    ) {
      setTotalElement(data_multiDestination?.page?.totalElements);
    }
  }, [data_multiDestination]);

  // Listen to approve or reject button on the parent component
  useEffect(() => {
    console.log("submitApprovalCondition", submitApprovalCondition);
    if (submitApprovalCondition === "approve") {
      setShowApprovalModal(true);
    } else if (submitApprovalCondition === "reject") {
      setShowApprovalModal(true);
    }
  }, [submitApprovalCondition]);

  useEffect(() => {
    if (!isApproval) {
      handleIsApproval(false);
    }
  }, [isApproval]);

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
    <Spin spinning={loading}>
      <BaseContainer header={"MULTI DESTINATION LIST"}>
        <MultiDestinationTable
          data={data_multiDestination?.result?.map((multiDestination, index) => ({
            ...multiDestination,
            no: index + 1 + ( page - 1) * pageSize,
            key: `multi-destination-${multiDestination.id}-${index}`
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
          handleInactivateModal={handleInactivateModal}
          handleApprovalHistoryModal={handleApprovalHistoryModal}
          handleIsApproval={handleIsApproval}
          handleDownload={handleDownload}
          tempFilters={tempFilters}
          setShowFilterModal={setShowFilterModal}
        />

        <ModalCustom
          isOpen={showFilterModal}
          type={"confirmation"}
          header={"QUERY"}
          width={1200}
          handleCancel={handleCancelFilter}
        >
          <Form form={filterForm} layout="vertical" onFinish={handleSaveFilter} id={"prFilterForm"}>
            <NxFilter
              form={filterForm}
              onCancel={handleCancelFilter}
              dispatch={dispatch}
              getColumnApi={getMdColumnApi}
              getConditionApi={getMdConditionApi}
              getOperatorApi={getMdOperatorApi}
              reduxState={multiDestinationState}
              maxFilters={5}
              loading={loading}
              formId="prFilterForm"
            />
          </Form>
        </ModalCustom>

        <ModalConfirmationApprovalMultiDestination
          dataSource={selectedRows}
          isOpen={showApprovalModal}
          setIsOpen={setShowApprovalModal}
          getColumnSearchProps={getColumnSearchProps}
          handleCloseModal={handleCancelApprovalModal}
          onFinish={({ remark }, handleClear) => handleConfirmApprovalModal(remark, submitApprovalCondition, handleClear)}
        />

        <ModalApproveOrReject
          isOpen={showInactiveModal}
          header={"INACTIVATE"}
          handleCloseModal={() => handleInactivateModal(false)}
          customMessage={`Are you sure you want to inactivate payment relation - ${inactivateMdAccountNumber}?`}
          onFinish={({ remark }, handleClear) => handleInactivatePr(remark, handleClear)}
        />

        <ModalHistory
          isOpen={showApprovalHistoryModal}
          handleClose={() => handleApprovalHistoryModal(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleApprovalHistoryOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </BaseContainer>
    </Spin>
  );
};

export default MultiDestination;
