import React, { useMemo, useState } from "react";
import { Form, Tabs } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import { NxFormFooter, NxFormStepper } from "../../../../components/Nx/NxFormStepNavigation";
import CardContainer from "../../../../components/CardContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import DateComponent from "../../../../components/DateComponent";
import SelectComponent from "../../../../components/SelectComponent";
import InputComponent from "../../../../components/InputComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";

const CURRENCY_OPTIONS = [
  { label: "IDR", value: "IDR" },
  { label: "USD", value: "USD" },
];

const INITIAL_SEARCH_ROWS = [
  { key: 1, no: 1, customerNumber: "CUS001", customerName: "PLN (PERSERO), PT", accountNumber: "130252597", accountName: "PLN (PERSERO), PT", accountGroupType: "Industrial", expiredAmount: "5.000.000,00" },
  { key: 2, no: 2, customerNumber: "CUS002", customerName: "PLN (PERSERO), PT", accountNumber: "130252597", accountName: "PLN (PERSERO), PT", accountGroupType: "Industrial", expiredAmount: "5.000.000,00" },
  { key: 3, no: 3, customerNumber: "CUS003", customerName: "PT. JAYA MOTOR", accountNumber: "31668828", accountName: "PATIMURA (RESTAURAN SEDERHANA), CV", accountGroupType: "Commercial", expiredAmount: "5.000.000,00" },
  { key: 4, no: 4, customerNumber: "CUS004", customerName: "PT. JAYA MOTOR", accountNumber: "31668828", accountName: "PATIMURA (RESTAURAN SEDERHANA), CV", accountGroupType: "Commercial", expiredAmount: "5.000.000,00" },
  { key: 5, no: 5, customerNumber: "CUS005", customerName: "KAO INDONESIA, PT", accountNumber: "206971", accountName: "BLESSING INDONESIA JAYA PT", accountGroupType: "Industrial", expiredAmount: "5.000.000,00" },
  { key: 6, no: 6, customerNumber: "CUS006", customerName: "KAO INDONESIA, PT", accountNumber: "11009950", accountName: "PT. JAYA MOTOR", accountGroupType: "Commercial", expiredAmount: "5.000.000,00" },
  { key: 7, no: 7, customerNumber: "CUS007", customerName: "SAMPOERNA LAND, PT", accountNumber: "130252577", accountName: "KAO INDONESIA, PT", accountGroupType: "Industrial", expiredAmount: "5.000.000,00" },
  { key: 8, no: 8, customerNumber: "CUS008", customerName: "SAMPOERNA LAND, PT", accountNumber: "22514869", accountName: "TUNAS BARU LAMPUNG PT", accountGroupType: "Industrial", expiredAmount: "5.000.000,00" },
  { key: 9, no: 9, customerNumber: "CUS009", customerName: "BHIRAWA STEEL PT", accountNumber: "21533206", accountName: "ANUGRAH ARTACITRA SEMESTA", accountGroupType: "Commercial", expiredAmount: "5.000.000,00" },
  { key: 10, no: 10, customerNumber: "CUS010", customerName: "BHIRAWA STEEL PT", accountNumber: "110025881", accountName: "HUME SAKTI INDONESIA, PT", accountGroupType: "Industrial", expiredAmount: "5.000.000,00" },
];

const APPROVAL_ROWS = [
  { key: 1, no: 1, approver: "Approver 1", role: "Supervisor", status: "Waiting Approval" },
  { key: 2, no: 2, approver: "Approver 2", role: "Manager", status: "Pending" },
];

const ATTACHMENT_ROWS = [
  { key: 1, no: 1, fileName: "expired-gas-deposit.xlsx", uploadedBy: "maker", uploadDate: "16 Apr 2026" },
];

