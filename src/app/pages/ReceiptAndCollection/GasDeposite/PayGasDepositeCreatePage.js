import React, { useMemo, useState, useEffect } from "react";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import { NxFormStepper, NxFormFooter } from "../../../../components/Nx/NxFormStepNavigation";
import CardContainer from "../../../../components/CardContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import SelectComponent from "../../../../components/SelectComponent";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import PayGasDepositeMutationDetailModal from "./Modal/PayGasDepositeMutationDetailModal";
import {
  getConvertedCurrency,
  getAccountNumberDDL,
  getAllAccountNumberDDL,
  getCurrencyDDL,
  getRateTypeDDL,
  resetDataAccountNumber,
} from "../../../../redux/slices/receipt_collection/receipt";
import { getPaymentPeriods } from "../../../../redux/slices/receipt_collection/paymentCycle";
import {
  getPayGasDepositMutationDetailPaginate,
  getPayGasDepositPaginate,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";

const selectRule = (label) => ([{ required: true, message: `Please select ${label}.` }]);
const inputRule = (label) => ([{ required: true, message: `Please enter ${label}.` }]);
const autoFillRule = (label, dependency) => ([{ required: true, message: `${label} will be filled automatically after ${dependency}.` }]);
const LOCAL_DRAFT_MUTATION_MESSAGE = "Mutation detail was added as a local draft only. It is not saved to the payment backend yet.";
const CREATE_SUBMIT_UNAVAILABLE_MESSAGE = "Payment Gas Deposit save and submit are not connected to a backend endpoint yet. Current changes stay local in this page.";

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const formatLabel = (item) => {
  const name = item?.name || "";
  const description = item?.description ? ` - ${item.description}` : "";
  return `${name}${description}`;
};

const PayGasDepositeCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const {
    data_converted_currency,
    currencyDDL,
    rateTypeDDL,
    dataAccNumber,
    dataAccountNumber,
  } = useSelector((state) => state.receipt);
  const { dataPaymentPeriods } = useSelector((state) => state.paymentCycle);
  const { data_list } = useSelector((state) => state.gasDepositPayment);
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalCreateMutationOpen, setIsModalCreateMutationOpen] = useState(false);
  const [mutationRows, setMutationRows] = useState([]);
  const [requestBodyConvertedRate, setRequestBodyConvertedRate] = useState({});
  const isUpdateMode =
    location.pathname === RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_UPDATE ||
    location.state?.mode === "update";
  const selectedData = useMemo(() => location.state?.selectedData ?? null, [location.state]);

  const accountList = dataAccNumber?.data || [];

  const accountNumberOptions = useMemo(() => {
    return accountList
      .filter((item) => item?.id !== undefined && item?.id !== null)
      .map((item) => ({ label: item?.name, value: item?.id }));
  }, [accountList]);

  const currencyOptions = useMemo(
    () => (currencyDDL?.data || []).map((item) => ({ label: item.name, value: item.id })),
    [currencyDDL],
  );

  const billingPeriodOptions = useMemo(
    () => (dataPaymentPeriods || []).map((item) => ({ label: item.periodName, value: item.id })),
    [dataPaymentPeriods],
  );

  const rateTypeOptions = useMemo(
    () => (rateTypeDDL?.data || []).map((item) => ({
      label: formatLabel(item),
      value: item.id,
    })),
    [rateTypeDDL],
  );

  const sourceOptions = useMemo(() => {
    const seen = new Set();
    return (data_list?.result || [])
      .map((item) => item?.source)
      .filter((item) => item && !seen.has(item) && seen.add(item))
      .map((item) => ({
        label: String(item)
          .toLowerCase()
          .replaceAll("_", " ")
          .replaceAll(/\b\w/g, (char) => char.toUpperCase()),
        value: item,
      }));
  }, [data_list]);

  const findCurrencyValue = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const matched = (currencyDDL?.data || []).find(
      (item) => item.id === value || normalizeText(item.name) === normalizeText(value),
    );
    return matched?.id ?? value;
  };

  const findRateTypeValue = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const matched = (rateTypeDDL?.data || []).find(
      (item) => item.id === value
        || normalizeText(item.name) === normalizeText(value)
        || normalizeText(item.description) === normalizeText(value),
    );
    return matched?.id ?? value;
  };

  const findBillingPeriodValue = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const matched = (dataPaymentPeriods || []).find(
      (item) => item.id === value || normalizeText(item.periodName) === normalizeText(value),
    );
    return matched?.id ?? value;
  };

  const formatDecimal = (value) => {
    if (value === null || value === undefined || value === "") return undefined;
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return undefined;

    return numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseNumericValue = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    if (typeof value === "number") return value;

    const normalizedValue = String(value)
      .replaceAll(" ", "")
      .replaceAll(",", "");
    const parsedValue = Number(normalizedValue);

    return Number.isNaN(parsedValue) ? 0 : parsedValue;
  };

  const routes = [
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW, breadcrumbName: "Gas Deposite" },
    { path: "", breadcrumbName: isUpdateMode ? "Update Gas Deposite" : "Create Gas Deposite" },
  ];

  const steps = [
    { title: isUpdateMode ? "UPDATE" : "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  useEffect(() => {
    dispatch(resetDataAccountNumber());
    dispatch(getAllAccountNumberDDL());
    dispatch(getCurrencyDDL());
    dispatch(getRateTypeDDL());
    dispatch(getPaymentPeriods());
    dispatch(getPayGasDepositPaginate({ page: 1, pageSize: 100, search: "", sort: "accountNumber~asc" }));
  }, [dispatch]);

  useEffect(() => {
    if (!isUpdateMode || !selectedData) return;

    form.setFieldsValue({
      accountNumber: selectedData.accountId ?? selectedData.accountNumber,
      accountName: selectedData.accountName,
      customerNumber: selectedData.customerNumber,
      customerName: selectedData.customerName,
      accountGroupType: selectedData.accountGroupType,
      sor: selectedData.sor,
      costCenter: selectedData.costCenter,
      accountSegment: selectedData.accountSegment,
      meterReadingCode: selectedData.meterReadingCode,
      accountType: selectedData.accountType,
      classificationType: selectedData.classificationType,
      sapCustId: selectedData.sapCustId,
      paymentDate: selectedData.paymentDate,
      currency: findCurrencyValue(selectedData.currency),
      balance: selectedData.balance ?? selectedData.balanceAmount,
      rateType: findRateTypeValue(selectedData.rateType),
      rateDate: selectedData.rateDate,
      rate: selectedData.rate,
      eqvBalance: selectedData.eqvBalance,
      billingPeriod: findBillingPeriodValue(selectedData.billingPeriod),
      billingCurrency: findCurrencyValue(selectedData.billingCurrency),
      source: selectedData.source,
      description: selectedData.description,
    });
  }, [
    currencyDDL,
    dataPaymentPeriods,
    form,
    isUpdateMode,
    rateTypeDDL,
    selectedData,
  ]);

  useEffect(() => {
    if (isUpdateMode || !dataAccountNumber?.data) return;

    form.setFieldsValue({
      customerNumber: dataAccountNumber?.data?.customerNumber || "",
      customerName: dataAccountNumber?.data?.customerName || "",
      accountName: dataAccountNumber?.data?.accountName || "",
      accountGroupType: dataAccountNumber?.data?.accountGroupType || "",
      accountType: dataAccountNumber?.data?.accountType || "",
      classificationType: dataAccountNumber?.data?.classificationType || "",
      sor: dataAccountNumber?.data?.sor || "",
      costCenter: dataAccountNumber?.data?.area || "",
      accountSegment: dataAccountNumber?.data?.segment || "",
      meterReadingCode: dataAccountNumber?.data?.meterReadingCode || "",
    });
  }, [dataAccountNumber, form, isUpdateMode]);

  useEffect(() => {
    if (!isUpdateMode || !selectedData) {
      setMutationRows([]);
      return;
    }

    const gasDepositId = selectedData.gasDepositId || selectedData.masterGasDepositId || selectedData.accountId;
    if (!gasDepositId) {
      setMutationRows([]);
      return;
    }

    dispatch(
      getPayGasDepositMutationDetailPaginate({
        gasDepositId,
        page: 1,
        pageSize: 100,
        search: "",
        sort: "mutationDate~desc",
      }),
    ).then((action) => {
      const mutationData = action.payload?.result || [];
      setMutationRows(
        mutationData.map((item, index) => ({
          key: item.id || item.stgMutId || `${item.documentNumber || "mutation"}-${index}`,
          no: index + 1,
          documentNumber: item.documentNumber || "-",
          source: item.source || "-",
          billingPeriod: item.billingPeriod || item.billPeriode || "-",
          mutationDate: item.mutationDate || "-",
        })),
      );
    });
  }, [dispatch, isUpdateMode, selectedData]);

  useEffect(() => {
    const { fromCurrency, toCurrency, rateType, rateDate } = requestBodyConvertedRate;

    if (!fromCurrency || !toCurrency || !rateType || !rateDate) {
      return;
    }

    if (fromCurrency === toCurrency) {
      return;
    }

    dispatch(getConvertedCurrency(requestBodyConvertedRate));
  }, [dispatch, requestBodyConvertedRate]);

  useEffect(() => {
    const formValues = form.getFieldsValue(["currency", "billingCurrency", "balance"]);
    const balanceValue = parseNumericValue(formValues.balance);
    const isSameCurrency = formValues.currency && formValues.currency === formValues.billingCurrency;

    if (isSameCurrency) {
      form.setFieldsValue({
        rate: formatDecimal(1),
        eqvBalance: formatDecimal(balanceValue),
      });
      return;
    }

    if (!data_converted_currency || !Object.keys(data_converted_currency).length) {
      return;
    }

    const convertedRate = Number(data_converted_currency?.convertedRate);
    if (Number.isNaN(convertedRate) || convertedRate <= 0) {
      return;
    }

    form.setFieldsValue({
      rate: formatDecimal(convertedRate),
      eqvBalance: formatDecimal(balanceValue * convertedRate),
    });
  }, [data_converted_currency, form]);

  const mutationColumns = useMemo(
    () => [
      { key: "no", title: "NO", dataIndex: "no", width: 20, align: "center" },
      { key: "documentNumber", title: "DOCUMENT NUMBER", dataIndex: "documentNumber", width: 80 },
      { key: "source", title: "SOURCE", dataIndex: "source", width: 70 },
      { key: "billingPeriod", title: "BILLING PERIOD", dataIndex: "billingPeriod", width: 70, align: "center" },
      { key: "mutationDate", title: "MUTATION DATE", dataIndex: "mutationDate", width: 70, align: "center" },
      {
        key: "action",
        title: "ACTION",
        width: 70,
        align: "center",
        render: () => (
          <div className="flex items-center justify-center gap-2">
            <SVGIcon name="IconUpdateAction" width={18} color="#0075bf" />
            <SVGIcon name="IconDelete" width={18} color="#ef4444" />
          </div>
        ),
      },
    ],
    [],
  );

  const handleAccountNumberChange = (value) => {
    const selected = accountList.find((item) => item.id === value);

    dispatch(getAccountNumberDDL(value));

    form.setFieldsValue({
      accountNumber: value,
      accountName: selected?.name?.split(" - ")?.[1] || selected?.name || "",
      customerNumber: selected?.customerId || "",
      customerName: selected?.customerName || "",
      sapCustId: "",
    });
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    if (changedValues.balance !== undefined && allValues.currency === allValues.billingCurrency) {
      form.setFieldsValue({
        rate: formatDecimal(1),
        eqvBalance: formatDecimal(parseNumericValue(allValues.balance)),
      });
    }

    if (
      changedValues.currency !== undefined
      || changedValues.billingCurrency !== undefined
      || changedValues.rateType !== undefined
      || changedValues.rateDate !== undefined
      || changedValues.balance !== undefined
    ) {
      if (!allValues.currency || !allValues.billingCurrency) {
        form.setFieldsValue({ rate: undefined, eqvBalance: undefined });
        setRequestBodyConvertedRate({});
        return;
      }

      if (allValues.currency === allValues.billingCurrency) {
        form.setFieldsValue({
          rate: formatDecimal(1),
          eqvBalance: formatDecimal(parseNumericValue(allValues.balance)),
        });
        setRequestBodyConvertedRate({});
        return;
      }

      if (!allValues.rateType || !allValues.rateDate) {
        form.setFieldsValue({ rate: undefined, eqvBalance: undefined });
        setRequestBodyConvertedRate({});
        return;
      }

      const formattedRateDate = allValues.rateDate?.format
        ? allValues.rateDate.format("YYYY-MM-DD")
        : allValues.rateDate;

      setRequestBodyConvertedRate({
        fromCurrency: allValues.currency,
        toCurrency: allValues.billingCurrency,
        rateType: allValues.rateType,
        rateDate: formattedRateDate,
      });
    }
  };

  return (
    <>
      <NxBreadCrumb routes={routes} />

      <NxFormStepper
        steps={steps}
        current={currentStep}
        onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
        onNext={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
      />

      <Form form={form} layout="vertical" onValuesChange={handleFormValuesChange}>
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">ACCOUNT INFORMATION</p>
            </div>
          }
          className="mt-2"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={selectRule("an account number")}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                placeholder="Select Account Number"
                onChange={handleAccountNumberChange}
                disabled={isUpdateMode}
                options={accountNumberOptions}
              />
            </Form.Item>
            <Form.Item name="accountName" label="Account Name" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Input Account Name" />
            </Form.Item>
            <Form.Item name="customerNumber" label="Customer Number" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Input Customer Number" />
            </Form.Item>
            <Form.Item name="customerName" label="Customer Name" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Input Customer Name" />
            </Form.Item>
            <Form.Item name="accountGroupType" label="Account Group Type" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Account Group Type" />
            </Form.Item>
            <Form.Item name="sor" label="SOR" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select SOR" />
            </Form.Item>
            <Form.Item name="costCenter" label="Cost Center" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Cost Center" />
            </Form.Item>
            <Form.Item name="accountSegment" label="Account Segment" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Account Segment" />
            </Form.Item>
            <Form.Item name="meterReadingCode" label="Meter Reading Code" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Meter Reading Code" />
            </Form.Item>
            <Form.Item name="accountType" label="Account Type" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Account Type" />
            </Form.Item>
            <Form.Item name="classificationType" label="Classification Type" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Classification Type" />
            </Form.Item>
            <Form.Item name="sapCustId" label="SAP CUST ID" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="SAP CUST ID" />
            </Form.Item>
          </div>
        </CardContainer>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">GAS DEPOSIT INFORMATION</p>
            </div>
          }
          className="mt-2"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <Form.Item name="source" label="Source" rules={selectRule("a source")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Input Source" options={sourceOptions} />
            </Form.Item>
            <Form.Item name="paymentDate" label="Payment Date" rules={selectRule("a payment date")} style={{ marginBottom: 0 }}>
              <DateComponent placeholder="Select Payment Date" dateDisable={() => false} />
            </Form.Item>
            <Form.Item name="currency" label="Currency" rules={selectRule("a currency")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Currency" options={currencyOptions} />
            </Form.Item>
            <Form.Item name="balance" label="Balance" rules={inputRule("a balance")} style={{ marginBottom: 0 }}>
              <InputComponent placeholder="Input Balance" />
            </Form.Item>
            <Form.Item name="rateType" label="Rate Type" rules={selectRule("a rate type")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Rate Type" options={rateTypeOptions} />
            </Form.Item>
            <Form.Item name="rateDate" label="Rate Date" rules={selectRule("a rate date")} style={{ marginBottom: 0 }}>
              <DateComponent placeholder="Select Rate Date" dateDisable={() => false} />
            </Form.Item>
            <Form.Item
              name="rate"
              label="Rate"
              rules={autoFillRule("Rate", "currency, billing currency, rate type, and rate date are completed")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled placeholder="Auto fill rate" />
            </Form.Item>
            <Form.Item
              name="eqvBalance"
              label="EQV Balance"
              rules={autoFillRule("EQV Balance", "balance and rate are available")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled placeholder="EQV Balance" />
            </Form.Item>
            <Form.Item name="billingPeriod" label="Billing Period" rules={selectRule("a billing period")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Billing Period" options={billingPeriodOptions} />
            </Form.Item>
            <Form.Item name="billingCurrency" label="Billing Currency" rules={selectRule("a billing currency")} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Billing Currency" options={currencyOptions} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={inputRule("a description")}
              style={{ marginBottom: 0 }}
              className="lg:col-span-5"
            >
              <InputComponent type="textarea" rows={2} placeholder="Type..." />
            </Form.Item>
          </div>
        </CardContainer>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">MUTATION INFORMATION</p>
            </div>
          }
          className="mt-2"
        >
          <div className="w-full">
            <div className="flex justify-end mb-3">
              <ButtonComponent
                icon={<SVGIcon name="IconButtonCreate" width={16} />}
                type="submit"
                border={false}
                onClick={() => setIsModalCreateMutationOpen(true)}
              >
                Create
              </ButtonComponent>
            </div>
            <TableRBI
              idTable="rc-create-gd-mutation-table"
              dataSource={mutationRows}
              columns={mutationColumns}
              totalData={mutationRows.length}
              tableScrolled={{ x: 1200, y: 300 }}
              showExport={false}
              usePagination={false}
            />
          </div>
        </CardContainer>

        <NxFormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          onNext={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
          onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW)}
          onClear={() => form.resetFields()}
          onSaveDraft={() => message.warning(CREATE_SUBMIT_UNAVAILABLE_MESSAGE)}
          onSubmit={() => message.warning(CREATE_SUBMIT_UNAVAILABLE_MESSAGE)}
        />
      </Form>

      <PayGasDepositeMutationDetailModal
        isOpen={isModalCreateMutationOpen}
        handleCancel={() => setIsModalCreateMutationOpen(false)}
        handleRefresh={(values) => {
          if (!values) return;
          const mutationDateValue = values.mutationDate?.format
            ? values.mutationDate.format("YYYY-MM-DD")
            : values.mutationDate || "-";
          const billingPeriodLabel = billingPeriodOptions.find((item) => item.value === values.period)?.label
            || values.period
            || "-";

          setMutationRows((prev) => [
            ...prev,
            {
              key: prev.length + 1,
              no: prev.length + 1,
              documentNumber: values.documentNumber || "-",
              source: values.source || "-",
              billingPeriod: billingPeriodLabel,
              mutationDate: mutationDateValue,
            },
          ]);
          message.info(LOCAL_DRAFT_MUTATION_MESSAGE);
        }}
        sourceOptions={sourceOptions}
        billingPeriodOptions={billingPeriodOptions}
        mutationContext={{
          rateType: rateTypeOptions.find((item) => item.value === form.getFieldValue("rateType"))?.label
            || form.getFieldValue("rateType"),
          rateDate: form.getFieldValue("rateDate"),
          rate: form.getFieldValue("rate"),
          source: form.getFieldValue("source"),
          billingPeriod: form.getFieldValue("billingPeriod"),
        }}
      />
    </>
  );
};

export default PayGasDepositeCreatePage;
