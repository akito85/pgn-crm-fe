import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import { NxFormFooter, NxFormStepper } from "../../../../components/Nx/NxFormStepNavigation";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import DateComponent from "../../../../components/DateComponent";
import SelectComponent from "../../../../components/SelectComponent";
import InputComponent from "../../../../components/InputComponent";
import { getCurrencyDDL } from "../../../../redux/slices/receipt_collection/receipt";
import {
  getPayGasDepositExpiredSourceList,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
};

const toDateKey = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const PayGasDepositeExpiredCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data_expired_source, loading_expired_source } = useSelector((state) => state.gasDepositPayment);
  const { currencyDDL } = useSelector((state) => state.receipt);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedSearchRowKeys, setSelectedSearchRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedExpiredDate = Form.useWatch("expiredDate", form);
  const selectedCurrency = Form.useWatch("currency", form);

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

  useEffect(() => {
    dispatch(getCurrencyDDL());
  }, [dispatch]);

  const currencyOptions = useMemo(
    () => (currencyDDL?.data || []).map((item) => ({ label: item.name, value: item.name })),
    [currencyDDL],
  );

  const queueRows = useMemo(
    () => (data_expired_source || []).map((item, index) => ({
      ...item,
      key: item.rbiLedgerId,
      no: index + 1,
    })),
    [data_expired_source],
  );

  const selectedTableRows = useMemo(
    () => selectedRows.map((item, index) => ({
      ...item,
      no: index + 1,
    })),
    [selectedRows],
  );

  const filteredQueueRows = useMemo(() => {
    const expiredDateKey = toDateKey(selectedExpiredDate);

    return queueRows.filter((row) => {
      const rowDateKey = toDateKey(row.expiredDate);
      const isCurrencyMatch = selectedCurrency ? row.currency === selectedCurrency : true;
      const isDateMatch = expiredDateKey ? rowDateKey === expiredDateKey : true;
      return isCurrencyMatch && isDateMatch;
    });
  }, [queueRows, selectedCurrency, selectedExpiredDate]);

  const openSearchModal = async () => {
    await form.validateFields(["expiredDate", "currency"]);
    const expiredDateParam = toDateKey(selectedExpiredDate);
    dispatch(getPayGasDepositExpiredSourceList({
      expiredDate: expiredDateParam,
      currency: selectedCurrency,
    }));
    setSelectedSearchRowKeys(selectedRows.map((item) => item.rbiLedgerId || item.key));
    if (!filteredQueueRows.length) {
      message.info("No gas deposit data matches the selected expired date and currency");
    }
    setIsSearchModalOpen(true);
  };

  const recalculateTotals = useCallback((rows) => {
    form.setFieldsValue({
      totalAmount: formatNumber(rows.reduce((sum, row) => sum + Number(row.claimAmount || 0), 0)),
      totalAmountEqv: formatNumber(rows.reduce((sum, row) => sum + Number(row.claimEqvAmount || 0), 0)),
    });
  }, [form]);

  const handleConfirmSearch = () => {
    const nextRows = filteredQueueRows
      .filter((row) => selectedSearchRowKeys.includes(row.key))
      .map((row) => ({
        ...row,
        claimAmount: row.remainingClaimableAmount,
        claimEqvAmount: row.remainingClaimableEqvAmount,
      }));
    setSelectedRows(nextRows);
    recalculateTotals(nextRows);

    setIsSearchModalOpen(false);
  };

  const handleClaimAmountChange = useCallback((targetRow, value) => {
    const claimAmount = Number(value || 0);

    const nextRows = selectedRows.map((row) => {
      if (row.key !== targetRow.key) return row;

      const maxClaim = Number(row.remainingClaimableAmount || 0);
      const safeClaimAmount = Math.min(Math.max(claimAmount, 0), maxClaim);
      const baseAmount = Number(row.remainingClaimableAmount || 0);
      const baseEqvAmount = Number(row.remainingClaimableEqvAmount || 0);
      const claimEqvAmount = baseAmount > 0
        ? (safeClaimAmount / baseAmount) * baseEqvAmount
        : 0;

      return {
        ...row,
        claimAmount: safeClaimAmount,
        claimEqvAmount,
      };
    });

    setSelectedRows(nextRows);
    recalculateTotals(nextRows);
  }, [recalculateTotals, selectedRows]);

  const handleNext = async () => {
    if (currentStep === 0) {
      await form.validateFields(["expiredDate", "currency", "description"]);
      if (!selectedRows.length) {
        message.warning("Please select at least one gas deposit row");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const searchColumns = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 60, align: "center" },
    { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 180 },
    { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 220 },
    { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 180 },
    {
      key: "expiredInitialAmount",
      title: "EXPIRED INITIAL",
      dataIndex: "expiredInitialAmount",
      width: 170,
      align: "right",
      render: (value) => formatNumber(value),
    },
    {
      key: "claimedAmount",
      title: "ALREADY CLAIMED",
      dataIndex: "claimedAmount",
      width: 170,
      align: "right",
      render: (value) => formatNumber(value),
    },
    {
      key: "remainingClaimableAmount",
      title: "REMAINING CLAIMABLE",
      dataIndex: "remainingClaimableAmount",
      width: 190,
      align: "right",
      render: (value) => formatNumber(value),
    },
    { key: "currency", title: "CURRENCY", dataIndex: "currency", width: 100, render: (value) => value || "-" },
  ], []);

  const selectedColumns = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 60, align: "center" },
    { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 180 },
    { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 220 },
    { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 180 },
    {
      key: "expiredInitialAmount",
      title: "EXPIRED INITIAL",
      dataIndex: "expiredInitialAmount",
      width: 170,
      align: "right",
      render: (value) => formatNumber(value),
    },
    {
      key: "remainingClaimableAmount",
      title: "REMAINING CLAIMABLE",
      dataIndex: "remainingClaimableAmount",
      width: 190,
      align: "right",
      render: (value) => formatNumber(value),
    },
    {
      key: "claimAmount",
      title: "CLAIM AMOUNT",
      dataIndex: "claimAmount",
      width: 180,
      render: (value, row) => (
        <InputComponent
          value={value}
          onChange={(event) => handleClaimAmountChange(row, event?.target?.value)}
          placeholder="Input claim amount"
        />
      ),
    },
    {
      key: "claimEqvAmount",
      title: "CLAIM EQV",
      dataIndex: "claimEqvAmount",
      width: 170,
      align: "right",
      render: (value) => formatNumber(value),
    },
  ], [handleClaimAmountChange]);

  const confirmationRows = useMemo(
    () => [
      { label: "Expired Date", value: form.getFieldValue("expiredDate") || "-" },
      { label: "Currency", value: form.getFieldValue("currency") || "-" },
      { label: "Total Amount", value: form.getFieldValue("totalAmount") || "-" },
      { label: "Total Amount EQV", value: form.getFieldValue("totalAmountEqv") || "-" },
      { label: "Description", value: form.getFieldValue("description") || "-", fullWidth: true },
    ],
    [form],
  );

  return (
    <>
      <NxBreadCrumb routes={routes} />

      <NxFormStepper
        steps={steps}
        current={currentStep}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <Form form={form} layout="vertical">
        {currentStep === 0 && (
          <>
            <CardContainer
              header={(
                <div className="flex -my-4 justify-between items-center">
                  <p className="mt-[15px] text-primary">EXPIRED GAS DEPOSIT INFORMATION</p>
                  <ButtonComponent
                    type="submit"
                    border={false}
                    onClick={openSearchModal}
                    disabled={!selectedExpiredDate || !selectedCurrency}
                  >
                    Search Gas Deposit
                  </ButtonComponent>
                </div>
              )}
              className="mt-2"
            >
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <Form.Item name="expiredDate" label="Expired Date" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                  <DateComponent placeholder="Select Expired Date" dateDisable={() => false} />
                </Form.Item>
                <Form.Item name="currency" label="Currency" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                  <SelectComponent placeholder="Select Currency" options={currencyOptions} />
                </Form.Item>
                <Form.Item name="totalAmount" label="Total Amount" style={{ marginBottom: 0 }}>
                  <InputComponent disabled placeholder="0,00" />
                </Form.Item>
                <Form.Item name="totalAmountEqv" label="Total Amount EQV" style={{ marginBottom: 0 }}>
                  <InputComponent disabled placeholder="0,00" />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                  className="lg:col-span-4"
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
                idTable="rc-pay-gas-deposit-expired-selected-table"
                dataSource={selectedTableRows}
                columns={selectedColumns}
                totalData={selectedTableRows.length}
                tableScrolled={{ x: 1400, y: 350 }}
                showExport={false}
                usePagination={false}
              />
            </CardContainer>
          </>
        )}

        {currentStep === 1 && (
          <CardContainer
            header={<p className="mt-[15px] text-primary">APPROVAL INFORMATION</p>}
            className="mt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5 text-[12px]">
              {confirmationRows.map((item) => (
                <div key={item.label} className={item.fullWidth ? "md:col-span-4" : ""}>
                  <p className="mb-1 font-semibold text-[#4B465C]">{item.label}</p>
                  <p className="text-[#4B465C]">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <ButtonComponent
                type="submit"
                border={false}
                onClick={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_EXPIRED_APPROVAL)}
              >
                Open Approval Queue
              </ButtonComponent>
            </div>
          </CardContainer>
        )}

        {currentStep === 2 && (
          <CardContainer
            header={<p className="mt-[15px] text-primary">ATTACHMENT</p>}
            className="mt-2"
          >
            <div className="py-6 text-[14px] text-[#4B465C]">
              Attachment flow for Payment Expired Gas Deposit is not implemented yet.
            </div>
          </CardContainer>
        )}

        <NxFormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW)}
          onClear={() => {
            form.resetFields();
            setSelectedRows([]);
            setSelectedSearchRowKeys([]);
          }}
          onSaveDraft={() => {}}
          onSubmit={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_EXPIRED_APPROVAL)}
        />
      </Form>

      <ModalCustom
        isOpen={isSearchModalOpen}
        handleCancel={() => setIsSearchModalOpen(false)}
        header="SEARCH GAS DEPOSIT"
        width={1200}
      >
        <div className="pb-4">
          <TableRBI
            idTable="rc-pay-gas-deposit-expired-search-table"
            dataSource={filteredQueueRows}
            columns={searchColumns}
            totalData={filteredQueueRows.length}
            tableScrolled={{ x: 1400, y: 350 }}
            showExport={false}
            usePagination={false}
            loading={loading_expired_source}
            rowSelection={{
              selectedRowKeys: selectedSearchRowKeys,
              onChange: (nextKeys) => setSelectedSearchRowKeys(nextKeys),
            }}
          />
          <div className="mt-4 flex items-center justify-end gap-2">
            <ButtonComponent type="default" onClick={() => setIsSearchModalOpen(false)}>
              Cancel
            </ButtonComponent>
            <ButtonComponent type="submit" border={false} onClick={handleConfirmSearch}>
              Confirm
            </ButtonComponent>
          </div>
        </div>
      </ModalCustom>
    </>
  );
};

export default PayGasDepositeExpiredCreatePage;
