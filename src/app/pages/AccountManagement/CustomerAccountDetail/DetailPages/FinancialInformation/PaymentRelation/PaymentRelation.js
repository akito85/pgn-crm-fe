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
import PaymentRelationTable from "./PaymentRelationTable";
import { useDispatch, useSelector } from "react-redux";
import { getDetailPaymentRelation, getPaymentRelation } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom"
import ModalConfirmationApprovalPaymentRelation from "./ModalConfirmationApprovalPaymentRelation";

// getDetailTaxImplication
// detail_taxImplication

const PaymentRelation = ({
  id = 0,
  idCustomer = 0,
  isActive = false,
  isApproval = false,
  setIsApproval = () => {},
  submitApprovalCondition = "",
  setSubmitApprovalCondition = () => {},
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const { data_paymentRelation, detail_paymentRelation, loading } = useSelector(
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

  const handleCancelApprovalModal = () => {
    setShowApprovalModal(false);
  }
  const handleConfirmApprovalModal = (submitApprovalCondition) => {
    setShowApprovalModal(false);
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
    dispatch(getPaymentRelation({ page, pageSize, sort, search: reqSearch }));
  }, [dispatch, page, pageSize, sort, search]);

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
      console.log("newSelectedRows", newSelectedRows);
      setSelectedRows(newSelectedRows.map(newSelectedRow => ({...newSelectedRow})));
    },
    type: "checkbox",
  }

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmitApproval = async (condition) => {

    await wait(2000);
    
    setSubmitApprovalCondition("");
  }

  // Listen to submit approval
  useEffect(() => {
    if (isActive) {
      if (submitApprovalCondition === "approve") {
        setShowApprovalModal(true);
      } else if (submitApprovalCondition === "reject") {
        setShowApprovalModal(true);
      }
    }
  }, [submitApprovalCondition]);

  const handleDetail = (record) => {
    const id = record.id
    console.log("record", record);
    // dispatch(
    //   getDetailPaymentRelation(id)
    // );
    navigate("/account-management/account-standard/financial-information/payment-relation/details", { state });
  }

  return (
    <Spin spinning={loading}>
      <Fragment>
        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {"PAYMENT RELATION LIST"}
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
                <ButtonComponent
                  type={"submit"}
                  onClick={() => navigate("/account-management/account-standard/financial-information/payment-relation/create")}
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
              </div>
            </div>
          )}
          <PaymentRelationTable
            data={data_paymentRelation?.result}
            handleChange={handleChange}
            handleChangeSize={handleChangeSize}
            totalElement={totalElement}
            page={page}
            pageSize={pageSize}
            searchText={searchText}
            searchedColumn={searchedColumn}
            onSort={onSort}
            getColumnSearchProps={getColumnSearchProps}
            handleDetail={handleDetail}
            rowSelection={isApproval ? rowSelection : undefined}
            isApproval={isApproval}
          />
        </div>
        <ModalConfirmationApprovalPaymentRelation
          dataSource={selectedRows}
          isOpen={showApprovalModal}
          setIsOpen={setShowApprovalModal}
          getColumnSearchProps={getColumnSearchProps}
          handleCancel={handleCancelApprovalModal}
          handleOk={() => handleConfirmApprovalModal(submitApprovalCondition)}
        />
      </Fragment>  
    </Spin>
  );
};

export default PaymentRelation;
