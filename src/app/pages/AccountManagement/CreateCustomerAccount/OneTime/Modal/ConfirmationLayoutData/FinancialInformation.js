import React, { useState, useEffect } from "react";
import { Spin, Space, Collapse } from "antd";
import { useSelector } from "react-redux";
import DetailText from "../../../../../../../components/DetailText";
import TaxImplicationForm from "../../Form/FinancialInformation/TaxImplicationForm";
import BillingBucketForm from "../../Form/FinancialInformation/BillingBucketForm";
import {
  getAllAccountPaginate,
  getPaymentChannel,
  getTaxIdentifierType,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";

const FinancialInformation = ({
  dataPC,
  dataTI,
  dataTR,
  dataWT,
  dataFinancialInfo = [],
  dispatch = () => {},
  addressTable = [],
  dataForm = {},
}) => {
  // Selector
  const { loading, data_account, data_paymentChannel, data_taxIdentifierType } =
    useSelector((state) => state.account);

  // State
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getAllAccountPaginate({ search, sort, page, pageSize }));
  }, [search, sort, page, pageSize]);

  useEffect(() => {
    dispatch(getPaymentChannel());
    dispatch(getTaxIdentifierType());
  }, []);

  const labelPaymentChannel = data_paymentChannel
    ?.filter((a) => a.id === dataPC?.paymentChannelType)
    ?.find((b) => b.name)?.name;

  const labelAccountNumber = data_account?.result
    ?.filter((a) => a.accountId === dataTR?.relatedAccountId)
    ?.find((b) => b.accountName)?.accountName;

  const labelCustomerName = data_account?.result
    ?.filter((a) => a.accountId === dataTR?.relatedAccountId)
    ?.find((b) => b.customerName)?.customerName;

  const labelAccountName = data_account?.result
    ?.filter((a) => a.accountId === dataTR?.relatedAccountId)
    ?.find((b) => b.accountName)?.accountName;

  const labelTaxType = data_account?.result
    ?.filter((a) => a.accountId === dataTR?.relatedAccountId)
    ?.find((b) => b.taxIdentifierTypeValue)?.taxIdentifierTypeValue;

  const labelTaxNumber = data_account?.result
    ?.filter((a) => a.accountId === dataTR?.relatedAccountId)
    ?.find((b) => b.taxIdentifierNumber)?.taxIdentifierNumber;

  const labelTaxName = data_account?.result
    ?.filter((a) => a.accountId === dataTR?.relatedAccountId)
    ?.find((b) => b.taxIdentifierName)?.taxIdentifierName;

  const labelTaxAddress = data_account?.result
    ?.filter((a) => a.accountId === dataTR?.relatedAccountId)
    ?.find((b) => b.taxIdentifierAddressValue)?.taxIdentifierAddressValue;

  const labelTIType = data_taxIdentifierType
    ?.filter((a) => a.id === dataTI?.taxIdentifierType)
    ?.find((b) => b.text)?.text;

  const name = addressTable
    ?.filter((a) => a.addressId === parseInt(dataTI?.taxAddress))
    ?.find((b) => b.fullAddress)?.fullAddress;

  const financialList = [
    {
      header: "Payment Channel",
      children: (
        <>
          <span className="text-primary uppercase font-bold">
            PAYMENT CHANNEL INFORMATION
          </span>

          <div className="w-full grid grid-cols-2 gap-4 pt-[30px]">
            <DetailText label={"Payment Channel"}>
              {labelPaymentChannel}
            </DetailText>
            <DetailText label={"Generate Virtual Account"}>
              {dataPC?.virtualAccount === false ? "No" : "Yes"}
            </DetailText>
          </div>
        </>
      ),
    },
    {
      header: "Tax Identifier",
      children: (
        <>
          <span className="text-primary uppercase font-bold">
            TAX IDENTIFIER INFORMATION
          </span>

          <div className="w-full grid grid-cols-3 gap-4 pt-[30px]">
            <DetailText label={"Tax Identifier Type"}>{labelTIType}</DetailText>
            <DetailText label={"Tax Identifier Number"}>
              {dataTI?.taxIdentifierNumber}
            </DetailText>
            <DetailText label={"Tax Identifier Name"}>
              {dataTI?.taxIdentifierName}
            </DetailText>
            <div className="col-span-3">
              <DetailText label={"Tax Identifier Address"}>
                {typeof dataTI?.taxAddress === "string"
                  ? name
                  : dataTI?.taxIdentifierAddress}
              </DetailText>
            </div>
          </div>

          <span className="text-primary uppercase font-bold">
            TAX IDENTIFIER RELATION INFORMATION
          </span>

          <div className="w-full grid grid-cols-3 gap-4 pt-[30px]">
            <DetailText label={"Account Number"}>
              {dataForm?.relatedAccountId}
            </DetailText>
            <DetailText label={"Customer Name"}>{dataForm.customerNameTI}</DetailText>
            <DetailText label={"Account Name"}>{dataForm?.accountNameTI}</DetailText>
            <DetailText label={"Related Account Tax Identifier Type"}>
              {dataForm?.ratit}
            </DetailText>
            <DetailText label={"Related Account Tax Identifier Number"}>
              {dataForm?.ratin}
            </DetailText>
            <DetailText label={"Related Account Tax Identifier name"}>
              {dataForm?.ratin2}
            </DetailText>
            <div className="col-span-3">
              <DetailText label={"Related Account Tax Identifier Address"}>
                {dataForm?.ratia}
              </DetailText>
            </div>
            <div className="col-span-3">
              <DetailText label={"Start Date"}>{dataTR?.startDate}</DetailText>
            </div>
            <div className="col-span-3">
              <DetailText label={"Description"}>
                {dataTR?.description}
              </DetailText>
            </div>
          </div>
        </>
      ),
    },
    {
      header: "Withholding tax",
      children: (
        <>
          <span className="text-primary uppercase font-bold">
            WITHHOLDING TAX INFORMATION
          </span>

          <div className="w-full grid grid-cols-3 gap-4 pt-[30px]">
            <DetailText label={"Start Date"}>{dataWT?.startDate}</DetailText>
            <DetailText label={"WAPU"}>
              {dataWT?.wapuFlag === true ? "Yes" : "No"}
            </DetailText>
            <DetailText label={"Description"}>{dataWT?.description}</DetailText>
          </div>
        </>
      ),
    },
    {
      header: "Accounting Rule",
      children: (
        <>
          <span className="text-primary uppercase font-bold">
            ACCOUNTING RULE INFORMATION
          </span>

          <div className="w-full grid grid-cols-2 gap-4 pt-[30px]">
            <DetailText label={"Receivable Account"}>
              {dataFinancialInfo?.accountingRule?.receivableAccount === ""
                ? "-"
                : dataFinancialInfo?.accountingRule?.receivableAccount}
            </DetailText>
            <DetailText label={"Revenue Account"}>
              {dataFinancialInfo?.accountingRule?.revenueAccount === ""
                ? "-"
                : dataFinancialInfo?.accountingRule?.revenueAccount}
            </DetailText>
          </div>
        </>
      ),
    },
    {
      header: "Billing Bucket",
      children: (
        <BillingBucketForm
          type={"confirmation"}
          dataFinancialInfo={dataFinancialInfo}
        />
      ),
    },
    {
      header: "Tax Implication",
      children: (
        <TaxImplicationForm
          type={"confirmation"}
          dataFinancialInfo={dataFinancialInfo}
        />
      ),
    },
  ];

  const handleCollapse = (e, index) => {
    if (index !== current) {
      setCurrent(index);
    } else {
      setCurrent(undefined);
    }
  };
  return (
    <Spin spinning={loading}>
      <div className="w-full p-5">
        <p className="text-primary uppercase font-bold">
          Financial Information
        </p>

        <div className="pt-[30px]">
          <Space direction="vertical" style={{ width: "100%" }}>
            {financialList.map((item, index) => (
              <Collapse
                key={index}
                activeKey={index === current ? [0] : undefined}
                onChange={(e) => handleCollapse(e, index)}
                style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
              >
                <Collapse.Panel header={item.header}>
                  {item.children}
                </Collapse.Panel>
              </Collapse>
            ))}
          </Space>
        </div>
      </div>
    </Spin>
  );
};

export default FinancialInformation;
