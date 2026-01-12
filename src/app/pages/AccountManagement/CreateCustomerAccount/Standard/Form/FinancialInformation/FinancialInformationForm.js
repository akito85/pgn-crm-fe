import React, { useEffect, useState } from "react";
import { Space, Collapse, Badge } from "antd";
import PaymentChannelForm from "./PaymentChannelForm";
import TaxIdentifierForm from "./TaxIdentifierForm";
import WithholdingTaxForm from "./WithholdingTaxForm";
import AccountingRuleForm from "./AccountingRuleForm";
import BillingBucketForm from "./BillingBucketForm";
import TaxImplicationForm from "./TaxImplicationForm";
import { hasValue } from "../../../../../../../utils";

const FinancialInformationForm = ({
  handleFIObj = () => {},
  handleTIObj = () => {},
  handleWTObj = () => {},
  tiObj = {},
  wtObj = {},
  fiObj = {},
  dispatch = () => {},
  dataFinancialInfo = [],
  dataAddress,
  form,
  setTiObj,
  current = 0,
  setCurrent = () => {},
  errorFieldName = null,
  setErrorFieldName = () => {},
}) => {
  const financialList = [
    {
      header: "Payment Channel",
      children: (
        <PaymentChannelForm
          dispatch={dispatch}
          fiObj={fiObj}
          handleFIObj={handleFIObj}
        />
      ),
      isError: Object.keys(fiObj).length > 0 ? !fiObj.paymentChannelType : true
    },
    {
      header: "Tax Identifier",
      children: (
        <TaxIdentifierForm
          dispatch={dispatch}
          tiObj={tiObj}
          handleTIObj={handleTIObj}
          dataAddress={dataAddress}
          form={form}
          setTiObj={setTiObj}
        />
      ),
      isError: Object.keys(fiObj).length > 0 && (hasValue(tiObj.taxIdentifierType) && hasValue(tiObj.taxIdentifierNumber) && (tiObj.taxIdentifierNumber.length === 16) && hasValue(tiObj.taxIdentifierName) && hasValue(tiObj.taxAddress)) ? false : true
      // isError: Object.keys(fiObj).length === 0 || !hasValue(tiObj.taxIdentifierType) || !hasValue(tiObj.taxIdentifierNumber) || tiObj.taxIdentifierNumber.length !== 16 || !hasValue(tiObj.taxIdentifierName) || !hasValue(tiObj.taxAddress)
    },
    {
      header: "Withholding tax",
      children: (
        <WithholdingTaxForm
          dispatch={dispatch}
          wtObj={wtObj}
          handleWTObj={handleWTObj}
        />
      ),
      isError: false
    },
    {
      header: "Accounting Rule",
      children: <AccountingRuleForm dataFinancialInfo={dataFinancialInfo} />,
      isError: false
    },
    {
      header: "Billing Bucket",
      children: (
        <BillingBucketForm
          dataFinancialInfo={dataFinancialInfo}
          type={"create"}
        />
      ),
      isError: false
    },
    {
      header: "Tax Implication",
      children: (
        <TaxImplicationForm
          dataFinancialInfo={dataFinancialInfo}
          type={"create"}
        />
      ),
      isError: false
    },
  ];

  const handleCollapse = (e, index) => {
    if (index !== current) {
      setCurrent(index);
    } else {
      setCurrent(undefined);
    }
  };

  useEffect(() => {
    if (
      current === 0 && ["paymentChannelType", "generateVA"].includes(errorFieldName) ||
      current === 1 && ["taxIdentifierType", "taxIdentifierNumber", "taxIdentifierName", "taxAddress", "relatedAccountId", "customerNameTI", "accountNameTI", "ratit", "ratin", "ratin2", "ratia", "startDateTI", "descriptionTI"].includes(errorFieldName) ||
      current === 2 && ["wapuFlag", "startDateWT", "descriptionWT"].includes(errorFieldName) ||
      current === 3 && ["receivableAccount", "revenueAccount"].includes(errorFieldName)
    ) {
      setTimeout(() => {
        form.scrollToField(errorFieldName, {
          behavior: 'smooth',
          block: 'center',
        });
        setErrorFieldName(null);
      }, 200);
    }
  }, [current, errorFieldName])

  return (
    <div>
      <span className="text-primary uppercase font-bold">
        FINANCIAL INFORMATION
      </span>

      <div className="pt-[30px]">
        <Space direction="vertical" style={{ width: "100%" }}>
          {financialList.map((item, index) => (
            <Collapse
              key={index}
              activeKey={index === current ? [0] : undefined}
              onChange={(e) => handleCollapse(e, index)}
              style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
            >
              <Collapse.Panel header={item.header} extra={item.isError ? <Badge count={'!'} overflowCount={10} /> : null}>
                {item.children}
              </Collapse.Panel>
            </Collapse>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default FinancialInformationForm;
