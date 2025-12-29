import React, { useState } from "react";
import { Select } from "antd";
import BaseContainer from "../../../../../../components/BaseContainer";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import CardContainer from "../../../../../../components/CardContainer";

const AdjustmentInvoiceSectionForm = ({ type, form }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleAccountChange = (value) => {
    setSelectedAccount(value);
    // TODO: Fetch account details and populate fields
  };

  return (
    <>
      {/* Customer Information Section */}
      <CardContainer subHeader={"CUSTOMER INFORMATION"}>
        <div className="grid grid-cols-3 gap-3">
          <SelectComponent
            label="Account Number"
            name="accountNumber"
            required
            requiredMessage="Please select Account Number!"
            placeholder="Select Account Number"
            showSearch
            onChange={handleAccountChange}
          >
            {/* TODO: Map account options */}
          </SelectComponent>

          <InputComponent
            label="Customer Number"
            name="customerNumber"
            disabled
            placeholder=""
          />

          <InputComponent
            label="Customer Name"
            name="customerName"
            disabled
            placeholder=""
          />

          <InputComponent
            label="Account Name"
            name="accountName"
            disabled
            placeholder=""
          />

          <InputComponent
            label="Account Segment"
            name="accountSegment"
            disabled
            placeholder=""
          />

          <InputComponent
            label="Account Group Type"
            name="accountGroupType"
            disabled
            placeholder=""
          />

          <InputComponent label="SOR" name="sor" disabled placeholder="" />

          <InputComponent
            label="Cost Center Code"
            name="costCenterCode"
            disabled
            placeholder=""
          />

          <InputComponent
            label="Cost Center Name"
            name="costCenterName"
            disabled
            placeholder=""
          />

          <InputComponent
            label="Master Reading Code"
            name="meterReadingCode"
            disabled
            placeholder=""
          />
        </div>
      </CardContainer>

      {/* Adjustment Invoice Information Section */}
      <CardContainer subHeader={"ADJUSTMENT INVOICE INFORMATION"}>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <SelectComponent
            label="Billing Cycle"
            name="billingCycle"
            required
            requiredMessage="Please select Billing Cycle!"
            placeholder="Select Billing Cycle"
          >
            {/* TODO: Map billing cycle options */}
          </SelectComponent>

          <SelectComponent
            label="Billing Period"
            name="billingPeriod"
            required
            requiredMessage="Please select Billing Period!"
            placeholder="Select Billing Period"
          >
            {/* TODO: Map billing period options */}
          </SelectComponent>

          <SelectComponent
            label="Invoice Number"
            name="invoiceNumber"
            required
            requiredMessage="Please select Invoice Number!"
            placeholder="Select Invoice Number"
            showSearch
          >
            {/* TODO: Map invoice number options */}
          </SelectComponent>

          <DateComponent
            label="Transaction Date"
            name="transactionDate"
            required
            requiredMessage="Please select Transaction Date!"
          />

          <DateComponent
            label="Document Date"
            name="documentDate"
            required
            requiredMessage="Please select Document Date!"
          />

          <SelectComponent
            label="Term of Payment"
            name="termOfPayment"
            required
            requiredMessage="Please select Term of Payment!"
            placeholder="Select Term of Payment"
          >
            <Select.Option value="Date">Date</Select.Option>
            <Select.Option value="Value">Value</Select.Option>
            {/* TODO: Map term of payment options */}
          </SelectComponent>

          <SelectComponent
            label="Adjustment Reason"
            name="adjustmentReason"
            required
            requiredMessage="Please select Adjustment Reason!"
            placeholder="Select Adjustment Reason"
          >
            {/* TODO: Map adjustment reason options */}
          </SelectComponent>
        </div>

        <InputComponent
          label="Remark"
          name="remark"
          type="textarea"
          rows={3}
          placeholder="Enter Remark"
          maxLength={500}
        />
      </CardContainer>

      {/* Invoice Information Section */}
      <CardContainer subHeader={"INVOICE INFORMATION"}>
        <div className="grid grid-cols-8 gap-3">
          <div>
            <p className="text-gray-500 text-xs">Invoice Number</p>
            <p className="font-medium">INV001</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Billing Code</p>
            <p className="font-medium">BC8279</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Invoice Date</p>
            <p className="font-medium">7 Jan 2022</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Terms of Payment</p>
            <p className="font-medium">17 Jan 2023</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Billing Cycle</p>
            <p className="font-medium">5-5</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Billing Period</p>
            <p className="font-medium">Des 2021</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Amount IDR</p>
            <p className="font-medium">1.200.000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Amount USD</p>
            <p className="font-medium">0.00</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Amount EQV IDR</p>
            <p className="font-medium">1.200.000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Amount EQV USD</p>
            <p className="font-medium">71.08</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Currency</p>
            <p className="font-medium">IDR</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Withholding Tax</p>
            <p className="font-medium">300.000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Tax Basis IDR</p>
            <p className="font-medium">15.000.000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Tax Basis USD</p>
            <p className="font-medium">15.000.000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Vat IDR</p>
            <p className="font-medium">1.650.000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">VAT USD</p>
            <p className="font-medium">165</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Rate</p>
            <p className="font-medium">15.000</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Rate Type</p>
            <p className="font-medium">Corporate</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Rate Date</p>
            <p className="font-medium">11 Jan 2022</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Status</p>
            <p className="font-medium">
              <span className="bg-green-500 text-white px-3 py-1 rounded">
                Paid
              </span>
            </p>
          </div>
        </div>
      </CardContainer>
    </>
  );
};

export default AdjustmentInvoiceSectionForm;
