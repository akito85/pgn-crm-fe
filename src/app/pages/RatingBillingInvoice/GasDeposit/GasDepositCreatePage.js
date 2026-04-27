import React, { useMemo, useState, useEffect } from "react";
import { Form, DatePicker, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import { NxFormStepper, NxFormFooter } from "../../../../components/Nx/NxFormStepNavigation";
import CardContainer from "../../../../components/CardContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import SelectComponent from "../../../../components/SelectComponent";
import InputComponent from "../../../../components/InputComponent";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../constants/configApp";
import ModalCreateMutationDetail from "./Modal/ModalCreateMutationDetail";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { getConfigFileRBIData } from "../../../../redux/slices/attachmentSlice";
import {
  getAllApprovalList,
  getListApprovalById,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import { showModalError } from "../../../../redux/slices/general_slice";
import {
  getAccountOptions,
  getPeriodOptions,
  getUomOptions,
  getTimeUnitOptions,
  getTypeOptions,
  createMutationSummary,
  getCategoryListGasDeposit,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";
import { uploadAttachments } from "../../../../utils/uploadHelper";

const toNumericOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value).replace(/,/g, "").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const pickNumeric = (...candidates) => {
  for (const value of candidates) {
    const numeric = toNumericOrNull(value);
    if (numeric !== null) return numeric;
  }
  return null;
};

const GasDepositCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalCreateMutationOpen, setIsModalCreateMutationOpen] = useState(false);
  const [mutationRows, setMutationRows] = useState([]);
  const [editingMutationIndex, setEditingMutationIndex] = useState(null);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const isUpdateMode =
    location.pathname === RBI_ROUTES.GAS_DEPOSIT_UPDATE ||
    location.state?.mode === "update";
  const selectedData = useMemo(() => location.state?.selectedData ?? null, [location.state]);

  const {
    data_account_options: accountOptionsData,
    data_period_options: periodOptions,
    data_uom_options: uomOptions,
    data_time_unit_options: timeUnitOptions,
    data_type_options: typeOptions,
    loading_account_options: loadingAccountOptions,
  } = useSelector((state) => state.gasDepositRbi);

  const { data_approval, data_approval_list } = useSelector((state) => state.billing);

  // Approval state
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [boolApproval, setBoolApproval] = useState(false);

  // Attachment state
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [accountSearch, setAccountSearch] = useState("");
  const accountPageInfo = accountOptionsData?.page || {};
  const accountList = accountOptionsData?.result || [];
  const ACCOUNT_PAGE_SIZE = 20;

  const SOURCE_OPTIONS = [
    { label: "Billing", value: "Billing" },
    { label: "Manual", value: "Manual" },
  ];

  // Account options derived from account master source
  const accountNumberOptions = useMemo(
    () => {
      const seen = new Set();
      return accountList
        .filter((item) => item?.accountNumber && !seen.has(item.accountNumber) && seen.add(item.accountNumber))
        .map((item) => ({ label: item.accountNumber, value: item.accountNumber }));
    },
    [accountList],
  );

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.GAS_DEPOSIT_VIEW, breadcrumbName: "Gas Deposit" },
    { path: "", breadcrumbName: isUpdateMode ? "Update Gas Deposit" : "Create Gas Deposit" },
  ];

  const steps = [
    { title: isUpdateMode ? "UPDATE" : "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
  ];

  useEffect(() => {
    dispatch(getPeriodOptions());
    dispatch(getUomOptions());
    dispatch(getTimeUnitOptions());
    dispatch(getTypeOptions());
    dispatch(getAllApprovalList());
    dispatch(getConfigFileRBIData());
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        getAccountOptions({
          page: 1,
          pageSize: ACCOUNT_PAGE_SIZE,
          search: accountSearch,
          isLoadMore: false,
        }),
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, accountSearch]);

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
    setSelectedAccountData(selectedData);
  }, [form, isUpdateMode, selectedData]);

  // Map approval hierarchy list to options
  useEffect(() => {
    if (data_approval && data_approval.length > 0) {
      setAppHierOptions(data_approval.map((item) => ({ name: item.approvalName, value: item.appHierId })));
    } else {
      setAppHierOptions([]);
    }
  }, [data_approval]);

  // Map approval hierarchy detail to table data
  useEffect(() => {
    if (boolApproval && data_approval_list && data_approval_list.length > 0) {
      setAppHierDataDetail(
        data_approval_list.map((a, index) => ({
          ...a,
          key: index + 1,
          employeeDetail: (a.employeeDetail || []).map((b, i) => ({ ...b, key: i + 1 })),
        }))
      );
    }
  }, [data_approval_list, boolApproval]);

  const handleSelectHierarchy = (value) => {
    setSelectedHierarchy(value);
    form.setFieldsValue({ apphierId: value });
    dispatch(getListApprovalById(value));
    setBoolApproval(true);
  };

  useEffect(() => {
    if (mutationRows) {
      const totalAmount = mutationRows.reduce((acc, curr) => {
        return acc + (Number(curr.amount) || 0);
      }, 0);
      form.setFieldsValue({ amount: totalAmount });
    }
  }, [mutationRows, form]);

  const mutationColumns = useMemo(
    () => [
      { key: "no", title: "NO", dataIndex: "no", width: 20, align: "center" },
      { key: "billingPeriod", title: "BILLING PERIOD", dataIndex: "billingPeriod", width: 80, align: "center" },
      { key: "mutationDate", title: "MUTATION DATE", dataIndex: "mutationDate", width: 80, align: "center" },
      { key: "mutationType", title: "MUTATION TYPE", dataIndex: "mutationType", width: 100 },
      { key: "category", title: "CATEGORY", dataIndex: "category", width: 100 },
      { key: "uom", title: "UOM", dataIndex: "uom", width: 60, align: "center" },
      { key: "quantity", title: "QUANTITY", dataIndex: "quantity", width: 80, align: "right" },
      { key: "price", title: "PRICE", dataIndex: "price", width: 100, align: "right" },
      { key: "amount", title: "AMOUNT", dataIndex: "amount", width: 100, align: "right" },
      { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 150 },
      {
        key: "action",
        title: "ACTION",
        width: 100,
        align: "center",
        fixed: "right",
        render: (_, __, idx) => (
          <div className="flex items-center justify-center gap-2">
            <SVGIcon
              name="IconEdit"
              width={18}
              color="#0075bf"
              onClick={() => {
                setEditingMutationIndex(idx);
                setIsModalCreateMutationOpen(true);
              }}
            />
            <SVGIcon
              name="IconDelete"
              width={18}
              color="#ef4444"
              onClick={() => setMutationRows((prev) => prev.filter((_, i) => i !== idx))}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const handleAccountNumberChange = (value) => {
    const selected = accountList.filter(Boolean).find((item) => item.accountNumber === value);
    setSelectedAccountData(selected || null);
    const resolvedReceiptBalance = pickNumeric(
      selected?.balanceVolume,
      selected?.cashBalance,
      selected?.balance,
      selected?.currentPeriodVolume,
    );

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
      termsEarn: selected?.termsEarn || "",
      termsRedeem: selected?.termsRedeem || "",
      timeUnit: selected?.timeUnit || "",
      uom: selected?.uom || "",
      receiptBalance: resolvedReceiptBalance ?? "",
    });
  };

  const handleAccountPopupScroll = (event) => {
    const target = event?.target;
    if (!target || loadingAccountOptions) return;

    const isAtBottom =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 8;
    const currentPage = Number(accountPageInfo?.currentPage || 1);
    const totalPages = Number(accountPageInfo?.totalPages || 1);

    if (isAtBottom && currentPage < totalPages) {
      dispatch(
        getAccountOptions({
          page: currentPage + 1,
          pageSize: ACCOUNT_PAGE_SIZE,
          search: accountSearch,
          isLoadMore: true,
        }),
      );
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        // Only validate fields that the user can actually interact with
        await form.validateFields([
          "accountNumber",
          "periodEarn",
          "periodStartRedeem",
          "periodEndRedeem",
          "period",
          "timeUnit",
          "uom",
          "type",
          "source",
          "description",
        ]);
      } catch {
        return;
      }
    }
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const accountList = accountOptionsData || [];
      const account = selectedAccountData ||
        accountList.filter(Boolean).find((item) => item.accountNumber === values.accountNumber) ||
        selectedData;
      const totalMutationQuantity = mutationRows.reduce((acc, row) => acc + (Number(row?.quantity) || 0), 0);
      const resolvedBalanceVolume = pickNumeric(
        values.receiptBalance,
        account?.balanceVolume,
        account?.cashBalance,
        account?.balance,
        account?.currentPeriodVolume,
        totalMutationQuantity,
      );

      if (!account?.accountId) {
        dispatch(
          showModalError({
            title: "Failed",
            description: "Account ID tidak ditemukan. Silakan pilih ulang Account Number.",
          }),
        );
        return;
      }

      if (resolvedBalanceVolume === null) {
        dispatch(
          showModalError({
            title: "Failed",
            description: "Balance volume kosong. Silakan cek data account/balance terlebih dahulu.",
          }),
        );
        return;
      }

      const body = {
        id: isUpdateMode ? (selectedData?.id || selectedData?.gasDepositId) : undefined,
        accountId: account?.accountId,
        apphierId: values.apphierId,
        balanceVolume: resolvedBalanceVolume,
        balanceAmount: values.amount,
        currency: values.currency || account?.currency || selectedData?.currency || "IDR",
        uom: values.uom,
        schemeStartDate: values.periodEarn?.[0]?.format ? values.periodEarn[0].format("YYYY-MM-DD") : undefined,
        schemeEndDate: values.periodEarn?.[1]?.format ? values.periodEarn[1].format("YYYY-MM-DD") : account?.earnEndDate,
        redeemStartDate: values.periodStartRedeem?.format ? values.periodStartRedeem.format("YYYY-MM-DD") : undefined,
        redeemEndDate: values.periodEndRedeem?.format ? values.periodEndRedeem.format("YYYY-MM-DD") : undefined,
        termsEarn: values.termsEarn ? Number(values.termsEarn) : undefined,
        termsRedeem: values.termsRedeem ? Number(values.termsRedeem) : undefined,
        timeUnit: values.timeUnit,
        source: values.source,
        actionType: isUpdateMode ? "UPDATE" : "CREATE",
        description: values.description,
        sapCustId: account?.sapCustId == null ? undefined : String(account.sapCustId),
        attachments: [],
        gasDepositMutationDetailDtos: mutationRows.map(row => ({
          billPeriode: row.billingPeriod,
          mutationDate: row.mutationDate,
          transType: row.mutationType,
          source: "MANUAL",
          mutationType: row.mutationType,
          category: row.category,
          uom: row.uom,
          volumeAmount: row.quantity,
          price: row.price,
          amountValue: row.amount,
          description: row.description,
        })),
      };

      dispatch(createMutationSummary(body)).then(async (res) => {
        if (!res.error) {
          const idGasDeposit =
            res.payload?.data?.stgSumId ||
            res.payload?.data?.id ||
            res.payload?.id ||
            res.payload?.gasDepositId;

          if (listDataAttachment.length > 0 && idGasDeposit) {
            await uploadAttachments(
              listDataAttachment,
              idGasDeposit,
              "GAS_DEPOSIT_SUMMARY",
              (formData) =>
                ratingBillingHttpService.uploadAttachment(
                  `/v1/dbs/api/attachment/upload/v1`,
                  formData,
                  () => {},
                ),
            );
          }
          navigate(RBI_ROUTES.GAS_DEPOSIT_VIEW);
        }
      });
    });
  };

  return (
    <>
      <style>{`
        .black-text-disabled .ant-input[disabled],
        .black-text-disabled .ant-select-disabled .ant-select-selection-item {
          color: rgba(0, 0, 0, 0.85) !important;
          -webkit-text-fill-color: rgba(0, 0, 0, 0.85) !important;
        }
        .black-text-disabled .ant-input[disabled]::placeholder {
          color: rgba(0, 0, 0, 0.25) !important;
          -webkit-text-fill-color: rgba(0, 0, 0, 0.25) !important;
        }
        .black-text-disabled .ant-select-disabled .ant-select-selection-placeholder {
          color: rgba(0, 0, 0, 0.25) !important;
          -webkit-text-fill-color: rgba(0, 0, 0, 0.25) !important;
        }
      `}</style>
      <NxBreadCrumb routes={routes} />

      <NxFormStepper
        steps={steps}
        current={currentStep}
        onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
        onNext={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
      />

      <Form form={form} layout="vertical" initialValues={{ amount: 0, type: "Adjustment" }} className="black-text-disabled">

        {/* ========== STEP 1: CREATE FORM ========== */}
        <div className={currentStep !== 0 ? "hidden" : ""}>
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
                options={accountNumberOptions}
                onPopupScroll={handleAccountPopupScroll}
                onSearch={setAccountSearch}
                onClear={() => setAccountSearch("")}
                filterOption={false}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    {loadingAccountOptions && (
                      <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                        <Spin size="small" />
                        <span>Loading more account...</span>
                      </div>
                    )}
                  </>
                )}
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
            <Form.Item name="termsEarn" label="Terms Earn" style={{ marginBottom: 0 }}>
              <InputComponent disabled={!isUpdateMode} placeholder="Select Terms Earn" />
            </Form.Item>
            <Form.Item name="termsRedeem" label="Terms Redeem" style={{ marginBottom: 0 }}>
              <InputComponent disabled={!isUpdateMode} placeholder="Select Terms Redeem" />
            </Form.Item>
            <Form.Item name="periodEarn" label="Period Earn" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <DatePicker.RangePicker className="w-full" picker="month" format="MMM YY" placeholder={["Start Date", "End Date"]} />
            </Form.Item>
            <Form.Item name="periodStartRedeem" label="Period Start Redeem" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <DatePicker className="w-full" placeholder="Select Period Start Redeem" />
            </Form.Item>
            <Form.Item name="periodEndRedeem" label="Period End Redeem" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <DatePicker className="w-full" placeholder="Select Period End Redeem" />
            </Form.Item>
            <Form.Item name="period" label="Period" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Period" options={periodOptions} />
            </Form.Item>
            <Form.Item name="timeUnit" label="Time Unit" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Time Unit" options={timeUnitOptions} />
            </Form.Item>
            <Form.Item name="uom" label="UOM" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select UOM" options={uomOptions} />
            </Form.Item>
            <Form.Item name="amount" label="Amount" style={{ marginBottom: 0 }}>
              <InputComponent disabled={true} placeholder="Input Amount" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <SelectComponent placeholder="Select Type" options={[
                { label: "Billing", value: "Billing" },
                { label: "Adjustment", value: "Adjustment" },
              ]} />
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
              <InputComponent type="textarea" rows={2} placeholder="Input Description" />
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
              idTable="create-gd-mutation-table"
              dataSource={mutationRows}
              columns={mutationColumns}
              totalData={mutationRows.length}
              tableScrolled={{ x: 1200, y: 300 }}
              showExport={false}
              usePagination={false}
            />
          </div>
        </CardContainer>
        </div>{/* end step 0 */}

        {/* ========== STEP 2: APPROVAL ========== */}
        <div className={`${currentStep !== 1 ? "hidden" : ""}`}>
          <CardContainer subHeader="Approval Information">
            <ApprovalComponentGeneral
              type="create"
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              updateSelectedHierarchy={handleSelectHierarchy}
            />
          </CardContainer>
        </div>

        {/* ========== STEP 3: ATTACHMENT ========== */}
        <div className={`${currentStep !== 2 ? "hidden" : ""}`}>
          <CardContainer subHeader="Attachment Information">
            <AttachmentComponent
              type="create"
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
              getAPICategory={getCategoryListGasDeposit}
              typeSelector="gasDepositRbi"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
              getAPIGuard={getConfigFileRBIData}
              typeRBI="data"
              mandatory={true}
            />
          </CardContainer>
        </div>

        <NxFormFooter
          current={currentStep}
          totalSteps={steps.length}
          onPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          onNext={handleNext}
          onCancel={() => navigate(RBI_ROUTES.GAS_DEPOSIT_VIEW)}
          onClear={() => form.resetFields()}
          onSaveDraft={() => {}}
          onSubmit={handleSubmit}
        />
      </Form>

      <ModalCreateMutationDetail
        isOpen={isModalCreateMutationOpen}
        withApprovalAndAttachment={false}
        handleCancel={() => {
          setIsModalCreateMutationOpen(false);
          setEditingMutationIndex(null);
        }}
        accountNumber={selectedAccountData?.accountNumber || form.getFieldValue('accountNumber')}
        handleRefresh={(values) => {
          if (!values) return;
          const mutationDateValue = values.mutationDate?.format
            ? values.mutationDate.format("YYYY-MM-DD")
            : values.mutationDate || "";
          const nextRow = {
            source: values.source || "MANUAL",
            billingPeriod: values.billingPeriod || "",
            mutationDate: mutationDateValue,
            mutationType: values.mutationType || "",
            category: values.category || "",
            uom: values.uom || "",
            quantity: values.quantity || "",
            price: values.price || "",
            amount: values.amount || "",
            description: values.description || "",
          };

          setMutationRows((prev) => {
            if (editingMutationIndex !== null) {
              return prev.map((item, index) =>
                index === editingMutationIndex
                  ? { ...item, ...nextRow, key: item.key, no: item.no }
                  : item,
              );
            }

            return [
              ...prev,
              {
                ...nextRow,
                key: prev.length + 1,
                no: prev.length + 1,
              },
            ];
          });
          setEditingMutationIndex(null);
        }}
        initialValues={
          editingMutationIndex !== null
            ? {
                ...mutationRows[editingMutationIndex],
                mutationDate: mutationRows[editingMutationIndex]?.mutationDate
                  ? moment(mutationRows[editingMutationIndex].mutationDate)
                  : null,
              }
            : null
        }
        submitLabel={editingMutationIndex !== null ? "Update" : "Submit"}
        modalTitle={editingMutationIndex !== null ? "Edit Mutation Detail" : "Create Mutation Detail"}
        selectedData={{}}
      />
    </>
  );
};

export default GasDepositCreatePage;
