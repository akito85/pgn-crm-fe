import React, { Fragment, useRef, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import moment from "moment";
import { dateFormatting, roundToTwoDecimal } from "../../../../../utils";
import { columnAllocation } from "../Table/ColumnAllocation";
import TablePagination from "../../../../../components/TablePagination";

const ModalConfirmManualReceipt = ({
  tabData,
  data,
  selectedHierarchy,
  listDataAttachment = [],
  dataOption = [],
  listDataAppHierDetail,
  setStoredData,
  storedData,
  dataTable,
  setDataTable,
  totalAllocationAmount,
  setTotalAllocationAmount,
  amount,
  setAmount,
  colAgentDDL,
  cusNumberDDL,
  payGatewayDDL,
  payTypeDDL,
  payDeliveryDDL,
  currencyDDL,
  bankDDL,
  payMethodDDL,
  rateTypeDDL,
  dataReceiptChannelDDL,
  dataAccNumber,
  rateString,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const resepChannel = dataReceiptChannelDDL?.data
    ?.filter((a) => a?.id === data?.receiptChannelId)
    ?.find((b) => b?.name)?.name;
  const cusNumb = cusNumberDDL?.data
    ?.filter((a) => a?.id === data?.customerId)
    ?.find((b) => b?.name)?.name;
  const accNumb = dataAccNumber?.data
    ?.filter((a) => a?.id === data?.accountId)
    ?.find((b) => b?.name)?.name;
  const colGen = colAgentDDL?.data
    ?.filter((a) => a?.id === data?.collectingAgentId)
    ?.find((b) => b?.name)?.name;
  const devChen = payDeliveryDDL?.data
    ?.filter((a) => a?.id === data?.deliveryChannelId)
    ?.find((b) => b?.name)?.name;
  const method = payMethodDDL?.data
    ?.filter((a) => a?.id === data?.paymentMethodId)
    ?.find((b) => b?.name)?.name;
  const payType = payTypeDDL?.data
    ?.filter((a) => a?.id === data?.paymentTypeId)
    ?.find((b) => b?.name)?.name;
  const bank = bankDDL?.data
    ?.filter((a) => a?.id === data?.bankId)
    ?.find((b) => b?.name)?.name;
  const currency = currencyDDL?.data
    ?.filter((a) => a?.id === data?.currencyId)
    ?.find((b) => b?.name)?.name;
  const rateType = rateTypeDDL?.data
    ?.filter((a) => a?.id === data?.rateTypeId)
    ?.find((b) => b?.name)?.name;
  const paymentGateway = payGatewayDDL?.data
    ?.filter((a) => a?.id === data?.paymentGatewayId)
    ?.find((b) => b?.name)?.name;

  const [page, setPage] = useState(1);
  const [pageChoose, setPageChoose] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = () => console.log("dicari");
  console.log(data);
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  console.log(typeof data.amount);
  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div className="w-full">
            <div className="text-primary text-xs font-bold uppercase py-3">
              {"CUSTOMER INFORMATION"}
            </div>
            <div className="grid grid-cols-3 w-full gap-5">
              <DetailText label={"Account Type"}>{data?.accountType}</DetailText>
              <DetailText label={"Account Number"}>{accNumb}</DetailText>
              <DetailText label={"Account Name"}>{data?.accountName}</DetailText>
              <DetailText label={"Customer Name"}>{data?.customerName}</DetailText>
              <DetailText label={"Customer Number"}>{data?.customerNumber}</DetailText>
              <DetailText label={"SOR"}>{data?.sor}</DetailText>
              <DetailText label={"Cost Center"}>{data?.area}</DetailText>
              <DetailText label={"Account Segment"}>{data?.segment}</DetailText>
            </div>
            <div className="text-primary text-xs font-bold uppercase py-3">
              {"RECEIPT DETAIL INFORMATION"}
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <DetailText label={"Receipt Channel"}>{resepChannel}</DetailText>
              <DetailText label={"Payment Gateway"}>
                {paymentGateway}
              </DetailText>
              <DetailText label={"Collecting Agent"}>{colGen}</DetailText>
              <DetailText label={"Delivery Channel"}>{devChen}</DetailText>
              <DetailText label={"Method"}>{method}</DetailText>
              <DetailText label={"Receipt Date"}>
                {data?.receiptDate
                  ? moment(data?.receiptDate).format(dateFormatting.dateTime)
                  : ""}
              </DetailText>
              <DetailText label={"Payment Type"}>{payType}</DetailText>
              <DetailText label={"Bank"}>{bank}</DetailText>
              <DetailText label={"Reference"}>{data?.refrence}</DetailText>
            </div>
            <div className="text-primary text-xs font-bold uppercase py-3">
              {"AMOUNT DETAIL INFORMATION"}
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <DetailText label={"Currency"}>{currency}</DetailText>
              <DetailText label={"Amount"}>
                {/* {data?.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {roundToTwoDecimal(data.amount)}
                {/* {Math.round((data?.amount + Number.EPSILON) * 100) / 100} */}
              </DetailText>
              <DetailText label={"Rate"}>
                {/* {data?.rateAmount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {rateString}
              </DetailText>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <DetailText label={"Rate Type"}>{rateType}</DetailText>
              <DetailText label={"Rate Date"}>
                {data?.rateDate
                  ? moment(data?.rateDate).format(dateFormatting.dateCapital)
                  : ""}
              </DetailText>
              <DetailText label={"Equivalent Amount"}>
                {/* {NumbersEQ.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {roundToTwoDecimal(data.equivalentAmount)}
              </DetailText>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <DetailText label={"Converted Currency"}>
                {data?.convertedCurrency}
              </DetailText>
              {/* <DetailText label={"Equivalent Amount"}>
                {data?.equivalentAmount}
              </DetailText> */}
            </div>
            <div className="w-full grid grid-cols-1 gap-5">
              <DetailText label={"Description"}>{data?.description}</DetailText>
            </div>
          </div >
        );
      case tabData[1].value:
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (data) => data.value === selectedHierarchy
              )?.[0].name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy
          />
        );
      case tabData[2].value:
        return (
          <AttachmentComponent
            type={"preview"}
            data={listDataAttachment}
            typeSelector="receipt"
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  const handleReceipt = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={tabData}
        onChange={handleReceipt}
        currentPosition={valuePage}
      />
      <div className="flex flex-col gap-4">
        {/* <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} Information`}
        </div> */}
        {showSection()}
      </div>
      {valuePage === tabData[0].value ? (
        <div className="flex flex-col gap-4">
          <div className="text-primary text-xs font-bold uppercase py-1">
            {"ALLOCATION INFORMATION"}
          </div>
          <TablePagination
            dataSource={dataTable}
            columns={columnAllocation(page, pageSize)}
            tableScrolled={{ x: 3500, y: 500 }}
            totalData={dataTable?.length}
            pageSize={pageSize}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ModalConfirmManualReceipt;
