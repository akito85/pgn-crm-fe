import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Form } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import CardContainer from "../../../../../../components/CardContainer";
import {
  getListAccountInvoiceAdjustment,
  getAccountDetailInvoiceAdjustment,
  getBillingCycleInvoiceAdjustment,
  getBillingPeriodInvoiceAdjustment,
  getInvoiceListInvoiceAdjustment,
  getInvoiceDetailInvoiceAdjustment,
  getTermOfPaymentInvoiceAdjustment,
  clearAccountDetail,
  clearBillingPeriod,
  clearInvoiceList,
  clearInvoiceDetail,
} from "../../../../../../redux/slices/rating_billing_invoice/adjustmentInvoice";
import { currencyFormatting } from "../../../../../../utils/formatCurrency";
import moment from "moment";

const AdjustmentInvoiceSectionForm = ({ type, form }) => {
  const dispatch = useDispatch();

  const {
    dataListAccount,
    dataAccountDetail,
    dataListBillingCycle,
    dataListBillingPeriod,
    dataListTermOfPayment,
    dataListInvoice,
    dataInvoiceDetail,
  } = useSelector((state) => state.adjustmentInvoice);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState(null);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedTypeDueDate, setSelectedTypeDueDate] = useState("Date");
  const [searchAccount, setSearchAccount] = useState("");
  const [documentDate, setDocumentDate] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Get initial values from form for update mode
  useEffect(() => {
    // Use a small delay to ensure form values are set
    const timer = setTimeout(() => {
      const accountNumber = form.getFieldValue("accountNumber");
      const billingCycleId = form.getFieldValue("billingCycleId");
      const billingPeriod = form.getFieldValue("billingPeriod");
      const invoiceNumber = form.getFieldValue("invoiceNumber");
      const typeDueDate = form.getFieldValue("typeDueDate");
      const docDate = form.getFieldValue("documentDate");

      if (accountNumber) setSelectedAccount(accountNumber);
      if (billingCycleId) setSelectedBillingCycle(billingCycleId);
      if (billingPeriod) setSelectedBillingPeriod(billingPeriod);
      if (invoiceNumber) setSelectedInvoice(invoiceNumber);
      if (typeDueDate) setSelectedTypeDueDate(typeDueDate);
      if (docDate) setDocumentDate(docDate);
    }, 100);

    return () => clearTimeout(timer);
  }, [form]);

  // Fetch initial data
  useEffect(() => {
    dispatch(getListAccountInvoiceAdjustment({ search: "" }));
    dispatch(getBillingCycleInvoiceAdjustment());
    dispatch(getTermOfPaymentInvoiceAdjustment());
  }, [dispatch]);

  // Reset selected states when type is create
  useEffect(() => {
    if (type === "create") {
      setSelectedAccount(null);
      setSelectedBillingCycle(null);
      setSelectedBillingPeriod(null);
      setSelectedInvoice(null);
      setSelectedTypeDueDate("Date");
    }
  }, [type]);

  // Update form values when dataAccountDetail changes
  useEffect(() => {
    if (dataAccountDetail) {
      form.setFieldsValue({
        customerNumber: dataAccountDetail.customerNumber,
        customerName: dataAccountDetail.customerName,
        accountName: dataAccountDetail.accountName,
        accountSegment: dataAccountDetail.accountSegment,
        accountGroupType: dataAccountDetail.accountGroupType,
        sor: dataAccountDetail.sor,
        costCenterCode: dataAccountDetail.costCenterCode,
        costCenterName: dataAccountDetail.costCenterName,
        meterReadingCode: dataAccountDetail.meterReadingCode,
      });
    }
  }, [dataAccountDetail, form]);

  // Update selected values when data from Redux changes
  useEffect(() => {
    const accountNumber = form.getFieldValue("accountNumber");
    const billingCycleId = form.getFieldValue("billingCycleId");
    const billingPeriod = form.getFieldValue("billingPeriod");
    const invoiceNumber = form.getFieldValue("invoiceNumber");
    const typeDueDate = form.getFieldValue("typeDueDate");
    const docDate = form.getFieldValue("documentDate");

    if (accountNumber && !selectedAccount) {
      setSelectedAccount(accountNumber);
    }
    if (billingCycleId && !selectedBillingCycle) {
      setSelectedBillingCycle(billingCycleId);
    }
    if (billingPeriod && !selectedBillingPeriod) {
      setSelectedBillingPeriod(billingPeriod);
    }
    if (invoiceNumber && !selectedInvoice) {
      setSelectedInvoice(invoiceNumber);
    }
    if (typeDueDate && typeDueDate !== selectedTypeDueDate) {
      setSelectedTypeDueDate(typeDueDate);
    }
    if (docDate && !documentDate) {
      setDocumentDate(docDate);
    }
  }, [
    dataAccountDetail,
    dataListBillingPeriod,
    dataListInvoice,
    dataInvoiceDetail,
    form,
    selectedAccount,
    selectedBillingCycle,
    selectedBillingPeriod,
    selectedInvoice,
    selectedTypeDueDate,
    documentDate,
  ]);

  // Handle account search with debounce (2 seconds)
  const handleAccountSearch = (value) => {
    console.log("onSearch triggered with value:", value);
    setSearchAccount(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for 2 seconds
    searchTimeoutRef.current = setTimeout(() => {
      console.log("Debounce completed. Searching account with keyword:", value);
      // Fetch account list with search parameter
      dispatch(getListAccountInvoiceAdjustment({ search: value || "" }));
    }, 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Monitor documentDate changes
  useEffect(() => {
    console.log("=== Document Date State Changed ===");
    console.log("New documentDate:", documentDate);
    console.log(
      "Formatted:",
      documentDate ? moment(documentDate).format("YYYY-MM-DD") : "null"
    );
  }, [documentDate]);

  // Handle account change
  const handleAccountChange = (value) => {
    setSelectedAccount(value);

    // Set account number to form immediately
    form.setFieldsValue({
      accountNumber: value,
    });

    // Only fetch account detail if value is not empty
    if (value) {
      dispatch(getAccountDetailInvoiceAdjustment(value));
    } else {
      // Clear account detail fields when value is cleared
      dispatch(clearAccountDetail());
      form.setFieldsValue({
        customerNumber: undefined,
        customerName: undefined,
        accountName: undefined,
        accountSegment: undefined,
        accountGroupType: undefined,
        sor: undefined,
        costCenterCode: undefined,
        costCenterName: undefined,
        meterReadingCode: undefined,
      });
    }

    // Clear dependent fields
    setSelectedBillingCycle(null);
    setSelectedBillingPeriod(null);
    setSelectedInvoice(null);
    form.setFieldsValue({
      billingCycleId: undefined,
      billingPeriod: undefined,
      invoiceNumber: undefined,
    });
    dispatch(clearBillingPeriod());
    dispatch(clearInvoiceList());
    dispatch(clearInvoiceDetail());
  };

  // Handle billing cycle change
  const handleBillingCycleChange = (value) => {
    // value here is the id, we need to find the period
    const selectedCycle = dataListBillingCycle?.find(
      (cycle) => cycle.id === value
    );
    const billingCyclePeriod = selectedCycle?.period;

    setSelectedBillingCycle(billingCyclePeriod);
    dispatch(getBillingPeriodInvoiceAdjustment(value));

    // Clear dependent fields
    setSelectedBillingPeriod(null);
    setSelectedInvoice(null);
    form.setFieldsValue({
      billingPeriod: undefined,
      invoiceNumber: undefined,
    });
    dispatch(clearInvoiceList());
    dispatch(clearInvoiceDetail());
  };

  // Handle billing period change
  const handleBillingPeriodChange = (value) => {
    setSelectedBillingPeriod(value);

    if (selectedAccount && selectedBillingCycle && value) {
      dispatch(
        getInvoiceListInvoiceAdjustment({
          accountNumber: selectedAccount,
          billingCycle: selectedBillingCycle,
          billingPeriod: value,
        })
      );
    }

    // Clear dependent fields
    setSelectedInvoice(null);
    form.setFieldsValue({
      invoiceNumber: undefined,
    });
    dispatch(clearInvoiceDetail());
  };

  // Handle invoice change
  const handleInvoiceChange = (value) => {
    setSelectedInvoice(value);
    dispatch(getInvoiceDetailInvoiceAdjustment(value));
  };

  // Handle document date change
  const handleDocumentDateChange = (date) => {
    console.log("Document date changed:", date);
    console.log(
      "Document date formatted:",
      date ? moment(date).format("YYYY-MM-DD") : "null"
    );

    setDocumentDate(date);
    form.setFieldsValue({
      documentDate: date,
    });

    // If terms of payment is selected, recalculate due date
    const selectedTerms = form.getFieldValue("termsOfPayment");
    if (selectedTerms && selectedTypeDueDate === "Terms of Payment" && date) {
      const calculatedDueDate = calculateDueDate(date, selectedTerms);
      form.setFieldsValue({
        dueDate: calculatedDueDate,
      });
    }
  };

  // Calculate due date from document date + terms of payment
  const calculateDueDate = (docDate, terms) => {
    if (!docDate || !terms) return null;

    // Extract days from terms description (e.g., "H + 7" -> 7)
    const daysMatch = terms.match(/\d+/);
    if (!daysMatch) return null;

    const days = parseInt(daysMatch[0], 10);
    return moment(docDate).add(days, "days");
  };

  // Format terms of payment display with calculated date
  const formatTermsOfPaymentOption = (term) => {
    console.log("Formatting option for term:", term.name);

    // Get document date from form field directly instead of state
    const currentDocDate = form.getFieldValue("documentDate");
    console.log("Current documentDate from form:", currentDocDate);
    console.log("Current documentDate state:", documentDate);

    if (!currentDocDate) {
      console.log("No document date, returning term name only");
      return term.name;
    }

    const calculatedDate = calculateDueDate(currentDocDate, term.description);
    console.log(
      "Calculated date:",
      calculatedDate ? calculatedDate.format("YYYY-MM-DD") : "null"
    );

    if (!calculatedDate) {
      return term.name;
    }

    const formattedOption = `${term.name} (${calculatedDate.format(
      "DD MMMM YYYY"
    )})`;
    console.log("Formatted option:", formattedOption);
    return formattedOption;
  };

  // Handle type due date change
  const handleTypeDueDateChange = (value) => {
    setSelectedTypeDueDate(value);
    if (value === "Date") {
      form.setFieldsValue({
        termsOfPayment: undefined,
      });
    } else {
      form.setFieldsValue({
        dueDate: undefined,
      });
    }
  };

  // Handle terms of payment change
  const handleTermsOfPaymentChange = (value) => {
    if (documentDate) {
      const calculatedDueDate = calculateDueDate(documentDate, value);
      form.setFieldsValue({
        dueDate: calculatedDueDate,
      });
    }
  };

  return (
    <>
      {/* Customer Information Section */}
      <CardContainer subHeader={"CUSTOMER INFORMATION"}>
        <div className="grid grid-cols-4 gap-x-3 gap-y-0">
          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[
              {
                required: true,
                message: "Please select Account Number!",
              },
            ]}
          >
            <SelectComponent
              placeholder="Select Account Number"
              showSearch
              onChange={handleAccountChange}
              onSearch={handleAccountSearch}
              disabled={type === "update"}
              filterOption={false}
            >
              {dataListAccount?.map((account) => (
                <Select.Option
                  key={account.accountNumber}
                  value={account.accountNumber}
                >
                  {account.accountNumber} - {account.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item label="Customer Number" name="customerNumber">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="Customer Name" name="customerName">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="Account Name" name="accountName">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="Account Segment" name="accountSegment">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="Account Group Type" name="accountGroupType">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="SOR" name="sor">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="Cost Center Code" name="costCenterCode">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="Cost Center Name" name="costCenterName">
            <InputComponent disabled placeholder="" />
          </Form.Item>

          <Form.Item label="Meter Reading Code" name="meterReadingCode">
            <InputComponent disabled placeholder="" />
          </Form.Item>
        </div>
      </CardContainer>

      {/* Adjustment Invoice Information Section */}
      <CardContainer subHeader={"ADJUSTMENT INVOICE INFORMATION"}>
        <div className="grid grid-cols-4 gap-3">
          <Form.Item
            label="Billing Cycle"
            name="billingCycleId"
            rules={[
              {
                required: true,
                message: "Please select Billing Cycle!",
              },
            ]}
          >
            <SelectComponent
              placeholder="Select Billing Cycle"
              onChange={handleBillingCycleChange}
              disabled={type === "update"}
            >
              {dataListBillingCycle?.map((cycle) => (
                <Select.Option key={cycle.id} value={cycle.id}>
                  {cycle.period}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Billing Period"
            name="billingPeriod"
            rules={[
              {
                required: true,
                message: "Please select Billing Period!",
              },
            ]}
          >
            <SelectComponent
              placeholder="Select Billing Period"
              onChange={handleBillingPeriodChange}
              disabled={!selectedBillingCycle || type === "update"}
            >
              {dataListBillingPeriod?.map((period) => (
                <Select.Option key={period.id} value={period.period}>
                  {period.period} ({period.startDate} - {period.endDate})
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Invoice Number"
            name="invoiceNumber"
            rules={[
              {
                required: true,
                message: "Please select Invoice Number!",
              },
            ]}
          >
            <SelectComponent
              placeholder="Select Invoice Number"
              showSearch
              onChange={handleInvoiceChange}
              disabled={!selectedBillingPeriod || type === "update"}
            >
              {dataListInvoice?.map((invoice) => (
                <Select.Option key={invoice} value={invoice}>
                  {invoice}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Transaction Date"
            name="transactionDate"
            rules={[
              {
                required: true,
                message: "Please select Transaction Date!",
              },
            ]}
          >
            <DateComponent placeholder="Select Transaction Date" />
          </Form.Item>

          <Form.Item
            label="Document Date"
            name="documentDate"
            rules={[
              {
                required: true,
                message: "Please select Document Date!",
              },
            ]}
          >
            <DateComponent
              placeholder="Select Document Date"
              onChange={handleDocumentDateChange}
            />
          </Form.Item>

          <Form.Item
            label="New Due Date"
            name="typeDueDate"
            rules={[
              {
                required: true,
                message: "Please select Type!",
              },
            ]}
          >
            <SelectComponent
              placeholder="Select Type"
              onChange={handleTypeDueDateChange}
            >
              <Select.Option value="Date">Date</Select.Option>
              <Select.Option value="Terms of Payment">
                Terms of Payment
              </Select.Option>
            </SelectComponent>
          </Form.Item>

          {selectedTypeDueDate === "Date" ? (
            <Form.Item
              label=""
              name="dueDate"
              rules={[
                {
                  required: true,
                  message: "Please select Due Date!",
                },
              ]}
            >
              <DateComponent placeholder="Select Due Date" />
            </Form.Item>
          ) : (
            <Form.Item
              label=""
              name="termsOfPayment"
              rules={[
                {
                  required: true,
                  message: "Please select Terms of Payment!",
                },
              ]}
            >
              <SelectComponent
                key={
                  documentDate ? documentDate.format("YYYY-MM-DD") : "no-date"
                }
                placeholder="Select Terms of Payment"
                onChange={handleTermsOfPaymentChange}
              >
                {dataListTermOfPayment?.map((term) => (
                  <Select.Option key={term.id} value={term.description}>
                    {formatTermsOfPaymentOption(term)}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          )}

          <Form.Item
            label="Adjustment Reason"
            name="adjustmentReason"
            rules={[
              {
                required: true,
                message: "Please input Adjustment Reason!",
              },
            ]}
          >
            <InputComponent
              placeholder="Enter Adjustment Reason"
              maxLength={200}
            />
          </Form.Item>
        </div>

        <Form.Item label="Remark" name="remark">
          <InputComponent
            type="textarea"
            rows={3}
            placeholder="Enter Remark"
            maxLength={255}
          />
        </Form.Item>
      </CardContainer>

      {/* Invoice Information Section */}
      {dataInvoiceDetail && (
        <CardContainer subHeader={"INVOICE INFORMATION"}>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <p className="text-gray-500 text-xs">Invoice Number</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.invoiceNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Billing Code</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.billingCode || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Invoice Date</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.invoiceDate || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Terms of Payment</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.termOfPayment || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Billing Cycle</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.billingCycle || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Billing Period</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.billingPeriodName || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Amount IDR</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.totalAmountIdr
                  ? currencyFormatting(dataInvoiceDetail.totalAmountIdr)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Amount USD</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.totalAmountUsd || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Amount EQV IDR</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.totalAmountEqvIdr
                  ? currencyFormatting(dataInvoiceDetail.totalAmountEqvIdr)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Amount EQV USD</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.totalAmountEqvUsd || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Currency</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.currency || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Withholding Tax</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.withHoldingTax || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Tax Basis IDR</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.taxBasicIdr || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Tax Basis USD</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.taxBasicUsd || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">VAT IDR</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.vatIdr || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">VAT USD</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.vatUsd || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Rate</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.rate || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Rate Type</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.rateType || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Rate Date</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.rateDate || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Status Payment GW</p>
              <p className="font-medium text-sm">
                {dataInvoiceDetail.statusPaymentGw === "PAID" ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    Paid
                  </span>
                ) : dataInvoiceDetail.statusPaymentGw === "OPEN" ? (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    Open
                  </span>
                ) : (
                  dataInvoiceDetail.statusPaymentGw || "-"
                )}
              </p>
            </div>
          </div>
        </CardContainer>
      )}
    </>
  );
};

export default AdjustmentInvoiceSectionForm;
