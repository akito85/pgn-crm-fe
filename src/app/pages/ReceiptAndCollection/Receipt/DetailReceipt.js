import React, { useState, useRef, useEffect, useCallback } from "react";
import DetailText from "../../../../components/DetailText";
import BaseContainer from "../../../../components/BaseContainer";
import { useNavigate } from "react-router-dom";
import { Spin, Tooltip } from "antd";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../utils";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllocation,
} from "../../../../redux/slices/receipt_collection/receipt";
import {
  getColumnSearchPropsPaging,
} from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";
import CreateAllocation from "./Table/CreateAllocation";
import { sorterFunction } from "../../../../utils/sorterFunction";

export const columnsAllocation = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { }
) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ALLOCATION ID",
      dataIndex: "id",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "id",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "allocationId") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "ALLOCATION NUMBER",
      dataIndex: "allocationNumber",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "allocationNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "allocationNumber") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "ALLOCATION TYPE",
      dataIndex: "allocationType",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "allocationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "allocationType") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "BILLING ITEM",
      dataIndex: "billingItem",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "billingItem",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "billingItem") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "ALLOCATE DATE",
      dataIndex: "allocationDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "allocationDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        searchedColumn === "allocationDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
                : "",
            ]}
            autoEscape
            textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
          />
        ) : text === null ? (
          ""
        ) : (
          moment(text).format(dateFormatting.date)
        ),
    },
    {
      title: "INVOICE CURRENCY",
      dataIndex: "invoiceCurrency",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "invoiceCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "invoiceCurrency") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "BILLING ITEM AMOUNT",
      dataIndex: "billingItemAmount",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "billingItemAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "billingItemAmount") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {/* {parseInt(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "ALLOCATION AMOUNT",
      dataIndex: "allocationAmount",
      align: "right",
      inputType: "number",
      sorter: true,
      onInput: (e) => (e.target.value = e.target.value.replace(/\D/g, "")),
      ...getColumnSearchPropsPaging(
        "allocationAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "allocationAmount") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {/* {parseInt(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "BILLING ITEM BALANCE",
      dataIndex: "billingItemBalance",
      sorter: (a, b) => sorterFunction("billingItemBalance", a, b, "number"),
      align: "right",
      ...getColumnSearchPropsPaging(
        "billingItemBalance",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      // render: (text) => text.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: "ALLOCATION STATUS",
      dataIndex: "allocationStatus",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "allocationStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "allocationStatus") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <div className={" flex justify-center"}>
                <StatusComponent colour={text}>
                  {toTitleCase(text)}
                </StatusComponent>
              </div>
            );
          }
          return "";
        }
      },
    },

    {
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "invoiceNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "invoiceNumber") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "INVOICE PERIOD",
      dataIndex: "billingPeriod",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datePeriod"
      ),
      render: (text) =>
        searchedColumn === "billingPeriod" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.datePeriod) : ""
            }
          />
        ) : text === null ? (
          ""
        ) : (
          moment(text).format(dateFormatting.datePeriod)
        ),
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "rateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        searchedColumn === "rateDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
                : "",
            ]}
            autoEscape
            textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
          />
        ) : text === null ? (
          ""
        ) : (
          moment(text).format(dateFormatting.date)
        ),
    },
    {
      title: "RATE",
      dataIndex: "rateAmount",
      align: "right",
      inputType: "number",
      sorter: true,
      onInput: (e) => (e.target.value = e.target.value.replace(/\D/g, "")),
      ...getColumnSearchPropsPaging(
        "rateAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "rateAmount") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {/* {parseInt(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "CONVERTED CURRENCY",
      dataIndex: "convertedCurrency",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "convertedCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "convertedCurrency") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "EQUIVALENT AMOUNT",
      dataIndex: "equivalentAmount",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "equivalentAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "equivalentAmount") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "CREATED DATE",
      dataIndex: "createdDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging("createdDate", "date"),
      render: (text) => moment(text).format("DD MMM YYYY HH:mm:ss"),
    },
    {
      title: "CREATED BY",
      dataIndex: "createdBy",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
  ];

const DetailReceipt = ({
  data_detail,
  id,
  setIsInsert = () => { },
  setAllocationTable = () => { },
  setBalance = () => { },
}) => {
  const { data_allocation, loading } = useSelector((state) => state.receipt);

  // Declaration
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [storedData, setStoredData] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [totalAllocationAmount, setTotalAllocationAmount] = useState(0);

  const changeValuesAllocation = useCallback(() => {
    setAllocationTable(dataTable);
    setIsInsert(storedData);
    setBalance(data_detail?.unAppliedAmountReal - totalAllocationAmount);
  }, [
    dataTable,
    data_detail?.unAppliedAmountReal,
    setAllocationTable,
    setBalance,
    setIsInsert,
    storedData,
    totalAllocationAmount,
  ]);
  useEffect(() => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllocation({
        id,
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [id, page, pageSize, sort, search]);

  // page
  useEffect(() => {
    if (data_allocation?.result?.length > 0) {
      setDataTable(data_allocation?.result);
    }
  }, [data_allocation]);

  useEffect(() => {
    changeValuesAllocation();
  }, [changeValuesAllocation]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      let result = selectedKeys[0];
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      if (dataIndex === "period") {
        result = result ? moment(result, "YYYY-MM").format("MMM YYYY") : "";
      }
      return {
        ...prevState,
        [dataIndex]: result,
      };
    });
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div>
      <Spin spinning={loading}>
        <BaseContainer header={"CUSTOMER INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Customer">{data_detail?.customer}</DetailText>
            <DetailText label="Account">{data_detail?.account}</DetailText>
            <DetailText label="SOR">{data_detail?.sor}</DetailText>
            <DetailText label="Account Type">
              {data_detail?.accountType}
            </DetailText>
            <DetailText label="Account Group">
              {data_detail?.accountGroup}
            </DetailText>
            <DetailText label="Account Segment">
              {data_detail?.accountSegment}
            </DetailText>
            <DetailText label="Cost Center">
              {data_detail?.costCenter}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"Receipt Detail Information"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Receipt Number">
              {data_detail?.receiptNumber}
            </DetailText>
            <DetailText label="Receipt Code">
              {data_detail?.receiptCode}
            </DetailText>
            <DetailText label="Receipt Date">
              {moment(data_detail?.receiptDate).format(dateFormatting.dateTime)}
            </DetailText>
            <DetailText label="Type">{data_detail?.paymentType}</DetailText>
            <DetailText label="Receipt Method">
              {data_detail?.paymentMethod}
            </DetailText>
            <DetailText label="Receipt Channel">
              {data_detail?.receiptChannel}
            </DetailText>
            <DetailText label="isReconciled">
              {data_detail?.isReconciled ? "TRUE" : "FALSE"}
            </DetailText>
            <DetailText label="Bank">{data_detail?.bank}</DetailText>
            <DetailText label="Collecting Agent">
              {data_detail?.collectingAgent}
            </DetailText>
            <DetailText label="Delivery Channel">
              {data_detail?.deliveryChannel}
            </DetailText>
            <DetailText label="Transaction Cycle">
              {data_detail?.paymentCycle}
            </DetailText>
            <DetailText label="Transaction Calendar">
              {/* { data_detail?.paymentCycle ? moment(data_detail?.paymentCycle).format("MM YYYY"): " "} */}
              {data_detail?.paymentCycle}
            </DetailText>
            <DetailText label="Reference Number">
              {data_detail?.refNumber}
            </DetailText>

            <DetailText label="Source">{data_detail?.source}</DetailText>
            <DetailText label="Bank Statement Name">
              {data_detail?.bankStatementName}
            </DetailText>
            <DetailText label="Bank Statement Date">
              {data_detail?.bankStatementDate
                ? moment(data_detail?.bankStatementDate).format(
                  dateFormatting.dateTime
                )
                : " "}
            </DetailText>
            <DetailText label="Status">{data_detail?.status}</DetailText>
            <DetailText label="Status Approval">
              {data_detail?.statusApproval}
            </DetailText>
            <DetailText label="Payment Partner">
              {data_detail?.paymentGateway}
            </DetailText>
            <DetailText label="Miscellaneous (isMisc)">
              {data_detail?.isMisc === true ? "TRUE" : ""}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"Amount detail Information"}>
          {/* <div className="w-full grid grid-cols-3 gap-3"> */}
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Currency">{data_detail?.currency}</DetailText>
            <DetailText label="Amount">{data_detail?.amount}</DetailText>
            <DetailText label="Rate">{data_detail?.rateAmount}</DetailText>
            <DetailText label="Rate Type">{data_detail?.rateType}</DetailText>
            <DetailText label="Rate Date">
              {data_detail?.rateDate === null
                ? ""
                : moment(data_detail?.rateDate).format(
                  dateFormatting.dateCapital
                )}
            </DetailText>
            <DetailText label="Amount Equivalent">
              {data_detail?.equivalentAmount}
            </DetailText>
            <DetailText label="Converted Currency">
              {data_detail?.convertedCurrency}
            </DetailText>

            <DetailText label="Applied Amount">
              {data_detail?.appliedAmount}
            </DetailText>
            <DetailText label="Applied Amount Equivalent">
              {data_detail?.equivalentAppliedAmount}
            </DetailText>
            <DetailText label="Unapplied Amount">
              {data_detail?.unAppliedAmount}
            </DetailText>
            <DetailText label="Unapplied Amount Equivalent">
              {data_detail?.equivalentUnAppliedAmount}
            </DetailText>
            <DetailText label="Refund Amount">
              {data_detail?.refundAmount}
            </DetailText>
            <DetailText label="Transfer Amount">
              {data_detail?.transferAmount}
            </DetailText>
          </div>

          <div className="w-full gap-3">
            <DetailText label="Description">
              {data_detail?.description}
            </DetailText>
          </div>
        </BaseContainer>
        <BaseContainer header={"Persetujuan Tanda Terima"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Grup Persetujuan">{data_detail?.approvalReceipt?.group}</DetailText>
            <DetailText label="Penyetuju">{data_detail?.approvalReceipt?.approver}</DetailText>
          </div>
        </BaseContainer>
        <BaseContainer header={"Persetujuan Alokasi"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Grup Persetujuan">{data_detail?.approvalAllocation?.group}</DetailText>
            <DetailText label="Penyetuju">{data_detail?.approvalAllocation?.approver}</DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"history log information"}>
          <div className="w-full grid grid-cols-5 gap-3">
            <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
            <DetailText label="Created Date">
              {data_detail?.createdDate
                ? moment(data_detail.createdDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
            <DetailText label="Updated Date">
              {data_detail?.updatedDate
                ? moment(data_detail.updatedDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"Allocation information"}>
          <div className="w-full">
            {/* <TablePagination
              dataSource={data_allocation?.result}
              columns={columnsAllocation(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              totalData={data_allocation?.page?.totalElements}
              onSort={onSort}
              tableScrolled={{
                x: 4200,
                y: 300,
              }}
            /> */}

            <CreateAllocation
              setIsInsert={setStoredData}
              isInsert={storedData}
              dataTable={dataTable}
              setDataTable={setDataTable}
              unApliedAmount={data_detail?.unAppliedAmountReal}
              dataDetail={data_detail}
              totalUnapliedAmount={totalAllocationAmount}
              setTotalUnapliedAmount={setTotalAllocationAmount}
            // amount={amount}
            // totalAllocationAmount={totalAllocationAmount}
            // setTotalAllocationAmount={setTotalAllocationAmount}
            // accountNumberSelected={accNumb?.name}
            // rateAmountValue={rateAmountValues}
            // formValues={formValues}
            />
          </div>
        </BaseContainer>
      </Spin>
    </div>
  );
};

export default DetailReceipt;
