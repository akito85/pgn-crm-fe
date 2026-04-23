import React, { useMemo, useState, useEffect } from "react";
import { Form } from "antd";
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
import ModalCreateMutationDetail from "../../RatingBillingInvoice/GasDeposit/Modal/ModalCreateMutationDetail";

const ACCOUNT_OPTIONS = [
  {
    accountNumber: "130252597",
    accountName: "PLN (PERSERO), PT",
    customerNumber: "CUS001",
    customerName: "PLN (PERSERO), PT",
    accountGroupType: "Industrial",
    sor: "SOR-001",
    costCenter: "CC-1001",
    accountSegment: "Segment A",
    meterReadingCode: "MRC-001",
    accountType: "Prepaid",
    classificationType: "Type A",
    sapCustId: "SAP-000001",
  },
  {
    accountNumber: "11009950",
    accountName: "PT. JAYA MOTOR",
    customerNumber: "CUS006",
    customerName: "KAO INDONESIA, PT",
    accountGroupType: "Commercial",
    sor: "SOR-002",
    costCenter: "CC-2002",
    accountSegment: "Segment B",
    meterReadingCode: "MRC-007",
    accountType: "Postpaid",
    classificationType: "Type B",
    sapCustId: "SAP-000006",
  },
];

const INITIAL_MUTATION_ROWS = [
  { key: 1, no: 1, documentNumber: "{value}", source: "Billing", billingPeriod: "JAN 26", mutationDate: "{value}" },
  { key: 2, no: 2, documentNumber: "{value}", source: "Billing", billingPeriod: "JUL 26", mutationDate: "{value}" },
  { key: 3, no: 3, documentNumber: "{value}", source: "Billing", billingPeriod: "AUG 26", mutationDate: "{value}" },
];

const PERIOD_OPTIONS = [
  { label: "Jan 26", value: "JAN26" },
  { label: "Feb 26", value: "FEB26" },
  { label: "Mar 26", value: "MAR26" },
];

const TIME_UNIT_OPTIONS = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
];

const UOM_OPTIONS = [
  { label: "MMBTU", value: "MMBTU" },
  { label: "MSCF", value: "MSCF" },
];

const TYPE_OPTIONS = [
  { label: "Credit", value: "CREDIT" },
  { label: "Debit", value: "DEBIT" },
];

const SOURCE_OPTIONS = [
  { label: "Billing", value: "BILLING" },
  { label: "Rating", value: "RATING" },
  { label: "Manual", value: "MANUAL" },
];

const PayGasDepositeCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalCreateMutationOpen, setIsModalCreateMutationOpen] = useState(false);
  const [mutationRows, setMutationRows] = useState(INITIAL_MUTATION_ROWS);
  const isUpdateMode =
    location.pathname === RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_UPDATE ||
    location.state?.mode === "update";
  const selectedData = useMemo(() => location.state?.selectedData ?? null, [location.state]);

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
    if (!isUpdateMode || !selectedData) return;

    form.setFieldsValue({
      accountNumber: selectedData.accountNumber,
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
      termsEarn: selectedData.termsEarn,
      termsRedeem: selectedData.termsRedeem,
      periodEarn: selectedData.periodEarn,
      periodStartRedeem: selectedData.periodRedeemStart,
      periodEndRedeem: selectedData.periodRedeemEnd,
      period: selectedData.period,
      timeUnit: selectedData.timeUnit,
      uom: selectedData.uom,
      amount: selectedData.amount,
      receiptBalance: selectedData.cashBalance ?? selectedData.receiptBalance,
      type: selectedData.type,
      source: selectedData.source,
      description: selectedData.description,
    });
  }, [form, isUpdateMode, selectedData]);

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
    const selected = ACCOUNT_OPTIONS.find((item) => item.accountNumber === value);

    form.setFieldsValue({
      accountNumber: value,
      accountName: selected?.accountName || "",
      customerNumber: selected?.customerNumber || "",
      customerName: selected?.customerName || "",
      accountGroupType: selected?.accountGroupType || "",
      sor: selected?.sor || "",
      costCenter: selected?.costCenter || "",
      accountSegment: selected?.accountSegment || "",
      meterReadingCode: selected?.meterReadingCode || "",
      accountType: selected?.accountType || "",
      classificationType: selected?.classificationType || "",
      sapCustId: selected?.sapCustId || "",
    });
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

      <Form form={form} layout="vertical">
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
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                placeholder="Select Account Number"
                onChange={handleAccountNumberChange}
                disabled={isUpdateMode}
                options={ACCOUNT_OPTIONS.map((item) => ({
                  label: item.accountNumber,
                  value: item.accountNumber,
                }))}
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
            <Form.Item name="accountType" label="Account Type" style={{ marginBottom: 0 }}>
              <InputComponent disabled placeholder="Select Account Type" />
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
            <Form.Item name="termsEarn" label="Terms Earn" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <InputComponent disabled={!isUpdateMode} placeholder="Select Terms Earn" />
            </Form.Item>
            <Form.Item name="termsRedeem" label="Terms Redeem" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <InputComponent disabled={!isUpdateMode} placeholder="Select Terms Redeem" />
            </Form.Item>
            <Form.Item name="period" label="Period" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Period" options={PERIOD_OPTIONS} />
            </Form.Item>
            <Form.Item name="periodEarn" label="Period Earn" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <DateComponent placeholder="Select Period Earn" dateDisable={() => false} />
            </Form.Item>
            <Form.Item name="periodStartRedeem" label="Period Start Redeem" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <DateComponent placeholder="Select Period Start Redeem" dateDisable={() => false} />
            </Form.Item>
            <Form.Item
              name="periodEndRedeem"
              label="Period End Redeem"
              rules={[
                { required: true },
                () => ({
                  validator(_, value) {
                    const startDate = form.getFieldValue("periodStartRedeem");
                    if (!value || !startDate || value >= startDate) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Period End Redeem cannot be earlier than Period Start Redeem"));
                  },
                }),
              ]}
              style={{ marginBottom: 0 }}
            >
              <DateComponent
                placeholder="Select Period End Redeem"
                dateDisable={(current) => {
                  const startDate = form.getFieldValue("periodStartRedeem");
                  return startDate ? current && current < startDate.startOf("day") : false;
                }}
              />
            </Form.Item>
            <Form.Item name="timeUnit" label="Time Unit" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Time Unit" options={TIME_UNIT_OPTIONS} />
            </Form.Item>
            <Form.Item name="uom" label="UOM" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select UOM" options={UOM_OPTIONS} />
            </Form.Item>
            <Form.Item name="amount" label="Amount" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <InputComponent disabled={!isUpdateMode} placeholder="Input Amount" />
            </Form.Item>
            <Form.Item name="receiptBalance" label="Receipt Balance" style={{ marginBottom: 0 }}>
              <InputComponent disabled={!isUpdateMode} placeholder="Input Receipt Balance" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Type" options={TYPE_OPTIONS} />
            </Form.Item>
            <Form.Item name="source" label="Source" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Input Source" options={SOURCE_OPTIONS} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
              className="lg:col-span-5"
            >
              <InputComponent type="textarea" rows={2} placeholder="{value}" />
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
          onSaveDraft={() => {}}
          onSubmit={() => {}}
        />
      </Form>

      <ModalCreateMutationDetail
        isOpen={isModalCreateMutationOpen}
        handleCancel={() => setIsModalCreateMutationOpen(false)}
        handleRefresh={(values) => {
          if (!values) return;
          const mutationDateValue = values.mutationDate?.format
            ? values.mutationDate.format("YYYY-MM-DD")
            : values.mutationDate || "{value}";

          setMutationRows((prev) => [
            ...prev,
            {
              key: prev.length + 1,
              no: prev.length + 1,
              documentNumber: values.documentNumber || "{value}",
              source: values.source || "Manual",
              billingPeriod: values.billingPeriod || "{value}",
              mutationDate: mutationDateValue,
            },
          ]);
        }}
        selectedData={{}}
      />
    </>
  );
};

export default PayGasDepositeCreatePage;
