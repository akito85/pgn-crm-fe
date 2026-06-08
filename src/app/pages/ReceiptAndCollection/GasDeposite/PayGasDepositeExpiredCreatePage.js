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
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import { configApp } from "../../../../constants/configApp";
import DateComponent from "../../../../components/DateComponent";
import SelectComponent from "../../../../components/SelectComponent";
import InputComponent from "../../../../components/InputComponent";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import {
  getAllApprovalList,
  getListApprovalById,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import { getCurrencyDDL } from "../../../../redux/slices/receipt_collection/receipt";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import {
  createPayGasDepositExpiredBatch,
  getListCategory,
  getPayGasDepositExpiredSourceList,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";

const PAYMENT_GAS_DEPOSIT_MUTATION_CATEGORY = "PAYMENT_GAS_DEPOSIT_MUTATION";

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

const toMonthKey = (value) => {
  const dateKey = toDateKey(value);
  return dateKey ? dateKey.slice(0, 7) : null;
};

const toNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-GB");
};

const renderText = (value) => value || "-";

const renderDisabledAmountInput = (value, placeholder = "0,00") => (
  <InputComponent
    value={formatNumber(value)}
    disabled
    placeholder={placeholder}
  />
);

const extractRequestErrorMessage = (error, fallbackMessage) => (
  error?.message
  || error?.description
  || error?.data?.message
  || error?.response?.data?.message
  || fallbackMessage
);

const uploadExpiredAttachments = async (attachments = [], referenceIds = []) => {
  const pendingAttachments = attachments.filter(
    (item) => item?.dataType !== "exist" && item?.file,
  );

  if (!pendingAttachments.length || !referenceIds.length) {
    return;
  }

  await Promise.all(
    referenceIds.flatMap((referenceId) => pendingAttachments.map((item) => {
      const formData = new FormData();
      formData.append("files", item.file);
      formData.append("fileCategoryId", item.fileCategoryId);
      formData.append("referensiId", referenceId);

      return receiptCollectionHttpService.uploadAttachment(
        "/v1/dbs/api/pay-gas-deposit/upload-attachment",
        formData,
        () => {},
      );
    })),
  );
};

const PayGasDepositeExpiredCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data_expired_source, loading_expired_source } = useSelector((state) => state.gasDepositPayment);
  const { currencyDDL } = useSelector((state) => state.receipt);
  const { data_approval, data_approval_list } = useSelector((state) => state.billing);

  const [currentStep, setCurrentStep] = useState(0);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedSearchRowKeys, setSelectedSearchRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchRows, setSearchRows] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [boolApproval, setBoolApproval] = useState(false);
  const [fixedSearchColumns] = useState(() => ({
    left: ["no"],
    right: ["balance", "billingAmountBalance", "remainingClaimableAmount"],
  }));
  const [fixedSelectedColumns] = useState(() => ({
    left: ["no"],
    right: ["expiredInitialAmount", "claimAmount", "claimEqvAmount"],
  }));
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
    dispatch(getAllApprovalList());
  }, [dispatch]);

  useEffect(() => {
    if (data_approval && data_approval.length > 0) {
      setAppHierOptions(data_approval.map((item) => ({
        name: item.approvalName,
        value: item.appHierId,
      })));
      return;
    }

    setAppHierOptions([]);
  }, [data_approval]);

  useEffect(() => {
    if (boolApproval && data_approval_list && data_approval_list.length > 0) {
      setAppHierDataDetail(
        data_approval_list.map((item, index) => ({
          ...item,
          key: index + 1,
          employeeDetail: (item.employeeDetail || []).map((employee, employeeIndex) => ({
            ...employee,
            key: employeeIndex + 1,
          })),
        })),
      );
      return;
    }

    setAppHierDataDetail([]);
  }, [boolApproval, data_approval_list]);

  const currencyOptions = useMemo(
    () => (currencyDDL?.data || []).map((item) => ({ label: item.name, value: item.name })),
    [currencyDDL],
  );

  const queueRows = useMemo(
    () => (data_expired_source || []).map((item, index) => ({
      ...item,
      key: item.rbiGasDepId || item.payGasDepId || item.gasDepositId || `expired-source-${index + 1}`,
      no: index + 1,
      claimAmount: item.claimAmount ?? item.remainingClaimableAmount,
      claimEqvAmount: item.claimEqvAmount ?? item.remainingClaimableEqvAmount,
    })),
    [data_expired_source],
  );

  useEffect(() => {
    setSearchRows(queueRows);
  }, [queueRows]);

  const selectedTableRows = useMemo(
    () => selectedRows.map((item, index) => ({
      ...item,
      no: index + 1,
    })),
    [selectedRows],
  );

  const filteredQueueRows = useMemo(() => {
    const expiredMonthKey = toMonthKey(selectedExpiredDate);

    return searchRows.filter((row) => {
      const rowMonthKey = toMonthKey(row.expiredDate);
      const isCurrencyMatch = selectedCurrency ? row.currency === selectedCurrency : true;
      const isDateMatch = expiredMonthKey ? rowMonthKey === expiredMonthKey : true;
      return isCurrencyMatch && isDateMatch;
    });
  }, [searchRows, selectedCurrency, selectedExpiredDate]);

  const openSearchModal = async () => {
    try {
      await form.validateFields(["expiredDate", "currency"]);
    } catch {
      return;
    }

    const expiredDateParam = toDateKey(selectedExpiredDate);
    dispatch(getPayGasDepositExpiredSourceList({
      expiredDate: expiredDateParam,
      currency: selectedCurrency,
    }));
    setSelectedSearchRowKeys(selectedRows.map((item) => item.rbiLedgerId || item.key));
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
      .map((row) => ({ ...row }));
    setSelectedRows(nextRows);
    recalculateTotals(nextRows);

    setIsSearchModalOpen(false);
  };

  const handleSearchRowAmountChange = useCallback((targetRow, field, value) => {
    const numericValue = Number(value || 0);

    setSearchRows((prevRows) => prevRows.map((row) => {
      if (row.key !== targetRow.key) return row;

      const maxClaim = Number(row.remainingClaimableAmount || 0);
      const safeClaimAmount = Math.min(Math.max(numericValue, 0), maxClaim);
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
    }));
  }, []);

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

  const handleSelectHierarchy = (value) => {
    setSelectedHierarchy(value);
    form.setFieldsValue({ apphierId: value });
    dispatch(getListApprovalById(value));
    setBoolApproval(true);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      await form.validateFields(["expiredDate", "currency", "description"]);
      if (!selectedRows.length) {
        message.warning("Please select at least one gas deposit row");
        return;
      }
    }

    if (currentStep === 1 && !selectedHierarchy) {
      message.warning("Please select approval hierarchy");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentStep(0);
    setSelectedRows([]);
    setSelectedSearchRowKeys([]);
    setListDataAttachment([]);
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setBoolApproval(false);
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      await form.validateFields(["expiredDate", "currency", "description"]);

      if (!selectedHierarchy) {
        message.warning("Please select approval hierarchy");
        return;
      }

      const entries = selectedRows
        .map((row) => ({
          accountId: row.accountId,
          payGasDepId: row.payGasDepId,
          rbiGasDepId: row.rbiGasDepId || row.gasDepositId,
          rbiLedgerId: row.rbiLedgerId,
          billingPeriod: row.billingPeriod,
          claimAmount: toNumericValue(row.claimAmount),
          claimEqvAmount: toNumericValue(row.claimEqvAmount),
          currency: row.currency || form.getFieldValue("currency"),
          description: form.getFieldValue("description"),
        }))
        .filter((row) => row.claimAmount > 0);

      if (!entries.length) {
        message.warning("Please input at least one claim amount greater than 0");
        return;
      }

      if (!listDataAttachment.length) {
        message.warning("Please upload at least one attachment before submitting");
        return;
      }

      const expiredDateValue = form.getFieldValue("expiredDate");
      const payload = {
        apphier_id: form.getFieldValue("apphierId") ?? selectedHierarchy,
        expiredDate: expiredDateValue?.format ? expiredDateValue.format("YYYY-MM-DD") : toDateKey(expiredDateValue),
        description: form.getFieldValue("description"),
        entries,
      };

      const response = await dispatch(createPayGasDepositExpiredBatch(payload)).unwrap();
      const responseData = response?.data || response || {};
      const payLedgerIds = Array.isArray(responseData?.payLedgerIds) ? responseData.payLedgerIds : [];

      await uploadExpiredAttachments(listDataAttachment, payLedgerIds);

      message.success("Expired gas deposit created successfully");
      navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_EXPIRED_APPROVAL);
    } catch (error) {
      message.error(extractRequestErrorMessage(error, "Failed to create expired gas deposit"));
    } finally {
      setLoadingSubmit(false);
    }
  };

  const searchColumns = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 90, align: "center" },
    { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 90, render: renderText },
    { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 90, render: renderText },
    { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 90, render: renderText },
    { key: "accountName", title: "ACCOUNT NAME", dataIndex: "accountName", width: 90, render: renderText },
    { key: "accountGroupType", title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", width: 90, render: renderText },
    { key: "sor", title: "SOR", dataIndex: "sor", width: 90, render: renderText },
    { key: "costCenter", title: "COST CENTER", dataIndex: "costCenter", width: 90, render: renderText },
    { key: "accountSegment", title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", width: 90, render: renderText },
    { key: "meterReadingCode", title: "METER READING CODE", dataIndex: "meterReadingCode", width: 90, render: renderText },
    { key: "documentNumber", title: "DOCUMENT NUMBER", dataIndex: "documentNumber", width: 90, render: renderText },
    { key: "source", title: "SOURCE", dataIndex: "source", width: 90, render: renderText },
    { key: "paymentDate", title: "PAYMENT DATE", dataIndex: "paymentDate", width: 90, render: formatDate },
    { key: "currency", title: "CURRENCY", dataIndex: "currency", width: 90, render: renderText },
    { key: "bank", title: "BANK", dataIndex: "bank", width: 90, render: renderText },
    {
      key: "balance",
      title: "BALANCE AMOUNT",
      dataIndex: "balance",
      width: 90,
      render: (value) => renderDisabledAmountInput(value),
    },
    { key: "rateType", title: "RATE TYPE", dataIndex: "rateType", width: 90, render: renderText },
    { key: "rateDate", title: "RATE DATE", dataIndex: "rateDate", width: 90, render: formatDate },
    { key: "rate", title: "RATE", dataIndex: "rate", width: 90, render: renderText },
    { key: "eqvBalance", title: "EQV BALANCE", dataIndex: "eqvBalance", width: 90, render: renderText },
    { key: "billingPeriod", title: "BILLING PERIOD", dataIndex: "billingPeriod", width: 90, render: renderText },
    { key: "billingCurrency", title: "BILLING CURRENCY", dataIndex: "billingCurrency", width: 90, render: renderText },
    {
      key: "billingAmountBalance",
      title: "BALANCE BILLING AMOUNT",
      dataIndex: "billingAmountBalance",
      width: 90,
      render: (value) => renderDisabledAmountInput(value),
    },
    { key: "accountType", title: "ACCOUNT TYPE", dataIndex: "accountType", width: 90, render: renderText },
    { key: "classificationType", title: "CLASSIFICATION TYPE", dataIndex: "classificationType", width: 90, render: renderText },
    { key: "sapCustId", title: "SAP CUST ID", dataIndex: "sapCustId", width: 90, render: renderText },
    { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 90, render: renderText },
    {
      key: "remainingClaimableAmount",
      title: "BALANCE AMOUNT EXPIRED",
      dataIndex: "claimAmount",
      width: 90,
      render: (value, row) => (
        <InputComponent
          value={value}
          onChange={(event) => handleSearchRowAmountChange(row, "claimAmount", event?.target?.value)}
          placeholder="0,00"
        />
      ),
    },
  ], [handleSearchRowAmountChange]);

  const selectedColumns = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 90, align: "center" },
    { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 90, render: renderText },
    { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 90, render: renderText },
    { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 90, render: renderText },
    { key: "accountName", title: "ACCOUNT NAME", dataIndex: "accountName", width: 90, render: renderText },
    { key: "accountGroupType", title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", width: 90, render: renderText },
    { key: "sor", title: "SOR", dataIndex: "sor", width: 90, render: renderText },
    { key: "costCenter", title: "COST CENTER", dataIndex: "costCenter", width: 90, render: renderText },
    { key: "accountSegment", title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", width: 90, render: renderText },
    { key: "meterReadingCode", title: "METER READING CODE", dataIndex: "meterReadingCode", width: 90, render: renderText },
    { key: "documentNumber", title: "DOCUMENT NUMBER", dataIndex: "documentNumber", width: 90, render: renderText },
    { key: "source", title: "SOURCE", dataIndex: "source", width: 90, render: renderText },
    { key: "paymentDate", title: "PAYMENT DATE", dataIndex: "paymentDate", width: 90, render: formatDate },
    { key: "currency", title: "CURRENCY", dataIndex: "currency", width: 90, render: renderText },
    { key: "bank", title: "BANK", dataIndex: "bank", width: 90, render: renderText },
    {
      key: "expiredInitialAmount",
      title: "BALANCE AMOUNT",
      dataIndex: "expiredInitialAmount",
      width: 90,
      render: (value) => renderDisabledAmountInput(value),
    },
    { key: "rateType", title: "RATE TYPE", dataIndex: "rateType", width: 90, render: renderText },
    { key: "rateDate", title: "RATE DATE", dataIndex: "rateDate", width: 90, render: formatDate },
    { key: "rate", title: "RATE", dataIndex: "rate", width: 90, render: renderText },
    { key: "eqvBalance", title: "EQV BALANCE", dataIndex: "eqvBalance", width: 90, render: renderText },
    { key: "billingPeriod", title: "BILLING PERIOD", dataIndex: "billingPeriod", width: 90, render: renderText },
    { key: "billingCurrency", title: "BILLING CURRENCY", dataIndex: "billingCurrency", width: 90, render: renderText },
    {
      key: "claimEqvAmount",
      title: "BALANCE BILLING AMOUNT",
      dataIndex: "remainingClaimableEqvAmount",
      width: 90,
      render: (value) => renderDisabledAmountInput(value),
    },
    { key: "accountType", title: "ACCOUNT TYPE", dataIndex: "accountType", width: 90, render: renderText },
    { key: "classificationType", title: "CLASSIFICATION TYPE", dataIndex: "classificationType", width: 90, render: renderText },
    { key: "sapCustId", title: "SAP CUST ID", dataIndex: "sapCustId", width: 90, render: renderText },
    { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 90, render: renderText },
    {
      key: "claimAmount",
      title: "BALANCE AMOUNT EXPIRED",
      dataIndex: "claimAmount",
      width: 90,
      render: (value, row) => (
        <InputComponent
          value={value}
          onChange={(event) => handleClaimAmountChange(row, event?.target?.value)}
          placeholder="0,00"
        />
      ),
    },
  ], [handleClaimAmountChange]);

  const processedSearchColumns = useMemo(
    () => applyFixedColumns(searchColumns, fixedSearchColumns),
    [fixedSearchColumns, searchColumns],
  );

  const processedSelectedColumns = useMemo(
    () => applyFixedColumns(selectedColumns, fixedSelectedColumns),
    [fixedSelectedColumns, selectedColumns],
  );

  const searchColumnDefinitions = useMemo(
    () => searchColumns.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [searchColumns],
  );

  const selectedColumnDefinitions = useMemo(
    () => selectedColumns.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [selectedColumns],
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
                  >
                    Search Gas Deposit
                  </ButtonComponent>
                </div>
              )}
              className="mt-2"
            >
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <Form.Item
                  name="expiredDate"
                  label="Expired Date"
                  rules={[{ required: true, message: "Expired Date is required" }]}
                  style={{ marginBottom: 0 }}
                >
                  <DateComponent placeholder="Select Expired Date" dateDisable={() => false} />
                </Form.Item>
                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true, message: "Currency is required" }]}
                  style={{ marginBottom: 0 }}
                >
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
                  rules={[{ required: true, message: "Description is required" }]}
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
                columns={processedSelectedColumns}
                columnDefinitions={selectedColumnDefinitions}
                fixedColumns={fixedSelectedColumns}
                totalData={selectedTableRows.length}
                tableScrolled={{ x: 1150, y: 350 }}
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
            <ApprovalComponentGeneral
              type="create"
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              updateSelectedHierarchy={handleSelectHierarchy}
            />
          </CardContainer>
        )}

        {currentStep === 2 && (
          <CardContainer
            header={<p className="mt-[15px] text-primary">ATTACHMENT</p>}
            className="mt-2"
          >
            <AttachmentComponent
              type="create"
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
              getAPICategory={getListCategory}
              typeSelector="gasDepositPayment"
              uploadCategory={PAYMENT_GAS_DEPOSIT_MUTATION_CATEGORY}
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
              typeRBI="data"
              mandatory={true}
            />
          </CardContainer>
        )}

        <NxFormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW)}
          onClear={handleReset}
          onSaveDraft={() => {}}
          onSubmit={handleSubmit}
          loading={loadingSubmit}
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
            columns={processedSearchColumns}
            columnDefinitions={searchColumnDefinitions}
            fixedColumns={fixedSearchColumns}
            totalData={filteredQueueRows.length}
            tableScrolled={{ x: 3200, y: 350 }}
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
