import React, { Fragment, useRef, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../components/DetailText";
import { Tabs } from "antd";
import moment from "moment";
import { dateFormatting, roundToTwoDecimal } from "../../../../../utils";
import { columnAllocation } from "../Table/ColumnAllocation";
import TableRBI from "../../../../../components/TableRBI";
import SectionCard from "../../../../../components/SectionCard";

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
  const [activeKey, setActiveKey] = useState(tabData[0].value);
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
    switch (activeKey) {
      case tabData[0].value:
        return (
          <div className="w-full">
          <div className="w-full flex flex-col gap-4">
            <SectionCard title="CUSTOMER INFORMATION">
              <div className="grid grid-cols-5 w-full gap-5">
                <DetailText label={"Receipt Type"}>{data?.receiptType}</DetailText>
                <DetailText label={"Customer Type"}>
                  {data?.registrationNumber ? "Prospective Customer" : "Customer"}
                </DetailText>
                <DetailText label={"Registration Number"}>{data?.registrationNumber}</DetailText>
                <DetailText label={"Account Number"}>{accNumb}</DetailText>
                <DetailText label={"Customer Number"}>{data?.customerNumber}</DetailText>

                <DetailText label={"Customer Name"}>{data?.customerName}</DetailText>
                <DetailText label={"Account Name"}>{data?.accountName}</DetailText>
                <DetailText label={"Account Segment"}>{data?.segment}</DetailText>
                <DetailText label={"Account Group Type"}>{data?.accountGroupType}</DetailText>
                <DetailText label={"Account Type"}>{data?.accountType}</DetailText>

                <DetailText label={"Classification Type"}>{data?.classificationType}</DetailText>
                <DetailText label={"SOR"}>{data?.sor}</DetailText>
                <DetailText label={"Cost Center"}>{data?.area}</DetailText>
                <DetailText label={"Meter Reading Code"}>{data?.meterReadingCode}</DetailText>
              </div>
            </SectionCard>

            <SectionCard title="RECEIPT INFORMATION">
              <div className="w-full grid grid-cols-5 gap-5">
                <DetailText label={"Receipt Method"}>{method}</DetailText>
                <DetailText label={"Receipt Code"}>{data?.receiptCode}</DetailText>
                <DetailText label={"Receipt Number"}>{data?.receiptNumber || "-"}</DetailText>
                <DetailText label={"Receipt Date"}>
                  {data?.receiptDate
                    ? moment(data?.receiptDate).format(dateFormatting.dateTime)
                    : ""}
                </DetailText>
                <DetailText label={"Receipt Channel"}>{resepChannel}</DetailText>
                <DetailText label={"Payment Type"}>{payType}</DetailText>

                <DetailText label={"Partner"}>{paymentGateway}</DetailText>
                <DetailText label={"Collecting Agent"}>{colGen}</DetailText>
                <DetailText label={"Delivery Channel"}>{devChen}</DetailText>
                <DetailText label={"Bank"}>{bank}</DetailText>
                <div />

                <div className="col-span-5">
                  <DetailText label={"Remark"}>{data?.receiptRemark}</DetailText>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="AMOUNT INFORMATION">
              <div className="w-full grid grid-cols-5 gap-5">
                <DetailText label={"Currency"}>{currency}</DetailText>
                <DetailText label={"Amount"}>{roundToTwoDecimal(data.amount)}</DetailText>
                <DetailText label={"Converted Currency"}>{data?.convertedCurrency || "-"}</DetailText>
                <DetailText label={"Rate Type"}>{rateType}</DetailText>
                <DetailText label={"Rate Date"}>
                  {data?.rateDate
                    ? moment(data?.rateDate).format(dateFormatting.dateCapital)
                    : ""}
                </DetailText>

                <DetailText label={"Rate"}>{rateString}</DetailText>
                <DetailText label={"Equivalent Amount"}>{roundToTwoDecimal(data.equivalentAmount)}</DetailText>
                <DetailText label={"Unapplied Amount / Balance"}>{data?.unappliedAmount || 0}</DetailText>
                <DetailText label={"Applied Amount"}>{data?.appliedAmount || 0}</DetailText>
                <DetailText label={"Applied Eqv Amount"}>{data?.appliedEqvAmount || 0}</DetailText>

                <DetailText label={"Unapplied Eqv Amount"}>{data?.unappliedEqvAmount || 0}</DetailText>
                <DetailText label={"Unidentified Amount"}>{data?.unidentifiedAmount || 0}</DetailText>
                <DetailText label={"Hold Amount"}>{data?.holdAmount || 0}</DetailText>
                <DetailText label={"Refund Amount"}>{data?.refundAmount || 0}</DetailText>
                <DetailText label={"Transfer Amount"}>{data?.transferAmount || 0}</DetailText>

                <div className="col-span-5">
                  <DetailText label={"Description"}>{data?.description}</DetailText>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="ALLOCATION ITEM INFORMATION">
              <div className="flex flex-col gap-4">
                <TableRBI
                  dataSource={dataTable}
                  columns={columnAllocation(page, pageSize)}
                  tableScrolled={{ x: 1500, y: 500 }}
                  totalData={dataTable?.length}
                  pageSize={pageSize}
                  current={page}
                  onChange={handleChange}
                  onSizeChanger={handleChange}
                  useSelect={false}
                />
              </div>
            </SectionCard>
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

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        items={tabData.map((tab) => ({
          label: tab.value,
          key: tab.value,
        }))}
      />
      <div className="flex flex-col gap-4">
        {showSection()}
      </div>
    </div>
  );
};

export default ModalConfirmManualReceipt;
