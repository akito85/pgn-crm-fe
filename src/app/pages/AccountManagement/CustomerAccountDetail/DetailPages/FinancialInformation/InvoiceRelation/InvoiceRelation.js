import { useEffect, useRef } from "react";
import {
  FilterOutlined,
  DownloadOutlined, 
  CheckOutlined, 
  PlusOutlined 
} from "@ant-design/icons";
import { DatePicker, Input, Spin } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import InvoiceRelationTable from "./InvoiceRelationTable";
import { useDispatch, useSelector } from "react-redux";
import { approveOrRejectAllInvoiceRelation, getInvoiceRelation, getIrApprovalHistory, inactivateInvoiceRelation } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { Link, useNavigate } from "react-router-dom"
import ModalConfirmationApprovalInvoiceRelation from "./ModalConfirmationApprovalInvoiceRelation";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
import ModalHistory from "../../../../../../../components/Modal/ModalHistory";

const InvoiceRelation = ({
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
  const navigate = useNavigate();

  const { data_invoiceRelation, loading, data_irApprovalHistory } = useSelector(
    (state) => state.financialInformation
  );

  //declare
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, updateSearch] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateIrId, setInactivateIrId] = useState(0);
  const [inactivateIrAppHierId, setInactivateIrAppHierId] = useState(0);

  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  const handleCancelApprovalModal = () => {
    setShowApprovalModal(false);
    setSubmitApprovalCondition("");
  }

  const handleConfirmApprovalModal = (description, submitApprovalCondition, handleClear) => {
    const body = selectedRows.filter(row => row.approvalType === "INVOICE_RELATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action: submitApprovalCondition.toUpperCase(),
      description,
    }));

    const inactiveBody = selectedRows.filter(row => row.approvalType === "INACTIVE_INVOICE_RELATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action: submitApprovalCondition.toUpperCase(),
      description,
    }))

    dispatch(approveOrRejectAllInvoiceRelation({ body, inactiveBody }))
    .unwrap()
    .then(() => {
      handleClear();
      setShowApprovalModal(false);
      setSubmitApprovalCondition("");
    })
    .catch(() => {});
  }

  const handleInactiveIrModal = (show, irId = 0, irAppHierId = 0) => {
    if (show) {
      setInactivateIrId(irId);
      setInactivateIrAppHierId(irAppHierId);
      setShowInactiveModal(true);
    } else {
      setInactivateIrId(0);
      setInactivateIrAppHierId(0);
      setShowInactiveModal(false);
    }
  }

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
      setShowInactiveModal(false);
      handleClear()
    })
    .catch(() => {})
  }

  useEffect(() => {
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
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getInvoiceRelation({ page, pageSize, sort, search: reqSearch }));
  }, [dispatch, page, pageSize, sort, search]);

  useEffect(() => {
    if (
      data_invoiceRelation && 
      data_invoiceRelation.result &&
      data_invoiceRelation.result.length > 0
    ) {
      setTotalElement(data_invoiceRelation?.page?.totalElements);
    }
  }, [data_invoiceRelation]);

  //handle on-changes listener
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    updateSearch((prevState) => {
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
  }

  const handleApprovalHistoryOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistoryModal = (show, irId = 0) => {
    if (show) {
      dispatch(getIrApprovalHistory(irId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  }

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
    if (!isActive) {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setIsApproval(false);
      setSubmitApprovalCondition("");
      setShowApprovalButton("");
    }
  }, [isActive])

  useEffect(() => {
    if (data_irApprovalHistory && data_irApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_irApprovalHistory?.dataApprover?.PRICING || [],
          inactive: data_irApprovalHistory?.dataApprover?.INACTIVE_PRICING || [],
        },
        dataHistory: {
          create: data_irApprovalHistory?.dataHistory?.PRICING || [],
          inactive: data_irApprovalHistory?.dataHistory?.INACTIVE_PRICING || [],
        },
      };

      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_irApprovalHistory]);

  return (
    <Spin spinning={loading}>
      <Fragment>
        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {"INVOICE RELATION LIST"}
        </div>

        <div>
          {!isApproval && (
            <div className="flex justify-between items-center gap-5 mb-5">
              {/* Filter Button - Left side */}
              <ButtonComponent
                type={"submit"}
                onClick={() => navigate(-1)}
                icon={
                  <FilterOutlined
                    style={{
                      color: "#fff",
                      fontSize: 20,
                    }}
                  />
                }
                style={{
                  backgroundColor: "#0075bf",
                  color: "#fff",
                  borderColor: "#0075bf",
                  border: "1px solid #0075bf",
                  width: "128px",
                  height: "48px",
                  borderRadius: "5px"
                }}
              >
                Filters
              </ButtonComponent>
              
              {/* Right side buttons container */}
              <div className="flex justify-end items-center gap-2.5">
                {/* Download List Button */}
                <ButtonComponent
                  type={"submit"}
                  onClick={() => {}}
                  icon={
                    <DownloadOutlined
                      style={{
                        color: "#fff",
                        fontSize: 20,
                      }}
                    />
                  }
                  style={{
                    backgroundColor: "#0075bf",
                    color: "#fff",
                    borderColor: "#0075bf",
                    border: "1px solid #0075bf",
                    borderRadius: "5px",
                    height: "48px"
                  }}
                >
                  Download List
                </ButtonComponent>

                {/* Approval Button */}
                <ButtonComponent
                  type={"submit"}
                  onClick={() => setIsApproval(!isApproval)}
                  icon={
                    <CheckOutlined
                      style={{
                        color: "#fff",
                        fontSize: 20,
                      }}
                    />
                  }
                  style={{
                    backgroundColor: "#0075bf",
                    color: "#fff",
                    borderColor: "#0075bf",
                    border: "1px solid #0075bf",
                    borderRadius: "5px",
                    height: "48px"
                  }}
                >
                  Approval
                </ButtonComponent>

                {/* Create Button */}
                <Link to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_INVOICE_RELATION} state={{
                  idAccount: id,
                  idCustomer,
                }}>
                  <ButtonComponent
                    type={"submit"}
                    icon={
                      <PlusOutlined
                        style={{
                          color: "#fff",
                          fontSize: 20,
                        }}
                      />
                    }
                    style={{
                      backgroundColor: "#0075bf",
                      color: "#fff",
                      borderColor: "#0075bf",
                      border: "1px solid #0075bf",
                      borderRadius: "5px",
                      height: "48px"
                    }}
                  >
                    Create
                  </ButtonComponent>
                </Link>
              </div>
            </div>
          )}
          <InvoiceRelationTable
            data={data_invoiceRelation?.result?.map((invoiceRelation, index) => ({
              ...invoiceRelation,
              key: `invoice-relation-${index}`
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
            handleInactiveIrModal={handleInactiveIrModal}
            handleApprovalHistoryModal={handleApprovalHistoryModal}
          />
        </div>
        <ModalConfirmationApprovalInvoiceRelation
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
          handleCloseModal={() => handleInactiveIrModal(false)}
          customMessage={`Are you sure you want to inactivate invoice relation - ${inactivateIrId}?`}
          onFinish={({ remark }, handleClear) => handleInactivateIr(remark, handleClear)}
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

export default InvoiceRelation;