const parseAmount = (amount = "") => {
  if (!amount) return 0;
  const normalized = String(amount).replaceAll(".", "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatAmount = (amount = 0) => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
};

const ExpiredGasDepositeSummary = ({ values, selectedRows }) => {
  const infoItems = [
    {
      label: "Expired Date",
      value: values.expiredDate?.format ? values.expiredDate.format("DD MMM YYYY") : "{value}",
    },
    { label: "Currency", value: values.currency || "{value}" },
    { label: "Total Amount", value: values.totalAmount || "{value}" },
    { label: "Description", value: values.description || "{value}", fullWidth: true },
  ];

  const infoColumns = [
    { key: "no", title: "NO", dataIndex: "no", width: 20, align: "center" },
    { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 80 },
    { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 120 },
    { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 80 },
    { key: "accountName", title: "ACCOUNT NAME", dataIndex: "accountName", width: 140 },
    { key: "accountGroupType", title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", width: 80 },
    { key: "expiredAmount", title: "EXPIRED AMOUNT", dataIndex: "expiredAmount", width: 70, align: "right" },
  ];

  return (
    <div className="space-y-4">
      <CardContainer header={<p className="mt-[15px] text-primary">EXPIRED GAS DEPOSIT INFORMATION</p>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 text-[12px]">
          {infoItems.map((item) => (
            <div key={item.label} className={item.fullWidth ? "md:col-span-3" : ""}>
              <p className="mb-1 font-semibold text-[#4B465C]">{item.label}</p>
              <p className="text-[#4B465C]">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContainer>

      <CardContainer header={<p className="mt-[15px] text-primary">GAS DEPOSIT INFORMATION</p>}>
        <TableRBI
          idTable="rc-expired-gd-confirm-info-table"
          dataSource={selectedRows}
          columns={infoColumns}
          totalData={selectedRows.length}
          tableScrolled={{ x: 1800, y: 300 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
        />
      </CardContainer>
    </div>
  );
};

ExpiredGasDepositeSummary.propTypes = {
  values: PropTypes.shape({
    expiredDate: PropTypes.shape({ format: PropTypes.func }),
    currency: PropTypes.string,
    totalAmount: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const PayGasDepositeExpiredCreatePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [searchRows, setSearchRows] = useState(INITIAL_SEARCH_ROWS);
  const [selectedSearchRowKey, setSelectedSearchRowKey] = useState(INITIAL_SEARCH_ROWS[0].key);
  const [selectedDepositRows, setSelectedDepositRows] = useState([]);

  const routes = [
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW, breadcrumbName: "Gas Deposite" },
    { path: "", breadcrumbName: "Create Expired Gas Deposite" },
  ];

  const steps = [
    { title: "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  const selectedSearchRow = useMemo(
    () => searchRows.find((row) => row.key === selectedSearchRowKey) || null,
    [searchRows, selectedSearchRowKey],
  );

  const selectedTotalAmount = useMemo(
    () => formatAmount(selectedDepositRows.reduce((sum, row) => sum + parseAmount(row.expiredAmount), 0)),
    [selectedDepositRows],
  );

  const handleExpiredAmountChange = (recordKey, nextValue) => {
    setSearchRows((prev) =>
      prev.map((row) =>
        row.key === recordKey ? { ...row, expiredAmount: nextValue } : row,
      ),
    );
  };

  const searchColumns = useMemo(
    () => [
      { key: "no", title: "NO", dataIndex: "no", width: 30, align: "center" },
      { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 100 },
      { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 150 },
      { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 100 },
      { key: "accountName", title: "ACCOUNT NAME", dataIndex: "accountName", width: 180 },
      {
        key: "expiredAmount",
        title: "EXPIRED AMOUNT",
        dataIndex: "expiredAmount",
        width: 120,
        render: (_, record) => (
          <InputComponent
            value={record.expiredAmount}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => handleExpiredAmountChange(record.key, event.target.value)}
            placeholder="Input Amount"
          />
        ),
      },
      {
        key: "totalExpiredAmount",
        title: "TOTAL EXPIRED AMOUNT",
        dataIndex: "expiredAmount",
        width: 120,
        render: (text) => (
          <InputComponent
            value={text}
            disabled
            placeholder="0"
          />
        ),
      },
    ],
    [],
  );

  const infoColumns = useMemo(
    () => [
      { key: "no", title: "NO", dataIndex: "no", width: 20, align: "center" },
      { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 80 },
      { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 120 },
      { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 80 },
      { key: "accountName", title: "ACCOUNT NAME", dataIndex: "accountName", width: 140 },
      { key: "accountGroupType", title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", width: 80 },
    ],
    [],
  );

  const approvalColumns = useMemo(
    () => [
      { key: "no", title: "NO", dataIndex: "no", width: 20, align: "center" },
      { key: "approver", title: "APPROVER", dataIndex: "approver", width: 100 },
      { key: "role", title: "ROLE", dataIndex: "role", width: 80 },
      { key: "status", title: "STATUS", dataIndex: "status", width: 100 },
    ],
    [],
  );

  const attachmentColumns = useMemo(
    () => [
      { key: "no", title: "NO", dataIndex: "no", width: 20, align: "center" },
      { key: "fileName", title: "FILE NAME", dataIndex: "fileName", width: 150 },
      { key: "uploadedBy", title: "UPLOADED BY", dataIndex: "uploadedBy", width: 80 },
      { key: "uploadDate", title: "UPLOAD DATE", dataIndex: "uploadDate", width: 80 },
    ],
    [],
  );

  const confirmationItems = [
    {
      key: "expiredGasDeposit",
      label: "Expired Gas Deposite",
      children: (
        <ExpiredGasDepositeSummary
          values={form.getFieldsValue()}
          selectedRows={selectedDepositRows}
        />
      ),
    },
    {
      key: "approval",
      label: "Approval",
      children: (
        <CardContainer header={<p className="mt-[15px] text-primary">APPROVAL INFORMATION</p>}>
          <TableRBI
            idTable="rc-expired-gd-confirm-approval-table"
            dataSource={APPROVAL_ROWS}
            columns={approvalColumns}
            totalData={APPROVAL_ROWS.length}
            tableScrolled={{ x: 1000, y: 250 }}
            showExport={false}
            usePagination={false}
          />
        </CardContainer>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <CardContainer header={<p className="mt-[15px] text-primary">ATTACHMENT</p>}>
          <TableRBI
            idTable="rc-expired-gd-confirm-attachment-table"
            dataSource={ATTACHMENT_ROWS}
            columns={attachmentColumns}
            totalData={ATTACHMENT_ROWS.length}
            tableScrolled={{ x: 1000, y: 250 }}
            showExport={false}
            usePagination={false}
          />
        </CardContainer>
      ),
    },
  ];

  const handleOpenSearch = async () => {
    await form.validateFields(["expiredDate", "currency"]);
    setIsSearchModalOpen(true);
  };

  const handleConfirmSearch = () => {
    if (!selectedSearchRow) return;

    setSelectedDepositRows([{ ...selectedSearchRow, no: 1 }]);
    form.setFieldsValue({ totalAmount: selectedSearchRow.expiredAmount });
    setIsSearchModalOpen(false);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      await form.validateFields(["expiredDate", "currency", "description"]);
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleSubmit = async () => {
    await form.validateFields();
    setIsConfirmationModalOpen(true);
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedDepositRows([]);
    setSearchRows(INITIAL_SEARCH_ROWS);
    setSelectedSearchRowKey(INITIAL_SEARCH_ROWS[0].key);
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

      <Form form={form} layout="vertical" initialValues={{ currency: "IDR" }}>
        {currentStep === 0 && (
          <>
            <CardContainer
              header={<p className="mt-[15px] text-primary">EXPIRED GAS DEPOSIT INFORMATION</p>}
              className="mt-2"
            >
              <div className="mb-3 flex justify-end">
                <ButtonComponent type="submit" border={false} onClick={handleOpenSearch}>
                  Search Gas Deposite
                </ButtonComponent>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Form.Item
                  name="expiredDate"
                  label="Expired Date"
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                >
                  <DateComponent placeholder="Select Expired Date" />
                </Form.Item>

                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                >
                  <SelectComponent placeholder="Select Currency" options={CURRENCY_OPTIONS} />
                </Form.Item>

                <Form.Item
                  name="totalAmount"
                  label="Total Amount"
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputComponent disabled placeholder={selectedTotalAmount || "0,00"} />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                  className="md:col-span-3"
                >
                  <InputComponent type="textarea" rows={3} placeholder="Type..." />
                </Form.Item>
              </div>
            </CardContainer>

            <CardContainer
              header={<p className="mt-[15px] text-primary">GAS DEPOSIT INFORMATION</p>}
              className="mt-2"
            >
              <TableRBI
                idTable="rc-expired-gd-info-table"
                dataSource={selectedDepositRows}
                columns={infoColumns}
                totalData={selectedDepositRows.length}
                tableScrolled={{ x: 1800, y: 420 }}
                showExport={false}
                usePagination={false}
                showRefresh={false}
              />
            </CardContainer>
          </>
        )}

        {currentStep === 1 && (
          <CardContainer
            header={<p className="mt-[15px] text-primary">APPROVAL INFORMATION</p>}
            className="mt-2"
          >
            <TableRBI
              idTable="rc-expired-gd-approval-table"
              dataSource={APPROVAL_ROWS}
              columns={approvalColumns}
              totalData={APPROVAL_ROWS.length}
              tableScrolled={{ x: 1000, y: 420 }}
              showExport={false}
              usePagination={false}
            />
          </CardContainer>
        )}

        {currentStep === 2 && (
          <CardContainer
            header={<p className="mt-[15px] text-primary">ATTACHMENT</p>}
            className="mt-2"
          >
            <TableRBI
              idTable="rc-expired-gd-attachment-table"
              dataSource={ATTACHMENT_ROWS}
              columns={attachmentColumns}
              totalData={ATTACHMENT_ROWS.length}
              tableScrolled={{ x: 1000, y: 420 }}
              showExport={false}
              usePagination={false}
            />
          </CardContainer>
        )}

        <NxFormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          onNext={handleNext}
          onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW)}
          onClear={handleReset}
          onSaveDraft={() => {}}
          onSubmit={handleSubmit}
        />
      </Form>

      {/* Modal Search Gas Deposite */}
      <ModalCustom
        isOpen={isSearchModalOpen}
        handleCancel={() => setIsSearchModalOpen(false)}
        header="SEARCH GAS DEPOSITE"
        width={1200}
        footer={
          <div className="flex justify-end gap-2 px-2">
            <ButtonComponent key="cancel" className="!w-auto !px-6" onClick={() => setIsSearchModalOpen(false)}>
              cancel
            </ButtonComponent>
            <ButtonComponent key="confirm" type="primary" border={false} className="!w-auto !px-6" onClick={handleConfirmSearch}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <CardContainer className="!mt-0">
          <TableRBI
            idTable="rc-expired-gd-search-table"
            dataSource={searchRows}
            columns={searchColumns}
            totalData={searchRows.length}
            tableScrolled={{ x: 1200, y: 360 }}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={true}
            hasMore={false}
            fixedColumns={{ left: [], right: ["expiredAmount", "totalExpiredAmount"] }}
            enableRowClick={true}
            selectedRowKey={selectedSearchRowKey}
            onRowClick={(record) => setSelectedSearchRowKey(record.key)}
          />
        </CardContainer>
      </ModalCustom>

      {/* Modal Confirmation */}
      <ModalCustom
        isOpen={isConfirmationModalOpen}
        handleCancel={() => setIsConfirmationModalOpen(false)}
        header="CONFIRMATION"
        type="confirmation"
        width={1200}
        hidePadding={{ top: true }}
        footer={[
          <ButtonComponent key="cancel" onClick={() => setIsConfirmationModalOpen(false)}>
            cancel
          </ButtonComponent>,
          <ButtonComponent key="confirm" type="primary" border={false} onClick={() => setIsConfirmationModalOpen(false)}>
            Confirm
          </ButtonComponent>,
        ]}
      >
        <Tabs items={confirmationItems} className="[&_.ant-tabs-nav]:mb-4" />
      </ModalCustom>
    </>
  );
};

export default PayGasDepositeExpiredCreatePage;
