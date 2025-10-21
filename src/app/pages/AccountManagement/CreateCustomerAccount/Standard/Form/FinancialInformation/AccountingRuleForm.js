import React from "react";
import { Spin, Form } from "antd";
import { useSelector } from "react-redux";
import InputComponent from "../../../../../../../components/InputComponent";

const AccountingRuleForm = ({ dataFinancialInfo = [] }) => {
  // Selector
  const { loading } = useSelector((state) => state.account);
  return (
    <div>
      <span className="text-primary uppercase font-bold">
        ACCOUNTING RULE INFORMATION
      </span>

      <div className="w-full grid grid-cols-2 gap-2 pt-[15px]">
        <Form.Item
          label={"Receivable Account"}
          name={"receivableAccount"}
          valuePropName={dataFinancialInfo?.accountingRule?.receivableAccount}
        >
          <InputComponent
            disabled={true}
            value={dataFinancialInfo?.accountingRule?.receivableAccount}
          />
        </Form.Item>
        <Form.Item
          label={"Revenue Account"}
          name={"revenueAccount"}
          valuePropName={dataFinancialInfo?.accountingRule?.revenueAccount}
        >
          <InputComponent
            disabled={true}
            value={dataFinancialInfo?.accountingRule?.revenueAccount}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default AccountingRuleForm;
